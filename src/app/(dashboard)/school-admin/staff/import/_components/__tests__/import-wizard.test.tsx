import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { makeStaff } from "@/test/factories/staff";
import { ImportWizard } from "../import-wizard";

const existing = [makeStaff({ id: "stf_001", email: "ben@school.test", employeeNumber: "EMP-001" })];

const CSV = [
  "First Name,Surname,E-mail,Mobile,Job Title,Category,Section,Start Date,Payer,Manager Email",
  "Ada,Lovelace,ada@school.test,,Teacher,Academic,Mathematics,01/09/2026,PTA,cy@school.test",
  "Ben,Okafor,ben@school.test,,Bursar,Support,Administration,15/08/2020,,ada@school.test",
  "Bad,Row,not-an-email,,Teacher,Academic,Science,31/02/2026,",
  "Cy,Ng,cy@school.test,,Teacher,Academic,Science,02/09/2026,,",
  "Musa,Abdullahi,,+2348031200031,Driver,Support,Transport,01/04/2019,,shifted@school.test",
  "Nobody,Reachable,,,Cleaner,Support,Facilities,01/04/2019,,",
  "Shifted,Row,shifted@school.test,,Teacher,Academic,Science,02/09/2026,,,overflow",
].join("\n");

function setup() {
  const onCommit = vi.fn().mockResolvedValue({ created: 3, updated: 1, failed: 0 });
  const user = userEvent.setup();
  render(<ImportWizard existingStaff={existing} today="2026-10-04" country="NG" onCommit={onCommit} />);
  return { onCommit, user };
}

async function pasteAndContinue(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("tab", { name: /paste/i }));
  await user.type(screen.getByRole("textbox", { name: /paste csv/i }), CSV);
  await user.click(screen.getByRole("button", { name: /continue/i }));
}

describe("ImportWizard", () => {
  it("starts on upload with a template download and a paste option", () => {
    setup();
    expect(screen.getByRole("heading", { name: /upload/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /download template/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/csv file/i)).toHaveAttribute("accept", ".csv,text/csv");
  });

  it("auto-maps columns and lets the user change one", async () => {
    const { user } = setup();
    await pasteAndContinue(user);
    expect(screen.getByRole("heading", { name: /map columns/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /map "surname"/i })).toHaveValue("last_name");
    expect(screen.getByRole("combobox", { name: /map "e-mail"/i })).toHaveValue("email");
    expect(screen.getByRole("combobox", { name: /map "mobile"/i })).toHaveValue("phone");
    expect(screen.getByRole("combobox", { name: /map "payer"/i })).toHaveValue("employer");
    expect(screen.getByRole("combobox", { name: /map "start date"/i })).toHaveValue("hire_date");
    await user.selectOptions(screen.getByRole("combobox", { name: /map "section"/i }), "department");
    expect(screen.getByRole("combobox", { name: /map "section"/i })).toHaveValue("department");
  });

  it("validates rows, shows counts and per-row errors, and commits only valid rows", async () => {
    const { user, onCommit } = setup();
    await pasteAndContinue(user);
    await user.selectOptions(screen.getByRole("combobox", { name: /map "section"/i }), "department");
    await user.click(screen.getByRole("button", { name: /validate/i }));

    expect(screen.getByRole("heading", { name: /review/i })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /ready to create/i })).toHaveTextContent("3");
    expect(screen.getByRole("group", { name: /will update/i })).toHaveTextContent("1");
    expect(screen.getByRole("group", { name: /errors/i })).toHaveTextContent("3");
    expect(screen.getByRole("row", { name: /more values than columns/i })).toHaveTextContent(/shifted@school.test/);
    expect(screen.getByRole("row", { name: /musa/i })).toHaveTextContent(/no staff member with email "shifted@school.test"/i);
    const badRow = screen.getByRole("row", { name: /not-an-email/i });
    expect(within(badRow).getByText(/valid email/i)).toBeInTheDocument();
    expect(within(badRow).getByText(/DD\/MM\/YYYY/)).toBeInTheDocument();
    const unreachable = screen.getByRole("row", { name: /nobody/i });
    expect(within(unreachable).getByText(/email or a phone/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /download 3 rows with errors/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /import 4 rows/i }));
    await waitFor(() => expect(onCommit).toHaveBeenCalledTimes(1));
    const [payload] = onCommit.mock.calls[0];
    expect(payload.create).toHaveLength(3);
    expect(payload.create[0].person).toMatchObject({ firstName: "Ada" });
    expect(payload.create[0].staff.email).toBe("ada@school.test");
    expect(payload.create[0].contract).toMatchObject({ startDate: "2026-09-01", employer: "pta" });
    expect(payload.create[0].contract.roles[0].department).toBe("Mathematics");
    const musa = payload.create.find((c: { person: { firstName: string } }) => c.person.firstName === "Musa")!;
    expect(musa.staff.email).toBeNull();
    expect(musa.person.phones[0].number).toBe("+2348031200031");
    // Ada's manager (Cy) and Ben's manager (Ada) are both created in this file; Musa's points at the invalid row, so no link.
    expect(payload.pendingManagerLinks).toEqual([
      { target: "create", index: 0, reportsToEmail: "cy@school.test" },
      { target: "update", index: 0, reportsToEmail: "ada@school.test" },
    ]);
    expect(payload.update).toHaveLength(1);
    expect(payload.update[0]).toMatchObject({ id: "stf_001" });
    expect(payload.update[0].input.staff.email).toBe("ben@school.test");
    expect(await screen.findByRole("heading", { name: /import complete/i })).toBeInTheDocument();
    expect(screen.getByText(/3 created/i)).toBeInTheDocument();
  });

  it("switches to create-only mode, which turns matches into errors", async () => {
    const { user } = setup();
    await pasteAndContinue(user);
    await user.selectOptions(screen.getByRole("combobox", { name: /map "section"/i }), "department");
    await user.click(screen.getByRole("button", { name: /validate/i }));
    await user.click(screen.getByRole("radio", { name: /create only/i }));
    expect(screen.getByRole("group", { name: /errors/i })).toHaveTextContent("4");
    expect(screen.getByRole("button", { name: /import 3 rows/i })).toBeInTheDocument();
  });

  it("shows parse notices on the map step and row warnings in the review", async () => {
    const { user } = setup();
    await pasteAndContinue(user);
    expect(screen.getByText(/^row 7 has more values.*will not import/i)).toBeInTheDocument();
    await user.selectOptions(screen.getByRole("combobox", { name: /map "section"/i }), "department");
    await user.click(screen.getByRole("button", { name: /validate/i }));
    expect(screen.getByRole("group", { name: /ready to create/i })).toHaveTextContent("3");
  });

  it("moves between the upload and paste tabs with the arrow keys", async () => {
    const { user } = setup();
    screen.getByRole("tab", { name: /upload file/i }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /paste/i })).toHaveFocus();
    expect(screen.getByRole("tab", { name: /paste/i })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toContainElement(screen.getByRole("textbox", { name: /paste csv/i }));
  });

  it("blocks validation while a required field is unmapped", async () => {
    const { user } = setup();
    await pasteAndContinue(user);
    expect(screen.getByRole("button", { name: /validate/i })).toBeDisabled();
    expect(screen.getByText(/department.*not mapped/i)).toBeInTheDocument();
  });
});

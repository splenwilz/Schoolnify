import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { makeStaffDetail } from "@/test/factories/staff";
import type { StaffCreateInput, StaffFormValues } from "@/lib/staff/schema";
import { StaffForm } from "../staff-form";

const managers = [{ id: "stf_005", name: "David Anderson" }];
const departments = ["Administration", "Mathematics", "Science"];

function setup(props: Partial<React.ComponentProps<typeof StaffForm>> = {}) {
  const onSubmit = vi.fn().mockResolvedValue(undefined);
  const onCancel = vi.fn();
  const user = userEvent.setup();
  render(<StaffForm mode="create" today="2026-10-04" country="NG" managers={managers} departments={departments} onSubmit={onSubmit} onCancel={onCancel} {...props} />);
  return { onSubmit, onCancel, user };
}

async function fillRequired(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/first name/i), "Ada");
  await user.type(screen.getByLabelText(/last name/i), "Lovelace");
  await user.type(screen.getByLabelText(/work email/i), "Ada@School.test");
  await user.type(screen.getByLabelText(/^designation/i), "Teacher");
  await user.type(screen.getByLabelText(/^department/i), "Mathematics");
  await user.type(screen.getByLabelText(/hire date/i), "2026-09-01");
}

describe("StaffForm", () => {
  it("renders the sections with accessible fields", () => {
    setup();
    for (const name of [/personal information/i, /contact information/i, /emergency contact/i, /^contract/i, /^job/i, /responsibilities/i, /access/i]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    expect(screen.getByLabelText(/first name/i)).toBeRequired();
    expect(screen.getByLabelText(/employee number/i)).toHaveAttribute("placeholder", expect.stringMatching(/auto-generated/i));
    const dept = screen.getByLabelText(/^department/i);
    expect(dept).toHaveAttribute("list");
    expect(document.getElementById(dept.getAttribute("list")!)?.querySelectorAll("option")).toHaveLength(3);
    expect(screen.queryByLabelText(/employment status/i)).not.toBeInTheDocument();
  });

  it("accepts a department that does not exist yet", async () => {
    const { user, onSubmit } = setup();
    await fillRequired(user);
    await user.clear(screen.getByLabelText(/^department/i));
    await user.type(screen.getByLabelText(/^department/i), "Robotics");
    await user.click(screen.getByRole("button", { name: /add staff member/i }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0].contract.roles[0].department).toBe("Robotics");
  });

  it("blocks submit, marks invalid fields and focuses the first one", async () => {
    const { user, onSubmit } = setup();
    await user.click(screen.getByRole("button", { name: /add staff member/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    const first = screen.getByLabelText(/first name/i);
    await waitFor(() => expect(first).toHaveAttribute("aria-invalid", "true"));
    expect(first).toHaveAccessibleDescription(/first name is required/i);
    expect(first).toHaveFocus();
    expect(screen.getByLabelText(/^phone/i)).toHaveAttribute("aria-invalid", "true"); // email or phone
    expect(screen.getAllByRole("alert").length).toBeGreaterThanOrEqual(4);
  });

  it("accepts a phone-only person and normalises the number", async () => {
    const { user, onSubmit } = setup();
    await fillRequired(user);
    await user.clear(screen.getByLabelText(/work email/i));
    await user.type(screen.getByLabelText(/^phone/i), "0803 123 4567");
    await user.click(screen.getByRole("button", { name: /add staff member/i }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const [input] = onSubmit.mock.calls[0];
    expect(input.staff.email).toBeNull();
    expect(input.person.phones[0].number).toBe("+2348031234567");
  });

  it("adds a responsibility and an emergency contact through field arrays", async () => {
    const { user, onSubmit } = setup();
    await fillRequired(user);
    await user.click(screen.getByRole("button", { name: /add responsibility/i }));
    await user.type(screen.getByLabelText(/responsibility title/i), "Head of Department");
    await user.type(screen.getByLabelText(/allowance code/i), "HOD");
    await user.type(screen.getByLabelText(/responsibility start/i), "2026-09-01");
    await user.click(screen.getByRole("button", { name: /add emergency contact/i }));
    await user.type(screen.getByLabelText(/contact name/i), "Grace Hopper");
    await user.type(screen.getByLabelText(/relationship/i), "Sister");
    await user.type(screen.getByLabelText(/contact phone/i), "08030000001");
    await user.click(screen.getByRole("button", { name: /add staff member/i }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const [input] = onSubmit.mock.calls[0];
    expect(input.contract.roles.map((r: { designation: string }) => r.designation)).toEqual(["Teacher", "Head of Department"]);
    expect(input.person.emergencyContacts[0]).toMatchObject({ name: "Grace Hopper", phone: "+2348030000001", isPrimary: true });
  });

  it("requires an end date once a dated contract type is chosen", async () => {
    const { user, onSubmit } = setup();
    await fillRequired(user);
    await user.selectOptions(screen.getByLabelText(/contract type/i), "corps_member");
    await user.click(screen.getByRole("button", { name: /add staff member/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByLabelText(/contract end/i)).toHaveAttribute("aria-invalid", "true"));
  });

  it("submits normalised values and reports pending state", async () => {
    let resolve!: () => void;
    const onSubmit = vi.fn<(input: StaffCreateInput, values: StaffFormValues) => Promise<void>>(async () => {
      await new Promise<void>((r) => { resolve = r; });
    });
    const { user } = setup({ onSubmit });
    await fillRequired(user);
    await user.selectOptions(screen.getByLabelText(/reports to/i), "stf_005");
    await user.click(screen.getByRole("button", { name: /add staff member/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
    const [input, values] = onSubmit.mock.calls[0];
    expect(input.person).toMatchObject({ firstName: "Ada" });
    expect(input.staff).toMatchObject({ email: "ada@school.test" });
    expect("employmentStatus" in input.staff).toBe(false);
    expect(input.contract).toMatchObject({ startDate: "2026-09-01", employer: "school" });
    expect(input.contract.roles[0]).toMatchObject({ department: "Mathematics", reportsToId: "stf_005" });
    expect(values.sendInvite).toBe(false);
    resolve();
    await waitFor(() => expect(screen.getByRole("button", { name: /add staff member/i })).toBeEnabled());
  });

  it("lets FTE be set freely and shows the employer and contract type choices", async () => {
    const { user } = setup();
    const fte = screen.getByLabelText(/fte/i);
    expect(fte).toHaveValue(100);
    await user.clear(fte);
    await user.type(fte, "60");
    expect(fte).toHaveValue(60);
    expect(screen.getByRole("option", { name: /PTA/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /corps member/i })).toBeInTheDocument();
  });

  it("shows a submit error from the handler without losing input", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Email already in use"));
    const { user } = setup({ onSubmit });
    await fillRequired(user);
    await user.click(screen.getByRole("button", { name: /add staff member/i }));
    expect(await screen.findByRole("alert", { name: /could not save/i })).toHaveTextContent(/email already in use/i);
    expect(screen.getByLabelText(/first name/i)).toHaveValue("Ada");
  });

  it("pre-fills from an existing record in edit mode", () => {
    const existing = makeStaffDetail({ title: "Mrs", firstName: "Grace", lastName: "Hopper", email: "grace@school.test", department: "Science", ftePercent: 60, employeeNumber: "EMP-042", employer: "pta", contractType: "fixed_term", hireDate: "2015-01-01" });
    // Contract fields pre-fill from the contract itself, not the flat projection.
    Object.assign(existing.contracts[0], { fte: 0.6, startDate: "2024-09-01", employer: "pta", contractType: "fixed_term", endDate: "2027-08-31" });
    existing.contracts[0].roles.push({ ...existing.contracts[0].roles[0], id: "r2", designation: "Head of Department", roleKind: "responsibility", isPrimary: false, allowanceCode: "HOD" });
    existing.emergencyContacts = [{ id: "ec1", name: "Ada Hopper", relationship: "Spouse", phone: "+2348030000009", altPhone: null, email: null, priority: 1, isPrimary: true }];
    setup({ mode: "edit", initial: existing });
    expect(screen.getByLabelText(/^title/i)).toHaveValue("Mrs");
    expect(screen.getByLabelText(/first name/i)).toHaveValue("Grace");
    expect(screen.getByLabelText(/^department/i)).toHaveValue("Science");
    expect(screen.getByLabelText(/fte/i)).toHaveValue(60);
    expect(screen.queryByLabelText(/hire date/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/contract start/i)).toHaveValue("2024-09-01");
    expect(screen.getByLabelText(/contract start/i)).toHaveAccessibleDescription(/this contract/i);
    expect(screen.getByLabelText(/employer/i)).toHaveValue("pta");
    expect(screen.getByLabelText(/contract type/i)).toHaveValue("fixed_term");
    expect(screen.getByLabelText(/responsibility title/i)).toHaveValue("Head of Department");
    expect(screen.getByLabelText(/employee number/i)).toHaveValue("EMP-042");
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
    expect(screen.getByText(/contact 1/i)).toHaveTextContent(/primary/i);
    expect(within(screen.getByRole("heading", { name: /access/i }).closest("section")!).queryByLabelText(/send invite/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /remove emergency contact 1/i })).toBeInTheDocument();
  });
});

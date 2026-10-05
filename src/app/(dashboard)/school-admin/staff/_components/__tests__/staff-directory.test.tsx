import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { makeStaff } from "@/test/factories/staff";
import { StaffDirectory } from "../staff-directory";

const TODAY = "2026-10-04";
const EMPTY = { registrations: [], checks: [], training: [] };
const staff = [
  makeStaff({ id: "1", firstName: "Ada", lastName: "Lovelace", department: "Science" }),
  makeStaff({ id: "2", firstName: "Ben", lastName: "Okafor", email: null, department: "Administration", staffCategory: "support", isTeacher: false, employmentStatus: "onboarding", hireDate: "2026-11-01", contractType: "corps_member", employer: "nysc" }),
  makeStaff({ id: "3", firstName: "Amy", lastName: "Chen", department: "Science", employmentStatus: "inactive", exitDate: "2026-01-01" }),
];

const lapsed = makeStaff({ id: "4", firstName: "Lap", lastName: "Sed", department: "Science", contractLapsed: true, contractType: "fixed_term" });

function bodyRows() {
  return within(screen.getByRole("table")).getAllByRole("row").slice(1);
}

describe("StaffDirectory", () => {
  it("shows everyone by default with status tab counts", () => {
    render(<StaffDirectory staff={staff} compliance={EMPTY} absences={[]} today={TODAY} />);
    expect(bodyRows()).toHaveLength(3);
    expect(screen.getByRole("tab", { name: /all/i })).toHaveTextContent("3");
    expect(screen.getByRole("tab", { name: /onboarding/i })).toHaveTextContent("1");
    expect(screen.getByRole("tab", { name: /inactive/i })).toHaveTextContent("1");
  });

  it("offers a contract-ended filter only when someone has one, and it toggles", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<StaffDirectory staff={staff} compliance={EMPTY} absences={[]} today={TODAY} />);
    expect(screen.queryByRole("button", { name: /contract ended/i })).not.toBeInTheDocument();
    unmount();
    render(<StaffDirectory staff={[...staff, lapsed]} compliance={EMPTY} absences={[]} today={TODAY} />);
    const chip = screen.getByRole("button", { name: /contract ended/i });
    expect(chip).toHaveAttribute("aria-pressed", "false");
    expect(chip).toHaveTextContent("1");
    await user.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(bodyRows()).toHaveLength(1);
    expect(screen.getByRole("row", { name: /lap sed/i })).toBeInTheDocument();
    await user.click(chip);
    expect(bodyRows()).toHaveLength(4);
  });

  it("filters by tab, search and department, and resets the page", async () => {
    const user = userEvent.setup();
    render(<StaffDirectory staff={staff} compliance={EMPTY} absences={[]} today={TODAY} />);
    await user.click(screen.getByRole("tab", { name: /onboarding/i }));
    expect(bodyRows()).toHaveLength(1);
    expect(screen.getByRole("row", { name: /ben okafor/i })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /all/i }));
    await user.type(screen.getByRole("searchbox", { name: /search staff/i }), "amy");
    expect(bodyRows()).toHaveLength(1);
    await user.clear(screen.getByRole("searchbox", { name: /search staff/i }));

    await user.selectOptions(screen.getByRole("combobox", { name: /department/i }), "Science");
    expect(bodyRows()).toHaveLength(2);
    await user.selectOptions(screen.getByRole("combobox", { name: /department/i }), "");
    await user.selectOptions(screen.getByRole("combobox", { name: /employer/i }), "nysc");
    expect(bodyRows()).toHaveLength(1);
  });

  it("shows an empty state with a working clear-filters action", async () => {
    const user = userEvent.setup();
    render(<StaffDirectory staff={staff} compliance={EMPTY} absences={[]} today={TODAY} />);
    await user.type(screen.getByRole("searchbox", { name: /search staff/i }), "nobody here");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /clear filters/i }));
    expect(bodyRows()).toHaveLength(3);
  });

  it("moves between status tabs with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<StaffDirectory staff={staff} compliance={EMPTY} absences={[]} today={TODAY} />);
    screen.getByRole("tab", { name: /all/i }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /^active/i })).toHaveFocus();
    expect(screen.getByRole("tab", { name: /^active/i })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: /inactive/i })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
  });

  it("clears the selection when filters change", async () => {
    const user = userEvent.setup();
    render(<StaffDirectory staff={staff} compliance={EMPTY} absences={[]} today={TODAY} />);
    await user.click(screen.getByRole("checkbox", { name: /select ada lovelace/i }));
    expect(screen.getByText(/1 selected/i)).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: /onboarding/i }));
    await waitFor(() => expect(screen.queryByText(/selected/i)).not.toBeInTheDocument());
  });

  it("tracks selection and shows the bulk bar", async () => {
    const user = userEvent.setup();
    render(<StaffDirectory staff={staff} compliance={EMPTY} absences={[]} today={TODAY} />);
    await user.click(screen.getByRole("checkbox", { name: /select ada lovelace/i }));
    await user.click(screen.getByRole("checkbox", { name: /select ben okafor/i }));
    expect(screen.getByText(/2 selected/i)).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: /select all on this page/i }));
    expect(screen.getByText(/3 selected/i)).toBeInTheDocument();
  });
});

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { makeStaff } from "@/test/factories/staff";
import { StaffOverview } from "../staff-overview";

const TODAY = "2026-10-04";
const staff = [
  makeStaff({ hireDate: "2016-10-04" }),
  makeStaff({ hireDate: "2026-10-01" }),
  makeStaff({ hireDate: "2026-08-01" }),
];

describe("StaffOverview", () => {
  it("renders widgets computed from data", () => {
    render(<StaffOverview staff={staff} absences={[]} today={TODAY} />);
    const headcount = screen.getByRole("group", { name: /headcount/i });
    expect(within(headcount).getByText("3")).toBeInTheDocument();
    const hires = screen.getByRole("group", { name: /new hires/i });
    expect(within(hires).getByText("1")).toBeInTheDocument(); // last 7 days: 1 Oct
  });

  it("recomputes flow metrics when the range changes", async () => {
    const user = userEvent.setup();
    render(<StaffOverview staff={staff} absences={[]} today={TODAY} />);
    await user.selectOptions(screen.getByRole("combobox", { name: /date range/i }), "90d");
    const hires = screen.getByRole("group", { name: /new hires/i });
    expect(within(hires).getByText("2")).toBeInTheDocument(); // 1 Aug and 1 Oct
  });

  it("offers 'This term' only when a term start is known", () => {
    const { unmount } = render(<StaffOverview staff={staff} absences={[]} today={TODAY} />);
    expect(screen.queryByRole("option", { name: /this term/i })).not.toBeInTheDocument();
    unmount();
    render(<StaffOverview staff={staff} absences={[]} today={TODAY} termStart="2026-09-07" />);
    expect(screen.getByRole("option", { name: /this term/i })).toBeInTheDocument();
  });

  it("closes the add menu on Escape and remembers hidden widgets across mounts", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<StaffOverview staff={staff} absences={[]} today={TODAY} />);
    await user.click(screen.getByRole("button", { name: /add widget/i }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /edit widgets/i }));
    await user.click(screen.getByRole("button", { name: /remove headcount/i }));
    unmount();
    render(<StaffOverview staff={staff} absences={[]} today={TODAY} />);
    expect(screen.queryByRole("group", { name: /headcount/i })).not.toBeInTheDocument();
    window.localStorage.clear();
  });

  it("opens the add menu with ArrowDown and moves between items with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<StaffOverview staff={staff} absences={[]} today={TODAY} />);
    await user.click(screen.getByRole("button", { name: /edit widgets/i }));
    await user.click(screen.getByRole("button", { name: /remove headcount/i }));
    await user.click(screen.getByRole("button", { name: /remove new hires/i }));
    screen.getByRole("button", { name: /add widget/i }).focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: /headcount/i })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: /new hires/i })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: /headcount/i })).toHaveFocus();
    window.localStorage.clear();
  });

  it("stores the layout under a key scoped to the current host", async () => {
    const user = userEvent.setup();
    render(<StaffOverview staff={staff} absences={[]} today={TODAY} />);
    await user.click(screen.getByRole("button", { name: /edit widgets/i }));
    await user.click(screen.getByRole("button", { name: /remove headcount/i }));
    expect(Object.keys(window.localStorage).some((k) => k.includes(window.location.hostname))).toBe(true);
    window.localStorage.clear();
  });

  it("lets the user hide and re-add widgets", async () => {
    const user = userEvent.setup();
    render(<StaffOverview staff={staff} absences={[]} today={TODAY} />);
    await user.click(screen.getByRole("button", { name: /edit widgets/i }));
    await user.click(screen.getByRole("button", { name: /remove headcount/i }));
    expect(screen.queryByRole("group", { name: /headcount/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /add widget/i }));
    await user.click(screen.getByRole("menuitem", { name: /headcount/i }));
    expect(screen.getByRole("group", { name: /headcount/i })).toBeInTheDocument();
  });
});

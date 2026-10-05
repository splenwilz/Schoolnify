import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { makeStaff } from "@/test/factories/staff";
import type { DirectoryRow } from "@/lib/staff/rows";
import { StaffTable } from "../staff-table";

function row(overrides: Partial<DirectoryRow>): DirectoryRow {
  return { ...makeStaff(), health: "none", awayToday: false, managerName: null, ...overrides };
}

const ada = row({ id: "1", firstName: "Ada", lastName: "Lovelace", health: "expired", hireDate: "2019-09-01" });
const ben = row({ id: "2", firstName: "Ben", lastName: "Okafor", email: null, phone: "+2348090000002", awayToday: true, managerName: "Ada Lovelace", contractType: "casual", employer: "pta", ftePercent: 50, contractLapsed: true });

function renderTable(props: Partial<React.ComponentProps<typeof StaffTable>> = {}) {
  const onSortChange = vi.fn();
  const onPageChange = vi.fn();
  const onToggleOne = vi.fn();
  const onToggleAll = vi.fn();
  render(
    <StaffTable
      page={{ items: [ada, ben], page: 1, totalPages: 1, from: 1, to: 2, total: 2 }}
      selectedIds={[]}
      sort={{ field: "name", dir: "asc" }}
      onSortChange={onSortChange}
      onPageChange={onPageChange}
      onToggleOne={onToggleOne}
      onToggleAll={onToggleAll}
      {...props}
    />
  );
  return { onSortChange, onPageChange, onToggleOne, onToggleAll };
}

describe("StaffTable", () => {
  it("renders one row per person with a labelled checkbox", async () => {
    const user = userEvent.setup();
    const { onToggleOne, onToggleAll } = renderTable();
    const rows = within(screen.getByRole("table")).getAllByRole("row");
    expect(rows).toHaveLength(3); // header + 2
    await user.click(screen.getByRole("checkbox", { name: /select ada lovelace/i }));
    expect(onToggleOne).toHaveBeenCalledWith("1");
    await user.click(screen.getByRole("checkbox", { name: /select all on this page/i }));
    expect(onToggleAll).toHaveBeenCalledWith(["1", "2"]);
  });

  it("has no placeholder actions column", () => {
    renderTable();
    expect(screen.queryByRole("button", { name: /more actions/i })).not.toBeInTheDocument();
    expect(within(screen.getByRole("table")).getAllByRole("columnheader")).toHaveLength(8);
  });

  it("exposes the sort state and toggles direction on the active column", async () => {
    const user = userEvent.setup();
    const { onSortChange } = renderTable();
    expect(screen.getByRole("columnheader", { name: /name/i })).toHaveAttribute("aria-sort", "ascending");
    await user.click(screen.getByRole("button", { name: /sort by name/i }));
    expect(onSortChange).toHaveBeenCalledWith({ field: "name", dir: "desc" });
    await user.click(screen.getByRole("button", { name: /sort by hire date/i }));
    expect(onSortChange).toHaveBeenCalledWith({ field: "hireDate", dir: "asc" });
  });

  it("shows derived columns: manager, away badge, credential health", () => {
    renderTable();
    const adaRow = screen.getByRole("row", { name: /select ada lovelace/i });
    expect(within(adaRow).getByText(/credentials: expired/i)).toBeInTheDocument();
    const benRow = screen.getByRole("row", { name: /select ben okafor/i });
    expect(within(benRow).getByText("Ada Lovelace")).toBeInTheDocument();
    expect(within(benRow).getByText(/away today/i)).toBeInTheDocument();
    expect(within(benRow).getByText("+2348090000002")).toBeInTheDocument(); // no email: phone shown instead
    expect(within(benRow).getByText(/casual · 50%/i)).toBeInTheDocument();
    expect(within(benRow).getByText(/PTA/)).toBeInTheDocument();
    expect(within(benRow).getByText(/contract ended/i)).toBeInTheDocument();
    expect(within(adaRow).queryByText(/contract ended/i)).not.toBeInTheDocument();
  });

  it("links each person to their detail page and formats the hire date", () => {
    renderTable();
    expect(screen.getByRole("link", { name: /ada lovelace/i })).toHaveAttribute("href", "/school-admin/staff/1");
    expect(screen.getByText("1 Sep 2019")).toBeInTheDocument();
  });

  it("pages with Previous/Next and numbered buttons", async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderTable({
      page: { items: [ada], page: 2, totalPages: 3, from: 11, to: 11, total: 21 },
    });
    expect(screen.getByText(/showing/i)).toHaveTextContent("11–11 of 21");
    await user.click(screen.getByRole("button", { name: /next page/i }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    await user.click(screen.getByRole("button", { name: /previous page/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(screen.getByRole("button", { name: /page 2/i })).toHaveAttribute("aria-current", "page");
  });

  it("windows the page numbers around the current page", () => {
    renderTable({ page: { items: [ada], page: 7, totalPages: 20, from: 61, to: 61, total: 200 } });
    const labels = screen.getAllByRole("button", { name: /^page \d+$/i }).map((b) => b.textContent);
    expect(labels).toEqual(["1", "6", "7", "8", "20"]);
    expect(screen.getAllByText("…")).toHaveLength(2);
  });
});

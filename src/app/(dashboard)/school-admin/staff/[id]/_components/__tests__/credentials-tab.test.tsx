import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { makeAward, makeCheck, makeRegistration, makeTraining } from "@/test/factories/staff";
import { CredentialsTab } from "../credentials-tab";

const TODAY = "2026-10-04";
const directory = [{ id: "stf_029", name: "Helen Park" }];
const empty = { registrations: [], checks: [], training: [], awards: [] };

describe("CredentialsTab", () => {
  it("shows an empty state per section when nothing is recorded", () => {
    render(<CredentialsTab {...empty} today={TODAY} staffDirectory={directory} />);
    expect(screen.getByText(/no registrations recorded/i)).toBeInTheDocument();
    expect(screen.getByText(/no checks recorded/i)).toBeInTheDocument();
    expect(screen.getByText(/no qualifications recorded/i)).toBeInTheDocument();
    expect(screen.getByText(/no training recorded/i)).toBeInTheDocument();
  });

  it("lists registrations and checks with a status derived from today, most urgent first", () => {
    render(
      <CredentialsTab
        {...empty}
        registrations={[
          makeRegistration({ id: "fine", body: "qts", number: "QTS-1", expiryDate: null, verifiedById: "stf_029", verifiedAt: "2026-01-15" }),
          makeRegistration({ id: "gone", body: "trcn", number: "TRCN-9", category: "C", expiryDate: "2026-06-20", cpdCredits: 12, verifiedById: "stf_029", verifiedAt: "2026-01-15" }),
        ]}
        checks={[makeCheck({ id: "soon", type: "dbs_enhanced", expiryDate: "2026-10-20", checkedById: null, outcome: "clear" }), makeCheck({ id: "pend", type: "police_character", outcome: "pending" })]}
        today={TODAY}
        staffDirectory={directory}
      />
    );
    const regs = within(screen.getByRole("table", { name: /^registrations$/i })).getAllByRole("row").slice(1);
    expect(within(regs[0]).getByRole("rowheader")).toHaveTextContent(/TRCN/);
    expect(within(regs[0]).getByText(/^expired$/i)).toBeInTheDocument();
    expect(within(regs[0]).getByText(/106 days ago/i)).toBeInTheDocument();
    expect(within(regs[0]).getByText(/category C/i)).toBeInTheDocument();
    expect(within(regs[0]).getByText(/12 credits/i)).toBeInTheDocument();
    expect(within(regs[1]).getByText(/^valid$/i)).toBeInTheDocument();
    expect(within(regs[1]).getByText("Helen Park")).toBeInTheDocument();

    const checks = within(screen.getByRole("table", { name: /^checks$/i })).getAllByRole("row").slice(1);
    expect(within(checks[0]).getByText(/check date/i)).toBeInTheDocument(); // pending outcome first
    expect(within(checks[1]).getByText(/expiring soon/i)).toBeInTheDocument();
    expect(within(checks[1]).getByText(/in 16 days/i)).toBeInTheDocument();
    expect(within(checks[1]).getByText(/unverified/i)).toBeInTheDocument();
  });

  it("lists qualifications and training", () => {
    render(
      <CredentialsTab
        {...empty}
        awards={[makeAward({ award: "nce", subject: "Mathematics", institution: "FCE Abeokuta", year: 2016, classOfAward: "Merit" })]}
        training={[makeTraining({ type: "first_aid", provider: "Red Cross", date: "2024-03-10", expiryDate: "2027-03-09", hours: 16 })]}
        today={TODAY}
        staffDirectory={directory}
      />
    );
    expect(screen.getByText(/NCE Mathematics/)).toBeInTheDocument();
    expect(screen.getByText(/FCE Abeokuta/)).toBeInTheDocument();
    expect(screen.getByText(/First aid/)).toBeInTheDocument();
    expect(screen.getByText(/16 hours/i)).toBeInTheDocument();
  });

  it("summarises counts across registrations, checks and training", () => {
    render(
      <CredentialsTab
        {...empty}
        registrations={[makeRegistration({ expiryDate: null })]}
        checks={[makeCheck({ expiryDate: "2026-10-20" })]}
        training={[makeTraining({ expiryDate: "2026-06-20" })]}
        today={TODAY}
        staffDirectory={directory}
      />
    );
    expect(screen.getByRole("group", { name: /^expired$/i })).toHaveTextContent("1");
    expect(screen.getByRole("group", { name: /expiring soon/i })).toHaveTextContent("1");
    expect(screen.getByRole("group", { name: /^valid$/i })).toHaveTextContent("1");
    expect(screen.getByRole("group", { name: /to check/i })).toHaveTextContent("0");
  });
});

"use client";

import { useState, useMemo } from "react";
import { calculate, Period } from "@/lib/tax";

const fmt = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

const pct = (n: number) => (n * 100).toFixed(1) + "%";

export default function Calculator() {
  const [salary, setSalary] = useState<string>("100000");
  const [period, setPeriod] = useState<Period>("annual");
  const [hecs, setHecs] = useState(false);
  const [mls, setMls] = useState(false);

  const result = useMemo(() => {
    const num = parseFloat(salary) || 0;
    return calculate(num, period, hecs, mls);
  }, [salary, period, hecs, mls]);

  const total = result.breakdown.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Your Salary</h2>

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold">Gross Salary</span></label>
            <div className="join w-full">
              <span className="join-item btn btn-neutral no-animation">$</span>
              <input
                type="number"
                className="input input-bordered join-item w-full text-lg"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                min={0}
                placeholder="Enter salary"
              />
            </div>
          </div>

          <div className="form-control w-full mt-3">
            <label className="label"><span className="label-text font-semibold">Pay Period</span></label>
            <select
              className="select select-bordered w-full"
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
            >
              <option value="annual">Annual</option>
              <option value="monthly">Monthly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="weekly">Weekly</option>
              <option value="hourly">Hourly (38hr week)</option>
            </select>
          </div>

          <div className="divider"></div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input type="checkbox" className="checkbox checkbox-primary" checked={hecs} onChange={(e) => setHecs(e.target.checked)} />
              <span className="label-text">I have a HECS/HELP debt</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input type="checkbox" className="checkbox checkbox-primary" checked={mls} onChange={(e) => setMls(e.target.checked)} />
              <span className="label-text">Medicare Levy Surcharge (no private health)</span>
            </label>
          </div>

          <div className="mt-4 p-4 bg-base-200 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Super Guarantee (11.5%)</span>
              <span className="font-bold text-primary">{fmt(result.superannuation)}<span className="text-xs text-base-content/50 ml-1">/ year</span></span>
            </div>
            <p className="text-xs text-base-content/60 mt-1">Paid by your employer on top of your salary</p>
          </div>
        </div>
      </div>

      {/* Results Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Your Take-Home Pay</h2>

          <div className="w-full h-10 rounded-xl overflow-hidden flex">
            {result.breakdown.map((b) => {
              const w = total > 0 ? (b.amount / total) * 100 : 0;
              return w > 0 ? (
                <div key={b.label} className="h-full transition-all duration-500 relative group" style={{ width: `${w}%`, backgroundColor: b.color }} title={`${b.label}: ${fmt(b.amount)}`}>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-base-300 text-xs px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none transition-opacity">
                    {b.label}: {fmt(b.amount)}
                  </div>
                </div>
              ) : null;
            })}
          </div>

          <div className="flex flex-wrap gap-3 mt-2 mb-4">
            {result.breakdown.map((b) => (
              <div key={b.label} className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
                {b.label}
              </div>
            ))}
          </div>

          <div className="stats stats-vertical shadow w-full">
            <div className="stat">
              <div className="stat-title">Annual Net</div>
              <div className="stat-value text-success">{fmt(result.netAnnual)}</div>
              <div className="stat-desc">Effective tax rate: {pct(result.effectiveRate)}</div>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="table table-zebra w-full">
              <thead>
                <tr><th>Period</th><th className="text-right">Gross</th><th className="text-right">Tax & Levies</th><th className="text-right">Net</th></tr>
              </thead>
              <tbody>
                <tr><td>Annual</td><td className="text-right">{fmt(result.grossAnnual)}</td><td className="text-right text-error">{fmt(result.totalDeductions)}</td><td className="text-right font-bold text-success">{fmt(result.netAnnual)}</td></tr>
                <tr><td>Monthly</td><td className="text-right">{fmt(Math.round(result.grossAnnual / 12))}</td><td className="text-right text-error">{fmt(Math.round(result.totalDeductions / 12))}</td><td className="text-right font-bold text-success">{fmt(result.netMonthly)}</td></tr>
                <tr><td>Fortnightly</td><td className="text-right">{fmt(Math.round(result.grossAnnual / 26))}</td><td className="text-right text-error">{fmt(Math.round(result.totalDeductions / 26))}</td><td className="text-right font-bold text-success">{fmt(result.netFortnightly)}</td></tr>
                <tr><td>Weekly</td><td className="text-right">{fmt(Math.round(result.grossAnnual / 52))}</td><td className="text-right text-error">{fmt(Math.round(result.totalDeductions / 52))}</td><td className="text-right font-bold text-success">{fmt(result.netWeekly)}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Deduction Breakdown</h3>
            <div className="space-y-2">
              {[
                { label: "Income Tax", value: result.incomeTax },
                { label: "Medicare Levy (2%)", value: result.medicareLevy },
                ...(result.medicareSurcharge > 0 ? [{ label: "Medicare Surcharge", value: result.medicareSurcharge }] : []),
                ...(result.hecsRepayment > 0 ? [{ label: "HECS/HELP Repayment", value: result.hecsRepayment }] : []),
              ].map((d) => (
                <div key={d.label} className="flex justify-between text-sm">
                  <span>{d.label}</span>
                  <span className="font-mono text-error">{fmt(d.value)}</span>
                </div>
              ))}
              <div className="divider my-1"></div>
              <div className="flex justify-between font-bold">
                <span>Total Deductions</span>
                <span className="text-error">{fmt(result.totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

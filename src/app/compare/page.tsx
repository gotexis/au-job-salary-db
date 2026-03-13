"use client";

import salaries from "@/data/salaries.json";
import { useState } from "react";

export default function ComparePage() {
  const [roleA, setRoleA] = useState(salaries[0]?.slug || "");
  const [roleB, setRoleB] = useState(salaries[1]?.slug || "");

  const a = salaries.find((r) => r.slug === roleA);
  const b = salaries.find((r) => r.slug === roleB);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Compare Salaries</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <select className="select select-bordered w-full md:w-1/2" value={roleA} onChange={(e) => setRoleA(e.target.value)}>
          {salaries.map((r) => (
            <option key={r.slug} value={r.slug}>{r.title} — {r.category}</option>
          ))}
        </select>
        <span className="text-center font-bold self-center">vs</span>
        <select className="select select-bordered w-full md:w-1/2" value={roleB} onChange={(e) => setRoleB(e.target.value)}>
          {salaries.map((r) => (
            <option key={r.slug} value={r.slug}>{r.title} — {r.category}</option>
          ))}
        </select>
      </div>

      {a && b && (
        <div className="overflow-x-auto">
          <table className="table bg-base-100">
            <thead>
              <tr>
                <th>Metric</th>
                <th>{a.title}</th>
                <th>{b.title}</th>
                <th>Difference</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Average Salary", va: a.averageSalary, vb: b.averageSalary },
                { label: "Entry Level", va: a.entryLevel, vb: b.entryLevel },
                { label: "Mid Level", va: a.midLevel, vb: b.midLevel },
                { label: "Senior Level", va: a.seniorLevel, vb: b.seniorLevel },
                { label: "Median", va: a.medianSalary, vb: b.medianSalary },
              ].map((row) => {
                const diff = row.va - row.vb;
                return (
                  <tr key={row.label}>
                    <td className="font-medium">{row.label}</td>
                    <td className="font-mono">${row.va.toLocaleString()}</td>
                    <td className="font-mono">${row.vb.toLocaleString()}</td>
                    <td className={`font-mono ${diff > 0 ? "text-success" : diff < 0 ? "text-error" : ""}`}>
                      {diff > 0 ? "+" : ""}{diff.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="font-medium">Demand</td>
                <td>{a.demand}</td>
                <td>{b.demand}</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-bold mt-6 mb-2">By State Comparison</h3>
          <table className="table table-sm bg-base-100">
            <thead>
              <tr>
                <th>State</th>
                <th>{a.title}</th>
                <th>{b.title}</th>
                <th>Diff</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(a.byState).map((st) => {
                const va = a.byState[st as keyof typeof a.byState];
                const vb = b.byState[st as keyof typeof b.byState];
                const diff = va - vb;
                return (
                  <tr key={st}>
                    <td className="font-bold">{st}</td>
                    <td className="font-mono">${va.toLocaleString()}</td>
                    <td className="font-mono">${vb.toLocaleString()}</td>
                    <td className={`font-mono ${diff > 0 ? "text-success" : diff < 0 ? "text-error" : ""}`}>
                      {diff > 0 ? "+" : ""}{diff.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

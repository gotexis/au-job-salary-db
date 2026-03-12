"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(n);
}

interface Inputs {
  currentAge: number;
  retirementAge: number;
  currentBalance: number;
  annualSalary: number;
  employerRate: number;
  salarySacrifice: number;
  returnRate: number;
  annualFees: number;
}

function calculate(inputs: Inputs) {
  const years = inputs.retirementAge - inputs.currentAge;
  if (years <= 0) return { finalBalance: inputs.currentBalance, data: [] };

  const data: { age: number; balance: number }[] = [];
  let balance = inputs.currentBalance;

  for (let i = 0; i <= years; i++) {
    data.push({ age: inputs.currentAge + i, balance: Math.round(balance) });
    if (i < years) {
      const contributions =
        inputs.annualSalary * (inputs.employerRate / 100) + inputs.salarySacrifice;
      balance = (balance + contributions) * (1 + inputs.returnRate / 100) - inputs.annualFees;
      if (balance < 0) balance = 0;
    }
  }

  return { finalBalance: Math.round(balance), data };
}

function NumberInput({
  label, value, onChange, min, max, step, prefix, suffix,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; prefix?: string; suffix?: string;
}) {
  return (
    <div className="form-control w-full">
      <label className="label"><span className="label-text font-medium">{label}</span></label>
      <label className="input input-bordered flex items-center gap-2">
        {prefix && <span className="text-base-content/60">{prefix}</span>}
        <input
          type="number"
          className="grow bg-transparent w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min} max={max} step={step ?? 1}
        />
        {suffix && <span className="text-base-content/60">{suffix}</span>}
      </label>
    </div>
  );
}

export default function SuperCalculatorPage() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(67);
  const [currentBalance, setCurrentBalance] = useState(50000);
  const [annualSalary, setAnnualSalary] = useState(90000);
  const [employerRate, setEmployerRate] = useState(11.5);
  const [salarySacrifice, setSalarySacrifice] = useState(0);
  const [returnRate, setReturnRate] = useState(7);
  const [annualFees, setAnnualFees] = useState(500);

  const { finalBalance, data } = useMemo(
    () => calculate({ currentAge, retirementAge, currentBalance, annualSalary, employerRate, salarySacrifice, returnRate, annualFees }),
    [currentAge, retirementAge, currentBalance, annualSalary, employerRate, salarySacrifice, returnRate, annualFees]
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Superannuation Calculator</h1>
        <p className="text-lg text-base-content/70">Project your super balance at retirement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Your Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <NumberInput label="Current Age" value={currentAge} onChange={setCurrentAge} min={16} max={75} />
              <NumberInput label="Retirement Age" value={retirementAge} onChange={setRetirementAge} min={55} max={75} />
            </div>
            <NumberInput label="Current Super Balance" value={currentBalance} onChange={setCurrentBalance} min={0} prefix="$" />
            <NumberInput label="Annual Salary (before tax)" value={annualSalary} onChange={setAnnualSalary} min={0} prefix="$" />
            <NumberInput label="Employer Contribution Rate" value={employerRate} onChange={setEmployerRate} min={0} max={30} step={0.5} suffix="%" />
            <NumberInput label="Annual Salary Sacrifice" value={salarySacrifice} onChange={setSalarySacrifice} min={0} prefix="$" />
            <NumberInput label="Expected Investment Return" value={returnRate} onChange={setReturnRate} min={-10} max={20} step={0.5} suffix="% p.a." />
            <NumberInput label="Annual Fees" value={annualFees} onChange={setAnnualFees} min={0} prefix="$" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card bg-primary text-primary-content shadow-xl">
            <div className="card-body text-center">
              <h2 className="card-title justify-center text-xl">Projected Balance at {retirementAge}</h2>
              <p className="text-5xl font-bold my-4">{formatCurrency(finalBalance)}</p>
              <p className="text-sm opacity-80">
                Over {Math.max(0, retirementAge - currentAge)} years with{" "}
                {formatCurrency(annualSalary * (employerRate / 100) + salarySacrifice)}/yr contributions
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl flex-1">
            <div className="card-body">
              <h2 className="card-title text-xl mb-2">Balance Over Time</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" label={{ value: "Age", position: "insideBottom", offset: -5 }} />
                    <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => [formatCurrency(Number(v)), "Balance"]} />
                    <Area type="monotone" dataKey="balance" stroke="#4f46e5" fill="#818cf8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold mb-4">Understanding Australian Superannuation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base-content/80">
            <div>
              <h3 className="font-semibold text-lg mb-2">What is Super?</h3>
              <p>Superannuation is Australia&apos;s retirement savings system. Your employer contributes a percentage of your salary into a super fund that invests until you retire.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Employer Contributions</h3>
              <p>The Super Guarantee rate is currently 11.5% (2024–25) and increases to 12% from 1 July 2025.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Salary Sacrifice</h3>
              <p>Additional before-tax contributions are taxed at 15% inside super, potentially lower than your marginal tax rate.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Preservation Age</h3>
              <p>You can access your super when you reach preservation age (55–60) and meet a condition of release such as retiring.</p>
            </div>
          </div>
          <div className="divider"></div>
          <p className="text-sm text-base-content/50">
            <strong>Disclaimer:</strong> This calculator provides estimates only and does not constitute financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}

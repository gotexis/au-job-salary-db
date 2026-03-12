import type { Metadata } from "next";
import Calculator from "./Calculator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Australian Salary After Tax Calculator 2024-2025 | AU Salary DB",
  description:
    "Calculate your Australian take-home pay for 2024-2025. Includes income tax, Medicare levy, HECS/HELP repayments, and superannuation. Instant results.",
  keywords:
    "salary after tax australia, take home pay calculator, australian tax calculator 2024 2025, income tax calculator",
};

export default function SalaryCalculatorPage() {
  return (
    <div className="space-y-8">
      <div className="text-sm breadcrumbs">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/tools/salary-calculator">Salary Calculator</Link></li>
        </ul>
      </div>

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          🇦🇺 Australian Salary After Tax Calculator
        </h1>
        <p className="text-lg text-base-content/70">
          2024–2025 Financial Year • Updated tax brackets • Instant results
        </p>
      </header>

      <Calculator />

      <section className="prose prose-sm max-w-none mt-12">
        <h2>About This Calculator</h2>
        <p>
          This free Australian salary calculator uses the <strong>2024–2025 ATO tax brackets</strong> to
          estimate your take-home pay. It includes the 2% Medicare levy, optional Medicare levy surcharge
          for those without private health insurance, and HECS/HELP student loan repayment rates.
        </p>
        <h3>2024–2025 Tax Brackets (Residents)</h3>
        <ul>
          <li>$0 – $18,200: Nil</li>
          <li>$18,201 – $45,000: 16c for each $1 over $18,200</li>
          <li>$45,001 – $135,000: $4,288 plus 30c for each $1 over $45,000</li>
          <li>$135,001 – $190,000: $31,288 plus 37c for each $1 over $135,000</li>
          <li>$190,001+: $51,638 plus 45c for each $1 over $190,000</li>
        </ul>
        <h3>Also on this site</h3>
        <p>
          Browse <Link href="/categories">salary data by industry</Link> or <Link href="/compare">compare roles side by side</Link>.
        </p>
      </section>
    </div>
  );
}

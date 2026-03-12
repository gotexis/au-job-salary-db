import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AU Job Salary Database — Salary by Role, State & Experience | Australia",
  description:
    "Compare Australian salaries by job title, state, and experience level. Explore 342+ roles across 8 industries with detailed pay ranges, trends, and a salary after tax calculator.",
  keywords: "australian salary, salary comparison, job salary australia, pay by role, salary by state",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="emerald">
      <body className="min-h-screen bg-base-200">
        <div className="navbar bg-primary text-primary-content shadow-lg">
          <div className="container mx-auto">
            <a href="/" className="btn btn-ghost text-xl">💰 AU Salary DB</a>
            <div className="flex-none hidden sm:block">
              <ul className="menu menu-horizontal px-1">
                <li><a href="/">Home</a></li>
                <li><a href="/categories">Industries</a></li>
                <li><a href="/compare">Compare</a></li>
                <li><a href="/tools/salary-calculator">Tax Calculator</a></li>
              </ul>
            </div>
          </div>
        </div>
        <main className="container mx-auto px-4 py-8">{children}</main>
        <footer className="footer footer-center p-6 bg-base-300 text-base-content">
          <div>
            <p>AU Job Salary Database © {new Date().getFullYear()} — Data sourced from ABS, Seek & public datasets</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

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
            <div className="navbar-start">
              <div className="dropdown">
                <label tabIndex={0} className="btn btn-ghost sm:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                </label>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-primary rounded-box w-52">
                  <li><a href="/">Home</a></li>
                  <li><a href="/categories">Industries</a></li>
                  <li><a href="/compare">Compare</a></li>
                  <li><a href="/tools/salary-calculator">Tax Calculator</a></li>
                  <li><a href="/tools/super-calculator">Super Calculator</a></li>
                </ul>
              </div>
              <a href="/" className="btn btn-ghost text-xl">💰 AU Salary DB</a>
            </div>
            <div className="navbar-end hidden sm:flex">
              <ul className="menu menu-horizontal px-1">
                <li><a href="/">Home</a></li>
                <li><a href="/categories">Industries</a></li>
                <li><a href="/compare">Compare</a></li>
                <li><a href="/tools/salary-calculator">Tax Calculator</a></li>
                <li><a href="/tools/super-calculator">Super Calculator</a></li>
              </ul>
            </div>
          </div>
        </div>
        <main className="container mx-auto px-4 py-8">{children}</main>
        <footer className="footer footer-center p-6 bg-base-300 text-base-content">
          <div>
            <p>AU Job Salary Database © {new Date().getFullYear()} — Data sourced from ABS, Seek & public datasets</p>
            <p className="text-sm mt-1">
              A <a href="https://rollersoft.com.au" className="link link-hover font-semibold" target="_blank" rel="noopener noreferrer">Rollersoft</a> project
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

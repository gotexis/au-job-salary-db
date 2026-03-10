import salaries from "@/data/salaries.json";
import categories from "@/data/categories.json";
import Link from "next/link";
import type { Metadata } from "next";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export const metadata: Metadata = {
  title: "Browse Salaries by Industry — AU Job Salary Database",
  description: "Explore Australian salaries across Technology, Healthcare, Finance, Engineering, Education, Trades, Legal, and Marketing industries.",
};

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Browse by Industry</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const roles = salaries.filter((s) => s.category === cat).sort((a, b) => b.averageSalary - a.averageSalary);
          const avg = Math.round(roles.reduce((a, b) => a + b.averageSalary, 0) / roles.length);
          return (
            <div key={cat} className="card bg-base-100 shadow">
              <div className="card-body">
                <h2 className="card-title">
                  <Link href={`/category/${slugify(cat)}`} className="link link-hover">{cat}</Link>
                  <span className="badge badge-primary">{roles.length} roles</span>
                </h2>
                <p className="text-sm text-base-content/60">Average salary: ${avg.toLocaleString()}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {roles.slice(0, 5).map((r) => (
                    <Link href={`/role/${r.slug}`} key={r.slug} className="badge badge-outline badge-sm hover:badge-primary">
                      {r.title}
                    </Link>
                  ))}
                  {roles.length > 5 && <span className="badge badge-ghost badge-sm">+{roles.length - 5} more</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

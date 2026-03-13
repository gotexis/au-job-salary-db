import salaries from "@/data/salaries.json";
import categories from "@/data/categories.json";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: slugify(c) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find((c) => slugify(c) === slug);
  if (!cat) return {};
  return {
    title: `${cat} Salaries Australia 2026 — All Roles & Pay Ranges`,
    description: `Compare ${cat} salaries in Australia. See average pay and demand for all ${cat.toLowerCase()} roles.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = categories.find((c) => slugify(c) === slug);
  if (!cat) notFound();

  const roles = salaries.filter((s) => s.category === cat).sort((a, b) => b.averageSalary - a.averageSalary);

  return (
    <div className="space-y-6">
      <div className="breadcrumbs text-sm">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/categories">Industries</Link></li>
          <li>{cat}</li>
        </ul>
      </div>

      <h1 className="text-3xl font-bold">{cat} Salaries in Australia</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra bg-base-100">
          <thead>
            <tr>
              <th>Role</th>
              <th>Average Salary</th>
              <th>Entry Level</th>
              <th>Senior Level</th>
              <th>Demand</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.slug}>
                <td>
                  <Link href={`/role/${role.slug}`} className="link link-primary font-medium">
                    {role.title}
                  </Link>
                </td>
                <td className="font-mono">${role.averageSalary.toLocaleString()}</td>
                <td className="font-mono text-sm">${role.entryLevel.toLocaleString()}</td>
                <td className="font-mono text-sm">${role.seniorLevel.toLocaleString()}</td>
                <td>
                  <span className={`badge badge-sm ${role.demand === "Very High" ? "badge-error" : role.demand === "High" ? "badge-warning" : "badge-ghost"}`}>
                    {role.demand}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

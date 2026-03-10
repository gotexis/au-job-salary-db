import salaries from "@/data/salaries.json";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return salaries.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const role = salaries.find((r) => r.slug === slug);
  if (!role) return {};
  return {
    title: `${role.title} Salary Australia 2026 — Average Pay, By State & Experience`,
    description: `${role.title} average salary in Australia is $${role.averageSalary.toLocaleString()}. See salary by state, experience level, growth outlook, and compare with related roles.`,
  };
}

export default async function RolePage({ params }: Props) {
  const { slug } = await params;
  const role = salaries.find((r) => r.slug === slug);
  if (!role) notFound();

  const states = Object.entries(role.byState).sort((a, b) => b[1] - a[1]);
  const maxState = states[0][1];
  const related = salaries.filter((r) => role.relatedRoles.includes(r.title));

  return (
    <div className="space-y-8">
      <div className="breadcrumbs text-sm">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href={`/category/${role.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{role.category}</Link></li>
          <li>{role.title}</li>
        </ul>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl">{role.title}</h1>
          <p className="text-base-content/70">{role.description}</p>

          <div className="stats stats-vertical lg:stats-horizontal shadow mt-4">
            <div className="stat">
              <div className="stat-title">Average Salary</div>
              <div className="stat-value text-primary">${role.averageSalary.toLocaleString()}</div>
              <div className="stat-desc">per year</div>
            </div>
            <div className="stat">
              <div className="stat-title">Median</div>
              <div className="stat-value">${role.medianSalary.toLocaleString()}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Growth</div>
              <div className="stat-value text-success">{role.growth}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Demand</div>
              <div className="stat-value text-sm">{role.demand}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Levels */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">💼 Salary by Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[
              { label: "Entry Level (0-2 yrs)", val: role.entryLevel, color: "bg-info" },
              { label: "Mid Level (3-7 yrs)", val: role.midLevel, color: "bg-warning" },
              { label: "Senior Level (8+ yrs)", val: role.seniorLevel, color: "bg-success" },
            ].map((level) => (
              <div key={level.label} className="stat bg-base-200 rounded-box">
                <div className="stat-title">{level.label}</div>
                <div className="stat-value text-lg">${level.val.toLocaleString()}</div>
                <div className="mt-2">
                  <progress className={`progress ${level.color} w-full`} value={level.val} max={role.seniorLevel}></progress>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* By State */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">📍 Salary by State</h2>
          <div className="overflow-x-auto mt-4">
            <table className="table">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Average Salary</th>
                  <th>vs National</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {states.map(([state, salary]) => {
                  const diff = ((salary - role.averageSalary) / role.averageSalary) * 100;
                  return (
                    <tr key={state}>
                      <td className="font-bold">{state}</td>
                      <td className="font-mono">${salary.toLocaleString()}</td>
                      <td className={diff >= 0 ? "text-success" : "text-error"}>
                        {diff >= 0 ? "+" : ""}{diff.toFixed(1)}%
                      </td>
                      <td>
                        <progress className="progress progress-primary w-32" value={salary} max={maxState}></progress>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">🔗 Related Roles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {related.map((r) => (
                <Link href={`/role/${r.slug}`} key={r.slug} className="card bg-base-200 hover:shadow transition-shadow">
                  <div className="card-body p-4">
                    <h3 className="font-bold">{r.title}</h3>
                    <p className="font-mono">${r.averageSalary.toLocaleString()}</p>
                    <p className="text-xs text-base-content/60">{r.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import salaries from "@/data/salaries.json";
import categories from "@/data/categories.json";
import Link from "next/link";
import SearchBox from "@/components/SearchBox";

export default function Home() {
  const topPaying = [...salaries].sort((a, b) => b.averageSalary - a.averageSalary).slice(0, 10);
  const searchRoles = salaries.map(({ slug, title, category, averageSalary }) => ({ slug, title, category, averageSalary }));

  return (
    <div className="space-y-10">
      {/* Hero + Search */}
      <div className="hero bg-base-100 rounded-box p-8">
        <div className="hero-content text-center flex-col">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold">Australian Job Salary Database</h1>
            <p className="py-4 text-lg">
              Compare salaries across <strong>{salaries.length} roles</strong> in{" "}
              <strong>{categories.length} industries</strong>. Real data from ABS Employee Earnings survey.
            </p>
          </div>
          <SearchBox roles={searchRoles} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Roles</div>
          <div className="stat-value text-primary">{salaries.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Industries</div>
          <div className="stat-value text-secondary">{categories.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">States Covered</div>
          <div className="stat-value">8</div>
        </div>
        <div className="stat">
          <div className="stat-title">Avg Salary</div>
          <div className="stat-value text-accent">
            ${Math.round(salaries.reduce((a, b) => a + b.averageSalary, 0) / salaries.length / 1000)}k
          </div>
        </div>
      </div>

      {/* Top Paying */}
      <section>
        <h2 className="text-2xl font-bold mb-4">🏆 Top 10 Highest Paying Roles</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra bg-base-100">
            <thead>
              <tr>
                <th>#</th>
                <th>Role</th>
                <th>Industry</th>
                <th>Average Salary</th>
              </tr>
            </thead>
            <tbody>
              {topPaying.map((role, i) => (
                <tr key={role.slug}>
                  <td>{i + 1}</td>
                  <td>
                    <Link href={`/role/${role.slug}`} className="link link-primary">
                      {role.title}
                    </Link>
                  </td>
                  <td>{role.category}</td>
                  <td className="font-mono">${role.averageSalary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-4">📂 Browse by Industry</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const count = salaries.filter((s) => s.category === cat).length;
            return (
              <Link href={`/category/${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} key={cat} className="card bg-base-100 shadow hover:shadow-lg transition-shadow">
                <div className="card-body items-center text-center p-4">
                  <h3 className="font-bold">{cat}</h3>
                  <p className="text-sm text-base-content/60">{count} roles</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

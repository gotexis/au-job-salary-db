"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

type Role = { slug: string; title: string; category: string; averageSalary: number };

export default function SearchBox({ roles }: { roles: Role[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return roles.filter((r) => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)).slice(0, 8);
  }, [query, roles]);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Search 342+ roles... e.g. Nurse, Software, Teacher"
        className="input input-bordered input-primary w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <ul className="absolute z-50 bg-base-100 shadow-xl rounded-box mt-1 w-full max-h-72 overflow-y-auto">
          {results.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/role/${r.slug}`}
                className="flex justify-between items-center px-4 py-3 hover:bg-base-200 transition-colors"
                onClick={() => setQuery("")}
              >
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-base-content/60">{r.category}</div>
                </div>
                <span className="font-mono text-sm">${(r.averageSalary / 1000).toFixed(0)}k</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

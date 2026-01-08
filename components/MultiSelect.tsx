"use client";

import { useMemo, useState } from "react";

type Props = {
  title: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
};

export default function MultiSelect({
  title,
  options,
  selected,
  onChange,
  placeholder = "Suchen...",
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <section className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>

        <button
          type="button"
          onClick={() => onChange([])}
          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Auswahl löschen
        </button>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="mb-3 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-700"
      />

      <div className="max-h-56 overflow-auto rounded-lg border border-zinc-100 p-2 dark:border-zinc-900">
        {filtered.length === 0 ? (
          <p className="px-2 py-3 text-sm text-zinc-500">Keine Treffer.</p>
        ) : (
          <ul className="space-y-1">
            {filtered.map((opt) => {
              const checked = selected.includes(opt);
              return (
                <li key={opt}>
                  <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(opt)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-zinc-800 dark:text-zinc-200">
                      {opt}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        Ausgewählt: <span className="font-medium">{selected.length}</span>
      </p>
    </section>
  );
}

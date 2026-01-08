"use client";

import { useEffect, useMemo, useState } from "react";
import MultiSelect from "@/components/MultiSelect";
import { getIngredients, getPreferences, searchRecipes } from "@/lib/backend";
import type { Recipe } from "@/lib/types";

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial laden (Ingredients + Preferences)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingInit(true);
      setError(null);

      try {
        const [ing, pref] = await Promise.all([
          getIngredients(),
          getPreferences(),
        ]);

        if (cancelled) return;
        setIngredients(ing);
        setPreferences(pref);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unbekannter Fehler");
      } finally {
        if (!cancelled) setLoadingInit(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const canSearch = useMemo(() => {
    // Dein Backend braucht aktuell beide Params,
    // also erzwingen wir hier mind. 1 Ingredient und 1 Preference.
    return selectedIngredients.length > 0 && selectedPreferences.length > 0;
  }, [selectedIngredients.length, selectedPreferences.length]);

  async function onSearch() {
    setLoadingSearch(true);
    setError(null);

    try {
      const data = await searchRecipes({
        ingredients: selectedIngredients,
        preferences: selectedPreferences,
      });
      setRecipes(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler");
      setRecipes([]);
    } finally {
      setLoadingSearch(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">MampfMacher</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Wähle Zutaten & Präferenzen und finde passende Rezepte.
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {loadingInit ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Lade Zutaten und Präferenzen...
          </p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <MultiSelect
                title="Zutaten"
                options={ingredients}
                selected={selectedIngredients}
                onChange={setSelectedIngredients}
                placeholder="Zutat suchen..."
              />
              <MultiSelect
                title="Präferenzen"
                options={preferences}
                selected={selectedPreferences}
                onChange={setSelectedPreferences}
                placeholder="Präferenz suchen..."
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onSearch}
                disabled={!canSearch || loadingSearch}
                className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {loadingSearch ? "Suche..." : "Rezepte suchen"}
              </button>

              {!canSearch && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Bitte mindestens 1 Zutat und 1 Präferenz auswählen.
                </p>
              )}
            </div>

            <section className="mt-8">
              <h2 className="text-xl font-semibold">Ergebnisse</h2>

              {recipes.length === 0 ? (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Noch keine Ergebnisse (oder nichts gefunden).
                </p>
              ) : (
                <div className="mt-4 grid gap-4">
                  {recipes.map((r) => {
                    const matchCount = r.ingredients.filter((i) =>
                      selectedIngredients.includes(i.name)
                    ).length;

                    return (
                      <article
                        key={r.id}
                        className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                      >
                        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
                          <div>
                            <h3 className="text-lg font-semibold">{r.name}</h3>
                            {r.description ? (
                              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                {r.description}
                              </p>
                            ) : null}
                          </div>

                          <div className="text-sm text-zinc-600 dark:text-zinc-400">
                            Matches:{" "}
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">
                              {matchCount}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {r.ingredients.map((i) => (
                            <span
                              key={i.id}
                              className="rounded-full border border-zinc-200 px-2 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                            >
                              {i.name}
                            </span>
                          ))}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {r.preferences.map((p) => (
                            <span
                              key={p.id}
                              className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                            >
                              {p.name}
                            </span>
                          ))}
                        </div>

                        {r.recipeUrl ? (
                          <div className="mt-4">
                            <a
                              href={r.recipeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-700 dark:hover:decoration-zinc-100"
                            >
                              Rezept öffnen
                            </a>
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

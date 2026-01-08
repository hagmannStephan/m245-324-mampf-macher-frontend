import type { Recipe } from "@/lib/types";

const BASE = "/api/backend";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Backend-Fehler ${res.status}: ${body || res.statusText}`);
  }

  return (await res.json()) as T;
}

export async function getIngredients(): Promise<string[]> {
  return apiFetch<string[]>("/ingredients");
}

export async function getPreferences(): Promise<string[]> {
  return apiFetch<string[]>("/preferences");
}

export async function searchRecipes(params: {
  ingredients: string[];
  preferences: string[];
}): Promise<Recipe[]> {
  const qs = new URLSearchParams();

  // Backend erwartet: ?ingredients=a&ingredients=b&preferences=x&preferences=y
  params.ingredients.forEach((i) => qs.append("ingredients", i));
  params.preferences.forEach((p) => qs.append("preferences", p));

  return apiFetch<Recipe[]>(`/recipe?${qs.toString()}`);
}

"use client";

import { useCart } from "@/components/cart/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { items, setQuantity, removeItem, clear, totalItems } = useCart();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Warenkorb</h1>

      {items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Dein Warenkorb ist leer.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Rezepte suchen
          </Link>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Total Items: <span className="font-semibold">{totalItems}</span>
            </p>
            <button
              type="button"
              onClick={clear}
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Alles leeren
            </button>
          </div>

          <ul className="space-y-3">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex flex-col gap-2 rounded-lg border border-zinc-100 p-3 dark:border-zinc-900 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold">{it.name}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {it.unit ? `Einheit: ${it.unit}` : " "}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(it.id, it.quantity - 1)}
                    className="rounded-lg border border-zinc-200 px-3 py-1 text-sm dark:border-zinc-800"
                  >
                    -
                  </button>

                  <input
                    value={it.quantity}
                    onChange={(e) => setQuantity(it.id, Number(e.target.value || 0))}
                    className="w-16 rounded-lg border border-zinc-200 px-2 py-1 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                    inputMode="numeric"
                  />

                  <button
                    type="button"
                    onClick={() => setQuantity(it.id, it.quantity + 1)}
                    className="rounded-lg border border-zinc-200 px-3 py-1 text-sm dark:border-zinc-800"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    className="ml-2 rounded-lg border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-200 dark:hover:bg-red-950"
                  >
                    Entfernen
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-end">
            <Link
              href="/checkout"
              className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              Weiter zum Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

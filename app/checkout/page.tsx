"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartContext";

export default function CheckoutPage() {
  const { items, clear } = useCart();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return items.length > 0 && fullName.trim() && email.trim() && address.trim();
  }, [items.length, fullName, email, address]);

  async function submit() {
    try {
      setMsg(null);

      const payload = {
        fullName,
        email,
        address,
        items, // kommt aus useCart()
      };

      const res = await fetch("/api/checkout/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Checkout fehlgeschlagen (${res.status}): ${text}`);
      }

      setMsg("Bestellung erfolgreich abgesendet.");
      clear();
    } catch (e: any) {
      setMsg(e?.message ?? "Checkout fehlgeschlagen.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {msg && (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          {msg}
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Deine Daten</h2>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Name</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              />
            </label>

            <label className="block">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">E-Mail</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              />
            </label>

            <label className="block">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Adresse</span>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                rows={4}
              />
            </label>
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={submit}
            className="mt-5 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Bestellung abschicken
          </button>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Warenkorb</h2>

          {items.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Warenkorb ist leer.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2 text-sm dark:border-zinc-900"
                >
                  <span>{it.name}</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {it.quantity} {it.unit ?? ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

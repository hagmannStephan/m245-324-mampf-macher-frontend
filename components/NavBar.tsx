"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";

function cls(active: boolean) {
  return active
    ? "rounded-lg px-3 py-2 text-sm font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
    : "rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900";
}

export default function NavBar() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base font-bold">
          MampfMacher
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/" className={cls(pathname === "/")}>
            Rezepte
          </Link>

          <Link href="/cart" className={cls(pathname === "/cart")}>
            Warenkorb
            {totalItems > 0 ? (
              <span className="ml-2 rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                {totalItems}
              </span>
            ) : null}
          </Link>

          <Link href="/checkout" className={cls(pathname === "/checkout")}>
            Checkout
          </Link>
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

const LINKS = [
  { href: "/dados", label: "Dados" },
  { href: "/fichas", label: "Fichas" },
  { href: "/bestiario", label: "Bestiário" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-20 px-6 md:px-16 flex items-center justify-between bg-void/90 backdrop-blur border-b border-gold/20">
      <Link href={user ? "/home" : "/"} className="flex items-center gap-3 group">
        <svg width="34" height="34" viewBox="0 0 34 34" className="text-ember group-hover:text-emberlight transition-colors">
          <path d="M17 2 L30 10 V24 L17 32 L4 24 V10 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M17 9 L23 13 V21 L17 25 L11 21 V13 Z" fill="currentColor" opacity="0.85" />
        </svg>
        <span className="font-display text-lg tracking-[0.2em] text-bone hidden sm:block">
          WILDERFEAST
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`font-display text-sm uppercase tracking-widest transition-colors ${
              pathname.startsWith(l.href) ? "text-ember" : "text-bone/80 hover:text-gold"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="relative">
        {user ? (
          <>
            <button
              onClick={() => setOpen((o) => !o)}
              className="font-display text-sm uppercase tracking-widest text-bone/90 hover:text-gold transition-colors"
            >
              {user.nome} ▾
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-3 panel px-4 py-3 min-w-[160px]">
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                    router.push("/");
                  }}
                  className="font-display text-xs uppercase tracking-widest text-bloodmoon hover:text-bone transition-colors"
                >
                  Encerrar caçada
                </button>
              </div>
            )}
          </>
        ) : (
          <Link href="/login" className="btn-ghost !px-4 !py-2 !text-xs">
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}

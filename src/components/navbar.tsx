"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, PenLine } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((d) => setIsAdmin(d.authenticated))
      .catch(() => {});
  }, [pathname]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Blogs" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <PenLine className="h-6 w-6 text-violet-400" />
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            BlogVerse
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {isAdmin ? (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-violet-500/50 text-violet-400 hover:bg-violet-500/10">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-violet-500/50 text-violet-400 hover:bg-violet-500/10">
                Admin Login
              </Button>
            </Link>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-black/90 md:hidden">
          <div className="flex flex-col gap-4 px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-300 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            {isAdmin ? (
              <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-sm text-violet-400">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm text-violet-400">
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

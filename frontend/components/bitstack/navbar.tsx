"use client"

import { motion } from "framer-motion"

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div
        aria-hidden
        className="relative h-8 w-8 rounded-md bg-gradient-to-br from-primary to-accent grid place-items-center shadow-[0_0_30px_-5px_var(--color-primary)]"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-primary-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 7h6a3 3 0 0 1 0 6H4z" />
          <path d="M4 13h7a3 3 0 0 1 0 6H4z" />
        </svg>
      </div>
      <span className="font-sans text-lg font-semibold tracking-tight">BitStack</span>
    </div>
  )
}

export function Navbar() {
  const links = [
    { label: "Features", href: "#features" },
    { label: "Studio", href: "#studio" },
  ]

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="glass rounded-full px-4 py-2.5 flex items-center justify-between">
          <Logo />
          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Spacer to keep logo + links balanced now that CTAs are removed */}
          <div aria-hidden className="w-8" />
        </nav>
      </div>
    </motion.header>
  )
}

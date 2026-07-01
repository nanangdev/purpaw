"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

export type Theme = "light" | "dark" | "auto"
type Resolved = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: Resolved
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

// Harus sama dengan key di inline anti-flash script (__root.tsx).
const STORAGE_KEY = "theme"

function getSystem(): Resolved {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function resolve(theme: Theme): Resolved {
  return theme === "auto" ? getSystem() : theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // State awal statik — JANGAN baca window/localStorage saat render (crash SSR / hydration mismatch).
  const [theme, setThemeState] = useState<Theme>("auto")
  const [resolvedTheme, setResolvedTheme] = useState<Resolved>("dark")

  // Sync dari localStorage saat mount.
  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "auto"
    setThemeState(stored)
  }, [])

  // Terapkan theme ke <html> dan dengarkan sistem saat "auto".
  useEffect(() => {
    const resolved = resolve(theme)
    setResolvedTheme(resolved)
    const root = document.documentElement
    const apply = (r: Resolved) => {
      root.classList.toggle("dark", r === "dark")
      root.style.colorScheme = r
    }
    apply(resolved)

    if (theme !== "auto") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => apply(getSystem())
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // abaikan (mode privat, dsb.)
    }
    setThemeState(next)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}

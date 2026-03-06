import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Unknown"
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatYear(dateStr: string | null): string {
  if (!dateStr) return ""
  return new Date(dateStr).getFullYear().toString()
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function formatMetricValue(value: number): string {
  if (Number.isInteger(value)) return value.toString()
  if (Math.abs(value) >= 100) return value.toFixed(1)
  if (Math.abs(value) >= 1) return value.toFixed(3)
  return value.toFixed(4)
}

export function arxivUrl(arxivId: string): string {
  return `https://arxiv.org/abs/${arxivId}`
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + "…" : str
}

export function formatSize(gb: number | null): string {
  if (gb === null) return "Unknown"
  if (gb < 1) return `${(gb * 1000).toFixed(0)} MB`
  if (gb < 1000) return `${gb.toFixed(0)} GB`
  return `${(gb / 1000).toFixed(1)} TB`
}

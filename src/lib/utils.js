// src/lib/utils.js
// Utilitário para mesclar classes do Tailwind
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price?: number | null, type?: string, minPrice?: number | null, maxPrice?: number | null): string {
  const formatSingle = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2).replace(/\.00$/, "")} L`;
    } else if (val >= 1000) {
      return `₹${(val / 1000).toFixed(2).replace(/\.00$/, "")} K`;
    }
    return `₹${val.toLocaleString()}`;
  };

  if (type === "sale") {
    if (minPrice && maxPrice && minPrice !== maxPrice) {
      return `${formatSingle(minPrice)} - ${formatSingle(maxPrice)}`;
    }
    return formatSingle(price || minPrice || 0);
  } else if (type === "lease") {
    return `${formatSingle(price || minPrice || 0)} (Lease)`;
  } else if (type === "rent") {
    return `${formatSingle(price || minPrice || 0)} / month`;
  }

  return formatSingle(price || minPrice || 0);
}

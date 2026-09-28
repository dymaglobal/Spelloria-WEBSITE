export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined || isNaN(Number(price))) return "₹0";
  const num = typeof price === "string" ? parseFloat(price) : price;
  const formatted =
    num % 1 === 0
      ? Math.round(num).toLocaleString("en-IN")
      : num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `₹${formatted}`;
}

export function formatWeight(weightGrams: number | null | undefined): string {
  if (!weightGrams) return "Standard Portion";
  if (weightGrams >= 1000) {
    return `${(weightGrams / 1000).toFixed(1)} kg`;
  }
  return `${weightGrams}g`;
}

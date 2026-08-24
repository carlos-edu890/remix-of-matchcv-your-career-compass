export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatSalaryRange(min: number, max: number): string {
  if (!min && !max) return "A combinar";
  return `${formatCurrency(min)} — ${formatCurrency(max)}`;
}

export function formatMonthYear(value: string): string {
  if (!value) return "";
  const [year, month] = value.split("-");
  if (!month) return year ?? value;
  const months = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];
  const idx = Number(month) - 1;
  return `${months[idx] ?? month}/${year}`;
}

export function relativeDate(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.max(0, Math.round((Date.now() - then) / 86_400_000));
  if (days === 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 30) return `há ${days} dias`;
  const months = Math.round(days / 30);
  return months <= 1 ? "há 1 mês" : `há ${months} meses`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

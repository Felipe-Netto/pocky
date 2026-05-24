export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

export function buildMonthRange(month: string): { gte: Date; lte: Date } | null {
  const [yearPart, monthPart] = month.split("-");

  if (!yearPart || !monthPart) {
    return null;
  }

  const year = Number(yearPart);
  const monthIndex = Number(monthPart) - 1;

  if (Number.isNaN(year) || Number.isNaN(monthIndex)) {
    return null;
  }

  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

  return { gte: start, lte: end };
}

export function getPreviousMonth(month: string): string {
  const range = buildMonthRange(month);

  if (!range) {
    return month;
  }

  const date = new Date(range.gte);
  date.setMonth(date.getMonth() - 1);

  const year = date.getFullYear();
  const monthValue = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${monthValue}`;
}

export function getNextMonth(month: string = getCurrentMonth()): string {
  const range = buildMonthRange(month);

  if (!range) {
    return month;
  }

  const date = new Date(range.gte);
  date.setMonth(date.getMonth() + 1);

  const year = date.getFullYear();
  const monthValue = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${monthValue}`;
}

export function formatMonthLabel(month: string): string {
  const range = buildMonthRange(month);

  if (!range) {
    return month;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(range.gte);
}

export function getDaysInMonth(month: string): number {
  const range = buildMonthRange(month);

  if (!range) {
    return 30;
  }

  return new Date(range.lte).getDate();
}

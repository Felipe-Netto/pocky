type TrendDirection = "higher-is-better" | "lower-is-better";

type TrendResult = {
  label: string;
  trend: "positive" | "negative" | "neutral";
};

export function buildPercentTrend(
  current: number,
  previous: number,
  direction: TrendDirection,
): TrendResult {
  if (previous === 0 && current === 0) {
    return { label: "Igual ao mês anterior", trend: "neutral" };
  }

  if (previous === 0) {
    if (current === 0) {
      return { label: "Igual ao mês anterior", trend: "neutral" };
    }

    const trend =
      direction === "higher-is-better" ? "positive" : "negative";

    return { label: "Sem base no mês anterior", trend };
  }

  const change = Math.round(((current - previous) / previous) * 100);
  const sign = change > 0 ? "+" : "";
  const label = `${sign}${change}% vs mês anterior`;

  if (change === 0) {
    return { label: "Igual ao mês anterior", trend: "neutral" };
  }

  const increased = change > 0;
  const trend =
    direction === "higher-is-better"
      ? increased
        ? "positive"
        : "negative"
      : increased
        ? "negative"
        : "positive";

  return { label, trend };
}

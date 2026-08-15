export const formatDate = (value: string) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en").format(value);

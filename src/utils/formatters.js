export const formatCurrency = (n) =>
  "$" + Math.round(Math.abs(n)).toLocaleString("en-US");

export const formatDate = (d) =>
  new Date(d + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
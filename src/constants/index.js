export const COLORS = {
  bg: "#070B11", surface: "#0D1624", border: "#1A2B40",
  text: "#E8EFF8", muted: "#4A6280", accent: "#3D6EF5",
  green: "#10B981", red: "#F43F5E", amber: "#F59E0B",
  deep: "#060910", mid: "#0A1220",
};

export const STYLES = {
  CARD: { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "18px 20px" },
  INP: { background: COLORS.deep, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 13, width: "100%", boxSizing: "border-box", outline: "none" }
};

export const CATEGORIES = [
  { name: "Housing",       color: "#3D6EF5", icon: "🏠" },
  { name: "Food",          color: "#10B981", icon: "🍔" },
  { name: "Transport",     color: "#F59E0B", icon: "🚗" },
  { name: "Entertainment", color: "#8B5CF6", icon: "🎬" },
  { name: "Healthcare",    color: "#EF4444", icon: "🏥" },
  { name: "Shopping",      color: "#EC4899", icon: "🛍️" },
  { name: "Utilities",     color: "#06B6D4", icon: "⚡" },
  { name: "Other",         color: "#6B7280", icon: "📦" },
];

export const DEFAULTS = [
  { id: 1,  description: "Monthly Rent",      amount: -1500, category: "Housing",       date: "2026-06-01" },
  { id: 2,  description: "Salary Deposit",    amount:  4800, category: "Income",        date: "2026-06-01" },
  { id: 3,  description: "Trader Joe's",      amount:  -127, category: "Food",          date: "2026-06-05" },
  { id: 4,  description: "Netflix + Spotify", amount:   -28, category: "Entertainment", date: "2026-06-07" },
  { id: 5,  description: "Gas Station",       amount:   -62, category: "Transport",     date: "2026-06-08" },
  { id: 6,  description: "Electric Bill",     amount:   -89, category: "Utilities",     date: "2026-06-10" },
  { id: 7,  description: "Restaurant Dinner", amount:   -74, category: "Food",          date: "2026-06-12" },
  { id: 8,  description: "Amazon Order",      amount:   -96, category: "Shopping",      date: "2026-06-14" },
  { id: 9,  description: "Doctor Visit",      amount:   -45, category: "Healthcare",    date: "2026-06-15" },
  { id: 10, description: "Freelance Payment", amount:   650, category: "Income",        date: "2026-06-16" },
];
import React from "react";
import { COLORS } from "../constants";
import { formatCurrency } from "../utils/formatters";

export default function PieTip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px" }}>
      <div style={{ color: p.payload.color, fontWeight: 700, fontSize: 11, marginBottom: 2 }}>{p.name}</div>
      <div style={{ color: COLORS.text, fontFamily: "monospace", fontSize: 15, fontWeight: 700 }}>{formatCurrency(p.value)}</div>
    </div>
  );
}
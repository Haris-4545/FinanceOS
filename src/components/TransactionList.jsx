import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { COLORS, STYLES, CATEGORIES } from "../constants";
import { formatDate, formatCurrency } from "../utils/formatters";

export default function TransactionList({ txns, openEdit, confirmDelete }) {
  const [filter, setFilter] = useState("all");

  const displayed = txns
    .filter(t => filter === "all" ? true : filter === "income" ? t.amount > 0 : t.amount < 0)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={STYLES.CARD}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Transactions</div>
          <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>{displayed.length} record{displayed.length !== 1 ? "s" : ""}</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "income", "expense"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? COLORS.accent : COLORS.deep,
              border: `1px solid ${filter === f ? COLORS.accent : COLORS.border}`,
              color: filter === f ? "#fff" : COLORS.muted,
              borderRadius: 6, padding: "4px 12px", fontSize: 11, cursor: "pointer",
              fontWeight: filter === f ? 700 : 400, textTransform: "capitalize",
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 84px 90px 72px", paddingBottom: 8, borderBottom: `1px solid ${COLORS.border}`, marginBottom: 4 }}>
        {["Description", "Category", "Date", "Amount", ""].map((h, i) => (
          <span key={i} style={{ fontSize: 10, fontWeight: 600, color: COLORS.muted, letterSpacing: "0.07em", textTransform: "uppercase", textAlign: i >= 3 ? "right" : "left" }}>{h}</span>
        ))}
      </div>

      <div style={{ maxHeight: 340, overflowY: "auto" }}>
        {displayed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "44px 0", color: COLORS.muted, fontSize: 13 }}>
            No transactions yet — hit <strong style={{ color: COLORS.accent }}>Add</strong> to get started.
          </div>
        ) : displayed.map(t => {
          const cat = CATEGORIES.find(c => c.name === t.category);
          const isInc = t.amount > 0;
          const tColor = isInc ? COLORS.green : (cat?.color || COLORS.muted);
          return (
            <div key={t.id} style={{ display: "grid", gridTemplateColumns: "1fr 110px 84px 90px 72px", alignItems: "center", padding: "9px 0", borderBottom: `1px solid #0A1218` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 8, minWidth: 0 }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, flexShrink: 0, background: tColor + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                  {isInc ? "💰" : (cat?.icon || "📦")}
                </div>
                <span style={{ fontSize: 13, color: "#CBD5E1", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.description}
                </span>
              </div>
              <div>
                <span style={{ background: tColor + "22", color: tColor, borderRadius: 5, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>
                  {isInc ? "Income" : t.category}
                </span>
              </div>
              <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: "monospace" }}>{formatDate(t.date)}</div>
              <div style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 700, fontSize: 13, color: isInc ? COLORS.green : COLORS.red }}>
                {isInc ? "+" : "-"}{formatCurrency(t.amount)}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
                <button onClick={() => openEdit(t)} title="Edit" style={{ background: COLORS.mid, border: `1px solid ${COLORS.border}`, borderRadius: 5, padding: "4px 7px", cursor: "pointer", color: COLORS.muted, display: "flex" }}>
                  <Pencil size={11} />
                </button>
                <button onClick={() => confirmDelete(t.id)} title="Delete" style={{ background: COLORS.mid, border: `1px solid ${COLORS.border}`, borderRadius: 5, padding: "4px 7px", cursor: "pointer", color: COLORS.muted, display: "flex" }}>
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Pencil, Trash2, X, Check, Wallet, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";

import { COLORS, STYLES, CATEGORIES } from "./constants";
import { formatCurrency } from "./utils/formatters";
import { useFinance } from "./hooks/useFinance";
import TransactionList from "./components/TransactionList";
import PieTip from "./components/PieTip";

export default function App() {
  const finance = useFinance();

  const [editBudget, setEditBudget] = useState(false);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteConf, setDeleteConf] = useState(null);
  const [form, setForm] = useState({
    description: "", amount: "", category: "Food",
    date: new Date().toISOString().split("T")[0], type: "expense",
  });

  if (!finance.loaded) return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: COLORS.muted, fontFamily: "monospace", letterSpacing: 4, fontSize: 11 }}>LOADING</span>
    </div>
  );

  const openAdd = () => {
    setEditId(null);
    setForm({ description: "", amount: "", category: "Food", date: new Date().toISOString().split("T")[0], type: "expense" });
    setModal(true);
  };

  const openEdit = (t) => {
    setEditId(t.id);
    setForm({
      description: t.description,
      amount: String(Math.abs(t.amount)),
      category: t.amount > 0 ? "Food" : t.category,
      date: t.date,
      type: t.amount >= 0 ? "income" : "expense",
    });
    setModal(true);
  };

  const submit = () => {
    if (!form.description.trim() || !form.amount || +form.amount <= 0) return;
    const amt = form.type === "expense" ? -Math.abs(+form.amount) : +form.amount;
    const cat = form.type === "income" ? "Income" : form.category;
    const next = editId
      ? finance.txns.map(t => t.id === editId ? { ...t, description: form.description.trim(), amount: amt, category: cat, date: form.date } : t)
      : [...finance.txns, { id: Date.now(), description: form.description.trim(), amount: amt, category: cat, date: form.date }];
    
    finance.updateTransactions(next);
    setModal(false);
  };

  const doDelete = () => {
    const next = finance.txns.filter(t => t.id !== deleteConf);
    finance.updateTransactions(next);
    setDeleteConf(null);
  };

  const saveBudget = () => {
    finance.updateBudget(+finance.budgetStr || finance.budget);
    setEditBudget(false);
  };

  const canSubmit = form.description.trim() && form.amount && +form.amount > 0;

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ── HEADER ── */}
      <div style={{ background: "#08101B", borderBottom: `1px solid ${COLORS.border}`, padding: "13px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: COLORS.accent, borderRadius: 8, padding: "7px 8px", display: "flex" }}>
            <Wallet size={15} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>FinanceOS</div>
            <div style={{ color: COLORS.muted, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>Personal Finance Tracker</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: COLORS.muted }}>
            June 2026
          </span>
          <button onClick={openAdd} style={{ background: COLORS.accent, border: "none", borderRadius: 7, padding: "7px 14px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 24px", maxWidth: 1100, margin: "0 auto" }}>
        {/* ── STAT CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
          {[
            { label: "Net Balance",  val: finance.balance,             color: finance.balance >= 0 ? COLORS.green : COLORS.red,  icon: <Wallet size={15} />,      sign: finance.balance >= 0 ? "+" : "-" },
            { label: "Total Income", val: finance.income,              color: COLORS.green,                                      icon: <ArrowUpRight size={15} />, sign: "+" },
            { label: "Total Spent",  val: finance.expenses,            color: COLORS.red,                                        icon: <ArrowDownRight size={15}/>, sign: "-" },
            { label: "Budget Left",  val: Math.abs(finance.left),      color: finance.scColor,                                   icon: <Target size={15} />,      sign: finance.left < 0 ? "-" : "" },
          ].map((s, i) => (
            <div key={i} style={{ ...STYLES.CARD, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ color: COLORS.muted, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</span>
                <span style={{ color: s.color }}>{s.icon}</span>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 21, fontWeight: 700, color: s.color, letterSpacing: "-0.02em" }}>
                {s.sign}{formatCurrency(s.val)}
              </div>
            </div>
          ))}
        </div>

        {/* ── CHARTS ROW ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
          
          {/* PIE CHART */}
          <div style={STYLES.CARD}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Spending Breakdown</div>
                <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>By category this month</div>
              </div>
              <span style={{ background: COLORS.mid, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "3px 10px", fontSize: 11, color: COLORS.muted }}>
                {finance.pieData.length} categor{finance.pieData.length === 1 ? "y" : "ies"}
              </span>
            </div>

            {finance.pieData.length === 0 ? (
              <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.muted, fontSize: 13 }}>
                No expense data yet
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: "55%" }}>
                  <ResponsiveContainer width="100%" height={190}>
                    <PieChart>
                      <Pie data={finance.pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                        {finance.pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip content={<PieTip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  {finance.pieData.slice(0, 6).map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: "#8BA3C4" }}>{d.name}</span>
                      </div>
                      <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: COLORS.text }}>{formatCurrency(d.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BUDGET TRACKER */}
          <div style={STYLES.CARD}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Monthly Budget</div>
                <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>Spending limit tracker</div>
              </div>
              <span style={{ background: finance.scColor + "22", border: `1px solid ${finance.scColor}44`, borderRadius: 20, padding: "3px 10px", fontSize: 11, color: finance.scColor, fontWeight: 700 }}>
                {finance.scLabel}
              </span>
            </div>

            {/* Editable limit */}
            <div style={{ background: COLORS.deep, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: COLORS.muted, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Monthly Limit</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {editBudget ? (
                  <>
                    <span style={{ color: COLORS.muted, fontSize: 13, fontFamily: "monospace" }}>$</span>
                    <input
                      value={finance.budgetStr}
                      onChange={e => finance.setBudgetStr(e.target.value.replace(/\D/g, ""))}
                      onKeyDown={e => { if (e.key === "Enter") saveBudget(); if (e.key === "Escape") setEditBudget(false); }}
                      autoFocus
                      style={{ background: COLORS.mid, border: `1px solid ${COLORS.accent}`, borderRadius: 5, padding: "3px 8px", color: COLORS.text, fontFamily: "monospace", fontSize: 14, width: 80, textAlign: "right", outline: "none" }}
                    />
                    <button onClick={saveBudget} style={{ background: "none", border: "none", color: COLORS.green, cursor: "pointer", padding: 2, display: "flex" }}><Check size={14} /></button>
                    <button onClick={() => { finance.setBudgetStr(String(finance.budget)); setEditBudget(false); }} style={{ background: "none", border: "none", color: COLORS.red, cursor: "pointer", padding: 2, display: "flex" }}><X size={14} /></button>
                  </>
                ) : (
                  <>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 16 }}>{formatCurrency(finance.budget)}</span>
                    <button onClick={() => setEditBudget(true)} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", padding: 2, display: "flex" }}>
                      <Pencil size={12} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 12 }}>
                <span style={{ color: COLORS.muted }}>Spent this month</span>
                <span style={{ fontFamily: "monospace", color: finance.scColor, fontWeight: 700 }}>{Math.round(finance.pct)}%</span>
              </div>
              <div style={{ background: COLORS.mid, borderRadius: 999, height: 10, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
                <div style={{
                  width: `${finance.pct}%`, height: "100%", borderRadius: 999,
                  background: `linear-gradient(90deg, ${finance.scColor}99, ${finance.scColor})`,
                  boxShadow: `0 0 10px ${finance.scColor}88`,
                  transition: "width 0.6s ease, background 0.5s, box-shadow 0.5s",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: COLORS.muted, fontFamily: "monospace" }}>
                <span>{formatCurrency(finance.expenses)} spent</span>
                <span style={{ color: finance.left < 0 ? COLORS.red : COLORS.muted }}>{formatCurrency(Math.abs(finance.left))} {finance.left >= 0 ? "remaining" : "over budget"}</span>
              </div>
            </div>

            {/* Top category mini bars */}
            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
              <div style={{ fontSize: 10, color: COLORS.muted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Top categories</div>
              {finance.pieData.slice(0, 4).map((d, i) => (
                <div key={i} style={{ marginBottom: 9 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                    <span style={{ color: "#8BA3C4" }}>{d.name}</span>
                    <span style={{ fontFamily: "monospace", color: COLORS.text, fontWeight: 600 }}>{formatCurrency(d.value)}</span>
                  </div>
                  <div style={{ background: COLORS.mid, borderRadius: 999, height: 4 }}>
                    <div style={{ width: `${finance.expenses > 0 ? Math.min((d.value / finance.expenses) * 100, 100) : 0}%`, height: "100%", borderRadius: 999, background: d.color, opacity: 0.9 }} />
                  </div>
                </div>
              ))}
              {finance.pieData.length === 0 && <div style={{ color: COLORS.muted, fontSize: 12, textAlign: "center" }}>No data yet</div>}
            </div>
          </div>
        </div>

        {/* ── TRANSACTIONS ── */}
        <TransactionList 
           txns={finance.txns} 
           openEdit={openEdit} 
           confirmDelete={setDeleteConf} 
        />
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "#00000099", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 24, width: 390, boxShadow: "0 32px 80px #000000AA" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{editId ? "Edit Transaction" : "New Transaction"}</span>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", display: "flex" }}><X size={16} /></button>
            </div>

            {/* Type toggle */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 14 }}>
              {[["expense", "💸  Expense", COLORS.red], ["income", "💰  Income", COLORS.green]].map(([type, label, color]) => (
                <button key={type} onClick={() => setForm(f => ({ ...f, type }))} style={{
                  background: form.type === type ? color + "22" : COLORS.deep,
                  border: `1px solid ${form.type === type ? color + "66" : COLORS.border}`,
                  color: form.type === type ? color : COLORS.muted,
                  borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
                }}>{label}</button>
              ))}
            </div>

            {/* Description */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 10, color: COLORS.muted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>Description</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What was this for?" style={{ ...STYLES.INP }} onKeyDown={e => e.key === "Enter" && canSubmit && submit()} />
            </div>

            {/* Amount */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 10, color: COLORS.muted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>Amount ($)</label>
              <input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" style={{ ...STYLES.INP, fontFamily: "monospace" }} />
            </div>

            {/* Category */}
            {form.type === "expense" && (
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 10, color: COLORS.muted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...STYLES.INP, colorScheme: "dark" }}>
                  {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.icon}  {c.name}</option>)}
                </select>
              </div>
            )}

            {/* Date */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 10, color: COLORS.muted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ ...STYLES.INP, colorScheme: "dark" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button onClick={() => setModal(false)} style={{ background: COLORS.deep, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 10, color: COLORS.muted, fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={submit} disabled={!canSubmit} style={{ background: canSubmit ? COLORS.accent : "#1A2B40", border: "none", borderRadius: 8, padding: 10, color: canSubmit ? "#fff" : COLORS.muted, fontSize: 13, fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", transition: "background 0.2s" }}>
                {editId ? "Save Changes" : "Add Transaction"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConf && (
        <div style={{ position: "fixed", inset: 0, background: "#00000099", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 24, width: 320, boxShadow: "0 32px 80px #000000AA", textAlign: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: COLORS.red + "22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", border: `1px solid ${COLORS.red}44` }}>
              <Trash2 size={18} color={COLORS.red} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Delete Transaction?</div>
            <div style={{ color: COLORS.muted, fontSize: 13, marginBottom: 20 }}>This action cannot be undone.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button onClick={() => setDeleteConf(null)} style={{ background: COLORS.deep, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 10, color: COLORS.muted, fontSize: 13, cursor: "pointer" }}>Keep it</button>
              <button onClick={doDelete} style={{ background: COLORS.red, border: "none", borderRadius: 8, padding: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
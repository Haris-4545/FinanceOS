import { useState, useEffect, useCallback } from "react";
import { DEFAULTS, CATEGORIES, COLORS } from "../constants";

export function useFinance() {
  const [txns, setTxns] = useState(DEFAULTS);
  const [budget, setBudget] = useState(3000);
  const [budgetStr, setBudgetStr] = useState("3000");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try { const r = await window.storage.get("ft3_txns");   if (r) setTxns(JSON.parse(r.value)); } catch {}
      try { const r = await window.storage.get("ft3_budget"); if (r) { setBudget(+r.value); setBudgetStr(r.value); } } catch {}
      setLoaded(true);
    })();
  }, []);

  const persist = useCallback(async (t, b) => {
    try { await window.storage.set("ft3_txns", JSON.stringify(t)); } catch {}
    try { await window.storage.set("ft3_budget", String(b)); } catch {}
  }, []);

  const income = txns.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenses = txns.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const balance = income - expenses;
  const pct = Math.min((expenses / Math.max(budget, 1)) * 100, 100);
  const left = budget - expenses;

  const scColor = pct < 60 ? COLORS.green : pct < 85 ? COLORS.amber : COLORS.red;
  const scLabel = pct < 60 ? "On track" : pct < 85 ? "Caution" : "Over budget";

  const pieData = CATEGORIES.map(c => ({
    name: c.name, color: c.color,
    value: Math.round(txns.filter(t => t.category === c.name && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)),
  })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  const updateBudget = (newBudget) => {
    const b = Math.max(1, newBudget);
    setBudget(b);
    setBudgetStr(String(b));
    persist(txns, b);
  };

  const updateTransactions = (newTxns) => {
    setTxns(newTxns);
    persist(newTxns, budget);
  };

  return {
    txns, updateTransactions,
    budget, budgetStr, setBudgetStr, updateBudget,
    loaded, income, expenses, balance, pct, left, scColor, scLabel, pieData
  };
}
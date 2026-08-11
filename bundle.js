// main.jsx
import React2 from "react";
import { createRoot } from "react-dom/client";

// ledger.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Plus, X, TrendingUp, Receipt, Clock, Trash2, Pencil, Check, ChevronDown, ChevronRight, Archive, RotateCcw, RotateCw, Repeat, Menu, ArrowLeft, Wallet } from "lucide-react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, CartesianGrid } from "recharts";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var BG = "#121A16";
var SURFACE = "#1C2A22";
var SURFACE_2 = "#24352A";
var HEADER = "#0B120E";
var HEADER_TEXT = "#ECF0E7";
var LINE = "#33453A";
var TEXT = "#E9EDE5";
var MUTED = "#8FA093";
var CREDIT = "#4CAF77";
var DEBIT = "#E0705A";
var GOLD = "#D9AA4E";
var TRANSFER = "#6FA0C4";
var ACCENT = "#2F5A40";
var DISABLED = "#33453A";
var DISABLED_TEXT = "#6C7A70";
var TYPES = {
  income: { label: "Income", color: CREDIT, sign: 1, verb: "received" },
  bill: { label: "Bill", color: DEBIT, sign: -1, verb: "paid" },
  expense: { label: "Expense", color: DEBIT, sign: -1, verb: "logged" }
};
var ACCOUNT_COLORS = ["#5FA8A0", "#B08AD9", "#C9A24A", "#7F9BC9"];
function accountColorFor(accountId, accounts) {
  const idx = accounts.findIndex((a) => a.id === accountId);
  if (idx === -1) return MUTED;
  return ACCOUNT_COLORS[idx % ACCOUNT_COLORS.length];
}
var STATUS_ORDER = ["upcoming", "pending", "complete", "canceled"];
var STATUSES = {
  upcoming: { label: "Upcoming", color: MUTED },
  pending: { label: "Pending", color: GOLD },
  complete: { label: "Complete", color: CREDIT },
  canceled: { label: "Canceled", color: DEBIT }
};
function defaultStatus(t, todayStr) {
  return t.date <= todayStr ? "complete" : "upcoming";
}
function getStatus(t, todayStr) {
  return t.status || defaultStatus(t, todayStr);
}
function isCounted(t) {
  return t.status !== "canceled";
}
function matchesAccountFilter(t, filter) {
  if (filter === "all") return true;
  if (t.type === "transfer") return t.fromAccountId === filter || t.toAccountId === filter;
  return t.accountId === filter;
}
var DEFAULT_ACCOUNTS = [
  { id: "a1", name: "TD-9918", opening: 0 },
  { id: "a2", name: "PFFCU-X", opening: 0 }
];
var DEFAULT_DEBTS = [
  { id: "d1", name: "Mortgage", balance: 0, apr: 0 },
  { id: "d2", name: "Carvana", balance: 0, apr: 0 },
  { id: "d3", name: "Prosper", balance: 0, apr: 0 },
  { id: "d4", name: "Chase", balance: 0, apr: 0 },
  { id: "d5", name: "Affirm", balance: 0, apr: 0 },
  { id: "d6", name: "GreenSky", balance: 0, apr: 0 },
  { id: "d7", name: "GoodLeap", balance: 0, apr: 0 },
  { id: "d8", name: "Aidvantage", balance: 0, apr: 0 },
  { id: "d9", name: "Amex", balance: 0, apr: 0 },
  { id: "d10", name: "PFFCU-C", balance: 0, apr: 0 },
  { id: "d11", name: "PFFCU PLOC", balance: 0, apr: 0 },
  { id: "d12", name: "Citi", balance: 0, apr: 0 },
  { id: "d13", name: "Power 1", balance: 0, apr: 0 },
  { id: "d14", name: "Power 2", balance: 0, apr: 0 }
];
var IMPORTED_2026 = [
  { id: "imp-0", type: "income", name: "Income deposit", amount: 1080, date: "2026-01-02", accountId: "a1", templateId: null },
  { id: "imp-0-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-01-02", accountId: "a2", templateId: null },
  { id: "imp-1", type: "bill", name: "Amex", amount: 100, date: "2026-01-02", accountId: "a1", templateId: null },
  { id: "imp-2", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-01-02", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-3", type: "transfer", name: "Transfer (Td)", amount: 600, date: "2026-01-02", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-4", type: "bill", name: "Power 1", amount: 312, date: "2026-01-03", accountId: "a1", templateId: null },
  { id: "imp-5", type: "bill", name: "Gas", amount: 50, date: "2026-01-03", accountId: "a2", templateId: null },
  { id: "imp-6", type: "expense", name: "T Mobile", amount: 322, date: "2026-01-03", accountId: "a2", templateId: null },
  { id: "imp-7", type: "transfer", name: "Transfer (Pffcu)", amount: 130, date: "2026-01-05", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-8", type: "expense", name: "Greensky (auto)", amount: 300, date: "2026-01-05", accountId: "a1", templateId: null },
  { id: "imp-9", type: "bill", name: "Aidvantage", amount: 40, date: "2026-01-07", accountId: "a1", templateId: null },
  { id: "imp-10", type: "income", name: "Income deposit", amount: 1080, date: "2026-01-09", accountId: "a1", templateId: null },
  { id: "imp-10-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-01-09", accountId: "a2", templateId: null },
  { id: "imp-11", type: "bill", name: "Verizon (auto)", amount: 112, date: "2026-01-09", accountId: "a1", templateId: null },
  { id: "imp-12", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-01-09", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-13", type: "transfer", name: "Transfer (Td)", amount: 100, date: "2026-01-09", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-14", type: "bill", name: "Mr Tire", amount: 50, date: "2026-01-10", accountId: "a1", templateId: null },
  { id: "imp-15", type: "bill", name: "Gas", amount: 50, date: "2026-01-10", accountId: "a2", templateId: null },
  { id: "imp-16", type: "expense", name: "Int", amount: 112, date: "2026-01-11", accountId: "a2", templateId: null },
  { id: "imp-17", type: "bill", name: "Affirm", amount: 250, date: "2026-01-12", accountId: "a1", templateId: null },
  { id: "imp-18", type: "bill", name: "Prosper", amount: 400, date: "2026-01-12", accountId: "a1", templateId: null },
  { id: "imp-19", type: "bill", name: "Maint", amount: 14, date: "2026-01-14", accountId: "a1", templateId: null },
  { id: "imp-20", type: "bill", name: "Aidvantage", amount: 40, date: "2026-01-14", accountId: "a1", templateId: null },
  { id: "imp-21", type: "income", name: "Income deposit", amount: 1080, date: "2026-01-16", accountId: "a1", templateId: null },
  { id: "imp-21-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-01-16", accountId: "a2", templateId: null },
  { id: "imp-22", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-01-16", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-23", type: "transfer", name: "Transfer (Td)", amount: 500, date: "2026-01-16", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-24", type: "income", name: "Income deposit", amount: 250, date: "2026-01-17", accountId: "a1", templateId: null },
  { id: "imp-25", type: "bill", name: "Power 2", amount: 87, date: "2026-01-17", accountId: "a1", templateId: null },
  { id: "imp-26", type: "expense", name: "PFFCU transaction", amount: 50, date: "2026-01-17", accountId: "a2", templateId: null },
  { id: "imp-27", type: "income", name: "Income deposit", amount: 100, date: "2026-01-18", accountId: "a1", templateId: null },
  { id: "imp-28", type: "bill", name: "Pseg", amount: 140, date: "2026-01-18", accountId: "a1", templateId: null },
  { id: "imp-29", type: "bill", name: "Car Ins", amount: 400, date: "2026-01-18", accountId: "a2", templateId: null },
  { id: "imp-30", type: "expense", name: "Affirm C", amount: 240, date: "2026-01-19", accountId: "a1", templateId: null },
  { id: "imp-31", type: "bill", name: "Walmart", amount: 150, date: "2026-01-20", accountId: "a1", templateId: null },
  { id: "imp-32", type: "bill", name: "Aidvantage", amount: 40, date: "2026-01-21", accountId: "a1", templateId: null },
  { id: "imp-33", type: "bill", name: "Drive", amount: 50, date: "2026-01-22", accountId: "a1", templateId: null },
  { id: "imp-34", type: "income", name: "Income deposit", amount: 1080, date: "2026-01-23", accountId: "a1", templateId: null },
  { id: "imp-34-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-01-23", accountId: "a2", templateId: null },
  { id: "imp-35", type: "bill", name: "Affirm", amount: 50, date: "2026-01-23", accountId: "a1", templateId: null },
  { id: "imp-36", type: "expense", name: "Ccmua", amount: 195, date: "2026-01-23", accountId: "a1", templateId: null },
  { id: "imp-37", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-01-23", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-38", type: "transfer", name: "Transfer (Td)", amount: 500, date: "2026-01-23", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-39", type: "expense", name: "Youtube", amount: 85, date: "2026-01-23", accountId: "a2", templateId: null },
  { id: "imp-40", type: "bill", name: "Gas", amount: 50, date: "2026-01-24", accountId: "a2", templateId: null },
  { id: "imp-41", type: "bill", name: "Goodleap (auto)", amount: 160, date: "2026-01-26", accountId: "a1", templateId: null },
  { id: "imp-42", type: "bill", name: "Chase", amount: 300, date: "2026-01-28", accountId: "a1", templateId: null },
  { id: "imp-43", type: "bill", name: "Aidvantage", amount: 40, date: "2026-01-28", accountId: "a1", templateId: null },
  { id: "imp-44", type: "income", name: "Income deposit", amount: 1050, date: "2026-01-29", accountId: "a1", templateId: null },
  { id: "imp-44-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-01-29", accountId: "a2", templateId: null },
  { id: "imp-45", type: "expense", name: "Cwood", amount: 219, date: "2026-01-29", accountId: "a1", templateId: null },
  { id: "imp-46", type: "income", name: "Income deposit", amount: 1080, date: "2026-01-30", accountId: "a1", templateId: null },
  { id: "imp-46-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-01-30", accountId: "a2", templateId: null },
  { id: "imp-47", type: "bill", name: "Apple", amount: 200, date: "2026-01-30", accountId: "a1", templateId: null },
  { id: "imp-48", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-01-30", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-49", type: "transfer", name: "Transfer (Td)", amount: 500, date: "2026-01-30", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-50", type: "bill", name: "Gas", amount: 50, date: "2026-01-31", accountId: "a2", templateId: null },
  { id: "imp-51", type: "bill", name: "Amex", amount: 200, date: "2026-02-02", accountId: "a1", templateId: null },
  { id: "imp-52", type: "expense", name: "Misc", amount: 200, date: "2026-02-02", accountId: "a2", templateId: null },
  { id: "imp-53", type: "bill", name: "Power 1", amount: 312, date: "2026-02-03", accountId: "a1", templateId: null },
  { id: "imp-54", type: "bill", name: "Pseg", amount: 740, date: "2026-02-04", accountId: "a1", templateId: null },
  { id: "imp-55", type: "bill", name: "Aidvantage", amount: 40, date: "2026-02-04", accountId: "a1", templateId: null },
  { id: "imp-56", type: "transfer", name: "Transfer (Pffcu)", amount: 300, date: "2026-02-05", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-57", type: "expense", name: "Greensky (auto)", amount: 300, date: "2026-02-05", accountId: "a1", templateId: null },
  { id: "imp-58", type: "income", name: "Income deposit", amount: 1080, date: "2026-02-06", accountId: "a1", templateId: null },
  { id: "imp-58-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-02-06", accountId: "a2", templateId: null },
  { id: "imp-59", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-02-06", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-60", type: "transfer", name: "Transfer (Td)", amount: 300, date: "2026-02-06", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-61", type: "expense", name: "Verizon", amount: 110, date: "2026-02-06", accountId: "a2", templateId: null },
  { id: "imp-62", type: "bill", name: "Gas", amount: 50, date: "2026-02-07", accountId: "a2", templateId: null },
  { id: "imp-63", type: "expense", name: "T Mobile", amount: 290, date: "2026-02-07", accountId: "a2", templateId: null },
  { id: "imp-64", type: "bill", name: "Mr Tire", amount: 50, date: "2026-02-10", accountId: "a1", templateId: null },
  { id: "imp-65", type: "bill", name: "Aidvantage", amount: 40, date: "2026-02-11", accountId: "a1", templateId: null },
  { id: "imp-66", type: "expense", name: "Int", amount: 112, date: "2026-02-11", accountId: "a2", templateId: null },
  { id: "imp-67", type: "bill", name: "Affirm", amount: 250, date: "2026-02-12", accountId: "a1", templateId: null },
  { id: "imp-68", type: "bill", name: "Prosper", amount: 400, date: "2026-02-12", accountId: "a1", templateId: null },
  { id: "imp-69", type: "income", name: "Income deposit", amount: 1080, date: "2026-02-13", accountId: "a1", templateId: null },
  { id: "imp-69-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-02-13", accountId: "a2", templateId: null },
  { id: "imp-70", type: "bill", name: "Apple", amount: 100, date: "2026-02-13", accountId: "a1", templateId: null },
  { id: "imp-71", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-02-13", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-72", type: "transfer", name: "Transfer (Td)", amount: 350, date: "2026-02-13", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-73", type: "income", name: "Income deposit", amount: 240, date: "2026-02-14", accountId: "a1", templateId: null },
  { id: "imp-74", type: "bill", name: "Maint", amount: 14, date: "2026-02-14", accountId: "a1", templateId: null },
  { id: "imp-75", type: "bill", name: "Gas", amount: 50, date: "2026-02-14", accountId: "a2", templateId: null },
  { id: "imp-76", type: "bill", name: "Power 2", amount: 87, date: "2026-02-17", accountId: "a1", templateId: null },
  { id: "imp-77", type: "bill", name: "Aidvantage", amount: 40, date: "2026-02-18", accountId: "a1", templateId: null },
  { id: "imp-78", type: "bill", name: "Car Ins", amount: 311, date: "2026-02-18", accountId: "a2", templateId: null },
  { id: "imp-79", type: "bill", name: "Affirm C (auto)", amount: 240, date: "2026-02-19", accountId: "a1", templateId: null },
  { id: "imp-80", type: "income", name: "Income deposit", amount: 1080, date: "2026-02-20", accountId: "a1", templateId: null },
  { id: "imp-80-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-02-20", accountId: "a2", templateId: null },
  { id: "imp-81", type: "bill", name: "Walmart", amount: 300, date: "2026-02-20", accountId: "a1", templateId: null },
  { id: "imp-82", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-02-20", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-83", type: "transfer", name: "Transfer (Td)", amount: 700, date: "2026-02-20", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-84", type: "bill", name: "Gas", amount: 50, date: "2026-02-21", accountId: "a2", templateId: null },
  { id: "imp-85", type: "bill", name: "Drive", amount: 200, date: "2026-02-22", accountId: "a1", templateId: null },
  { id: "imp-86", type: "bill", name: "Affirm", amount: 50, date: "2026-02-23", accountId: "a1", templateId: null },
  { id: "imp-87", type: "expense", name: "Youtube", amount: 85, date: "2026-02-23", accountId: "a2", templateId: null },
  { id: "imp-88", type: "transfer", name: "Transfer (Transfer)", amount: 100, date: "2026-02-24", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-89", type: "bill", name: "Aidvantage", amount: 40, date: "2026-02-25", accountId: "a1", templateId: null },
  { id: "imp-90", type: "bill", name: "Goodleap (auto)", amount: 160, date: "2026-02-26", accountId: "a1", templateId: null },
  { id: "imp-91", type: "income", name: "Income deposit", amount: 1080, date: "2026-02-27", accountId: "a1", templateId: null },
  { id: "imp-91-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-02-27", accountId: "a2", templateId: null },
  { id: "imp-92", type: "bill", name: "Apple", amount: 150, date: "2026-02-27", accountId: "a1", templateId: null },
  { id: "imp-93", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-02-27", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-94", type: "transfer", name: "Transfer (Td)", amount: 500, date: "2026-02-27", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-95", type: "bill", name: "Chase", amount: 400, date: "2026-02-28", accountId: "a1", templateId: null },
  { id: "imp-96", type: "bill", name: "Gas", amount: 50, date: "2026-02-28", accountId: "a2", templateId: null },
  { id: "imp-97", type: "bill", name: "Amex", amount: 200, date: "2026-03-02", accountId: "a1", templateId: null },
  { id: "imp-98", type: "expense", name: "Misc", amount: 200, date: "2026-03-02", accountId: "a2", templateId: null },
  { id: "imp-99", type: "bill", name: "Power 1", amount: 312, date: "2026-03-03", accountId: "a1", templateId: null },
  { id: "imp-100", type: "bill", name: "Aidvantage", amount: 40, date: "2026-03-04", accountId: "a1", templateId: null },
  { id: "imp-101", type: "expense", name: "Greensky (auto)", amount: 300, date: "2026-03-05", accountId: "a1", templateId: null },
  { id: "imp-102", type: "expense", name: "Pse&G", amount: 440, date: "2026-03-05", accountId: "a2", templateId: null },
  { id: "imp-103", type: "income", name: "Income deposit", amount: 1130, date: "2026-03-06", accountId: "a1", templateId: null },
  { id: "imp-103-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-03-06", accountId: "a2", templateId: null },
  { id: "imp-104", type: "transfer", name: "Transfer (Transfer)", amount: 35, date: "2026-03-06", fromAccountId: "a2", toAccountId: "a1", templateId: null },
  { id: "imp-105", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-03-06", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-106", type: "transfer", name: "Transfer (Td)", amount: 500, date: "2026-03-06", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-107", type: "bill", name: "Gas", amount: 50, date: "2026-03-07", accountId: "a2", templateId: null },
  { id: "imp-108", type: "bill", name: "Verizon (auto)", amount: 112, date: "2026-03-09", accountId: "a1", templateId: null },
  { id: "imp-109", type: "bill", name: "T Mobile (auto)", amount: 255, date: "2026-03-09", accountId: "a1", templateId: null },
  { id: "imp-110", type: "bill", name: "Mr Tire", amount: 100, date: "2026-03-10", accountId: "a1", templateId: null },
  { id: "imp-111", type: "bill", name: "Aidvantage", amount: 40, date: "2026-03-11", accountId: "a1", templateId: null },
  { id: "imp-112", type: "expense", name: "Int", amount: 112, date: "2026-03-11", accountId: "a2", templateId: null },
  { id: "imp-113", type: "bill", name: "Affirm (auto)", amount: 250, date: "2026-03-12", accountId: "a1", templateId: null },
  { id: "imp-114", type: "bill", name: "Prosper", amount: 400, date: "2026-03-12", accountId: "a1", templateId: null },
  { id: "imp-115", type: "bill", name: "Carvana", amount: 735, date: "2026-03-12", accountId: "a2", templateId: null },
  { id: "imp-116", type: "income", name: "Income deposit", amount: 1130, date: "2026-03-13", accountId: "a1", templateId: null },
  { id: "imp-116-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-03-13", accountId: "a2", templateId: null },
  { id: "imp-117", type: "bill", name: "Drive", amount: 150, date: "2026-03-13", accountId: "a1", templateId: null },
  { id: "imp-118", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-03-13", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-119", type: "transfer", name: "Transfer (Td)", amount: 500, date: "2026-03-13", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-120", type: "bill", name: "Maint", amount: 14, date: "2026-03-14", accountId: "a1", templateId: null },
  { id: "imp-121", type: "bill", name: "Gas", amount: 50, date: "2026-03-14", accountId: "a2", templateId: null },
  { id: "imp-122", type: "bill", name: "Power 2", amount: 87, date: "2026-03-17", accountId: "a1", templateId: null },
  { id: "imp-123", type: "bill", name: "Aidvantage", amount: 40, date: "2026-03-18", accountId: "a1", templateId: null },
  { id: "imp-124", type: "bill", name: "Car Ins", amount: 308, date: "2026-03-18", accountId: "a2", templateId: null },
  { id: "imp-125", type: "bill", name: "Affirm C (auto)", amount: 240, date: "2026-03-19", accountId: "a1", templateId: null },
  { id: "imp-126", type: "income", name: "Income deposit", amount: 1130, date: "2026-03-20", accountId: "a1", templateId: null },
  { id: "imp-126-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-03-20", accountId: "a2", templateId: null },
  { id: "imp-127", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-03-20", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-128", type: "transfer", name: "Transfer (Td)", amount: 500, date: "2026-03-20", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-129", type: "income", name: "Income deposit", amount: 1e3, date: "2026-03-21", accountId: "a1", templateId: null },
  { id: "imp-130", type: "bill", name: "Chase", amount: 400, date: "2026-03-21", accountId: "a1", templateId: null },
  { id: "imp-131", type: "transfer", name: "Transfer (Transfer)", amount: 100, date: "2026-03-21", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-132", type: "bill", name: "Gas", amount: 50, date: "2026-03-21", accountId: "a2", templateId: null },
  { id: "imp-133", type: "bill", name: "Greensky", amount: 1e3, date: "2026-03-22", accountId: "a1", templateId: null },
  { id: "imp-134", type: "bill", name: "Affirm (auto)", amount: 50, date: "2026-03-23", accountId: "a1", templateId: null },
  { id: "imp-135", type: "expense", name: "Youtube", amount: 85, date: "2026-03-23", accountId: "a2", templateId: null },
  { id: "imp-136", type: "bill", name: "Aidvantage", amount: 40, date: "2026-03-25", accountId: "a1", templateId: null },
  { id: "imp-137", type: "bill", name: "Goodleap (auto)", amount: 160, date: "2026-03-26", accountId: "a1", templateId: null },
  { id: "imp-138", type: "income", name: "Income deposit", amount: 1130, date: "2026-03-27", accountId: "a1", templateId: null },
  { id: "imp-138-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-03-27", accountId: "a2", templateId: null },
  { id: "imp-139", type: "transfer", name: "Transfer (Transfer)", amount: 450, date: "2026-03-27", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-140", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-03-27", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-141", type: "bill", name: "Gas", amount: 50, date: "2026-03-28", accountId: "a2", templateId: null },
  { id: "imp-142", type: "bill", name: "Apple", amount: 150, date: "2026-03-30", accountId: "a1", templateId: null },
  { id: "imp-143", type: "bill", name: "Aidvantage", amount: 40, date: "2026-04-01", accountId: "a1", templateId: null },
  { id: "imp-144", type: "bill", name: "Amex", amount: 300, date: "2026-04-02", accountId: "a1", templateId: null },
  { id: "imp-145", type: "expense", name: "Misc", amount: 200, date: "2026-04-02", accountId: "a2", templateId: null },
  { id: "imp-146", type: "income", name: "Income deposit", amount: 1130, date: "2026-04-03", accountId: "a1", templateId: null },
  { id: "imp-146-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-04-03", accountId: "a2", templateId: null },
  { id: "imp-147", type: "bill", name: "Power 1", amount: 312, date: "2026-04-03", accountId: "a1", templateId: null },
  { id: "imp-148", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-04-03", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-149", type: "transfer", name: "Transfer (Td)", amount: 500, date: "2026-04-03", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-150", type: "bill", name: "Pseg", amount: 440, date: "2026-04-04", accountId: "a1", templateId: null },
  { id: "imp-151", type: "bill", name: "Gas", amount: 50, date: "2026-04-04", accountId: "a2", templateId: null },
  { id: "imp-152", type: "expense", name: "Greensky (auto)", amount: 300, date: "2026-04-05", accountId: "a1", templateId: null },
  { id: "imp-153", type: "bill", name: "Aidvantage", amount: 40, date: "2026-04-08", accountId: "a1", templateId: null },
  { id: "imp-154", type: "bill", name: "Verizon (auto)", amount: 129, date: "2026-04-09", accountId: "a1", templateId: null },
  { id: "imp-155", type: "expense", name: "T Mobile", amount: 240, date: "2026-04-09", accountId: "a2", templateId: null },
  { id: "imp-156", type: "income", name: "Income deposit", amount: 1130, date: "2026-04-10", accountId: "a1", templateId: null },
  { id: "imp-156-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-04-10", accountId: "a2", templateId: null },
  { id: "imp-157", type: "bill", name: "Mr Tire", amount: 100, date: "2026-04-10", accountId: "a1", templateId: null },
  { id: "imp-158", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-04-10", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-159", type: "transfer", name: "Transfer (Td)", amount: 500, date: "2026-04-10", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-160", type: "bill", name: "Gas", amount: 50, date: "2026-04-11", accountId: "a2", templateId: null },
  { id: "imp-161", type: "expense", name: "Int", amount: 112, date: "2026-04-11", accountId: "a2", templateId: null },
  { id: "imp-162", type: "bill", name: "Affirm (auto)", amount: 250, date: "2026-04-12", accountId: "a1", templateId: null },
  { id: "imp-163", type: "bill", name: "Prosper", amount: 400, date: "2026-04-12", accountId: "a1", templateId: null },
  { id: "imp-164", type: "bill", name: "Carvana", amount: 735, date: "2026-04-12", accountId: "a2", templateId: null },
  { id: "imp-165", type: "bill", name: "Maint", amount: 14, date: "2026-04-14", accountId: "a1", templateId: null },
  { id: "imp-166", type: "bill", name: "Aidvantage", amount: 40, date: "2026-04-15", accountId: "a1", templateId: null },
  { id: "imp-167", type: "income", name: "Income deposit", amount: 1070, date: "2026-04-17", accountId: "a1", templateId: null },
  { id: "imp-167-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-04-17", accountId: "a2", templateId: null },
  { id: "imp-168", type: "bill", name: "Power 2", amount: 87, date: "2026-04-17", accountId: "a1", templateId: null },
  { id: "imp-169", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-04-17", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-170", type: "income", name: "PFFCU transaction", amount: 500, date: "2026-04-17", accountId: "a2", templateId: null },
  { id: "imp-171", type: "expense", name: "Alam", amount: 300, date: "2026-04-18", accountId: "a1", templateId: null },
  { id: "imp-172", type: "bill", name: "Car Ins", amount: 310, date: "2026-04-18", accountId: "a2", templateId: null },
  { id: "imp-173", type: "bill", name: "Affirm C (auto)", amount: 240, date: "2026-04-19", accountId: "a1", templateId: null },
  { id: "imp-174", type: "transfer", name: "Transfer (Transfer)", amount: 20, date: "2026-04-21", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-175", type: "bill", name: "Drive", amount: 30, date: "2026-04-22", accountId: "a1", templateId: null },
  { id: "imp-176", type: "bill", name: "Aidvantage", amount: 40, date: "2026-04-22", accountId: "a1", templateId: null },
  { id: "imp-177", type: "bill", name: "Affirm (auto)", amount: 50, date: "2026-04-23", accountId: "a1", templateId: null },
  { id: "imp-178", type: "expense", name: "Youtube", amount: 85, date: "2026-04-23", accountId: "a2", templateId: null },
  { id: "imp-179", type: "income", name: "Income deposit", amount: 1070, date: "2026-04-24", accountId: "a1", templateId: null },
  { id: "imp-179-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-04-24", accountId: "a2", templateId: null },
  { id: "imp-180", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-04-24", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-181", type: "transfer", name: "Transfer (Td)", amount: 500, date: "2026-04-24", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-182", type: "bill", name: "Gas", amount: 50, date: "2026-04-25", accountId: "a2", templateId: null },
  { id: "imp-183", type: "bill", name: "Goodleap (auto)", amount: 160, date: "2026-04-26", accountId: "a1", templateId: null },
  { id: "imp-184", type: "expense", name: "Ccmua", amount: 95, date: "2026-04-27", accountId: "a1", templateId: null },
  { id: "imp-185", type: "bill", name: "Chase", amount: 300, date: "2026-04-28", accountId: "a1", templateId: null },
  { id: "imp-186", type: "bill", name: "Aidvantage", amount: 40, date: "2026-04-29", accountId: "a1", templateId: null },
  { id: "imp-187", type: "bill", name: "Apple", amount: 130, date: "2026-04-30", accountId: "a1", templateId: null },
  { id: "imp-188", type: "income", name: "Income deposit", amount: 1070, date: "2026-05-01", accountId: "a1", templateId: null },
  { id: "imp-188-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-05-01", accountId: "a2", templateId: null },
  { id: "imp-189", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-05-01", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-190", type: "transfer", name: "Transfer (Td)", amount: 400, date: "2026-05-01", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-191", type: "bill", name: "Amex", amount: 50, date: "2026-05-02", accountId: "a1", templateId: null },
  { id: "imp-192", type: "bill", name: "Gas", amount: 50, date: "2026-05-02", accountId: "a2", templateId: null },
  { id: "imp-193", type: "expense", name: "Misc", amount: 200, date: "2026-05-02", accountId: "a2", templateId: null },
  { id: "imp-194", type: "bill", name: "Power 1", amount: 312, date: "2026-05-03", accountId: "a1", templateId: null },
  { id: "imp-195", type: "transfer", name: "Transfer (Pffcu)", amount: 100, date: "2026-05-05", fromAccountId: "a2", toAccountId: "a1", templateId: null },
  { id: "imp-196", type: "expense", name: "Greensky (auto)", amount: 300, date: "2026-05-05", accountId: "a1", templateId: null },
  { id: "imp-197", type: "expense", name: "Cwood", amount: 158, date: "2026-05-06", accountId: "a1", templateId: null },
  { id: "imp-198", type: "bill", name: "Aidvantage", amount: 40, date: "2026-05-06", accountId: "a1", templateId: null },
  { id: "imp-199", type: "transfer", name: "Transfer (Transfer)", amount: 130, date: "2026-05-07", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-200", type: "income", name: "Income deposit", amount: 1070, date: "2026-05-08", accountId: "a1", templateId: null },
  { id: "imp-200-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-05-08", accountId: "a2", templateId: null },
  { id: "imp-201", type: "transfer", name: "Transfer (Pffcu)", amount: 700, date: "2026-05-08", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-202", type: "transfer", name: "Transfer (Td)", amount: 700, date: "2026-05-08", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-203", type: "bill", name: "Verizon (auto)", amount: 117, date: "2026-05-09", accountId: "a1", templateId: null },
  { id: "imp-204", type: "bill", name: "T Mobile (auto)", amount: 255, date: "2026-05-09", accountId: "a1", templateId: null },
  { id: "imp-205", type: "bill", name: "Mr Tire", amount: 70, date: "2026-05-10", accountId: "a1", templateId: null },
  { id: "imp-206", type: "income", name: "Income deposit", amount: 150, date: "2026-05-11", accountId: "a1", templateId: null },
  { id: "imp-207", type: "expense", name: "Int", amount: 112, date: "2026-05-11", accountId: "a2", templateId: null },
  { id: "imp-208", type: "bill", name: "Affirm (auto)", amount: 250, date: "2026-05-12", accountId: "a1", templateId: null },
  { id: "imp-209", type: "bill", name: "Prosper", amount: 400, date: "2026-05-12", accountId: "a1", templateId: null },
  { id: "imp-210", type: "bill", name: "Carvana", amount: 735, date: "2026-05-12", accountId: "a2", templateId: null },
  { id: "imp-211", type: "bill", name: "Aidvantage", amount: 40, date: "2026-05-13", accountId: "a1", templateId: null },
  { id: "imp-212", type: "bill", name: "Maint", amount: 14, date: "2026-05-14", accountId: "a1", templateId: null },
  { id: "imp-213", type: "income", name: "Income deposit", amount: 1050, date: "2026-05-15", accountId: "a1", templateId: null },
  { id: "imp-213-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-05-15", accountId: "a2", templateId: null },
  { id: "imp-214", type: "transfer", name: "Transfer (Pffcu)", amount: 450, date: "2026-05-15", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-215", type: "transfer", name: "Transfer (Td)", amount: 300, date: "2026-05-15", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-216", type: "expense", name: "Anatoliy", amount: 300, date: "2026-05-16", accountId: "a1", templateId: null },
  { id: "imp-217", type: "bill", name: "Gas", amount: 50, date: "2026-05-16", accountId: "a2", templateId: null },
  { id: "imp-218", type: "bill", name: "Power 2", amount: 87, date: "2026-05-17", accountId: "a1", templateId: null },
  { id: "imp-219", type: "bill", name: "Pseg", amount: 110, date: "2026-05-18", accountId: "a1", templateId: null },
  { id: "imp-220", type: "bill", name: "Affirm C (auto)", amount: 240, date: "2026-05-19", accountId: "a1", templateId: null },
  { id: "imp-221", type: "bill", name: "Amex", amount: 100, date: "2026-05-20", accountId: "a1", templateId: null },
  { id: "imp-222", type: "bill", name: "Aidvantage", amount: 40, date: "2026-05-20", accountId: "a1", templateId: null },
  { id: "imp-223", type: "income", name: "Income deposit", amount: 1050, date: "2026-05-22", accountId: "a1", templateId: null },
  { id: "imp-223-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-05-22", accountId: "a2", templateId: null },
  { id: "imp-224", type: "bill", name: "Drive", amount: 50, date: "2026-05-22", accountId: "a1", templateId: null },
  { id: "imp-225", type: "transfer", name: "Transfer (Pffcu)", amount: 450, date: "2026-05-22", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-226", type: "transfer", name: "Transfer (Td)", amount: 200, date: "2026-05-22", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-227", type: "bill", name: "Affirm (auto)", amount: 50, date: "2026-05-23", accountId: "a1", templateId: null },
  { id: "imp-228", type: "bill", name: "Gas", amount: 50, date: "2026-05-23", accountId: "a2", templateId: null },
  { id: "imp-229", type: "expense", name: "Youtube", amount: 85, date: "2026-05-23", accountId: "a2", templateId: null },
  { id: "imp-230", type: "expense", name: "Hulu", amount: 15, date: "2026-05-24", accountId: "a2", templateId: null },
  { id: "imp-231", type: "bill", name: "Car Ins", amount: 310, date: "2026-05-25", accountId: "a1", templateId: null },
  { id: "imp-232", type: "bill", name: "Goodleap (auto)", amount: 160, date: "2026-05-26", accountId: "a1", templateId: null },
  { id: "imp-233", type: "bill", name: "Aidvantage", amount: 40, date: "2026-05-27", accountId: "a1", templateId: null },
  { id: "imp-234", type: "bill", name: "Chase", amount: 300, date: "2026-05-28", accountId: "a1", templateId: null },
  { id: "imp-235", type: "income", name: "Income deposit", amount: 1050, date: "2026-05-29", accountId: "a1", templateId: null },
  { id: "imp-235-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-05-29", accountId: "a2", templateId: null },
  { id: "imp-236", type: "bill", name: "Apple", amount: 124, date: "2026-05-30", accountId: "a1", templateId: null },
  { id: "imp-237", type: "bill", name: "Gas", amount: 50, date: "2026-05-30", accountId: "a2", templateId: null },
  { id: "imp-238", type: "expense", name: "Joint", amount: 1585, date: "2026-05-31", accountId: "a1", templateId: null },
  { id: "imp-239", type: "income", name: "Income deposit", amount: 351, date: "2026-06-03", accountId: "a1", templateId: null },
  { id: "imp-240", type: "bill", name: "Power 1", amount: 312, date: "2026-06-03", accountId: "a1", templateId: null },
  { id: "imp-241", type: "bill", name: "Aidvantage", amount: 40, date: "2026-06-03", accountId: "a1", templateId: null },
  { id: "imp-242", type: "income", name: "Income deposit", amount: 1050, date: "2026-06-05", accountId: "a1", templateId: null },
  { id: "imp-242-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-06-05", accountId: "a2", templateId: null },
  { id: "imp-243", type: "expense", name: "Joint", amount: 200, date: "2026-06-05", accountId: "a1", templateId: null },
  { id: "imp-244", type: "transfer", name: "Transfer (Pffcu)", amount: 450, date: "2026-06-05", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-245", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-06-05", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-246", type: "bill", name: "Pseg", amount: 110, date: "2026-06-06", accountId: "a1", templateId: null },
  { id: "imp-247", type: "bill", name: "Ploc", amount: 350, date: "2026-06-06", accountId: "a2", templateId: null },
  { id: "imp-248", type: "bill", name: "Pffcu C", amount: 75, date: "2026-06-06", accountId: "a2", templateId: null },
  { id: "imp-249", type: "expense", name: "Cwood", amount: 102, date: "2026-06-07", accountId: "a1", templateId: null },
  { id: "imp-250", type: "bill", name: "M Affirm", amount: 72, date: "2026-06-08", accountId: "a1", templateId: null },
  { id: "imp-251", type: "bill", name: "Verizon (auto)", amount: 117, date: "2026-06-09", accountId: "a1", templateId: null },
  { id: "imp-252", type: "bill", name: "T Mobile (auto)", amount: 230, date: "2026-06-09", accountId: "a1", templateId: null },
  { id: "imp-253", type: "bill", name: "Mr Tire", amount: 100, date: "2026-06-10", accountId: "a1", templateId: null },
  { id: "imp-254", type: "bill", name: "Aidvantage", amount: 40, date: "2026-06-10", accountId: "a1", templateId: null },
  { id: "imp-255", type: "expense", name: "Haircut", amount: 50, date: "2026-06-11", accountId: "a1", templateId: null },
  { id: "imp-256", type: "income", name: "Ploc", amount: 240, date: "2026-06-11", accountId: "a2", templateId: null },
  { id: "imp-257", type: "income", name: "Income deposit", amount: 1050, date: "2026-06-12", accountId: "a1", templateId: null },
  { id: "imp-257-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-06-12", accountId: "a2", templateId: null },
  { id: "imp-258", type: "bill", name: "Affirm (auto)", amount: 250, date: "2026-06-12", accountId: "a1", templateId: null },
  { id: "imp-259", type: "bill", name: "Prosper", amount: 400, date: "2026-06-12", accountId: "a1", templateId: null },
  { id: "imp-260", type: "transfer", name: "Transfer (Pffcu)", amount: 450, date: "2026-06-12", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-261", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-06-12", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-262", type: "bill", name: "Carvana", amount: 735, date: "2026-06-12", accountId: "a2", templateId: null },
  { id: "imp-263", type: "transfer", name: "Transfer (Transfer)", amount: 50, date: "2026-06-13", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-264", type: "bill", name: "Maint", amount: 14, date: "2026-06-14", accountId: "a1", templateId: null },
  { id: "imp-265", type: "bill", name: "Pseg", amount: 220, date: "2026-06-15", accountId: "a1", templateId: null },
  { id: "imp-266", type: "bill", name: "Power 2", amount: 87, date: "2026-06-17", accountId: "a1", templateId: null },
  { id: "imp-267", type: "bill", name: "Aidvantage", amount: 40, date: "2026-06-17", accountId: "a1", templateId: null },
  { id: "imp-268", type: "income", name: "Income deposit", amount: 1050, date: "2026-06-19", accountId: "a1", templateId: null },
  { id: "imp-268-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-06-19", accountId: "a2", templateId: null },
  { id: "imp-269", type: "bill", name: "Affirm C (auto)", amount: 240, date: "2026-06-19", accountId: "a1", templateId: null },
  { id: "imp-270", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-06-19", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-271", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-06-19", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-272", type: "bill", name: "Walmart", amount: 100, date: "2026-06-20", accountId: "a1", templateId: null },
  { id: "imp-273", type: "transfer", name: "Transfer (Transfer)", amount: 350, date: "2026-06-20", fromAccountId: "a2", toAccountId: "a1", templateId: null },
  { id: "imp-274", type: "transfer", name: "Transfer (Transfer)", amount: 280, date: "2026-06-21", fromAccountId: "a2", toAccountId: "a1", templateId: null },
  { id: "imp-275", type: "bill", name: "Drive", amount: 60, date: "2026-06-22", accountId: "a1", templateId: null },
  { id: "imp-276", type: "bill", name: "Affirm (auto)", amount: 50, date: "2026-06-23", accountId: "a1", templateId: null },
  { id: "imp-277", type: "bill", name: "Aidvantage", amount: 40, date: "2026-06-24", accountId: "a1", templateId: null },
  { id: "imp-278", type: "bill", name: "Car Ins", amount: 310, date: "2026-06-25", accountId: "a1", templateId: null },
  { id: "imp-279", type: "income", name: "Income deposit", amount: 1050, date: "2026-06-26", accountId: "a1", templateId: null },
  { id: "imp-279-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-06-26", accountId: "a2", templateId: null },
  { id: "imp-280", type: "bill", name: "Goodleap (auto)", amount: 160, date: "2026-06-26", accountId: "a1", templateId: null },
  { id: "imp-281", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-06-26", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-282", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-06-26", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-283", type: "expense", name: "Home I", amount: 117, date: "2026-06-27", accountId: "a1", templateId: null },
  { id: "imp-284", type: "expense", name: "Ww", amount: 400, date: "2026-06-27", accountId: "a2", templateId: null },
  { id: "imp-285", type: "bill", name: "Chase", amount: 300, date: "2026-06-28", accountId: "a1", templateId: null },
  { id: "imp-286", type: "bill", name: "Pffcu C", amount: 100, date: "2026-06-28", accountId: "a2", templateId: null },
  { id: "imp-287", type: "bill", name: "Mortgage", amount: 800, date: "2026-06-29", accountId: "a1", templateId: null },
  { id: "imp-288", type: "bill", name: "Apple", amount: 140, date: "2026-06-30", accountId: "a1", templateId: null },
  { id: "imp-289", type: "bill", name: "Aidvantage", amount: 40, date: "2026-07-01", accountId: "a1", templateId: null },
  { id: "imp-290", type: "bill", name: "Amex", amount: 50, date: "2026-07-02", accountId: "a1", templateId: null },
  { id: "imp-291", type: "income", name: "Income deposit", amount: 1050, date: "2026-07-03", accountId: "a1", templateId: null },
  { id: "imp-291-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-07-03", accountId: "a2", templateId: null },
  { id: "imp-292", type: "bill", name: "Power 1", amount: 312, date: "2026-07-03", accountId: "a1", templateId: null },
  { id: "imp-293", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-07-03", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-294", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-07-03", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-295", type: "bill", name: "Pffcu C", amount: 160, date: "2026-07-04", accountId: "a2", templateId: null },
  { id: "imp-296", type: "bill", name: "Greensky", amount: 200, date: "2026-07-05", accountId: "a1", templateId: null },
  { id: "imp-297", type: "transfer", name: "Transfer (Transfer)", amount: 50, date: "2026-07-06", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-298", type: "transfer", name: "Transfer (Transfer)", amount: 100, date: "2026-07-07", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-299", type: "bill", name: "Aidvantage", amount: 40, date: "2026-07-08", accountId: "a1", templateId: null },
  { id: "imp-300", type: "bill", name: "Verizon (auto)", amount: 117, date: "2026-07-09", accountId: "a1", templateId: null },
  { id: "imp-301", type: "bill", name: "T Mobile (auto)", amount: 235, date: "2026-07-09", accountId: "a1", templateId: null },
  { id: "imp-302", type: "income", name: "Income deposit", amount: 1050, date: "2026-07-10", accountId: "a1", templateId: null },
  { id: "imp-302-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-07-10", accountId: "a2", templateId: null },
  { id: "imp-303", type: "bill", name: "Mr Tire", amount: 100, date: "2026-07-10", accountId: "a1", templateId: null },
  { id: "imp-304", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-07-10", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-305", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-07-10", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-306", type: "bill", name: "Affirm (auto)", amount: 250, date: "2026-07-12", accountId: "a1", templateId: null },
  { id: "imp-307", type: "bill", name: "Prosper", amount: 400, date: "2026-07-12", accountId: "a1", templateId: null },
  { id: "imp-308", type: "bill", name: "Carvana", amount: 735, date: "2026-07-12", accountId: "a2", templateId: null },
  { id: "imp-309", type: "bill", name: "M Affirm", amount: 75, date: "2026-07-13", accountId: "a1", templateId: null },
  { id: "imp-310", type: "bill", name: "Maint", amount: 14, date: "2026-07-14", accountId: "a1", templateId: null },
  { id: "imp-311", type: "bill", name: "Amex", amount: 20, date: "2026-07-15", accountId: "a1", templateId: null },
  { id: "imp-312", type: "bill", name: "Aidvantage", amount: 40, date: "2026-07-15", accountId: "a1", templateId: null },
  { id: "imp-313", type: "expense", name: "PFFCU transaction", amount: 55, date: "2026-07-16", accountId: "a2", templateId: null },
  { id: "imp-314", type: "income", name: "Income deposit", amount: 1050, date: "2026-07-17", accountId: "a1", templateId: null },
  { id: "imp-314-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-07-17", accountId: "a2", templateId: null },
  { id: "imp-315", type: "bill", name: "Power 2", amount: 87, date: "2026-07-17", accountId: "a1", templateId: null },
  { id: "imp-316", type: "bill", name: "Amex", amount: 30, date: "2026-07-17", accountId: "a1", templateId: null },
  { id: "imp-317", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-07-17", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-318", type: "income", name: "PFFCU transaction", amount: 450, date: "2026-07-17", accountId: "a2", templateId: null },
  { id: "imp-319", type: "expense", name: "PFFCU transaction", amount: 350, date: "2026-07-18", accountId: "a2", templateId: null },
  { id: "imp-320", type: "bill", name: "Affirm C (auto)", amount: 240, date: "2026-07-19", accountId: "a1", templateId: null },
  { id: "imp-321", type: "expense", name: "PFFCU transaction", amount: 36, date: "2026-07-19", accountId: "a2", templateId: null },
  { id: "imp-322", type: "bill", name: "Walmart", amount: 200, date: "2026-07-20", accountId: "a1", templateId: null },
  { id: "imp-323", type: "transfer", name: "Transfer (Transfer)", amount: 100, date: "2026-07-21", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-324", type: "bill", name: "Drive", amount: 75, date: "2026-07-22", accountId: "a1", templateId: null },
  { id: "imp-325", type: "bill", name: "Aidvantage", amount: 40, date: "2026-07-22", accountId: "a1", templateId: null },
  { id: "imp-326", type: "bill", name: "Affirm (auto)", amount: 50, date: "2026-07-23", accountId: "a1", templateId: null },
  { id: "imp-327", type: "income", name: "Income deposit", amount: 1050, date: "2026-07-24", accountId: "a1", templateId: null },
  { id: "imp-327-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-07-24", accountId: "a2", templateId: null },
  { id: "imp-328", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-07-24", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-329", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-07-24", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-330", type: "bill", name: "Car Ins", amount: 310, date: "2026-07-25", accountId: "a1", templateId: null },
  { id: "imp-331", type: "bill", name: "Pffcu C", amount: 100, date: "2026-07-25", accountId: "a2", templateId: null },
  { id: "imp-332", type: "bill", name: "Goodleap (auto)", amount: 160, date: "2026-07-26", accountId: "a1", templateId: null },
  { id: "imp-333", type: "bill", name: "Amex", amount: 25, date: "2026-07-26", accountId: "a1", templateId: null },
  { id: "imp-334", type: "income", name: "Income deposit", amount: 300, date: "2026-07-27", accountId: "a1", templateId: null },
  { id: "imp-335", type: "bill", name: "H Ins", amount: 118, date: "2026-07-27", accountId: "a1", templateId: null },
  { id: "imp-336", type: "transfer", name: "Transfer (Transfer)", amount: 300, date: "2026-07-27", fromAccountId: "a2", toAccountId: "a1", templateId: null },
  { id: "imp-337", type: "bill", name: "Chase", amount: 280, date: "2026-07-28", accountId: "a1", templateId: null },
  { id: "imp-338", type: "bill", name: "Mortgage", amount: 600, date: "2026-07-29", accountId: "a1", templateId: null },
  { id: "imp-339", type: "bill", name: "Aidvantage", amount: 40, date: "2026-07-29", accountId: "a1", templateId: null },
  { id: "imp-340", type: "income", name: "Income deposit", amount: 1050, date: "2026-07-31", accountId: "a1", templateId: null },
  { id: "imp-340-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-07-31", accountId: "a2", templateId: null },
  { id: "imp-341", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-07-31", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-342", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-07-31", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-343", type: "income", name: "Income deposit", amount: 150, date: "2026-08-01", accountId: "a1", templateId: null },
  { id: "imp-344", type: "bill", name: "Affirm (auto)", amount: 70, date: "2026-08-01", accountId: "a1", templateId: null },
  { id: "imp-345", type: "transfer", name: "Transfer (Transfer)", amount: 150, date: "2026-08-01", fromAccountId: "a2", toAccountId: "a1", templateId: null },
  { id: "imp-346", type: "bill", name: "Apple", amount: 130, date: "2026-08-02", accountId: "a1", templateId: null },
  { id: "imp-347", type: "bill", name: "Power 1", amount: 312, date: "2026-08-03", accountId: "a1", templateId: null },
  { id: "imp-348", type: "bill", name: "Aidvantage", amount: 40, date: "2026-08-04", accountId: "a1", templateId: null },
  { id: "imp-349", type: "bill", name: "Greensky", amount: 400, date: "2026-08-05", accountId: "a1", templateId: null },
  { id: "imp-350", type: "expense", name: "Cwood", amount: 230, date: "2026-08-06", accountId: "a1", templateId: null },
  { id: "imp-351", type: "income", name: "Income deposit", amount: 1050, date: "2026-08-07", accountId: "a1", templateId: null },
  { id: "imp-351-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-08-07", accountId: "a2", templateId: null },
  { id: "imp-352", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-08-07", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-353", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-08-07", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-354", type: "bill", name: "Verizon (auto)", amount: 117, date: "2026-08-09", accountId: "a1", templateId: null },
  { id: "imp-355", type: "bill", name: "T Mobile (auto)", amount: 260, date: "2026-08-09", accountId: "a1", templateId: null },
  { id: "imp-356", type: "bill", name: "Mr Tire", amount: 100, date: "2026-08-10", accountId: "a1", templateId: null },
  { id: "imp-357", type: "bill", name: "Affirm (auto)", amount: 250, date: "2026-08-12", accountId: "a1", templateId: null },
  { id: "imp-358", type: "bill", name: "Prosper", amount: 400, date: "2026-08-12", accountId: "a1", templateId: null },
  { id: "imp-359", type: "bill", name: "Carvana", amount: 735, date: "2026-08-12", accountId: "a2", templateId: null },
  { id: "imp-360", type: "bill", name: "Aidvantage", amount: 40, date: "2026-08-13", accountId: "a1", templateId: null },
  { id: "imp-361", type: "income", name: "Income deposit", amount: 1050, date: "2026-08-14", accountId: "a1", templateId: null },
  { id: "imp-361-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-08-14", accountId: "a2", templateId: null },
  { id: "imp-362", type: "bill", name: "Maint", amount: 14, date: "2026-08-14", accountId: "a1", templateId: null },
  { id: "imp-363", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-08-14", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-364", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-08-14", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-365", type: "income", name: "Income deposit", amount: 400, date: "2026-08-15", accountId: "a1", templateId: null },
  { id: "imp-366", type: "bill", name: "M Affirm", amount: 72, date: "2026-08-15", accountId: "a1", templateId: null },
  { id: "imp-367", type: "expense", name: "Citi (auto)", amount: 100, date: "2026-08-15", accountId: "a1", templateId: null },
  { id: "imp-368", type: "transfer", name: "Transfer (Transfer)", amount: 400, date: "2026-08-15", fromAccountId: "a2", toAccountId: "a1", templateId: null },
  { id: "imp-369", type: "bill", name: "Power 2", amount: 87, date: "2026-08-17", accountId: "a1", templateId: null },
  { id: "imp-370", type: "bill", name: "Pseg", amount: 220, date: "2026-08-18", accountId: "a1", templateId: null },
  { id: "imp-371", type: "bill", name: "Affirm C (auto)", amount: 240, date: "2026-08-19", accountId: "a1", templateId: null },
  { id: "imp-372", type: "bill", name: "Aidvantage", amount: 40, date: "2026-08-19", accountId: "a1", templateId: null },
  { id: "imp-373", type: "bill", name: "Walmart", amount: 200, date: "2026-08-20", accountId: "a1", templateId: null },
  { id: "imp-374", type: "income", name: "Income deposit", amount: 1050, date: "2026-08-21", accountId: "a1", templateId: null },
  { id: "imp-374-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-08-21", accountId: "a2", templateId: null },
  { id: "imp-375", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-08-21", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-376", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-08-21", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-377", type: "bill", name: "Drive", amount: 100, date: "2026-08-22", accountId: "a1", templateId: null },
  { id: "imp-378", type: "bill", name: "Pffcu C", amount: 400, date: "2026-08-22", accountId: "a2", templateId: null },
  { id: "imp-379", type: "bill", name: "Affirm (auto)", amount: 50, date: "2026-08-23", accountId: "a1", templateId: null },
  { id: "imp-380", type: "expense", name: "Citi", amount: 200, date: "2026-08-23", accountId: "a1", templateId: null },
  { id: "imp-381", type: "bill", name: "Ploc", amount: 200, date: "2026-08-23", accountId: "a2", templateId: null },
  { id: "imp-382", type: "bill", name: "Car Ins", amount: 310, date: "2026-08-25", accountId: "a1", templateId: null },
  { id: "imp-383", type: "bill", name: "Goodleap (auto)", amount: 160, date: "2026-08-26", accountId: "a1", templateId: null },
  { id: "imp-384", type: "bill", name: "Aidvantage", amount: 40, date: "2026-08-26", accountId: "a1", templateId: null },
  { id: "imp-385", type: "income", name: "Income deposit", amount: 1050, date: "2026-08-28", accountId: "a1", templateId: null },
  { id: "imp-385-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-08-28", accountId: "a2", templateId: null },
  { id: "imp-386", type: "bill", name: "Chase", amount: 300, date: "2026-08-28", accountId: "a1", templateId: null },
  { id: "imp-387", type: "bill", name: "H Ins", amount: 118, date: "2026-08-28", accountId: "a1", templateId: null },
  { id: "imp-388", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-08-28", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-389", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-08-28", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-390", type: "income", name: "Income deposit", amount: 400, date: "2026-08-29", accountId: "a1", templateId: null },
  { id: "imp-391", type: "bill", name: "Mortgage", amount: 800, date: "2026-08-29", accountId: "a1", templateId: null },
  { id: "imp-392", type: "transfer", name: "Transfer (Transfer)", amount: 200, date: "2026-08-29", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-393", type: "transfer", name: "Transfer (Transfer)", amount: 400, date: "2026-08-29", fromAccountId: "a2", toAccountId: "a1", templateId: null },
  { id: "imp-394", type: "bill", name: "Apple", amount: 150, date: "2026-08-30", accountId: "a1", templateId: null },
  { id: "imp-395", type: "bill", name: "Affirm (auto)", amount: 70, date: "2026-09-01", accountId: "a1", templateId: null },
  { id: "imp-396", type: "bill", name: "Amex", amount: 100, date: "2026-09-02", accountId: "a1", templateId: null },
  { id: "imp-397", type: "bill", name: "Aidvantage", amount: 40, date: "2026-09-02", accountId: "a1", templateId: null },
  { id: "imp-398", type: "bill", name: "Power 1", amount: 312, date: "2026-09-03", accountId: "a1", templateId: null },
  { id: "imp-399", type: "income", name: "Income deposit", amount: 1050, date: "2026-09-04", accountId: "a1", templateId: null },
  { id: "imp-399-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-09-04", accountId: "a2", templateId: null },
  { id: "imp-400", type: "bill", name: "Pseg", amount: 110, date: "2026-09-04", accountId: "a1", templateId: null },
  { id: "imp-401", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-09-04", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-402", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-09-04", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-403", type: "bill", name: "Greensky", amount: 200, date: "2026-09-05", accountId: "a1", templateId: null },
  { id: "imp-404", type: "bill", name: "M Affirm", amount: 72, date: "2026-09-07", accountId: "a1", templateId: null },
  { id: "imp-405", type: "expense", name: "M Citi", amount: 150, date: "2026-09-08", accountId: "a1", templateId: null },
  { id: "imp-406", type: "bill", name: "Verizon (auto)", amount: 117, date: "2026-09-09", accountId: "a1", templateId: null },
  { id: "imp-407", type: "bill", name: "T Mobile (auto)", amount: 260, date: "2026-09-09", accountId: "a1", templateId: null },
  { id: "imp-408", type: "bill", name: "Mr Tire", amount: 100, date: "2026-09-10", accountId: "a1", templateId: null },
  { id: "imp-409", type: "bill", name: "Aidvantage", amount: 40, date: "2026-09-10", accountId: "a1", templateId: null },
  { id: "imp-410", type: "income", name: "Income deposit", amount: 1050, date: "2026-09-11", accountId: "a1", templateId: null },
  { id: "imp-410-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-09-11", accountId: "a2", templateId: null },
  { id: "imp-411", type: "bill", name: "Pseg", amount: 110, date: "2026-09-11", accountId: "a1", templateId: null },
  { id: "imp-412", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-09-11", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-413", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-09-11", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-414", type: "bill", name: "Affirm (auto)", amount: 250, date: "2026-09-12", accountId: "a1", templateId: null },
  { id: "imp-415", type: "bill", name: "Prosper", amount: 400, date: "2026-09-12", accountId: "a1", templateId: null },
  { id: "imp-416", type: "bill", name: "Carvana", amount: 735, date: "2026-09-12", accountId: "a2", templateId: null },
  { id: "imp-417", type: "bill", name: "Maint", amount: 14, date: "2026-09-14", accountId: "a1", templateId: null },
  { id: "imp-418", type: "expense", name: "Citi (auto)", amount: 100, date: "2026-09-15", accountId: "a1", templateId: null },
  { id: "imp-419", type: "bill", name: "Aidvantage", amount: 40, date: "2026-09-16", accountId: "a1", templateId: null },
  { id: "imp-420", type: "bill", name: "Power 2", amount: 87, date: "2026-09-17", accountId: "a1", templateId: null },
  { id: "imp-421", type: "income", name: "Income deposit", amount: 1050, date: "2026-09-18", accountId: "a1", templateId: null },
  { id: "imp-421-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-09-18", accountId: "a2", templateId: null },
  { id: "imp-422", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-09-18", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-423", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-09-18", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-424", type: "bill", name: "Affirm C (auto)", amount: 240, date: "2026-09-19", accountId: "a1", templateId: null },
  { id: "imp-425", type: "bill", name: "Pffcu C", amount: 400, date: "2026-09-19", accountId: "a2", templateId: null },
  { id: "imp-426", type: "bill", name: "Walmart", amount: 200, date: "2026-09-20", accountId: "a1", templateId: null },
  { id: "imp-427", type: "bill", name: "Ploc", amount: 200, date: "2026-09-20", accountId: "a2", templateId: null },
  { id: "imp-428", type: "bill", name: "Pseg", amount: 110, date: "2026-09-21", accountId: "a1", templateId: null },
  { id: "imp-429", type: "bill", name: "Drive", amount: 100, date: "2026-09-22", accountId: "a1", templateId: null },
  { id: "imp-430", type: "bill", name: "Affirm (auto)", amount: 50, date: "2026-09-23", accountId: "a1", templateId: null },
  { id: "imp-431", type: "bill", name: "Aidvantage", amount: 40, date: "2026-09-23", accountId: "a1", templateId: null },
  { id: "imp-432", type: "income", name: "Income deposit", amount: 1050, date: "2026-09-25", accountId: "a1", templateId: null },
  { id: "imp-432-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-09-25", accountId: "a2", templateId: null },
  { id: "imp-433", type: "bill", name: "Car Ins", amount: 310, date: "2026-09-25", accountId: "a1", templateId: null },
  { id: "imp-434", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-09-25", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-435", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-09-25", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-436", type: "income", name: "Income deposit", amount: 500, date: "2026-09-26", accountId: "a1", templateId: null },
  { id: "imp-437", type: "bill", name: "Goodleap (auto)", amount: 160, date: "2026-09-26", accountId: "a1", templateId: null },
  { id: "imp-438", type: "transfer", name: "Transfer (Transfer)", amount: 500, date: "2026-09-26", fromAccountId: "a2", toAccountId: "a1", templateId: null },
  { id: "imp-439", type: "bill", name: "Pseg", amount: 110, date: "2026-09-27", accountId: "a1", templateId: null },
  { id: "imp-440", type: "bill", name: "H Ins", amount: 120, date: "2026-09-27", accountId: "a1", templateId: null },
  { id: "imp-441", type: "bill", name: "Chase", amount: 300, date: "2026-09-28", accountId: "a1", templateId: null },
  { id: "imp-442", type: "bill", name: "Mortgage", amount: 800, date: "2026-09-29", accountId: "a1", templateId: null },
  { id: "imp-443", type: "bill", name: "Apple", amount: 150, date: "2026-09-30", accountId: "a1", templateId: null },
  { id: "imp-444", type: "bill", name: "Affirm (auto)", amount: 70, date: "2026-10-01", accountId: "a1", templateId: null },
  { id: "imp-445", type: "income", name: "Income deposit", amount: 1050, date: "2026-10-02", accountId: "a1", templateId: null },
  { id: "imp-445-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-10-02", accountId: "a2", templateId: null },
  { id: "imp-446", type: "bill", name: "Amex", amount: 100, date: "2026-10-02", accountId: "a1", templateId: null },
  { id: "imp-447", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-10-02", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-448", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-10-02", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-449", type: "bill", name: "Power 1", amount: 312, date: "2026-10-03", accountId: "a1", templateId: null },
  { id: "imp-450", type: "bill", name: "Pseg", amount: 110, date: "2026-10-04", accountId: "a1", templateId: null },
  { id: "imp-451", type: "bill", name: "Greensky", amount: 200, date: "2026-10-05", accountId: "a1", templateId: null },
  { id: "imp-452", type: "bill", name: "M Affirm", amount: 72, date: "2026-10-07", accountId: "a1", templateId: null },
  { id: "imp-453", type: "bill", name: "Aidvantage", amount: 40, date: "2026-10-07", accountId: "a1", templateId: null },
  { id: "imp-454", type: "income", name: "Income deposit", amount: 1050, date: "2026-10-09", accountId: "a1", templateId: null },
  { id: "imp-454-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-10-09", accountId: "a2", templateId: null },
  { id: "imp-455", type: "bill", name: "Verizon (auto)", amount: 117, date: "2026-10-09", accountId: "a1", templateId: null },
  { id: "imp-456", type: "bill", name: "T Mobile (auto)", amount: 260, date: "2026-10-09", accountId: "a1", templateId: null },
  { id: "imp-457", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-10-09", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-458", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-10-09", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-459", type: "bill", name: "Mr Tire", amount: 100, date: "2026-10-10", accountId: "a1", templateId: null },
  { id: "imp-460", type: "bill", name: "Pseg", amount: 110, date: "2026-10-11", accountId: "a1", templateId: null },
  { id: "imp-461", type: "bill", name: "Prosper", amount: 400, date: "2026-10-12", accountId: "a1", templateId: null },
  { id: "imp-462", type: "bill", name: "Carvana", amount: 735, date: "2026-10-12", accountId: "a2", templateId: null },
  { id: "imp-463", type: "bill", name: "Maint", amount: 14, date: "2026-10-14", accountId: "a1", templateId: null },
  { id: "imp-464", type: "bill", name: "Aidvantage", amount: 40, date: "2026-10-14", accountId: "a1", templateId: null },
  { id: "imp-465", type: "expense", name: "Citi (auto)", amount: 100, date: "2026-10-15", accountId: "a1", templateId: null },
  { id: "imp-466", type: "income", name: "Income deposit", amount: 1050, date: "2026-10-16", accountId: "a1", templateId: null },
  { id: "imp-466-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-10-16", accountId: "a2", templateId: null },
  { id: "imp-467", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-10-16", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-468", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-10-16", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-469", type: "bill", name: "Power 2", amount: 87, date: "2026-10-17", accountId: "a1", templateId: null },
  { id: "imp-470", type: "bill", name: "Pffcu C", amount: 400, date: "2026-10-17", accountId: "a2", templateId: null },
  { id: "imp-471", type: "bill", name: "Pseg", amount: 110, date: "2026-10-18", accountId: "a1", templateId: null },
  { id: "imp-472", type: "bill", name: "Ploc", amount: 200, date: "2026-10-18", accountId: "a2", templateId: null },
  { id: "imp-473", type: "bill", name: "Affirm C (auto)", amount: 240, date: "2026-10-19", accountId: "a1", templateId: null },
  { id: "imp-474", type: "bill", name: "Walmart", amount: 200, date: "2026-10-20", accountId: "a1", templateId: null },
  { id: "imp-475", type: "expense", name: "M Citi", amount: 150, date: "2026-10-21", accountId: "a1", templateId: null },
  { id: "imp-476", type: "bill", name: "Aidvantage", amount: 40, date: "2026-10-21", accountId: "a1", templateId: null },
  { id: "imp-477", type: "bill", name: "Drive", amount: 100, date: "2026-10-22", accountId: "a1", templateId: null },
  { id: "imp-478", type: "income", name: "Income deposit", amount: 1050, date: "2026-10-23", accountId: "a1", templateId: null },
  { id: "imp-478-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-10-23", accountId: "a2", templateId: null },
  { id: "imp-479", type: "bill", name: "Affirm (auto)", amount: 50, date: "2026-10-23", accountId: "a1", templateId: null },
  { id: "imp-480", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-10-23", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-481", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-10-23", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-482", type: "income", name: "Income deposit", amount: 350, date: "2026-10-24", accountId: "a1", templateId: null },
  { id: "imp-483", type: "transfer", name: "Transfer (Transfer)", amount: 350, date: "2026-10-24", fromAccountId: "a2", toAccountId: "a1", templateId: null },
  { id: "imp-484", type: "bill", name: "Car Ins", amount: 310, date: "2026-10-25", accountId: "a1", templateId: null },
  { id: "imp-485", type: "bill", name: "H Ins", amount: 120, date: "2026-10-25", accountId: "a1", templateId: null },
  { id: "imp-486", type: "bill", name: "Goodleap (auto)", amount: 160, date: "2026-10-26", accountId: "a1", templateId: null },
  { id: "imp-487", type: "bill", name: "Pseg", amount: 110, date: "2026-10-27", accountId: "a1", templateId: null },
  { id: "imp-488", type: "bill", name: "Chase", amount: 400, date: "2026-10-28", accountId: "a1", templateId: null },
  { id: "imp-489", type: "bill", name: "Aidvantage", amount: 40, date: "2026-10-28", accountId: "a1", templateId: null },
  { id: "imp-490", type: "bill", name: "Mortgage", amount: 800, date: "2026-10-29", accountId: "a1", templateId: null },
  { id: "imp-491", type: "income", name: "Income deposit", amount: 1050, date: "2026-10-30", accountId: "a1", templateId: null },
  { id: "imp-491-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-10-30", accountId: "a2", templateId: null },
  { id: "imp-492", type: "bill", name: "Apple", amount: 150, date: "2026-10-30", accountId: "a1", templateId: null },
  { id: "imp-493", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-10-30", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-494", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-10-30", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-495", type: "transfer", name: "Transfer (Transfer)", amount: 200, date: "2026-10-31", fromAccountId: "a2", toAccountId: "a1", templateId: null },
  { id: "imp-496", type: "bill", name: "Affirm (auto)", amount: 70, date: "2026-11-01", accountId: "a1", templateId: null },
  { id: "imp-497", type: "income", name: "Income deposit", amount: 200, date: "2026-11-02", accountId: "a1", templateId: null },
  { id: "imp-498", type: "bill", name: "Amex", amount: 100, date: "2026-11-02", accountId: "a1", templateId: null },
  { id: "imp-499", type: "bill", name: "Power 1", amount: 312, date: "2026-11-03", accountId: "a1", templateId: null },
  { id: "imp-500", type: "bill", name: "Pseg", amount: 110, date: "2026-11-04", accountId: "a1", templateId: null },
  { id: "imp-501", type: "bill", name: "Aidvantage", amount: 40, date: "2026-11-04", accountId: "a1", templateId: null },
  { id: "imp-502", type: "bill", name: "Greensky", amount: 200, date: "2026-11-05", accountId: "a1", templateId: null },
  { id: "imp-503", type: "income", name: "Income deposit", amount: 1050, date: "2026-11-06", accountId: "a1", templateId: null },
  { id: "imp-503-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-11-06", accountId: "a2", templateId: null },
  { id: "imp-504", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-11-06", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-505", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-11-06", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-506", type: "bill", name: "M Affirm", amount: 72, date: "2026-11-07", accountId: "a1", templateId: null },
  { id: "imp-507", type: "bill", name: "Verizon (auto)", amount: 117, date: "2026-11-09", accountId: "a1", templateId: null },
  { id: "imp-508", type: "bill", name: "T Mobile (auto)", amount: 260, date: "2026-11-09", accountId: "a1", templateId: null },
  { id: "imp-509", type: "bill", name: "Mr Tire", amount: 100, date: "2026-11-10", accountId: "a1", templateId: null },
  { id: "imp-510", type: "bill", name: "Pseg", amount: 110, date: "2026-11-11", accountId: "a1", templateId: null },
  { id: "imp-511", type: "bill", name: "Aidvantage", amount: 40, date: "2026-11-11", accountId: "a1", templateId: null },
  { id: "imp-512", type: "bill", name: "Prosper", amount: 400, date: "2026-11-12", accountId: "a1", templateId: null },
  { id: "imp-513", type: "bill", name: "Carvana", amount: 735, date: "2026-11-12", accountId: "a2", templateId: null },
  { id: "imp-514", type: "income", name: "Income deposit", amount: 1050, date: "2026-11-13", accountId: "a1", templateId: null },
  { id: "imp-514-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-11-13", accountId: "a2", templateId: null },
  { id: "imp-515", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-11-13", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-516", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-11-13", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-517", type: "bill", name: "Maint", amount: 14, date: "2026-11-14", accountId: "a1", templateId: null },
  { id: "imp-518", type: "bill", name: "Pffcu C", amount: 400, date: "2026-11-14", accountId: "a2", templateId: null },
  { id: "imp-519", type: "expense", name: "Citi (auto)", amount: 100, date: "2026-11-15", accountId: "a1", templateId: null },
  { id: "imp-520", type: "bill", name: "Ploc", amount: 200, date: "2026-11-15", accountId: "a2", templateId: null },
  { id: "imp-521", type: "bill", name: "Power 2", amount: 87, date: "2026-11-17", accountId: "a1", templateId: null },
  { id: "imp-522", type: "bill", name: "Pseg", amount: 110, date: "2026-11-18", accountId: "a1", templateId: null },
  { id: "imp-523", type: "bill", name: "Aidvantage", amount: 40, date: "2026-11-18", accountId: "a1", templateId: null },
  { id: "imp-524", type: "bill", name: "Affirm", amount: 240, date: "2026-11-19", accountId: "a1", templateId: null },
  { id: "imp-525", type: "income", name: "Income deposit", amount: 1050, date: "2026-11-20", accountId: "a1", templateId: null },
  { id: "imp-525-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-11-20", accountId: "a2", templateId: null },
  { id: "imp-526", type: "bill", name: "Walmart", amount: 200, date: "2026-11-20", accountId: "a1", templateId: null },
  { id: "imp-527", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-11-20", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-528", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-11-20", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-529", type: "income", name: "Income deposit", amount: 400, date: "2026-11-21", accountId: "a1", templateId: null },
  { id: "imp-530", type: "bill", name: "Pseg", amount: 110, date: "2026-11-21", accountId: "a1", templateId: null },
  { id: "imp-531", type: "transfer", name: "Transfer (Transfer)", amount: 400, date: "2026-11-21", fromAccountId: "a2", toAccountId: "a1", templateId: null },
  { id: "imp-532", type: "bill", name: "Drive", amount: 100, date: "2026-11-22", accountId: "a1", templateId: null },
  { id: "imp-533", type: "bill", name: "Affirm (auto)", amount: 50, date: "2026-11-23", accountId: "a1", templateId: null },
  { id: "imp-534", type: "bill", name: "Car Ins", amount: 310, date: "2026-11-25", accountId: "a1", templateId: null },
  { id: "imp-535", type: "bill", name: "Aidvantage", amount: 40, date: "2026-11-25", accountId: "a1", templateId: null },
  { id: "imp-536", type: "bill", name: "Goodleap (auto)", amount: 160, date: "2026-11-26", accountId: "a1", templateId: null },
  { id: "imp-537", type: "bill", name: "H Ins", amount: 120, date: "2026-11-26", accountId: "a1", templateId: null },
  { id: "imp-538", type: "income", name: "Income deposit", amount: 1050, date: "2026-11-27", accountId: "a1", templateId: null },
  { id: "imp-538-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-11-27", accountId: "a2", templateId: null },
  { id: "imp-539", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-11-27", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-540", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-11-27", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-541", type: "bill", name: "Chase", amount: 300, date: "2026-11-28", accountId: "a1", templateId: null },
  { id: "imp-542", type: "bill", name: "Mortgage", amount: 800, date: "2026-11-29", accountId: "a1", templateId: null },
  { id: "imp-543", type: "bill", name: "Apple", amount: 150, date: "2026-11-30", accountId: "a1", templateId: null },
  { id: "imp-544", type: "bill", name: "Affirm (auto)", amount: 70, date: "2026-12-01", accountId: "a1", templateId: null },
  { id: "imp-545", type: "bill", name: "Amex", amount: 200, date: "2026-12-02", accountId: "a1", templateId: null },
  { id: "imp-546", type: "bill", name: "Aidvantage", amount: 40, date: "2026-12-02", accountId: "a1", templateId: null },
  { id: "imp-547", type: "bill", name: "Power 1", amount: 312, date: "2026-12-03", accountId: "a1", templateId: null },
  { id: "imp-548", type: "income", name: "Income deposit", amount: 1050, date: "2026-12-04", accountId: "a1", templateId: null },
  { id: "imp-548-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-12-04", accountId: "a2", templateId: null },
  { id: "imp-549", type: "bill", name: "Pseg", amount: 110, date: "2026-12-04", accountId: "a1", templateId: null },
  { id: "imp-550", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-12-04", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-551", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-12-04", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-552", type: "bill", name: "Greensky", amount: 200, date: "2026-12-05", accountId: "a1", templateId: null },
  { id: "imp-553", type: "bill", name: "M Affirm", amount: 72, date: "2026-12-07", accountId: "a1", templateId: null },
  { id: "imp-554", type: "bill", name: "Verizon (auto)", amount: 117, date: "2026-12-09", accountId: "a1", templateId: null },
  { id: "imp-555", type: "bill", name: "T Mobile (auto)", amount: 260, date: "2026-12-09", accountId: "a1", templateId: null },
  { id: "imp-556", type: "bill", name: "Mr Tire", amount: 100, date: "2026-12-10", accountId: "a1", templateId: null },
  { id: "imp-557", type: "income", name: "Income deposit", amount: 1050, date: "2026-12-11", accountId: "a1", templateId: null },
  { id: "imp-557-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-12-11", accountId: "a2", templateId: null },
  { id: "imp-558", type: "bill", name: "Pseg", amount: 110, date: "2026-12-11", accountId: "a1", templateId: null },
  { id: "imp-559", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-12-11", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-560", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-12-11", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-561", type: "income", name: "Income deposit", amount: 250, date: "2026-12-12", accountId: "a1", templateId: null },
  { id: "imp-562", type: "bill", name: "Prosper", amount: 400, date: "2026-12-12", accountId: "a1", templateId: null },
  { id: "imp-563", type: "transfer", name: "Transfer (Transfer)", amount: 250, date: "2026-12-12", fromAccountId: "a2", toAccountId: "a1", templateId: null },
  { id: "imp-564", type: "bill", name: "Carvana", amount: 735, date: "2026-12-12", accountId: "a2", templateId: null },
  { id: "imp-565", type: "bill", name: "Maint", amount: 14, date: "2026-12-14", accountId: "a1", templateId: null },
  { id: "imp-566", type: "expense", name: "Citi (auto)", amount: 100, date: "2026-12-15", accountId: "a1", templateId: null },
  { id: "imp-567", type: "bill", name: "Aidvantage", amount: 40, date: "2026-12-16", accountId: "a1", templateId: null },
  { id: "imp-568", type: "bill", name: "Power 2", amount: 87, date: "2026-12-17", accountId: "a1", templateId: null },
  { id: "imp-569", type: "income", name: "Income deposit", amount: 1050, date: "2026-12-18", accountId: "a1", templateId: null },
  { id: "imp-569-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-12-18", accountId: "a2", templateId: null },
  { id: "imp-570", type: "bill", name: "Affirm", amount: 240, date: "2026-12-18", accountId: "a1", templateId: null },
  { id: "imp-571", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-12-18", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-572", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-12-18", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-573", type: "bill", name: "Pseg", amount: 110, date: "2026-12-19", accountId: "a1", templateId: null },
  { id: "imp-574", type: "bill", name: "Pffcu C", amount: 400, date: "2026-12-19", accountId: "a2", templateId: null },
  { id: "imp-575", type: "bill", name: "Walmart", amount: 200, date: "2026-12-20", accountId: "a1", templateId: null },
  { id: "imp-576", type: "bill", name: "Ploc", amount: 200, date: "2026-12-20", accountId: "a2", templateId: null },
  { id: "imp-577", type: "bill", name: "Drive", amount: 100, date: "2026-12-22", accountId: "a1", templateId: null },
  { id: "imp-578", type: "bill", name: "Affirm (auto)", amount: 50, date: "2026-12-23", accountId: "a1", templateId: null },
  { id: "imp-579", type: "bill", name: "Aidvantage", amount: 40, date: "2026-12-23", accountId: "a1", templateId: null },
  { id: "imp-580", type: "income", name: "Income deposit", amount: 1050, date: "2026-12-25", accountId: "a1", templateId: null },
  { id: "imp-580-pf", type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: "2026-12-25", accountId: "a2", templateId: null },
  { id: "imp-581", type: "bill", name: "Car Ins", amount: 310, date: "2026-12-25", accountId: "a1", templateId: null },
  { id: "imp-582", type: "bill", name: "H Ins", amount: 120, date: "2026-12-25", accountId: "a1", templateId: null },
  { id: "imp-583", type: "transfer", name: "Transfer (Pffcu-X)", amount: 450, date: "2026-12-25", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-584", type: "transfer", name: "Transfer (Td)", amount: 450, date: "2026-12-25", fromAccountId: "a1", toAccountId: "a2", templateId: null },
  { id: "imp-585", type: "bill", name: "Goodleap (auto)", amount: 160, date: "2026-12-26", accountId: "a1", templateId: null },
  { id: "imp-586", type: "bill", name: "Pseg", amount: 110, date: "2026-12-27", accountId: "a1", templateId: null },
  { id: "imp-587", type: "bill", name: "Chase", amount: 400, date: "2026-12-28", accountId: "a1", templateId: null },
  { id: "imp-588", type: "bill", name: "Mortgage", amount: 800, date: "2026-12-29", accountId: "a1", templateId: null },
  { id: "imp-589", type: "bill", name: "Apple", amount: 150, date: "2026-12-30", accountId: "a1", templateId: null }
];
function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function fmt(n) {
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.round(Math.abs(n)).toLocaleString(void 0, { maximumFractionDigits: 0 });
}
function fmtDate(iso) {
  const d = /* @__PURE__ */ new Date(iso + "T00:00:00");
  return d.toLocaleDateString(void 0, { month: "short", day: "numeric" });
}
function fmtDateObj(d) {
  return d.toLocaleDateString(void 0, { month: "short", day: "numeric" });
}
function todayISO() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function byDateDesc(a, b) {
  if (a.date < b.date) return 1;
  if (a.date > b.date) return -1;
  return 0;
}
function byDateAsc(a, b) {
  if (a.date < b.date) return -1;
  if (a.date > b.date) return 1;
  return 0;
}
var FREQUENCIES = {
  weekly: { label: "Weekly", months: 0 },
  monthly: { label: "Monthly", months: 1 },
  quarterly: { label: "Quarterly", months: 3 },
  yearly: { label: "Yearly", months: 12 }
};
var WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function stepDue(date, tpl) {
  const freq = tpl.frequency || "monthly";
  if (freq === "weekly") return addDays(date, 7);
  const months = FREQUENCIES[freq] ? FREQUENCIES[freq].months : 1;
  return new Date(date.getFullYear(), date.getMonth() + months, tpl.day);
}
function nextDueFromToday(tpl) {
  const now = /* @__PURE__ */ new Date();
  const freq = tpl.frequency || "monthly";
  if (freq === "weekly") {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = ((tpl.weekday - today.getDay()) % 7 + 7) % 7;
    return addDays(today, diff);
  }
  const y = now.getFullYear(), m = now.getMonth(), d = now.getDate();
  let candidate = new Date(y, m, tpl.day);
  if (candidate < new Date(y, m, d)) candidate = new Date(y, m + 1, tpl.day);
  return candidate;
}
function nextDueForTemplate(tpl, items) {
  const logged = items.filter((t) => t.templateId === tpl.id).sort(byDateDesc);
  if (logged.length === 0) return nextDueFromToday(tpl);
  const last = /* @__PURE__ */ new Date(logged[0].date + "T00:00:00");
  return stepDue(last, tpl);
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, date.getDate());
}
var RANGES = {
  week: { label: "Week", end: (today) => addDays(today, 7) },
  month: { label: "Month", end: (today) => addMonths(today, 1) },
  quarter: { label: "Quarter", end: (today) => addMonths(today, 3) },
  year: { label: "Year", end: (today) => addMonths(today, 12) }
};
var CALENDAR_PERIODS = { week: "Week", month: "Month", quarter: "Quarter", year: "Year" };
function periodBounds(period, today) {
  if (period === "week") {
    const start2 = addDays(today, -today.getDay());
    const end2 = addDays(start2, 6);
    return [start2, end2];
  }
  if (period === "month") {
    const start2 = new Date(today.getFullYear(), today.getMonth(), 1);
    const end2 = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return [start2, end2];
  }
  if (period === "quarter") {
    const q = Math.floor(today.getMonth() / 3);
    const start2 = new Date(today.getFullYear(), q * 3, 1);
    const end2 = new Date(today.getFullYear(), q * 3 + 3, 0);
    return [start2, end2];
  }
  const start = new Date(today.getFullYear(), 0, 1);
  const end = new Date(today.getFullYear(), 11, 31);
  return [start, end];
}
function periodLabel(period, start, end) {
  if (period === "week") return `${start.toLocaleDateString(void 0, { month: "short", day: "numeric" })} \u2013 ${end.toLocaleDateString(void 0, { month: "short", day: "numeric" })}`;
  if (period === "month") return start.toLocaleDateString(void 0, { month: "long", year: "numeric" });
  if (period === "quarter") return `Q${Math.floor(start.getMonth() / 3) + 1} ${start.getFullYear()}`;
  return String(start.getFullYear());
}
function matchDebt(name, debts) {
  const n = name.toLowerCase();
  return debts.find((d) => d.name && (n.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(n)));
}
function quarterKey(dateStr) {
  const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `${d.getFullYear()}-Q${q}`;
}
function quarterKeyFromDate(d) {
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `${d.getFullYear()}-Q${q}`;
}
function quarterLabel(key) {
  const [y, q] = key.split("-Q");
  return `Q${q} ${y}`;
}
function Ledger() {
  const [items, setItems] = useState(null);
  const [recurring, setRecurring] = useState(null);
  const [debts, setDebts] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [view, setView] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState(null);
  const [backupImportError, setBackupImportError] = useState(null);
  const [trendsStart, setTrendsStart] = useState(`${(/* @__PURE__ */ new Date()).getFullYear()}-01-01`);
  const [trendsEnd, setTrendsEnd] = useState(toISODate(/* @__PURE__ */ new Date()));
  const [range, setRange] = useState("month");
  const [upcomingStatusFilter, setUpcomingStatusFilter] = useState("all");
  const [balancePeriod, setBalancePeriod] = useState("month");
  const [ledgerPeriod, setLedgerPeriod] = useState("week");
  const [showAdd, setShowAdd] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [editRecurring, setEditRecurring] = useState(null);
  const [editDebt, setEditDebt] = useState(null);
  const [showAddRecurring, setShowAddRecurring] = useState(false);
  const [showSyncConfirm, setShowSyncConfirm] = useState(false);
  const [syncScope, setSyncScope] = useState("expense");
  const [recurringForm, setRecurringForm] = useState({ type: "bill", name: "", amount: "", accountId: "", frequency: "monthly", day: "1", weekday: "1" });
  const [pendingGroup, setPendingGroup] = useState(null);
  const [showCleanupConfirm, setShowCleanupConfirm] = useState(false);
  const [showDedupeConfirm, setShowDedupeConfirm] = useState(false);
  const [showRedundantConfirm, setShowRedundantConfirm] = useState(false);
  const [ledgerAccountFilter, setLedgerAccountFilter] = useState("all");
  const [expandedYears, setExpandedYears] = useState({});
  const [expandedQuarters, setExpandedQuarters] = useState({});
  const [lastAccountId, setLastAccountId] = useState(null);
  const [form, setForm] = useState({ type: "expense", name: "", amount: "", date: todayISO(), recurring: false, day: "1", accountId: "a1" });
  const [error, setError] = useState("");
  const [justDone, setJustDone] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("transactions");
        setItems(res ? JSON.parse(res.value) : IMPORTED_2026);
      } catch {
        setItems(IMPORTED_2026);
      }
      try {
        const res2 = await window.storage.get("accounts");
        setAccounts(res2 ? JSON.parse(res2.value) : DEFAULT_ACCOUNTS);
      } catch {
        setAccounts(DEFAULT_ACCOUNTS);
      }
      try {
        const res3 = await window.storage.get("recurring");
        setRecurring(res3 ? JSON.parse(res3.value) : []);
      } catch {
        setRecurring([]);
      }
      try {
        const res4 = await window.storage.get("debts");
        setDebts(res4 ? JSON.parse(res4.value) : DEFAULT_DEBTS);
      } catch {
        setDebts(DEFAULT_DEBTS);
      }
    })();
  }, []);
  const persistItems = async (next) => {
    setItems(next);
    try {
      await window.storage.set("transactions", JSON.stringify(next));
    } catch {
      setError("Couldn't save. Your changes may not persist.");
    }
  };
  const mutateItems = (nextOrFn) => {
    const nextItems = typeof nextOrFn === "function" ? nextOrFn(items) : nextOrFn;
    setUndoStack((s) => [...s.slice(-19), items]);
    setRedoStack([]);
    persistItems(nextItems);
  };
  const undo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((s) => s.slice(0, -1));
    setRedoStack((s) => [...s, items]);
    persistItems(prev);
  };
  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((s) => s.slice(0, -1));
    setUndoStack((s) => [...s, items]);
    persistItems(next);
  };
  const persistAccounts = async (next) => {
    setAccounts(next);
    try {
      await window.storage.set("accounts", JSON.stringify(next));
    } catch {
      setError("Couldn't save. Your changes may not persist.");
    }
  };
  const persistRecurring = async (next) => {
    setRecurring(next);
    try {
      await window.storage.set("recurring", JSON.stringify(next));
    } catch {
      setError("Couldn't save. Your changes may not persist.");
    }
  };
  const persistDebts = async (next) => {
    setDebts(next);
    try {
      await window.storage.set("debts", JSON.stringify(next));
    } catch {
      setError("Couldn't save. Your changes may not persist.");
    }
  };
  const exportBackup = () => {
    const payload = {
      app: "money-ledger",
      version: 1,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      transactions: items,
      accounts,
      recurring,
      debts
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = toISODate(/* @__PURE__ */ new Date());
    a.href = url;
    a.download = `money-ledger-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const importBackup = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || !Array.isArray(parsed.transactions) || !Array.isArray(parsed.accounts)) {
          setBackupImportError("That file doesn't look like a Money Ledger backup.");
          return;
        }
        setPendingImport(parsed);
        setBackupImportError(null);
      } catch {
        setBackupImportError("Couldn't read that file. Make sure it's a .json backup exported from this app.");
      }
    };
    reader.onerror = () => setBackupImportError("Couldn't read that file.");
    reader.readAsText(file);
  };
  const confirmImportBackup = () => {
    if (!pendingImport) return;
    if (Array.isArray(pendingImport.transactions)) persistItems(pendingImport.transactions);
    if (Array.isArray(pendingImport.accounts)) persistAccounts(pendingImport.accounts);
    if (Array.isArray(pendingImport.recurring)) persistRecurring(pendingImport.recurring);
    if (Array.isArray(pendingImport.debts)) persistDebts(pendingImport.debts);
    setUndoStack([]);
    setRedoStack([]);
    setPendingImport(null);
  };
  const accountBalances = useMemo(() => {
    if (!items || !accounts) return {};
    const todayStr = toISODate(/* @__PURE__ */ new Date());
    const map = {};
    accounts.forEach((a) => map[a.id] = a.opening);
    items.forEach((t) => {
      if (!isCounted(t) || t.date > todayStr) return;
      if (t.type === "transfer") {
        if (map[t.fromAccountId] === void 0) map[t.fromAccountId] = 0;
        if (map[t.toAccountId] === void 0) map[t.toAccountId] = 0;
        map[t.fromAccountId] -= t.amount;
        map[t.toAccountId] += t.amount;
      } else {
        if (map[t.accountId] === void 0) map[t.accountId] = 0;
        map[t.accountId] += TYPES[t.type].sign * t.amount;
      }
    });
    return map;
  }, [items, accounts]);
  const totalBalance = useMemo(() => Object.values(accountBalances).reduce((a, b) => a + b, 0), [accountBalances]);
  const periodBalances = useMemo(() => {
    if (!items || !accounts) return null;
    const today = /* @__PURE__ */ new Date();
    const [start, end] = periodBounds(balancePeriod, today);
    const startStr = toISODate(start);
    const endStr = toISODate(end);
    const starting = {};
    const ending = {};
    accounts.forEach((a) => {
      starting[a.id] = a.opening;
      ending[a.id] = a.opening;
    });
    items.forEach((t) => {
      if (!isCounted(t)) return;
      if (t.type === "transfer") {
        if (t.date < startStr) {
          starting[t.fromAccountId] -= t.amount;
          starting[t.toAccountId] += t.amount;
        }
        if (t.date <= endStr) {
          ending[t.fromAccountId] -= t.amount;
          ending[t.toAccountId] += t.amount;
        }
      } else {
        if (t.date < startStr) starting[t.accountId] += TYPES[t.type].sign * t.amount;
        if (t.date <= endStr) ending[t.accountId] += TYPES[t.type].sign * t.amount;
      }
    });
    const startingTotal = Object.values(starting).reduce((a, b) => a + b, 0);
    const endingTotal = Object.values(ending).reduce((a, b) => a + b, 0);
    return { start, end, starting, ending, startingTotal, endingTotal, label: periodLabel(balancePeriod, start, end) };
  }, [items, accounts, balancePeriod]);
  const rollingBalanceData = useMemo(() => {
    if (!items || !accounts || !periodBalances) return [];
    const { start, end, starting } = periodBalances;
    const running = { ...starting };
    const byDate = {};
    items.forEach((t) => {
      if (!isCounted(t)) return;
      if (!byDate[t.date]) byDate[t.date] = [];
      byDate[t.date].push(t);
    });
    const days = [];
    let cur = new Date(start);
    let guard = 0;
    while (cur <= end && guard < 400) {
      guard += 1;
      const dateStr = toISODate(cur);
      (byDate[dateStr] || []).forEach((t) => {
        if (t.type === "transfer") {
          running[t.fromAccountId] = (running[t.fromAccountId] || 0) - t.amount;
          running[t.toAccountId] = (running[t.toAccountId] || 0) + t.amount;
        } else {
          running[t.accountId] = (running[t.accountId] || 0) + TYPES[t.type].sign * t.amount;
        }
      });
      const point = { date: dateStr, label: cur.toLocaleDateString(void 0, { month: "short", day: "numeric" }) };
      let total = 0;
      let anyNegative = false;
      accounts.forEach((a) => {
        const bal = running[a.id] || 0;
        point[a.id] = bal;
        total += bal;
        if (bal < 0) anyNegative = true;
      });
      point.total = total;
      point.anyNegative = anyNegative;
      days.push(point);
      cur = addDays(cur, 1);
    }
    return days;
  }, [items, accounts, periodBalances]);
  const todayChartLabel = useMemo(() => {
    const todayStr = toISODate(/* @__PURE__ */ new Date());
    const found = rollingBalanceData.find((d) => d.date === todayStr);
    return found ? found.label : null;
  }, [rollingBalanceData]);
  const completedBalanceByItemId = useMemo(() => {
    if (!items || !accounts) return {};
    const todayStr = toISODate(/* @__PURE__ */ new Date());
    const running = {};
    accounts.forEach((a) => running[a.id] = a.opening);
    const sorted = [...items].sort(byDateAsc);
    const map = {};
    sorted.forEach((t) => {
      if (!isCounted(t) || getStatus(t, todayStr) !== "complete") return;
      if (t.type === "transfer") {
        if (running[t.fromAccountId] === void 0) running[t.fromAccountId] = 0;
        if (running[t.toAccountId] === void 0) running[t.toAccountId] = 0;
        running[t.fromAccountId] -= t.amount;
        running[t.toAccountId] += t.amount;
        map[t.id] = running[t.fromAccountId];
      } else {
        if (running[t.accountId] === void 0) running[t.accountId] = 0;
        running[t.accountId] += TYPES[t.type].sign * t.amount;
        map[t.id] = running[t.accountId];
      }
    });
    return map;
  }, [items, accounts]);
  const totals = useMemo(() => {
    if (!items) return { income: 0, bill: 0, expense: 0, transfer: 0 };
    return items.reduce(
      (acc, t) => {
        if (!isCounted(t)) return acc;
        acc[t.type] += t.amount;
        return acc;
      },
      { income: 0, bill: 0, expense: 0, transfer: 0 }
    );
  }, [items]);
  const upcomingSnapshot = useMemo(() => {
    if (!items || !accounts) return { rows: [], totals: { income: 0, outflow: 0 }, lowest: {}, anyNegative: false };
    const today = /* @__PURE__ */ new Date();
    const todayStr = toISODate(today);
    const [periodStart, periodEnd] = periodBounds(range, today);
    const windowStartStr = toISODate(periodStart);
    const windowEndStr = toISODate(periodEnd);
    const baseline = {};
    accounts.forEach((a) => baseline[a.id] = a.opening);
    for (const t of items) {
      if (t.date >= windowStartStr || !isCounted(t)) continue;
      if (t.type === "transfer") {
        baseline[t.fromAccountId] = (baseline[t.fromAccountId] || 0) - t.amount;
        baseline[t.toAccountId] = (baseline[t.toAccountId] || 0) + t.amount;
      } else {
        baseline[t.accountId] = (baseline[t.accountId] || 0) + TYPES[t.type].sign * t.amount;
      }
    }
    const windowItems = items.filter((t) => t.date >= windowStartStr && t.date <= windowEndStr).sort(byDateAsc);
    const running = { ...baseline };
    const lowest = {};
    accounts.forEach((a) => lowest[a.id] = { balance: baseline[a.id], date: windowStartStr });
    const withBalances = windowItems.map((t) => {
      if (!isCounted(t)) {
        if (t.type === "transfer") return { ...t, fromBalance: running[t.fromAccountId], toBalance: running[t.toAccountId], negative: false };
        return { ...t, resultingBalance: running[t.accountId], negative: false };
      }
      if (t.type === "transfer") {
        running[t.fromAccountId] = (running[t.fromAccountId] || 0) - t.amount;
        running[t.toAccountId] = (running[t.toAccountId] || 0) + t.amount;
        if (running[t.fromAccountId] < lowest[t.fromAccountId].balance) lowest[t.fromAccountId] = { balance: running[t.fromAccountId], date: t.date };
        if (running[t.toAccountId] < lowest[t.toAccountId].balance) lowest[t.toAccountId] = { balance: running[t.toAccountId], date: t.date };
        return { ...t, fromBalance: running[t.fromAccountId], toBalance: running[t.toAccountId], negative: running[t.fromAccountId] < 0 };
      }
      running[t.accountId] = (running[t.accountId] || 0) + TYPES[t.type].sign * t.amount;
      if (running[t.accountId] < lowest[t.accountId].balance) lowest[t.accountId] = { balance: running[t.accountId], date: t.date };
      return { ...t, resultingBalance: running[t.accountId], negative: running[t.accountId] < 0 };
    });
    const rows = upcomingStatusFilter === "all" ? withBalances : withBalances.filter((t) => getStatus(t, todayStr) === upcomingStatusFilter);
    const totals2 = { income: 0, outflow: 0 };
    for (const t of rows) {
      if (!isCounted(t)) continue;
      if (t.type === "income") totals2.income += t.amount;
      else if (t.type !== "transfer") totals2.outflow += t.amount;
    }
    const anyNegative = Object.values(lowest).some((l) => l.balance < 0);
    return { rows, totals: totals2, lowest, anyNegative };
  }, [items, accounts, range, upcomingStatusFilter]);
  const quarterlyData = useMemo(() => {
    if (!items) return [];
    const map = {};
    items.forEach((t) => {
      const key = quarterKey(t.date);
      if (!map[key]) map[key] = { key, income: 0, outflow: 0, transfers: 0 };
      if (!isCounted(t)) return;
      if (t.type === "income") map[key].income += t.amount;
      else if (t.type === "transfer") map[key].transfers += t.amount;
      else map[key].outflow += t.amount;
    });
    const arr = Object.values(map).sort((a, b) => a.key.localeCompare(b.key));
    return arr.map((q, i) => {
      const prev = arr[i - 1];
      return {
        ...q,
        net: q.income - q.outflow,
        incomeChange: prev ? q.income - prev.income : null,
        outflowChange: prev ? q.outflow - prev.outflow : null
      };
    });
  }, [items]);
  const trendsData = useMemo(() => {
    if (!items || !trendsStart || !trendsEnd || trendsStart > trendsEnd) return { buckets: [], total: 0, avg: 0, peak: null };
    const inRange = items.filter((t) => t.type !== "income" && t.type !== "transfer" && isCounted(t) && t.date >= trendsStart && t.date <= trendsEnd);
    const startDate = /* @__PURE__ */ new Date(trendsStart + "T00:00:00");
    const endDate = /* @__PURE__ */ new Date(trendsEnd + "T00:00:00");
    const spanDays = Math.round((endDate - startDate) / 864e5) + 1;
    const byWeek = spanDays <= 60;
    const buckets = [];
    if (byWeek) {
      let cursor = new Date(startDate);
      while (cursor <= endDate) {
        const bucketEnd = new Date(Math.min(addDays(cursor, 6).getTime(), endDate.getTime()));
        buckets.push({ label: fmtDateObj(cursor), start: toISODate(cursor), end: toISODate(bucketEnd), total: 0 });
        cursor = addDays(cursor, 7);
      }
    } else {
      let cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      while (cursor <= endDate) {
        const bucketEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
        buckets.push({
          label: cursor.toLocaleDateString(void 0, { month: "short", year: "2-digit" }),
          start: toISODate(cursor),
          end: toISODate(bucketEnd),
          total: 0
        });
        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
      }
    }
    inRange.forEach((t) => {
      const b = buckets.find((bk) => t.date >= bk.start && t.date <= bk.end);
      if (b) b.total += t.amount;
    });
    for (let i = 0; i < buckets.length; i++) {
      buckets[i].change = i > 0 ? buckets[i].total - buckets[i - 1].total : null;
    }
    const total = inRange.reduce((s, t) => s + t.amount, 0);
    const avg = buckets.length > 0 ? total / buckets.length : 0;
    const peak = buckets.reduce((max, b) => !max || b.total > max.total ? b : max, null);
    return { buckets, total, avg, peak, byWeek };
  }, [items, trendsStart, trendsEnd]);
  const projection = useMemo(() => {
    if (!items || !debts || quarterlyData.length === 0) return null;
    const today = /* @__PURE__ */ new Date();
    const curKey = quarterKeyFromDate(today);
    const [cy, cq] = curKey.split("-Q").map(Number);
    const nextQ = cq % 4 + 1;
    const nextY = cq === 4 ? cy + 1 : cy;
    const nextKey = `${nextY}-Q${nextQ}`;
    const cur = quarterlyData.find((q) => q.key === curKey);
    const next = quarterlyData.find((q) => q.key === nextKey);
    if (!cur || !next) return null;
    const byLabel = { [curKey]: {}, [nextKey]: {} };
    items.forEach((t) => {
      if (t.type === "income" || t.type === "transfer" || !isCounted(t)) return;
      const qk = quarterKey(t.date);
      if (qk !== curKey && qk !== nextKey) return;
      byLabel[qk][t.name] = (byLabel[qk][t.name] || 0) + t.amount;
    });
    const curLabels = byLabel[curKey];
    const nextLabels = byLabel[nextKey];
    const names = /* @__PURE__ */ new Set([...Object.keys(curLabels), ...Object.keys(nextLabels)]);
    const diffs = [...names].map((name) => ({ name, cur: curLabels[name] || 0, next: nextLabels[name] || 0, diff: (nextLabels[name] || 0) - (curLabels[name] || 0) })).filter((d) => d.diff !== 0);
    diffs.sort((a, b) => b.diff - a.diff);
    const increases = diffs.filter((d) => d.diff > 0).slice(0, 3).map((d) => ({ ...d, debt: matchDebt(d.name, debts) }));
    const decreases = diffs.filter((d) => d.diff < 0).slice(0, 2);
    return {
      curKey,
      nextKey,
      cur,
      next,
      incomeVariance: next.income - cur.income,
      outflowVariance: next.outflow - cur.outflow,
      increases,
      decreases
    };
  }, [items, quarterlyData, debts]);
  const sortedDebts = useMemo(() => {
    if (!debts) return [];
    return [...debts].sort((a, b) => b.apr - a.apr || b.balance - a.balance);
  }, [debts]);
  const debtSummary = useMemo(() => {
    if (!debts) return { totalBalance: 0, monthlyInterest: 0, weightedApr: 0 };
    const totalBalance2 = debts.reduce((s, d) => s + d.balance, 0);
    const monthlyInterest = debts.reduce((s, d) => s + d.balance * (d.apr / 100) / 12, 0);
    const weightedApr = totalBalance2 > 0 ? debts.reduce((s, d) => s + d.balance * d.apr, 0) / totalBalance2 : 0;
    return { totalBalance: totalBalance2, monthlyInterest, weightedApr };
  }, [debts]);
  const yearlyData = useMemo(() => {
    if (!items)
      return {
        currentYear: String((/* @__PURE__ */ new Date()).getFullYear()),
        currentQuarterKey: quarterKeyFromDate(/* @__PURE__ */ new Date()),
        currentQuarterItems: [],
        currentQuarterPastCount: 0,
        currentWeekTodayIndex: 0,
        priorQuarterStatements: [],
        pastYears: []
      };
    const currentYear = String((/* @__PURE__ */ new Date()).getFullYear());
    const currentQuarterKey = quarterKeyFromDate(/* @__PURE__ */ new Date());
    const byYear = {};
    items.forEach((t) => {
      const y = t.date.slice(0, 4);
      if (!byYear[y]) byYear[y] = [];
      byYear[y].push(t);
    });
    const thisYearItems = byYear[currentYear] || [];
    const today = /* @__PURE__ */ new Date();
    const todayStr = toISODate(today);
    const weekStartStr = toISODate(addDays(today, -today.getDay()));
    const currentQuarterAll = thisYearItems.filter((t) => quarterKey(t.date) === currentQuarterKey);
    const currentQuarterBeforeWeek = currentQuarterAll.filter((t) => t.date < weekStartStr).sort(byDateAsc);
    const currentQuarterThisWeekForward = currentQuarterAll.filter((t) => t.date >= weekStartStr).sort(byDateAsc);
    const currentQuarterItems = [...currentQuarterBeforeWeek, ...currentQuarterThisWeekForward];
    const priorQuarterMap = {};
    thisYearItems.forEach((t) => {
      const qk = quarterKey(t.date);
      if (qk === currentQuarterKey) return;
      if (!priorQuarterMap[qk]) priorQuarterMap[qk] = [];
      priorQuarterMap[qk].push(t);
    });
    const priorQuarterStatements = Object.keys(priorQuarterMap).sort((a, b) => b.localeCompare(a)).map((qk) => {
      const qItems = priorQuarterMap[qk].sort(byDateAsc);
      const totals2 = qItems.reduce(
        (acc, t) => {
          if (!isCounted(t)) return acc;
          if (t.type === "income") acc.income += t.amount;
          else if (t.type === "transfer") acc.transfers += t.amount;
          else acc.outflow += t.amount;
          return acc;
        },
        { income: 0, outflow: 0, transfers: 0 }
      );
      return { key: qk, items: qItems, ...totals2, net: totals2.income - totals2.outflow, count: qItems.length };
    });
    const pastYears = Object.keys(byYear).filter((y) => y !== currentYear).sort((a, b) => b.localeCompare(a)).map((y) => {
      const yItems = byYear[y].sort(byDateAsc);
      const totals2 = yItems.reduce(
        (acc, t) => {
          if (!isCounted(t)) return acc;
          if (t.type === "income") acc.income += t.amount;
          else if (t.type === "transfer") acc.transfers += t.amount;
          else acc.outflow += t.amount;
          return acc;
        },
        { income: 0, outflow: 0, transfers: 0 }
      );
      return { year: y, items: yItems, ...totals2, net: totals2.income - totals2.outflow, count: yItems.length };
    });
    const todayIndex = currentQuarterThisWeekForward.findIndex((t) => t.date >= todayStr);
    return {
      currentYear,
      currentQuarterKey,
      currentQuarterItems,
      currentQuarterPastCount: currentQuarterBeforeWeek.length,
      currentWeekTodayIndex: todayIndex === -1 ? currentQuarterThisWeekForward.length : todayIndex,
      priorQuarterStatements,
      pastYears
    };
  }, [items]);
  const ledgerPeriodItems = useMemo(() => {
    if (!items) return { items: [], start: /* @__PURE__ */ new Date(), end: /* @__PURE__ */ new Date(), todayIndex: 0, label: "" };
    const today = /* @__PURE__ */ new Date();
    const [start, end] = periodBounds(ledgerPeriod, today);
    const startStr = toISODate(start);
    const endStr = toISODate(end);
    const filtered = items.filter((t) => t.date >= startStr && t.date <= endStr && matchesAccountFilter(t, ledgerAccountFilter)).sort(byDateAsc);
    const todayStr = toISODate(today);
    const todayIdx = filtered.findIndex((t) => t.date >= todayStr);
    return {
      items: filtered,
      start,
      end,
      todayIndex: todayIdx === -1 ? filtered.length : todayIdx,
      label: periodLabel(ledgerPeriod, start, end)
    };
  }, [items, ledgerPeriod, ledgerAccountFilter]);
  const chartData = [
    { name: "Income", value: totals.income, key: "income" },
    { name: "Bills", value: totals.bill, key: "bill" },
    { name: "Expenses", value: totals.expense, key: "expense" }
  ];
  const accountName = (id) => (accounts.find((a) => a.id === id) || {}).name || "Unknown";
  const suggestions = useMemo(() => {
    if (!items) return [];
    const sorted = [...items].filter((t) => t.type === form.type && !t.templateId).sort(byDateDesc);
    const map = {};
    sorted.forEach((t) => {
      const key = t.name.toLowerCase();
      if (!map[key]) map[key] = { name: t.name, amount: t.amount, accountId: t.accountId, count: 0 };
      map[key].count += 1;
    });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 4);
  }, [items, form.type]);
  const openAdd = (type) => {
    const today = /* @__PURE__ */ new Date();
    setForm({
      type,
      name: "",
      amount: "",
      date: todayISO(),
      recurring: false,
      frequency: "monthly",
      day: String(today.getDate()),
      weekday: String(today.getDay()),
      accountId: lastAccountId || accounts[0].id,
      fromAccountId: accounts[0].id,
      toAccountId: accounts[1] ? accounts[1].id : accounts[0].id
    });
    setShowAdd(true);
  };
  const applySuggestion = (s) => {
    setForm((f) => ({ ...f, name: s.name, amount: String(s.amount), accountId: s.accountId }));
  };
  const submit = () => {
    const amt = parseFloat(form.amount);
    if (!form.name.trim() || !amt || amt <= 0) return;
    if (form.type === "transfer") {
      if (form.fromAccountId === form.toAccountId) return;
      const entry = { id: uid(), type: "transfer", name: form.name.trim(), amount: Math.round(amt), date: form.date, fromAccountId: form.fromAccountId, toAccountId: form.toAccountId, templateId: null };
      mutateItems([entry, ...items]);
      setShowAdd(false);
      return;
    }
    setLastAccountId(form.accountId);
    if (form.recurring) {
      const templateId = uid();
      const template = {
        id: templateId,
        type: form.type,
        name: form.name.trim(),
        amount: Math.round(amt),
        accountId: form.accountId,
        frequency: form.frequency,
        day: parseInt(form.day, 10),
        weekday: parseInt(form.weekday, 10)
      };
      persistRecurring([...recurring, template]);
      const entry = { id: uid(), type: form.type, name: template.name, amount: template.amount, date: form.date, accountId: form.accountId, templateId };
      mutateItems([entry, ...items]);
    } else {
      const entry = { id: uid(), type: form.type, name: form.name.trim(), amount: Math.round(amt), date: form.date, accountId: form.accountId, templateId: null };
      mutateItems([entry, ...items]);
    }
    setShowAdd(false);
  };
  const remove = (id) => mutateItems(items.filter((t) => t.id !== id));
  const cycleStatus = (id, direction) => {
    const todayStr = toISODate(/* @__PURE__ */ new Date());
    mutateItems(
      items.map((x) => {
        if (x.id !== id) return x;
        const current = getStatus(x, todayStr);
        const idx = STATUS_ORDER.indexOf(current);
        const nextIdx = (idx + direction + STATUS_ORDER.length) % STATUS_ORDER.length;
        return { ...x, status: STATUS_ORDER[nextIdx] };
      })
    );
  };
  const openEditSeries = (t) => {
    if (t.type === "transfer") return;
    const todayStr = toISODate(/* @__PURE__ */ new Date());
    const currentYear = String((/* @__PURE__ */ new Date()).getFullYear());
    const matches = items.filter((x) => x.type === t.type && x.name.toLowerCase() === t.name.toLowerCase() && x.date >= todayStr && x.date.slice(0, 4) === currentYear).sort(byDateAsc);
    setPendingGroup({ name: t.name, type: t.type, entries: matches.length ? matches : [t] });
  };
  const editOccurrence = (id, patch) => {
    const amt = parseInt(patch.amount, 10);
    const next = items.map((x) => {
      if (x.id !== id) return x;
      const base = {
        ...x,
        name: patch.name.trim() || x.name,
        amount: amt > 0 ? amt : x.amount,
        date: patch.date || x.date,
        type: patch.type
      };
      if (patch.type === "transfer") {
        delete base.accountId;
        base.fromAccountId = patch.fromAccountId;
        base.toAccountId = patch.toAccountId;
      } else {
        delete base.fromAccountId;
        delete base.toAccountId;
        base.accountId = patch.accountId;
      }
      return base;
    });
    mutateItems(next);
  };
  const applyEditAll = (ids, amount, accountId) => {
    const idSet = new Set(ids);
    const amt = parseInt(amount, 10);
    const next = items.map((x) => {
      if (!idSet.has(x.id)) return x;
      return { ...x, amount: amt > 0 ? amt : x.amount, accountId: accountId || x.accountId };
    });
    mutateItems(next);
    setPendingGroup(null);
  };
  const applyEditSingle = (id, amount, accountId) => {
    const amt = parseInt(amount, 10);
    const next = items.map((x) => x.id === id ? { ...x, amount: amt > 0 ? amt : x.amount, accountId: accountId || x.accountId } : x);
    mutateItems(next);
  };
  const deleteFromSeries = (id) => {
    mutateItems(items.filter((x) => x.id !== id));
  };
  const importData = () => {
    const existingIds = new Set(items.map((t) => t.id));
    const toAdd = IMPORTED_2026.filter((t) => !existingIds.has(t.id));
    if (toAdd.length === 0) return;
    mutateItems([...toAdd, ...items]);
  };
  const cleanupCutoff = `${(/* @__PURE__ */ new Date()).getFullYear()}-07-01`;
  const cleanupCount = useMemo(() => items ? items.filter((t) => t.date < cleanupCutoff).length : 0, [items, cleanupCutoff]);
  const removeBeforeCutoff = () => {
    mutateItems(items.filter((t) => t.date >= cleanupCutoff));
    setShowCleanupConfirm(false);
  };
  const duplicateTransfersPreview = useMemo(() => {
    if (!items) return { removed: 0, examples: [] };
    const seen = /* @__PURE__ */ new Map();
    let removed = 0;
    const examples = [];
    items.forEach((t) => {
      if (t.type !== "transfer") return;
      const key = `${t.date}|${t.amount}|${t.fromAccountId}|${t.toAccountId}`;
      if (seen.has(key)) {
        removed += 1;
        if (examples.length < 3) examples.push(t);
      } else {
        seen.set(key, t);
      }
    });
    return { removed, examples };
  }, [items]);
  const removeDuplicateTransfers = () => {
    const seen = /* @__PURE__ */ new Set();
    const next = items.filter((t) => {
      if (t.type !== "transfer") return true;
      const key = `${t.date}|${t.amount}|${t.fromAccountId}|${t.toAccountId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    mutateItems(next);
    setShowDedupeConfirm(false);
  };
  const redundantSplitTransfersPreview = useMemo(() => {
    if (!items) return { removed: 0, examples: [] };
    const splitDates = new Set(items.filter((t) => t.type === "income" && t.accountId === "a1" && t.amount === 1050).map((t) => t.date));
    const matches = items.filter((t) => t.type === "transfer" && t.fromAccountId === "a1" && t.toAccountId === "a2" && t.amount === 450 && splitDates.has(t.date));
    return { removed: matches.length, examples: matches.slice(0, 3) };
  }, [items]);
  const removeRedundantSplitTransfers = () => {
    const splitDates = new Set(items.filter((t) => t.type === "income" && t.accountId === "a1" && t.amount === 1050).map((t) => t.date));
    const toRemove = new Set(
      items.filter((t) => t.type === "transfer" && t.fromAccountId === "a1" && t.toAccountId === "a2" && t.amount === 450 && splitDates.has(t.date)).map((t) => t.id)
    );
    mutateItems(items.filter((t) => !toRemove.has(t.id)));
    setShowRedundantConfirm(false);
  };
  const fixIncomeSplit = () => {
    const alreadySplit = new Set(items.filter((t) => t.type === "income" && t.accountId === "a2" && t.amount === 450).map((t) => t.date));
    const additions = [];
    const updated = items.map((t) => {
      if (t.type === "income" && t.accountId === "a1" && t.amount >= 1490 && !alreadySplit.has(t.date)) {
        additions.push({ id: uid(), type: "income", name: "Income deposit (PFFCU-X)", amount: 450, date: t.date, accountId: "a2", templateId: null });
        return { ...t, amount: t.amount - 450 };
      }
      return t;
    });
    if (additions.length === 0) return;
    mutateItems([...updated, ...additions]);
  };
  const markDone = (tpl) => {
    const entry = { id: uid(), type: tpl.type, name: tpl.name, amount: tpl.amount, date: todayISO(), accountId: tpl.accountId, templateId: tpl.id };
    mutateItems([entry, ...items]);
    setJustDone(tpl.id);
    setTimeout(() => setJustDone(null), 1500);
  };
  const saveAccountEdit = (id, name, opening) => {
    const next = accounts.map((a) => a.id === id ? { ...a, name: name.trim() || a.name, opening: parseInt(opening, 10) || 0 } : a);
    persistAccounts(next);
    setEditAccount(null);
  };
  const addAccount = () => {
    const a = { id: uid(), name: "New account", opening: 0 };
    persistAccounts([...accounts, a]);
    setEditAccount(a);
  };
  const deleteAccount = (id) => {
    if (accounts.length <= 1) return;
    persistAccounts(accounts.filter((a) => a.id !== id));
    setEditAccount(null);
  };
  const saveRecurringEdit = (id, name, amount, accountId, day, frequency, weekday) => {
    const next = recurring.map(
      (r) => r.id === id ? {
        ...r,
        name: name.trim() || r.name,
        amount: parseInt(amount, 10) || r.amount,
        accountId,
        frequency: frequency || "monthly",
        day: parseInt(day, 10) || r.day,
        weekday: parseInt(weekday, 10)
      } : r
    );
    persistRecurring(next);
    setEditRecurring(null);
  };
  const deleteRecurring = (id) => {
    persistRecurring(recurring.filter((r) => r.id !== id));
    setEditRecurring(null);
  };
  const openAddRecurring = (defaultType = "bill") => {
    const today = /* @__PURE__ */ new Date();
    setRecurringForm({ type: defaultType, name: "", amount: "", accountId: accounts[0].id, frequency: "monthly", day: String(today.getDate()), weekday: String(today.getDay()) });
    setShowAddRecurring(true);
  };
  const submitNewRecurring = () => {
    const amt = parseInt(recurringForm.amount, 10);
    if (!recurringForm.name.trim() || !amt) return;
    const template = {
      id: uid(),
      type: recurringForm.type,
      name: recurringForm.name.trim(),
      amount: amt,
      accountId: recurringForm.accountId,
      frequency: recurringForm.frequency,
      day: parseInt(recurringForm.day, 10) || 1,
      weekday: parseInt(recurringForm.weekday, 10) || 0
    };
    persistRecurring([...recurring, template]);
    setShowAddRecurring(false);
  };
  const syncExpensesPreview = useMemo(() => {
    if (!items || !recurring) return { removed: 0, added: 0 };
    const todayStr = toISODate(/* @__PURE__ */ new Date());
    const yearEnd = `${(/* @__PURE__ */ new Date()).getFullYear()}-12-31`;
    const scoped = recurring.filter((r) => syncScope === "income" ? r.type === "income" : r.type !== "income");
    const templateIds = new Set(scoped.map((r) => r.id));
    const removed = items.filter((t) => t.templateId && templateIds.has(t.templateId) && t.date > todayStr).length;
    const kept = items.filter((t) => !(t.templateId && templateIds.has(t.templateId) && t.date > todayStr));
    let added = 0;
    scoped.forEach((tpl) => {
      let due = nextDueForTemplate(tpl, kept);
      while (toISODate(due) <= yearEnd) {
        added += 1;
        due = stepDue(due, tpl);
      }
    });
    return { removed, added };
  }, [items, recurring, syncScope]);
  const syncExpenses = () => {
    const todayStr = toISODate(/* @__PURE__ */ new Date());
    const yearEnd = `${(/* @__PURE__ */ new Date()).getFullYear()}-12-31`;
    const scoped = recurring.filter((r) => syncScope === "income" ? r.type === "income" : r.type !== "income");
    const templateIds = new Set(scoped.map((r) => r.id));
    const kept = items.filter((t) => !(t.templateId && templateIds.has(t.templateId) && t.date > todayStr));
    const additions = [];
    scoped.forEach((tpl) => {
      let due = nextDueForTemplate(tpl, kept);
      while (toISODate(due) <= yearEnd) {
        additions.push({ id: uid(), type: tpl.type, name: tpl.name, amount: tpl.amount, date: toISODate(due), accountId: tpl.accountId, templateId: tpl.id });
        due = stepDue(due, tpl);
      }
    });
    mutateItems([...additions, ...kept]);
    setShowSyncConfirm(false);
  };
  const addDebt = () => {
    const d = { id: uid(), name: "New account", balance: 0, apr: 0 };
    persistDebts([...debts, d]);
    setEditDebt(d);
  };
  const saveDebtEdit = (id, name, balance, apr) => {
    const next = debts.map((d) => d.id === id ? { ...d, name: name.trim() || d.name, balance: parseInt(balance, 10) || 0, apr: parseFloat(apr) || 0 } : d);
    persistDebts(next);
    setEditDebt(null);
  };
  const deleteDebt = (id) => {
    persistDebts(debts.filter((d) => d.id !== id));
    setEditDebt(null);
  };
  const scrollDragRef = useRef({ dragging: false, startY: 0, startScrollY: 0 });
  const [scrollThumb, setScrollThumb] = useState({ top: 0, height: 40, visible: false });
  const updateScrollThumb = () => {
    const trackHeight = window.innerHeight;
    const contentHeight = document.documentElement.scrollHeight;
    if (contentHeight <= trackHeight) {
      setScrollThumb({ top: 0, height: trackHeight, visible: false });
    } else {
      const thumbHeight = Math.max(32, trackHeight / contentHeight * trackHeight);
      const maxThumbTop = trackHeight - thumbHeight;
      const maxScroll = contentHeight - trackHeight;
      const fraction = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollThumb({ top: fraction * maxThumbTop, height: thumbHeight, visible: true });
    }
  };
  useEffect(() => {
    updateScrollThumb();
    const onScroll = () => updateScrollThumb();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [view, items, accounts, recurring, debts]);
  const startThumbDrag = (clientY) => {
    scrollDragRef.current = { dragging: true, startY: clientY, startScrollY: window.scrollY };
  };
  const onThumbDragMove = (clientY) => {
    if (!scrollDragRef.current.dragging) return;
    const trackHeight = window.innerHeight;
    const contentHeight = document.documentElement.scrollHeight;
    const maxScroll = contentHeight - trackHeight;
    const scrollableTrack = trackHeight - scrollThumb.height;
    const deltaY = clientY - scrollDragRef.current.startY;
    const scrollDelta = scrollableTrack > 0 ? deltaY / scrollableTrack * maxScroll : 0;
    window.scrollTo(0, scrollDragRef.current.startScrollY + scrollDelta);
    updateScrollThumb();
  };
  const endThumbDrag = () => {
    scrollDragRef.current.dragging = false;
  };
  if (items === null || accounts === null || recurring === null || debts === null) {
    return /* @__PURE__ */ jsx("div", { style: { fontFamily: "-apple-system, sans-serif", color: MUTED, padding: "3rem 1rem", textAlign: "center", background: BG }, children: "Loading your ledger\u2026" });
  }
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative", maxWidth: 420, margin: "0 auto", background: BG, minHeight: 600 }, children: [
    /* @__PURE__ */ jsxs("div", { style: { fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", background: BG, color: TEXT, padding: "0 10px" }, children: [
      /* @__PURE__ */ jsx("div", { style: { background: HEADER, color: HEADER_TEXT, padding: "calc(0.65rem + env(safe-area-inset-top, 0px)) 1.25rem 0.65rem", position: "sticky", top: 0, zIndex: 40 }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setMenuOpen(true),
            "aria-label": "Open menu",
            style: { background: "none", border: "none", color: HEADER_TEXT, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", marginRight: 8 },
            children: /* @__PURE__ */ jsx(Menu, { size: 18 })
          }
        ),
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 19, fontWeight: 600 }, children: fmt(totalBalance) }),
        /* @__PURE__ */ jsx("div", { style: { flex: 1 } }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 10 }, children: accounts.map((a) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setEditAccount(a),
            style: { display: "flex", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", color: HEADER_TEXT, padding: 0 },
            children: [
              /* @__PURE__ */ jsx("div", { style: { width: 6, height: 6, borderRadius: "50%", background: accountColorFor(a.id, accounts) } }),
              /* @__PURE__ */ jsx("span", { style: { fontFamily: "ui-monospace, monospace", fontSize: 12.5, fontWeight: 600 }, children: fmt(accountBalances[a.id] || 0) })
            ]
          },
          a.id
        )) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { style: { height: 10, backgroundImage: `radial-gradient(circle at 6px 0px, ${BG} 5px, transparent 5.5px)`, backgroundSize: "16px 10px", backgroundColor: HEADER } }),
      ["config-expenses", "config-income", "config-accounts", "quarterly", "trends", "ledger", "debts", "backup"].includes(view) ? /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "0.85rem 1.25rem", borderBottom: `1px solid ${LINE}` }, children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setView("overview"), "aria-label": "Back", style: { background: "none", border: "none", color: TEXT, cursor: "pointer", display: "flex", alignItems: "center" }, children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18 }) }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 15, fontWeight: 700, color: TEXT }, children: {
          "config-expenses": "Configuration \xB7 Expenses",
          "config-income": "Configuration \xB7 Income",
          "config-accounts": "Configuration \xB7 Accounts",
          quarterly: "Quarterly Statements",
          trends: "Expenses Over Time",
          ledger: "Ledger",
          debts: "Debts",
          backup: "Backup & Restore"
        }[view] })
      ] }) : null,
      /* @__PURE__ */ jsxs("div", { style: { padding: "1.1rem 1.25rem 7rem" }, children: [
        error && /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: DEBIT, marginBottom: 12 }, children: error }),
        view === "overview" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: 24 }, children: [
            /* @__PURE__ */ jsx(SectionLabel, { icon: /* @__PURE__ */ jsx(TrendingUp, { size: 13 }), text: "Rolling balance" }),
            periodBalances && /* @__PURE__ */ jsx("div", { style: { fontSize: 11.5, color: MUTED, marginTop: 8, marginBottom: 8 }, children: periodBalances.label }),
            rollingBalanceData.length === 0 ? /* @__PURE__ */ jsx(EmptyNote, { children: "No activity logged in this period yet." }) : /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 6 }, children: [
              /* @__PURE__ */ jsx("div", { style: { flex: 1, minWidth: 0, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.6rem 0.4rem 0.4rem 0.5rem" }, children: accounts.map((a, idx) => {
                const isLast = idx === accounts.length - 1;
                return /* @__PURE__ */ jsx("div", { style: { marginBottom: isLast ? 0 : 2, borderLeft: `2px solid ${accountColorFor(a.id, accounts)}`, paddingLeft: 6 }, children: /* @__PURE__ */ jsx("div", { style: { height: 68 }, children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(LineChart, { data: rollingBalanceData, margin: { top: 4, right: 4, left: 0, bottom: 0 }, children: [
                  /* @__PURE__ */ jsx(CartesianGrid, { stroke: LINE, strokeDasharray: "2 4", vertical: true, horizontal: true, strokeOpacity: 0.5 }),
                  /* @__PURE__ */ jsx(
                    XAxis,
                    {
                      dataKey: "label",
                      tick: isLast ? { fontSize: 8.5, fill: MUTED } : false,
                      axisLine: false,
                      tickLine: false,
                      height: isLast ? 16 : 1,
                      interval: rollingBalanceData.length > 8 ? Math.ceil(rollingBalanceData.length / 8) - 1 : 0
                    }
                  ),
                  /* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 7.5, fill: MUTED }, axisLine: false, tickLine: false, width: 30, tickFormatter: (v) => fmt(v), tickCount: 3 }),
                  /* @__PURE__ */ jsx(ReferenceLine, { y: 0, stroke: DEBIT, strokeDasharray: "3 3" }),
                  todayChartLabel && /* @__PURE__ */ jsx(ReferenceLine, { x: todayChartLabel, stroke: GOLD, strokeWidth: 1.5, label: isLast ? { value: "Today", position: "insideTopRight", fill: GOLD, fontSize: 9, fontWeight: 700 } : void 0 }),
                  /* @__PURE__ */ jsx(Tooltip, { formatter: (v) => [fmt(v), a.name], labelFormatter: (label) => label, contentStyle: { fontSize: 11, border: `1px solid ${LINE}`, borderRadius: 6, background: SURFACE, color: TEXT }, labelStyle: { color: TEXT } }),
                  /* @__PURE__ */ jsx(
                    Line,
                    {
                      dataKey: a.id,
                      name: a.name,
                      stroke: accountColorFor(a.id, accounts),
                      strokeWidth: 1.75,
                      dot: (props) => {
                        const neg = props.payload[a.id] < 0;
                        return neg ? /* @__PURE__ */ jsx("circle", { cx: props.cx, cy: props.cy, r: 2.5, fill: DEBIT, stroke: "none" }, `d-${a.id}-${props.index}`) : /* @__PURE__ */ jsx("circle", { r: 0 }, `d-${a.id}-${props.index}`);
                      },
                      isAnimationActive: false
                    }
                  )
                ] }) }) }) }, a.id);
              }) }),
              /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 6, width: 34, flexShrink: 0, alignItems: "center" }, children: Object.entries(CALENDAR_PERIODS).map(([key, label]) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setBalancePeriod(key),
                  "aria-label": label,
                  style: {
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    border: `1px solid ${balancePeriod === key ? GOLD : LINE}`,
                    background: balancePeriod === key ? GOLD : SURFACE,
                    color: balancePeriod === key ? "#0B120E" : MUTED,
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0
                  },
                  children: label[0]
                },
                key
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: 24 }, children: [
            /* @__PURE__ */ jsx(SectionLabel, { icon: /* @__PURE__ */ jsx(Clock, { size: 13 }), text: "This Period" }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 6, marginTop: 8, marginBottom: 10 }, children: Object.entries(RANGES).map(([key, r]) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setRange(key),
                style: {
                  flex: 1,
                  padding: "0.35rem 0",
                  borderRadius: 999,
                  border: `1px solid ${range === key ? GOLD : LINE}`,
                  background: range === key ? GOLD : SURFACE,
                  color: range === key ? "#0B120E" : MUTED,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer"
                },
                children: r.label
              },
              key
            )) }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }, children: ["all", "upcoming", "pending", "complete"].map((key) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setUpcomingStatusFilter(key),
                style: {
                  padding: "0.25rem 0.6rem",
                  borderRadius: 999,
                  border: `1px solid ${upcomingStatusFilter === key ? key === "all" ? GOLD : STATUSES[key].color : LINE}`,
                  background: upcomingStatusFilter === key ? key === "all" ? GOLD : `${STATUSES[key].color}22` : "none",
                  color: upcomingStatusFilter === key ? key === "all" ? "#0B120E" : TEXT : MUTED,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "capitalize"
                },
                children: key === "all" ? "All" : STATUSES[key].label
              },
              key
            )) }),
            /* @__PURE__ */ jsxs("div", { style: { background: upcomingSnapshot.anyNegative ? "rgba(224,112,90,0.1)" : SURFACE, border: `1px solid ${upcomingSnapshot.anyNegative ? DEBIT : LINE}`, borderRadius: 8, padding: "0.75rem 0.85rem", marginBottom: 12 }, children: [
              /* @__PURE__ */ jsxs("div", { style: { fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }, children: [
                "Snapshot this ",
                RANGES[range].label.toLowerCase()
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }, children: [
                /* @__PURE__ */ jsx("span", { style: { color: MUTED }, children: "Total income" }),
                /* @__PURE__ */ jsxs("span", { style: { color: CREDIT, fontWeight: 600, fontFamily: "ui-monospace, monospace" }, children: [
                  "+",
                  fmt(upcomingSnapshot.totals.income)
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }, children: [
                /* @__PURE__ */ jsx("span", { style: { color: MUTED }, children: "Total outflow" }),
                /* @__PURE__ */ jsxs("span", { style: { color: DEBIT, fontWeight: 600, fontFamily: "ui-monospace, monospace" }, children: [
                  "-",
                  fmt(upcomingSnapshot.totals.outflow)
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13, paddingTop: 6, borderTop: `1px dashed ${LINE}` }, children: [
                /* @__PURE__ */ jsx("span", { style: { color: MUTED, fontWeight: 600 }, children: "Net" }),
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 700, fontFamily: "ui-monospace, monospace", color: upcomingSnapshot.totals.income - upcomingSnapshot.totals.outflow >= 0 ? CREDIT : DEBIT }, children: fmt(upcomingSnapshot.totals.income - upcomingSnapshot.totals.outflow) })
              ] }),
              accounts.map(
                (a) => upcomingSnapshot.lowest[a.id] && upcomingSnapshot.lowest[a.id].balance < 0 ? /* @__PURE__ */ jsxs("div", { style: { fontSize: 11.5, color: DEBIT, marginTop: 8, fontWeight: 600 }, children: [
                  "\u26A0 ",
                  a.name,
                  " projected to dip to ",
                  fmt(upcomingSnapshot.lowest[a.id].balance),
                  " around ",
                  fmtDate(upcomingSnapshot.lowest[a.id].date)
                ] }, a.id) : null
              )
            ] }),
            (() => {
              const filteredRows = upcomingSnapshot.rows;
              return filteredRows.length === 0 ? /* @__PURE__ */ jsxs(EmptyNote, { children: [
                upcomingStatusFilter === "all" ? "Nothing logged" : `Nothing marked ${STATUSES[upcomingStatusFilter].label}`,
                " this ",
                RANGES[range].label.toLowerCase(),
                "."
              ] }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 2 }, children: filteredRows.map((t) => /* @__PURE__ */ jsx(
                LedgerRow,
                {
                  t,
                  accountName,
                  remove,
                  onEditSeries: openEditSeries,
                  onEditOccurrence: editOccurrence,
                  onCycleStatus: cycleStatus,
                  accounts,
                  balanceAfter: t.type === "transfer" ? t.fromBalance : t.resultingBalance
                },
                t.id
              )) });
            })()
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: 8 }, children: [
            /* @__PURE__ */ jsx(SectionLabel, { icon: /* @__PURE__ */ jsx(TrendingUp, { size: 13 }), text: "Cash flow, all-time" }),
            items.length === 0 ? /* @__PURE__ */ jsx(EmptyNote, { children: "Log income, bills, or expenses to see your totals compared here." }) : /* @__PURE__ */ jsx("div", { style: { height: 160, marginTop: 8 }, children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: chartData, margin: { top: 8, right: 8, left: 8, bottom: 0 }, children: [
              /* @__PURE__ */ jsx(XAxis, { dataKey: "name", tick: { fontSize: 12, fill: MUTED }, axisLine: { stroke: LINE }, tickLine: false }),
              /* @__PURE__ */ jsx(YAxis, { hide: true }),
              /* @__PURE__ */ jsx(Tooltip, { formatter: (v) => fmt(v), contentStyle: { fontSize: 12, border: `1px solid ${LINE}`, borderRadius: 6, background: SURFACE, color: TEXT }, labelStyle: { color: TEXT }, itemStyle: { color: TEXT } }),
              /* @__PURE__ */ jsx(Bar, { dataKey: "value", radius: [4, 4, 0, 0], children: chartData.map((d) => /* @__PURE__ */ jsx(Cell, { fill: d.key === "income" ? CREDIT : DEBIT }, d.key)) })
            ] }) }) })
          ] })
        ] }),
        view === "ledger" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx(SectionLabel, { icon: /* @__PURE__ */ jsx(Receipt, { size: 13 }), text: "Ledger" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: undo,
                  disabled: undoStack.length === 0,
                  "aria-label": "Undo",
                  style: { display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", border: `1px solid ${LINE}`, background: "none", color: undoStack.length === 0 ? DISABLED_TEXT : MUTED, cursor: undoStack.length === 0 ? "not-allowed" : "pointer" },
                  children: /* @__PURE__ */ jsx(RotateCcw, { size: 13 })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: redo,
                  disabled: redoStack.length === 0,
                  "aria-label": "Redo",
                  style: { display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", border: `1px solid ${LINE}`, background: "none", color: redoStack.length === 0 ? DISABLED_TEXT : MUTED, cursor: redoStack.length === 0 ? "not-allowed" : "pointer" },
                  children: /* @__PURE__ */ jsx(RotateCw, { size: 13 })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: importData,
                  style: { fontSize: 11.5, fontWeight: 600, color: TRANSFER, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.3rem 0.65rem", cursor: "pointer" },
                  children: "Import 2026 data"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 6, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: fixIncomeSplit,
                style: { fontSize: 11, fontWeight: 600, color: GOLD, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.25rem 0.6rem", cursor: "pointer" },
                children: "Fix $450 income split"
              }
            ),
            cleanupCount > 0 && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setShowCleanupConfirm(true),
                style: { fontSize: 11, fontWeight: 600, color: DEBIT, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.25rem 0.6rem", cursor: "pointer" },
                children: [
                  "Remove pre-Jul 1 (",
                  cleanupCount,
                  ")"
                ]
              }
            ),
            duplicateTransfersPreview.removed > 0 && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setShowDedupeConfirm(true),
                style: { fontSize: 11, fontWeight: 600, color: TRANSFER, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.25rem 0.6rem", cursor: "pointer" },
                children: [
                  "Remove duplicate transfers (",
                  duplicateTransfersPreview.removed,
                  ")"
                ]
              }
            ),
            redundantSplitTransfersPreview.removed > 0 && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setShowRedundantConfirm(true),
                style: { fontSize: 11, fontWeight: 600, color: TRANSFER, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.25rem 0.6rem", cursor: "pointer" },
                children: [
                  "Remove redundant $450 transfers (",
                  redundantSplitTransfersPreview.removed,
                  ")"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 6, padding: "0.6rem 0 0.1rem", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setLedgerAccountFilter("all"),
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "0.25rem 0.55rem",
                  borderRadius: 999,
                  border: `1px solid ${ledgerAccountFilter === "all" ? GOLD : LINE}`,
                  background: ledgerAccountFilter === "all" ? GOLD : "none",
                  color: ledgerAccountFilter === "all" ? "#0B120E" : MUTED,
                  cursor: "pointer"
                },
                children: "All accounts"
              }
            ),
            accounts.map((a) => /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setLedgerAccountFilter(a.id),
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "0.25rem 0.55rem",
                  borderRadius: 999,
                  border: `1px solid ${ledgerAccountFilter === a.id ? accountColorFor(a.id, accounts) : LINE}`,
                  background: ledgerAccountFilter === a.id ? `${accountColorFor(a.id, accounts)}22` : "none",
                  color: ledgerAccountFilter === a.id ? TEXT : MUTED,
                  cursor: "pointer"
                },
                children: [
                  /* @__PURE__ */ jsx("div", { style: { width: 7, height: 7, borderRadius: "50%", background: accountColorFor(a.id, accounts) } }),
                  a.name
                ]
              },
              a.id
            ))
          ] }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 6, marginTop: 10, marginBottom: 2 }, children: Object.entries(CALENDAR_PERIODS).map(([key, label]) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setLedgerPeriod(key),
              style: {
                flex: 1,
                padding: "0.35rem 0",
                borderRadius: 999,
                border: `1px solid ${ledgerPeriod === key ? GOLD : LINE}`,
                background: ledgerPeriod === key ? GOLD : SURFACE,
                color: ledgerPeriod === key ? "#0B120E" : MUTED,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer"
              },
              children: label
            },
            key
          )) }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: 11.5, color: MUTED, marginTop: 8 }, children: ledgerPeriodItems.label }),
          /* @__PURE__ */ jsxs("div", { style: { position: "relative", height: 34, marginTop: 8, marginBottom: 4 }, children: [
            /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: 7, left: 0, right: 0, height: 2, background: LINE, borderRadius: 1 } }),
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  position: "absolute",
                  top: 1,
                  left: `${Math.min(100, Math.max(0, (/* @__PURE__ */ new Date() - ledgerPeriodItems.start) / (ledgerPeriodItems.end - ledgerPeriodItems.start + 864e5) * 100))}%`,
                  width: 2,
                  height: 14,
                  background: GOLD,
                  borderRadius: 1,
                  transform: "translateX(-1px)"
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  position: "absolute",
                  top: 18,
                  left: `${Math.min(100, Math.max(0, (/* @__PURE__ */ new Date() - ledgerPeriodItems.start) / (ledgerPeriodItems.end - ledgerPeriodItems.start + 864e5) * 100))}%`,
                  transform: "translateX(-50%)",
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: GOLD,
                  whiteSpace: "nowrap"
                },
                children: "Today"
              }
            ),
            /* @__PURE__ */ jsx("span", { style: { position: "absolute", top: 18, left: 0, fontSize: 9.5, color: MUTED }, children: ledgerPeriodItems.start.toLocaleDateString(void 0, { month: "short", day: "numeric" }) }),
            /* @__PURE__ */ jsx("span", { style: { position: "absolute", top: 18, right: 0, fontSize: 9.5, color: MUTED }, children: ledgerPeriodItems.end.toLocaleDateString(void 0, { month: "short", day: "numeric" }) })
          ] }),
          ledgerPeriodItems.items.length === 0 ? /* @__PURE__ */ jsx(EmptyNote, { children: ledgerAccountFilter === "all" ? "Nothing logged in this period yet." : "No transactions for this account in this period." }) : /* @__PURE__ */ jsx("div", { style: { marginTop: 8 }, children: ledgerPeriodItems.items.map((t, i) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
            i === ledgerPeriodItems.todayIndex && i < ledgerPeriodItems.items.length && i > 0 && /* @__PURE__ */ jsx("div", { style: { fontSize: 10.5, color: GOLD, textTransform: "uppercase", letterSpacing: "0.06em", padding: "0.6rem 0 0.2rem", fontWeight: 700 }, children: "Today forward" }),
            /* @__PURE__ */ jsx(LedgerRow, { t, accountName, remove, onEditSeries: openEditSeries, onEditOccurrence: editOccurrence, onCycleStatus: cycleStatus, accounts, balanceAfter: completedBalanceByItemId[t.id] })
          ] }, t.id)) }),
          /* @__PURE__ */ jsxs("div", { style: { marginTop: 28 }, children: [
            /* @__PURE__ */ jsx(SectionLabel, { icon: /* @__PURE__ */ jsx(Receipt, { size: 13 }), text: "Quarterly statements" }),
            yearlyData.priorQuarterStatements.length === 0 ? /* @__PURE__ */ jsxs(EmptyNote, { children: [
              "Earlier quarters from ",
              yearlyData.currentYear,
              " will summarize here once they've passed. Right now everything is still in the current quarter."
            ] }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }, children: yearlyData.priorQuarterStatements.map((q) => {
              const expanded = !!expandedQuarters[q.key];
              return /* @__PURE__ */ jsxs("div", { style: { background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, overflow: "hidden" }, children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setExpandedQuarters((prev) => ({ ...prev, [q.key]: !prev[q.key] })),
                    style: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: "0.75rem 0.9rem", cursor: "pointer", textAlign: "left" },
                    children: [
                      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                        expanded ? /* @__PURE__ */ jsx(ChevronDown, { size: 15, color: MUTED }) : /* @__PURE__ */ jsx(ChevronRight, { size: 15, color: MUTED }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("div", { style: { fontSize: 14, fontWeight: 700, color: TEXT }, children: quarterLabel(q.key) }),
                          /* @__PURE__ */ jsxs("div", { style: { fontSize: 11.5, color: MUTED }, children: [
                            q.count,
                            " entries"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { style: { textAlign: "right" }, children: [
                        /* @__PURE__ */ jsxs("div", { style: { fontFamily: "ui-monospace, monospace", fontSize: 13.5, fontWeight: 700, color: q.net >= 0 ? CREDIT : DEBIT }, children: [
                          fmt(q.net),
                          " net"
                        ] }),
                        /* @__PURE__ */ jsxs("div", { style: { fontSize: 11, color: MUTED }, children: [
                          /* @__PURE__ */ jsxs("span", { style: { color: CREDIT }, children: [
                            "+",
                            fmt(q.income)
                          ] }),
                          " \xB7 ",
                          /* @__PURE__ */ jsxs("span", { style: { color: DEBIT }, children: [
                            "-",
                            fmt(q.outflow)
                          ] })
                        ] })
                      ] })
                    ]
                  }
                ),
                expanded && /* @__PURE__ */ jsxs("div", { style: { padding: "0 0.9rem 0.75rem", borderTop: `1px solid ${LINE}` }, children: [
                  q.transfers > 0 && /* @__PURE__ */ jsxs("div", { style: { fontSize: 11.5, color: TRANSFER, padding: "0.6rem 0 0.2rem" }, children: [
                    "Internal transfers this quarter: ",
                    fmt(q.transfers)
                  ] }),
                  q.items.filter((t) => matchesAccountFilter(t, ledgerAccountFilter)).map((t) => /* @__PURE__ */ jsx(LedgerRow, { t, accountName, remove, onEditSeries: openEditSeries, onEditOccurrence: editOccurrence, onCycleStatus: cycleStatus, accounts, balanceAfter: completedBalanceByItemId[t.id], bg: SURFACE }, t.id))
                ] })
              ] }, q.key);
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginTop: 28 }, children: [
            /* @__PURE__ */ jsx(SectionLabel, { icon: /* @__PURE__ */ jsx(Archive, { size: 13 }), text: "Yearly rollup" }),
            yearlyData.pastYears.length === 0 ? /* @__PURE__ */ jsxs(EmptyNote, { children: [
              "Past years will consolidate here automatically. Right now everything you've logged falls in ",
              yearlyData.currentYear,
              ", so there's nothing to roll up yet."
            ] }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }, children: yearlyData.pastYears.map((y) => {
              const expanded = !!expandedYears[y.year];
              return /* @__PURE__ */ jsxs("div", { style: { background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, overflow: "hidden" }, children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setExpandedYears((prev) => ({ ...prev, [y.year]: !prev[y.year] })),
                    style: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: "0.75rem 0.9rem", cursor: "pointer", textAlign: "left" },
                    children: [
                      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                        expanded ? /* @__PURE__ */ jsx(ChevronDown, { size: 15, color: MUTED }) : /* @__PURE__ */ jsx(ChevronRight, { size: 15, color: MUTED }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("div", { style: { fontSize: 14, fontWeight: 700, color: TEXT }, children: y.year }),
                          /* @__PURE__ */ jsxs("div", { style: { fontSize: 11.5, color: MUTED }, children: [
                            y.count,
                            " entries"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { style: { textAlign: "right" }, children: [
                        /* @__PURE__ */ jsxs("div", { style: { fontFamily: "ui-monospace, monospace", fontSize: 13.5, fontWeight: 700, color: y.net >= 0 ? CREDIT : DEBIT }, children: [
                          fmt(y.net),
                          " net"
                        ] }),
                        /* @__PURE__ */ jsxs("div", { style: { fontSize: 11, color: MUTED }, children: [
                          /* @__PURE__ */ jsxs("span", { style: { color: CREDIT }, children: [
                            "+",
                            fmt(y.income)
                          ] }),
                          " \xB7 ",
                          /* @__PURE__ */ jsxs("span", { style: { color: DEBIT }, children: [
                            "-",
                            fmt(y.outflow)
                          ] })
                        ] })
                      ] })
                    ]
                  }
                ),
                expanded && /* @__PURE__ */ jsxs("div", { style: { padding: "0 0.9rem 0.75rem", borderTop: `1px solid ${LINE}` }, children: [
                  y.transfers > 0 && /* @__PURE__ */ jsxs("div", { style: { fontSize: 11.5, color: TRANSFER, padding: "0.6rem 0 0.2rem" }, children: [
                    "Internal transfers this year: ",
                    fmt(y.transfers)
                  ] }),
                  y.items.filter((t) => matchesAccountFilter(t, ledgerAccountFilter)).map((t) => /* @__PURE__ */ jsx(LedgerRow, { t, accountName, remove, onEditSeries: openEditSeries, onEditOccurrence: editOccurrence, onCycleStatus: cycleStatus, accounts, balanceAfter: completedBalanceByItemId[t.id], bg: SURFACE }, t.id))
                ] })
              ] }, y.year);
            }) })
          ] })
        ] }),
        view === "trends" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(SectionLabel, { icon: /* @__PURE__ */ jsx(TrendingUp, { size: 13 }), text: "Expenses over time" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, marginTop: 10, marginBottom: 14 }, children: [
            /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Start" }),
              /* @__PURE__ */ jsx("input", { type: "date", value: trendsStart, onChange: (e) => setTrendsStart(e.target.value), style: dateInputStyle })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsx("label", { style: labelStyle, children: "End" }),
              /* @__PURE__ */ jsx("input", { type: "date", value: trendsEnd, onChange: (e) => setTrendsEnd(e.target.value), style: dateInputStyle })
            ] })
          ] }),
          trendsStart > trendsEnd ? /* @__PURE__ */ jsx(EmptyNote, { children: "Start date needs to be before the end date." }) : trendsData.buckets.length === 0 ? /* @__PURE__ */ jsx(EmptyNote, { children: "No bills or expenses logged in this range." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, marginBottom: 14 }, children: [
              /* @__PURE__ */ jsxs("div", { style: { flex: 1, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.6rem 0.7rem" }, children: [
                /* @__PURE__ */ jsx("div", { style: { fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Total spent" }),
                /* @__PURE__ */ jsx("div", { style: { fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 700, color: DEBIT, marginTop: 2 }, children: fmt(trendsData.total) })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { flex: 1, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.6rem 0.7rem" }, children: [
                /* @__PURE__ */ jsxs("div", { style: { fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }, children: [
                  "Avg per ",
                  trendsData.byWeek ? "week" : "month"
                ] }),
                /* @__PURE__ */ jsx("div", { style: { fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 700, color: TEXT, marginTop: 2 }, children: fmt(trendsData.avg) })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { flex: 1, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.6rem 0.7rem" }, children: [
                /* @__PURE__ */ jsxs("div", { style: { fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }, children: [
                  "Peak ",
                  trendsData.byWeek ? "week" : "month"
                ] }),
                /* @__PURE__ */ jsx("div", { style: { fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 700, color: GOLD, marginTop: 2 }, children: trendsData.peak ? fmt(trendsData.peak.total) : "\u2014" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { style: { height: 220 }, children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: trendsData.buckets, margin: { top: 8, right: 8, left: 8, bottom: 0 }, children: [
              /* @__PURE__ */ jsx(XAxis, { dataKey: "label", tick: { fontSize: 10.5, fill: MUTED }, axisLine: { stroke: LINE }, tickLine: false, interval: trendsData.buckets.length > 8 ? Math.ceil(trendsData.buckets.length / 8) - 1 : 0 }),
              /* @__PURE__ */ jsx(YAxis, { hide: true }),
              /* @__PURE__ */ jsx(Tooltip, { formatter: (v) => fmt(v), contentStyle: { fontSize: 12, border: `1px solid ${LINE}`, borderRadius: 6, background: SURFACE, color: TEXT }, labelStyle: { color: TEXT }, itemStyle: { color: TEXT } }),
              /* @__PURE__ */ jsx(Bar, { dataKey: "total", radius: [4, 4, 0, 0], fill: DEBIT })
            ] }) }) }),
            /* @__PURE__ */ jsxs("div", { style: { fontSize: 11, color: MUTED, marginTop: 8, marginBottom: 12 }, children: [
              "Bucketed by ",
              trendsData.byWeek ? "week" : "month",
              " \xB7 bills and expenses only, transfers and income excluded, canceled entries excluded."
            ] }),
            /* @__PURE__ */ jsx(SectionLabel, { icon: /* @__PURE__ */ jsx(TrendingUp, { size: 13 }), text: `Change per ${trendsData.byWeek ? "week" : "month"}` }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }, children: [...trendsData.buckets].reverse().map((b) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 6, padding: "0.5rem 0.7rem" }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: 13, color: TEXT, fontWeight: 600 }, children: b.label }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontFamily: "ui-monospace, monospace", fontSize: 13, fontWeight: 600, color: DEBIT }, children: fmt(b.total) }),
                /* @__PURE__ */ jsx(ChangeBadge, { value: b.change, favorableWhenPositive: false })
              ] })
            ] }, b.start)) })
          ] })
        ] }),
        view === "quarterly" && /* @__PURE__ */ jsxs(Fragment, { children: [
          projection && /* @__PURE__ */ jsxs("div", { style: { marginBottom: 22 }, children: [
            /* @__PURE__ */ jsx(SectionLabel, { icon: /* @__PURE__ */ jsx(TrendingUp, { size: 13 }), text: "Next quarter outlook" }),
            /* @__PURE__ */ jsxs("div", { style: { background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.85rem 0.9rem", marginTop: 8 }, children: [
              /* @__PURE__ */ jsxs("div", { style: { fontSize: 12.5, color: MUTED, marginBottom: 10 }, children: [
                quarterLabel(projection.curKey),
                " \u2192 ",
                quarterLabel(projection.nextKey)
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontSize: 12.5, color: MUTED }, children: "Projected income" }),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                  /* @__PURE__ */ jsx("span", { style: { fontFamily: "ui-monospace, monospace", fontSize: 13.5, fontWeight: 600, color: CREDIT }, children: fmt(projection.next.income) }),
                  /* @__PURE__ */ jsx(ChangeBadge, { value: projection.incomeVariance, favorableWhenPositive: true })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontSize: 12.5, color: MUTED }, children: "Projected bills + expenses" }),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                  /* @__PURE__ */ jsx("span", { style: { fontFamily: "ui-monospace, monospace", fontSize: 13.5, fontWeight: 600, color: DEBIT }, children: fmt(projection.next.outflow) }),
                  /* @__PURE__ */ jsx(ChangeBadge, { value: projection.outflowVariance, favorableWhenPositive: false })
                ] })
              ] }),
              (projection.increases.length > 0 || projection.decreases.length > 0) && /* @__PURE__ */ jsxs("div", { style: { paddingTop: 10, borderTop: `1px dashed ${LINE}` }, children: [
                /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: MUTED, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }, children: "Suggested changes" }),
                projection.increases.map((d) => /* @__PURE__ */ jsxs("div", { style: { marginBottom: 6 }, children: [
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 12.5 }, children: [
                    /* @__PURE__ */ jsxs("span", { style: { color: TEXT }, children: [
                      "Review ",
                      d.name,
                      " \u2014 up ",
                      fmt(d.diff)
                    ] }),
                    /* @__PURE__ */ jsxs("span", { style: { color: DEBIT, fontFamily: "ui-monospace, monospace" }, children: [
                      fmt(d.cur),
                      " \u2192 ",
                      fmt(d.next)
                    ] })
                  ] }),
                  d.debt && d.debt.apr > 0 && /* @__PURE__ */ jsxs("div", { style: { fontSize: 11, color: GOLD, marginTop: 2 }, children: [
                    d.debt.apr,
                    "% APR on ",
                    fmt(d.debt.balance),
                    " balance"
                  ] })
                ] }, d.name)),
                projection.decreases.map((d) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }, children: [
                  /* @__PURE__ */ jsxs("span", { style: { color: MUTED }, children: [
                    d.name,
                    " drops ",
                    fmt(Math.abs(d.diff))
                  ] }),
                  /* @__PURE__ */ jsxs("span", { style: { color: CREDIT, fontFamily: "ui-monospace, monospace" }, children: [
                    fmt(d.cur),
                    " \u2192 ",
                    fmt(d.next)
                  ] })
                ] }, d.name)),
                projection.increases.some((d) => d.debt && d.debt.apr > 0) && /* @__PURE__ */ jsx("div", { style: { fontSize: 11.5, color: MUTED, marginTop: 4 }, children: "Tip: check the Debts tab \u2014 extra payments toward whichever balance carries the highest APR save the most interest over time." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(SectionLabel, { icon: /* @__PURE__ */ jsx(Receipt, { size: 13 }), text: "Quarterly statement" }),
          quarterlyData.length === 0 ? /* @__PURE__ */ jsx(EmptyNote, { children: "Log some income, bills, or expenses to see quarter-by-quarter totals here." }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }, children: [...quarterlyData].reverse().slice(0, 6).map((q) => /* @__PURE__ */ jsxs("div", { style: { background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.85rem 0.9rem" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 8 }, children: quarterLabel(q.key) }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: 12.5, color: MUTED }, children: "Income" }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontFamily: "ui-monospace, monospace", fontSize: 13.5, fontWeight: 600, color: CREDIT }, children: fmt(q.income) }),
                /* @__PURE__ */ jsx(ChangeBadge, { value: q.incomeChange, favorableWhenPositive: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: 12.5, color: MUTED }, children: "Bills + expenses" }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontFamily: "ui-monospace, monospace", fontSize: 13.5, fontWeight: 600, color: DEBIT }, children: fmt(q.outflow) }),
                /* @__PURE__ */ jsx(ChangeBadge, { value: q.outflowChange, favorableWhenPositive: false })
              ] })
            ] }),
            q.transfers > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: 12.5, color: MUTED }, children: "Internal transfers" }),
              /* @__PURE__ */ jsx("span", { style: { fontFamily: "ui-monospace, monospace", fontSize: 13.5, fontWeight: 600, color: TRANSFER }, children: fmt(q.transfers) })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: `1px dashed ${LINE}` }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: 12.5, color: MUTED, fontWeight: 600 }, children: "Net" }),
              /* @__PURE__ */ jsx("span", { style: { fontFamily: "ui-monospace, monospace", fontSize: 14, fontWeight: 700, color: q.net >= 0 ? CREDIT : DEBIT }, children: fmt(q.net) })
            ] })
          ] }, q.key)) })
        ] }),
        view === "backup" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(SectionLabel, { icon: /* @__PURE__ */ jsx(Archive, { size: 13 }), text: "Backup & restore" }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: 12.5, color: MUTED, marginTop: 8, marginBottom: 16 }, children: "Your data lives only on this device. Export a backup file every so often so you have something to restore from if you ever clear your browser data or switch devices." }),
          /* @__PURE__ */ jsxs("div", { style: { background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.9rem" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 13.5, fontWeight: 700, color: TEXT, marginBottom: 4 }, children: "Export backup" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: MUTED, marginBottom: 12 }, children: "Downloads a .json file with every account, transaction, recurring template, and debt." }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: exportBackup,
                style: { display: "flex", alignItems: "center", gap: 6, background: ACCENT, border: "none", borderRadius: 8, padding: "0.6rem 0.9rem", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer" },
                children: [
                  /* @__PURE__ */ jsx(Archive, { size: 14 }),
                  "Download backup"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.9rem", marginTop: 12 }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 13.5, fontWeight: 700, color: TEXT, marginBottom: 4 }, children: "Restore from backup" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: MUTED, marginBottom: 12 }, children: "Replaces everything currently in the app with what's in the backup file. This can't be undone with the usual undo button, so make sure it's the file you want." }),
            /* @__PURE__ */ jsxs(
              "label",
              {
                style: {
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "none",
                  border: `1px solid ${LINE}`,
                  borderRadius: 8,
                  padding: "0.6rem 0.9rem",
                  color: TEXT,
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: "pointer"
                },
                children: [
                  /* @__PURE__ */ jsx(ArrowLeft, { size: 14, style: { transform: "rotate(-90deg)" } }),
                  "Choose backup file\u2026",
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "file",
                      accept: "application/json,.json",
                      style: { display: "none" },
                      onChange: (e) => {
                        const file = e.target.files && e.target.files[0];
                        if (file) importBackup(file);
                        e.target.value = "";
                      }
                    }
                  )
                ]
              }
            ),
            backupImportError && /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: DEBIT, marginTop: 10 }, children: backupImportError })
          ] })
        ] }),
        (view === "config-expenses" || view === "config-income") && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx(SectionLabel, { icon: /* @__PURE__ */ jsx(Repeat, { size: 13 }), text: view === "config-income" ? "Recurring income" : "Recurring expenses" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 6 }, children: [
              (view === "config-expenses" || view === "config-income") && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setSyncScope(view === "config-income" ? "income" : "expense");
                    setShowSyncConfirm(true);
                  },
                  style: { fontSize: 11.5, fontWeight: 600, color: GOLD, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.3rem 0.65rem", cursor: "pointer" },
                  children: "Sync"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => openAddRecurring(view === "config-income" ? "income" : "bill"),
                  style: { fontSize: 11.5, fontWeight: 600, color: TRANSFER, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.3rem 0.65rem", cursor: "pointer" },
                  children: "+ Add"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: MUTED, marginTop: 8, marginBottom: 12 }, children: view === "config-income" ? "Every recurring paycheck or deposit, with its frequency, day, and the account it lands in." : "Every recurring bill or expense, with its frequency, day, amount, and the account it's paid from." }),
          (() => {
            const filtered = recurring.filter((r) => view === "config-income" ? r.type === "income" : r.type !== "income");
            return filtered.length === 0 ? /* @__PURE__ */ jsx(EmptyNote, { children: view === "config-income" ? 'No recurring income set up yet. Tap "+ Add" to load one.' : `No recurring expenses set up yet. Tap "+ Add" to load one \u2014 frequency, day, amount, and which account it's paid from.` }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [...filtered].sort((a, b) => (a.frequency === "weekly" ? a.weekday : a.day) - (b.frequency === "weekly" ? b.weekday : b.day)).map((r) => /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setEditRecurring(r),
                style: { display: "flex", alignItems: "center", gap: 12, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.7rem 0.85rem", cursor: "pointer", textAlign: "left" },
                children: [
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      style: {
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        background: SURFACE_2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      },
                      children: [
                        /* @__PURE__ */ jsx("div", { style: { fontSize: r.frequency === "weekly" ? 10.5 : 13, fontWeight: 700, color: TEXT, lineHeight: 1.1 }, children: r.frequency === "weekly" ? WEEKDAY_NAMES[r.weekday].slice(0, 3) : r.day }),
                        /* @__PURE__ */ jsx("div", { style: { fontSize: 8, color: MUTED, textTransform: "uppercase" }, children: r.frequency === "weekly" ? "wkly" : "day" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                    /* @__PURE__ */ jsx("div", { style: { fontSize: 14, fontWeight: 600, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: r.name }),
                    /* @__PURE__ */ jsxs("div", { style: { fontSize: 11.5, color: MUTED }, children: [
                      FREQUENCIES[r.frequency || "monthly"].label,
                      " \xB7 ",
                      TYPES[r.type].label,
                      " \xB7 ",
                      accountName(r.accountId)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { fontFamily: "ui-monospace, monospace", fontSize: 14, fontWeight: 700, color: TYPES[r.type].color }, children: [
                    TYPES[r.type].sign > 0 ? "+" : "-",
                    fmt(r.amount)
                  ] })
                ]
              },
              r.id
            )) });
          })()
        ] }),
        view === "config-accounts" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx(SectionLabel, { icon: /* @__PURE__ */ jsx(Wallet, { size: 13 }), text: "Accounts" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: addAccount,
                style: { fontSize: 11.5, fontWeight: 600, color: TRANSFER, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.3rem 0.65rem", cursor: "pointer" },
                children: "+ Add"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: MUTED, marginTop: 8, marginBottom: 12 }, children: "Every account you track, its starting balance, and its current balance." }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: accounts.map((a) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setEditAccount(a),
              style: { display: "flex", alignItems: "center", gap: 12, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.7rem 0.85rem", cursor: "pointer", textAlign: "left" },
              children: [
                /* @__PURE__ */ jsx("div", { style: { width: 10, height: 10, borderRadius: "50%", background: accountColorFor(a.id, accounts), flexShrink: 0 } }),
                /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                  /* @__PURE__ */ jsx("div", { style: { fontSize: 14, fontWeight: 600, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: a.name }),
                  /* @__PURE__ */ jsxs("div", { style: { fontSize: 11.5, color: MUTED }, children: [
                    "Starting balance ",
                    fmt(a.opening)
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { style: { fontFamily: "ui-monospace, monospace", fontSize: 14, fontWeight: 700, color: (accountBalances[a.id] || 0) >= 0 ? CREDIT : DEBIT }, children: fmt(accountBalances[a.id] || 0) }),
                /* @__PURE__ */ jsx(Pencil, { size: 13, color: MUTED })
              ]
            },
            a.id
          )) })
        ] }),
        view === "debts" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx(SectionLabel, { icon: /* @__PURE__ */ jsx(TrendingUp, { size: 13 }), text: "Loans & credit accounts" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: addDebt,
                style: { fontSize: 11.5, fontWeight: 600, color: TRANSFER, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.3rem 0.65rem", cursor: "pointer" },
                children: "+ Add account"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, marginTop: 10, marginBottom: 14 }, children: [
            /* @__PURE__ */ jsxs("div", { style: { flex: 1, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.6rem 0.7rem" }, children: [
              /* @__PURE__ */ jsx("div", { style: { fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Total balance" }),
              /* @__PURE__ */ jsx("div", { style: { fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 700, color: DEBIT, marginTop: 2 }, children: fmt(debtSummary.totalBalance) })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { flex: 1, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.6rem 0.7rem" }, children: [
              /* @__PURE__ */ jsx("div", { style: { fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Avg APR" }),
              /* @__PURE__ */ jsxs("div", { style: { fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 700, color: GOLD, marginTop: 2 }, children: [
                debtSummary.weightedApr.toFixed(1),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { flex: 1, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.6rem 0.7rem" }, children: [
              /* @__PURE__ */ jsx("div", { style: { fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }, children: "Est. interest/mo" }),
              /* @__PURE__ */ jsx("div", { style: { fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 700, color: DEBIT, marginTop: 2 }, children: fmt(debtSummary.monthlyInterest) })
            ] })
          ] }),
          sortedDebts.length === 0 ? /* @__PURE__ */ jsx(EmptyNote, { children: "No loan or credit accounts yet. Add one with its current balance and interest rate to sharpen the quarterly suggestions." }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: sortedDebts.map((d, i) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setEditDebt(d),
              style: { display: "flex", justifyContent: "space-between", alignItems: "center", background: SURFACE, border: `1px solid ${LINE}`, borderLeft: `3px solid ${i === 0 && d.apr > 0 ? GOLD : LINE}`, borderRadius: 6, padding: "0.6rem 0.75rem", textAlign: "left", cursor: "pointer" },
              children: [
                /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                  /* @__PURE__ */ jsx("div", { style: { fontSize: 14, fontWeight: 600, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: d.name }),
                  /* @__PURE__ */ jsxs("div", { style: { fontSize: 12, color: MUTED }, children: [
                    d.apr,
                    "% APR",
                    i === 0 && d.apr > 0 ? " \xB7 highest priority" : ""
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { style: { textAlign: "right" }, children: [
                  /* @__PURE__ */ jsx("div", { style: { fontFamily: "ui-monospace, monospace", fontSize: 14, fontWeight: 700, color: DEBIT }, children: fmt(d.balance) }),
                  /* @__PURE__ */ jsxs("div", { style: { fontSize: 11, color: MUTED }, children: [
                    "~",
                    fmt(d.balance * (d.apr / 100) / 12),
                    "/mo interest"
                  ] })
                ] })
              ]
            },
            d.id
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            position: "fixed",
            bottom: 0,
            left: 10,
            right: 10,
            maxWidth: 400,
            margin: "0 auto",
            background: BG,
            borderTop: `1px solid ${LINE}`,
            padding: "0.75rem 0.75rem calc(0.75rem + env(safe-area-inset-bottom, 0px))",
            zIndex: 45
          },
          children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
            Object.entries(TYPES).map(([key, meta]) => /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => openAdd(key),
                style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.65rem 0", fontSize: 13, fontWeight: 600, color: TEXT, cursor: "pointer" },
                children: [
                  /* @__PURE__ */ jsx(Plus, { size: 14, color: meta.color }),
                  meta.label
                ]
              },
              key
            )),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => openAdd("transfer"),
                style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.65rem 0", fontSize: 13, fontWeight: 600, color: TEXT, cursor: "pointer" },
                children: [
                  /* @__PURE__ */ jsx(Plus, { size: 14, color: TRANSFER }),
                  "Transfer"
                ]
              }
            )
          ] })
        }
      ),
      showAdd && /* @__PURE__ */ jsx("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 }, onClick: () => setShowAdd(false), children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), style: { background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box", maxHeight: "85vh", overflowY: "auto" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }, children: [
          /* @__PURE__ */ jsxs("div", { style: { fontSize: 16, fontWeight: 700, color: TEXT }, children: [
            "Add ",
            form.type === "transfer" ? "transfer" : TYPES[form.type].label.toLowerCase()
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setShowAdd(false), style: { background: "none", border: "none", cursor: "pointer", color: MUTED }, children: /* @__PURE__ */ jsx(X, { size: 20 }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, marginBottom: 14 }, children: [
          Object.entries(TYPES).map(([key, meta]) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setForm((f) => ({ ...f, type: key })),
              style: { flex: 1, padding: "0.4rem 0", borderRadius: 6, border: `1px solid ${form.type === key ? meta.color : LINE}`, background: form.type === key ? meta.color : SURFACE_2, color: form.type === key ? "#0B120E" : TEXT, fontSize: 12.5, fontWeight: 600, cursor: "pointer" },
              children: meta.label
            },
            key
          )),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setForm((f) => ({ ...f, type: "transfer" })),
              style: { flex: 1, padding: "0.4rem 0", borderRadius: 6, border: `1px solid ${form.type === "transfer" ? TRANSFER : LINE}`, background: form.type === "transfer" ? TRANSFER : SURFACE_2, color: form.type === "transfer" ? "#0B120E" : TEXT, fontSize: 12.5, fontWeight: 600, cursor: "pointer" },
              children: "Transfer"
            }
          )
        ] }),
        suggestions.length > 0 && form.type !== "transfer" && /* @__PURE__ */ jsxs("div", { style: { marginBottom: 12 }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: MUTED, marginBottom: 6 }, children: "Quick fill" }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: suggestions.map((s) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => applySuggestion(s),
              style: { fontSize: 12.5, padding: "0.35rem 0.6rem", borderRadius: 999, border: `1px solid ${LINE}`, background: SURFACE_2, color: TEXT, cursor: "pointer" },
              children: [
                s.name,
                " \xB7 ",
                fmt(s.amount)
              ]
            },
            s.name
          )) })
        ] }),
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Name" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: form.name,
            onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
            placeholder: form.type === "income" ? "Paycheck" : form.type === "bill" ? "Rent" : form.type === "transfer" ? "Savings top-up" : "Groceries",
            style: inputStyle
          }
        ),
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Amount" }),
        /* @__PURE__ */ jsx("input", { value: form.amount, onChange: (e) => setForm((f) => ({ ...f, amount: e.target.value.replace(/[^0-9]/g, "") })), placeholder: "0", inputMode: "numeric", style: inputStyle }),
        form.type === "transfer" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("label", { style: labelStyle, children: "From" }),
          /* @__PURE__ */ jsx("select", { value: form.fromAccountId, onChange: (e) => setForm((f) => ({ ...f, fromAccountId: e.target.value })), style: inputStyle, children: accounts.map((a) => /* @__PURE__ */ jsx("option", { value: a.id, children: a.name }, a.id)) }),
          /* @__PURE__ */ jsx("label", { style: labelStyle, children: "To" }),
          /* @__PURE__ */ jsx("select", { value: form.toAccountId, onChange: (e) => setForm((f) => ({ ...f, toAccountId: e.target.value })), style: inputStyle, children: accounts.map((a) => /* @__PURE__ */ jsx("option", { value: a.id, children: a.name }, a.id)) })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Account" }),
          /* @__PURE__ */ jsx("select", { value: form.accountId, onChange: (e) => setForm((f) => ({ ...f, accountId: e.target.value })), style: inputStyle, children: accounts.map((a) => /* @__PURE__ */ jsx("option", { value: a.id, children: a.name }, a.id)) })
        ] }),
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Date" }),
        /* @__PURE__ */ jsx("input", { type: "date", value: form.date, onChange: (e) => setForm((f) => ({ ...f, date: e.target.value })), style: dateInputStyle }),
        form.type !== "transfer" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 10 }, children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", id: "recurring", checked: form.recurring, onChange: (e) => setForm((f) => ({ ...f, recurring: e.target.checked })) }),
            /* @__PURE__ */ jsx("label", { htmlFor: "recurring", style: { fontSize: 13, color: TEXT }, children: "Repeats" })
          ] }),
          form.recurring && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 6, marginTop: 8 }, children: Object.entries(FREQUENCIES).map(([key, f]) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setForm((prev) => ({ ...prev, frequency: key })),
                style: { flex: 1, padding: "0.35rem 0", borderRadius: 999, border: `1px solid ${form.frequency === key ? GOLD : LINE}`, background: form.frequency === key ? GOLD : SURFACE_2, color: form.frequency === key ? "#0B120E" : TEXT, fontSize: 12, fontWeight: 600, cursor: "pointer" },
                children: f.label
              },
              key
            )) }),
            /* @__PURE__ */ jsx("div", { style: { marginTop: 8 }, children: form.frequency === "weekly" ? /* @__PURE__ */ jsx("select", { value: form.weekday, onChange: (e) => setForm((f) => ({ ...f, weekday: e.target.value })), style: inputStyle, children: WEEKDAY_NAMES.map((name, i) => /* @__PURE__ */ jsx("option", { value: i, children: name }, i)) }) : /* @__PURE__ */ jsx("input", { type: "number", min: "1", max: "31", value: form.day, onChange: (e) => setForm((f) => ({ ...f, day: e.target.value })), style: inputStyle, "aria-label": "Day of month due" }) }),
            /* @__PURE__ */ jsxs("div", { style: { fontSize: 12, color: MUTED, marginTop: 6 }, children: [
              "This creates a ",
              form.frequency,
              " recurring ",
              form.type,
              " you can log with one tap from the Overview tab."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: submit,
            disabled: !form.name.trim() || !parseFloat(form.amount),
            style: { width: "100%", marginTop: 18, padding: "0.75rem", borderRadius: 8, border: "none", background: form.name.trim() && parseFloat(form.amount) ? ACCENT : DISABLED, color: form.name.trim() && parseFloat(form.amount) ? "#fff" : DISABLED_TEXT, fontSize: 14, fontWeight: 700, cursor: form.name.trim() && parseFloat(form.amount) ? "pointer" : "not-allowed" },
            children: "Save entry"
          }
        )
      ] }) }),
      editAccount && /* @__PURE__ */ jsx(AccountEditModal, { account: editAccount, onClose: () => setEditAccount(null), onSave: saveAccountEdit, onDelete: deleteAccount, canDelete: accounts.length > 1 }),
      editRecurring && /* @__PURE__ */ jsx(RecurringEditModal, { item: editRecurring, accounts, onClose: () => setEditRecurring(null), onSave: saveRecurringEdit, onDelete: deleteRecurring }),
      showAddRecurring && /* @__PURE__ */ jsx("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }, onClick: () => setShowAddRecurring(false), children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), style: { background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box", maxHeight: "85vh", overflowY: "auto" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 16, fontWeight: 700, color: TEXT }, children: "Add recurring expense" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setShowAddRecurring(false), style: { background: "none", border: "none", cursor: "pointer", color: MUTED }, children: /* @__PURE__ */ jsx(X, { size: 20 }) })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 8, marginBottom: 14 }, children: Object.entries(TYPES).map(([key, meta]) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setRecurringForm((f) => ({ ...f, type: key })),
            style: { flex: 1, padding: "0.4rem 0", borderRadius: 6, border: `1px solid ${recurringForm.type === key ? meta.color : LINE}`, background: recurringForm.type === key ? meta.color : SURFACE_2, color: recurringForm.type === key ? "#0B120E" : TEXT, fontSize: 12.5, fontWeight: 600, cursor: "pointer" },
            children: meta.label
          },
          key
        )) }),
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Name" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: recurringForm.name,
            onChange: (e) => setRecurringForm((f) => ({ ...f, name: e.target.value })),
            placeholder: recurringForm.type === "income" ? "Paycheck" : recurringForm.type === "bill" ? "Rent" : "Subscription",
            style: inputStyle
          }
        ),
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Amount" }),
        /* @__PURE__ */ jsx("input", { value: recurringForm.amount, onChange: (e) => setRecurringForm((f) => ({ ...f, amount: e.target.value.replace(/[^0-9]/g, "") })), placeholder: "0", inputMode: "numeric", style: inputStyle }),
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Account paid from" }),
        /* @__PURE__ */ jsx("select", { value: recurringForm.accountId, onChange: (e) => setRecurringForm((f) => ({ ...f, accountId: e.target.value })), style: inputStyle, children: accounts.map((a) => /* @__PURE__ */ jsx("option", { value: a.id, children: a.name }, a.id)) }),
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Frequency" }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 6 }, children: Object.entries(FREQUENCIES).map(([key, f]) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setRecurringForm((prev) => ({ ...prev, frequency: key })),
            style: { flex: 1, padding: "0.4rem 0", borderRadius: 999, border: `1px solid ${recurringForm.frequency === key ? GOLD : LINE}`, background: recurringForm.frequency === key ? GOLD : SURFACE_2, color: recurringForm.frequency === key ? "#0B120E" : TEXT, fontSize: 12.5, fontWeight: 600, cursor: "pointer" },
            children: f.label
          },
          key
        )) }),
        recurringForm.frequency === "weekly" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Day of week" }),
          /* @__PURE__ */ jsx("select", { value: recurringForm.weekday, onChange: (e) => setRecurringForm((f) => ({ ...f, weekday: e.target.value })), style: inputStyle, children: WEEKDAY_NAMES.map((name, i) => /* @__PURE__ */ jsx("option", { value: i, children: name }, i)) })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Day of month" }),
          /* @__PURE__ */ jsx("input", { type: "number", min: "1", max: "31", value: recurringForm.day, onChange: (e) => setRecurringForm((f) => ({ ...f, day: e.target.value })), style: inputStyle })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: submitNewRecurring,
            disabled: !recurringForm.name.trim() || !parseInt(recurringForm.amount, 10),
            style: {
              width: "100%",
              marginTop: 18,
              padding: "0.75rem",
              borderRadius: 8,
              border: "none",
              background: recurringForm.name.trim() && parseInt(recurringForm.amount, 10) ? ACCENT : DISABLED,
              color: recurringForm.name.trim() && parseInt(recurringForm.amount, 10) ? "#fff" : DISABLED_TEXT,
              fontSize: 14,
              fontWeight: 700,
              cursor: recurringForm.name.trim() && parseInt(recurringForm.amount, 10) ? "pointer" : "not-allowed"
            },
            children: "Save recurring expense"
          }
        )
      ] }) }),
      editDebt && /* @__PURE__ */ jsx(DebtEditModal, { debt: editDebt, onClose: () => setEditDebt(null), onSave: saveDebtEdit, onDelete: deleteDebt }),
      showSyncConfirm && /* @__PURE__ */ jsx("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }, onClick: () => setShowSyncConfirm(false), children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), style: { background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 4 }, children: [
          "Sync ",
          syncScope === "income" ? "income" : "expenses",
          "?"
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { fontSize: 12.5, color: MUTED, marginBottom: 14 }, children: [
          "This clears every not-yet-happened entry generated from your recurring ",
          syncScope === "income" ? "income" : "bills and expenses",
          ", then regenerates them through the end of the year using each item's current amount, account, and frequency. ",
          syncScope === "income" ? "Recurring bills and expenses are" : "Recurring income is",
          " left untouched, along with past entries and anything not tied to a recurring template."
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { background: SURFACE_2, borderRadius: 8, padding: "0.75rem 0.85rem", marginBottom: 18 }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: MUTED }, children: "Entries removed" }),
            /* @__PURE__ */ jsx("span", { style: { color: DEBIT, fontWeight: 600, fontFamily: "ui-monospace, monospace" }, children: syncExpensesPreview.removed })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13 }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: MUTED }, children: "Entries regenerated" }),
            /* @__PURE__ */ jsx("span", { style: { color: CREDIT, fontWeight: 600, fontFamily: "ui-monospace, monospace" }, children: syncExpensesPreview.added })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowSyncConfirm(false),
              style: { flex: 1, padding: "0.75rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 14, fontWeight: 700, cursor: "pointer" },
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx("button", { onClick: syncExpenses, style: { flex: 1, padding: "0.75rem", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }, children: "Sync" })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 11.5, color: MUTED, marginTop: 10 }, children: "Undo is available on the Ledger tab if this doesn't look right." })
      ] }) }),
      pendingGroup && /* @__PURE__ */ jsx(PendingDebitsModal, { group: pendingGroup, accountName, accounts, onClose: () => setPendingGroup(null), onApply: applyEditAll, onApplySingle: applyEditSingle, onDelete: deleteFromSeries }),
      showCleanupConfirm && /* @__PURE__ */ jsx("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 65 }, onClick: () => setShowCleanupConfirm(false), children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), style: { background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 4 }, children: [
          "Remove transactions before ",
          cleanupCutoff,
          "?"
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { fontSize: 12.5, color: MUTED, marginBottom: 16 }, children: [
          "This permanently deletes ",
          cleanupCount,
          " transaction",
          cleanupCount === 1 ? "" : "s",
          " dated before July 1, across every account. Entries on or after that date are untouched."
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowCleanupConfirm(false),
              style: { flex: 1, padding: "0.75rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 14, fontWeight: 700, cursor: "pointer" },
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx("button", { onClick: removeBeforeCutoff, style: { flex: 1, padding: "0.75rem", borderRadius: 8, border: "none", background: DEBIT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }, children: "Remove" })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 11.5, color: MUTED, marginTop: 10 }, children: "Undo is available on the Ledger tab if this doesn't look right." })
      ] }) }),
      showDedupeConfirm && /* @__PURE__ */ jsx("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 65 }, onClick: () => setShowDedupeConfirm(false), children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), style: { background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 4 }, children: "Remove duplicate transfers?" }),
        /* @__PURE__ */ jsxs("div", { style: { fontSize: 12.5, color: MUTED, marginBottom: 14 }, children: [
          "Some transfers were recorded twice under different names during import \u2014 same date, same amount, same direction, just labeled differently. This keeps one copy of each and removes ",
          duplicateTransfersPreview.removed,
          " duplicate",
          duplicateTransfersPreview.removed === 1 ? "" : "s",
          ". Income, bills, and expenses are untouched."
        ] }),
        duplicateTransfersPreview.examples.length > 0 && /* @__PURE__ */ jsxs("div", { style: { background: SURFACE_2, borderRadius: 8, padding: "0.65rem 0.75rem", marginBottom: 16 }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }, children: "Examples of what will go" }),
          duplicateTransfersPreview.examples.map((t) => /* @__PURE__ */ jsxs("div", { style: { fontSize: 12.5, color: TEXT, marginBottom: 3 }, children: [
            fmtDate(t.date),
            " \xB7 ",
            t.name,
            " \xB7 ",
            fmt(t.amount)
          ] }, t.id))
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowDedupeConfirm(false),
              style: { flex: 1, padding: "0.75rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 14, fontWeight: 700, cursor: "pointer" },
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx("button", { onClick: removeDuplicateTransfers, style: { flex: 1, padding: "0.75rem", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }, children: "Remove duplicates" })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 11.5, color: MUTED, marginTop: 10 }, children: "Undo is available on the Ledger tab if this doesn't look right." })
      ] }) }),
      pendingImport && /* @__PURE__ */ jsx("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 65 }, onClick: () => setPendingImport(null), children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), style: { background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 4 }, children: "Restore this backup?" }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 12.5, color: MUTED, marginBottom: 14 }, children: "This replaces everything currently in the app \u2014 every account, transaction, recurring template, and debt \u2014 with what's in this file. Anything you've entered since this backup was made will be lost." }),
        /* @__PURE__ */ jsxs("div", { style: { background: SURFACE_2, borderRadius: 8, padding: "0.65rem 0.75rem", marginBottom: 18 }, children: [
          /* @__PURE__ */ jsxs("div", { style: { fontSize: 12.5, color: TEXT, marginBottom: 3 }, children: [
            pendingImport.transactions ? pendingImport.transactions.length : 0,
            " transactions"
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { fontSize: 12.5, color: TEXT, marginBottom: 3 }, children: [
            pendingImport.accounts ? pendingImport.accounts.length : 0,
            " accounts"
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { fontSize: 12.5, color: TEXT, marginBottom: 3 }, children: [
            pendingImport.recurring ? pendingImport.recurring.length : 0,
            " recurring templates"
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { fontSize: 12.5, color: TEXT }, children: [
            pendingImport.debts ? pendingImport.debts.length : 0,
            " debts"
          ] }),
          pendingImport.exportedAt && /* @__PURE__ */ jsxs("div", { style: { fontSize: 11, color: MUTED, marginTop: 8, paddingTop: 8, borderTop: `1px dashed ${LINE}` }, children: [
            "Backed up ",
            new Date(pendingImport.exportedAt).toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setPendingImport(null),
              style: { flex: 1, padding: "0.75rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 14, fontWeight: 700, cursor: "pointer" },
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx("button", { onClick: confirmImportBackup, style: { flex: 1, padding: "0.75rem", borderRadius: 8, border: "none", background: DEBIT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }, children: "Restore" })
        ] })
      ] }) }),
      showRedundantConfirm && /* @__PURE__ */ jsx("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 65 }, onClick: () => setShowRedundantConfirm(false), children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), style: { background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 4 }, children: "Remove redundant $450 transfers?" }),
        /* @__PURE__ */ jsxs("div", { style: { fontSize: 12.5, color: MUTED, marginBottom: 14 }, children: [
          "On paydays where TD income was split into $1,050 (TD) + $450 (PFFCU-X direct), the old $450 TD\u2192PFFCU-X transfer from before the split is now double-counting the same money. This removes ",
          redundantSplitTransfersPreview.removed,
          " of those transfers, on days that already have a matching $1,050 TD income entry. Everything else is untouched."
        ] }),
        redundantSplitTransfersPreview.examples.length > 0 && /* @__PURE__ */ jsxs("div", { style: { background: SURFACE_2, borderRadius: 8, padding: "0.65rem 0.75rem", marginBottom: 16 }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }, children: "Examples of what will go" }),
          redundantSplitTransfersPreview.examples.map((t) => /* @__PURE__ */ jsxs("div", { style: { fontSize: 12.5, color: TEXT, marginBottom: 3 }, children: [
            fmtDate(t.date),
            " \xB7 ",
            t.name,
            " \xB7 ",
            fmt(t.amount)
          ] }, t.id))
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowRedundantConfirm(false),
              style: { flex: 1, padding: "0.75rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 14, fontWeight: 700, cursor: "pointer" },
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx("button", { onClick: removeRedundantSplitTransfers, style: { flex: 1, padding: "0.75rem", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }, children: "Remove transfers" })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 11.5, color: MUTED, marginTop: 10 }, children: "Undo is available on the Ledger tab if this doesn't look right." })
      ] }) }),
      menuOpen && /* @__PURE__ */ jsx("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 80, display: "flex" }, onClick: () => setMenuOpen(false), children: /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: { width: "78%", maxWidth: 300, height: "100%", background: HEADER, padding: "1.5rem 1rem", boxSizing: "border-box", overflowY: "auto" },
          children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }, children: [
              /* @__PURE__ */ jsx("div", { style: { fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, fontWeight: 700 }, children: "Menu" }),
              /* @__PURE__ */ jsx("button", { onClick: () => setMenuOpen(false), style: { background: "none", border: "none", color: HEADER_TEXT, cursor: "pointer" }, children: /* @__PURE__ */ jsx(X, { size: 18 }) })
            ] }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 2, marginBottom: 22 }, children: [
              { key: "overview", label: "Overview" },
              { key: "ledger", label: "Ledger" },
              { key: "quarterly", label: "Quarterly Statements" },
              { key: "trends", label: "Expenses Over Time" },
              { key: "debts", label: "Debts" }
            ].map(({ key: v, label }) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setView(v);
                  setMenuOpen(false);
                },
                style: {
                  textAlign: "left",
                  background: view === v ? SURFACE_2 : "none",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.6rem 0.7rem",
                  color: view === v ? TEXT : HEADER_TEXT,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer"
                },
                children: label
              },
              v
            )) }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: MUTED, fontWeight: 700, padding: "0 0.7rem", marginBottom: 6 }, children: "Configuration" }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 2 }, children: [
              { key: "config-expenses", label: "Expenses", icon: /* @__PURE__ */ jsx(Repeat, { size: 14 }) },
              { key: "config-income", label: "Income", icon: /* @__PURE__ */ jsx(TrendingUp, { size: 14 }) },
              { key: "config-accounts", label: "Accounts", icon: /* @__PURE__ */ jsx(Wallet, { size: 14 }) },
              { key: "backup", label: "Backup & Restore", icon: /* @__PURE__ */ jsx(Archive, { size: 14 }) }
            ].map((item) => /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  setView(item.key);
                  setMenuOpen(false);
                },
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  textAlign: "left",
                  background: view === item.key ? SURFACE_2 : "none",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.6rem 0.7rem",
                  color: view === item.key ? TEXT : HEADER_TEXT,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer"
                },
                children: [
                  item.icon,
                  item.label
                ]
              },
              item.key
            )) })
          ]
        }
      ) })
    ] }),
    scrollThumb.visible && /* @__PURE__ */ jsx(
      "div",
      {
        style: { position: "fixed", top: 0, right: "max(1px, calc((100vw - 420px) / 2 + 1px))", bottom: 0, width: 8, zIndex: 90, pointerEvents: "none" },
        children: /* @__PURE__ */ jsx(
          "div",
          {
            onTouchStart: (e) => {
              e.stopPropagation();
              startThumbDrag(e.touches[0].clientY);
            },
            onTouchMove: (e) => {
              e.stopPropagation();
              onThumbDragMove(e.touches[0].clientY);
            },
            onTouchEnd: endThumbDrag,
            onMouseDown: (e) => {
              e.stopPropagation();
              startThumbDrag(e.clientY);
            },
            onMouseMove: (e) => scrollDragRef.current.dragging && onThumbDragMove(e.clientY),
            onMouseUp: endThumbDrag,
            onMouseLeave: () => scrollDragRef.current.dragging && endThumbDrag(),
            style: {
              position: "absolute",
              top: scrollThumb.top,
              right: 0,
              width: 6,
              height: scrollThumb.height,
              borderRadius: 3,
              background: LINE,
              pointerEvents: "auto",
              cursor: "grab",
              touchAction: "none"
            }
          }
        )
      }
    )
  ] });
}
function AccountEditModal({ account, onClose, onSave, onDelete, canDelete }) {
  const [name, setName] = useState(account.name);
  const [opening, setOpening] = useState(String(account.opening));
  return /* @__PURE__ */ jsx("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }, onClick: onClose, children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), style: { background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 16, fontWeight: 700, color: TEXT }, children: "Edit account" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, style: { background: "none", border: "none", cursor: "pointer", color: MUTED }, children: /* @__PURE__ */ jsx(X, { size: 20 }) })
    ] }),
    /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Account name" }),
    /* @__PURE__ */ jsx("input", { value: name, onChange: (e) => setName(e.target.value), style: inputStyle }),
    /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Starting balance" }),
    /* @__PURE__ */ jsx("input", { value: opening, onChange: (e) => setOpening(e.target.value.replace(/[^0-9]/g, "")), inputMode: "numeric", style: inputStyle }),
    /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: MUTED, marginTop: 6 }, children: "Set this to your bank's current balance when you start tracking. Entries you log after that adjust it up or down." }),
    /* @__PURE__ */ jsx("button", { onClick: () => onSave(account.id, name, opening), style: { width: "100%", marginTop: 18, padding: "0.75rem", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }, children: "Save account" }),
    onDelete && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => canDelete && onDelete(account.id),
          disabled: !canDelete,
          style: { width: "100%", marginTop: 8, padding: "0.65rem", borderRadius: 8, border: `1px solid ${canDelete ? DEBIT : LINE}`, background: "transparent", color: canDelete ? DEBIT : DISABLED_TEXT, fontSize: 13, fontWeight: 700, cursor: canDelete ? "pointer" : "not-allowed" },
          children: "Remove account"
        }
      ),
      !canDelete && /* @__PURE__ */ jsx("div", { style: { fontSize: 11.5, color: MUTED, marginTop: 6 }, children: "You need at least one account \u2014 add another before removing this one." })
    ] })
  ] }) });
}
function RecurringEditModal({ item, accounts, onClose, onSave, onDelete }) {
  const [name, setName] = useState(item.name);
  const [amount, setAmount] = useState(String(item.amount));
  const [accountId, setAccountId] = useState(item.accountId);
  const [frequency, setFrequency] = useState(item.frequency || "monthly");
  const [day, setDay] = useState(String(item.day || (/* @__PURE__ */ new Date()).getDate()));
  const [weekday, setWeekday] = useState(String(item.weekday ?? (/* @__PURE__ */ new Date()).getDay()));
  return /* @__PURE__ */ jsx("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }, onClick: onClose, children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), style: { background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }, children: [
      /* @__PURE__ */ jsxs("div", { style: { fontSize: 16, fontWeight: 700, color: TEXT }, children: [
        "Edit recurring ",
        TYPES[item.type].label.toLowerCase()
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, style: { background: "none", border: "none", cursor: "pointer", color: MUTED }, children: /* @__PURE__ */ jsx(X, { size: 20 }) })
    ] }),
    /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Name" }),
    /* @__PURE__ */ jsx("input", { value: name, onChange: (e) => setName(e.target.value), style: inputStyle }),
    /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Amount" }),
    /* @__PURE__ */ jsx("input", { value: amount, onChange: (e) => setAmount(e.target.value.replace(/[^0-9]/g, "")), inputMode: "numeric", style: inputStyle }),
    /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Account" }),
    /* @__PURE__ */ jsx("select", { value: accountId, onChange: (e) => setAccountId(e.target.value), style: inputStyle, children: accounts.map((a) => /* @__PURE__ */ jsx("option", { value: a.id, children: a.name }, a.id)) }),
    /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Frequency" }),
    /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 6 }, children: Object.entries(FREQUENCIES).map(([key, f]) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setFrequency(key),
        style: { flex: 1, padding: "0.4rem 0", borderRadius: 999, border: `1px solid ${frequency === key ? GOLD : LINE}`, background: frequency === key ? GOLD : SURFACE_2, color: frequency === key ? "#0B120E" : TEXT, fontSize: 12.5, fontWeight: 600, cursor: "pointer" },
        children: f.label
      },
      key
    )) }),
    frequency === "weekly" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Day of week" }),
      /* @__PURE__ */ jsx("select", { value: weekday, onChange: (e) => setWeekday(e.target.value), style: inputStyle, children: WEEKDAY_NAMES.map((name2, i) => /* @__PURE__ */ jsx("option", { value: i, children: name2 }, i)) })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Day of month due" }),
      /* @__PURE__ */ jsx("input", { type: "number", min: "1", max: "31", value: day, onChange: (e) => setDay(e.target.value), style: inputStyle })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => onSave(item.id, name, amount, accountId, day, frequency, weekday),
        style: { width: "100%", marginTop: 18, padding: "0.75rem", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" },
        children: "Save"
      }
    ),
    /* @__PURE__ */ jsx("button", { onClick: () => onDelete(item.id), style: { width: "100%", marginTop: 8, padding: "0.65rem", borderRadius: 8, border: `1px solid ${DEBIT}`, background: "transparent", color: DEBIT, fontSize: 13, fontWeight: 700, cursor: "pointer" }, children: "Stop tracking this" }),
    /* @__PURE__ */ jsx("div", { style: { fontSize: 11.5, color: MUTED, marginTop: 6 }, children: "This removes it from Recurring items. Past entries stay in your ledger." })
  ] }) });
}
function DebtEditModal({ debt, onClose, onSave, onDelete }) {
  const [name, setName] = useState(debt.name);
  const [balance, setBalance] = useState(String(debt.balance));
  const [apr, setApr] = useState(String(debt.apr));
  return /* @__PURE__ */ jsx("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }, onClick: onClose, children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), style: { background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 16, fontWeight: 700, color: TEXT }, children: "Edit loan or credit account" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, style: { background: "none", border: "none", cursor: "pointer", color: MUTED }, children: /* @__PURE__ */ jsx(X, { size: 20 }) })
    ] }),
    /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Account name" }),
    /* @__PURE__ */ jsx("input", { value: name, onChange: (e) => setName(e.target.value), style: inputStyle }),
    /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Current balance" }),
    /* @__PURE__ */ jsx("input", { value: balance, onChange: (e) => setBalance(e.target.value.replace(/[^0-9]/g, "")), inputMode: "numeric", style: inputStyle }),
    /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Interest rate (APR %)" }),
    /* @__PURE__ */ jsx("input", { value: apr, onChange: (e) => setApr(e.target.value.replace(/[^0-9.]/g, "")), inputMode: "decimal", placeholder: "e.g. 18.9", style: inputStyle }),
    /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: MUTED, marginTop: 6 }, children: 'Matched against your bill and expense names \u2014 e.g. "Carvana" here links to any "Carvana" entries in your ledger, sharpening the quarterly suggestions.' }),
    /* @__PURE__ */ jsx("button", { onClick: () => onSave(debt.id, name, balance, apr), style: { width: "100%", marginTop: 18, padding: "0.75rem", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }, children: "Save account" }),
    /* @__PURE__ */ jsx("button", { onClick: () => onDelete(debt.id), style: { width: "100%", marginTop: 8, padding: "0.65rem", borderRadius: 8, border: `1px solid ${DEBIT}`, background: "transparent", color: DEBIT, fontSize: 13, fontWeight: 700, cursor: "pointer" }, children: "Remove account" })
  ] }) });
}
function PendingDebitsModal({ group, accountName, accounts, onClose, onApply, onApplySingle, onDelete }) {
  const [entries, setEntries] = useState(group.entries);
  const [bulkEditing, setBulkEditing] = useState(false);
  const [amount, setAmount] = useState(String(group.entries[0]?.amount ?? ""));
  const [accountId, setAccountId] = useState(group.entries[0]?.accountId ?? (accounts[0] && accounts[0].id));
  const [editingId, setEditingId] = useState(null);
  const [rowAmount, setRowAmount] = useState("");
  const [rowAccountId, setRowAccountId] = useState("");
  const startRowEdit = (e) => {
    setEditingId(e.id);
    setRowAmount(String(e.amount));
    setRowAccountId(e.accountId);
  };
  const discardRow = () => setEditingId(null);
  const saveRow = (id) => {
    onApplySingle(id, rowAmount, rowAccountId);
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, amount: parseInt(rowAmount, 10) || e.amount, accountId: rowAccountId || e.accountId } : e));
    setEditingId(null);
  };
  const deleteRow = (id) => {
    onDelete(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };
  return /* @__PURE__ */ jsx("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }, onClick: onClose, children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), style: { background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box", maxHeight: "85vh", overflowY: "auto" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }, children: [
      /* @__PURE__ */ jsxs("div", { style: { fontSize: 16, fontWeight: 700, color: TEXT }, children: [
        "Edit series \xB7 ",
        group.name
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, style: { background: "none", border: "none", cursor: "pointer", color: MUTED }, children: /* @__PURE__ */ jsx(X, { size: 20 }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { fontSize: 12, color: MUTED, marginBottom: 14 }, children: [
      entries.length,
      " pending ",
      TYPES[group.type].label.toLowerCase(),
      entries.length === 1 ? "" : "s",
      " this year"
    ] }),
    !bulkEditing ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }, children: entries.map(
        (e) => editingId === e.id ? /* @__PURE__ */ jsxs("div", { style: { background: SURFACE_2, borderRadius: 6, padding: "0.65rem 0.7rem" }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 12.5, color: MUTED, marginBottom: 6 }, children: fmtDate(e.date) }),
          /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Amount" }),
          /* @__PURE__ */ jsx("input", { value: rowAmount, onChange: (ev) => setRowAmount(ev.target.value.replace(/[^0-9]/g, "")), inputMode: "numeric", style: inputStyle }),
          /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Account" }),
          /* @__PURE__ */ jsx("select", { value: rowAccountId, onChange: (ev) => setRowAccountId(ev.target.value), style: inputStyle, children: accounts.map((a) => /* @__PURE__ */ jsx("option", { value: a.id, children: a.name }, a.id)) }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, marginTop: 10 }, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: discardRow,
                style: { flex: 1, padding: "0.55rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 13, fontWeight: 700, cursor: "pointer" },
                children: "Discard"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => saveRow(e.id),
                disabled: !parseInt(rowAmount, 10),
                style: { flex: 1, padding: "0.55rem", borderRadius: 8, border: "none", background: parseInt(rowAmount, 10) ? ACCENT : DISABLED, color: parseInt(rowAmount, 10) ? "#fff" : DISABLED_TEXT, fontSize: 13, fontWeight: 700, cursor: parseInt(rowAmount, 10) ? "pointer" : "not-allowed" },
                children: "Save"
              }
            )
          ] })
        ] }, e.id) : /* @__PURE__ */ jsxs(
          "div",
          {
            style: { display: "flex", justifyContent: "space-between", alignItems: "center", background: SURFACE_2, borderRadius: 6, padding: "0.5rem 0.65rem" },
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { style: { fontSize: 13, fontWeight: 600, color: TEXT }, children: fmtDate(e.date) }),
                /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: MUTED }, children: accountName(e.accountId) })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
                /* @__PURE__ */ jsx("div", { style: { fontFamily: "ui-monospace, monospace", fontSize: 13.5, fontWeight: 600, color: TYPES[e.type].color, marginRight: 6 }, children: fmt(e.amount) }),
                /* @__PURE__ */ jsx("button", { onClick: () => startRowEdit(e), "aria-label": `Edit ${fmtDate(e.date)}`, style: { background: "none", border: "none", color: MUTED, cursor: "pointer", padding: 5 }, children: /* @__PURE__ */ jsx(Pencil, { size: 13 }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => deleteRow(e.id), "aria-label": `Delete ${fmtDate(e.date)}`, style: { background: "none", border: "none", color: MUTED, cursor: "pointer", padding: 5 }, children: /* @__PURE__ */ jsx(Trash2, { size: 13 }) })
              ] })
            ]
          },
          e.id
        )
      ) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setBulkEditing(true),
          style: { width: "100%", padding: "0.75rem", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" },
          children: "Edit all"
        }
      )
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { style: { fontSize: 12.5, color: MUTED, marginBottom: 12 }, children: [
        "This updates all ",
        entries.length,
        " entr",
        entries.length === 1 ? "y" : "ies",
        " above at once \u2014 useful when a bill's amount or account changes going forward."
      ] }),
      /* @__PURE__ */ jsx("label", { style: labelStyle, children: "New amount" }),
      /* @__PURE__ */ jsx("input", { value: amount, onChange: (e) => setAmount(e.target.value.replace(/[^0-9]/g, "")), inputMode: "numeric", style: inputStyle }),
      /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Account" }),
      /* @__PURE__ */ jsx("select", { value: accountId, onChange: (e) => setAccountId(e.target.value), style: inputStyle, children: accounts.map((a) => /* @__PURE__ */ jsx("option", { value: a.id, children: a.name }, a.id)) }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, marginTop: 18 }, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setBulkEditing(false),
            style: { flex: 1, padding: "0.75rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 14, fontWeight: 700, cursor: "pointer" },
            children: "Discard"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onApply(entries.map((e) => e.id), amount, accountId),
            disabled: !parseInt(amount, 10),
            style: { flex: 1, padding: "0.75rem", borderRadius: 8, border: "none", background: parseInt(amount, 10) ? ACCENT : DISABLED, color: parseInt(amount, 10) ? "#fff" : DISABLED_TEXT, fontSize: 14, fontWeight: 700, cursor: parseInt(amount, 10) ? "pointer" : "not-allowed" },
            children: "Save all"
          }
        )
      ] })
    ] })
  ] }) });
}
var SWIPE_REVEAL = 84;
var LONG_SWIPE = 190;
function LedgerRow({ t, accountName, remove, onEditSeries, onEditOccurrence, onCycleStatus, accounts, balanceAfter, bg = BG }) {
  const timerRef = useRef(null);
  const startXRef = useRef(0);
  const draggingRef = useRef(false);
  const rawOffsetRef = useRef(0);
  const [offsetX, setOffsetX] = useState(0);
  const [openSide, setOpenSide] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [editingOccurrence, setEditingOccurrence] = useState(false);
  const [draftAmount, setDraftAmount] = useState("");
  const [draftDate, setDraftDate] = useState("");
  const [draftName, setDraftName] = useState("");
  const [draftType, setDraftType] = useState("expense");
  const [draftAccountId, setDraftAccountId] = useState("");
  const [draftFromAccountId, setDraftFromAccountId] = useState("");
  const [draftToAccountId, setDraftToAccountId] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const canSeries = t.type !== "transfer" && !!onEditSeries;
  const rowStatus = getStatus(t, toISODate(/* @__PURE__ */ new Date()));
  const isCanceled = rowStatus === "canceled";
  const rowAccentColor = t.type === "transfer" ? TRANSFER : accountColorFor(t.accountId, accounts);
  const startLongPress = () => {
    if (openSide) return;
    timerRef.current = setTimeout(() => {
      setDraftAmount(String(t.amount));
      setDraftDate(t.date);
      setDraftName(t.name);
      setDraftType(t.type);
      setDraftAccountId(t.accountId || accounts[0] && accounts[0].id);
      setDraftFromAccountId(t.fromAccountId || accounts[0] && accounts[0].id);
      setDraftToAccountId(t.toAccountId || (accounts[1] ? accounts[1].id : accounts[0] && accounts[0].id));
      setEditingOccurrence(true);
    }, 550);
  };
  const clearLongPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  const closeSwipe = () => {
    setOffsetX(0);
    setOpenSide(null);
  };
  const onDragStart = (clientX) => {
    if (editingOccurrence) return;
    startXRef.current = clientX;
    draggingRef.current = false;
    startLongPress();
  };
  const onDragMove = (clientX) => {
    if (editingOccurrence) return;
    const dx = clientX - startXRef.current;
    if (Math.abs(dx) > 8) {
      clearLongPress();
      draggingRef.current = true;
      setDragging(true);
    }
    if (draggingRef.current) {
      const base = openSide === "delete" ? -SWIPE_REVEAL : openSide === "series" ? SWIPE_REVEAL : 0;
      const raw = base + dx;
      rawOffsetRef.current = raw;
      let min = -(SWIPE_REVEAL + 24);
      let max = canSeries ? SWIPE_REVEAL + 24 : 0;
      setOffsetX(Math.min(max, Math.max(raw, min)));
    }
  };
  const onDragEnd = () => {
    clearLongPress();
    setDragging(false);
    if (draggingRef.current) {
      const raw = rawOffsetRef.current;
      if (raw <= -LONG_SWIPE) {
        setOffsetX(-SWIPE_REVEAL);
        setOpenSide("delete");
        setConfirmDelete(true);
      } else if (raw <= -SWIPE_REVEAL / 2) {
        setOffsetX(-SWIPE_REVEAL);
        setOpenSide("delete");
      } else if (canSeries && raw >= LONG_SWIPE) {
        closeSwipe();
        onEditSeries(t);
      } else if (canSeries && raw >= SWIPE_REVEAL / 2) {
        setOffsetX(SWIPE_REVEAL);
        setOpenSide("series");
      } else {
        closeSwipe();
      }
    } else if (openSide) {
      closeSwipe();
    }
    draggingRef.current = false;
  };
  const handleSeriesTap = () => {
    closeSwipe();
    onEditSeries(t);
  };
  const cancelOccurrence = () => setEditingOccurrence(false);
  const saveOccurrence = () => {
    onEditOccurrence(t.id, {
      name: draftName,
      type: draftType,
      amount: draftAmount,
      date: draftDate,
      accountId: draftAccountId,
      fromAccountId: draftFromAccountId,
      toAccountId: draftToAccountId
    });
    setEditingOccurrence(false);
  };
  if (editingOccurrence) {
    return /* @__PURE__ */ jsxs("div", { style: { padding: "0.65rem 0.6rem", borderBottom: `1px dashed ${LINE}`, background: SURFACE_2, borderRadius: 6, marginBottom: 4, overflow: "hidden", boxSizing: "border-box" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 12.5, fontWeight: 600, color: TEXT }, children: "Edit this occurrence only" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: cancelOccurrence,
            "aria-label": "Close",
            style: { background: "none", border: "none", color: MUTED, cursor: "pointer", padding: 2, display: "flex", alignItems: "center" },
            children: /* @__PURE__ */ jsx(X, { size: 16 })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Type" }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 6, marginBottom: 4 }, children: [
        Object.entries(TYPES).map(([key, meta]) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setDraftType(key),
            style: { flex: 1, padding: "0.35rem 0", borderRadius: 6, border: `1px solid ${draftType === key ? meta.color : LINE}`, background: draftType === key ? meta.color : SURFACE, color: draftType === key ? "#0B120E" : TEXT, fontSize: 11.5, fontWeight: 600, cursor: "pointer" },
            children: meta.label
          },
          key
        )),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setDraftType("transfer"),
            style: { flex: 1, padding: "0.35rem 0", borderRadius: 6, border: `1px solid ${draftType === "transfer" ? TRANSFER : LINE}`, background: draftType === "transfer" ? TRANSFER : SURFACE, color: draftType === "transfer" ? "#0B120E" : TEXT, fontSize: 11.5, fontWeight: 600, cursor: "pointer" },
            children: "Transfer"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Description" }),
      /* @__PURE__ */ jsx("input", { value: draftName, onChange: (e) => setDraftName(e.target.value), style: inputStyle }),
      /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Amount" }),
      /* @__PURE__ */ jsx("input", { value: draftAmount, onChange: (e) => setDraftAmount(e.target.value.replace(/[^0-9]/g, "")), inputMode: "numeric", style: inputStyle }),
      draftType === "transfer" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "From" }),
        /* @__PURE__ */ jsx("select", { value: draftFromAccountId, onChange: (e) => setDraftFromAccountId(e.target.value), style: inputStyle, children: accounts.map((a) => /* @__PURE__ */ jsx("option", { value: a.id, children: a.name }, a.id)) }),
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "To" }),
        /* @__PURE__ */ jsx("select", { value: draftToAccountId, onChange: (e) => setDraftToAccountId(e.target.value), style: inputStyle, children: accounts.map((a) => /* @__PURE__ */ jsx("option", { value: a.id, children: a.name }, a.id)) })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Account" }),
        /* @__PURE__ */ jsx("select", { value: draftAccountId, onChange: (e) => setDraftAccountId(e.target.value), style: inputStyle, children: accounts.map((a) => /* @__PURE__ */ jsx("option", { value: a.id, children: a.name }, a.id)) })
      ] }),
      /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Date" }),
      /* @__PURE__ */ jsx("input", { type: "date", value: draftDate, onChange: (e) => setDraftDate(e.target.value), style: dateInputStyle }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, marginTop: 10 }, children: [
        /* @__PURE__ */ jsx("button", { onClick: cancelOccurrence, style: { flex: 1, padding: "0.55rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 13, fontWeight: 700, cursor: "pointer" }, children: "Cancel" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: saveOccurrence,
            disabled: !draftName.trim() || !parseInt(draftAmount, 10),
            style: {
              flex: 1,
              padding: "0.55rem",
              borderRadius: 8,
              border: "none",
              background: draftName.trim() && parseInt(draftAmount, 10) ? ACCENT : DISABLED,
              color: draftName.trim() && parseInt(draftAmount, 10) ? "#fff" : DISABLED_TEXT,
              fontSize: 13,
              fontWeight: 700,
              cursor: draftName.trim() && parseInt(draftAmount, 10) ? "pointer" : "not-allowed"
            },
            children: "Save"
          }
        )
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative", overflow: "hidden", borderBottom: `1px dashed ${LINE}` }, children: [
    canSeries && /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleSeriesTap,
        "aria-label": `Edit series for ${t.name}`,
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: SWIPE_REVEAL,
          border: "none",
          background: TRANSFER,
          color: "#fff",
          fontSize: 11,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2
        },
        children: [
          /* @__PURE__ */ jsx(Repeat, { size: 15 }),
          "Edit series"
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setConfirmDelete(true),
        "aria-label": `Delete ${t.name}`,
        style: {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: SWIPE_REVEAL,
          border: "none",
          background: DEBIT,
          color: "#fff",
          fontSize: 11.5,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2
        },
        children: [
          /* @__PURE__ */ jsx(Trash2, { size: 15 }),
          "Delete"
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        onTouchStart: (e) => onDragStart(e.touches[0].clientX),
        onTouchMove: (e) => onDragMove(e.touches[0].clientX),
        onTouchEnd: onDragEnd,
        onMouseDown: (e) => onDragStart(e.clientX),
        onMouseMove: (e) => draggingRef.current && onDragMove(e.clientX),
        onMouseUp: onDragEnd,
        onMouseLeave: () => draggingRef.current && onDragEnd(),
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0.4rem 0.6rem 0.4rem 0.55rem",
          background: bg,
          boxShadow: `inset 0 0 0 999px ${rowAccentColor}14`,
          borderLeft: `5px solid ${rowAccentColor}`,
          position: "relative",
          zIndex: 1,
          transform: `translateX(${offsetX}px)`,
          transition: dragging ? "none" : "transform 0.2s ease",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
          touchAction: "pan-y"
        },
        children: [
          /* @__PURE__ */ jsx("div", { style: { width: 8, height: 8, borderRadius: "50%", background: rowAccentColor, flexShrink: 0, boxShadow: `0 0 0 2px ${bg}` } }),
          /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5 }, children: [
              /* @__PURE__ */ jsx("div", { style: { fontSize: 13.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: isCanceled ? MUTED : TEXT, textDecoration: isCanceled ? "line-through" : "none" }, children: t.name }),
              t.templateId && /* @__PURE__ */ jsx(Repeat, { size: 10, color: GOLD, "aria-label": "Recurring", style: { flexShrink: 0 } })
            ] }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: 10.5, color: MUTED, marginTop: 1 }, children: t.type === "transfer" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              fmtDate(t.date),
              " \xB7 Transfer \xB7 ",
              accountName(t.fromAccountId),
              " \u2192 ",
              accountName(t.toAccountId)
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              fmtDate(t.date),
              " \xB7 ",
              TYPES[t.type].label,
              " \xB7 ",
              accountName(t.accountId),
              t.templateId ? " \xB7 recurring" : ""
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { textAlign: "right", paddingRight: 2 }, children: [
            /* @__PURE__ */ jsxs("div", { style: { fontFamily: "ui-monospace, monospace", fontSize: 13, fontWeight: 600, color: t.type === "transfer" ? TRANSFER : TYPES[t.type].color, whiteSpace: "nowrap" }, children: [
              t.type === "transfer" ? "\u21C4 " : TYPES[t.type].sign > 0 ? "+" : "-",
              fmt(t.amount)
            ] }),
            balanceAfter !== void 0 && /* @__PURE__ */ jsxs("div", { style: { fontSize: 9.5, color: balanceAfter < 0 ? DEBIT : MUTED, fontWeight: balanceAfter < 0 ? 700 : 400, whiteSpace: "nowrap", marginTop: 0 }, children: [
              balanceAfter < 0 && "\u26A0 ",
              fmt(balanceAfter),
              " bal"
            ] }),
            onCycleStatus && /* @__PURE__ */ jsx(StatusBadge, { t, onCycle: onCycleStatus, small: true })
          ] })
        ]
      }
    ),
    confirmDelete && /* @__PURE__ */ jsx(
      "div",
      {
        style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 70 },
        onClick: () => {
          setConfirmDelete(false);
          closeSwipe();
        },
        children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), style: { background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 4 }, children: "Delete this transaction?" }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: 12.5, color: MUTED, marginBottom: 14 }, children: "This can't be undone from here, but Undo on the Ledger tab will still restore it." }),
          /* @__PURE__ */ jsxs("div", { style: { background: SURFACE_2, borderRadius: 8, padding: "0.75rem 0.85rem", marginBottom: 18 }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 6 }, children: t.name }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: 12.5, color: MUTED, marginBottom: 2 }, children: fmtDate(t.date) }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: 12.5, color: MUTED, marginBottom: 2 }, children: t.type === "transfer" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              "Transfer \xB7 ",
              accountName(t.fromAccountId),
              " \u2192 ",
              accountName(t.toAccountId)
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              TYPES[t.type].label,
              " \xB7 ",
              accountName(t.accountId)
            ] }) }),
            /* @__PURE__ */ jsxs("div", { style: { fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 700, color: t.type === "transfer" ? TRANSFER : TYPES[t.type].color, marginTop: 6 }, children: [
              t.type === "transfer" ? "\u21C4 " : TYPES[t.type].sign > 0 ? "+" : "-",
              fmt(t.amount)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setConfirmDelete(false);
                  closeSwipe();
                },
                style: { flex: 1, padding: "0.75rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 14, fontWeight: 700, cursor: "pointer" },
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  remove(t.id);
                  setConfirmDelete(false);
                },
                style: { flex: 1, padding: "0.75rem", borderRadius: 8, border: "none", background: DEBIT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" },
                children: "Delete"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function StatusBadge({ t, onCycle, small = false }) {
  const status = getStatus(t, toISODate(/* @__PURE__ */ new Date()));
  const handleClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const direction = clickX < rect.width * 0.3 ? -1 : 1;
    onCycle(t.id, direction);
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: handleClick,
      onTouchStart: (e) => e.stopPropagation(),
      onMouseDown: (e) => e.stopPropagation(),
      "aria-label": `Status: ${STATUSES[status].label}. Tap left to go back, right to advance.`,
      style: {
        marginTop: 3,
        width: small ? 74 : 82,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: small ? 9 : 9.5,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: STATUSES[status].color,
        background: "none",
        border: `1px solid ${STATUSES[status].color}`,
        borderRadius: 999,
        padding: small ? "0.22rem 0.3rem" : "0.26rem 0.3rem",
        boxSizing: "border-box",
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none"
      },
      children: STATUSES[status].label
    }
  );
}
function ChangeBadge({ value, favorableWhenPositive }) {
  if (value === null) {
    return /* @__PURE__ */ jsx("span", { style: { fontSize: 11, color: MUTED }, children: "first tracked" });
  }
  if (value === 0) {
    return /* @__PURE__ */ jsx("span", { style: { fontSize: 11, color: MUTED }, children: "no change" });
  }
  const isIncrease = value > 0;
  const isFavorable = favorableWhenPositive ? isIncrease : !isIncrease;
  const color = isFavorable ? CREDIT : DEBIT;
  const arrow = isIncrease ? "\u25B2" : "\u25BC";
  return /* @__PURE__ */ jsxs("span", { style: { fontSize: 11, fontWeight: 600, color, whiteSpace: "nowrap" }, children: [
    arrow,
    " ",
    fmt(Math.abs(value))
  ] });
}
function SectionLabel({ icon, text }) {
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: MUTED, fontWeight: 700 }, children: [
    icon,
    text
  ] });
}
function EmptyNote({ children }) {
  return /* @__PURE__ */ jsx("div", { style: { fontSize: 13, color: MUTED, marginTop: 8, padding: "0.75rem", background: SURFACE, border: `1px dashed ${LINE}`, borderRadius: 6 }, children });
}
var labelStyle = { display: "block", fontSize: 12, color: MUTED, fontWeight: 600, marginTop: 10, marginBottom: 4 };
var inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "0.55rem 0.65rem",
  borderRadius: 6,
  border: `1px solid ${LINE}`,
  fontSize: 14,
  fontFamily: "-apple-system, sans-serif",
  background: SURFACE_2,
  color: TEXT
};
var dateInputStyle = {
  ...inputStyle,
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  display: "block",
  appearance: "none",
  WebkitAppearance: "none"
};

// main.jsx
import { jsx as jsx2 } from "react/jsx-runtime";
var container = document.getElementById("root");
var root = createRoot(container);
root.render(/* @__PURE__ */ jsx2(Ledger, {}));

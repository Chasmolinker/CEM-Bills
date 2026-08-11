import React, { useState, useEffect, useMemo, useRef } from "react";
import { Plus, X, TrendingUp, Receipt, Clock, Trash2, Pencil, Check, ChevronDown, ChevronRight, Archive, RotateCcw, RotateCw, Repeat, Menu, ArrowLeft, Wallet } from "lucide-react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, CartesianGrid } from "recharts";

const BG = "#121A16";
const SURFACE = "#1C2A22";
const SURFACE_2 = "#24352A";
const HEADER = "#0B120E";
const HEADER_TEXT = "#ECF0E7";
const LINE = "#33453A";
const TEXT = "#E9EDE5";
const MUTED = "#8FA093";
const CREDIT = "#4CAF77";
const DEBIT = "#E0705A";
const GOLD = "#D9AA4E";
const TRANSFER = "#6FA0C4";
const ACCENT = "#2F5A40";
const DISABLED = "#33453A";
const DISABLED_TEXT = "#6C7A70";

const TYPES = {
  income: { label: "Income", color: CREDIT, sign: 1, verb: "received" },
  bill: { label: "Bill", color: DEBIT, sign: -1, verb: "paid" },
  expense: { label: "Expense", color: DEBIT, sign: -1, verb: "logged" },
};

const ACCOUNT_COLORS = ["#5FA8A0", "#B08AD9", "#C9A24A", "#7F9BC9"];
function accountColorFor(accountId, accounts) {
  const idx = accounts.findIndex((a) => a.id === accountId);
  if (idx === -1) return MUTED;
  return ACCOUNT_COLORS[idx % ACCOUNT_COLORS.length];
}

const STATUS_ORDER = ["upcoming", "pending", "complete", "canceled"];
const STATUSES = {
  upcoming: { label: "Upcoming", color: MUTED },
  pending: { label: "Pending", color: GOLD },
  complete: { label: "Complete", color: CREDIT },
  canceled: { label: "Canceled", color: DEBIT },
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

const DEFAULT_ACCOUNTS = [
  { id: "a1", name: "TD-9918", opening: 0 },
  { id: "a2", name: "PFFCU-X", opening: 0 },
];

const DEFAULT_DEBTS = [
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
  { id: "d14", name: "Power 2", balance: 0, apr: 0 },
];

const IMPORTED_2026 = [
{id:"imp-0",type:"income",name:"Income deposit",amount:1080,date:"2026-01-02",accountId:"a1",templateId:null},
{id:"imp-0-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-01-02",accountId:"a2",templateId:null},
{id:"imp-1",type:"bill",name:"Amex",amount:100,date:"2026-01-02",accountId:"a1",templateId:null},
{id:"imp-2",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-01-02",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-3",type:"transfer",name:"Transfer (Td)",amount:600,date:"2026-01-02",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-4",type:"bill",name:"Power 1",amount:312,date:"2026-01-03",accountId:"a1",templateId:null},
{id:"imp-5",type:"bill",name:"Gas",amount:50,date:"2026-01-03",accountId:"a2",templateId:null},
{id:"imp-6",type:"expense",name:"T Mobile",amount:322,date:"2026-01-03",accountId:"a2",templateId:null},
{id:"imp-7",type:"transfer",name:"Transfer (Pffcu)",amount:130,date:"2026-01-05",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-8",type:"expense",name:"Greensky (auto)",amount:300,date:"2026-01-05",accountId:"a1",templateId:null},
{id:"imp-9",type:"bill",name:"Aidvantage",amount:40,date:"2026-01-07",accountId:"a1",templateId:null},
{id:"imp-10",type:"income",name:"Income deposit",amount:1080,date:"2026-01-09",accountId:"a1",templateId:null},
{id:"imp-10-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-01-09",accountId:"a2",templateId:null},
{id:"imp-11",type:"bill",name:"Verizon (auto)",amount:112,date:"2026-01-09",accountId:"a1",templateId:null},
{id:"imp-12",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-01-09",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-13",type:"transfer",name:"Transfer (Td)",amount:100,date:"2026-01-09",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-14",type:"bill",name:"Mr Tire",amount:50,date:"2026-01-10",accountId:"a1",templateId:null},
{id:"imp-15",type:"bill",name:"Gas",amount:50,date:"2026-01-10",accountId:"a2",templateId:null},
{id:"imp-16",type:"expense",name:"Int",amount:112,date:"2026-01-11",accountId:"a2",templateId:null},
{id:"imp-17",type:"bill",name:"Affirm",amount:250,date:"2026-01-12",accountId:"a1",templateId:null},
{id:"imp-18",type:"bill",name:"Prosper",amount:400,date:"2026-01-12",accountId:"a1",templateId:null},
{id:"imp-19",type:"bill",name:"Maint",amount:14,date:"2026-01-14",accountId:"a1",templateId:null},
{id:"imp-20",type:"bill",name:"Aidvantage",amount:40,date:"2026-01-14",accountId:"a1",templateId:null},
{id:"imp-21",type:"income",name:"Income deposit",amount:1080,date:"2026-01-16",accountId:"a1",templateId:null},
{id:"imp-21-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-01-16",accountId:"a2",templateId:null},
{id:"imp-22",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-01-16",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-23",type:"transfer",name:"Transfer (Td)",amount:500,date:"2026-01-16",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-24",type:"income",name:"Income deposit",amount:250,date:"2026-01-17",accountId:"a1",templateId:null},
{id:"imp-25",type:"bill",name:"Power 2",amount:87,date:"2026-01-17",accountId:"a1",templateId:null},
{id:"imp-26",type:"expense",name:"PFFCU transaction",amount:50,date:"2026-01-17",accountId:"a2",templateId:null},
{id:"imp-27",type:"income",name:"Income deposit",amount:100,date:"2026-01-18",accountId:"a1",templateId:null},
{id:"imp-28",type:"bill",name:"Pseg",amount:140,date:"2026-01-18",accountId:"a1",templateId:null},
{id:"imp-29",type:"bill",name:"Car Ins",amount:400,date:"2026-01-18",accountId:"a2",templateId:null},
{id:"imp-30",type:"expense",name:"Affirm C",amount:240,date:"2026-01-19",accountId:"a1",templateId:null},
{id:"imp-31",type:"bill",name:"Walmart",amount:150,date:"2026-01-20",accountId:"a1",templateId:null},
{id:"imp-32",type:"bill",name:"Aidvantage",amount:40,date:"2026-01-21",accountId:"a1",templateId:null},
{id:"imp-33",type:"bill",name:"Drive",amount:50,date:"2026-01-22",accountId:"a1",templateId:null},
{id:"imp-34",type:"income",name:"Income deposit",amount:1080,date:"2026-01-23",accountId:"a1",templateId:null},
{id:"imp-34-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-01-23",accountId:"a2",templateId:null},
{id:"imp-35",type:"bill",name:"Affirm",amount:50,date:"2026-01-23",accountId:"a1",templateId:null},
{id:"imp-36",type:"expense",name:"Ccmua",amount:195,date:"2026-01-23",accountId:"a1",templateId:null},
{id:"imp-37",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-01-23",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-38",type:"transfer",name:"Transfer (Td)",amount:500,date:"2026-01-23",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-39",type:"expense",name:"Youtube",amount:85,date:"2026-01-23",accountId:"a2",templateId:null},
{id:"imp-40",type:"bill",name:"Gas",amount:50,date:"2026-01-24",accountId:"a2",templateId:null},
{id:"imp-41",type:"bill",name:"Goodleap (auto)",amount:160,date:"2026-01-26",accountId:"a1",templateId:null},
{id:"imp-42",type:"bill",name:"Chase",amount:300,date:"2026-01-28",accountId:"a1",templateId:null},
{id:"imp-43",type:"bill",name:"Aidvantage",amount:40,date:"2026-01-28",accountId:"a1",templateId:null},
{id:"imp-44",type:"income",name:"Income deposit",amount:1050,date:"2026-01-29",accountId:"a1",templateId:null},
{id:"imp-44-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-01-29",accountId:"a2",templateId:null},
{id:"imp-45",type:"expense",name:"Cwood",amount:219,date:"2026-01-29",accountId:"a1",templateId:null},
{id:"imp-46",type:"income",name:"Income deposit",amount:1080,date:"2026-01-30",accountId:"a1",templateId:null},
{id:"imp-46-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-01-30",accountId:"a2",templateId:null},
{id:"imp-47",type:"bill",name:"Apple",amount:200,date:"2026-01-30",accountId:"a1",templateId:null},
{id:"imp-48",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-01-30",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-49",type:"transfer",name:"Transfer (Td)",amount:500,date:"2026-01-30",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-50",type:"bill",name:"Gas",amount:50,date:"2026-01-31",accountId:"a2",templateId:null},
{id:"imp-51",type:"bill",name:"Amex",amount:200,date:"2026-02-02",accountId:"a1",templateId:null},
{id:"imp-52",type:"expense",name:"Misc",amount:200,date:"2026-02-02",accountId:"a2",templateId:null},
{id:"imp-53",type:"bill",name:"Power 1",amount:312,date:"2026-02-03",accountId:"a1",templateId:null},
{id:"imp-54",type:"bill",name:"Pseg",amount:740,date:"2026-02-04",accountId:"a1",templateId:null},
{id:"imp-55",type:"bill",name:"Aidvantage",amount:40,date:"2026-02-04",accountId:"a1",templateId:null},
{id:"imp-56",type:"transfer",name:"Transfer (Pffcu)",amount:300,date:"2026-02-05",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-57",type:"expense",name:"Greensky (auto)",amount:300,date:"2026-02-05",accountId:"a1",templateId:null},
{id:"imp-58",type:"income",name:"Income deposit",amount:1080,date:"2026-02-06",accountId:"a1",templateId:null},
{id:"imp-58-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-02-06",accountId:"a2",templateId:null},
{id:"imp-59",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-02-06",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-60",type:"transfer",name:"Transfer (Td)",amount:300,date:"2026-02-06",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-61",type:"expense",name:"Verizon",amount:110,date:"2026-02-06",accountId:"a2",templateId:null},
{id:"imp-62",type:"bill",name:"Gas",amount:50,date:"2026-02-07",accountId:"a2",templateId:null},
{id:"imp-63",type:"expense",name:"T Mobile",amount:290,date:"2026-02-07",accountId:"a2",templateId:null},
{id:"imp-64",type:"bill",name:"Mr Tire",amount:50,date:"2026-02-10",accountId:"a1",templateId:null},
{id:"imp-65",type:"bill",name:"Aidvantage",amount:40,date:"2026-02-11",accountId:"a1",templateId:null},
{id:"imp-66",type:"expense",name:"Int",amount:112,date:"2026-02-11",accountId:"a2",templateId:null},
{id:"imp-67",type:"bill",name:"Affirm",amount:250,date:"2026-02-12",accountId:"a1",templateId:null},
{id:"imp-68",type:"bill",name:"Prosper",amount:400,date:"2026-02-12",accountId:"a1",templateId:null},
{id:"imp-69",type:"income",name:"Income deposit",amount:1080,date:"2026-02-13",accountId:"a1",templateId:null},
{id:"imp-69-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-02-13",accountId:"a2",templateId:null},
{id:"imp-70",type:"bill",name:"Apple",amount:100,date:"2026-02-13",accountId:"a1",templateId:null},
{id:"imp-71",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-02-13",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-72",type:"transfer",name:"Transfer (Td)",amount:350,date:"2026-02-13",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-73",type:"income",name:"Income deposit",amount:240,date:"2026-02-14",accountId:"a1",templateId:null},
{id:"imp-74",type:"bill",name:"Maint",amount:14,date:"2026-02-14",accountId:"a1",templateId:null},
{id:"imp-75",type:"bill",name:"Gas",amount:50,date:"2026-02-14",accountId:"a2",templateId:null},
{id:"imp-76",type:"bill",name:"Power 2",amount:87,date:"2026-02-17",accountId:"a1",templateId:null},
{id:"imp-77",type:"bill",name:"Aidvantage",amount:40,date:"2026-02-18",accountId:"a1",templateId:null},
{id:"imp-78",type:"bill",name:"Car Ins",amount:311,date:"2026-02-18",accountId:"a2",templateId:null},
{id:"imp-79",type:"bill",name:"Affirm C (auto)",amount:240,date:"2026-02-19",accountId:"a1",templateId:null},
{id:"imp-80",type:"income",name:"Income deposit",amount:1080,date:"2026-02-20",accountId:"a1",templateId:null},
{id:"imp-80-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-02-20",accountId:"a2",templateId:null},
{id:"imp-81",type:"bill",name:"Walmart",amount:300,date:"2026-02-20",accountId:"a1",templateId:null},
{id:"imp-82",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-02-20",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-83",type:"transfer",name:"Transfer (Td)",amount:700,date:"2026-02-20",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-84",type:"bill",name:"Gas",amount:50,date:"2026-02-21",accountId:"a2",templateId:null},
{id:"imp-85",type:"bill",name:"Drive",amount:200,date:"2026-02-22",accountId:"a1",templateId:null},
{id:"imp-86",type:"bill",name:"Affirm",amount:50,date:"2026-02-23",accountId:"a1",templateId:null},
{id:"imp-87",type:"expense",name:"Youtube",amount:85,date:"2026-02-23",accountId:"a2",templateId:null},
{id:"imp-88",type:"transfer",name:"Transfer (Transfer)",amount:100,date:"2026-02-24",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-89",type:"bill",name:"Aidvantage",amount:40,date:"2026-02-25",accountId:"a1",templateId:null},
{id:"imp-90",type:"bill",name:"Goodleap (auto)",amount:160,date:"2026-02-26",accountId:"a1",templateId:null},
{id:"imp-91",type:"income",name:"Income deposit",amount:1080,date:"2026-02-27",accountId:"a1",templateId:null},
{id:"imp-91-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-02-27",accountId:"a2",templateId:null},
{id:"imp-92",type:"bill",name:"Apple",amount:150,date:"2026-02-27",accountId:"a1",templateId:null},
{id:"imp-93",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-02-27",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-94",type:"transfer",name:"Transfer (Td)",amount:500,date:"2026-02-27",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-95",type:"bill",name:"Chase",amount:400,date:"2026-02-28",accountId:"a1",templateId:null},
{id:"imp-96",type:"bill",name:"Gas",amount:50,date:"2026-02-28",accountId:"a2",templateId:null},
{id:"imp-97",type:"bill",name:"Amex",amount:200,date:"2026-03-02",accountId:"a1",templateId:null},
{id:"imp-98",type:"expense",name:"Misc",amount:200,date:"2026-03-02",accountId:"a2",templateId:null},
{id:"imp-99",type:"bill",name:"Power 1",amount:312,date:"2026-03-03",accountId:"a1",templateId:null},
{id:"imp-100",type:"bill",name:"Aidvantage",amount:40,date:"2026-03-04",accountId:"a1",templateId:null},
{id:"imp-101",type:"expense",name:"Greensky (auto)",amount:300,date:"2026-03-05",accountId:"a1",templateId:null},
{id:"imp-102",type:"expense",name:"Pse&G",amount:440,date:"2026-03-05",accountId:"a2",templateId:null},
{id:"imp-103",type:"income",name:"Income deposit",amount:1130,date:"2026-03-06",accountId:"a1",templateId:null},
{id:"imp-103-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-03-06",accountId:"a2",templateId:null},
{id:"imp-104",type:"transfer",name:"Transfer (Transfer)",amount:35,date:"2026-03-06",fromAccountId:"a2",toAccountId:"a1",templateId:null},
{id:"imp-105",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-03-06",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-106",type:"transfer",name:"Transfer (Td)",amount:500,date:"2026-03-06",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-107",type:"bill",name:"Gas",amount:50,date:"2026-03-07",accountId:"a2",templateId:null},
{id:"imp-108",type:"bill",name:"Verizon (auto)",amount:112,date:"2026-03-09",accountId:"a1",templateId:null},
{id:"imp-109",type:"bill",name:"T Mobile (auto)",amount:255,date:"2026-03-09",accountId:"a1",templateId:null},
{id:"imp-110",type:"bill",name:"Mr Tire",amount:100,date:"2026-03-10",accountId:"a1",templateId:null},
{id:"imp-111",type:"bill",name:"Aidvantage",amount:40,date:"2026-03-11",accountId:"a1",templateId:null},
{id:"imp-112",type:"expense",name:"Int",amount:112,date:"2026-03-11",accountId:"a2",templateId:null},
{id:"imp-113",type:"bill",name:"Affirm (auto)",amount:250,date:"2026-03-12",accountId:"a1",templateId:null},
{id:"imp-114",type:"bill",name:"Prosper",amount:400,date:"2026-03-12",accountId:"a1",templateId:null},
{id:"imp-115",type:"bill",name:"Carvana",amount:735,date:"2026-03-12",accountId:"a2",templateId:null},
{id:"imp-116",type:"income",name:"Income deposit",amount:1130,date:"2026-03-13",accountId:"a1",templateId:null},
{id:"imp-116-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-03-13",accountId:"a2",templateId:null},
{id:"imp-117",type:"bill",name:"Drive",amount:150,date:"2026-03-13",accountId:"a1",templateId:null},
{id:"imp-118",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-03-13",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-119",type:"transfer",name:"Transfer (Td)",amount:500,date:"2026-03-13",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-120",type:"bill",name:"Maint",amount:14,date:"2026-03-14",accountId:"a1",templateId:null},
{id:"imp-121",type:"bill",name:"Gas",amount:50,date:"2026-03-14",accountId:"a2",templateId:null},
{id:"imp-122",type:"bill",name:"Power 2",amount:87,date:"2026-03-17",accountId:"a1",templateId:null},
{id:"imp-123",type:"bill",name:"Aidvantage",amount:40,date:"2026-03-18",accountId:"a1",templateId:null},
{id:"imp-124",type:"bill",name:"Car Ins",amount:308,date:"2026-03-18",accountId:"a2",templateId:null},
{id:"imp-125",type:"bill",name:"Affirm C (auto)",amount:240,date:"2026-03-19",accountId:"a1",templateId:null},
{id:"imp-126",type:"income",name:"Income deposit",amount:1130,date:"2026-03-20",accountId:"a1",templateId:null},
{id:"imp-126-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-03-20",accountId:"a2",templateId:null},
{id:"imp-127",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-03-20",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-128",type:"transfer",name:"Transfer (Td)",amount:500,date:"2026-03-20",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-129",type:"income",name:"Income deposit",amount:1000,date:"2026-03-21",accountId:"a1",templateId:null},
{id:"imp-130",type:"bill",name:"Chase",amount:400,date:"2026-03-21",accountId:"a1",templateId:null},
{id:"imp-131",type:"transfer",name:"Transfer (Transfer)",amount:100,date:"2026-03-21",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-132",type:"bill",name:"Gas",amount:50,date:"2026-03-21",accountId:"a2",templateId:null},
{id:"imp-133",type:"bill",name:"Greensky",amount:1000,date:"2026-03-22",accountId:"a1",templateId:null},
{id:"imp-134",type:"bill",name:"Affirm (auto)",amount:50,date:"2026-03-23",accountId:"a1",templateId:null},
{id:"imp-135",type:"expense",name:"Youtube",amount:85,date:"2026-03-23",accountId:"a2",templateId:null},
{id:"imp-136",type:"bill",name:"Aidvantage",amount:40,date:"2026-03-25",accountId:"a1",templateId:null},
{id:"imp-137",type:"bill",name:"Goodleap (auto)",amount:160,date:"2026-03-26",accountId:"a1",templateId:null},
{id:"imp-138",type:"income",name:"Income deposit",amount:1130,date:"2026-03-27",accountId:"a1",templateId:null},
{id:"imp-138-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-03-27",accountId:"a2",templateId:null},
{id:"imp-139",type:"transfer",name:"Transfer (Transfer)",amount:450,date:"2026-03-27",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-140",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-03-27",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-141",type:"bill",name:"Gas",amount:50,date:"2026-03-28",accountId:"a2",templateId:null},
{id:"imp-142",type:"bill",name:"Apple",amount:150,date:"2026-03-30",accountId:"a1",templateId:null},
{id:"imp-143",type:"bill",name:"Aidvantage",amount:40,date:"2026-04-01",accountId:"a1",templateId:null},
{id:"imp-144",type:"bill",name:"Amex",amount:300,date:"2026-04-02",accountId:"a1",templateId:null},
{id:"imp-145",type:"expense",name:"Misc",amount:200,date:"2026-04-02",accountId:"a2",templateId:null},
{id:"imp-146",type:"income",name:"Income deposit",amount:1130,date:"2026-04-03",accountId:"a1",templateId:null},
{id:"imp-146-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-04-03",accountId:"a2",templateId:null},
{id:"imp-147",type:"bill",name:"Power 1",amount:312,date:"2026-04-03",accountId:"a1",templateId:null},
{id:"imp-148",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-04-03",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-149",type:"transfer",name:"Transfer (Td)",amount:500,date:"2026-04-03",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-150",type:"bill",name:"Pseg",amount:440,date:"2026-04-04",accountId:"a1",templateId:null},
{id:"imp-151",type:"bill",name:"Gas",amount:50,date:"2026-04-04",accountId:"a2",templateId:null},
{id:"imp-152",type:"expense",name:"Greensky (auto)",amount:300,date:"2026-04-05",accountId:"a1",templateId:null},
{id:"imp-153",type:"bill",name:"Aidvantage",amount:40,date:"2026-04-08",accountId:"a1",templateId:null},
{id:"imp-154",type:"bill",name:"Verizon (auto)",amount:129,date:"2026-04-09",accountId:"a1",templateId:null},
{id:"imp-155",type:"expense",name:"T Mobile",amount:240,date:"2026-04-09",accountId:"a2",templateId:null},
{id:"imp-156",type:"income",name:"Income deposit",amount:1130,date:"2026-04-10",accountId:"a1",templateId:null},
{id:"imp-156-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-04-10",accountId:"a2",templateId:null},
{id:"imp-157",type:"bill",name:"Mr Tire",amount:100,date:"2026-04-10",accountId:"a1",templateId:null},
{id:"imp-158",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-04-10",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-159",type:"transfer",name:"Transfer (Td)",amount:500,date:"2026-04-10",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-160",type:"bill",name:"Gas",amount:50,date:"2026-04-11",accountId:"a2",templateId:null},
{id:"imp-161",type:"expense",name:"Int",amount:112,date:"2026-04-11",accountId:"a2",templateId:null},
{id:"imp-162",type:"bill",name:"Affirm (auto)",amount:250,date:"2026-04-12",accountId:"a1",templateId:null},
{id:"imp-163",type:"bill",name:"Prosper",amount:400,date:"2026-04-12",accountId:"a1",templateId:null},
{id:"imp-164",type:"bill",name:"Carvana",amount:735,date:"2026-04-12",accountId:"a2",templateId:null},
{id:"imp-165",type:"bill",name:"Maint",amount:14,date:"2026-04-14",accountId:"a1",templateId:null},
{id:"imp-166",type:"bill",name:"Aidvantage",amount:40,date:"2026-04-15",accountId:"a1",templateId:null},
{id:"imp-167",type:"income",name:"Income deposit",amount:1070,date:"2026-04-17",accountId:"a1",templateId:null},
{id:"imp-167-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-04-17",accountId:"a2",templateId:null},
{id:"imp-168",type:"bill",name:"Power 2",amount:87,date:"2026-04-17",accountId:"a1",templateId:null},
{id:"imp-169",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-04-17",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-170",type:"income",name:"PFFCU transaction",amount:500,date:"2026-04-17",accountId:"a2",templateId:null},
{id:"imp-171",type:"expense",name:"Alam",amount:300,date:"2026-04-18",accountId:"a1",templateId:null},
{id:"imp-172",type:"bill",name:"Car Ins",amount:310,date:"2026-04-18",accountId:"a2",templateId:null},
{id:"imp-173",type:"bill",name:"Affirm C (auto)",amount:240,date:"2026-04-19",accountId:"a1",templateId:null},
{id:"imp-174",type:"transfer",name:"Transfer (Transfer)",amount:20,date:"2026-04-21",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-175",type:"bill",name:"Drive",amount:30,date:"2026-04-22",accountId:"a1",templateId:null},
{id:"imp-176",type:"bill",name:"Aidvantage",amount:40,date:"2026-04-22",accountId:"a1",templateId:null},
{id:"imp-177",type:"bill",name:"Affirm (auto)",amount:50,date:"2026-04-23",accountId:"a1",templateId:null},
{id:"imp-178",type:"expense",name:"Youtube",amount:85,date:"2026-04-23",accountId:"a2",templateId:null},
{id:"imp-179",type:"income",name:"Income deposit",amount:1070,date:"2026-04-24",accountId:"a1",templateId:null},
{id:"imp-179-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-04-24",accountId:"a2",templateId:null},
{id:"imp-180",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-04-24",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-181",type:"transfer",name:"Transfer (Td)",amount:500,date:"2026-04-24",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-182",type:"bill",name:"Gas",amount:50,date:"2026-04-25",accountId:"a2",templateId:null},
{id:"imp-183",type:"bill",name:"Goodleap (auto)",amount:160,date:"2026-04-26",accountId:"a1",templateId:null},
{id:"imp-184",type:"expense",name:"Ccmua",amount:95,date:"2026-04-27",accountId:"a1",templateId:null},
{id:"imp-185",type:"bill",name:"Chase",amount:300,date:"2026-04-28",accountId:"a1",templateId:null},
{id:"imp-186",type:"bill",name:"Aidvantage",amount:40,date:"2026-04-29",accountId:"a1",templateId:null},
{id:"imp-187",type:"bill",name:"Apple",amount:130,date:"2026-04-30",accountId:"a1",templateId:null},
{id:"imp-188",type:"income",name:"Income deposit",amount:1070,date:"2026-05-01",accountId:"a1",templateId:null},
{id:"imp-188-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-05-01",accountId:"a2",templateId:null},
{id:"imp-189",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-05-01",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-190",type:"transfer",name:"Transfer (Td)",amount:400,date:"2026-05-01",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-191",type:"bill",name:"Amex",amount:50,date:"2026-05-02",accountId:"a1",templateId:null},
{id:"imp-192",type:"bill",name:"Gas",amount:50,date:"2026-05-02",accountId:"a2",templateId:null},
{id:"imp-193",type:"expense",name:"Misc",amount:200,date:"2026-05-02",accountId:"a2",templateId:null},
{id:"imp-194",type:"bill",name:"Power 1",amount:312,date:"2026-05-03",accountId:"a1",templateId:null},
{id:"imp-195",type:"transfer",name:"Transfer (Pffcu)",amount:100,date:"2026-05-05",fromAccountId:"a2",toAccountId:"a1",templateId:null},
{id:"imp-196",type:"expense",name:"Greensky (auto)",amount:300,date:"2026-05-05",accountId:"a1",templateId:null},
{id:"imp-197",type:"expense",name:"Cwood",amount:158,date:"2026-05-06",accountId:"a1",templateId:null},
{id:"imp-198",type:"bill",name:"Aidvantage",amount:40,date:"2026-05-06",accountId:"a1",templateId:null},
{id:"imp-199",type:"transfer",name:"Transfer (Transfer)",amount:130,date:"2026-05-07",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-200",type:"income",name:"Income deposit",amount:1070,date:"2026-05-08",accountId:"a1",templateId:null},
{id:"imp-200-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-05-08",accountId:"a2",templateId:null},
{id:"imp-201",type:"transfer",name:"Transfer (Pffcu)",amount:700,date:"2026-05-08",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-202",type:"transfer",name:"Transfer (Td)",amount:700,date:"2026-05-08",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-203",type:"bill",name:"Verizon (auto)",amount:117,date:"2026-05-09",accountId:"a1",templateId:null},
{id:"imp-204",type:"bill",name:"T Mobile (auto)",amount:255,date:"2026-05-09",accountId:"a1",templateId:null},
{id:"imp-205",type:"bill",name:"Mr Tire",amount:70,date:"2026-05-10",accountId:"a1",templateId:null},
{id:"imp-206",type:"income",name:"Income deposit",amount:150,date:"2026-05-11",accountId:"a1",templateId:null},
{id:"imp-207",type:"expense",name:"Int",amount:112,date:"2026-05-11",accountId:"a2",templateId:null},
{id:"imp-208",type:"bill",name:"Affirm (auto)",amount:250,date:"2026-05-12",accountId:"a1",templateId:null},
{id:"imp-209",type:"bill",name:"Prosper",amount:400,date:"2026-05-12",accountId:"a1",templateId:null},
{id:"imp-210",type:"bill",name:"Carvana",amount:735,date:"2026-05-12",accountId:"a2",templateId:null},
{id:"imp-211",type:"bill",name:"Aidvantage",amount:40,date:"2026-05-13",accountId:"a1",templateId:null},
{id:"imp-212",type:"bill",name:"Maint",amount:14,date:"2026-05-14",accountId:"a1",templateId:null},
{id:"imp-213",type:"income",name:"Income deposit",amount:1050,date:"2026-05-15",accountId:"a1",templateId:null},
{id:"imp-213-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-05-15",accountId:"a2",templateId:null},
{id:"imp-214",type:"transfer",name:"Transfer (Pffcu)",amount:450,date:"2026-05-15",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-215",type:"transfer",name:"Transfer (Td)",amount:300,date:"2026-05-15",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-216",type:"expense",name:"Anatoliy",amount:300,date:"2026-05-16",accountId:"a1",templateId:null},
{id:"imp-217",type:"bill",name:"Gas",amount:50,date:"2026-05-16",accountId:"a2",templateId:null},
{id:"imp-218",type:"bill",name:"Power 2",amount:87,date:"2026-05-17",accountId:"a1",templateId:null},
{id:"imp-219",type:"bill",name:"Pseg",amount:110,date:"2026-05-18",accountId:"a1",templateId:null},
{id:"imp-220",type:"bill",name:"Affirm C (auto)",amount:240,date:"2026-05-19",accountId:"a1",templateId:null},
{id:"imp-221",type:"bill",name:"Amex",amount:100,date:"2026-05-20",accountId:"a1",templateId:null},
{id:"imp-222",type:"bill",name:"Aidvantage",amount:40,date:"2026-05-20",accountId:"a1",templateId:null},
{id:"imp-223",type:"income",name:"Income deposit",amount:1050,date:"2026-05-22",accountId:"a1",templateId:null},
{id:"imp-223-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-05-22",accountId:"a2",templateId:null},
{id:"imp-224",type:"bill",name:"Drive",amount:50,date:"2026-05-22",accountId:"a1",templateId:null},
{id:"imp-225",type:"transfer",name:"Transfer (Pffcu)",amount:450,date:"2026-05-22",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-226",type:"transfer",name:"Transfer (Td)",amount:200,date:"2026-05-22",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-227",type:"bill",name:"Affirm (auto)",amount:50,date:"2026-05-23",accountId:"a1",templateId:null},
{id:"imp-228",type:"bill",name:"Gas",amount:50,date:"2026-05-23",accountId:"a2",templateId:null},
{id:"imp-229",type:"expense",name:"Youtube",amount:85,date:"2026-05-23",accountId:"a2",templateId:null},
{id:"imp-230",type:"expense",name:"Hulu",amount:15,date:"2026-05-24",accountId:"a2",templateId:null},
{id:"imp-231",type:"bill",name:"Car Ins",amount:310,date:"2026-05-25",accountId:"a1",templateId:null},
{id:"imp-232",type:"bill",name:"Goodleap (auto)",amount:160,date:"2026-05-26",accountId:"a1",templateId:null},
{id:"imp-233",type:"bill",name:"Aidvantage",amount:40,date:"2026-05-27",accountId:"a1",templateId:null},
{id:"imp-234",type:"bill",name:"Chase",amount:300,date:"2026-05-28",accountId:"a1",templateId:null},
{id:"imp-235",type:"income",name:"Income deposit",amount:1050,date:"2026-05-29",accountId:"a1",templateId:null},
{id:"imp-235-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-05-29",accountId:"a2",templateId:null},
{id:"imp-236",type:"bill",name:"Apple",amount:124,date:"2026-05-30",accountId:"a1",templateId:null},
{id:"imp-237",type:"bill",name:"Gas",amount:50,date:"2026-05-30",accountId:"a2",templateId:null},
{id:"imp-238",type:"expense",name:"Joint",amount:1585,date:"2026-05-31",accountId:"a1",templateId:null},
{id:"imp-239",type:"income",name:"Income deposit",amount:351,date:"2026-06-03",accountId:"a1",templateId:null},
{id:"imp-240",type:"bill",name:"Power 1",amount:312,date:"2026-06-03",accountId:"a1",templateId:null},
{id:"imp-241",type:"bill",name:"Aidvantage",amount:40,date:"2026-06-03",accountId:"a1",templateId:null},
{id:"imp-242",type:"income",name:"Income deposit",amount:1050,date:"2026-06-05",accountId:"a1",templateId:null},
{id:"imp-242-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-06-05",accountId:"a2",templateId:null},
{id:"imp-243",type:"expense",name:"Joint",amount:200,date:"2026-06-05",accountId:"a1",templateId:null},
{id:"imp-244",type:"transfer",name:"Transfer (Pffcu)",amount:450,date:"2026-06-05",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-245",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-06-05",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-246",type:"bill",name:"Pseg",amount:110,date:"2026-06-06",accountId:"a1",templateId:null},
{id:"imp-247",type:"bill",name:"Ploc",amount:350,date:"2026-06-06",accountId:"a2",templateId:null},
{id:"imp-248",type:"bill",name:"Pffcu C",amount:75,date:"2026-06-06",accountId:"a2",templateId:null},
{id:"imp-249",type:"expense",name:"Cwood",amount:102,date:"2026-06-07",accountId:"a1",templateId:null},
{id:"imp-250",type:"bill",name:"M Affirm",amount:72,date:"2026-06-08",accountId:"a1",templateId:null},
{id:"imp-251",type:"bill",name:"Verizon (auto)",amount:117,date:"2026-06-09",accountId:"a1",templateId:null},
{id:"imp-252",type:"bill",name:"T Mobile (auto)",amount:230,date:"2026-06-09",accountId:"a1",templateId:null},
{id:"imp-253",type:"bill",name:"Mr Tire",amount:100,date:"2026-06-10",accountId:"a1",templateId:null},
{id:"imp-254",type:"bill",name:"Aidvantage",amount:40,date:"2026-06-10",accountId:"a1",templateId:null},
{id:"imp-255",type:"expense",name:"Haircut",amount:50,date:"2026-06-11",accountId:"a1",templateId:null},
{id:"imp-256",type:"income",name:"Ploc",amount:240,date:"2026-06-11",accountId:"a2",templateId:null},
{id:"imp-257",type:"income",name:"Income deposit",amount:1050,date:"2026-06-12",accountId:"a1",templateId:null},
{id:"imp-257-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-06-12",accountId:"a2",templateId:null},
{id:"imp-258",type:"bill",name:"Affirm (auto)",amount:250,date:"2026-06-12",accountId:"a1",templateId:null},
{id:"imp-259",type:"bill",name:"Prosper",amount:400,date:"2026-06-12",accountId:"a1",templateId:null},
{id:"imp-260",type:"transfer",name:"Transfer (Pffcu)",amount:450,date:"2026-06-12",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-261",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-06-12",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-262",type:"bill",name:"Carvana",amount:735,date:"2026-06-12",accountId:"a2",templateId:null},
{id:"imp-263",type:"transfer",name:"Transfer (Transfer)",amount:50,date:"2026-06-13",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-264",type:"bill",name:"Maint",amount:14,date:"2026-06-14",accountId:"a1",templateId:null},
{id:"imp-265",type:"bill",name:"Pseg",amount:220,date:"2026-06-15",accountId:"a1",templateId:null},
{id:"imp-266",type:"bill",name:"Power 2",amount:87,date:"2026-06-17",accountId:"a1",templateId:null},
{id:"imp-267",type:"bill",name:"Aidvantage",amount:40,date:"2026-06-17",accountId:"a1",templateId:null},
{id:"imp-268",type:"income",name:"Income deposit",amount:1050,date:"2026-06-19",accountId:"a1",templateId:null},
{id:"imp-268-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-06-19",accountId:"a2",templateId:null},
{id:"imp-269",type:"bill",name:"Affirm C (auto)",amount:240,date:"2026-06-19",accountId:"a1",templateId:null},
{id:"imp-270",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-06-19",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-271",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-06-19",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-272",type:"bill",name:"Walmart",amount:100,date:"2026-06-20",accountId:"a1",templateId:null},
{id:"imp-273",type:"transfer",name:"Transfer (Transfer)",amount:350,date:"2026-06-20",fromAccountId:"a2",toAccountId:"a1",templateId:null},
{id:"imp-274",type:"transfer",name:"Transfer (Transfer)",amount:280,date:"2026-06-21",fromAccountId:"a2",toAccountId:"a1",templateId:null},
{id:"imp-275",type:"bill",name:"Drive",amount:60,date:"2026-06-22",accountId:"a1",templateId:null},
{id:"imp-276",type:"bill",name:"Affirm (auto)",amount:50,date:"2026-06-23",accountId:"a1",templateId:null},
{id:"imp-277",type:"bill",name:"Aidvantage",amount:40,date:"2026-06-24",accountId:"a1",templateId:null},
{id:"imp-278",type:"bill",name:"Car Ins",amount:310,date:"2026-06-25",accountId:"a1",templateId:null},
{id:"imp-279",type:"income",name:"Income deposit",amount:1050,date:"2026-06-26",accountId:"a1",templateId:null},
{id:"imp-279-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-06-26",accountId:"a2",templateId:null},
{id:"imp-280",type:"bill",name:"Goodleap (auto)",amount:160,date:"2026-06-26",accountId:"a1",templateId:null},
{id:"imp-281",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-06-26",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-282",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-06-26",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-283",type:"expense",name:"Home I",amount:117,date:"2026-06-27",accountId:"a1",templateId:null},
{id:"imp-284",type:"expense",name:"Ww",amount:400,date:"2026-06-27",accountId:"a2",templateId:null},
{id:"imp-285",type:"bill",name:"Chase",amount:300,date:"2026-06-28",accountId:"a1",templateId:null},
{id:"imp-286",type:"bill",name:"Pffcu C",amount:100,date:"2026-06-28",accountId:"a2",templateId:null},
{id:"imp-287",type:"bill",name:"Mortgage",amount:800,date:"2026-06-29",accountId:"a1",templateId:null},
{id:"imp-288",type:"bill",name:"Apple",amount:140,date:"2026-06-30",accountId:"a1",templateId:null},
{id:"imp-289",type:"bill",name:"Aidvantage",amount:40,date:"2026-07-01",accountId:"a1",templateId:null},
{id:"imp-290",type:"bill",name:"Amex",amount:50,date:"2026-07-02",accountId:"a1",templateId:null},
{id:"imp-291",type:"income",name:"Income deposit",amount:1050,date:"2026-07-03",accountId:"a1",templateId:null},
{id:"imp-291-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-07-03",accountId:"a2",templateId:null},
{id:"imp-292",type:"bill",name:"Power 1",amount:312,date:"2026-07-03",accountId:"a1",templateId:null},
{id:"imp-293",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-07-03",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-294",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-07-03",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-295",type:"bill",name:"Pffcu C",amount:160,date:"2026-07-04",accountId:"a2",templateId:null},
{id:"imp-296",type:"bill",name:"Greensky",amount:200,date:"2026-07-05",accountId:"a1",templateId:null},
{id:"imp-297",type:"transfer",name:"Transfer (Transfer)",amount:50,date:"2026-07-06",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-298",type:"transfer",name:"Transfer (Transfer)",amount:100,date:"2026-07-07",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-299",type:"bill",name:"Aidvantage",amount:40,date:"2026-07-08",accountId:"a1",templateId:null},
{id:"imp-300",type:"bill",name:"Verizon (auto)",amount:117,date:"2026-07-09",accountId:"a1",templateId:null},
{id:"imp-301",type:"bill",name:"T Mobile (auto)",amount:235,date:"2026-07-09",accountId:"a1",templateId:null},
{id:"imp-302",type:"income",name:"Income deposit",amount:1050,date:"2026-07-10",accountId:"a1",templateId:null},
{id:"imp-302-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-07-10",accountId:"a2",templateId:null},
{id:"imp-303",type:"bill",name:"Mr Tire",amount:100,date:"2026-07-10",accountId:"a1",templateId:null},
{id:"imp-304",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-07-10",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-305",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-07-10",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-306",type:"bill",name:"Affirm (auto)",amount:250,date:"2026-07-12",accountId:"a1",templateId:null},
{id:"imp-307",type:"bill",name:"Prosper",amount:400,date:"2026-07-12",accountId:"a1",templateId:null},
{id:"imp-308",type:"bill",name:"Carvana",amount:735,date:"2026-07-12",accountId:"a2",templateId:null},
{id:"imp-309",type:"bill",name:"M Affirm",amount:75,date:"2026-07-13",accountId:"a1",templateId:null},
{id:"imp-310",type:"bill",name:"Maint",amount:14,date:"2026-07-14",accountId:"a1",templateId:null},
{id:"imp-311",type:"bill",name:"Amex",amount:20,date:"2026-07-15",accountId:"a1",templateId:null},
{id:"imp-312",type:"bill",name:"Aidvantage",amount:40,date:"2026-07-15",accountId:"a1",templateId:null},
{id:"imp-313",type:"expense",name:"PFFCU transaction",amount:55,date:"2026-07-16",accountId:"a2",templateId:null},
{id:"imp-314",type:"income",name:"Income deposit",amount:1050,date:"2026-07-17",accountId:"a1",templateId:null},
{id:"imp-314-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-07-17",accountId:"a2",templateId:null},
{id:"imp-315",type:"bill",name:"Power 2",amount:87,date:"2026-07-17",accountId:"a1",templateId:null},
{id:"imp-316",type:"bill",name:"Amex",amount:30,date:"2026-07-17",accountId:"a1",templateId:null},
{id:"imp-317",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-07-17",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-318",type:"income",name:"PFFCU transaction",amount:450,date:"2026-07-17",accountId:"a2",templateId:null},
{id:"imp-319",type:"expense",name:"PFFCU transaction",amount:350,date:"2026-07-18",accountId:"a2",templateId:null},
{id:"imp-320",type:"bill",name:"Affirm C (auto)",amount:240,date:"2026-07-19",accountId:"a1",templateId:null},
{id:"imp-321",type:"expense",name:"PFFCU transaction",amount:36,date:"2026-07-19",accountId:"a2",templateId:null},
{id:"imp-322",type:"bill",name:"Walmart",amount:200,date:"2026-07-20",accountId:"a1",templateId:null},
{id:"imp-323",type:"transfer",name:"Transfer (Transfer)",amount:100,date:"2026-07-21",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-324",type:"bill",name:"Drive",amount:75,date:"2026-07-22",accountId:"a1",templateId:null},
{id:"imp-325",type:"bill",name:"Aidvantage",amount:40,date:"2026-07-22",accountId:"a1",templateId:null},
{id:"imp-326",type:"bill",name:"Affirm (auto)",amount:50,date:"2026-07-23",accountId:"a1",templateId:null},
{id:"imp-327",type:"income",name:"Income deposit",amount:1050,date:"2026-07-24",accountId:"a1",templateId:null},
{id:"imp-327-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-07-24",accountId:"a2",templateId:null},
{id:"imp-328",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-07-24",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-329",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-07-24",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-330",type:"bill",name:"Car Ins",amount:310,date:"2026-07-25",accountId:"a1",templateId:null},
{id:"imp-331",type:"bill",name:"Pffcu C",amount:100,date:"2026-07-25",accountId:"a2",templateId:null},
{id:"imp-332",type:"bill",name:"Goodleap (auto)",amount:160,date:"2026-07-26",accountId:"a1",templateId:null},
{id:"imp-333",type:"bill",name:"Amex",amount:25,date:"2026-07-26",accountId:"a1",templateId:null},
{id:"imp-334",type:"income",name:"Income deposit",amount:300,date:"2026-07-27",accountId:"a1",templateId:null},
{id:"imp-335",type:"bill",name:"H Ins",amount:118,date:"2026-07-27",accountId:"a1",templateId:null},
{id:"imp-336",type:"transfer",name:"Transfer (Transfer)",amount:300,date:"2026-07-27",fromAccountId:"a2",toAccountId:"a1",templateId:null},
{id:"imp-337",type:"bill",name:"Chase",amount:280,date:"2026-07-28",accountId:"a1",templateId:null},
{id:"imp-338",type:"bill",name:"Mortgage",amount:600,date:"2026-07-29",accountId:"a1",templateId:null},
{id:"imp-339",type:"bill",name:"Aidvantage",amount:40,date:"2026-07-29",accountId:"a1",templateId:null},
{id:"imp-340",type:"income",name:"Income deposit",amount:1050,date:"2026-07-31",accountId:"a1",templateId:null},
{id:"imp-340-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-07-31",accountId:"a2",templateId:null},
{id:"imp-341",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-07-31",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-342",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-07-31",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-343",type:"income",name:"Income deposit",amount:150,date:"2026-08-01",accountId:"a1",templateId:null},
{id:"imp-344",type:"bill",name:"Affirm (auto)",amount:70,date:"2026-08-01",accountId:"a1",templateId:null},
{id:"imp-345",type:"transfer",name:"Transfer (Transfer)",amount:150,date:"2026-08-01",fromAccountId:"a2",toAccountId:"a1",templateId:null},
{id:"imp-346",type:"bill",name:"Apple",amount:130,date:"2026-08-02",accountId:"a1",templateId:null},
{id:"imp-347",type:"bill",name:"Power 1",amount:312,date:"2026-08-03",accountId:"a1",templateId:null},
{id:"imp-348",type:"bill",name:"Aidvantage",amount:40,date:"2026-08-04",accountId:"a1",templateId:null},
{id:"imp-349",type:"bill",name:"Greensky",amount:400,date:"2026-08-05",accountId:"a1",templateId:null},
{id:"imp-350",type:"expense",name:"Cwood",amount:230,date:"2026-08-06",accountId:"a1",templateId:null},
{id:"imp-351",type:"income",name:"Income deposit",amount:1050,date:"2026-08-07",accountId:"a1",templateId:null},
{id:"imp-351-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-08-07",accountId:"a2",templateId:null},
{id:"imp-352",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-08-07",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-353",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-08-07",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-354",type:"bill",name:"Verizon (auto)",amount:117,date:"2026-08-09",accountId:"a1",templateId:null},
{id:"imp-355",type:"bill",name:"T Mobile (auto)",amount:260,date:"2026-08-09",accountId:"a1",templateId:null},
{id:"imp-356",type:"bill",name:"Mr Tire",amount:100,date:"2026-08-10",accountId:"a1",templateId:null},
{id:"imp-357",type:"bill",name:"Affirm (auto)",amount:250,date:"2026-08-12",accountId:"a1",templateId:null},
{id:"imp-358",type:"bill",name:"Prosper",amount:400,date:"2026-08-12",accountId:"a1",templateId:null},
{id:"imp-359",type:"bill",name:"Carvana",amount:735,date:"2026-08-12",accountId:"a2",templateId:null},
{id:"imp-360",type:"bill",name:"Aidvantage",amount:40,date:"2026-08-13",accountId:"a1",templateId:null},
{id:"imp-361",type:"income",name:"Income deposit",amount:1050,date:"2026-08-14",accountId:"a1",templateId:null},
{id:"imp-361-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-08-14",accountId:"a2",templateId:null},
{id:"imp-362",type:"bill",name:"Maint",amount:14,date:"2026-08-14",accountId:"a1",templateId:null},
{id:"imp-363",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-08-14",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-364",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-08-14",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-365",type:"income",name:"Income deposit",amount:400,date:"2026-08-15",accountId:"a1",templateId:null},
{id:"imp-366",type:"bill",name:"M Affirm",amount:72,date:"2026-08-15",accountId:"a1",templateId:null},
{id:"imp-367",type:"expense",name:"Citi (auto)",amount:100,date:"2026-08-15",accountId:"a1",templateId:null},
{id:"imp-368",type:"transfer",name:"Transfer (Transfer)",amount:400,date:"2026-08-15",fromAccountId:"a2",toAccountId:"a1",templateId:null},
{id:"imp-369",type:"bill",name:"Power 2",amount:87,date:"2026-08-17",accountId:"a1",templateId:null},
{id:"imp-370",type:"bill",name:"Pseg",amount:220,date:"2026-08-18",accountId:"a1",templateId:null},
{id:"imp-371",type:"bill",name:"Affirm C (auto)",amount:240,date:"2026-08-19",accountId:"a1",templateId:null},
{id:"imp-372",type:"bill",name:"Aidvantage",amount:40,date:"2026-08-19",accountId:"a1",templateId:null},
{id:"imp-373",type:"bill",name:"Walmart",amount:200,date:"2026-08-20",accountId:"a1",templateId:null},
{id:"imp-374",type:"income",name:"Income deposit",amount:1050,date:"2026-08-21",accountId:"a1",templateId:null},
{id:"imp-374-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-08-21",accountId:"a2",templateId:null},
{id:"imp-375",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-08-21",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-376",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-08-21",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-377",type:"bill",name:"Drive",amount:100,date:"2026-08-22",accountId:"a1",templateId:null},
{id:"imp-378",type:"bill",name:"Pffcu C",amount:400,date:"2026-08-22",accountId:"a2",templateId:null},
{id:"imp-379",type:"bill",name:"Affirm (auto)",amount:50,date:"2026-08-23",accountId:"a1",templateId:null},
{id:"imp-380",type:"expense",name:"Citi",amount:200,date:"2026-08-23",accountId:"a1",templateId:null},
{id:"imp-381",type:"bill",name:"Ploc",amount:200,date:"2026-08-23",accountId:"a2",templateId:null},
{id:"imp-382",type:"bill",name:"Car Ins",amount:310,date:"2026-08-25",accountId:"a1",templateId:null},
{id:"imp-383",type:"bill",name:"Goodleap (auto)",amount:160,date:"2026-08-26",accountId:"a1",templateId:null},
{id:"imp-384",type:"bill",name:"Aidvantage",amount:40,date:"2026-08-26",accountId:"a1",templateId:null},
{id:"imp-385",type:"income",name:"Income deposit",amount:1050,date:"2026-08-28",accountId:"a1",templateId:null},
{id:"imp-385-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-08-28",accountId:"a2",templateId:null},
{id:"imp-386",type:"bill",name:"Chase",amount:300,date:"2026-08-28",accountId:"a1",templateId:null},
{id:"imp-387",type:"bill",name:"H Ins",amount:118,date:"2026-08-28",accountId:"a1",templateId:null},
{id:"imp-388",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-08-28",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-389",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-08-28",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-390",type:"income",name:"Income deposit",amount:400,date:"2026-08-29",accountId:"a1",templateId:null},
{id:"imp-391",type:"bill",name:"Mortgage",amount:800,date:"2026-08-29",accountId:"a1",templateId:null},
{id:"imp-392",type:"transfer",name:"Transfer (Transfer)",amount:200,date:"2026-08-29",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-393",type:"transfer",name:"Transfer (Transfer)",amount:400,date:"2026-08-29",fromAccountId:"a2",toAccountId:"a1",templateId:null},
{id:"imp-394",type:"bill",name:"Apple",amount:150,date:"2026-08-30",accountId:"a1",templateId:null},
{id:"imp-395",type:"bill",name:"Affirm (auto)",amount:70,date:"2026-09-01",accountId:"a1",templateId:null},
{id:"imp-396",type:"bill",name:"Amex",amount:100,date:"2026-09-02",accountId:"a1",templateId:null},
{id:"imp-397",type:"bill",name:"Aidvantage",amount:40,date:"2026-09-02",accountId:"a1",templateId:null},
{id:"imp-398",type:"bill",name:"Power 1",amount:312,date:"2026-09-03",accountId:"a1",templateId:null},
{id:"imp-399",type:"income",name:"Income deposit",amount:1050,date:"2026-09-04",accountId:"a1",templateId:null},
{id:"imp-399-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-09-04",accountId:"a2",templateId:null},
{id:"imp-400",type:"bill",name:"Pseg",amount:110,date:"2026-09-04",accountId:"a1",templateId:null},
{id:"imp-401",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-09-04",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-402",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-09-04",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-403",type:"bill",name:"Greensky",amount:200,date:"2026-09-05",accountId:"a1",templateId:null},
{id:"imp-404",type:"bill",name:"M Affirm",amount:72,date:"2026-09-07",accountId:"a1",templateId:null},
{id:"imp-405",type:"expense",name:"M Citi",amount:150,date:"2026-09-08",accountId:"a1",templateId:null},
{id:"imp-406",type:"bill",name:"Verizon (auto)",amount:117,date:"2026-09-09",accountId:"a1",templateId:null},
{id:"imp-407",type:"bill",name:"T Mobile (auto)",amount:260,date:"2026-09-09",accountId:"a1",templateId:null},
{id:"imp-408",type:"bill",name:"Mr Tire",amount:100,date:"2026-09-10",accountId:"a1",templateId:null},
{id:"imp-409",type:"bill",name:"Aidvantage",amount:40,date:"2026-09-10",accountId:"a1",templateId:null},
{id:"imp-410",type:"income",name:"Income deposit",amount:1050,date:"2026-09-11",accountId:"a1",templateId:null},
{id:"imp-410-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-09-11",accountId:"a2",templateId:null},
{id:"imp-411",type:"bill",name:"Pseg",amount:110,date:"2026-09-11",accountId:"a1",templateId:null},
{id:"imp-412",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-09-11",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-413",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-09-11",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-414",type:"bill",name:"Affirm (auto)",amount:250,date:"2026-09-12",accountId:"a1",templateId:null},
{id:"imp-415",type:"bill",name:"Prosper",amount:400,date:"2026-09-12",accountId:"a1",templateId:null},
{id:"imp-416",type:"bill",name:"Carvana",amount:735,date:"2026-09-12",accountId:"a2",templateId:null},
{id:"imp-417",type:"bill",name:"Maint",amount:14,date:"2026-09-14",accountId:"a1",templateId:null},
{id:"imp-418",type:"expense",name:"Citi (auto)",amount:100,date:"2026-09-15",accountId:"a1",templateId:null},
{id:"imp-419",type:"bill",name:"Aidvantage",amount:40,date:"2026-09-16",accountId:"a1",templateId:null},
{id:"imp-420",type:"bill",name:"Power 2",amount:87,date:"2026-09-17",accountId:"a1",templateId:null},
{id:"imp-421",type:"income",name:"Income deposit",amount:1050,date:"2026-09-18",accountId:"a1",templateId:null},
{id:"imp-421-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-09-18",accountId:"a2",templateId:null},
{id:"imp-422",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-09-18",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-423",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-09-18",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-424",type:"bill",name:"Affirm C (auto)",amount:240,date:"2026-09-19",accountId:"a1",templateId:null},
{id:"imp-425",type:"bill",name:"Pffcu C",amount:400,date:"2026-09-19",accountId:"a2",templateId:null},
{id:"imp-426",type:"bill",name:"Walmart",amount:200,date:"2026-09-20",accountId:"a1",templateId:null},
{id:"imp-427",type:"bill",name:"Ploc",amount:200,date:"2026-09-20",accountId:"a2",templateId:null},
{id:"imp-428",type:"bill",name:"Pseg",amount:110,date:"2026-09-21",accountId:"a1",templateId:null},
{id:"imp-429",type:"bill",name:"Drive",amount:100,date:"2026-09-22",accountId:"a1",templateId:null},
{id:"imp-430",type:"bill",name:"Affirm (auto)",amount:50,date:"2026-09-23",accountId:"a1",templateId:null},
{id:"imp-431",type:"bill",name:"Aidvantage",amount:40,date:"2026-09-23",accountId:"a1",templateId:null},
{id:"imp-432",type:"income",name:"Income deposit",amount:1050,date:"2026-09-25",accountId:"a1",templateId:null},
{id:"imp-432-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-09-25",accountId:"a2",templateId:null},
{id:"imp-433",type:"bill",name:"Car Ins",amount:310,date:"2026-09-25",accountId:"a1",templateId:null},
{id:"imp-434",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-09-25",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-435",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-09-25",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-436",type:"income",name:"Income deposit",amount:500,date:"2026-09-26",accountId:"a1",templateId:null},
{id:"imp-437",type:"bill",name:"Goodleap (auto)",amount:160,date:"2026-09-26",accountId:"a1",templateId:null},
{id:"imp-438",type:"transfer",name:"Transfer (Transfer)",amount:500,date:"2026-09-26",fromAccountId:"a2",toAccountId:"a1",templateId:null},
{id:"imp-439",type:"bill",name:"Pseg",amount:110,date:"2026-09-27",accountId:"a1",templateId:null},
{id:"imp-440",type:"bill",name:"H Ins",amount:120,date:"2026-09-27",accountId:"a1",templateId:null},
{id:"imp-441",type:"bill",name:"Chase",amount:300,date:"2026-09-28",accountId:"a1",templateId:null},
{id:"imp-442",type:"bill",name:"Mortgage",amount:800,date:"2026-09-29",accountId:"a1",templateId:null},
{id:"imp-443",type:"bill",name:"Apple",amount:150,date:"2026-09-30",accountId:"a1",templateId:null},
{id:"imp-444",type:"bill",name:"Affirm (auto)",amount:70,date:"2026-10-01",accountId:"a1",templateId:null},
{id:"imp-445",type:"income",name:"Income deposit",amount:1050,date:"2026-10-02",accountId:"a1",templateId:null},
{id:"imp-445-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-10-02",accountId:"a2",templateId:null},
{id:"imp-446",type:"bill",name:"Amex",amount:100,date:"2026-10-02",accountId:"a1",templateId:null},
{id:"imp-447",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-10-02",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-448",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-10-02",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-449",type:"bill",name:"Power 1",amount:312,date:"2026-10-03",accountId:"a1",templateId:null},
{id:"imp-450",type:"bill",name:"Pseg",amount:110,date:"2026-10-04",accountId:"a1",templateId:null},
{id:"imp-451",type:"bill",name:"Greensky",amount:200,date:"2026-10-05",accountId:"a1",templateId:null},
{id:"imp-452",type:"bill",name:"M Affirm",amount:72,date:"2026-10-07",accountId:"a1",templateId:null},
{id:"imp-453",type:"bill",name:"Aidvantage",amount:40,date:"2026-10-07",accountId:"a1",templateId:null},
{id:"imp-454",type:"income",name:"Income deposit",amount:1050,date:"2026-10-09",accountId:"a1",templateId:null},
{id:"imp-454-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-10-09",accountId:"a2",templateId:null},
{id:"imp-455",type:"bill",name:"Verizon (auto)",amount:117,date:"2026-10-09",accountId:"a1",templateId:null},
{id:"imp-456",type:"bill",name:"T Mobile (auto)",amount:260,date:"2026-10-09",accountId:"a1",templateId:null},
{id:"imp-457",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-10-09",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-458",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-10-09",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-459",type:"bill",name:"Mr Tire",amount:100,date:"2026-10-10",accountId:"a1",templateId:null},
{id:"imp-460",type:"bill",name:"Pseg",amount:110,date:"2026-10-11",accountId:"a1",templateId:null},
{id:"imp-461",type:"bill",name:"Prosper",amount:400,date:"2026-10-12",accountId:"a1",templateId:null},
{id:"imp-462",type:"bill",name:"Carvana",amount:735,date:"2026-10-12",accountId:"a2",templateId:null},
{id:"imp-463",type:"bill",name:"Maint",amount:14,date:"2026-10-14",accountId:"a1",templateId:null},
{id:"imp-464",type:"bill",name:"Aidvantage",amount:40,date:"2026-10-14",accountId:"a1",templateId:null},
{id:"imp-465",type:"expense",name:"Citi (auto)",amount:100,date:"2026-10-15",accountId:"a1",templateId:null},
{id:"imp-466",type:"income",name:"Income deposit",amount:1050,date:"2026-10-16",accountId:"a1",templateId:null},
{id:"imp-466-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-10-16",accountId:"a2",templateId:null},
{id:"imp-467",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-10-16",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-468",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-10-16",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-469",type:"bill",name:"Power 2",amount:87,date:"2026-10-17",accountId:"a1",templateId:null},
{id:"imp-470",type:"bill",name:"Pffcu C",amount:400,date:"2026-10-17",accountId:"a2",templateId:null},
{id:"imp-471",type:"bill",name:"Pseg",amount:110,date:"2026-10-18",accountId:"a1",templateId:null},
{id:"imp-472",type:"bill",name:"Ploc",amount:200,date:"2026-10-18",accountId:"a2",templateId:null},
{id:"imp-473",type:"bill",name:"Affirm C (auto)",amount:240,date:"2026-10-19",accountId:"a1",templateId:null},
{id:"imp-474",type:"bill",name:"Walmart",amount:200,date:"2026-10-20",accountId:"a1",templateId:null},
{id:"imp-475",type:"expense",name:"M Citi",amount:150,date:"2026-10-21",accountId:"a1",templateId:null},
{id:"imp-476",type:"bill",name:"Aidvantage",amount:40,date:"2026-10-21",accountId:"a1",templateId:null},
{id:"imp-477",type:"bill",name:"Drive",amount:100,date:"2026-10-22",accountId:"a1",templateId:null},
{id:"imp-478",type:"income",name:"Income deposit",amount:1050,date:"2026-10-23",accountId:"a1",templateId:null},
{id:"imp-478-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-10-23",accountId:"a2",templateId:null},
{id:"imp-479",type:"bill",name:"Affirm (auto)",amount:50,date:"2026-10-23",accountId:"a1",templateId:null},
{id:"imp-480",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-10-23",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-481",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-10-23",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-482",type:"income",name:"Income deposit",amount:350,date:"2026-10-24",accountId:"a1",templateId:null},
{id:"imp-483",type:"transfer",name:"Transfer (Transfer)",amount:350,date:"2026-10-24",fromAccountId:"a2",toAccountId:"a1",templateId:null},
{id:"imp-484",type:"bill",name:"Car Ins",amount:310,date:"2026-10-25",accountId:"a1",templateId:null},
{id:"imp-485",type:"bill",name:"H Ins",amount:120,date:"2026-10-25",accountId:"a1",templateId:null},
{id:"imp-486",type:"bill",name:"Goodleap (auto)",amount:160,date:"2026-10-26",accountId:"a1",templateId:null},
{id:"imp-487",type:"bill",name:"Pseg",amount:110,date:"2026-10-27",accountId:"a1",templateId:null},
{id:"imp-488",type:"bill",name:"Chase",amount:400,date:"2026-10-28",accountId:"a1",templateId:null},
{id:"imp-489",type:"bill",name:"Aidvantage",amount:40,date:"2026-10-28",accountId:"a1",templateId:null},
{id:"imp-490",type:"bill",name:"Mortgage",amount:800,date:"2026-10-29",accountId:"a1",templateId:null},
{id:"imp-491",type:"income",name:"Income deposit",amount:1050,date:"2026-10-30",accountId:"a1",templateId:null},
{id:"imp-491-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-10-30",accountId:"a2",templateId:null},
{id:"imp-492",type:"bill",name:"Apple",amount:150,date:"2026-10-30",accountId:"a1",templateId:null},
{id:"imp-493",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-10-30",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-494",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-10-30",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-495",type:"transfer",name:"Transfer (Transfer)",amount:200,date:"2026-10-31",fromAccountId:"a2",toAccountId:"a1",templateId:null},
{id:"imp-496",type:"bill",name:"Affirm (auto)",amount:70,date:"2026-11-01",accountId:"a1",templateId:null},
{id:"imp-497",type:"income",name:"Income deposit",amount:200,date:"2026-11-02",accountId:"a1",templateId:null},
{id:"imp-498",type:"bill",name:"Amex",amount:100,date:"2026-11-02",accountId:"a1",templateId:null},
{id:"imp-499",type:"bill",name:"Power 1",amount:312,date:"2026-11-03",accountId:"a1",templateId:null},
{id:"imp-500",type:"bill",name:"Pseg",amount:110,date:"2026-11-04",accountId:"a1",templateId:null},
{id:"imp-501",type:"bill",name:"Aidvantage",amount:40,date:"2026-11-04",accountId:"a1",templateId:null},
{id:"imp-502",type:"bill",name:"Greensky",amount:200,date:"2026-11-05",accountId:"a1",templateId:null},
{id:"imp-503",type:"income",name:"Income deposit",amount:1050,date:"2026-11-06",accountId:"a1",templateId:null},
{id:"imp-503-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-11-06",accountId:"a2",templateId:null},
{id:"imp-504",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-11-06",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-505",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-11-06",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-506",type:"bill",name:"M Affirm",amount:72,date:"2026-11-07",accountId:"a1",templateId:null},
{id:"imp-507",type:"bill",name:"Verizon (auto)",amount:117,date:"2026-11-09",accountId:"a1",templateId:null},
{id:"imp-508",type:"bill",name:"T Mobile (auto)",amount:260,date:"2026-11-09",accountId:"a1",templateId:null},
{id:"imp-509",type:"bill",name:"Mr Tire",amount:100,date:"2026-11-10",accountId:"a1",templateId:null},
{id:"imp-510",type:"bill",name:"Pseg",amount:110,date:"2026-11-11",accountId:"a1",templateId:null},
{id:"imp-511",type:"bill",name:"Aidvantage",amount:40,date:"2026-11-11",accountId:"a1",templateId:null},
{id:"imp-512",type:"bill",name:"Prosper",amount:400,date:"2026-11-12",accountId:"a1",templateId:null},
{id:"imp-513",type:"bill",name:"Carvana",amount:735,date:"2026-11-12",accountId:"a2",templateId:null},
{id:"imp-514",type:"income",name:"Income deposit",amount:1050,date:"2026-11-13",accountId:"a1",templateId:null},
{id:"imp-514-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-11-13",accountId:"a2",templateId:null},
{id:"imp-515",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-11-13",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-516",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-11-13",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-517",type:"bill",name:"Maint",amount:14,date:"2026-11-14",accountId:"a1",templateId:null},
{id:"imp-518",type:"bill",name:"Pffcu C",amount:400,date:"2026-11-14",accountId:"a2",templateId:null},
{id:"imp-519",type:"expense",name:"Citi (auto)",amount:100,date:"2026-11-15",accountId:"a1",templateId:null},
{id:"imp-520",type:"bill",name:"Ploc",amount:200,date:"2026-11-15",accountId:"a2",templateId:null},
{id:"imp-521",type:"bill",name:"Power 2",amount:87,date:"2026-11-17",accountId:"a1",templateId:null},
{id:"imp-522",type:"bill",name:"Pseg",amount:110,date:"2026-11-18",accountId:"a1",templateId:null},
{id:"imp-523",type:"bill",name:"Aidvantage",amount:40,date:"2026-11-18",accountId:"a1",templateId:null},
{id:"imp-524",type:"bill",name:"Affirm",amount:240,date:"2026-11-19",accountId:"a1",templateId:null},
{id:"imp-525",type:"income",name:"Income deposit",amount:1050,date:"2026-11-20",accountId:"a1",templateId:null},
{id:"imp-525-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-11-20",accountId:"a2",templateId:null},
{id:"imp-526",type:"bill",name:"Walmart",amount:200,date:"2026-11-20",accountId:"a1",templateId:null},
{id:"imp-527",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-11-20",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-528",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-11-20",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-529",type:"income",name:"Income deposit",amount:400,date:"2026-11-21",accountId:"a1",templateId:null},
{id:"imp-530",type:"bill",name:"Pseg",amount:110,date:"2026-11-21",accountId:"a1",templateId:null},
{id:"imp-531",type:"transfer",name:"Transfer (Transfer)",amount:400,date:"2026-11-21",fromAccountId:"a2",toAccountId:"a1",templateId:null},
{id:"imp-532",type:"bill",name:"Drive",amount:100,date:"2026-11-22",accountId:"a1",templateId:null},
{id:"imp-533",type:"bill",name:"Affirm (auto)",amount:50,date:"2026-11-23",accountId:"a1",templateId:null},
{id:"imp-534",type:"bill",name:"Car Ins",amount:310,date:"2026-11-25",accountId:"a1",templateId:null},
{id:"imp-535",type:"bill",name:"Aidvantage",amount:40,date:"2026-11-25",accountId:"a1",templateId:null},
{id:"imp-536",type:"bill",name:"Goodleap (auto)",amount:160,date:"2026-11-26",accountId:"a1",templateId:null},
{id:"imp-537",type:"bill",name:"H Ins",amount:120,date:"2026-11-26",accountId:"a1",templateId:null},
{id:"imp-538",type:"income",name:"Income deposit",amount:1050,date:"2026-11-27",accountId:"a1",templateId:null},
{id:"imp-538-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-11-27",accountId:"a2",templateId:null},
{id:"imp-539",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-11-27",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-540",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-11-27",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-541",type:"bill",name:"Chase",amount:300,date:"2026-11-28",accountId:"a1",templateId:null},
{id:"imp-542",type:"bill",name:"Mortgage",amount:800,date:"2026-11-29",accountId:"a1",templateId:null},
{id:"imp-543",type:"bill",name:"Apple",amount:150,date:"2026-11-30",accountId:"a1",templateId:null},
{id:"imp-544",type:"bill",name:"Affirm (auto)",amount:70,date:"2026-12-01",accountId:"a1",templateId:null},
{id:"imp-545",type:"bill",name:"Amex",amount:200,date:"2026-12-02",accountId:"a1",templateId:null},
{id:"imp-546",type:"bill",name:"Aidvantage",amount:40,date:"2026-12-02",accountId:"a1",templateId:null},
{id:"imp-547",type:"bill",name:"Power 1",amount:312,date:"2026-12-03",accountId:"a1",templateId:null},
{id:"imp-548",type:"income",name:"Income deposit",amount:1050,date:"2026-12-04",accountId:"a1",templateId:null},
{id:"imp-548-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-12-04",accountId:"a2",templateId:null},
{id:"imp-549",type:"bill",name:"Pseg",amount:110,date:"2026-12-04",accountId:"a1",templateId:null},
{id:"imp-550",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-12-04",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-551",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-12-04",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-552",type:"bill",name:"Greensky",amount:200,date:"2026-12-05",accountId:"a1",templateId:null},
{id:"imp-553",type:"bill",name:"M Affirm",amount:72,date:"2026-12-07",accountId:"a1",templateId:null},
{id:"imp-554",type:"bill",name:"Verizon (auto)",amount:117,date:"2026-12-09",accountId:"a1",templateId:null},
{id:"imp-555",type:"bill",name:"T Mobile (auto)",amount:260,date:"2026-12-09",accountId:"a1",templateId:null},
{id:"imp-556",type:"bill",name:"Mr Tire",amount:100,date:"2026-12-10",accountId:"a1",templateId:null},
{id:"imp-557",type:"income",name:"Income deposit",amount:1050,date:"2026-12-11",accountId:"a1",templateId:null},
{id:"imp-557-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-12-11",accountId:"a2",templateId:null},
{id:"imp-558",type:"bill",name:"Pseg",amount:110,date:"2026-12-11",accountId:"a1",templateId:null},
{id:"imp-559",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-12-11",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-560",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-12-11",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-561",type:"income",name:"Income deposit",amount:250,date:"2026-12-12",accountId:"a1",templateId:null},
{id:"imp-562",type:"bill",name:"Prosper",amount:400,date:"2026-12-12",accountId:"a1",templateId:null},
{id:"imp-563",type:"transfer",name:"Transfer (Transfer)",amount:250,date:"2026-12-12",fromAccountId:"a2",toAccountId:"a1",templateId:null},
{id:"imp-564",type:"bill",name:"Carvana",amount:735,date:"2026-12-12",accountId:"a2",templateId:null},
{id:"imp-565",type:"bill",name:"Maint",amount:14,date:"2026-12-14",accountId:"a1",templateId:null},
{id:"imp-566",type:"expense",name:"Citi (auto)",amount:100,date:"2026-12-15",accountId:"a1",templateId:null},
{id:"imp-567",type:"bill",name:"Aidvantage",amount:40,date:"2026-12-16",accountId:"a1",templateId:null},
{id:"imp-568",type:"bill",name:"Power 2",amount:87,date:"2026-12-17",accountId:"a1",templateId:null},
{id:"imp-569",type:"income",name:"Income deposit",amount:1050,date:"2026-12-18",accountId:"a1",templateId:null},
{id:"imp-569-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-12-18",accountId:"a2",templateId:null},
{id:"imp-570",type:"bill",name:"Affirm",amount:240,date:"2026-12-18",accountId:"a1",templateId:null},
{id:"imp-571",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-12-18",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-572",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-12-18",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-573",type:"bill",name:"Pseg",amount:110,date:"2026-12-19",accountId:"a1",templateId:null},
{id:"imp-574",type:"bill",name:"Pffcu C",amount:400,date:"2026-12-19",accountId:"a2",templateId:null},
{id:"imp-575",type:"bill",name:"Walmart",amount:200,date:"2026-12-20",accountId:"a1",templateId:null},
{id:"imp-576",type:"bill",name:"Ploc",amount:200,date:"2026-12-20",accountId:"a2",templateId:null},
{id:"imp-577",type:"bill",name:"Drive",amount:100,date:"2026-12-22",accountId:"a1",templateId:null},
{id:"imp-578",type:"bill",name:"Affirm (auto)",amount:50,date:"2026-12-23",accountId:"a1",templateId:null},
{id:"imp-579",type:"bill",name:"Aidvantage",amount:40,date:"2026-12-23",accountId:"a1",templateId:null},
{id:"imp-580",type:"income",name:"Income deposit",amount:1050,date:"2026-12-25",accountId:"a1",templateId:null},
{id:"imp-580-pf",type:"income",name:"Income deposit (PFFCU-X)",amount:450,date:"2026-12-25",accountId:"a2",templateId:null},
{id:"imp-581",type:"bill",name:"Car Ins",amount:310,date:"2026-12-25",accountId:"a1",templateId:null},
{id:"imp-582",type:"bill",name:"H Ins",amount:120,date:"2026-12-25",accountId:"a1",templateId:null},
{id:"imp-583",type:"transfer",name:"Transfer (Pffcu-X)",amount:450,date:"2026-12-25",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-584",type:"transfer",name:"Transfer (Td)",amount:450,date:"2026-12-25",fromAccountId:"a1",toAccountId:"a2",templateId:null},
{id:"imp-585",type:"bill",name:"Goodleap (auto)",amount:160,date:"2026-12-26",accountId:"a1",templateId:null},
{id:"imp-586",type:"bill",name:"Pseg",amount:110,date:"2026-12-27",accountId:"a1",templateId:null},
{id:"imp-587",type:"bill",name:"Chase",amount:400,date:"2026-12-28",accountId:"a1",templateId:null},
{id:"imp-588",type:"bill",name:"Mortgage",amount:800,date:"2026-12-29",accountId:"a1",templateId:null},
{id:"imp-589",type:"bill",name:"Apple",amount:150,date:"2026-12-30",accountId:"a1",templateId:null}
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function fmt(n) {
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.round(Math.abs(n)).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function fmtDateObj(d) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
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

const FREQUENCIES = {
  weekly: { label: "Weekly", months: 0 },
  monthly: { label: "Monthly", months: 1 },
  quarterly: { label: "Quarterly", months: 3 },
  yearly: { label: "Yearly", months: 12 },
};
const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function stepDue(date, tpl) {
  const freq = tpl.frequency || "monthly";
  if (freq === "weekly") return addDays(date, 7);
  const months = FREQUENCIES[freq] ? FREQUENCIES[freq].months : 1;
  return new Date(date.getFullYear(), date.getMonth() + months, tpl.day);
}

function nextDueFromToday(tpl) {
  const now = new Date();
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
  const last = new Date(logged[0].date + "T00:00:00");
  return stepDue(last, tpl);
}

function daysUntil(date) {
  const now = new Date();
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((b - a) / 86400000);
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, date.getDate());
}

const RANGES = {
  week: { label: "Week", end: (today) => addDays(today, 7) },
  month: { label: "Month", end: (today) => addMonths(today, 1) },
  quarter: { label: "Quarter", end: (today) => addMonths(today, 3) },
  year: { label: "Year", end: (today) => addMonths(today, 12) },
};

const CALENDAR_PERIODS = { week: "Week", month: "Month", quarter: "Quarter", year: "Year" };

function periodBounds(period, today) {
  if (period === "week") {
    const start = addDays(today, -today.getDay());
    const end = addDays(start, 6);
    return [start, end];
  }
  if (period === "month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return [start, end];
  }
  if (period === "quarter") {
    const q = Math.floor(today.getMonth() / 3);
    const start = new Date(today.getFullYear(), q * 3, 1);
    const end = new Date(today.getFullYear(), q * 3 + 3, 0);
    return [start, end];
  }
  const start = new Date(today.getFullYear(), 0, 1);
  const end = new Date(today.getFullYear(), 11, 31);
  return [start, end];
}

function periodLabel(period, start, end) {
  if (period === "week") return `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${end.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  if (period === "month") return start.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  if (period === "quarter") return `Q${Math.floor(start.getMonth() / 3) + 1} ${start.getFullYear()}`;
  return String(start.getFullYear());
}

function matchDebt(name, debts) {
  const n = name.toLowerCase();
  return debts.find((d) => d.name && (n.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(n)));
}

function quarterKey(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
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

export default function Ledger() {
  const [items, setItems] = useState(null);
  const [recurring, setRecurring] = useState(null);
  const [debts, setDebts] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [view, setView] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState(null);
  const [backupImportError, setBackupImportError] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearThroughDate, setClearThroughDate] = useState(() => toISODate(new Date()));
  const [clearFromDate, setClearFromDate] = useState(() => `${new Date().getFullYear()}-01-01`);
  const [githubConfig, setGithubConfig] = useState(null);
  const [githubConfigDraft, setGithubConfigDraft] = useState(null);
  const [githubPushStatus, setGithubPushStatus] = useState("idle");
  const [githubPushMessage, setGithubPushMessage] = useState(null);

  useEffect(() => {
    if (githubConfig && !githubConfigDraft) setGithubConfigDraft(githubConfig);
  }, [githubConfig]);
  const [trendsStart, setTrendsStart] = useState(`${new Date().getFullYear()}-01-01`);
  const [trendsEnd, setTrendsEnd] = useState(toISODate(new Date()));
  const [range, setRange] = useState("month");
  const [upcomingStatusFilter, setUpcomingStatusFilter] = useState("all");
  const [balancePeriod] = useState("year");
  const [ledgerPeriod, setLedgerPeriod] = useState("week");
  const [ledgerReferenceDate, setLedgerReferenceDate] = useState(null);
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
      try {
        const res5 = await window.storage.get("github_backup_config");
        setGithubConfig(res5 ? JSON.parse(res5.value) : { owner: "", repo: "", branch: "main", token: "" });
      } catch {
        setGithubConfig({ owner: "", repo: "", branch: "main", token: "" });
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

  const buildBackupPayload = () => ({
    app: "money-ledger",
    version: 1,
    exportedAt: new Date().toISOString(),
    transactions: items,
    accounts,
    recurring,
    debts,
  });

  const exportBackup = () => {
    const payload = buildBackupPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = toISODate(new Date());
    a.href = url;
    a.download = `money-ledger-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const saveGithubConfig = async () => {
    setGithubConfig(githubConfigDraft);
    try {
      await window.storage.set("github_backup_config", JSON.stringify(githubConfigDraft));
    } catch {
      setError("Couldn't save your GitHub connection settings.");
    }
  };

  const disconnectGithub = async () => {
    const cleared = { owner: "", repo: "", branch: "main", token: "" };
    setGithubConfig(cleared);
    setGithubConfigDraft(cleared);
    setGithubPushStatus("idle");
    setGithubPushMessage(null);
    try {
      await window.storage.set("github_backup_config", JSON.stringify(cleared));
    } catch {}
  };

  const utf8ToBase64 = (str) => {
    const bytes = new TextEncoder().encode(str);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
  };

  const pushBackupToGithub = async () => {
    if (!githubConfig || !githubConfig.owner || !githubConfig.repo || !githubConfig.token) {
      setGithubPushStatus("error");
      setGithubPushMessage("Fill in and save your repo owner, repo name, and token first.");
      return;
    }
    setGithubPushStatus("pushing");
    setGithubPushMessage(null);

    const { owner, repo, branch, token } = githubConfig;
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const path = `backups/money-ledger-backup-${stamp}.json`;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const payload = buildBackupPayload();
    const content = utf8ToBase64(JSON.stringify(payload, null, 2));

    try {
      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Money Ledger backup — ${new Date().toLocaleString()}`,
          content,
          branch: branch || "main",
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const reason = (data && data.message) || `HTTP ${res.status}`;
        setGithubPushStatus("error");
        setGithubPushMessage(
          res.status === 401
            ? "GitHub rejected the token. Check that it's still valid and has Contents write access."
            : res.status === 404
            ? "Repo not found — check the owner/repo spelling, or make sure the token can see this repo."
            : `GitHub error: ${reason}`
        );
        return;
      }

      setGithubPushStatus("success");
      setGithubPushMessage(`Pushed to ${owner}/${repo} at ${path}.`);
    } catch (e) {
      setGithubPushStatus("error");
      setGithubPushMessage("Couldn't reach GitHub. Check your connection and try again.");
    }
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

  const clearLedger = () => {
    mutateItems(items.filter((t) => !(t.date >= clearFromDate && t.date <= clearThroughDate)));
    setShowClearConfirm(false);
  };

  const clearLedgerPreviewCount = useMemo(() => {
    if (!items) return 0;
    return items.filter((t) => t.date >= clearFromDate && t.date <= clearThroughDate).length;
  }, [items, clearFromDate, clearThroughDate]);

  const accountBalances = useMemo(() => {
    if (!items || !accounts) return {};
    const todayStr = toISODate(new Date());
    const map = {};
    accounts.forEach((a) => (map[a.id] = a.opening));
    items.forEach((t) => {
      if (!isCounted(t) || t.date > todayStr) return;
      if (t.type === "transfer") {
        if (map[t.fromAccountId] === undefined) map[t.fromAccountId] = 0;
        if (map[t.toAccountId] === undefined) map[t.toAccountId] = 0;
        map[t.fromAccountId] -= t.amount;
        map[t.toAccountId] += t.amount;
      } else {
        if (map[t.accountId] === undefined) map[t.accountId] = 0;
        map[t.accountId] += TYPES[t.type].sign * t.amount;
      }
    });
    return map;
  }, [items, accounts]);

  const totalBalance = useMemo(() => Object.values(accountBalances).reduce((a, b) => a + b, 0), [accountBalances]);

  const periodBalances = useMemo(() => {
    if (!items || !accounts) return null;
    const today = new Date();
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
      const point = { date: dateStr, label: cur.toLocaleDateString(undefined, { month: "short", day: "numeric" }) };
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

  // For Quarter/Year, daily points create a lot of visual bulk, so downsample to one
  // point per week (Quarter) or per month (Year). Normally that's each bucket's last
  // value, since a balance is a point-in-time snapshot — but if any day in the bucket
  // dipped negative for a given account, that account's bucket keeps its worst day
  // instead, so a mid-month overdraft that recovered by month-end doesn't just vanish.
  const chartDisplayDataByAccount = useMemo(() => {
    const result = {};
    accounts.forEach((a) => {
      if ((balancePeriod !== "quarter" && balancePeriod !== "year") || rollingBalanceData.length === 0) {
        result[a.id] = rollingBalanceData;
        return;
      }
      const bucketSize = balancePeriod === "quarter" ? 7 : 30;
      const buckets = [];
      for (let i = 0; i < rollingBalanceData.length; i += bucketSize) {
        const slice = rollingBalanceData.slice(i, i + bucketSize);
        const negativeDays = slice.filter((d) => d[a.id] < 0);
        if (negativeDays.length > 0) {
          buckets.push(negativeDays.reduce((worst, d) => (d[a.id] < worst[a.id] ? d : worst), negativeDays[0]));
        } else {
          buckets.push(slice[slice.length - 1]);
        }
      }
      // Always keep the very last day so the chart's right edge matches the true period end.
      const last = rollingBalanceData[rollingBalanceData.length - 1];
      if (buckets[buckets.length - 1] !== last) buckets.push(last);
      result[a.id] = buckets;
    });
    return result;
  }, [rollingBalanceData, balancePeriod, accounts]);

  // Slider is a continuous 0-100 value mapped on a log scale to a 7-365 day window,
  // so Week/Month/Quarter/Year sit at meaningful, evenly-spaced snap positions rather
  // than clustering at one end of the track.
  const ZOOM_MIN_DAYS = 7;
  const ZOOM_MAX_DAYS = 365;
  const zoomValueToDays = (v) => Math.round(Math.exp(Math.log(ZOOM_MIN_DAYS) + (v / 100) * (Math.log(ZOOM_MAX_DAYS) - Math.log(ZOOM_MIN_DAYS))));
  const zoomDaysToValue = (d) => ((Math.log(d) - Math.log(ZOOM_MIN_DAYS)) / (Math.log(ZOOM_MAX_DAYS) - Math.log(ZOOM_MIN_DAYS))) * 100;

  const ZOOM_SNAP_POINTS = [
    { key: "week", label: "Week", days: 7 },
    { key: "month", label: "Month", days: 30 },
    { key: "quarter", label: "Quarter", days: 90 },
    { key: "year", label: "Year", days: 365 },
  ].map((s) => ({ ...s, value: zoomDaysToValue(s.days) }));
  const ZOOM_SNAP_THRESHOLD = 3;

  const [chartZoomValue, setChartZoomValue] = useState(100);
  const [zoomSnapNote, setZoomSnapNote] = useState(null);
  const [zoomSnapFading, setZoomSnapFading] = useState(false);
  const zoomNoteTimers = useRef([]);

  const showZoomSnapNote = (label) => {
    zoomNoteTimers.current.forEach((t) => clearTimeout(t));
    zoomNoteTimers.current = [];
    setZoomSnapNote(label);
    setZoomSnapFading(false);
    zoomNoteTimers.current.push(setTimeout(() => setZoomSnapFading(true), 900));
    zoomNoteTimers.current.push(setTimeout(() => setZoomSnapNote(null), 1250));
  };

  const applyZoomValue = (rawValue) => {
    const snap = ZOOM_SNAP_POINTS.find((s) => Math.abs(s.value - rawValue) <= ZOOM_SNAP_THRESHOLD);
    if (snap) {
      setChartZoomValue(snap.value);
      showZoomSnapNote(snap.label);
    } else {
      setChartZoomValue(rawValue);
    }
  };

  const todayRawIndex = useMemo(() => {
    const todayStr = toISODate(new Date());
    const idx = rollingBalanceData.findIndex((d) => d.date >= todayStr);
    return idx === -1 ? rollingBalanceData.length - 1 : idx;
  }, [rollingBalanceData]);

  const getZoomedChartData = (accountId) => {
    const windowDays = zoomValueToDays(chartZoomValue);
    const displayData = chartDisplayDataByAccount[accountId] || rollingBalanceData;
    if (windowDays >= rollingBalanceData.length) return displayData;
    // Zoomed views always use the raw daily series, even if the full view is downsampled,
    // so zooming in restores full day-by-day detail rather than staying at the coarser scale.
    const half = Math.floor(windowDays / 2);
    let start = Math.max(0, todayRawIndex - half);
    let end = Math.min(rollingBalanceData.length, start + windowDays);
    start = Math.max(0, end - windowDays);
    return rollingBalanceData.slice(start, end);
  };

  // Derived from whichever dataset is actually being rendered for that account, not a
  // shared coarser series — otherwise the label string it produces (e.g. from a downsampled
  // monthly bucket) won't match any point in a zoomed-in raw-daily view, and the reference
  // line silently fails to render at all.
  const getTodayChartLabel = (accountId) => {
    const data = getZoomedChartData(accountId);
    if (data.length === 0) return null;
    const todayStr = toISODate(new Date());
    const entry = data.find((d) => d.date >= todayStr) || data[data.length - 1];
    return entry ? entry.label : null;
  };

  const handleChartWheelZoom = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -4 : 4;
    applyZoomValue(Math.min(100, Math.max(0, chartZoomValue + delta)));
  };

  const [chartDrillTarget, setChartDrillTarget] = useState(null);
  const chartPressTimer = useRef(null);

  const goToTransactionInLedger = (t) => {
    const targetAccountId = t.type === "transfer" ? t.fromAccountId : t.accountId;
    setLedgerAccountFilter(targetAccountId || "all");
    setLedgerReferenceDate(t.date);
    setLedgerPeriod("month");
    setChartDrillTarget(null);
    setView("ledger");
  };

  const openChartDrill = (accountId, payload) => {
    const date = payload.date;
    const forAccount = (t) => {
      if (t.type === "transfer") return t.fromAccountId === accountId || t.toAccountId === accountId;
      return t.accountId === accountId;
    };
    const matches = items.filter((t) => t.date === date && forAccount(t));

    let nearest = null;
    if (matches.length === 0) {
      // The balance carried over unchanged, so find whichever real transaction actually
      // set it — the most recent one on or before this date, or if the account has no
      // history yet at this point, the very next one after it.
      const accountItems = items.filter(forAccount).sort(byDateAsc);
      const before = [...accountItems].filter((t) => t.date <= date).sort(byDateDesc)[0];
      const after = accountItems.find((t) => t.date > date);
      nearest = before || after || null;
    }

    setChartDrillTarget({ date, accountId, matches, nearest });
  };

  const startChartDotPress = (accountId, payload) => {
    if (chartPressTimer.current) clearTimeout(chartPressTimer.current);
    chartPressTimer.current = setTimeout(() => {
      openChartDrill(accountId, payload);
      chartPressTimer.current = null;
    }, 550);
  };

  const cancelChartDotPress = () => {
    if (chartPressTimer.current) {
      clearTimeout(chartPressTimer.current);
      chartPressTimer.current = null;
    }
  };

  const renderChartTooltip = (accountId) => {
    const ChartTooltip = ({ active, payload, label }) => {
      if (!active || !payload || !payload.length) return null;
      const point = payload[0].payload;
      const value = point[accountId];
      return (
        <div
          onTouchStart={(e) => {
            e.preventDefault();
            startChartDotPress(accountId, point);
          }}
          onTouchEnd={cancelChartDotPress}
          onTouchMove={cancelChartDotPress}
          onTouchCancel={cancelChartDotPress}
          onMouseDown={() => startChartDotPress(accountId, point)}
          onMouseUp={cancelChartDotPress}
          onMouseLeave={cancelChartDotPress}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            fontSize: 11,
            border: `1px solid ${LINE}`,
            borderRadius: 6,
            background: SURFACE,
            color: TEXT,
            padding: "0.4rem 0.55rem",
            cursor: "pointer",
            userSelect: "none",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
            touchAction: "none",
          }}
        >
          <div style={{ color: TEXT, marginBottom: 2 }}>{label}</div>
          <div style={{ color: accountColorFor(accountId, accounts) }}>
            {accountName(accountId)} : {fmt(value)}
          </div>
          <div style={{ color: MUTED, fontSize: 9.5, marginTop: 3 }}>Hold to see the transaction</div>
        </div>
      );
    };
    return <ChartTooltip />;
  };

  const completedBalanceByItemId = useMemo(() => {
    if (!items || !accounts) return {};
    const todayStr = toISODate(new Date());
    const running = {};
    accounts.forEach((a) => (running[a.id] = a.opening));
    const sorted = [...items].sort(byDateAsc);
    const map = {};
    sorted.forEach((t) => {
      if (!isCounted(t) || getStatus(t, todayStr) !== "complete") return;
      if (t.type === "transfer") {
        if (running[t.fromAccountId] === undefined) running[t.fromAccountId] = 0;
        if (running[t.toAccountId] === undefined) running[t.toAccountId] = 0;
        running[t.fromAccountId] -= t.amount;
        running[t.toAccountId] += t.amount;
        map[t.id] = running[t.fromAccountId];
      } else {
        if (running[t.accountId] === undefined) running[t.accountId] = 0;
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
    const today = new Date();
    const todayStr = toISODate(today);
    const [periodStart, periodEnd] = periodBounds(range, today);
    const windowStartStr = toISODate(periodStart);
    const windowEndStr = toISODate(periodEnd);

    // Baseline: balance as of the day before the selected period starts.
    const baseline = {};
    accounts.forEach((a) => (baseline[a.id] = a.opening));
    for (const t of items) {
      if (t.date >= windowStartStr || !isCounted(t)) continue;
      if (t.type === "transfer") {
        baseline[t.fromAccountId] = (baseline[t.fromAccountId] || 0) - t.amount;
        baseline[t.toAccountId] = (baseline[t.toAccountId] || 0) + t.amount;
      } else {
        baseline[t.accountId] = (baseline[t.accountId] || 0) + TYPES[t.type].sign * t.amount;
      }
    }

    // Everything in the selected calendar period, start through end — the whole data source.
    // No hidden extra filtering beyond what the Week/Month/Quarter/Year selection itself implies.
    const windowItems = items.filter((t) => t.date >= windowStartStr && t.date <= windowEndStr).sort(byDateAsc);

    // Walk forward through every item in the window (regardless of status) so the running balance stays realistic.
    const running = { ...baseline };
    const lowest = {};
    accounts.forEach((a) => (lowest[a.id] = { balance: baseline[a.id], date: windowStartStr }));

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

    // Status filter applied last, after balances are computed, so both the list and the totals below genuinely reflect the current selection.
    const rows = upcomingStatusFilter === "all" ? withBalances : withBalances.filter((t) => getStatus(t, todayStr) === upcomingStatusFilter);

    const totals = { income: 0, outflow: 0 };
    for (const t of rows) {
      if (!isCounted(t)) continue;
      if (t.type === "income") totals.income += t.amount;
      else if (t.type !== "transfer") totals.outflow += t.amount;
    }

    const anyNegative = Object.values(lowest).some((l) => l.balance < 0);

    return { rows, totals, lowest, anyNegative };
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
        outflowChange: prev ? q.outflow - prev.outflow : null,
      };
    });
  }, [items]);

  const trendsData = useMemo(() => {
    if (!items || !trendsStart || !trendsEnd || trendsStart > trendsEnd) return { buckets: [], total: 0, avg: 0, peak: null };

    const inRange = items.filter((t) => t.type !== "income" && t.type !== "transfer" && isCounted(t) && t.date >= trendsStart && t.date <= trendsEnd);

    const startDate = new Date(trendsStart + "T00:00:00");
    const endDate = new Date(trendsEnd + "T00:00:00");
    const spanDays = Math.round((endDate - startDate) / 86400000) + 1;
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
          label: cursor.toLocaleDateString(undefined, { month: "short", year: "2-digit" }),
          start: toISODate(cursor),
          end: toISODate(bucketEnd),
          total: 0,
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
    const peak = buckets.reduce((max, b) => (!max || b.total > max.total ? b : max), null);

    return { buckets, total, avg, peak, byWeek };
  }, [items, trendsStart, trendsEnd]);

  const projection = useMemo(() => {
    if (!items || !debts || quarterlyData.length === 0) return null;
    const today = new Date();
    const curKey = quarterKeyFromDate(today);
    const [cy, cq] = curKey.split("-Q").map(Number);
    const nextQ = (cq % 4) + 1;
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
    const names = new Set([...Object.keys(curLabels), ...Object.keys(nextLabels)]);
    const diffs = [...names]
      .map((name) => ({ name, cur: curLabels[name] || 0, next: nextLabels[name] || 0, diff: (nextLabels[name] || 0) - (curLabels[name] || 0) }))
      .filter((d) => d.diff !== 0);
    diffs.sort((a, b) => b.diff - a.diff);
    const increases = diffs
      .filter((d) => d.diff > 0)
      .slice(0, 3)
      .map((d) => ({ ...d, debt: matchDebt(d.name, debts) }));
    const decreases = diffs.filter((d) => d.diff < 0).slice(0, 2);

    return {
      curKey,
      nextKey,
      cur,
      next,
      incomeVariance: next.income - cur.income,
      outflowVariance: next.outflow - cur.outflow,
      increases,
      decreases,
    };
  }, [items, quarterlyData, debts]);

  const sortedDebts = useMemo(() => {
    if (!debts) return [];
    return [...debts].sort((a, b) => b.apr - a.apr || b.balance - a.balance);
  }, [debts]);

  const debtSummary = useMemo(() => {
    if (!debts) return { totalBalance: 0, monthlyInterest: 0, weightedApr: 0 };
    const totalBalance = debts.reduce((s, d) => s + d.balance, 0);
    const monthlyInterest = debts.reduce((s, d) => s + (d.balance * (d.apr / 100)) / 12, 0);
    const weightedApr = totalBalance > 0 ? debts.reduce((s, d) => s + d.balance * d.apr, 0) / totalBalance : 0;
    return { totalBalance, monthlyInterest, weightedApr };
  }, [debts]);

  const yearlyData = useMemo(() => {
    if (!items)
      return {
        currentYear: String(new Date().getFullYear()),
        currentQuarterKey: quarterKeyFromDate(new Date()),
        currentQuarterItems: [],
        currentQuarterPastCount: 0,
        currentWeekTodayIndex: 0,
        priorQuarterStatements: [],
        pastYears: [],
      };
    const currentYear = String(new Date().getFullYear());
    const currentQuarterKey = quarterKeyFromDate(new Date());
    const byYear = {};
    items.forEach((t) => {
      const y = t.date.slice(0, 4);
      if (!byYear[y]) byYear[y] = [];
      byYear[y].push(t);
    });

    const thisYearItems = byYear[currentYear] || [];
    const today = new Date();
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
    const priorQuarterStatements = Object.keys(priorQuarterMap)
      .sort((a, b) => b.localeCompare(a))
      .map((qk) => {
        const qItems = priorQuarterMap[qk].sort(byDateAsc);
        const totals = qItems.reduce(
          (acc, t) => {
            if (!isCounted(t)) return acc;
            if (t.type === "income") acc.income += t.amount;
            else if (t.type === "transfer") acc.transfers += t.amount;
            else acc.outflow += t.amount;
            return acc;
          },
          { income: 0, outflow: 0, transfers: 0 }
        );
        return { key: qk, items: qItems, ...totals, net: totals.income - totals.outflow, count: qItems.length };
      });

    const pastYears = Object.keys(byYear)
      .filter((y) => y !== currentYear)
      .sort((a, b) => b.localeCompare(a))
      .map((y) => {
        const yItems = byYear[y].sort(byDateAsc);
        const totals = yItems.reduce(
          (acc, t) => {
            if (!isCounted(t)) return acc;
            if (t.type === "income") acc.income += t.amount;
            else if (t.type === "transfer") acc.transfers += t.amount;
            else acc.outflow += t.amount;
            return acc;
          },
          { income: 0, outflow: 0, transfers: 0 }
        );
        return { year: y, items: yItems, ...totals, net: totals.income - totals.outflow, count: yItems.length };
      });

    const todayIndex = currentQuarterThisWeekForward.findIndex((t) => t.date >= todayStr);
    return {
      currentYear,
      currentQuarterKey,
      currentQuarterItems,
      currentQuarterPastCount: currentQuarterBeforeWeek.length,
      currentWeekTodayIndex: todayIndex === -1 ? currentQuarterThisWeekForward.length : todayIndex,
      priorQuarterStatements,
      pastYears,
    };
  }, [items]);

  const ledgerPeriodItems = useMemo(() => {
    if (!items) return { items: [], start: new Date(), end: new Date(), todayIndex: 0, label: "" };
    const today = new Date();
    const windowAnchor = ledgerReferenceDate ? new Date(ledgerReferenceDate) : today;
    const [start, end] = periodBounds(ledgerPeriod, windowAnchor);
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
      label: periodLabel(ledgerPeriod, start, end),
    };
  }, [items, ledgerPeriod, ledgerAccountFilter, ledgerReferenceDate]);

  const chartData = [
    { name: "Income", value: totals.income, key: "income" },
    { name: "Bills", value: totals.bill, key: "bill" },
    { name: "Expenses", value: totals.expense, key: "expense" },
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
    const today = new Date();
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
      toAccountId: accounts[1] ? accounts[1].id : accounts[0].id,
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
        weekday: parseInt(form.weekday, 10),
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
    const todayStr = toISODate(new Date());
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
    const todayStr = toISODate(new Date());
    const currentYear = String(new Date().getFullYear());
    const matches = items
      .filter((x) => x.type === t.type && x.name.toLowerCase() === t.name.toLowerCase() && x.date >= todayStr && x.date.slice(0, 4) === currentYear)
      .sort(byDateAsc);
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
        type: patch.type,
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
    const next = items.map((x) => (x.id === id ? { ...x, amount: amt > 0 ? amt : x.amount, accountId: accountId || x.accountId } : x));
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

  const cleanupCutoff = `${new Date().getFullYear()}-07-01`;
  const cleanupCount = useMemo(() => (items ? items.filter((t) => t.date < cleanupCutoff).length : 0), [items, cleanupCutoff]);

  const removeBeforeCutoff = () => {
    mutateItems(items.filter((t) => t.date >= cleanupCutoff));
    setShowCleanupConfirm(false);
  };

  const duplicateTransfersPreview = useMemo(() => {
    if (!items) return { removed: 0, examples: [] };
    const seen = new Map();
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
    const seen = new Set();
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
    const next = accounts.map((a) => (a.id === id ? { ...a, name: name.trim() || a.name, opening: parseInt(opening, 10) || 0 } : a));
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
    const next = recurring.map((r) =>
      r.id === id
        ? {
            ...r,
            name: name.trim() || r.name,
            amount: parseInt(amount, 10) || r.amount,
            accountId,
            frequency: frequency || "monthly",
            day: parseInt(day, 10) || r.day,
            weekday: parseInt(weekday, 10),
          }
        : r
    );
    persistRecurring(next);
    setEditRecurring(null);
  };

  const deleteRecurring = (id) => {
    persistRecurring(recurring.filter((r) => r.id !== id));
    setEditRecurring(null);
  };

  const openAddRecurring = (defaultType = "bill") => {
    const today = new Date();
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
      weekday: parseInt(recurringForm.weekday, 10) || 0,
    };
    persistRecurring([...recurring, template]);
    setShowAddRecurring(false);
  };

  const syncExpensesPreview = useMemo(() => {
    if (!items || !recurring) return { removed: 0, added: 0 };
    const todayStr = toISODate(new Date());
    const yearEnd = `${new Date().getFullYear()}-12-31`;
    const scoped = recurring.filter((r) => (syncScope === "income" ? r.type === "income" : r.type !== "income"));
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
    const todayStr = toISODate(new Date());
    const yearEnd = `${new Date().getFullYear()}-12-31`;
    const scoped = recurring.filter((r) => (syncScope === "income" ? r.type === "income" : r.type !== "income"));
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
    const next = debts.map((d) => (d.id === id ? { ...d, name: name.trim() || d.name, balance: parseInt(balance, 10) || 0, apr: parseFloat(apr) || 0 } : d));
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
      const thumbHeight = Math.max(32, (trackHeight / contentHeight) * trackHeight);
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
    const scrollDelta = scrollableTrack > 0 ? (deltaY / scrollableTrack) * maxScroll : 0;
    window.scrollTo(0, scrollDragRef.current.startScrollY + scrollDelta);
    updateScrollThumb();
  };
  const endThumbDrag = () => {
    scrollDragRef.current.dragging = false;
  };

  if (items === null || accounts === null || recurring === null || debts === null) {
    return (
      <div style={{ fontFamily: "-apple-system, sans-serif", color: MUTED, padding: "3rem 1rem", textAlign: "center", background: BG }}>
        Loading your ledger…
      </div>
    );
  }

  return (
    <div style={{ position: "relative", maxWidth: 420, margin: "0 auto", background: BG, minHeight: 600 }}>
      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", background: BG, color: TEXT, padding: "0 10px" }}>
      <div style={{ background: HEADER, color: HEADER_TEXT, padding: "calc(0.65rem + env(safe-area-inset-top, 0px)) 1.25rem 0.65rem", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{ background: "none", border: "none", color: HEADER_TEXT, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", marginRight: 8 }}
          >
            <Menu size={18} />
          </button>
          <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 19, fontWeight: 600 }}>{fmt(totalBalance)}</span>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 10 }}>
            {accounts.map((a) => (
              <button
                key={a.id}
                onClick={() => setEditAccount(a)}
                style={{ display: "flex", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", color: HEADER_TEXT, padding: 0 }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: accountColorFor(a.id, accounts) }} />
                <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12.5, fontWeight: 600 }}>{fmt(accountBalances[a.id] || 0)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ height: 10, backgroundImage: `radial-gradient(circle at 6px 0px, ${BG} 5px, transparent 5.5px)`, backgroundSize: "16px 10px", backgroundColor: HEADER }} />

      {["config-expenses", "config-income", "config-accounts", "quarterly", "trends", "ledger", "debts", "backup"].includes(view) ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.85rem 1.25rem", borderBottom: `1px solid ${LINE}` }}>
          <button onClick={() => setView("overview")} aria-label="Back" style={{ background: "none", border: "none", color: TEXT, cursor: "pointer", display: "flex", alignItems: "center" }}>
            <ArrowLeft size={18} />
          </button>
          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>
            {
              {
                "config-expenses": "Configuration · Expenses",
                "config-income": "Configuration · Income",
                "config-accounts": "Configuration · Accounts",
                quarterly: "Quarterly Statements",
                trends: "Expenses Over Time",
                ledger: "Ledger",
                debts: "Debts",
                backup: "Backup & Restore",
              }[view]
            }
          </div>
        </div>
      ) : null}

      <div style={{ padding: "1.1rem 1.25rem 7rem" }}>
        {error && <div style={{ fontSize: 12, color: DEBIT, marginBottom: 12 }}>{error}</div>}

        {view === "overview" && (
          <>
            <div style={{ marginBottom: 24 }}>
              <SectionLabel icon={<TrendingUp size={13} />} text="Rolling balance" />

              {periodBalances && <div style={{ fontSize: 11.5, color: MUTED, marginTop: 8, marginBottom: 8 }}>{periodBalances.label}</div>}

              {rollingBalanceData.length === 0 ? (
                <EmptyNote>No activity logged in this period yet.</EmptyNote>
              ) : (
                <div style={{ display: "flex", gap: 6 }}>
                  <div
                    onWheel={handleChartWheelZoom}
                    style={{ flex: 1, minWidth: 0, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.6rem 0.4rem 0.4rem 0.5rem" }}
                  >
                    {accounts.map((a, idx) => {
                      const isLast = idx === accounts.length - 1;
                      const accountChartData = getZoomedChartData(a.id);
                      const accountTodayLabel = getTodayChartLabel(a.id);
                      const lineWidth = accountChartData.length > 180 ? 1.1 : accountChartData.length > 60 ? 1.4 : 1.75;
                      return (
                        <div key={a.id} style={{ marginBottom: isLast ? 0 : 2, borderLeft: `2px solid ${accountColorFor(a.id, accounts)}`, paddingLeft: 6 }}>
                          <div style={{ height: 68 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={accountChartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                                <CartesianGrid stroke={LINE} strokeDasharray="2 4" vertical horizontal strokeOpacity={0.5} />
                                <XAxis
                                  dataKey="label"
                                  tick={isLast ? { fontSize: 8.5, fill: MUTED } : false}
                                  axisLine={false}
                                  tickLine={false}
                                  height={isLast ? 16 : 1}
                                  interval={accountChartData.length > 8 ? Math.ceil(accountChartData.length / 8) - 1 : 0}
                                />
                                <YAxis tick={{ fontSize: 7.5, fill: MUTED }} axisLine={false} tickLine={false} width={30} tickFormatter={(v) => fmt(v)} tickCount={3} domain={["auto", "auto"]} />
                                <ReferenceLine y={0} stroke={DEBIT} strokeDasharray="3 3" />
                                {accountTodayLabel && <ReferenceLine x={accountTodayLabel} stroke={GOLD} strokeWidth={1.5} label={isLast ? { value: "Today", position: "insideTopRight", fill: GOLD, fontSize: 9, fontWeight: 700 } : undefined} />}
                                <Tooltip content={renderChartTooltip(a.id)} wrapperStyle={{ pointerEvents: "auto" }} />
                                <Line
                                  dataKey={a.id}
                                  name={a.name}
                                  stroke={accountColorFor(a.id, accounts)}
                                  strokeWidth={lineWidth}
                                  dot={(props) => {
                                    const neg = props.payload[a.id] < 0;
                                    const key = `d-${a.id}-${props.index}`;
                                    return neg ? <circle key={key} cx={props.cx} cy={props.cy} r={2.5} fill={DEBIT} stroke="none" /> : <circle key={key} r={0} />;
                                  }}
                                  isAnimationActive={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      );
                    })}
                    <div style={{ position: "relative", marginTop: 8, paddingTop: 8, borderTop: `1px dashed ${LINE}` }}>
                      {zoomSnapNote && (
                        <div
                          style={{
                            position: "absolute",
                            top: -22,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: SURFACE_2,
                            border: `1px solid ${GOLD}`,
                            borderRadius: 999,
                            padding: "0.15rem 0.6rem",
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: GOLD,
                            whiteSpace: "nowrap",
                            opacity: zoomSnapFading ? 0 : 1,
                            transition: "opacity 350ms ease",
                            pointerEvents: "none",
                          }}
                        >
                          {zoomSnapNote}
                        </div>
                      )}
                      <div style={{ position: "relative", height: 18, display: "flex", alignItems: "center" }}>
                        {ZOOM_SNAP_POINTS.map((s) => (
                          <div key={s.key} style={{ position: "absolute", left: `${s.value}%`, top: 3, width: 2, height: 8, background: LINE, borderRadius: 1, transform: "translateX(-1px)", pointerEvents: "none" }} />
                        ))}
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={0.5}
                          value={chartZoomValue}
                          onChange={(e) => applyZoomValue(Number(e.target.value))}
                          style={{ width: "100%", accentColor: GOLD, position: "relative", zIndex: 1 }}
                          aria-label="Zoom both charts"
                        />
                      </div>
                      <div style={{ position: "relative", height: 12, marginTop: 2 }}>
                        {ZOOM_SNAP_POINTS.map((s) => (
                          <span
                            key={s.key}
                            style={{
                              position: "absolute",
                              left: `${s.value}%`,
                              transform: s.value <= 2 ? "none" : s.value >= 98 ? "translateX(-100%)" : "translateX(-50%)",
                              fontSize: 9,
                              color: MUTED,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {s.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: 24 }}>
              <SectionLabel icon={<Clock size={13} />} text="This Period" />
              <div style={{ display: "flex", gap: 6, marginTop: 8, marginBottom: 10 }}>
                {Object.entries(RANGES).map(([key, r]) => (
                  <button
                    key={key}
                    onClick={() => setRange(key)}
                    style={{
                      flex: 1,
                      padding: "0.35rem 0",
                      borderRadius: 999,
                      border: `1px solid ${range === key ? GOLD : LINE}`,
                      background: range === key ? GOLD : SURFACE,
                      color: range === key ? "#0B120E" : MUTED,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                {["all", "upcoming", "pending", "complete"].map((key) => (
                  <button
                    key={key}
                    onClick={() => setUpcomingStatusFilter(key)}
                    style={{
                      padding: "0.25rem 0.6rem",
                      borderRadius: 999,
                      border: `1px solid ${upcomingStatusFilter === key ? (key === "all" ? GOLD : STATUSES[key].color) : LINE}`,
                      background: upcomingStatusFilter === key ? (key === "all" ? GOLD : `${STATUSES[key].color}22`) : "none",
                      color: upcomingStatusFilter === key ? (key === "all" ? "#0B120E" : TEXT) : MUTED,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {key === "all" ? "All" : STATUSES[key].label}
                  </button>
                ))}
              </div>

              <div style={{ background: upcomingSnapshot.anyNegative ? "rgba(224,112,90,0.1)" : SURFACE, border: `1px solid ${upcomingSnapshot.anyNegative ? DEBIT : LINE}`, borderRadius: 8, padding: "0.75rem 0.85rem", marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                  Snapshot this {RANGES[range].label.toLowerCase()}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: MUTED }}>Total income</span>
                  <span style={{ color: CREDIT, fontWeight: 600, fontFamily: "ui-monospace, monospace" }}>+{fmt(upcomingSnapshot.totals.income)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: MUTED }}>Total outflow</span>
                  <span style={{ color: DEBIT, fontWeight: 600, fontFamily: "ui-monospace, monospace" }}>-{fmt(upcomingSnapshot.totals.outflow)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, paddingTop: 6, borderTop: `1px dashed ${LINE}` }}>
                  <span style={{ color: MUTED, fontWeight: 600 }}>Net</span>
                  <span style={{ fontWeight: 700, fontFamily: "ui-monospace, monospace", color: upcomingSnapshot.totals.income - upcomingSnapshot.totals.outflow >= 0 ? CREDIT : DEBIT }}>
                    {fmt(upcomingSnapshot.totals.income - upcomingSnapshot.totals.outflow)}
                  </span>
                </div>
                {accounts.map((a) =>
                  upcomingSnapshot.lowest[a.id] && upcomingSnapshot.lowest[a.id].balance < 0 ? (
                    <div key={a.id} style={{ fontSize: 11.5, color: DEBIT, marginTop: 8, fontWeight: 600 }}>
                      ⚠ {a.name} projected to dip to {fmt(upcomingSnapshot.lowest[a.id].balance)} around {fmtDate(upcomingSnapshot.lowest[a.id].date)}
                    </div>
                  ) : null
                )}
              </div>

              {(() => {
                const filteredRows = upcomingSnapshot.rows;
                return filteredRows.length === 0 ? (
                  <EmptyNote>{upcomingStatusFilter === "all" ? "Nothing logged" : `Nothing marked ${STATUSES[upcomingStatusFilter].label}`} this {RANGES[range].label.toLowerCase()}.</EmptyNote>
                ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {filteredRows.map((t) => (
                    <LedgerRow
                      key={t.id}
                      t={t}
                      accountName={accountName}
                      remove={remove}
                      onEditSeries={openEditSeries}
                      onEditOccurrence={editOccurrence}
                      onCycleStatus={cycleStatus}
                      accounts={accounts}
                      balanceAfter={t.type === "transfer" ? t.fromBalance : t.resultingBalance}
                    />
                  ))}
                </div>
                );
              })()}
            </div>

            <div style={{ marginBottom: 8 }}>
              <SectionLabel icon={<TrendingUp size={13} />} text="Cash flow, all-time" />
              {items.length === 0 ? (
                <EmptyNote>Log income, bills, or expenses to see your totals compared here.</EmptyNote>
              ) : (
                <div style={{ height: 160, marginTop: 8 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: MUTED }} axisLine={{ stroke: LINE }} tickLine={false} />
                      <YAxis hide />
                      <Tooltip formatter={(v) => fmt(v)} contentStyle={{ fontSize: 12, border: `1px solid ${LINE}`, borderRadius: 6, background: SURFACE, color: TEXT }} labelStyle={{ color: TEXT }} itemStyle={{ color: TEXT }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.map((d) => (
                          <Cell key={d.key} fill={d.key === "income" ? CREDIT : DEBIT} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </>
        )}

        {view === "ledger" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <SectionLabel icon={<Receipt size={13} />} text="Ledger" />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  onClick={undo}
                  disabled={undoStack.length === 0}
                  aria-label="Undo"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", border: `1px solid ${LINE}`, background: "none", color: undoStack.length === 0 ? DISABLED_TEXT : MUTED, cursor: undoStack.length === 0 ? "not-allowed" : "pointer" }}
                >
                  <RotateCcw size={13} />
                </button>
                <button
                  onClick={redo}
                  disabled={redoStack.length === 0}
                  aria-label="Redo"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", border: `1px solid ${LINE}`, background: "none", color: redoStack.length === 0 ? DISABLED_TEXT : MUTED, cursor: redoStack.length === 0 ? "not-allowed" : "pointer" }}
                >
                  <RotateCw size={13} />
                </button>
                <button
                  onClick={importData}
                  style={{ fontSize: 11.5, fontWeight: 600, color: TRANSFER, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.3rem 0.65rem", cursor: "pointer" }}
                >
                  Import 2026 data
                </button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
              <button
                onClick={fixIncomeSplit}
                style={{ fontSize: 11, fontWeight: 600, color: GOLD, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.25rem 0.6rem", cursor: "pointer" }}
              >
                Fix $450 income split
              </button>
              {cleanupCount > 0 && (
                <button
                  onClick={() => setShowCleanupConfirm(true)}
                  style={{ fontSize: 11, fontWeight: 600, color: DEBIT, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.25rem 0.6rem", cursor: "pointer" }}
                >
                  Remove pre-Jul 1 ({cleanupCount})
                </button>
              )}
              {duplicateTransfersPreview.removed > 0 && (
                <button
                  onClick={() => setShowDedupeConfirm(true)}
                  style={{ fontSize: 11, fontWeight: 600, color: TRANSFER, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.25rem 0.6rem", cursor: "pointer" }}
                >
                  Remove duplicate transfers ({duplicateTransfersPreview.removed})
                </button>
              )}
              {redundantSplitTransfersPreview.removed > 0 && (
                <button
                  onClick={() => setShowRedundantConfirm(true)}
                  style={{ fontSize: 11, fontWeight: 600, color: TRANSFER, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.25rem 0.6rem", cursor: "pointer" }}
                >
                  Remove redundant $450 transfers ({redundantSplitTransfersPreview.removed})
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: 6, padding: "0.6rem 0 0.1rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setLedgerAccountFilter("all")}
                style={{
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
                  cursor: "pointer",
                }}
              >
                All accounts
              </button>
              {accounts.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setLedgerAccountFilter(a.id)}
                  style={{
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
                    cursor: "pointer",
                  }}
                >
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: accountColorFor(a.id, accounts) }} />
                  {a.name}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10, marginBottom: 2 }}>
              {Object.entries(CALENDAR_PERIODS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setLedgerPeriod(key)}
                  style={{
                    flex: 1,
                    padding: "0.35rem 0",
                    borderRadius: 999,
                    border: `1px solid ${ledgerPeriod === key ? GOLD : LINE}`,
                    background: ledgerPeriod === key ? GOLD : SURFACE,
                    color: ledgerPeriod === key ? "#0B120E" : MUTED,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11.5, color: MUTED, marginTop: 8 }}>{ledgerPeriodItems.label}</div>

            {ledgerReferenceDate && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: `${GOLD}18`, border: `1px solid ${GOLD}`, borderRadius: 8, padding: "0.5rem 0.7rem", marginTop: 8 }}>
                <span style={{ fontSize: 11.5, color: GOLD, fontWeight: 600 }}>Viewing around {fmtDate(ledgerReferenceDate)}</span>
                <button
                  onClick={() => setLedgerReferenceDate(null)}
                  style={{ background: "none", border: `1px solid ${GOLD}`, borderRadius: 999, padding: "0.2rem 0.6rem", color: GOLD, fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                >
                  Back to today
                </button>
              </div>
            )}

            <div style={{ position: "relative", height: 34, marginTop: 8, marginBottom: 4 }}>
              <div style={{ position: "absolute", top: 7, left: 0, right: 0, height: 2, background: LINE, borderRadius: 1 }} />
              <div
                style={{
                  position: "absolute",
                  top: 1,
                  left: `${Math.min(100, Math.max(0, ((new Date() - ledgerPeriodItems.start) / (ledgerPeriodItems.end - ledgerPeriodItems.start + 86400000)) * 100))}%`,
                  width: 2,
                  height: 14,
                  background: GOLD,
                  borderRadius: 1,
                  transform: "translateX(-1px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: `${Math.min(100, Math.max(0, ((new Date() - ledgerPeriodItems.start) / (ledgerPeriodItems.end - ledgerPeriodItems.start + 86400000)) * 100))}%`,
                  transform: "translateX(-50%)",
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: GOLD,
                  whiteSpace: "nowrap",
                }}
              >
                Today
              </div>
              <span style={{ position: "absolute", top: 18, left: 0, fontSize: 9.5, color: MUTED }}>
                {ledgerPeriodItems.start.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
              <span style={{ position: "absolute", top: 18, right: 0, fontSize: 9.5, color: MUTED }}>
                {ledgerPeriodItems.end.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            </div>

            {ledgerPeriodItems.items.length === 0 ? (
              <EmptyNote>{ledgerAccountFilter === "all" ? "Nothing logged in this period yet." : "No transactions for this account in this period."}</EmptyNote>
            ) : (
              <div style={{ marginTop: 8 }}>
                {ledgerPeriodItems.items.map((t, i) => (
                  <React.Fragment key={t.id}>
                    {i === ledgerPeriodItems.todayIndex && i < ledgerPeriodItems.items.length && i > 0 && (
                      <div style={{ fontSize: 10.5, color: GOLD, textTransform: "uppercase", letterSpacing: "0.06em", padding: "0.6rem 0 0.2rem", fontWeight: 700 }}>
                        Today forward
                      </div>
                    )}
                    <LedgerRow t={t} accountName={accountName} remove={remove} onEditSeries={openEditSeries} onEditOccurrence={editOccurrence} onCycleStatus={cycleStatus} accounts={accounts} balanceAfter={completedBalanceByItemId[t.id]} />
                  </React.Fragment>
                ))}
              </div>
            )}

            <div style={{ marginTop: 28 }}>
              <SectionLabel icon={<Receipt size={13} />} text="Quarterly statements" />
              {yearlyData.priorQuarterStatements.length === 0 ? (
                <EmptyNote>Earlier quarters from {yearlyData.currentYear} will summarize here once they've passed. Right now everything is still in the current quarter.</EmptyNote>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {yearlyData.priorQuarterStatements.map((q) => {
                    const expanded = !!expandedQuarters[q.key];
                    return (
                      <div key={q.key} style={{ background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, overflow: "hidden" }}>
                        <button
                          onClick={() => setExpandedQuarters((prev) => ({ ...prev, [q.key]: !prev[q.key] }))}
                          style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: "0.75rem 0.9rem", cursor: "pointer", textAlign: "left" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {expanded ? <ChevronDown size={15} color={MUTED} /> : <ChevronRight size={15} color={MUTED} />}
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{quarterLabel(q.key)}</div>
                              <div style={{ fontSize: 11.5, color: MUTED }}>{q.count} entries</div>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 13.5, fontWeight: 700, color: q.net >= 0 ? CREDIT : DEBIT }}>{fmt(q.net)} net</div>
                            <div style={{ fontSize: 11, color: MUTED }}>
                              <span style={{ color: CREDIT }}>+{fmt(q.income)}</span> · <span style={{ color: DEBIT }}>-{fmt(q.outflow)}</span>
                            </div>
                          </div>
                        </button>
                        {expanded && (
                          <div style={{ padding: "0 0.9rem 0.75rem", borderTop: `1px solid ${LINE}` }}>
                            {q.transfers > 0 && (
                              <div style={{ fontSize: 11.5, color: TRANSFER, padding: "0.6rem 0 0.2rem" }}>Internal transfers this quarter: {fmt(q.transfers)}</div>
                            )}
                            {q.items.filter((t) => matchesAccountFilter(t, ledgerAccountFilter)).map((t) => (
                              <LedgerRow key={t.id} t={t} accountName={accountName} remove={remove} onEditSeries={openEditSeries} onEditOccurrence={editOccurrence} onCycleStatus={cycleStatus} accounts={accounts} balanceAfter={completedBalanceByItemId[t.id]} bg={SURFACE} />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ marginTop: 28 }}>
              <SectionLabel icon={<Archive size={13} />} text="Yearly rollup" />
              {yearlyData.pastYears.length === 0 ? (
                <EmptyNote>
                  Past years will consolidate here automatically. Right now everything you've logged falls in {yearlyData.currentYear}, so there's nothing to roll up yet.
                </EmptyNote>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {yearlyData.pastYears.map((y) => {
                    const expanded = !!expandedYears[y.year];
                    return (
                      <div key={y.year} style={{ background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, overflow: "hidden" }}>
                        <button
                          onClick={() => setExpandedYears((prev) => ({ ...prev, [y.year]: !prev[y.year] }))}
                          style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: "0.75rem 0.9rem", cursor: "pointer", textAlign: "left" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {expanded ? <ChevronDown size={15} color={MUTED} /> : <ChevronRight size={15} color={MUTED} />}
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{y.year}</div>
                              <div style={{ fontSize: 11.5, color: MUTED }}>{y.count} entries</div>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 13.5, fontWeight: 700, color: y.net >= 0 ? CREDIT : DEBIT }}>{fmt(y.net)} net</div>
                            <div style={{ fontSize: 11, color: MUTED }}>
                              <span style={{ color: CREDIT }}>+{fmt(y.income)}</span> · <span style={{ color: DEBIT }}>-{fmt(y.outflow)}</span>
                            </div>
                          </div>
                        </button>
                        {expanded && (
                          <div style={{ padding: "0 0.9rem 0.75rem", borderTop: `1px solid ${LINE}` }}>
                            {y.transfers > 0 && (
                              <div style={{ fontSize: 11.5, color: TRANSFER, padding: "0.6rem 0 0.2rem" }}>Internal transfers this year: {fmt(y.transfers)}</div>
                            )}
                            {y.items.filter((t) => matchesAccountFilter(t, ledgerAccountFilter)).map((t) => (
                              <LedgerRow key={t.id} t={t} accountName={accountName} remove={remove} onEditSeries={openEditSeries} onEditOccurrence={editOccurrence} onCycleStatus={cycleStatus} accounts={accounts} balanceAfter={completedBalanceByItemId[t.id]} bg={SURFACE} />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {view === "trends" && (
          <>
            <SectionLabel icon={<TrendingUp size={13} />} text="Expenses over time" />
            <div style={{ display: "flex", gap: 8, marginTop: 10, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Start</label>
                <input type="date" value={trendsStart} onChange={(e) => setTrendsStart(e.target.value)} style={dateInputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>End</label>
                <input type="date" value={trendsEnd} onChange={(e) => setTrendsEnd(e.target.value)} style={dateInputStyle} />
              </div>
            </div>

            {trendsStart > trendsEnd ? (
              <EmptyNote>Start date needs to be before the end date.</EmptyNote>
            ) : trendsData.buckets.length === 0 ? (
              <EmptyNote>No bills or expenses logged in this range.</EmptyNote>
            ) : (
              <>
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  <div style={{ flex: 1, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.6rem 0.7rem" }}>
                    <div style={{ fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total spent</div>
                    <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 700, color: DEBIT, marginTop: 2 }}>{fmt(trendsData.total)}</div>
                  </div>
                  <div style={{ flex: 1, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.6rem 0.7rem" }}>
                    <div style={{ fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Avg per {trendsData.byWeek ? "week" : "month"}</div>
                    <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 700, color: TEXT, marginTop: 2 }}>{fmt(trendsData.avg)}</div>
                  </div>
                  <div style={{ flex: 1, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.6rem 0.7rem" }}>
                    <div style={{ fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Peak {trendsData.byWeek ? "week" : "month"}</div>
                    <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 700, color: GOLD, marginTop: 2 }}>{trendsData.peak ? fmt(trendsData.peak.total) : "—"}</div>
                  </div>
                </div>

                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendsData.buckets} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                      <XAxis dataKey="label" tick={{ fontSize: 10.5, fill: MUTED }} axisLine={{ stroke: LINE }} tickLine={false} interval={trendsData.buckets.length > 8 ? Math.ceil(trendsData.buckets.length / 8) - 1 : 0} />
                      <YAxis hide />
                      <Tooltip formatter={(v) => fmt(v)} contentStyle={{ fontSize: 12, border: `1px solid ${LINE}`, borderRadius: 6, background: SURFACE, color: TEXT }} labelStyle={{ color: TEXT }} itemStyle={{ color: TEXT }} />
                      <Bar dataKey="total" radius={[4, 4, 0, 0]} fill={DEBIT} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 8, marginBottom: 12 }}>
                  Bucketed by {trendsData.byWeek ? "week" : "month"} · bills and expenses only, transfers and income excluded, canceled entries excluded.
                </div>

                <SectionLabel icon={<TrendingUp size={13} />} text={`Change per ${trendsData.byWeek ? "week" : "month"}`} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                  {[...trendsData.buckets].reverse().map((b) => (
                    <div key={b.start} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 6, padding: "0.5rem 0.7rem" }}>
                      <span style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{b.label}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, fontWeight: 600, color: DEBIT }}>{fmt(b.total)}</span>
                        <ChangeBadge value={b.change} favorableWhenPositive={false} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {view === "quarterly" && (
          <>
            {projection && (
              <div style={{ marginBottom: 22 }}>
                <SectionLabel icon={<TrendingUp size={13} />} text="Next quarter outlook" />
                <div style={{ background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.85rem 0.9rem", marginTop: 8 }}>
                  <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 10 }}>
                    {quarterLabel(projection.curKey)} → {quarterLabel(projection.nextKey)}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: MUTED }}>Projected income</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13.5, fontWeight: 600, color: CREDIT }}>{fmt(projection.next.income)}</span>
                      <ChangeBadge value={projection.incomeVariance} favorableWhenPositive={true} />
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 12.5, color: MUTED }}>Projected bills + expenses</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13.5, fontWeight: 600, color: DEBIT }}>{fmt(projection.next.outflow)}</span>
                      <ChangeBadge value={projection.outflowVariance} favorableWhenPositive={false} />
                    </div>
                  </div>

                  {(projection.increases.length > 0 || projection.decreases.length > 0) && (
                    <div style={{ paddingTop: 10, borderTop: `1px dashed ${LINE}` }}>
                      <div style={{ fontSize: 11, color: MUTED, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>Suggested changes</div>
                      {projection.increases.map((d) => (
                        <div key={d.name} style={{ marginBottom: 6 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                            <span style={{ color: TEXT }}>Review {d.name} — up {fmt(d.diff)}</span>
                            <span style={{ color: DEBIT, fontFamily: "ui-monospace, monospace" }}>{fmt(d.cur)} → {fmt(d.next)}</span>
                          </div>
                          {d.debt && d.debt.apr > 0 && (
                            <div style={{ fontSize: 11, color: GOLD, marginTop: 2 }}>{d.debt.apr}% APR on {fmt(d.debt.balance)} balance</div>
                          )}
                        </div>
                      ))}
                      {projection.decreases.map((d) => (
                        <div key={d.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                          <span style={{ color: MUTED }}>{d.name} drops {fmt(Math.abs(d.diff))}</span>
                          <span style={{ color: CREDIT, fontFamily: "ui-monospace, monospace" }}>{fmt(d.cur)} → {fmt(d.next)}</span>
                        </div>
                      ))}
                      {projection.increases.some((d) => d.debt && d.debt.apr > 0) && (
                        <div style={{ fontSize: 11.5, color: MUTED, marginTop: 4 }}>
                          Tip: check the Debts tab — extra payments toward whichever balance carries the highest APR save the most interest over time.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <SectionLabel icon={<Receipt size={13} />} text="Quarterly statement" />
            {quarterlyData.length === 0 ? (
              <EmptyNote>Log some income, bills, or expenses to see quarter-by-quarter totals here.</EmptyNote>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                {[...quarterlyData].reverse().slice(0, 6).map((q) => (
                  <div key={q.key} style={{ background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.85rem 0.9rem" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{quarterLabel(q.key)}</div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 12.5, color: MUTED }}>Income</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13.5, fontWeight: 600, color: CREDIT }}>{fmt(q.income)}</span>
                        <ChangeBadge value={q.incomeChange} favorableWhenPositive={true} />
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 12.5, color: MUTED }}>Bills + expenses</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13.5, fontWeight: 600, color: DEBIT }}>{fmt(q.outflow)}</span>
                        <ChangeBadge value={q.outflowChange} favorableWhenPositive={false} />
                      </div>
                    </div>

                    {q.transfers > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 12.5, color: MUTED }}>Internal transfers</span>
                        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13.5, fontWeight: 600, color: TRANSFER }}>{fmt(q.transfers)}</span>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: `1px dashed ${LINE}` }}>
                      <span style={{ fontSize: 12.5, color: MUTED, fontWeight: 600 }}>Net</span>
                      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 14, fontWeight: 700, color: q.net >= 0 ? CREDIT : DEBIT }}>{fmt(q.net)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {view === "backup" && (
          <>
            <SectionLabel icon={<Archive size={13} />} text="Backup & restore" />
            <div style={{ fontSize: 12.5, color: MUTED, marginTop: 8, marginBottom: 16 }}>
              Your data lives only on this device. Export a backup file every so often so you have something to
              restore from if you ever clear your browser data or switch devices.
            </div>

            <div style={{ background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.9rem" }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Export backup</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>
                Downloads a .json file with every account, transaction, recurring template, and debt.
              </div>
              <button
                onClick={exportBackup}
                style={{ display: "flex", alignItems: "center", gap: 6, background: ACCENT, border: "none", borderRadius: 8, padding: "0.6rem 0.9rem", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
              >
                <Archive size={14} />
                Download backup
              </button>
            </div>

            <div style={{ background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.9rem", marginTop: 12 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Restore from backup</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>
                Replaces everything currently in the app with what's in the backup file. This can't be undone with
                the usual undo button, so make sure it's the file you want.
              </div>
              <label
                style={{
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
                  cursor: "pointer",
                }}
              >
                <ArrowLeft size={14} style={{ transform: "rotate(-90deg)" }} />
                Choose backup file…
                <input
                  type="file"
                  accept="application/json,.json"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) importBackup(file);
                    e.target.value = "";
                  }}
                />
              </label>
              {backupImportError && <div style={{ fontSize: 12, color: DEBIT, marginTop: 10 }}>{backupImportError}</div>}
            </div>

            <div style={{ background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.9rem", marginTop: 12 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Push backup to GitHub</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>
                Sends a timestamped backup straight to a <code>backups/</code> folder in your repo, so it's saved
                somewhere besides this device without you having to download and re-upload a file every time.
              </div>

              {githubConfigDraft && (
                <>
                  <label style={labelStyle}>Repo owner</label>
                  <input
                    value={githubConfigDraft.owner}
                    onChange={(e) => setGithubConfigDraft({ ...githubConfigDraft, owner: e.target.value.trim() })}
                    placeholder="e.g. Chasmolinker"
                    style={inputStyle}
                  />
                  <label style={labelStyle}>Repo name</label>
                  <input
                    value={githubConfigDraft.repo}
                    onChange={(e) => setGithubConfigDraft({ ...githubConfigDraft, repo: e.target.value.trim() })}
                    placeholder="e.g. CEM-Bills"
                    style={inputStyle}
                  />
                  <label style={labelStyle}>Branch</label>
                  <input
                    value={githubConfigDraft.branch}
                    onChange={(e) => setGithubConfigDraft({ ...githubConfigDraft, branch: e.target.value.trim() })}
                    placeholder="main"
                    style={inputStyle}
                  />
                  <label style={labelStyle}>Personal access token</label>
                  <input
                    type="password"
                    value={githubConfigDraft.token}
                    onChange={(e) => setGithubConfigDraft({ ...githubConfigDraft, token: e.target.value.trim() })}
                    placeholder="ghp_… or github_pat_…"
                    style={inputStyle}
                  />
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 6, marginBottom: 12 }}>
                    Use a fine-grained token scoped to only this repo, with just "Contents: Read and write"
                    permission — not a classic token with full account access. The token is stored only on this
                    device and is never included in your downloaded backup files.
                  </div>

                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <button
                      onClick={saveGithubConfig}
                      style={{ flex: 1, background: "none", border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.55rem 0.7rem", color: TEXT, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                    >
                      Save connection
                    </button>
                    {(githubConfig.owner || githubConfig.repo || githubConfig.token) && (
                      <button
                        onClick={disconnectGithub}
                        style={{ background: "none", border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.55rem 0.7rem", color: DEBIT, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                      >
                        Disconnect
                      </button>
                    )}
                  </div>

                  <button
                    onClick={pushBackupToGithub}
                    disabled={githubPushStatus === "pushing" || !githubConfig.owner || !githubConfig.repo || !githubConfig.token}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: ACCENT,
                      border: "none",
                      borderRadius: 8,
                      padding: "0.6rem 0.9rem",
                      color: "#fff",
                      fontSize: 13.5,
                      fontWeight: 700,
                      cursor: githubPushStatus === "pushing" ? "default" : "pointer",
                      opacity: !githubConfig.owner || !githubConfig.repo || !githubConfig.token ? 0.5 : 1,
                    }}
                  >
                    <Archive size={14} />
                    {githubPushStatus === "pushing" ? "Pushing…" : "Push backup now"}
                  </button>

                  {githubPushMessage && (
                    <div style={{ fontSize: 12, color: githubPushStatus === "success" ? CREDIT : DEBIT, marginTop: 10 }}>{githubPushMessage}</div>
                  )}
                </>
              )}
            </div>

            <div style={{ background: SURFACE, border: `1px solid ${DEBIT}`, borderRadius: 8, padding: "0.9rem", marginTop: 12 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Clear ledger</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>
                Deletes every transaction between the two dates below — useful for wiping out a messy import
                without touching anything outside that range. Accounts, recurring templates, and debts are left
                alone. Export a backup first if there's anything worth keeping.
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>From</label>
                  <input type="date" value={clearFromDate} onChange={(e) => setClearFromDate(e.target.value)} style={dateInputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Through</label>
                  <input type="date" value={clearThroughDate} onChange={(e) => setClearThroughDate(e.target.value)} style={dateInputStyle} />
                </div>
              </div>
              <button
                onClick={() => setShowClearConfirm(true)}
                disabled={clearLedgerPreviewCount === 0}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "none",
                  border: `1px solid ${clearLedgerPreviewCount === 0 ? LINE : DEBIT}`,
                  borderRadius: 8,
                  padding: "0.6rem 0.9rem",
                  color: clearLedgerPreviewCount === 0 ? MUTED : DEBIT,
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: clearLedgerPreviewCount === 0 ? "not-allowed" : "pointer",
                }}
              >
                <Trash2 size={14} />
                Clear {clearLedgerPreviewCount > 0 ? `${clearLedgerPreviewCount} ` : ""}transaction{clearLedgerPreviewCount === 1 ? "" : "s"}
              </button>
              {clearLedgerPreviewCount === 0 && (
                <div style={{ fontSize: 11.5, color: MUTED, marginTop: 8 }}>
                  No transactions found between {fmtDate(clearFromDate)} and {fmtDate(clearThroughDate)} — nothing to clear in this range.
                </div>
              )}
            </div>
          </>
        )}

        {(view === "config-expenses" || view === "config-income") && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <SectionLabel icon={<Repeat size={13} />} text={view === "config-income" ? "Recurring income" : "Recurring expenses"} />
              <div style={{ display: "flex", gap: 6 }}>
                {(view === "config-expenses" || view === "config-income") && (
                  <button
                    onClick={() => {
                      setSyncScope(view === "config-income" ? "income" : "expense");
                      setShowSyncConfirm(true);
                    }}
                    style={{ fontSize: 11.5, fontWeight: 600, color: GOLD, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.3rem 0.65rem", cursor: "pointer" }}
                  >
                    Sync
                  </button>
                )}
                <button
                  onClick={() => openAddRecurring(view === "config-income" ? "income" : "bill")}
                  style={{ fontSize: 11.5, fontWeight: 600, color: TRANSFER, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.3rem 0.65rem", cursor: "pointer" }}
                >
                  + Add
                </button>
              </div>
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 8, marginBottom: 12 }}>
              {view === "config-income"
                ? "Every recurring paycheck or deposit, with its frequency, day, and the account it lands in."
                : "Every recurring bill or expense, with its frequency, day, amount, and the account it's paid from."}
            </div>

            {(() => {
              const filtered = recurring.filter((r) => (view === "config-income" ? r.type === "income" : r.type !== "income"));
              return filtered.length === 0 ? (
                <EmptyNote>
                  {view === "config-income"
                    ? 'No recurring income set up yet. Tap "+ Add" to load one.'
                    : 'No recurring expenses set up yet. Tap "+ Add" to load one — frequency, day, amount, and which account it\'s paid from.'}
                </EmptyNote>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[...filtered]
                    .sort((a, b) => (a.frequency === "weekly" ? a.weekday : a.day) - (b.frequency === "weekly" ? b.weekday : b.day))
                    .map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setEditRecurring(r)}
                        style={{ display: "flex", alignItems: "center", gap: 12, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.7rem 0.85rem", cursor: "pointer", textAlign: "left" }}
                      >
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 8,
                            background: SURFACE_2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <div style={{ fontSize: r.frequency === "weekly" ? 10.5 : 13, fontWeight: 700, color: TEXT, lineHeight: 1.1 }}>
                            {r.frequency === "weekly" ? WEEKDAY_NAMES[r.weekday].slice(0, 3) : r.day}
                          </div>
                          <div style={{ fontSize: 8, color: MUTED, textTransform: "uppercase" }}>{r.frequency === "weekly" ? "wkly" : "day"}</div>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                          <div style={{ fontSize: 11.5, color: MUTED }}>
                            {FREQUENCIES[r.frequency || "monthly"].label} · {TYPES[r.type].label} · {accountName(r.accountId)}
                          </div>
                        </div>
                        <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 14, fontWeight: 700, color: TYPES[r.type].color }}>
                          {TYPES[r.type].sign > 0 ? "+" : "-"}
                          {fmt(r.amount)}
                        </div>
                      </button>
                    ))}
                </div>
              );
            })()}
          </>
        )}

        {view === "config-accounts" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <SectionLabel icon={<Wallet size={13} />} text="Accounts" />
              <button
                onClick={addAccount}
                style={{ fontSize: 11.5, fontWeight: 600, color: TRANSFER, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.3rem 0.65rem", cursor: "pointer" }}
              >
                + Add
              </button>
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 8, marginBottom: 12 }}>Every account you track, its starting balance, and its current balance.</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {accounts.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setEditAccount(a)}
                  style={{ display: "flex", alignItems: "center", gap: 12, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.7rem 0.85rem", cursor: "pointer", textAlign: "left" }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: accountColorFor(a.id, accounts), flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</div>
                    <div style={{ fontSize: 11.5, color: MUTED }}>Starting balance {fmt(a.opening)}</div>
                  </div>
                  <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 14, fontWeight: 700, color: (accountBalances[a.id] || 0) >= 0 ? CREDIT : DEBIT }}>
                    {fmt(accountBalances[a.id] || 0)}
                  </div>
                  <Pencil size={13} color={MUTED} />
                </button>
              ))}
            </div>
          </>
        )}

        {view === "debts" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <SectionLabel icon={<TrendingUp size={13} />} text="Loans & credit accounts" />
              <button
                onClick={addDebt}
                style={{ fontSize: 11.5, fontWeight: 600, color: TRANSFER, background: "none", border: `1px solid ${LINE}`, borderRadius: 999, padding: "0.3rem 0.65rem", cursor: "pointer" }}
              >
                + Add account
              </button>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.6rem 0.7rem" }}>
                <div style={{ fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total balance</div>
                <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 700, color: DEBIT, marginTop: 2 }}>{fmt(debtSummary.totalBalance)}</div>
              </div>
              <div style={{ flex: 1, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.6rem 0.7rem" }}>
                <div style={{ fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Avg APR</div>
                <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 700, color: GOLD, marginTop: 2 }}>{debtSummary.weightedApr.toFixed(1)}%</div>
              </div>
              <div style={{ flex: 1, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.6rem 0.7rem" }}>
                <div style={{ fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Est. interest/mo</div>
                <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 700, color: DEBIT, marginTop: 2 }}>{fmt(debtSummary.monthlyInterest)}</div>
              </div>
            </div>

            {sortedDebts.length === 0 ? (
              <EmptyNote>No loan or credit accounts yet. Add one with its current balance and interest rate to sharpen the quarterly suggestions.</EmptyNote>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sortedDebts.map((d, i) => (
                  <button
                    key={d.id}
                    onClick={() => setEditDebt(d)}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: SURFACE, border: `1px solid ${LINE}`, borderLeft: `3px solid ${i === 0 && d.apr > 0 ? GOLD : LINE}`, borderRadius: 6, padding: "0.6rem 0.75rem", textAlign: "left", cursor: "pointer" }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                      <div style={{ fontSize: 12, color: MUTED }}>
                        {d.apr}% APR{i === 0 && d.apr > 0 ? " · highest priority" : ""}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 14, fontWeight: 700, color: DEBIT }}>{fmt(d.balance)}</div>
                      <div style={{ fontSize: 11, color: MUTED }}>~{fmt((d.balance * (d.apr / 100)) / 12)}/mo interest</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 10,
          right: 10,
          maxWidth: 400,
          margin: "0 auto",
          background: BG,
          borderTop: `1px solid ${LINE}`,
          padding: "0.75rem 0.75rem calc(0.75rem + env(safe-area-inset-bottom, 0px))",
          zIndex: 45,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(TYPES).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => openAdd(key)}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.65rem 0", fontSize: 13, fontWeight: 600, color: TEXT, cursor: "pointer" }}
            >
              <Plus size={14} color={meta.color} />
              {meta.label}
            </button>
          ))}
          <button
            onClick={() => openAdd("transfer")}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "0.65rem 0", fontSize: 13, fontWeight: 600, color: TEXT, cursor: "pointer" }}
          >
            <Plus size={14} color={TRANSFER} />
            Transfer
          </button>
        </div>
      </div>

      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 }} onClick={() => setShowAdd(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Add {form.type === "transfer" ? "transfer" : TYPES[form.type].label.toLowerCase()}</div>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {Object.entries(TYPES).map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => setForm((f) => ({ ...f, type: key }))}
                  style={{ flex: 1, padding: "0.4rem 0", borderRadius: 6, border: `1px solid ${form.type === key ? meta.color : LINE}`, background: form.type === key ? meta.color : SURFACE_2, color: form.type === key ? "#0B120E" : TEXT, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                >
                  {meta.label}
                </button>
              ))}
              <button
                onClick={() => setForm((f) => ({ ...f, type: "transfer" }))}
                style={{ flex: 1, padding: "0.4rem 0", borderRadius: 6, border: `1px solid ${form.type === "transfer" ? TRANSFER : LINE}`, background: form.type === "transfer" ? TRANSFER : SURFACE_2, color: form.type === "transfer" ? "#0B120E" : TEXT, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
              >
                Transfer
              </button>
            </div>

            {suggestions.length > 0 && form.type !== "transfer" && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>Quick fill</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {suggestions.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => applySuggestion(s)}
                      style={{ fontSize: 12.5, padding: "0.35rem 0.6rem", borderRadius: 999, border: `1px solid ${LINE}`, background: SURFACE_2, color: TEXT, cursor: "pointer" }}
                    >
                      {s.name} · {fmt(s.amount)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <label style={labelStyle}>Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder={form.type === "income" ? "Paycheck" : form.type === "bill" ? "Rent" : form.type === "transfer" ? "Savings top-up" : "Groceries"}
              style={inputStyle}
            />

            <label style={labelStyle}>Amount</label>
            <input value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value.replace(/[^0-9]/g, "") }))} placeholder="0" inputMode="numeric" style={inputStyle} />

            {form.type === "transfer" ? (
              <>
                <label style={labelStyle}>From</label>
                <select value={form.fromAccountId} onChange={(e) => setForm((f) => ({ ...f, fromAccountId: e.target.value }))} style={inputStyle}>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
                <label style={labelStyle}>To</label>
                <select value={form.toAccountId} onChange={(e) => setForm((f) => ({ ...f, toAccountId: e.target.value }))} style={inputStyle}>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <label style={labelStyle}>Account</label>
                <select value={form.accountId} onChange={(e) => setForm((f) => ({ ...f, accountId: e.target.value }))} style={inputStyle}>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </>
            )}

            <label style={labelStyle}>Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} style={dateInputStyle} />

            {form.type !== "transfer" && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                  <input type="checkbox" id="recurring" checked={form.recurring} onChange={(e) => setForm((f) => ({ ...f, recurring: e.target.checked }))} />
                  <label htmlFor="recurring" style={{ fontSize: 13, color: TEXT }}>Repeats</label>
                </div>
                {form.recurring && (
                  <>
                    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                      {Object.entries(FREQUENCIES).map(([key, f]) => (
                        <button
                          key={key}
                          onClick={() => setForm((prev) => ({ ...prev, frequency: key }))}
                          style={{ flex: 1, padding: "0.35rem 0", borderRadius: 999, border: `1px solid ${form.frequency === key ? GOLD : LINE}`, background: form.frequency === key ? GOLD : SURFACE_2, color: form.frequency === key ? "#0B120E" : TEXT, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      {form.frequency === "weekly" ? (
                        <select value={form.weekday} onChange={(e) => setForm((f) => ({ ...f, weekday: e.target.value }))} style={inputStyle}>
                          {WEEKDAY_NAMES.map((name, i) => (
                            <option key={i} value={i}>
                              {name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input type="number" min="1" max="31" value={form.day} onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))} style={inputStyle} aria-label="Day of month due" />
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>
                      This creates a {form.frequency} recurring {form.type} you can log with one tap from the Overview tab.
                    </div>
                  </>
                )}
              </>
            )}

            <button
              onClick={submit}
              disabled={!form.name.trim() || !parseFloat(form.amount)}
              style={{ width: "100%", marginTop: 18, padding: "0.75rem", borderRadius: 8, border: "none", background: form.name.trim() && parseFloat(form.amount) ? ACCENT : DISABLED, color: form.name.trim() && parseFloat(form.amount) ? "#fff" : DISABLED_TEXT, fontSize: 14, fontWeight: 700, cursor: form.name.trim() && parseFloat(form.amount) ? "pointer" : "not-allowed" }}
            >
              Save entry
            </button>
          </div>
        </div>
      )}

      {editAccount && <AccountEditModal account={editAccount} onClose={() => setEditAccount(null)} onSave={saveAccountEdit} onDelete={deleteAccount} canDelete={accounts.length > 1} />}
      {editRecurring && <RecurringEditModal item={editRecurring} accounts={accounts} onClose={() => setEditRecurring(null)} onSave={saveRecurringEdit} onDelete={deleteRecurring} />}
      {showAddRecurring && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }} onClick={() => setShowAddRecurring(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Add recurring expense</div>
              <button onClick={() => setShowAddRecurring(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {Object.entries(TYPES).map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => setRecurringForm((f) => ({ ...f, type: key }))}
                  style={{ flex: 1, padding: "0.4rem 0", borderRadius: 6, border: `1px solid ${recurringForm.type === key ? meta.color : LINE}`, background: recurringForm.type === key ? meta.color : SURFACE_2, color: recurringForm.type === key ? "#0B120E" : TEXT, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                >
                  {meta.label}
                </button>
              ))}
            </div>

            <label style={labelStyle}>Name</label>
            <input
              value={recurringForm.name}
              onChange={(e) => setRecurringForm((f) => ({ ...f, name: e.target.value }))}
              placeholder={recurringForm.type === "income" ? "Paycheck" : recurringForm.type === "bill" ? "Rent" : "Subscription"}
              style={inputStyle}
            />

            <label style={labelStyle}>Amount</label>
            <input value={recurringForm.amount} onChange={(e) => setRecurringForm((f) => ({ ...f, amount: e.target.value.replace(/[^0-9]/g, "") }))} placeholder="0" inputMode="numeric" style={inputStyle} />

            <label style={labelStyle}>Account paid from</label>
            <select value={recurringForm.accountId} onChange={(e) => setRecurringForm((f) => ({ ...f, accountId: e.target.value }))} style={inputStyle}>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <label style={labelStyle}>Frequency</label>
            <div style={{ display: "flex", gap: 6 }}>
              {Object.entries(FREQUENCIES).map(([key, f]) => (
                <button
                  key={key}
                  onClick={() => setRecurringForm((prev) => ({ ...prev, frequency: key }))}
                  style={{ flex: 1, padding: "0.4rem 0", borderRadius: 999, border: `1px solid ${recurringForm.frequency === key ? GOLD : LINE}`, background: recurringForm.frequency === key ? GOLD : SURFACE_2, color: recurringForm.frequency === key ? "#0B120E" : TEXT, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {recurringForm.frequency === "weekly" ? (
              <>
                <label style={labelStyle}>Day of week</label>
                <select value={recurringForm.weekday} onChange={(e) => setRecurringForm((f) => ({ ...f, weekday: e.target.value }))} style={inputStyle}>
                  {WEEKDAY_NAMES.map((name, i) => (
                    <option key={i} value={i}>
                      {name}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <label style={labelStyle}>Day of month</label>
                <input type="number" min="1" max="31" value={recurringForm.day} onChange={(e) => setRecurringForm((f) => ({ ...f, day: e.target.value }))} style={inputStyle} />
              </>
            )}

            <button
              onClick={submitNewRecurring}
              disabled={!recurringForm.name.trim() || !parseInt(recurringForm.amount, 10)}
              style={{
                width: "100%",
                marginTop: 18,
                padding: "0.75rem",
                borderRadius: 8,
                border: "none",
                background: recurringForm.name.trim() && parseInt(recurringForm.amount, 10) ? ACCENT : DISABLED,
                color: recurringForm.name.trim() && parseInt(recurringForm.amount, 10) ? "#fff" : DISABLED_TEXT,
                fontSize: 14,
                fontWeight: 700,
                cursor: recurringForm.name.trim() && parseInt(recurringForm.amount, 10) ? "pointer" : "not-allowed",
              }}
            >
              Save recurring expense
            </button>
          </div>
        </div>
      )}
      {editDebt && <DebtEditModal debt={editDebt} onClose={() => setEditDebt(null)} onSave={saveDebtEdit} onDelete={deleteDebt} />}
      {showSyncConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }} onClick={() => setShowSyncConfirm(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Sync {syncScope === "income" ? "income" : "expenses"}?</div>
            <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 14 }}>
              This clears every not-yet-happened entry generated from your recurring {syncScope === "income" ? "income" : "bills and expenses"}, then regenerates them through the end of the year using each item's current amount, account, and frequency. {syncScope === "income" ? "Recurring bills and expenses are" : "Recurring income is"} left untouched, along with past entries and anything not tied to a recurring template.
            </div>
            <div style={{ background: SURFACE_2, borderRadius: 8, padding: "0.75rem 0.85rem", marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: MUTED }}>Entries removed</span>
                <span style={{ color: DEBIT, fontWeight: 600, fontFamily: "ui-monospace, monospace" }}>{syncExpensesPreview.removed}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: MUTED }}>Entries regenerated</span>
                <span style={{ color: CREDIT, fontWeight: 600, fontFamily: "ui-monospace, monospace" }}>{syncExpensesPreview.added}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setShowSyncConfirm(false)}
                style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button onClick={syncExpenses} style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Sync
              </button>
            </div>
            <div style={{ fontSize: 11.5, color: MUTED, marginTop: 10 }}>Undo is available on the Ledger tab if this doesn't look right.</div>
          </div>
        </div>
      )}
      {pendingGroup && <PendingDebitsModal group={pendingGroup} accountName={accountName} accounts={accounts} onClose={() => setPendingGroup(null)} onApply={applyEditAll} onApplySingle={applyEditSingle} onDelete={deleteFromSeries} />}
      {showCleanupConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 65 }} onClick={() => setShowCleanupConfirm(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Remove transactions before {cleanupCutoff}?</div>
            <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 16 }}>
              This permanently deletes {cleanupCount} transaction{cleanupCount === 1 ? "" : "s"} dated before July 1, across every account. Entries on or after that date are untouched.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setShowCleanupConfirm(false)}
                style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button onClick={removeBeforeCutoff} style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: "none", background: DEBIT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Remove
              </button>
            </div>
            <div style={{ fontSize: 11.5, color: MUTED, marginTop: 10 }}>Undo is available on the Ledger tab if this doesn't look right.</div>
          </div>
        </div>
      )}
      {showDedupeConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 65 }} onClick={() => setShowDedupeConfirm(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Remove duplicate transfers?</div>
            <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 14 }}>
              Some transfers were recorded twice under different names during import — same date, same amount, same direction, just labeled differently. This keeps one copy of each and removes {duplicateTransfersPreview.removed} duplicate{duplicateTransfersPreview.removed === 1 ? "" : "s"}. Income, bills, and expenses are untouched.
            </div>
            {duplicateTransfersPreview.examples.length > 0 && (
              <div style={{ background: SURFACE_2, borderRadius: 8, padding: "0.65rem 0.75rem", marginBottom: 16 }}>
                <div style={{ fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Examples of what will go</div>
                {duplicateTransfersPreview.examples.map((t) => (
                  <div key={t.id} style={{ fontSize: 12.5, color: TEXT, marginBottom: 3 }}>
                    {fmtDate(t.date)} · {t.name} · {fmt(t.amount)}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setShowDedupeConfirm(false)}
                style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button onClick={removeDuplicateTransfers} style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Remove duplicates
              </button>
            </div>
            <div style={{ fontSize: 11.5, color: MUTED, marginTop: 10 }}>Undo is available on the Ledger tab if this doesn't look right.</div>
          </div>
        </div>
      )}
      {chartDrillTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 65 }} onClick={() => setChartDrillTarget(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box", maxHeight: "75vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>
                {fmtDate(chartDrillTarget.date)} · {accountName(chartDrillTarget.accountId)}
              </div>
              <button onClick={() => setChartDrillTarget(null)} aria-label="Close" style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 14 }}>
              {chartDrillTarget.matches.length === 0
                ? "Nothing logged for this account on this day — the balance carried over unchanged from the day before."
                : `What moved the balance ${chartDrillTarget.matches.length === 1 ? "here" : "on this day"}.`}
            </div>
            {chartDrillTarget.matches.length === 0 ? (
              chartDrillTarget.nearest ? (
                <>
                  <div style={{ fontSize: 11.5, color: GOLD, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                    <ArrowLeft size={12} style={{ transform: chartDrillTarget.nearest.date > chartDrillTarget.date ? "rotate(180deg)" : "none" }} />
                    Nearest transaction · {fmtDate(chartDrillTarget.nearest.date)}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <LedgerRow
                      t={chartDrillTarget.nearest}
                      accountName={accountName}
                      remove={remove}
                      onEditSeries={openEditSeries}
                      onEditOccurrence={editOccurrence}
                      onCycleStatus={cycleStatus}
                      accounts={accounts}
                      balanceAfter={completedBalanceByItemId[chartDrillTarget.nearest.id]}
                    />
                  </div>
                  <button
                    onClick={() => goToTransactionInLedger(chartDrillTarget.nearest)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", marginTop: 10, background: "none", border: `1px solid ${GOLD}`, borderRadius: 8, padding: "0.55rem", color: GOLD, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                  >
                    <Receipt size={14} />
                    View in Ledger
                  </button>
                </>
              ) : (
                <EmptyNote>No transaction to show — this account has no history yet.</EmptyNote>
              )
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {chartDrillTarget.matches.map((t) => (
                  <div key={t.id}>
                    <LedgerRow
                      t={t}
                      accountName={accountName}
                      remove={remove}
                      onEditSeries={openEditSeries}
                      onEditOccurrence={editOccurrence}
                      onCycleStatus={cycleStatus}
                      accounts={accounts}
                      balanceAfter={completedBalanceByItemId[t.id]}
                    />
                    <button
                      onClick={() => goToTransactionInLedger(t)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", marginTop: 4, background: "none", border: `1px solid ${GOLD}`, borderRadius: 8, padding: "0.5rem", color: GOLD, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                    >
                      <Receipt size={13} />
                      View in Ledger
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {showClearConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 65 }} onClick={() => setShowClearConfirm(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Clear {clearLedgerPreviewCount} transaction{clearLedgerPreviewCount === 1 ? "" : "s"}?</div>
            <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 18 }}>
              This deletes every income, bill, expense, and transfer entry dated {fmtDate(clearFromDate)} through{" "}
              {fmtDate(clearThroughDate)}. Anything outside that range is left alone — along with your accounts,
              recurring templates, and debts.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setShowClearConfirm(false)}
                style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button onClick={clearLedger} style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: "none", background: DEBIT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Clear ledger
              </button>
            </div>
            <div style={{ fontSize: 11.5, color: MUTED, marginTop: 10 }}>Undo is available on the Ledger tab right after, if this doesn't look right.</div>
          </div>
        </div>
      )}
      {pendingImport && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 65 }} onClick={() => setPendingImport(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Restore this backup?</div>
            <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 14 }}>
              This replaces everything currently in the app — every account, transaction, recurring template, and
              debt — with what's in this file. Anything you've entered since this backup was made will be lost.
            </div>
            <div style={{ background: SURFACE_2, borderRadius: 8, padding: "0.65rem 0.75rem", marginBottom: 18 }}>
              <div style={{ fontSize: 12.5, color: TEXT, marginBottom: 3 }}>{pendingImport.transactions ? pendingImport.transactions.length : 0} transactions</div>
              <div style={{ fontSize: 12.5, color: TEXT, marginBottom: 3 }}>{pendingImport.accounts ? pendingImport.accounts.length : 0} accounts</div>
              <div style={{ fontSize: 12.5, color: TEXT, marginBottom: 3 }}>{pendingImport.recurring ? pendingImport.recurring.length : 0} recurring templates</div>
              <div style={{ fontSize: 12.5, color: TEXT }}>{pendingImport.debts ? pendingImport.debts.length : 0} debts</div>
              {pendingImport.exportedAt && (
                <div style={{ fontSize: 11, color: MUTED, marginTop: 8, paddingTop: 8, borderTop: `1px dashed ${LINE}` }}>
                  Backed up {new Date(pendingImport.exportedAt).toLocaleString()}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setPendingImport(null)}
                style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button onClick={confirmImportBackup} style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: "none", background: DEBIT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Restore
              </button>
            </div>
          </div>
        </div>
      )}
      {showRedundantConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 65 }} onClick={() => setShowRedundantConfirm(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Remove redundant $450 transfers?</div>
            <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 14 }}>
              On paydays where TD income was split into $1,050 (TD) + $450 (PFFCU-X direct), the old $450 TD→PFFCU-X transfer from before the split is now double-counting the same money. This removes {redundantSplitTransfersPreview.removed} of those transfers, on days that already have a matching $1,050 TD income entry. Everything else is untouched.
            </div>
            {redundantSplitTransfersPreview.examples.length > 0 && (
              <div style={{ background: SURFACE_2, borderRadius: 8, padding: "0.65rem 0.75rem", marginBottom: 16 }}>
                <div style={{ fontSize: 10.5, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Examples of what will go</div>
                {redundantSplitTransfersPreview.examples.map((t) => (
                  <div key={t.id} style={{ fontSize: 12.5, color: TEXT, marginBottom: 3 }}>
                    {fmtDate(t.date)} · {t.name} · {fmt(t.amount)}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setShowRedundantConfirm(false)}
                style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button onClick={removeRedundantSplitTransfers} style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Remove transfers
              </button>
            </div>
            <div style={{ fontSize: 11.5, color: MUTED, marginTop: 10 }}>Undo is available on the Ledger tab if this doesn't look right.</div>
          </div>
        </div>
      )}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 80, display: "flex" }} onClick={() => setMenuOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "78%", maxWidth: 300, height: "100%", background: HEADER, padding: "1.5rem 1rem", boxSizing: "border-box", overflowY: "auto" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, fontWeight: 700 }}>Menu</div>
              <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: HEADER_TEXT, cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 22 }}>
              {[
                { key: "overview", label: "Overview" },
                { key: "ledger", label: "Ledger" },
                { key: "quarterly", label: "Quarterly Statements" },
                { key: "trends", label: "Expenses Over Time" },
                { key: "debts", label: "Debts" },
              ].map(({ key: v, label }) => (
                <button
                  key={v}
                  onClick={() => {
                    setView(v);
                    setMenuOpen(false);
                  }}
                  style={{
                    textAlign: "left",
                    background: view === v ? SURFACE_2 : "none",
                    border: "none",
                    borderRadius: 8,
                    padding: "0.6rem 0.7rem",
                    color: view === v ? TEXT : HEADER_TEXT,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: MUTED, fontWeight: 700, padding: "0 0.7rem", marginBottom: 6 }}>
              Configuration
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { key: "config-expenses", label: "Expenses", icon: <Repeat size={14} /> },
                { key: "config-income", label: "Income", icon: <TrendingUp size={14} /> },
                { key: "config-accounts", label: "Accounts", icon: <Wallet size={14} /> },
                { key: "backup", label: "Backup & Restore", icon: <Archive size={14} /> },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setView(item.key);
                    setMenuOpen(false);
                  }}
                  style={{
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
                    cursor: "pointer",
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
      {scrollThumb.visible && (
        <div
          style={{ position: "fixed", top: 0, right: "max(1px, calc((100vw - 420px) / 2 + 1px))", bottom: 0, width: 8, zIndex: 90, pointerEvents: "none" }}
        >
          <div
            onTouchStart={(e) => {
              e.stopPropagation();
              startThumbDrag(e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
              onThumbDragMove(e.touches[0].clientY);
            }}
            onTouchEnd={endThumbDrag}
            onMouseDown={(e) => {
              e.stopPropagation();
              startThumbDrag(e.clientY);
            }}
            onMouseMove={(e) => scrollDragRef.current.dragging && onThumbDragMove(e.clientY)}
            onMouseUp={endThumbDrag}
            onMouseLeave={() => scrollDragRef.current.dragging && endThumbDrag()}
            style={{
              position: "absolute",
              top: scrollThumb.top,
              right: 0,
              width: 6,
              height: scrollThumb.height,
              borderRadius: 3,
              background: LINE,
              pointerEvents: "auto",
              cursor: "grab",
              touchAction: "none",
            }}
          />
        </div>
      )}
    </div>
  );
}

function AccountEditModal({ account, onClose, onSave, onDelete, canDelete }) {
  const [name, setName] = useState(account.name);
  const [opening, setOpening] = useState(String(account.opening));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Edit account</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
            <X size={20} />
          </button>
        </div>
        <label style={labelStyle}>Account name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        <label style={labelStyle}>Starting balance</label>
        <input value={opening} onChange={(e) => setOpening(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" style={inputStyle} />
        <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>Set this to your bank's current balance when you start tracking. Entries you log after that adjust it up or down.</div>
        <button onClick={() => onSave(account.id, name, opening)} style={{ width: "100%", marginTop: 18, padding: "0.75rem", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Save account
        </button>
        {onDelete && (
          <>
            <button
              onClick={() => canDelete && onDelete(account.id)}
              disabled={!canDelete}
              style={{ width: "100%", marginTop: 8, padding: "0.65rem", borderRadius: 8, border: `1px solid ${canDelete ? DEBIT : LINE}`, background: "transparent", color: canDelete ? DEBIT : DISABLED_TEXT, fontSize: 13, fontWeight: 700, cursor: canDelete ? "pointer" : "not-allowed" }}
            >
              Remove account
            </button>
            {!canDelete && <div style={{ fontSize: 11.5, color: MUTED, marginTop: 6 }}>You need at least one account — add another before removing this one.</div>}
          </>
        )}
      </div>
    </div>
  );
}

function RecurringEditModal({ item, accounts, onClose, onSave, onDelete }) {
  const [name, setName] = useState(item.name);
  const [amount, setAmount] = useState(String(item.amount));
  const [accountId, setAccountId] = useState(item.accountId);
  const [frequency, setFrequency] = useState(item.frequency || "monthly");
  const [day, setDay] = useState(String(item.day || new Date().getDate()));
  const [weekday, setWeekday] = useState(String(item.weekday ?? new Date().getDay()));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Edit recurring {TYPES[item.type].label.toLowerCase()}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
            <X size={20} />
          </button>
        </div>
        <label style={labelStyle}>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        <label style={labelStyle}>Amount</label>
        <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" style={inputStyle} />
        <label style={labelStyle}>Account</label>
        <select value={accountId} onChange={(e) => setAccountId(e.target.value)} style={inputStyle}>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <label style={labelStyle}>Frequency</label>
        <div style={{ display: "flex", gap: 6 }}>
          {Object.entries(FREQUENCIES).map(([key, f]) => (
            <button
              key={key}
              onClick={() => setFrequency(key)}
              style={{ flex: 1, padding: "0.4rem 0", borderRadius: 999, border: `1px solid ${frequency === key ? GOLD : LINE}`, background: frequency === key ? GOLD : SURFACE_2, color: frequency === key ? "#0B120E" : TEXT, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {frequency === "weekly" ? (
          <>
            <label style={labelStyle}>Day of week</label>
            <select value={weekday} onChange={(e) => setWeekday(e.target.value)} style={inputStyle}>
              {WEEKDAY_NAMES.map((name2, i) => (
                <option key={i} value={i}>
                  {name2}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
            <label style={labelStyle}>Day of month due</label>
            <input type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} style={inputStyle} />
          </>
        )}

        <button
          onClick={() => onSave(item.id, name, amount, accountId, day, frequency, weekday)}
          style={{ width: "100%", marginTop: 18, padding: "0.75rem", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
        >
          Save
        </button>
        <button onClick={() => onDelete(item.id)} style={{ width: "100%", marginTop: 8, padding: "0.65rem", borderRadius: 8, border: `1px solid ${DEBIT}`, background: "transparent", color: DEBIT, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Stop tracking this
        </button>
        <div style={{ fontSize: 11.5, color: MUTED, marginTop: 6 }}>This removes it from Recurring items. Past entries stay in your ledger.</div>
      </div>
    </div>
  );
}

function DebtEditModal({ debt, onClose, onSave, onDelete }) {
  const [name, setName] = useState(debt.name);
  const [balance, setBalance] = useState(String(debt.balance));
  const [apr, setApr] = useState(String(debt.apr));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Edit loan or credit account</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
            <X size={20} />
          </button>
        </div>
        <label style={labelStyle}>Account name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        <label style={labelStyle}>Current balance</label>
        <input value={balance} onChange={(e) => setBalance(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" style={inputStyle} />
        <label style={labelStyle}>Interest rate (APR %)</label>
        <input value={apr} onChange={(e) => setApr(e.target.value.replace(/[^0-9.]/g, ""))} inputMode="decimal" placeholder="e.g. 18.9" style={inputStyle} />
        <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>
          Matched against your bill and expense names — e.g. "Carvana" here links to any "Carvana" entries in your ledger, sharpening the quarterly suggestions.
        </div>
        <button onClick={() => onSave(debt.id, name, balance, apr)} style={{ width: "100%", marginTop: 18, padding: "0.75rem", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Save account
        </button>
        <button onClick={() => onDelete(debt.id)} style={{ width: "100%", marginTop: 8, padding: "0.65rem", borderRadius: 8, border: `1px solid ${DEBIT}`, background: "transparent", color: DEBIT, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Remove account
        </button>
      </div>
    </div>
  );
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
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, amount: parseInt(rowAmount, 10) || e.amount, accountId: rowAccountId || e.accountId } : e)));
    setEditingId(null);
  };
  const deleteRow = (id) => {
    onDelete(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Edit series · {group.name}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>
          {entries.length} pending {TYPES[group.type].label.toLowerCase()}{entries.length === 1 ? "" : "s"} this year
        </div>

        {!bulkEditing ? (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              {entries.map((e) =>
                editingId === e.id ? (
                  <div key={e.id} style={{ background: SURFACE_2, borderRadius: 6, padding: "0.65rem 0.7rem" }}>
                    <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 6 }}>{fmtDate(e.date)}</div>
                    <label style={labelStyle}>Amount</label>
                    <input value={rowAmount} onChange={(ev) => setRowAmount(ev.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" style={inputStyle} />
                    <label style={labelStyle}>Account</label>
                    <select value={rowAccountId} onChange={(ev) => setRowAccountId(ev.target.value)} style={inputStyle}>
                      {accounts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button
                        onClick={discardRow}
                        style={{ flex: 1, padding: "0.55rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                      >
                        Discard
                      </button>
                      <button
                        onClick={() => saveRow(e.id)}
                        disabled={!parseInt(rowAmount, 10)}
                        style={{ flex: 1, padding: "0.55rem", borderRadius: 8, border: "none", background: parseInt(rowAmount, 10) ? ACCENT : DISABLED, color: parseInt(rowAmount, 10) ? "#fff" : DISABLED_TEXT, fontSize: 13, fontWeight: 700, cursor: parseInt(rowAmount, 10) ? "pointer" : "not-allowed" }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={e.id}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: SURFACE_2, borderRadius: 6, padding: "0.5rem 0.65rem" }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{fmtDate(e.date)}</div>
                      <div style={{ fontSize: 11, color: MUTED }}>{accountName(e.accountId)}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 13.5, fontWeight: 600, color: TYPES[e.type].color, marginRight: 6 }}>{fmt(e.amount)}</div>
                      <button onClick={() => startRowEdit(e)} aria-label={`Edit ${fmtDate(e.date)}`} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", padding: 5 }}>
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => deleteRow(e.id)} aria-label={`Delete ${fmtDate(e.date)}`} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", padding: 5 }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
            <button
              onClick={() => setBulkEditing(true)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            >
              Edit all
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 12 }}>
              This updates all {entries.length} entr{entries.length === 1 ? "y" : "ies"} above at once — useful when a bill's amount or account changes going forward.
            </div>
            <label style={labelStyle}>New amount</label>
            <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" style={inputStyle} />
            <label style={labelStyle}>Account</label>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)} style={inputStyle}>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button
                onClick={() => setBulkEditing(false)}
                style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
              >
                Discard
              </button>
              <button
                onClick={() => onApply(entries.map((e) => e.id), amount, accountId)}
                disabled={!parseInt(amount, 10)}
                style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: "none", background: parseInt(amount, 10) ? ACCENT : DISABLED, color: parseInt(amount, 10) ? "#fff" : DISABLED_TEXT, fontSize: 14, fontWeight: 700, cursor: parseInt(amount, 10) ? "pointer" : "not-allowed" }}
              >
                Save all
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const SWIPE_REVEAL = 84;

const LONG_SWIPE = 190;

function LedgerRow({ t, accountName, remove, onEditSeries, onEditOccurrence, onCycleStatus, accounts, balanceAfter, bg = BG }) {
  const timerRef = useRef(null);
  const startXRef = useRef(0);
  const draggingRef = useRef(false);
  const rawOffsetRef = useRef(0);
  const [offsetX, setOffsetX] = useState(0);
  const [openSide, setOpenSide] = useState(null); // null | "delete" | "series"
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
  const rowStatus = getStatus(t, toISODate(new Date()));
  const isCanceled = rowStatus === "canceled";
  const rowAccentColor = t.type === "transfer" ? TRANSFER : accountColorFor(t.accountId, accounts);

  const startLongPress = () => {
    if (openSide) return;
    timerRef.current = setTimeout(() => {
      setDraftAmount(String(t.amount));
      setDraftDate(t.date);
      setDraftName(t.name);
      setDraftType(t.type);
      setDraftAccountId(t.accountId || (accounts[0] && accounts[0].id));
      setDraftFromAccountId(t.fromAccountId || (accounts[0] && accounts[0].id));
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
      toAccountId: draftToAccountId,
    });
    setEditingOccurrence(false);
  };

  if (editingOccurrence) {
    return (
      <div style={{ padding: "0.65rem 0.6rem", borderBottom: `1px dashed ${LINE}`, background: SURFACE_2, borderRadius: 6, marginBottom: 4, overflow: "hidden", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: TEXT }}>Edit this occurrence only</div>
          <button
            onClick={cancelOccurrence}
            aria-label="Close"
            style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}
          >
            <X size={16} />
          </button>
        </div>

        <label style={labelStyle}>Type</label>
        <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
          {Object.entries(TYPES).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setDraftType(key)}
              style={{ flex: 1, padding: "0.35rem 0", borderRadius: 6, border: `1px solid ${draftType === key ? meta.color : LINE}`, background: draftType === key ? meta.color : SURFACE, color: draftType === key ? "#0B120E" : TEXT, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}
            >
              {meta.label}
            </button>
          ))}
          <button
            onClick={() => setDraftType("transfer")}
            style={{ flex: 1, padding: "0.35rem 0", borderRadius: 6, border: `1px solid ${draftType === "transfer" ? TRANSFER : LINE}`, background: draftType === "transfer" ? TRANSFER : SURFACE, color: draftType === "transfer" ? "#0B120E" : TEXT, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}
          >
            Transfer
          </button>
        </div>

        <label style={labelStyle}>Description</label>
        <input value={draftName} onChange={(e) => setDraftName(e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Amount</label>
        <input value={draftAmount} onChange={(e) => setDraftAmount(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" style={inputStyle} />

        {draftType === "transfer" ? (
          <>
            <label style={labelStyle}>From</label>
            <select value={draftFromAccountId} onChange={(e) => setDraftFromAccountId(e.target.value)} style={inputStyle}>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <label style={labelStyle}>To</label>
            <select value={draftToAccountId} onChange={(e) => setDraftToAccountId(e.target.value)} style={inputStyle}>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
            <label style={labelStyle}>Account</label>
            <select value={draftAccountId} onChange={(e) => setDraftAccountId(e.target.value)} style={inputStyle}>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </>
        )}

        <label style={labelStyle}>Date</label>
        <input type="date" value={draftDate} onChange={(e) => setDraftDate(e.target.value)} style={dateInputStyle} />

        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button onClick={cancelOccurrence} style={{ flex: 1, padding: "0.55rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Cancel
          </button>
          <button
            onClick={saveOccurrence}
            disabled={!draftName.trim() || !parseInt(draftAmount, 10)}
            style={{
              flex: 1,
              padding: "0.55rem",
              borderRadius: 8,
              border: "none",
              background: draftName.trim() && parseInt(draftAmount, 10) ? ACCENT : DISABLED,
              color: draftName.trim() && parseInt(draftAmount, 10) ? "#fff" : DISABLED_TEXT,
              fontSize: 13,
              fontWeight: 700,
              cursor: draftName.trim() && parseInt(draftAmount, 10) ? "pointer" : "not-allowed",
            }}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", overflow: "hidden", borderBottom: `1px dashed ${LINE}` }}>
      {canSeries && (
        <button
          onClick={handleSeriesTap}
          aria-label={`Edit series for ${t.name}`}
          style={{
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
            gap: 2,
          }}
        >
          <Repeat size={15} />
          Edit series
        </button>
      )}
      <button
        onClick={() => setConfirmDelete(true)}
        aria-label={`Delete ${t.name}`}
        style={{
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
          gap: 2,
        }}
      >
        <Trash2 size={15} />
        Delete
      </button>
      <div
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
        onTouchEnd={onDragEnd}
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseMove={(e) => draggingRef.current && onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={() => draggingRef.current && onDragEnd()}
        style={{
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
          touchAction: "pan-y",
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: rowAccentColor, flexShrink: 0, boxShadow: `0 0 0 2px ${bg}` }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: isCanceled ? MUTED : TEXT, textDecoration: isCanceled ? "line-through" : "none" }}>{t.name}</div>
            {t.templateId && <Repeat size={10} color={GOLD} aria-label="Recurring" style={{ flexShrink: 0 }} />}
          </div>
          <div style={{ fontSize: 10.5, color: MUTED, marginTop: 1 }}>
            {t.type === "transfer" ? (
              <>
                {fmtDate(t.date)} · Transfer · {accountName(t.fromAccountId)} → {accountName(t.toAccountId)}
              </>
            ) : (
              <>
                {fmtDate(t.date)} · {TYPES[t.type].label} · {accountName(t.accountId)}
                {t.templateId ? " · recurring" : ""}
              </>
            )}
          </div>
        </div>
        <div style={{ textAlign: "right", paddingRight: 2 }}>
          <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, fontWeight: 600, color: t.type === "transfer" ? TRANSFER : TYPES[t.type].color, whiteSpace: "nowrap" }}>
            {t.type === "transfer" ? "⇄ " : TYPES[t.type].sign > 0 ? "+" : "-"}
            {fmt(t.amount)}
          </div>
          {balanceAfter !== undefined && (
            <div style={{ fontSize: 9.5, color: balanceAfter < 0 ? DEBIT : MUTED, fontWeight: balanceAfter < 0 ? 700 : 400, whiteSpace: "nowrap", marginTop: 0 }}>
              {balanceAfter < 0 && "⚠ "}
              {fmt(balanceAfter)} bal
            </div>
          )}
          {onCycleStatus && <StatusBadge t={t} onCycle={onCycleStatus} small />}
        </div>
      </div>
      {confirmDelete && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 70 }}
          onClick={() => {
            setConfirmDelete(false);
            closeSwipe();
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: SURFACE, width: "100%", maxWidth: 420, borderRadius: "16px 16px 0 0", padding: "1.25rem", boxSizing: "border-box" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Delete this transaction?</div>
            <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 14 }}>This can't be undone from here, but Undo on the Ledger tab will still restore it.</div>

            <div style={{ background: SURFACE_2, borderRadius: 8, padding: "0.75rem 0.85rem", marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 6 }}>{t.name}</div>
              <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 2 }}>{fmtDate(t.date)}</div>
              <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 2 }}>
                {t.type === "transfer" ? (
                  <>
                    Transfer · {accountName(t.fromAccountId)} → {accountName(t.toAccountId)}
                  </>
                ) : (
                  <>
                    {TYPES[t.type].label} · {accountName(t.accountId)}
                  </>
                )}
              </div>
              <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 700, color: t.type === "transfer" ? TRANSFER : TYPES[t.type].color, marginTop: 6 }}>
                {t.type === "transfer" ? "⇄ " : TYPES[t.type].sign > 0 ? "+" : "-"}
                {fmt(t.amount)}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  setConfirmDelete(false);
                  closeSwipe();
                }}
                style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: `1px solid ${LINE}`, background: "none", color: TEXT, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  remove(t.id);
                  setConfirmDelete(false);
                }}
                style={{ flex: 1, padding: "0.75rem", borderRadius: 8, border: "none", background: DEBIT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function StatusBadge({ t, onCycle, small = false }) {
  const status = getStatus(t, toISODate(new Date()));

  const handleClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const direction = clickX < rect.width * 0.3 ? -1 : 1;
    onCycle(t.id, direction);
  };

  return (
    <button
      onClick={handleClick}
      onTouchStart={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      aria-label={`Status: ${STATUSES[status].label}. Tap left to go back, right to advance.`}
      style={{
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
        WebkitTouchCallout: "none",
      }}
    >
      {STATUSES[status].label}
    </button>
  );
}

function ChangeBadge({ value, favorableWhenPositive }) {
  if (value === null) {
    return <span style={{ fontSize: 11, color: MUTED }}>first tracked</span>;
  }
  if (value === 0) {
    return <span style={{ fontSize: 11, color: MUTED }}>no change</span>;
  }
  const isIncrease = value > 0;
  const isFavorable = favorableWhenPositive ? isIncrease : !isIncrease;
  const color = isFavorable ? CREDIT : DEBIT;
  const arrow = isIncrease ? "\u25B2" : "\u25BC";
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color, whiteSpace: "nowrap" }}>
      {arrow} {fmt(Math.abs(value))}
    </span>
  );
}

function SectionLabel({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: MUTED, fontWeight: 700 }}>
      {icon}
      {text}
    </div>
  );
}

function EmptyNote({ children }) {
  return (
    <div style={{ fontSize: 13, color: MUTED, marginTop: 8, padding: "0.75rem", background: SURFACE, border: `1px dashed ${LINE}`, borderRadius: 6 }}>
      {children}
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12, color: MUTED, fontWeight: 600, marginTop: 10, marginBottom: 4 };
const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "0.55rem 0.65rem",
  borderRadius: 6,
  border: `1px solid ${LINE}`,
  fontSize: 14,
  fontFamily: "-apple-system, sans-serif",
  background: SURFACE_2,
  color: TEXT,
};
const dateInputStyle = {
  ...inputStyle,
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  display: "block",
  appearance: "none",
  WebkitAppearance: "none",
};

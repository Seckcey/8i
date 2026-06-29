import {
  BarChart3,
  CreditCard,
  History,
  LayoutDashboard,
  ReceiptText,
  Settings,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export const brand = {
  product: "8i Wallet",
  currency: "8i Credits",
  parent: "8 West Ventures",
  tagline: "One wallet for every AI model.",
};

export type NavItem = {
  href: string;
  label: string;
};

export const primaryNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/wallet", label: "Wallet" },
  { href: "/usage", label: "Usage" },
  { href: "/settings", label: "Settings" },
];

export const legalNav: NavItem[] = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export type CreditPackage = {
  name: string;
  price: string;
  credits: string;
  description: string;
  features: string[];
};

export const creditPackages: CreditPackage[] = [
  {
    name: "Starter",
    price: "$10",
    credits: "1,000",
    description: "A small prepaid balance for trying AI workflows.",
    features: [
      "Prepaid 8i Credits",
      "Usage history visibility",
      "No cash value or transfers",
    ],
  },
  {
    name: "Growth",
    price: "$45",
    credits: "5,000",
    description: "A larger prepaid balance for regular business use.",
    features: [
      "Prepaid 8i Credits",
      "Shared wallet roadmap",
      "Transparent deductions",
    ],
  },
  {
    name: "Team",
    price: "$99",
    credits: "12,000",
    description: "A prepaid balance for heavier internal AI usage.",
    features: [
      "Prepaid 8i Credits",
      "Admin review roadmap",
      "Provider usage roadmap",
    ],
  },
];

export type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: "Available balance",
    value: "0 8i Credits",
    detail: "Wallet ledger not connected yet",
    icon: WalletCards,
  },
  {
    label: "AI usage",
    value: "0 requests",
    detail: "Provider router planned for later phase",
    icon: BarChart3,
  },
  {
    label: "Purchases",
    value: "0 sessions",
    detail: "Stripe Checkout not connected yet",
    icon: ReceiptText,
  },
  {
    label: "Account status",
    value: "App shell",
    detail: "Supabase Auth not connected yet",
    icon: ShieldCheck,
  },
];

export const accountSections = [
  {
    title: "Profile",
    description: "Business profile and contact details will live here.",
    icon: Settings,
  },
  {
    title: "Billing",
    description: "Stripe customer and checkout records will appear later.",
    icon: CreditCard,
  },
  {
    title: "History",
    description: "Wallet ledger and provider usage records will be linked here.",
    icon: History,
  },
];

export const appRoutes = [
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "Balance, purchases, and usage summary.",
    icon: LayoutDashboard,
  },
  {
    href: "/wallet",
    title: "Wallet",
    description: "8i Credit balance and ledger history.",
    icon: WalletCards,
  },
  {
    href: "/usage",
    title: "Usage",
    description: "AI provider request and deduction history.",
    icon: BarChart3,
  },
  {
    href: "/settings",
    title: "Settings",
    description: "Account, business, and billing preferences.",
    icon: Settings,
  },
];

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Activity,
  Settings,
  Bell,
  Shield,
  FileText,
  LogOut,
  ChevronRight,
  Smartphone,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import { ScoreBadge } from "@/components/score/ScoreBadge";
import { statusConfig } from "@/lib/mock-data";
import { getUserProfile, type UserProfile } from "@/lib/user-profile";

const settingsItems = [
  {
    icon: Smartphone,
    label: "Conectar Apple Health / Google Fit",
    subtitle: null,
    danger: false,
  },
  {
    icon: Bell,
    label: "Notificacoes",
    subtitle: null,
    danger: false,
  },
  {
    icon: Shield,
    label: "Minha apolice",
    subtitle: null,
    danger: false,
  },
  {
    icon: FileText,
    label: "Privacidade e dados",
    subtitle: "(LGPD)",
    danger: false,
  },
  {
    icon: FileText,
    label: "Termos de uso",
    subtitle: null,
    danger: false,
  },
  {
    icon: LogOut,
    label: "Sair",
    subtitle: null,
    danger: true,
  },
];

export default function PerfilPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  useEffect(() => { getUserProfile().then(setUser); }, []);
  const u = user;
  const userStatus = statusConfig[u?.status ?? "bronze"];
  return (
    <AppShell>
      <div className="flex flex-col min-h-screen pb-24">
        {/* User Header */}
        <motion.section
          className="flex flex-col items-center pt-10 pb-6 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
            style={{
              background: `linear-gradient(135deg, ${userStatus.color}40, ${userStatus.color}20)`,
              border: `3px solid ${userStatus.color}`,
            }}
          >
            <User className="w-10 h-10" style={{ color: userStatus.color }} />
          </div>

          {/* Name + age */}
          <h1 className="text-xl font-bold text-[#202124]">{u?.name ?? ""}</h1>
          <p className="text-sm text-[#5F6368] mt-0.5">{u?.age ?? 0} anos</p>

          {/* Score Badge */}
          <div className="mt-3">
            <ScoreBadge status={u?.status ?? "bronze"} />
          </div>

          {/* Total score */}
          <p className="text-sm text-[#5F6368] mt-2">
            <span className="font-semibold text-[#202124]">{u?.score ?? 0}</span> pontos
          </p>
        </motion.section>

        <div className="flex flex-col gap-4 px-4">
          {/* Stats Row */}
          <motion.div
            className="grid grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {[
              {
                value: u?.streak ?? 0,
                label: "Sequencia",
                unit: "dias",
                emoji: "\u{1F525}",
              },
              {
                value: u?.challengesCompleted ?? 0,
                label: "Desafios",
                unit: "concluidos",
                emoji: "\u{1F3C6}",
              },
              {
                value: u?.pointsThisMonth ?? 0,
                label: "Este mes",
                unit: "pts",
                emoji: "\u26A1",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-2xl py-4 px-2"
                style={{ backgroundColor: "#F8F9FA" }}
              >
                <span className="text-lg mb-1">{stat.emoji}</span>
                <span className="text-xl font-bold text-[#202124]">{stat.value}</span>
                <span className="text-[10px] text-[#9AA0A6] mt-0.5">
                  {stat.unit}
                </span>
                <span className="text-[10px] text-[#5F6368] mt-0.5">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Settings List */}
          <motion.div
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#F8F9FA" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {settingsItems.map((item, i) => {
              const Icon = item.icon;
              const isLast = i === settingsItems.length - 1;

              return (
                <button
                  key={i}
                  className={`w-full flex items-center gap-3 py-4 px-4 text-left transition-colors hover:bg-[#F8F9FA] ${
                    !isLast ? "border-b border-[#DADCE0]" : ""
                  }`}
                >
                  <Icon
                    className="w-5 h-5 flex-shrink-0"
                    style={{
                      color: item.danger ? "#FF453A" : "#5F6368",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-sm ${
                        item.danger
                          ? "text-red-500 font-medium"
                          : "text-[#202124]"
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.subtitle && (
                      <span className="text-xs text-[#9AA0A6] ml-1">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                  {!item.danger && (
                    <ChevronRight className="w-4 h-4 text-[#DADCE0] flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}

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
  Download,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import { ScoreBadge } from "@/components/score/ScoreBadge";
import { statusConfig } from "@/lib/mock-data";
import { getUserProfile, type UserProfile } from "@/lib/user-profile";
import { DataExporter, type LGPDStatus } from "@/lib/health/data-export";

const settingsItems = [
  {
    icon: Smartphone,
    label: "Conexoes e sensores",
    subtitle: null,
    href: "/config" as string | null,
    danger: false,
  },
  {
    icon: Bell,
    label: "Notificacoes",
    subtitle: null,
    href: "/config" as string | null,
    danger: false,
  },
  {
    icon: Shield,
    label: "Minha apolice",
    subtitle: null,
    href: "/seguro" as string | null,
    danger: false,
  },
  {
    icon: FileText,
    label: "Privacidade e dados",
    subtitle: "(LGPD)",
    href: "/config" as string | null,
    danger: false,
  },
  {
    icon: FileText,
    label: "Termos de uso",
    subtitle: null,
    href: "/config" as string | null,
    danger: false,
  },
  {
    icon: LogOut,
    label: "Sair",
    subtitle: null,
    href: null,
    danger: true,
  },
];

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [exporting, setExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const lgpd: LGPDStatus = DataExporter.getLGPDStatus();

  useEffect(() => { getUserProfile().then(setUser); }, []);
  const u = user;
  const userStatus = statusConfig[u?.status ?? "bronze"];

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await DataExporter.exportAllData();
      await DataExporter.downloadAsJson(data);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAll = async () => {
    await DataExporter.deleteAllData();
    setShowDeleteConfirm(false);
    window.location.reload();
  };
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

          {/* Selo LGPD */}
          <motion.div
            className="rounded-2xl p-4 border"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#34A853",
              borderWidth: 2,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5" style={{ color: "#34A853" }} />
              <span className="text-sm font-bold text-[#202124]">
                Conformidade LGPD
              </span>
              <CheckCircle2 className="w-4 h-4" style={{ color: "#34A853" }} />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {lgpd.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-base leading-none mt-0.5">{f.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#202124]">
                      {f.name}
                    </p>
                    <p className="text-[10px] text-[#5F6368] leading-tight">
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p
              className="text-xs font-medium text-center"
              style={{ color: "#34A853" }}
            >
              Seus dados nunca saem do seu celular
            </p>
          </motion.div>

          {/* Seus Dados */}
          <motion.div
            className="rounded-2xl p-4 border"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#DADCE0" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            <h3 className="text-sm font-bold text-[#202124] mb-3">
              Seus Dados
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-50"
                style={{ backgroundColor: "#1A73E8" }}
              >
                <Download className="w-4 h-4" />
                {exporting ? "Exportando..." : "Exportar meus dados"}
              </button>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Apagar todos os dados
                </button>
              ) : (
                <div className="flex flex-col gap-2 p-3 rounded-xl bg-red-50">
                  <p className="text-xs text-red-600 text-center font-medium">
                    Tem certeza? Todos os seus dados serao apagados
                    permanentemente.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-2 rounded-lg text-xs font-medium text-[#5F6368] border border-[#DADCE0]"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDeleteAll}
                      className="flex-1 py-2 rounded-lg text-xs font-medium text-white bg-red-500"
                    >
                      Apagar tudo
                    </button>
                  </div>
                </div>
              )}
            </div>
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

              const inner = (
                <>
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
                </>
              );

              const baseClass = `w-full flex items-center gap-3 py-4 px-4 text-left transition-colors hover:bg-[#F8F9FA] ${
                !isLast ? "border-b border-[#DADCE0]" : ""
              }`;

              if (item.href) {
                return (
                  <Link key={i} href={item.href} className={baseClass}>
                    {inner}
                  </Link>
                );
              }

              return (
                <button
                  key={i}
                  className={baseClass}
                  onClick={() => {
                    if (item.danger) {
                      localStorage.removeItem("vitascore-onboarded");
                      router.push("/onboarding");
                    }
                  }}
                >
                  {inner}
                </button>
              );
            })}
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}

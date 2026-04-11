"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Lock, ChevronLeft } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import ChallengeCard from "@/components/gamification/ChallengeCard";
import { mockChallenges, mockAchievements } from "@/lib/mock-data";

const tabs = [
  { key: "active", label: "Ativos" },
  { key: "completed", label: "Concluidos" },
  { key: "available", label: "Disponiveis" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function DesafiosPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("active");

  return (
    <AppShell>
      <div className="flex flex-col min-h-screen pb-24">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white shadow-sm border-b border-[#DADCE0] px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h1 className="text-lg font-semibold text-[#202124]">Desafios</h1>
          </div>
        </header>

        <div className="flex flex-col gap-4 px-4 pt-4">
          {/* Tab bar */}
          <div className="flex rounded-xl bg-[#F8F9FA] p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className="relative flex-1 py-2 text-sm font-medium text-center transition-colors"
                style={{
                  color: activeTab === tab.key ? "#202124" : "#5F6368",
                }}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-blue-500"
                    layoutId="tab-indicator"
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex flex-col gap-3">
            {activeTab === "active" &&
              mockChallenges.active.map((challenge, i) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ChallengeCard challenge={challenge} />
                </motion.div>
              ))}

            {activeTab === "completed" &&
              mockChallenges.completed.map((challenge, i) => (
                <motion.div
                  key={challenge.id}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ChallengeCard challenge={challenge} />
                  {/* Checkmark overlay */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-green-500"
                    >
                      <path
                        d="M3 8.5L6.5 12L13 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </motion.div>
              ))}

            {activeTab === "available" &&
              mockChallenges.available.map((challenge, i) => (
                <motion.div
                  key={challenge.id}
                  className="relative opacity-75"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.75, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ChallengeCard challenge={challenge} />
                  <motion.button
                    className="w-full mt-2 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-semibold border border-blue-500/30"
                    whileTap={{ scale: 0.97 }}
                  >
                    Iniciar desafio
                  </motion.button>
                </motion.div>
              ))}
          </div>

          {/* Conquistas Section */}
          <section className="mt-4">
            <h2 className="text-base font-semibold text-[#202124] mb-3">Conquistas</h2>
            <div className="grid grid-cols-4 gap-3">
              {mockAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  className="flex flex-col items-center gap-1.5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`relative w-14 h-14 rounded-2xl flex items-center justify-center ${
                      achievement.unlocked
                        ? "bg-[#E8EAED]"
                        : "bg-[#F8F9FA] opacity-40 grayscale"
                    }`}
                  >
                    <span className={`text-2xl ${achievement.unlocked ? "" : "opacity-50"}`}>
                      {achievement.icon}
                    </span>
                    {!achievement.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-[#9AA0A6]" />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-[10px] text-center leading-tight ${
                      achievement.unlocked ? "text-[#5F6368]" : "text-[#9AA0A6]"
                    }`}
                  >
                    {achievement.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Activity, Smartphone, Shield, User } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/atividade", label: "Atividade", icon: Activity },
  { href: "/digital", label: "Digital", icon: Smartphone },
  { href: "/seguro", label: "Seguro", icon: Shield },
  { href: "/perfil", label: "Perfil", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-16 pb-[env(safe-area-inset-bottom)]"
      style={{
        backgroundColor: "#1C1C1E",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="mx-auto flex h-full max-w-md items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5"
            >
              {isActive && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute -top-1 h-[3px] w-5 rounded-full"
                  style={{ backgroundColor: "#1877F2" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              <motion.div
                animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  style={{
                    color: isActive ? "#1877F2" : "rgba(235,235,245,0.3)",
                  }}
                />
              </motion.div>

              <span
                className="text-[10px] font-medium"
                style={{
                  color: isActive ? "#1877F2" : "rgba(235,235,245,0.3)",
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

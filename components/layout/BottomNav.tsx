"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Activity, Smartphone, Shield, User } from "lucide-react";

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
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #DADCE0",
        boxShadow: "0 -1px 3px rgba(0,0,0,0.06)",
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
              <Icon
                size={24}
                strokeWidth={isActive ? 2.2 : 1.8}
                style={{
                  color: isActive ? "#1A73E8" : "#5F6368",
                }}
              />

              <span
                className="text-[10px] font-medium"
                style={{
                  color: isActive ? "#1A73E8" : "#5F6368",
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

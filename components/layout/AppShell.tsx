"use client";

import BottomNav from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="mx-auto max-w-md min-h-screen bg-white">
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}

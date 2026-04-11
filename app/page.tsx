"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/onboarding");
  }, [router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white gap-4">
      <img src="/Borboleta.png" alt="SaluFlow" className="w-20 h-20 object-contain animate-pulse" />
      <span className="font-display text-2xl font-bold text-[#1A73E8]">SaluFlow</span>
    </div>
  );
}

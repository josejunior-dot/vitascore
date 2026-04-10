"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/onboarding");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#0A0A0A]">
      <div className="animate-pulse font-display text-3xl font-bold text-[#1877F2]">
        VitaScore
      </div>
    </div>
  );
}

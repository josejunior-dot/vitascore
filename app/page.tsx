"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/onboarding");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <img src="/logo.png" alt="SaluFlow" className="w-[80vw] max-w-md object-contain animate-pulse" />
    </div>
  );
}

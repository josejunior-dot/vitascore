"use client";

import { motion } from "framer-motion";
import { Shield, Calendar, Banknote } from "lucide-react";
import Link from "next/link";

interface InsuranceDiscountCardProps {
  discount: number;
  savings: number;
  daysToRenewal: number;
}

export default function InsuranceDiscountCard({
  discount,
  savings,
  daysToRenewal,
}: InsuranceDiscountCardProps) {
  const barProgress = Math.min((discount / 15) * 100, 100);

  return (
    <Link href="/seguro">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative cursor-pointer overflow-hidden rounded-2xl p-5"
        style={{
          background: "#FFFFFF",
          border: "1px solid #DADCE0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* Blue gradient accent bar at top */}
        <div
          className="absolute left-0 right-0 top-0 h-1"
          style={{
            background: "linear-gradient(90deg, #1A73E8, #00897B)",
          }}
        />

        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "rgba(26,115,232,0.1)" }}
          >
            <Shield size={20} color="#1A73E8" />
          </div>
          <p
            className="text-sm font-medium"
            style={{ color: "#5F6368" }}
          >
            Desconto no Seguro
          </p>
        </div>

        {/* Discount value */}
        <div className="mb-1">
          <motion.span
            className="text-4xl font-bold"
            style={{ color: "#34A853" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {discount}%
          </motion.span>
        </div>
        <p
          className="mb-4 text-sm"
          style={{ color: "#5F6368" }}
        >
          de desconto na proxima renovacao
        </p>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span
              className="text-xs"
              style={{ color: "#5F6368" }}
            >
              Progresso
            </span>
            <span
              className="text-xs"
              style={{ color: "#5F6368" }}
            >
              Max 15%
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full"
            style={{ background: "#E8F0FE" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, #1A73E8, #34A853)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${barProgress}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            />
          </div>
        </div>

        {/* Bottom stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} style={{ color: "#5F6368" }} />
            <span
              className="text-xs"
              style={{ color: "#5F6368" }}
            >
              {daysToRenewal} dias para renovacao
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Banknote size={14} color="#34A853" />
            <span className="text-xs font-medium" style={{ color: "#34A853" }}>
              R$ {savings.toFixed(2).replace(".", ",")} economia
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

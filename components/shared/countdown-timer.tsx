"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  targetDate: Date | string;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function CountdownTimer({ targetDate, label, size = "md" }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return <span className="text-muted-foreground">انتهى</span>;
  }

  const sizeClasses = size === "sm" ? "text-lg" : size === "lg" ? "text-4xl" : "text-2xl";
  const boxSize = size === "sm" ? "w-10 h-10" : size === "lg" ? "w-20 h-20" : "w-14 h-14";
  const labelSize = size === "sm" ? "text-[8px]" : size === "lg" ? "text-xs" : "text-[10px]";

  const items = [
    { value: days, label: "يوم" },
    { value: hours, label: "ساعة" },
    { value: minutes, label: "دقيقة" },
    { value: seconds, label: "ثانية" },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <div className="flex gap-2" dir="ltr">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center gap-1"
          >
            <div className={`${boxSize} rounded-2xl glass-card flex items-center justify-center`}>
              <span className={`${sizeClasses} font-black tabular-nums`}>
                {String(item.value).padStart(2, "0")}
              </span>
            </div>
            <span className={`${labelSize} text-muted-foreground uppercase tracking-wider`}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

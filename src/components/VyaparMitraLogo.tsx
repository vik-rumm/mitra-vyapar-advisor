import React from "react";
import { cn } from "@/lib/utils";

interface VyaparMitraLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  subtitle?: string;
  className?: string;
}

export function VyaparMitraLogo({
  size = "md",
  showText = true,
  subtitle,
  className,
}: VyaparMitraLogoProps) {
  const iconSizes = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-12 text-base",
    xl: "size-14 text-lg",
  };

  const svgSizes = {
    sm: 18,
    md: 22,
    lg: 26,
    xl: 30,
  };

  const textSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  return (
    <div className={cn("inline-flex items-center gap-3 select-none", className)}>
      {/* Custom Modern Logo Symbol Emblem */}
      <div
        className={cn(
          "relative shrink-0 grid place-items-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-105",
          iconSizes[size],
        )}
      >
        <svg
          width={svgSizes[size]}
          height={svgSizes[size]}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          {/* Growth Trend Line & Store Roof */}
          <path
            d="M3 17L8.5 11.5L12.5 15.5L21 7"
            stroke="white"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 7H21V12"
            stroke="white"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* AI Gold Sparkle Star accent */}
          <circle cx="8.5" cy="11.5" r="1.5" fill="#FBBF24" />
          <path
            d="M12 2.5C12 2.5 12.8 4.2 14.5 5C14.5 5 12.8 5.8 12 7.5C12 7.5 11.2 5.8 9.5 5C9.5 5 11.2 4.2 12 2.5Z"
            fill="#FBBF24"
          />
        </svg>

        {/* Live Active Status Ring */}
        <span className="absolute -bottom-0.5 -right-0.5 flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-3 rounded-full bg-emerald-500 border-2 border-white" />
        </span>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={cn("font-black tracking-tight text-slate-900", textSizes[size])}>
              Vyapar
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                -Mitra
              </span>
            </span>
            <span className="rounded-full bg-indigo-100 border border-indigo-200 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700 shadow-xs">
              AI
            </span>
          </div>
          {subtitle && (
            <span className="text-[11px] font-semibold text-slate-500 mt-0.5">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}

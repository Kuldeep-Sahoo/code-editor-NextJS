"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import React, { useEffect, useRef, useState } from "react";
import { THEMES } from "../_constants";
import {
  CircleOff,
  Github,
  Laptop,
  Moon,
  Cloud,
  Sun,
  Palette,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useMounted from "@/hooks/useMounted";

const THEME_ICONS: Record<string, React.ReactNode> = {
  "vs-dark": <Moon className="size-3 sm:size-4" />,
  "vs-light": <Sun className="size-3 sm:size-4" />,
  "github-dark": <Github className="size-3 sm:size-4" />,
  monokai: <Laptop className="size-3 sm:size-4" />,
  "solarized-dark": <Cloud className="size-3 sm:size-4" />,
};

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useCodeEditorStore();
  const dropDownRef = useRef<HTMLDivElement>(null);
  const currentTheme = THEMES.find((t) => t.id === theme);
  const mounted = useMounted();

  useEffect(() => {
    const handleClickOutSide = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-auto" ref={dropDownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md
                   bg-[#1e1e2e]/80 border border-gray-800/50 hover:border-gray-700
                   transition-all text-xs sm:text-sm"
      >
        <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
        <span className="text-gray-300 truncate max-w-[70px] sm:max-w-none">
          {currentTheme?.label}
        </span>
        <div
          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-600"
          style={{ background: currentTheme?.color }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-48 sm:w-56 bg-[#1e1e2e]/95 rounded-lg border border-[#313244] shadow-xl z-50 py-2 backdrop-blur-xl"
          >
            <p className="px-3 pb-2 text-xs text-gray-400 border-b border-gray-700/40">
              Select Theme
            </p>
            {THEMES.map((t) => (
              <button
                key={t.id}
                className={`flex items-center gap-2 px-3 py-2 w-full text-left text-sm rounded-md
                            hover:bg-[#262637] transition-all ${
                              theme === t.id
                                ? "bg-blue-500/10 text-blue-400"
                                : "text-gray-300"
                            }`}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
              >
                {THEME_ICONS[t.id] || <CircleOff className="w-4 h-4" />}
                <span className="flex-1 truncate">{t.label}</span>
                <div
                  className="w-3 h-3 rounded-full border border-gray-600"
                  style={{ background: t.color }}
                />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;

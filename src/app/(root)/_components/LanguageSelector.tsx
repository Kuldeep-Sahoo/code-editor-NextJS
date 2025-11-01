"use client";
import useMounted from "@/hooks/useMounted";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import React, { useEffect, useRef } from "react";
import { LANGUAGE_CONFIG } from "../_constants";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronDownIcon, Lock, Sparkles } from "lucide-react";

const LanguageSelector = ({ hasAccess }: { hasAccess: boolean }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const mounted = useMounted();
  const { language, setLanguage } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLanguageObj = LANGUAGE_CONFIG[language];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (langId: string) => {
    if (!hasAccess && langId !== "javascript") return;
    setLanguage(langId);
    setIsOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className="relative w-auto" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md
                    bg-[#1e1e2e]/80 border border-gray-800/50 hover:border-gray-700
                    transition-all text-xs sm:text-sm ${
                      !hasAccess && language !== "javascript"
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                    }`}
      >
        <div className="size-5 sm:size-6 rounded-md bg-gray-800/50 p-0.5">
          <Image
            src={currentLanguageObj.logoPath}
            alt="language"
            width={24}
            height={24}
            className="object-contain w-full h-full"
          />
        </div>
        <span className="text-gray-300 truncate max-w-[20px] sm:max-w-none">
          {currentLanguageObj.label}
        </span>
        <ChevronDownIcon
          className={`size-3.5 sm:size-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-52 sm:w-64 bg-[#1e1e2e]/95 rounded-lg border border-[#313244] shadow-xl z-50 py-2 backdrop-blur-xl"
          >
            <p className="px-3 pb-2 text-xs text-gray-400 border-b border-gray-700/40">
              Select Language
            </p>

            <div className="max-h-[250px] overflow-y-auto">
              {Object.values(LANGUAGE_CONFIG).map((lang) => {
                const isLocked = !hasAccess && lang.id !== "javascript";
                return (
                  <button
                    key={lang.id}
                    className={`flex items-center gap-2 px-3 py-2 w-full text-left text-sm rounded-md transition-all
                      ${language === lang.id ? "bg-blue-500/10 text-blue-400" : "text-gray-300"}
                      ${isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-[#262637]"}`}
                    onClick={() => handleLanguageSelect(lang.id)}
                    disabled={isLocked}
                  >
                    <Image
                      width={20}
                      height={20}
                      src={lang.logoPath}
                      alt={lang.label}
                      className="rounded-sm"
                    />
                    <span className="flex-1 truncate">{lang.label}</span>
                    {isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-gray-500" />
                    ) : (
                      language === lang.id && (
                        <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                      )
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;

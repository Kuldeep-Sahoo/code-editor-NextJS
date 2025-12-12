"use client";

import { Blocks, Github } from "lucide-react";
import Link from "next/link";

function Footer() {

  return (
    <footer className="relative mt-auto">
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent to-transparent" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Blocks className="size-5" />
            <span>Built for developers, by developers</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/Kuldeep-Sahoo/code-editor-NextJS"
              target="_blank"
              className="flex gap-2 text-gray-400 hover:text-green-300 transition-colors"
            >
              <Github />
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

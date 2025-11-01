import React from "react";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import SnippetCard from "./SnippetCard";
import SnippetsPageSkeleton from "./SnippetsPageSkeleton";

const ThreeSnippetsPreview = () => {
  const snippets = useQuery(api.snippets.get3Snippets);
  if (snippets === undefined) {
      return (
        <div className="min-h-screen">
          <SnippetsPageSkeleton />
        </div>
      );
    }
  return (
    <>
      <motion.div className={`grid-cols-1 max-w-3xl mx-auto`} layout>
        <AnimatePresence mode="popLayout">
          {snippets.map((snippet) => (
            <SnippetCard key={snippet._id} snippet={snippet} />
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default ThreeSnippetsPreview;

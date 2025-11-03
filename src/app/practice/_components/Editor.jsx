"use client";
import React from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode, language }) {
    return (
        <div className="h-full border border-gray-800 rounded-md overflow-hidden">
            <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(val) => setCode(val)}
                theme="vs-dark"
                options={{
                    fontSize: 14,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: true,
                    automaticLayout: true,
                    wordWrap: "on",
                    formatOnPaste: true,
                    formatOnType: true,
                    autoClosingBrackets: "always",
                    autoClosingQuotes: "always",
                    suggestOnTriggerCharacters: true,
                    acceptSuggestionOnEnter: "on",
                    tabCompletion: "on",
                    quickSuggestions: true,
                    snippetSuggestions: "top",
                    parameterHints: { enabled: true },
                    suggestSelection: "first",
                    cursorSmoothCaretAnimation: "on",
                    cursorBlinking: "smooth",
                    lineNumbers: "on",
                    folding: true,
                    renderWhitespace: "selection",
                    smoothScrolling: true,
                    mouseWheelZoom: true,

                }}
            />
        </div>
    );
}

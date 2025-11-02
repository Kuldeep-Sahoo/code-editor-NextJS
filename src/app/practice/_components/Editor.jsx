"use client";
import React from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode, language }) {
    return (
        <div className="h-full border border-gray-800 rounded-md overflow-hidden">
            <Editor
                height="90%"
                language={language}
                value={code}
                onChange={(val) => setCode(val)}
                theme="vs-dark"
                minimap={true}
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    );
}

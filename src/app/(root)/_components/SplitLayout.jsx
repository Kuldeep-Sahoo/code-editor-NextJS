"use client";
import { useRef, useState, useEffect } from "react";
import Split from "react-split";

export default function SplitLayout({ editorPanel, outputPanel }) {
    const splitRef = useRef(null);
    const [isClosed, setIsClosed] = useState(false);

    const toggleOutput = () => {
        setIsClosed((prev) => !prev);
    };

    // Automatically adjust split sizes when toggled
    useEffect(() => {
        if (!splitRef.current) return;

        // Access Split.js instance
        const sizes = isClosed ? [100, 0] : [60, 40];
        splitRef.current.split.setSizes(sizes);
    }, [isClosed]);

    return (
        <>
            {/* Mobile View - Stacked */}
            <div className="flex flex-col gap-4 lg:hidden h-full p-4">
                <div className="bg-gray-900 rounded-xl overflow-hidden h-[50vh]">
                    {editorPanel}
                </div>

                {!isClosed && (
                    <div className="bg-gray-800 rounded-xl overflow-hidden h-[45vh] relative">
                        <button
                            onClick={toggleOutput}
                            className="absolute top-2 right-2 z-50 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded-md text-white shadow-md"
                        >
                            Close
                        </button>
                        {outputPanel}
                    </div>
                )}

                {isClosed && (
                    <button
                        onClick={toggleOutput}
                        className="mx-auto mt-4 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 rounded-md text-white shadow-md"
                    >
                        Show Output
                    </button>
                )}
            </div>

            {/* Desktop View - Resizable Split */}
            <div className="hidden lg:block h-full p-4 relative">
                <Split
                    ref={splitRef}
                    className="flex h-full gap-4 transition-all duration-300"
                    sizes={[60, 40]}
                    minSize={[300, 0]}
                    gutterSize={8}
                    gutterAlign="center"
                    snapOffset={0}
                    direction="horizontal"
                    cursor="col-resize"
                >
                    {/* Left Panel (Editor) */}
                    <div className="bg-gray-900 rounded-xl overflow-hidden h-full relative">
                        <button
                            onClick={toggleOutput}
                            className="hidden md:block absolute top-5 left-64 z-50 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded-md text-white shadow-md"
                        >
                            {isClosed ? "Show Output" : "Hide Output"}
                        </button>
                        {editorPanel}
                    </div>

                    {/* Right Panel (Output) */}
                    <div
                        className={`bg-gray-800 rounded-xl overflow-hidden h-full transition-all duration-300 ${isClosed ? "opacity-0 pointer-events-none" : "opacity-100"
                            }`}
                    >
                        {outputPanel}
                    </div>
                </Split>
            </div>
        </>
    );
}

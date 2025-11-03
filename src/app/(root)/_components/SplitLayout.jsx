"use client";
import { useRef } from "react";
import Split from "react-split";

export default function SplitLayout({ editorPanel, outputPanel }) {
    const splitRef = useRef(null);

    return (
        <>
            {/* Mobile View - Stacked */}
            <div className="flex flex-col gap-4 lg:hidden h-full p-4">
                <div className="bg-gray-900 rounded-xl overflow-hidden h-[50vh]">
                    {editorPanel}
                </div>
                <div className="bg-gray-800 rounded-xl overflow-hidden h-[45vh]">
                    {outputPanel}
                </div>
            </div>

            {/* Desktop View - Resizable Split */}
            <div className="hidden lg:block h-full p-4">
                <Split
                    ref={splitRef}
                    className="flex h-full gap-4"
                    sizes={[60, 40]}
                    minSize={[300, 250]}
                    gutterSize={8}
                    gutterAlign="center"
                    snapOffset={0}
                    direction="horizontal"
                    cursor="col-resize"
                >
                    {/* Left Panel (Editor) */}
                    <div className="bg-gray-900 rounded-xl overflow-hidden h-full">
                        {editorPanel}
                    </div>

                    {/* Right Panel (Output) */}
                    <div className="bg-gray-800 rounded-xl overflow-hidden h-full">
                        {outputPanel}
                    </div>
                </Split>
            </div>
        </>
    );
}

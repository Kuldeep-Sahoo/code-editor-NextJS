"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import React, { useState, useEffect, useRef } from "react";

const UserChatWithAdmin = ({ userId, convexUser }) => {
    const chat = useQuery(api.users.getChat, { userId: userId ?? "" });
    const sendMessage = useMutation(api.users.sendMessage);
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    const handleSend = async () => {
        if (!input.trim()) return;
        await sendMessage({
            userId,
            sender: "user",
            senderId: convexUser?._id,
            senderName: convexUser?.name || "User",
            message: input,
        });
        setInput("");
    };

    return (
        <div className="h-[60vh] flex flex-col bg-black/40 border border-gray-800 rounded-xl">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {chat?.length === 0 && (
                    <div className="text-gray-500 text-center mt-20">
                        No messages yet. Start chatting with admin!
                    </div>
                )}
                {chat?.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-xs p-1 rounded-xl text-sm ${msg.sender === "user"
                                ? "bg-blue-500/20 "
                                : "bg-gray-800"
                                }`}
                        >
                            {msg.sender === "admin" ? (
                                <span className="inline-block bg-red-900  text-[11px] px-2 py-0.5 rounded-full mb-1">
                                    Admin ({msg.senderName})
                                </span>
                            ) : (
                                <span className="inline-block bg-green-900 text-[11px] px-2 py-0.5 rounded-full mb-1">
                                    You
                                </span>
                            )}

                            <p>{msg.message}</p>
                            <span className="block text-[10px] text-gray-500 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef}></div>
            </div>

            {/* Input box */}
            <div className="border-t border-gray-700 flex items-center p-3 gap-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-gray-900 text-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default UserChatWithAdmin;

"use client";
import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

const AdminChatModal = ({ chatUser, adminUser, onClose }) => {
    const chat = useQuery(api.users.getChat, { userId: chatUser.userId });
    const sendMessage = useMutation(api.users.sendMessage);
    const [message, setMessage] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    const handleSend = async () => {
        if (!message.trim()) return;
        await sendMessage({
            userId: chatUser.userId,
            sender: "admin",
            senderId: adminUser._id,
            senderName: adminUser.name,
            message,
        });
        setMessage("");
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]">
            <div className="bg-[#0b0b0f] border border-gray-800 rounded-xl w-[90%] max-w-2xl h-[70vh] flex flex-col">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-200">
                        Chat with {chatUser.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-xl"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 p-2 overflow-y-auto space-y-1">
                    {chat?.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-xs p-3 rounded-xl text-sm ${msg.sender === "admin"
                                        ? "bg-purple-500/20 text-purple-300"
                                        : "bg-gray-800 text-gray-200"
                                    }`}
                            >
                                {/* Sender Name */}
                                <p className="text-[11px] text-gray-400 mb-1">
                                    {msg.senderName || (msg.sender === "user" ? "You" : "Admin")}
                                </p>

                                {/* Message Content */}
                                <p>{msg.message}</p>

                                {/* Timestamp */}
                                <span className="block text-[10px] text-gray-500 mt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                            </div>

                        </div>
                    ))}
                    <div ref={bottomRef}></div>
                </div>

                <div className="border-t border-gray-800 p-3 flex gap-2">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1 bg-gray-900 text-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                    />
                    <button
                        onClick={handleSend}
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white text-sm"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminChatModal;

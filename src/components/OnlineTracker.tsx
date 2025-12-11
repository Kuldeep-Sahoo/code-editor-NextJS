"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface ConvexUser {
  id: string; // your API should return `id` = user.userId from Convex
  name?: string; // optional name
  email?: string; // optional name
  imageUrl?: string; // optional name
}

export default function OnlineTracker() {
  const goOnline = useMutation(api.onlineUsers.goOnline);
  const cleanup = useMutation(api.onlineUsers.cleanupInactiveUsers);

  const [convexUser, setConvexUser] = useState<ConvexUser | null>(null);

  // Fetch current user from your API
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/getUser");
        const data = await res.json();
        console.log({ imagedata: data });
        if (data.user && data.user.userId) {
          setConvexUser({
            id: data.user.userId,
            name: data.user.name ?? "Anonymous",
            email: data.user.email ?? "Anonymous email",
            imageUrl: data.user.imageUrl,
          });
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    })();
  }, []);

  // Mark online and heartbeat
  useEffect(() => {
    if (!convexUser?.id) return;

    const userId = convexUser.id;
    const name = convexUser.name ?? "Anonymous";
    const email = convexUser.email ?? "Anonymous Email";
    const imageUrl = convexUser.imageUrl ?? "no url";

    // initial online
    goOnline({ userId, email, name, imageUrl });

    // heartbeat every 1min
    const interval = setInterval(
      () => goOnline({ userId, email, name, imageUrl }),
      60000
    );

    // cleanup inactive users every 1min
    const cleanupInterval = setInterval(() => cleanup({}), 60000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, [convexUser, goOnline, cleanup]);

  return null;
}

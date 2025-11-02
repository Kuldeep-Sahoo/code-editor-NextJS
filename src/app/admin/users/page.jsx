"use client";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Loader2, UserCog } from "lucide-react";
import NavigationHeader from "@/components/NavigationHeader";

const AdminUsersPage = () => {
  const router = useRouter();
  const [, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const users = useQuery(api.users.getAllUsers);
  const updateUser = useMutation(api.users.updateUser);

  // ✅ Check if user is admin
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/getUser");
        const data = await res.json();
        setUser(data?.user);

        if (!data?.user || data?.user?.role !== "admin") {
          router.push("/");
        }
      } catch {
        router.push("/");
      } finally {
        setIsChecking(false);
      }
    })();
  }, [router]);

  if (isChecking || !users)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f] text-white">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading...
      </div>
    );

  const handleEdit = (u) => {
    setEditingId(u._id);
    setForm({
      role: u.role || "",
      isPro: u.isPro,
      proSince: u.proSince
        ? new Date(u.proSince).toISOString().split("T")[0]
        : "",
    });
  };

  const handleSave = async (id) => {
    await updateUser({
      id,
      data: {
        ...form,
        proSince: form.proSince ? new Date(form.proSince).toISOString() : undefined,
      },
    });
    setEditingId(null);
  };

  return (
    <>
      <NavigationHeader/>
    <div className="min-h-[90vh] bg-[#0a0a0f] text-white px-4 pt-2">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <UserCog className="text-blue-400" />
        Manage Users
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-800 rounded-xl overflow-hidden">
          <thead className="bg-gray-900 text-gray-300 text-sm">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">isPro</th>
              <th className="p-3 text-left">Pro Since</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr
                key={u._id}
                className="border-t border-gray-800 hover:bg-gray-900/50 transition"
              >
                <td className="p-3">{u.name}</td>
                <td className="p-3 text-gray-400">{u.email}</td>

                {editingId === u._id ? (
                  <>
                    <td className="p-3">
                      <input
                        value={form.role}
                        onChange={(e) =>
                          setForm({ ...form, role: e.target.value })
                        }
                        className="bg-gray-800 px-2 py-1 rounded w-24 text-sm"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        value={form.isPro}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            isPro: e.target.value === "true",
                          })
                        }
                        className="bg-gray-800 px-2 py-1 rounded w-20 text-sm"
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    </td>
                    <td className="p-3">
                      {u.proSince
                        ? new Date(Number(u.proSince)).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                        : "-"}
                    </td>


                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleSave(u._id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-800 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{u.role || "user"}</td>
                    <td className="p-3">{u.isPro ? "✅" : "❌"}</td>
                    <td className="p-3">
                      {u.proSince
                        ? new Date(u.proSince).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                        : "-"}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleEdit(u)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users?.length === 0 && (
        <div className="text-gray-500 text-center mt-10">
          No users found.
        </div>
      )}
      </div>
    </>
  );
};

export default AdminUsersPage;

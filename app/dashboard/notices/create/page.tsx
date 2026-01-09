"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CreateNotice() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "low",
    expiryDate: "",
  });

  const submit = async () => {
    const token = localStorage.getItem("token");
    const toastId = toast.loading("Creating notice...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            expiryDate: form.expiryDate || null,
          }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Notice created successfully ", { id: toastId });

      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch {
      toast.error("Failed to create notice ", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-8 border border-[#00FF6A]/40 p-8 rounded-2xl shadow-[0_0_60px_#00FF6A22]">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#00FF6A] hover:underline"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <h1 className="text-xl font-extrabold tracking-widest text-[#00FF6A] text-center flex-1">
            CREATE NOTICE
          </h1>

          {/* spacer for alignment */}
          <div className="w-12" />
        </div>

        {/* FORM */}
        <div className="space-y-6">
          <input
            placeholder="Notice title"
            className="filter-input w-full"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            placeholder="Description"
            className="filter-input w-full min-h-[100px]"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <select
            className="filter-input w-full"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Normal Priority</option>
            <option value="high">High Priority</option>
          </select>

          <input
            type="date"
            className="filter-input w-full"
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
          />

          <button
            onClick={submit}
            className="w-full py-3 bg-[#00FF6A] text-black font-extrabold tracking-widest rounded-xl hover:opacity-90 transition"
          >
            CREATE NOTICE
          </button>
        </div>
      </div>
    </div>
  );
}

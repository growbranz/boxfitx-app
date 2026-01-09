"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

export default function EditNotice() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "normal",
    expiryDate: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notices/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
      })
      .then((d) => {
        setForm({
          title: d.notice.title,
          description: d.notice.description || "",
          priority: d.notice.priority,
          expiryDate: d.notice.expiryDate
            ? d.notice.expiryDate.slice(0, 10)
            : "",
        });
      })
      .catch(() => {
        toast.error("Unauthorized or notice not found");
        router.push("/dashboard");
      });
  }, [id, router]);

  const update = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    const toastId = toast.loading("Updating notice...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notices/${id}`,
        {
          method: "PUT",
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

      if (!res.ok) {
        throw new Error("Update failed");
      }

      toast.success("Notice updated successfully ✅", { id: toastId });

      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (error) {
      toast.error("Failed to update notice ❌", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-8 border border-[#00FF6A]/40 p-8 rounded-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#00FF6A]"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <h1 className="text-xl font-extrabold text-[#00FF6A] flex-1 text-center">
            EDIT NOTICE
          </h1>

          <div className="w-12" />
        </div>

        {/* FORM */}
        <div className="space-y-6">
          <input
            className="filter-input w-full"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            className="filter-input w-full"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <select
            className="filter-input w-full"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            className="filter-input w-full"
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
          />

          <button
            onClick={update}
            className="w-full py-3 bg-[#00FF6A] text-black font-extrabold rounded-xl"
          >
            UPDATE NOTICE
          </button>
        </div>
      </div>
    </div>
  );
}

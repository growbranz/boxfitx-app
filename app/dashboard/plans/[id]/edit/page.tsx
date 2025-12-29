"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPlanPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "monthly",
    description: "",
  });

  /* ---------------- FETCH PLAN ---------------- */
  const fetchPlan = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const plan = data.plan.find((p: any) => p._id === id);

      if (!plan) {
        alert("Plan not found");
        router.push("/dashboard/plans");
        return;
      }

      setForm({
        name: plan.name || "",
        price: plan.price || "",
        duration: plan.duration || "monthly",
        description: plan.description || "",
      });
    } catch {
      alert("Failed to load plan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  /* ---------------- SUBMIT ---------------- */
  const submit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plans/${id}/edit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error();

      router.push("/dashboard/plans");
    } catch {
      alert("Failed to update plan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-400 text-center mt-20">Loading plan…</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 text-white">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-widest text-[#00FF6A]">
          EDIT PLAN
        </h1>
        <p className="text-sm text-gray-400 tracking-wide mt-1">
          Update BOXFITX membership plan details
        </p>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={submit}
        className="
          bg-black/70 backdrop-blur-xl
          border border-[#00FF6A]/30
          rounded-2xl
          shadow-[0_0_60px_#00FF6A11]
          p-6 space-y-6
        "
      >
        <Field label="Plan Name">
          <input
            className="input-boxfitx"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>

        <Field label="Price (₹)">
          <input
            type="number"
            className="input-boxfitx"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </Field>

        <Field label="Duration">
          <select
            className="input-boxfitx"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="half_yearly">Half Yearly</option>
            <option value="annual">Annual</option>
          </select>
        </Field>

        <Field label="Description">
          <textarea
            rows={3}
            className="input-boxfitx resize-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="
              px-6 py-2 rounded-lg
              border border-gray-500/40
              text-gray-400
              hover:bg-white/5
              transition
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="
              px-7 py-2 rounded-lg
              bg-[#00FF6A] text-black font-bold tracking-wide
              hover:shadow-[0_0_25px_#00FF6Aaa]
              transition
              disabled:opacity-60
            "
          >
            {saving ? "Saving..." : "Update Plan"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- FIELD ---------- */

function Field({ label, children }: any) {
  return (
    <div>
      <p className="text-xs tracking-widest text-gray-400 mb-1">
        {label.toUpperCase()}
      </p>
      {children}
    </div>
  );
}

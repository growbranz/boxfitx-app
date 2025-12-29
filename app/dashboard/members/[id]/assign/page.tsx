"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AssignPlanPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    planType: "monthly",
    startDate: "",
    expiryDate: "",
    paymentMode: "cash",
  });

  const submit = async () => {
    const token = localStorage.getItem("token");

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members/${id}/assign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    router.push(`/dashboard/members/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 text-white">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-widest text-[#00FF6A]">
          ASSIGN MEMBERSHIP
        </h1>
        <p className="text-sm text-gray-400 tracking-wide mt-1">
          Select plan, dates and payment mode
        </p>
      </div>

      {/* CARD */}
      <div
        className="
          bg-black/70 backdrop-blur-xl
          border border-[#00FF6A]/30
          rounded-2xl
          shadow-[0_0_60px_#00FF6A11]
          p-6 space-y-6
        "
      >
        {/* PLAN TYPE */}
        <Field label="Membership Plan">
          <select
            className="input-boxfitx"
            value={form.planType}
            onChange={(e) => setForm({ ...form, planType: e.target.value })}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="half_yearly">Half Yearly</option>
            <option value="annual">Annual</option>
          </select>
        </Field>

        {/* START DATE */}
        <Field label="Start Date">
          <input
            type="date"
            className="input-boxfitx"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
        </Field>

        {/* EXPIRY DATE */}
        <Field label="Expiry Date">
          <input
            type="date"
            className="input-boxfitx"
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
          />
        </Field>

        {/* PAYMENT MODE */}
        <Field label="Payment Mode">
          <select
            className="input-boxfitx"
            value={form.paymentMode}
            onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="online_transfer">Online Transfer</option>
          </select>
        </Field>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-4">
          <button
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
            onClick={submit}
            className="
              px-7 py-2 rounded-lg
              bg-[#00FF6A] text-black font-bold tracking-wide
              hover:shadow-[0_0_25px_#00FF6Aaa]
              transition
            "
          >
            Assign Plan
          </button>
        </div>
      </div>
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

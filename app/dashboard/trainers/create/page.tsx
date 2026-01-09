"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SPECIALITIES = [
  { label: "General Fitness", value: "general_fitness" },
  { label: "Strength Training", value: "strength_training" },
  { label: "Weight Loss", value: "weight_loss" },
  { label: "Boxing", value: "boxing" },
  { label: "Crossfit", value: "crossfit" },
  { label: "Yoga", value: "yoga" },
];

export default function CreateTrainerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    speciality: "general_fitness",
    phone: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trainers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      router.push("/dashboard/trainers");
    } catch (err) {
      alert("Failed to create trainer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-10">
      {/* HEADER */}
      <div className="relative pl-4">
        <span className="absolute left-0 top-1 h-10 w-1 bg-[#00FF6A]" />
        <h1 className="text-3xl font-extrabold tracking-widest text-[#00FF6A]">
          ADD TRAINER
        </h1>
        <p className="text-xs text-gray-400 tracking-[0.3em] uppercase">
          Boxfitx Trainer Management
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={submit}
        className="
          bg-black/70 backdrop-blur
          border border-[#00FF6A]/40
          shadow-[0_0_60px_#00FF6A15]
          rounded-2xl
          p-8
          space-y-6
        "
      >
        {/* FULL NAME */}
        <Field
          label="FULL NAME"
          placeholder="Trainer full name"
          onChange={(v) => setForm({ ...form, fullName: v })}
        />

        {/* SPECIALITY SELECT */}
        <SelectField
          label="SPECIALITY"
          value={form.speciality}
          options={SPECIALITIES}
          onChange={(v) => setForm({ ...form, speciality: v })}
        />

        {/* PHONE */}
        <Field
          label="PHONE NUMBER"
          placeholder="+91 XXXXX XXXXX"
          onChange={(v) => setForm({ ...form, phone: v })}
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="
              px-6 py-3 rounded-xl
              bg-white/10 text-gray-300
              border border-white/20
              hover:bg-white/20
              transition
            "
          >
            CANCEL
          </button>

          <button
            type="submit"
            disabled={loading}
            className="
              px-8 py-3 rounded-xl
              bg-[#00FF6A]/90 text-black font-bold
              hover:bg-[#00FF6A]
              shadow-[0_0_25px_#00FF6A99]
              transition
              disabled:opacity-60
            "
          >
            {loading ? "CREATING..." : "CREATE TRAINER"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- INPUT ---------- */

function Field({
  label,
  placeholder,
  onChange,
}: {
  label: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1 text-xs tracking-widest text-gray-400">
        {label}
      </label>
      <input
        placeholder={placeholder}
        className="
          w-full p-4 rounded-xl
          bg-black/80 text-white
          border border-[#00FF6A]/30
          focus:outline-none
          focus:ring-2 focus:ring-[#00FF6A]/40
        "
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* ---------- SELECT ---------- */

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1 text-xs tracking-widest text-gray-400">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full p-4 rounded-xl
          bg-black/80 text-white
          border border-[#00FF6A]/30
          focus:outline-none
          focus:ring-2 focus:ring-[#00FF6A]/40
        "
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

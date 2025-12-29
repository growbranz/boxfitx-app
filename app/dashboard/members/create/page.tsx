"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/app/lib/authFetch";

export default function CreateMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    fullName: "",
    email: "",
    number: "",
    dob: "",
    gender: "",
    address: "",
    cardId: "",

    heightCm: "",
    weightCm: "",
    fitnessGoal: "general_fitness",

    medicalConditions: false,
    medicalConditionsDetails: "",

    onMedication: false,
    medicationDetails: "",

    previousInjuries: false,
    previousInjuriesDetails: "",
  });

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members`,
        {
          method: "POST",
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error("Failed");

      router.push("/dashboard/members");
    } catch {
      alert("Member creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 text-white">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-widest text-[#00FF6A]">
          CREATE MEMBER
        </h1>
        <p className="text-gray-400 text-sm tracking-wide mt-1">
          Register a new BOXFITX gym member
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={submit}
        className="
          bg-black/70 backdrop-blur-xl
          border border-[#00FF6A]/30
          rounded-2xl
          shadow-[0_0_60px_#00FF6A11]
          p-6
          grid grid-cols-1 md:grid-cols-2 gap-5
        "
      >
        <Input
          label="Full Name"
          required
          onChange={(v: any) => setForm({ ...form, fullName: v })}
        />
        <Input
          label="Email Address"
          type="email"
          required
          onChange={(v: any) => setForm({ ...form, email: v })}
        />
        <Input
          label="Phone Number"
          onChange={(v: any) => setForm({ ...form, number: v })}
        />
        <Input
          label="Date of Birth"
          type="date"
          onChange={(v: any) => setForm({ ...form, dob: v })}
        />

        <Select
          label="Gender"
          options={["Male", "Female"]}
          onChange={(v: any) => setForm({ ...form, gender: v })}
        />

        <Input
          label="Card ID (Biometric)"
          onChange={(v: any) => setForm({ ...form, cardId: v })}
        />

        <Input
          label="Height (cm)"
          type="number"
          onChange={(v: any) => setForm({ ...form, heightCm: v })}
        />
        <Input
          label="Weight (kg)"
          type="number"
          onChange={(v: any) => setForm({ ...form, weightCm: v })}
        />

        <Select
          label="Fitness Goal"
          options={[
            "general_fitness",
            "weight_loss",
            "muscle_gain",
            "strength_training",
            "boxing_combat",
            "others",
          ]}
          onChange={(v: any) => setForm({ ...form, fitnessGoal: v })}
        />

        {/* ADDRESS */}
        <Textarea
          label="Address"
          rows={3}
          onChange={(v: any) => setForm({ ...form, address: v })}
        />

        {/* MEDICAL */}
        <Toggle
          label="Medical Conditions"
          checked={form.medicalConditions}
          onChange={(v: boolean) =>
            setForm({
              ...form,
              medicalConditions: v,
              medicalConditionsDetails: "",
            })
          }
        />
        {form.medicalConditions && (
          <Textarea
            label="Medical Condition Details"
            onChange={(v: any) =>
              setForm({ ...form, medicalConditionsDetails: v })
            }
          />
        )}

        <Toggle
          label="On Medication"
          checked={form.onMedication}
          onChange={(v: boolean) =>
            setForm({ ...form, onMedication: v, medicationDetails: "" })
          }
        />
        {form.onMedication && (
          <Textarea
            label="Medication Details"
            onChange={(v: any) => setForm({ ...form, medicationDetails: v })}
          />
        )}

        <Toggle
          label="Previous Injuries"
          checked={form.previousInjuries}
          onChange={(v: boolean) =>
            setForm({
              ...form,
              previousInjuries: v,
              previousInjuriesDetails: "",
            })
          }
        />
        {form.previousInjuries && (
          <Textarea
            label="Injury Details"
            onChange={(v: any) =>
              setForm({ ...form, previousInjuriesDetails: v })
            }
          />
        )}

        {/* ACTIONS */}
        <div className="md:col-span-2 flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-500/40 text-gray-400 rounded-lg hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 rounded-lg bg-[#00FF6A] text-black font-bold tracking-wide
            hover:shadow-[0_0_25px_#00FF6Aaa] disabled:opacity-60"
          >
            {loading ? "Saving..." : "Create Member"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- REUSABLE ---------- */

function Input({ label, type = "text", required, onChange }: any) {
  return (
    <div>
      <label className="block text-xs tracking-widest text-gray-400 mb-1">
        {label.toUpperCase()}
      </label>
      <input
        type={type}
        required={required}
        className="w-full p-3 rounded-lg bg-black/60 border border-[#00FF6A]/30
        text-white focus:ring-2 focus:ring-[#00FF6A]/40"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({ label, options, onChange }: any) {
  return (
    <div>
      <label className="block text-xs tracking-widest text-gray-400 mb-1">
        {label.toUpperCase()}
      </label>
      <select
        className="w-full p-3 rounded-lg bg-black/60 border border-[#00FF6A]/30
        text-white focus:ring-2 focus:ring-[#00FF6A]/40"
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {options.map((o: string) => (
          <option key={o} value={o}>
            {o.replace("_", " ")}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({ label, rows = 2, onChange }: any) {
  return (
    <div className="md:col-span-2">
      <label className="block text-xs tracking-widest text-gray-400 mb-1">
        {label.toUpperCase()}
      </label>
      <textarea
        rows={rows}
        className="w-full p-3 rounded-lg bg-black/60 border border-[#00FF6A]/30
        text-white focus:ring-2 focus:ring-[#00FF6A]/40"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Toggle({ label, checked, onChange }: any) {
  return (
    <label className="flex items-center gap-3 text-gray-300 md:col-span-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[#00FF6A]"
      />
      {label}
    </label>
  );
}

"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authFetch } from "@/app/lib/authFetch";

/* ---------- TYPES ---------- */

type MemberForm = {
  fullName: string;
  email: string;
  number: string;
  dob: string;
  gender: string;
  address: string;
  cardId: string;

  heightCm: string;
  weightCm: string;
  fitnessGoal: string;

  medicalConditions: boolean;
  medicalConditionsDetails: string;

  onMedication: boolean;
  medicationDetails: string;

  previousInjuries: boolean;
  previousInjuriesDetails: string;
};

export default function CreateMemberPage() {
  const router = useRouter();
  const submitLock = useRef(false);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<MemberForm>({
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

  /* ---------- UPDATE HELPERS ---------- */

  const update = useCallback(
    <K extends keyof MemberForm>(key: K, value: MemberForm[K]) => {
      setForm((p) => ({ ...p, [key]: value }));
    },
    []
  );

  /* ---------- SUBMIT ---------- */

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitLock.current) return; // 🚫 prevent double submit
    submitLock.current = true;

    setLoading(true);
    const toastId = toast.loading("Creating member…");

    try {
      // 🧠 Lightweight duplicate submit guard (session-level)
      const fingerprint = `${form.fullName}_${form.number}_${form.email}`;
      if (sessionStorage.getItem(fingerprint)) {
        toast.error("This member was just submitted", { id: toastId });
        return;
      }

      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members`,
        {
          method: "POST",
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error();

      sessionStorage.setItem(fingerprint, "1"); // cache submit
      toast.success("Member created successfully", { id: toastId });

      router.push("/dashboard/members");
    } catch {
      toast.error("Member creation failed", { id: toastId });
    } finally {
      submitLock.current = false;
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */

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
          onChange={(v: any) => update("fullName", v)}
        />
        <Input
          label="Email Address"
          type="email"
          required
          onChange={(v: any) => update("email", v)}
        />
        <Input
          label="Phone Number"
          onChange={(v: any) => update("number", v)}
        />
        <Input
          label="Date of Birth"
          type="date"
          onChange={(v: any) => update("dob", v)}
        />

        <Select
          label="Gender"
          options={["Male", "Female"]}
          onChange={(v: any) => update("gender", v)}
        />

        <Input
          label="Card ID (Biometric)"
          onChange={(v: any) => update("cardId", v)}
        />

        <Input
          label="Height (cm)"
          type="number"
          onChange={(v: any) => update("heightCm", v)}
        />
        <Input
          label="Weight (kg)"
          type="number"
          onChange={(v: any) => update("weightCm", v)}
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
          onChange={(v: any) => update("fitnessGoal", v)}
        />

        <Textarea
          label="Address"
          rows={3}
          onChange={(v: any) => update("address", v)}
        />

        <Toggle
          label="Medical Conditions"
          checked={form.medicalConditions}
          onChange={(v: any) =>
            setForm((p) => ({
              ...p,
              medicalConditions: v,
              medicalConditionsDetails: "",
            }))
          }
        />

        {form.medicalConditions && (
          <Textarea
            label="Medical Condition Details"
            onChange={(v: any) => update("medicalConditionsDetails", v)}
          />
        )}

        <Toggle
          label="On Medication"
          checked={form.onMedication}
          onChange={(v: any) =>
            setForm((p) => ({
              ...p,
              onMedication: v,
              medicationDetails: "",
            }))
          }
        />

        {form.onMedication && (
          <Textarea
            label="Medication Details"
            onChange={(v: any) => update("medicationDetails", v)}
          />
        )}

        <Toggle
          label="Previous Injuries"
          checked={form.previousInjuries}
          onChange={(v: any) =>
            setForm((p) => ({
              ...p,
              previousInjuries: v,
              previousInjuriesDetails: "",
            }))
          }
        />

        {form.previousInjuries && (
          <Textarea
            label="Injury Details"
            onChange={(v: any) => update("previousInjuriesDetails", v)}
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

/* ---------- REUSABLE (UNCHANGED UI) ---------- */

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

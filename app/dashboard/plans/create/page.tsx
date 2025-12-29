"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

    emergencyContact: {
      name: "",
      phone: "",
      relation: "",
    },

    medicalConditions: false,
    medicalConditionsDetails: "",

    onMedication: false,
    medicationDetails: "",

    previousInjuries: false,
    previousInjuriesDetails: "",

    fitnessGoal: "general_fitness",
  });

  const submit = async (e: any) => {
    e.preventDefault();

    if (!form.fullName || !form.email) {
      alert("Full name and email are required");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("token from create member", token);
    if (!token) {
      alert("Session expired. Please login again.");
      router.push("/auth/signin");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create member");
        return;
      }

      router.push("/dashboard/members");
    } catch (err) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 text-white">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-widest text-[#00FF6A]">
          CREATE MEMBER
        </h1>
        <p className="text-sm text-gray-400 tracking-wide mt-1">
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
          p-6 space-y-8
        "
      >
        {/* BASIC INFO */}
        <Section title="Basic Information">
          <Field label="Full Name">
            <input
              className="input-boxfitx"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              className="input-boxfitx"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>

          <Field label="Phone Number">
            <input
              type="number"
              className="input-boxfitx"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
            />
          </Field>

          <Field label="Date of Birth">
            <input
              type="date"
              className="input-boxfitx"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
          </Field>

          <Field label="Gender">
            <select
              className="input-boxfitx"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </Field>

          <Field label="Card ID (Biometric)">
            <input
              className="input-boxfitx"
              value={form.cardId}
              onChange={(e) => setForm({ ...form, cardId: e.target.value })}
            />
          </Field>
        </Section>

        {/* BODY DETAILS */}
        <Section title="Body Details">
          <Field label="Height (cm)">
            <input
              type="number"
              className="input-boxfitx"
              value={form.heightCm}
              onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
            />
          </Field>

          <Field label="Weight (kg)">
            <input
              type="number"
              className="input-boxfitx"
              value={form.weightCm}
              onChange={(e) => setForm({ ...form, weightCm: e.target.value })}
            />
          </Field>

          <Field label="Fitness Goal">
            <select
              className="input-boxfitx"
              value={form.fitnessGoal}
              onChange={(e) =>
                setForm({ ...form, fitnessGoal: e.target.value })
              }
            >
              <option value="general_fitness">General Fitness</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="strength_training">Strength Training</option>
              <option value="boxing_combat">Boxing / Combat</option>
              <option value="others">Others</option>
            </select>
          </Field>
        </Section>

        {/* MEDICAL */}
        <Section title="Medical Information">
          <Toggle
            label="Medical Conditions"
            checked={form.medicalConditions}
            onChange={(v: any) => setForm({ ...form, medicalConditions: v })}
          />
          {form.medicalConditions && (
            <textarea
              className="input-boxfitx"
              placeholder="Medical condition details"
              onChange={(e) =>
                setForm({ ...form, medicalConditionsDetails: e.target.value })
              }
            />
          )}

          <Toggle
            label="On Medication"
            checked={form.onMedication}
            onChange={(v: any) => setForm({ ...form, onMedication: v })}
          />
          {form.onMedication && (
            <textarea
              className="input-boxfitx"
              placeholder="Medication details"
              onChange={(e) =>
                setForm({ ...form, medicationDetails: e.target.value })
              }
            />
          )}

          <Toggle
            label="Previous Injuries"
            checked={form.previousInjuries}
            onChange={(v: any) => setForm({ ...form, previousInjuries: v })}
          />
          {form.previousInjuries && (
            <textarea
              className="input-boxfitx"
              placeholder="Injury details"
              onChange={(e) =>
                setForm({ ...form, previousInjuriesDetails: e.target.value })
              }
            />
          )}
        </Section>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-6">
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
            className="
              px-7 py-2 rounded-lg
              bg-[#00FF6A] text-black font-bold tracking-wide
              hover:shadow-[0_0_25px_#00FF6Aaa]
              disabled:opacity-60
            "
          >
            {loading ? "Creating..." : "Create Member"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

function Section({ title, children }: any) {
  return (
    <div>
      <h3 className="text-sm tracking-widest text-[#00FF6A] mb-4">
        {title.toUpperCase()}
      </h3>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

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

function Toggle({ label, checked, onChange }: any) {
  return (
    <label className="flex items-center gap-3 text-gray-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

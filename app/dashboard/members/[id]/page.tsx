"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
export default function MemberProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const [member, setMember] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [loginCreated, setLoginCreated] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  /* ---------- FETCH MEMBER ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMember(data.Member);
        if (data.Member?.loginCreated) setLoginCreated(true);
      });
  }, [id]);

  /* ---------- CREATE LOGIN ---------- */
  const createLogin = async () => {
    if (!password || password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/create-member-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ memberId: id, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to create login");
        return;
      }

      setLoginCreated(true);
      setMessage("Member login created successfully ✅");
      setPassword("");

      setTimeout(() => {
        setShowModal(false);
        setMessage("");
      }, 1500);
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- FETCH MEMBER ---------- */
  const fetchMember = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/members/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    setMember(data.Member);
    setEditForm(data.Member);
    if (data.Member?.loginCreated) setLoginCreated(true);
  };

  useEffect(() => {
    fetchMember();
  }, [id]);

  /* ---------- UPDATE MEMBER ---------- */

  const updateMember = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      await fetchMember();
      setShowEditModal(false);
    } catch {
      alert("Failed to update member");
    } finally {
      setLoading(false);
    }
  };

  if (!member) {
    return (
      <div className="text-center text-gray-400 py-20">
        Loading member profile...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 text-white space-y-8">
      {/* ---------- HEADER ---------- */}
      <div className="relative border border-[#00FF6A]/30 rounded-2xl p-6 bg-black/70 backdrop-blur-xl shadow-[0_0_60px_#00FF6A11]">
        <span
          className={`absolute top-6 right-6 h-3 w-3 rounded-full ${
            member.status === "active"
              ? "bg-green-400"
              : member.status === "expired"
              ? "bg-red-400"
              : "bg-yellow-400"
          }`}
        />

        <h1 className="text-3xl font-extrabold tracking-widest text-[#00FF6A]">
          {member.fullName}
        </h1>
        <p className="text-gray-400 mt-1">{member.email}</p>
        <p className="text-gray-400">📞 {member.number || "—"}</p>
      </div>

      {/* ---------- PERSONAL INFO ---------- */}
      <Section title="Personal Information">
        <Info label="Gender" value={member.gender || "—"} />
        <Info
          label="Date of Birth"
          value={member.dob ? new Date(member.dob).toDateString() : "—"}
        />
        <Info label="Address" value={member.address || "—"} />
        <Info label="Card ID" value={member.cardId || "—"} />
      </Section>

      {/* ---------- BODY DETAILS ---------- */}
      <Section title="Body Details">
        <Info label="Height (cm)" value={member.heightCm || "—"} />
        <Info label="Weight (kg)" value={member.weightCm || "—"} />
        <Info
          label="Fitness Goal"
          value={member.fitnessGoal?.replace("_", " ") || "—"}
        />
      </Section>

      {/* ---------- MEDICAL ---------- */}
      <Section title="Medical Information">
        <Info
          label="Medical Conditions"
          value={member.medicalConditions ? "Yes" : "No"}
        />
        {member.medicalConditions && (
          <Info
            label="Condition Details"
            value={member.medicalConditionsDetails || "—"}
          />
        )}

        <Info
          label="On Medication"
          value={member.onMedication ? "Yes" : "No"}
        />
        {member.onMedication && (
          <Info
            label="Medication Details"
            value={member.medicationDetails || "—"}
          />
        )}

        <Info
          label="Previous Injuries"
          value={member.previousInjuries ? "Yes" : "No"}
        />
        {member.previousInjuries && (
          <Info
            label="Injury Details"
            value={member.previousInjuriesDetails || "—"}
          />
        )}
      </Section>
      {/* ---------- MEMBERSHIP ---------- */}
      <Section title="Membership Details">
        <Info label="Plan Type" value={member.membership?.planType || "None"} />
        <Info
          label="Payment Mode"
          value={member.membership?.paymentMode || "—"}
        />
        <Info
          label="Start Date"
          value={
            member.membership?.startDate
              ? new Date(member.membership.startDate).toDateString()
              : "—"
          }
        />
        <Info
          label="Expiry Date"
          value={
            member.membership?.expiryDate
              ? new Date(member.membership.expiryDate).toDateString()
              : "—"
          }
        />
        <Info label="Status" value={member.status} />
      </Section>
      {/* ---------- EMAIL REMINDER STATUS ---------- */}
      <Section title="Email Reminder Status">
        <Info
          label="7 Day Reminder"
          value={member.reminders?.day7Sent ? "Sent ✅" : "Pending ⏳"}
        />

        <Info
          label="3 Day Reminder"
          value={member.reminders?.day3Sent ? "Sent ✅" : "Pending ⏳"}
        />

        <Info
          label="1 Day Reminder"
          value={member.reminders?.day1Sent ? "Sent ✅" : "Pending ⏳"}
        />

        <Info
          label="Last Email Sent"
          value={
            member.reminders?.lastReminderSentAt
              ? new Date(member.reminders.lastReminderSentAt).toLocaleString()
              : "—"
          }
        />
      </Section>

      {/* ---------- ACTIONS ---------- */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowModal(true)}
          disabled={loginCreated}
          className={`px-6 py-2 rounded-lg font-bold tracking-wide ${
            loginCreated
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-[#00FF6A] text-black hover:shadow-[0_0_25px_#00FF6Aaa]"
          }`}
        >
          {loginCreated ? "Login Created" : "Create Member Login"}
        </button>
        <button
          onClick={() => setShowEditModal(true)}
          className="px-6 py-2 rounded-lg border border-[#00FF6A]/50 text-[#00FF6A]"
        >
          Edit Member
        </button>

        <Link
          href={`/dashboard/members/${id}/assign`}
          className="px-6 py-2 rounded-lg border border-gray-500/40 text-gray-400 hover:bg-white/5"
        >
          Assign / Renew Plan
        </Link>

        <button
          onClick={() => router.back()}
          className="px-6 py-2 rounded-lg border border-gray-500/40 text-gray-400 hover:bg-white/5"
        >
          Back
        </button>
      </div>

      {/* ---------- EDIT MODAL ---------- */}
      {showEditModal && (
        <Modal title="EDIT MEMBER" onClose={() => setShowEditModal(false)}>
          <Input
            label="Full Name"
            value={editForm.fullName}
            onChange={(v: any) => setEditForm({ ...editForm, fullName: v })}
          />
          <Input
            label="Email"
            value={editForm.email}
            onChange={(v: any) => setEditForm({ ...editForm, email: v })}
          />
          <Input
            label="Phone"
            value={editForm.number}
            onChange={(v: any) => setEditForm({ ...editForm, number: v })}
          />
          <Input
            label="Address"
            value={editForm.address}
            onChange={(v: any) => setEditForm({ ...editForm, address: v })}
          />
          <Input
            label="Card ID"
            value={editForm.cardId}
            onChange={(v: any) => setEditForm({ ...editForm, cardId: v })}
          />
          <Input
            label="Height (cm)"
            value={editForm.heightCm}
            onChange={(v: any) => setEditForm({ ...editForm, heightCm: v })}
          />
          <Input
            label="Weight (kg)"
            value={editForm.weightCm}
            onChange={(v: any) => setEditForm({ ...editForm, weightCm: v })}
          />

          <button
            onClick={updateMember}
            disabled={loading}
            className="w-full mt-4 py-2 rounded-lg bg-[#00FF6A] text-black font-bold"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </Modal>
      )}

      {/* ---------- LOGIN MODAL ---------- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-full max-w-md bg-black border border-[#00FF6A]/40 rounded-2xl p-6 shadow-[0_0_80px_#00FF6A22]">
            <h2 className="text-xl font-bold tracking-widest text-[#00FF6A] mb-4">
              CREATE MEMBER LOGIN
            </h2>

            {/* PASSWORD FIELD WITH EYE */}
            <div className="relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="input-boxfitx w-full pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00FF6A] transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {message && (
              <p className="text-sm text-yellow-400 mb-2">{message}</p>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border border-gray-500/40 text-gray-400 rounded-lg hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={createLogin}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-[#00FF6A] text-black font-bold disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Login"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- REUSABLE ---------- */

function Section({ title, children }: any) {
  return (
    <div className="bg-black/70 backdrop-blur-xl border border-[#00FF6A]/30 rounded-2xl p-6 shadow-[0_0_60px_#00FF6A11]">
      <h3 className="text-sm tracking-widest text-[#00FF6A] mb-4">
        {title.toUpperCase()}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-xs tracking-widest text-gray-400 mb-1">
        {label.toUpperCase()}
      </p>
      <p className="font-semibold text-white">{value}</p>
    </div>
  );
}

function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-black border border-[#00FF6A]/40 rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-[#00FF6A] font-bold tracking-widest mb-4">
          {title}
        </h2>
        {children}
        <button
          onClick={onClose}
          className="mt-4 text-gray-400 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <div className="mb-3">
      <p className="text-xs text-gray-400 tracking-widest mb-1">
        {label.toUpperCase()}
      </p>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="input-boxfitx w-full"
      />
    </div>
  );
}

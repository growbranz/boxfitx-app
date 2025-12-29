"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
  const router = useRouter();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------- FETCH PROFILE ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/signin");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to load profile");
        }
        return data;
      })
      .then((data) => setMember(data.member))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-20">
        Loading your profile...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 py-20">{error}</div>;
  }

  if (!member) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 text-white space-y-8">
      {/* HEADER */}
      <div
        className="
          relative border border-[#00FF6A]/30 rounded-2xl
          bg-black/70 backdrop-blur-xl
          p-6 shadow-[0_0_60px_#00FF6A11]
        "
      >
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

      {/* PERSONAL INFO */}
      <Section title="Personal Information">
        <Info label="Gender" value={member.gender || "—"} />
        <Info
          label="Date of Birth"
          value={member.dob ? new Date(member.dob).toDateString() : "—"}
        />
        <Info label="Address" value={member.address || "—"} />
      </Section>

      {/* BODY DETAILS */}
      <Section title="Body Details">
        <Info
          label="Height"
          value={member.heightCm ? `${member.heightCm} cm` : "—"}
        />
        <Info
          label="Weight"
          value={member.weightCm ? `${member.weightCm} kg` : "—"}
        />
        <Info
          label="Fitness Goal"
          value={member.fitnessGoal?.replace("_", " ") || "—"}
        />
      </Section>

      {/* MEMBERSHIP */}
      <Section title="Membership">
        <Info label="Status" value={member.status.toUpperCase()} />
        <Info label="Plan" value={member.membership?.planType || "—"} />
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
      </Section>
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function Section({ title, children }: any) {
  return (
    <div
      className="
        bg-black/70 backdrop-blur-xl
        border border-[#00FF6A]/30
        rounded-2xl
        p-6
        shadow-[0_0_60px_#00FF6A11]
      "
    >
      <h3 className="text-sm tracking-widest text-[#00FF6A] mb-4">
        {title.toUpperCase()}
      </h3>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
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

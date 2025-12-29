"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserMembershipPage() {
  const router = useRouter();
  const [membership, setMembership] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/signin");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/membership`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to load membership");
        return data;
      })
      .then((data) => setMembership(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-20">
        Loading membership...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 py-20">{error}</div>;
  }

  const statusColor =
    membership.status === "active"
      ? "text-green-400"
      : membership.status === "expired"
      ? "text-red-400"
      : "text-yellow-400";

  return (
    <div className="max-w-4xl mx-auto px-4 text-white space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-widest text-[#00FF6A]">
          MEMBERSHIP
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Your current subscription details
        </p>
      </div>

      {/* CARD */}
      <div
        className="
          bg-black/70 backdrop-blur-xl
          border border-[#00FF6A]/30
          rounded-2xl
          p-6
          shadow-[0_0_60px_#00FF6A11]
          space-y-6
        "
      >
        <Info label="Plan Type" value={membership.plan?.planType || "—"} />

        <Info
          label="Status"
          value={
            <span className={`font-bold ${statusColor}`}>
              {membership.status.toUpperCase()}
            </span>
          }
        />

        <Info
          label="Expiry Date"
          value={
            membership.expiryDate
              ? new Date(membership.expiryDate).toDateString()
              : "—"
          }
        />
      </div>
    </div>
  );
}

/* ---------- INFO BLOCK ---------- */
function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-xs tracking-widest text-gray-400 mb-1">
        {label.toUpperCase()}
      </p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

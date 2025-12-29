"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      router.push("/auth/signin");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden px-4">
      {/* BACKGROUND IMAGES */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
        {[
          "/bg/gym1.jpg",
          "/bg/gym2.jpg",
          "/bg/gym3.jpg",
          "/bg/gym4.jpg",
          "/bg/gym5.jpg",
          "/bg/gym6.jpg",
        ].map((img, i) => (
          <div
            key={i}
            className="relative bg-cover bg-center"
            style={{ backgroundImage: `url(${img})` }}
          >
            <div className="absolute inset-0 bg-black/25" />
          </div>
        ))}
      </div>

      {/* VIGNETTE OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      {/* SIGNUP CARD */}
      <div
        className="relative z-10 w-full max-w-md p-8 rounded-2xl
        bg-white/5 backdrop-blur-xl
        border border-green-500/30
        shadow-[0_0_60px_#00ff6a55]"
      >
        {/* LOGO */}
        <div className="text-center mb-6 flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="BOXFITX Logo"
            width={160}
            height={60}
            priority
            className="drop-shadow-[0_0_25px_#00ff6a]"
          />
          <p className="text-gray-400 mt-3 text-sm tracking-wide">
            Admin Registration
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <p className="bg-red-500/20 text-red-400 p-2 rounded mb-4 text-sm text-center">
            {error}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            className="w-full p-3 rounded-lg bg-black/70
            border border-green-500/40 focus:outline-none
            focus:ring-2 focus:ring-green-400 transition"
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />

          <input
            type="text"
            placeholder="Last Name"
            className="w-full p-3 rounded-lg bg-black/70
            border border-green-500/40 focus:outline-none
            focus:ring-2 focus:ring-green-400 transition"
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-lg bg-black/70
            border border-green-500/40 focus:outline-none
            focus:ring-2 focus:ring-green-400 transition"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-black/70
            border border-green-500/40 focus:outline-none
            focus:ring-2 focus:ring-green-400 transition"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg bg-green-500
            text-black font-bold tracking-wide
            hover:bg-green-400 transition disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Admin Account"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <span
            className="text-green-400 cursor-pointer hover:underline"
            onClick={() => router.push("/auth/signin")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

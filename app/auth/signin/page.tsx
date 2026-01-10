"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      // SAVE TOKEN
      localStorage.setItem("token", data.token);

      // SUCCESS TOAST
      toast.success("Login successful 🚀");

      // DECODE ROLE
      const payload = JSON.parse(atob(data.token.split(".")[1]));

      // REDIRECT WITH SMALL DELAY (nice UX)
      setTimeout(() => {
        if (payload.role === "admin") {
          router.replace("/dashboard");
        } else {
          router.replace("/user/dashboard");
        }
      }, 800);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
      {/* BACKGROUND */}
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

      {/* OVERLAYS */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#00ff6a33,transparent_45%)]" />

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl
        bg-white/5 backdrop-blur-xl border border-green-500/30
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
            className="drop-shadow-[0_0_20px_#00ff6a]"
          />
          <p className="text-gray-400 mt-3 text-sm tracking-wide">
            Secure Login
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-xs text-gray-400">Email</label>
            <input
              type="email"
              placeholder="admin@boxfitx.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 rounded-lg bg-black/70
              border border-green-500/40 focus:outline-none
              focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 rounded-lg bg-black/70
              border border-green-500/40 focus:outline-none
              focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg bg-green-500
            text-black font-bold tracking-wide
            hover:bg-green-400 transition shadow-lg
            disabled:opacity-60"
          >
            {loading ? "Signing in..." : "SIGN IN"}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/auth/signup")}
            className="text-green-400 hover:underline cursor-pointer"
          >
            Create Admin
          </span>
        </div>
      </motion.div>
    </div>
  );
}

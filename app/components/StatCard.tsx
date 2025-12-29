import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative p-5 rounded-2xl bg-black border border-white/10
      shadow-[0_0_25px_rgba(0,255,106,0.15)] overflow-hidden"
    >
      {/* Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20`}
      />

      <div className="relative z-10">
        <p className="text-sm text-gray-400 tracking-wide">{title}</p>
        <p className="text-3xl font-extrabold text-white mt-2">{value}</p>
      </div>
    </motion.div>
  );
}

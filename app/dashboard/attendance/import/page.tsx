"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AttendanceImportPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [unmatched, setUnmatched] = useState<string[]>([]);

  /* ---------- SUBMIT ---------- */
  const submit = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    setLoading(true);
    setMessage(null);
    setUnmatched([]);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/import`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload failed");

      setMessage(data.message);
      setUnmatched(data.unmatchedCardIds || []);
      setFile(null);
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- DRAG EVENTS ---------- */
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".csv")) {
      setFile(droppedFile);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="relative pl-4">
          <span className="absolute left-0 top-1 h-10 w-1 bg-[#00FF6A]" />
          <h1 className="text-3xl font-extrabold tracking-widest text-[#00FF6A]">
            ATTENDANCE IMPORT
          </h1>
          <p className="text-xs text-gray-400 tracking-[0.3em] uppercase">
            Biometric CSV Upload
          </p>
        </div>

        {/* BACK BUTTON */}
        <button
          onClick={() => router.push("/dashboard/attendance")}
          className="
            px-6 py-2 rounded-lg
            border border-gray-500/40 text-gray-400
            hover:bg-white/5 transition
          "
        >
          Back
        </button>
      </div>

      {/* INFO CARD */}
      <div
        className="p-5 rounded-2xl border border-[#00FF6A]/30
        bg-black/60 backdrop-blur-xl shadow-[0_0_40px_#00FF6A11]"
      >
        <h3 className="font-semibold text-[#00FF6A] mb-2 tracking-widest">
          CSV FORMAT
        </h3>
        <ul className="text-sm list-disc list-inside space-y-1 text-gray-400">
          <li>
            <b>card_id</b> – Member card ID
          </li>
          <li>
            <b>timestamp</b> – Date & time
          </li>
          <li>
            <b>event_type</b> – checkin / checkout
          </li>
        </ul>
      </div>

      {/* DROP ZONE */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`
          p-10 rounded-2xl border-2 border-dashed
          ${
            dragging
              ? "border-[#00FF6A] bg-[#00FF6A]/10"
              : "border-[#00FF6A]/40 bg-black/70"
          }
          backdrop-blur-xl
          text-center transition
          shadow-[0_0_50px_#00FF6A22]
        `}
      >
        <p className="text-lg font-bold tracking-widest text-[#00FF6A]">
          DRAG & DROP CSV HERE
        </p>
        <p className="text-sm text-gray-400 mt-2">or click to browse</p>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
          id="csvUpload"
        />

        <label
          htmlFor="csvUpload"
          className="
            inline-block mt-5 px-6 py-2 rounded-lg
            bg-[#00FF6A] text-black font-bold
            hover:shadow-[0_0_25px_#00FF6Aaa]
            cursor-pointer transition
          "
        >
          Select CSV File
        </label>

        {file && (
          <p className="mt-4 text-sm text-gray-300">
            Selected: <span className="text-white">{file.name}</span>
          </p>
        )}
      </div>

      {/* ACTION */}
      <button
        onClick={submit}
        disabled={loading || !file}
        className="
          w-full py-3 rounded-xl
          bg-[#00FF6A] text-black font-bold tracking-wide
          hover:shadow-[0_0_30px_#00FF6Aaa]
          transition disabled:opacity-60
        "
      >
        {loading ? "Importing Attendance..." : "Import Attendance"}
      </button>

      {/* RESULT */}
      {message && (
        <div
          className={`p-5 rounded-xl border ${
            unmatched.length
              ? "border-yellow-400/30 bg-yellow-400/10"
              : "border-[#00FF6A]/30 bg-[#00FF6A]/10"
          }`}
        >
          <p className="text-sm font-semibold">{message}</p>

          {unmatched.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-yellow-300 font-bold tracking-widest">
                UNMATCHED CARD IDS
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {unmatched.map((id) => (
                  <span
                    key={id}
                    className="px-3 py-1 text-xs rounded-full
                    bg-yellow-500/20 text-yellow-300"
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

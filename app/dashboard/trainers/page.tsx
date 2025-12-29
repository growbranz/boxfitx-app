"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TrainerGrid from "@/app/components/TrainerGrid";

export default function TrainersPage() {
  const [trainers, setTrainers] = useState([]);

  const fetchTrainers = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trainers`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setTrainers(data.data || []);
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-center py-8 border-b mb-8">
        <div>
          <h1 className="text-3xl font-bold">Trainers</h1>
          <p className="text-gray-500 text-sm">Manage BOXFITX trainers</p>
        </div>

        <Link
          href="/dashboard/trainers/create"
          className="px-5 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
        >
          + Add Trainer
        </Link>
      </div>

      {/* GRID */}
      <TrainerGrid trainers={trainers} />
    </div>
  );
}

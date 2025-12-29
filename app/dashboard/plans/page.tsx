"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans`, {
      cache: "no-store",
    });
    const data = await res.json();
    setPlans(data.plan || []);
    setLoading(false);
  };

  const togglePlan = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans/${id}/toggle`, {
      method: "PATCH",
    });
    fetchPlans();
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans/${id}/delete`, {
      method: "DELETE",
    });
    fetchPlans();
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="space-y-10 text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-widest text-[#00FF6A]">
            MEMBERSHIP PLANS
          </h1>
          <p className="text-sm text-gray-400 tracking-wide mt-1">
            Manage BOXFITX subscription plans
          </p>
        </div>

        <Link
          href="/dashboard/plans/create"
          className="
            px-7 py-2 rounded-xl
            bg-[#00FF6A] text-black font-bold tracking-wide
            hover:shadow-[0_0_25px_#00FF6Aaa]
            transition
          "
        >
          + ADD PLAN
        </Link>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-400">Loading plans...</p>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No plans created yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const durationLabel =
              typeof plan.duration === "string"
                ? plan.duration.replace("_", " ")
                : `${plan.duration} days`;

            return (
              <div
                key={plan._id}
                className="
                  relative p-6 rounded-2xl
                  bg-black/70 backdrop-blur-xl
                  border border-[#00FF6A]/20
                  shadow-[0_0_40px_#00FF6A11]
                  hover:shadow-[0_0_70px_#00FF6A33]
                  transition-all
                "
              >
                {/* STATUS DOT */}
                <span
                  className={`absolute top-4 right-4 h-3 w-3 rounded-full ${
                    plan.isActive ? "bg-[#00FF6A]" : "bg-gray-500"
                  }`}
                />

                {/* PLAN NAME */}
                <h3 className="text-lg font-bold tracking-wide">{plan.name}</h3>

                {/* PRICE */}
                <div className="mt-3">
                  <p className="text-3xl font-extrabold text-[#00FF6A]">
                    ₹ {plan.price}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
                    {durationLabel}
                  </p>
                </div>

                {/* STATUS BADGE */}
                <span
                  className={`inline-block mt-4 text-xs px-3 py-1 rounded-full tracking-wide ${
                    plan.isActive
                      ? "bg-[#00FF6A]/20 text-[#00FF6A]"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {plan.isActive ? "ACTIVE" : "INACTIVE"}
                </span>

                {/* ACTIONS */}
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  <button
                    onClick={() => togglePlan(plan._id)}
                    className="text-blue-400 hover:underline"
                  >
                    {plan.isActive ? "Disable" : "Enable"}
                  </button>

                  <Link
                    href={`/dashboard/plans/${plan._id}/edit`}
                    className="text-[#00FF6A] hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deletePlan(plan._id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

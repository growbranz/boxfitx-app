"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Power, X } from "lucide-react";
import toast from "react-hot-toast";

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  /* ---------- MODAL STATE ---------- */
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editId, setEditId] = useState<string | null>(null);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* ---------- FORM STATE ---------- */
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "monthly",
    description: "",
  });

  const durationMap: Record<string, string> = {
    monthly: "30 Days",
    quarterly: "90 Days",
    half_yearly: "180 Days",
    annual: "365 Days",
  };

  /* ---------- FETCH PLANS ---------- */
  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPlans(data.plan || []);
    } catch {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  /* ---------- OPEN CREATE ---------- */
  const openCreate = () => {
    setMode("create");
    setEditId(null);
    setForm({
      name: "",
      price: "",
      duration: "monthly",
      description: "",
    });
    setShowModal(true);
  };

  /* ---------- OPEN EDIT ---------- */
  const openEdit = (plan: any) => {
    setMode("edit");
    setEditId(plan._id);
    setForm({
      name: plan.planName,
      price: plan.price,
      duration: plan.type,
      description: plan.benefits || "",
    });
    setShowModal(true);
  };

  /* ---------- SUBMIT (CREATE / EDIT) ---------- */
  const submitPlan = async (e: any) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error("Plan name & price required");
      return;
    }

    setSaving(true);
    const t = toast.loading(
      mode === "create" ? "Creating plan..." : "Updating plan..."
    );
    const token = localStorage.getItem("token");

    const payload = {
      planName: form.name,
      price: Number(form.price),
      type: form.duration,
      benefits: form.description,
    };

    try {
      const url =
        mode === "create" ? `/api/plans` : `/api/plans/${editId}/edit`;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast.success(mode === "create" ? "Plan created" : "Plan updated", {
        id: t,
      });

      setShowModal(false);
      fetchPlans();
    } catch {
      toast.error("Action failed", { id: t });
    } finally {
      setSaving(false);
    }
  };

  /* ---------- TOGGLE ---------- */
  const toggleStatus = async (id: string) => {
    setActionId(id);
    const t = toast.loading("Updating...");
    const token = localStorage.getItem("token");

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      setPlans((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: !p.isActive } : p))
      );
      toast.success("Status updated", { id: t });
    } catch {
      toast.error("Failed", { id: t });
    } finally {
      setActionId(null);
    }
  };

  /* ---------- DELETE ---------- */
  const confirmDeletePlan = async () => {
    if (!deleteId) return;

    setActionId(deleteId);
    const t = toast.loading("Deleting plan...");
    const token = localStorage.getItem("token");

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plans/${deleteId}/delete`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPlans((prev) => prev.filter((p) => p._id !== deleteId));
      toast.success("Plan deleted successfully", { id: t });
    } catch {
      toast.error("Failed to delete plan", { id: t });
    } finally {
      setActionId(null);
      setDeleteId(null);
      setShowDelete(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-400 mt-24">Loading…</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 text-white space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-widest text-[#00FF6A]">
            MEMBERSHIP PLANS
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Create, edit and manage plans
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-6 py-2 rounded-xl bg-[#00FF6A] text-black font-bold"
        >
          + Create Plan
        </button>
      </div>

      {/* TABLE */}
      <div className="border border-[#00FF6A]/30 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#00FF6A]/10 text-[#00FF6A]">
            <tr>
              <th className="p-4 text-left">PLAN</th>
              <th className="p-4">PRICE</th>
              <th className="p-4">DURATION</th>
              <th className="p-4">STATUS</th>
              <th className="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {plans.map((plan) => (
              <tr key={plan._id} className="border-t border-[#00FF6A]/10">
                <td className="p-4 font-semibold">
                  {plan.planName}
                  {plan.benefits && (
                    <p className="text-xs text-gray-400 mt-1">
                      {plan.benefits}
                    </p>
                  )}
                </td>

                <td className="p-4 font-bold">₹ {plan.price}</td>
                <td className="p-4">{durationMap[plan.type]}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      plan.isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {plan.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>

                <td className="p-4 flex justify-end gap-2">
                  <button
                    onClick={() => openEdit(plan)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    disabled={actionId === plan._id}
                    onClick={() => toggleStatus(plan._id)}
                    className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded-lg"
                  >
                    <Power size={16} />
                  </button>

                  <button
                    onClick={() => {
                      setDeleteId(plan._id);
                      setShowDelete(true);
                    }}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div
            className="
        w-full max-w-sm
        bg-black
        border border-red-500/40
        rounded-2xl
        p-6
        shadow-[0_0_60px_#ff000022]
        space-y-5
      "
          >
            {/* HEADER */}
            <h3 className="text-lg font-bold text-red-400 tracking-widest">
              DELETE PLAN
            </h3>

            <p className="text-sm text-gray-400 leading-relaxed">
              Are you sure you want to delete this plan permanently?
              <br />
              <span className="text-red-400 font-semibold">
                This action cannot be undone.
              </span>
            </p>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => {
                  setShowDelete(false);
                  setDeleteId(null);
                }}
                className="
            px-5 py-2
            border border-gray-500/40
            text-gray-400
            rounded-lg
            hover:bg-white/5
            transition
          "
              >
                Cancel
              </button>

              <button
                onClick={confirmDeletePlan}
                disabled={actionId === deleteId}
                className="
            px-5 py-2
            bg-red-500
            text-white
            font-bold
            rounded-lg
            hover:shadow-[0_0_25px_#ff0000aa]
            transition
            disabled:opacity-60
          "
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- CREATE / EDIT MODAL ---------- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={submitPlan}
            className="
        w-full max-w-xl
        bg-black
        border border-[#00FF6A]/40
        rounded-2xl
        p-6
        space-y-6
        shadow-[0_0_80px_#00FF6A22]
        animate-fadeIn
      "
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-[#00FF6A]/20 pb-4">
              <div>
                <h2 className="text-xl font-extrabold tracking-widest text-[#00FF6A]">
                  {mode === "create" ? "CREATE PLAN" : "EDIT PLAN"}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Configure membership pricing and duration
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="
            p-2 rounded-lg
            text-gray-400
            hover:text-white
            hover:bg-white/10
            transition
          "
              >
                <X size={18} />
              </button>
            </div>

            {/* FORM */}
            <div className="space-y-5">
              {/* PLAN NAME */}
              <Field label="Plan Name">
                <input
                  className="
              w-full
              bg-black/80
              border border-[#00FF6A]/40
              rounded-lg
              px-3 py-3
              text-white
              placeholder-gray-500
              focus:outline-none
              focus:ring-2 focus:ring-[#00FF6A]
              transition
            "
                  placeholder="Eg: Premium, Gold, Student"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>

              {/* PRICE */}
              <Field label="Price (₹)">
                <input
                  type="number"
                  className="
              w-full
              bg-black/80
              border border-[#00FF6A]/40
              rounded-lg
              px-3 py-3
              text-white
              placeholder-gray-500
              focus:outline-none
              focus:ring-2 focus:ring-[#00FF6A]
              transition
            "
                  placeholder="Eg: 4999"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </Field>

              {/* DURATION (CUSTOM SELECT – NO WHITE BG) */}
              <Field label="Duration">
                <div className="relative">
                  <select
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: e.target.value })
                    }
                    className="
                w-full appearance-none
                bg-black/80
                border border-[#00FF6A]/40
                rounded-lg
                px-3 py-3 pr-10
                text-white
                focus:outline-none
                focus:ring-2 focus:ring-[#00FF6A]
                transition
              "
                  >
                    <option value="monthly" className="bg-black text-white">
                      Monthly (30 Days)
                    </option>
                    <option value="quarterly" className="bg-black text-white">
                      Quarterly (90 Days)
                    </option>
                    <option value="half_yearly" className="bg-black text-white">
                      Half Yearly (180 Days)
                    </option>
                    <option value="annual" className="bg-black text-white">
                      Annual (365 Days)
                    </option>
                  </select>

                  {/* Custom arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#00FF6A]">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </Field>

              {/* BENEFITS */}
              <Field label="Benefits / Description">
                <textarea
                  rows={3}
                  className="
              w-full
              bg-black/80
              border border-[#00FF6A]/40
              rounded-lg
              px-3 py-3
              text-white
              placeholder-gray-500
              resize-none
              focus:outline-none
              focus:ring-2 focus:ring-[#00FF6A]
              transition
            "
                  placeholder="Eg: Unlimited access, trainer support, diet guidance"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </Field>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#00FF6A]/20">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="
            px-6 py-2 rounded-lg
            border border-gray-500/40
            text-gray-400
            hover:bg-white/5
            transition
          "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="
            px-7 py-2 rounded-lg
            bg-[#00FF6A]
            text-black
            font-bold
            tracking-wide
            hover:shadow-[0_0_25px_#00FF6Aaa]
            transition
            disabled:opacity-60
          "
              >
                {saving
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Plan"
                  : "Update Plan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* ---------- FIELD ---------- */
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

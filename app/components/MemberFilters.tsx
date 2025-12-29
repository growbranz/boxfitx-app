"use client";

export default function MemberFilters({ onChange }: any) {
  return (
    <div
      className="
        mb-8 p-5 rounded-2xl
        bg-black/70 backdrop-blur
        border border-[#00FF6A]/30
        shadow-[0_0_40px_#00FF6A11]
      "
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* SEARCH */}
        <input
          placeholder="Search name, phone or email"
          className="
            p-3 rounded-lg
            bg-black/60 border border-[#00FF6A]/30
            text-white placeholder-gray-500
            focus:outline-none
            focus:ring-2 focus:ring-[#00FF6A]/40
            focus:border-[#00FF6A]
            transition
          "
          onChange={(e) =>
            onChange((p: any) => ({ ...p, search: e.target.value, page: 1 }))
          }
        />

        {/* STATUS */}
        <select
          className="
            p-3 rounded-lg
            bg-black/60 border border-[#00FF6A]/30
            text-white
            focus:outline-none
            focus:ring-2 focus:ring-[#00FF6A]/40
            focus:border-[#00FF6A]
            transition
          "
          onChange={(e) =>
            onChange((p: any) => ({ ...p, status: e.target.value, page: 1 }))
          }
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* PLAN */}
        <select
          className="
            p-3 rounded-lg
            bg-black/60 border border-[#00FF6A]/30
            text-white
            focus:outline-none
            focus:ring-2 focus:ring-[#00FF6A]/40
            focus:border-[#00FF6A]
            transition
          "
          onChange={(e) =>
            onChange((p: any) => ({ ...p, planType: e.target.value, page: 1 }))
          }
        >
          <option value="">All Plans</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="half_yearly">Half Yearly</option>
          <option value="annual">Annual</option>
        </select>

        {/* GENDER */}
        <select
          className="
            p-3 rounded-lg
            bg-black/60 border border-[#00FF6A]/30
            text-white
            focus:outline-none
            focus:ring-2 focus:ring-[#00FF6A]/40
            focus:border-[#00FF6A]
            transition
          "
          onChange={(e) =>
            onChange((p: any) => ({ ...p, gender: e.target.value, page: 1 }))
          }
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
    </div>
  );
}

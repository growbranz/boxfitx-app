"use client";

import { useState } from "react";

export default function MemberForm({ initialData, onSubmit }: any) {
  const [form, setForm] = useState(
    initialData || {
      fullName: "",
      email: "",
      number: "",
      gender: "Male",
      dob: "",
      heightCm: "",
      weightCm: "",
      fitnessGoal: "general_fitness",
    }
  );

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="
        bg-white
        border border-gray-200
        rounded-xl
        shadow-sm
        p-6
        grid grid-cols-1 md:grid-cols-2 gap-5
      "
    >
      {/* FULL NAME */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
          placeholder="Enter full name"
          className="w-full p-3 rounded-lg border border-gray-300 text-gray-900
          focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition"
        />
      </div>

      {/* EMAIL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Enter email"
          className="w-full p-3 rounded-lg border border-gray-300 text-gray-900
          focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition"
        />
      </div>

      {/* PHONE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          name="number"
          value={form.number}
          onChange={handleChange}
          placeholder="Enter phone number"
          className="w-full p-3 rounded-lg border border-gray-300 text-gray-900
          focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition"
        />
      </div>

      {/* GENDER */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender
        </label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 text-gray-900
          focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* DATE OF BIRTH */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth
        </label>
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 text-gray-900
          focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition"
        />
      </div>

      {/* FITNESS GOAL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fitness Goal
        </label>
        <select
          name="fitnessGoal"
          value={form.fitnessGoal}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 text-gray-900
          focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition"
        >
          <option value="general_fitness">General Fitness</option>
          <option value="weight_loss">Weight Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="boxing_combat">Boxing / Combat</option>
        </select>
      </div>

      {/* SUBMIT */}
      <div className="md:col-span-2 pt-4">
        <button
          type="submit"
          className="
            w-full py-3 rounded-lg
            bg-green-600 text-white font-semibold
            hover:bg-green-700
            focus:ring-2 focus:ring-green-500/40
            transition
          "
        >
          Save Member
        </button>
      </div>
    </form>
  );
}

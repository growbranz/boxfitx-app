export default function ExpiringTable({ members }: any) {
  return (
    <div
      className="bg-black rounded-2xl border border-white/10
    shadow-[0_0_30px_rgba(0,255,106,0.15)]"
    >
      <div className="p-5 border-b border-white/10">
        <h2 className="text-lg font-semibold text-green-400">
          Memberships Expiring Soon
        </h2>
        <p className="text-xs text-gray-400 mt-1">Next 7 days</p>
      </div>

      <table className="w-full text-sm">
        <thead className="text-gray-400 bg-white/5">
          <tr>
            <th className="p-3 text-left">Member</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Email</th>
            <th className="p-3">Expiry</th>
          </tr>
        </thead>

        <tbody>
          {members.map((m: any) => (
            <tr
              key={m._id}
              className="border-t border-white/10 hover:bg-white/5 transition"
            >
              <td className="p-3 font-medium text-white">{m.fullName}</td>
              <td className="p-3 text-gray-300">{m.number}</td>
              <td className="p-3 text-gray-300">{m.email}</td>
              <td className="p-3 text-red-400 font-semibold">
                {new Date(m.membership.expiryDate).toDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

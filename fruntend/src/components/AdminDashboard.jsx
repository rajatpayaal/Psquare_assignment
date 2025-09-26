// src/components/AdminDashboard.jsx
import api from "../utils/apiService";

export default function AdminDashboard({ overview = { trips: 0, bookings: 0, departures: 0 } }) {
  const icon = (d) => (
    <svg className={`w-7 h-7 ${d.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {d.path}
    </svg>
  );

  const cards = [
    {
      label: 'Total Trips',
      value: overview.trips,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    },
    {
      label: 'Total Bookings',
      value: overview.bookings,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    },
    {
      label: 'Upcoming Departures',
      value: overview.departures,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      path: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    }
  ];

  return (
    <div className="grid gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(c => (
        <div
          key={c.label}
          className="group relative bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/40 transition-all duration-300 hover:shadow-lg hover:border-gray-300"
          tabIndex={0}
          aria-label={`${c.label}: ${c.value}`}
        >
          <div className="flex items-start">
            <div className={`flex-shrink-0 w-12 h-12 ${c.iconBg} rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300`}>
              {icon(c)}
            </div>
            <div className="ml-4 flex-1">
              <p className="text-xs font-medium text-gray-500 tracking-wide uppercase">{c.label}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900 tabular-nums">{c.value}</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/60" />
        </div>
      ))}
    </div>
  );
}
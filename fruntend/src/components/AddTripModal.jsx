import React, { useState, useEffect } from "react";

// Reusable for both add and edit operations
export default function AddTripModal({ onAdd, onUpdate, onClose, existingTrip }) {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    transportType: "Flight", // default
    pricePerSeat: "",
    totalSeats: "",
    imageUrl: "", // optional
  });
  const isEdit = !!existingTrip;

  useEffect(() => {
    if (existingTrip) {
      // Pre-fill form with existing trip converting ISO date to datetime-local value
      const toLocalInput = (iso) =>
        iso ? new Date(iso).toISOString().slice(0, 16) : ""; // YYYY-MM-DDTHH:MM
      setFormData({
        from: existingTrip.from || "",
        to: existingTrip.to || "",
        departureTime: toLocalInput(existingTrip.departureTime),
        arrivalTime: toLocalInput(existingTrip.arrivalTime),
        transportType: existingTrip.transportType || "Flight",
        pricePerSeat: existingTrip.pricePerSeat || existingTrip.price || "",
        totalSeats: existingTrip.totalSeats || "",
        imageUrl: existingTrip.imageUrl || "",
      });
    }
  }, [existingTrip]);

  const [error, setError] = useState(""); // State for form validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.from || !formData.to) {
      setError("From and To fields are required.");
      return;
    }
    if (!formData.departureTime || !formData.arrivalTime) {
      setError("Departure and Arrival times are required.");
      return;
    }
    if (new Date(formData.departureTime) >= new Date(formData.arrivalTime)) {
      setError("Departure time must be earlier than Arrival time.");
      return;
    }
    if (!formData.pricePerSeat || formData.pricePerSeat <= 0) {
      setError("Price per seat must be a positive number.");
      return;
    }
    if (!formData.totalSeats || formData.totalSeats <= 0) {
      setError("Total seats must be a positive number.");
      return;
    }

    // Clear error and prepare data
    setError("");
    const tripData = {
      ...formData,
      departureTime: new Date(formData.departureTime).toISOString(),
      arrivalTime: new Date(formData.arrivalTime).toISOString(),
      pricePerSeat: Number(formData.pricePerSeat),
      totalSeats: Number(formData.totalSeats),
    };

    if (isEdit) {
      onUpdate && onUpdate(existingTrip._id || existingTrip.id, tripData);
    } else {
      onAdd && onAdd(tripData); // Pass cleaned data to parent
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-start md:items-center justify-center px-4 py-8 z-50 overflow-y-auto">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold tracking-tight text-gray-900">{isEdit ? "Edit Trip" : "Add New Trip"}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 pt-5 pb-6 space-y-6">
          {error && (
            <div className="text-sm font-medium rounded-md px-4 py-3 bg-red-50 text-red-600 border border-red-200 flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19h13.86A2 2 0 0021 17.34L12.97 4.66a2 2 0 00-3.94 0L3 17.34A2 2 0 005.07 19z" /></svg>
              <span>{error}</span>
            </div>
          )}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">From</label>
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-lg px-3 py-2.5 text-sm transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">To</label>
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-lg px-3 py-2.5 text-sm transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Departure Time</label>
              <input
                type="datetime-local"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-lg px-3 py-2.5 text-sm transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Arrival Time</label>
              <input
                type="datetime-local"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleChange}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-lg px-3 py-2.5 text-sm transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Transport Type</label>
              <select
                name="transportType"
                value={formData.transportType}
                onChange={handleChange}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-lg px-3 py-2.5 text-sm transition-colors bg-white"
                required
              >
                <option value="Flight">Flight</option>
                <option value="Train">Train</option>
                <option value="Bus">Bus</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Price Per Seat ($)</label>
              <input
                type="number"
                name="pricePerSeat"
                value={formData.pricePerSeat}
                onChange={handleChange}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-lg px-3 py-2.5 text-sm transition-colors"
                required
                min={1}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Total Seats</label>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-lg px-3 py-2.5 text-sm transition-colors"
                required
                min={1}
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">Image URL (optional)</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-lg px-3 py-2.5 text-sm transition-colors"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
            >
              {isEdit ? "Save Changes" : "Add Trip"}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes scale-in { from { opacity:0; transform: translateY(10px) scale(.96); } to { opacity:1; transform: translateY(0) scale(1); } }
        .animate-scale-in { animation: scale-in .35s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
}

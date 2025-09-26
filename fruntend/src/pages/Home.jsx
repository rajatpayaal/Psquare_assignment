import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/apiService.js";
import "../styles/home.css";

export default function Home() {
  const [filters, setFilters] = useState({ from: "", to: "", date: "" });
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await api.getTrips(filters); // expected { success: true, trips: [...] }
      console.log("API Response: homepage", resp);
      const list = Array.isArray(resp) ? resp : resp?.trips; // backward compatible if old shape cached
      setTrips(Array.isArray(list) ? list : []);
      console.log("trip data ", Array.isArray(list) ? list.length : 0);

    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Failed to load trips. Please try again.");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      {/* 🔍 Search Section */}
      <div className="search-section">
        <h2 className="search-title">Find Your Next Journey</h2>
        <p className="search-subtitle">
          Discover amazing destinations and book your perfect trip
        </p>
        <div className="search-form">
          <input
            className="search-input"
            placeholder="From"
            value={filters.from}
            onChange={(e) =>
              setFilters({ ...filters, from: e.target.value })
            }
          />
          <input
            className="search-input"
            placeholder="To"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
          <input
            type="date"
            className="search-input"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
          <button onClick={load} className="search-button">
            Search Trips
          </button>
        </div>
      </div>

      {/* 🚍 Available Trips */}
      <section className="section-header compact">
        <h3>Available Trips</h3>
        <p className="muted">Choose from our carefully selected destinations and enjoy a comfortable journey.</p>
      </section>

      {loading && <p className="text-gray-500">Loading trips...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="trips-grid modern">
        {trips && trips.length > 0 ? (
          trips.map((t, index) => {
            const availableSeats = t.seats?.filter((s) => !s.isBooked).length;
            const departure = new Date(t.departureTime);
            const arrival = new Date(t.arrivalTime);
            return (
              <article key={t._id || index} className="trip-card enhanced">
                {t.imageUrl && (
                  <div className="trip-media">
                    <img src={t.imageUrl} alt={`${t.from} to ${t.to}`} />
                    {availableSeats <= 5 && (
                      <span className="badge warning">{availableSeats} left</span>
                    )}
                  </div>
                )}
                <div className="trip-body">
                  <header className="trip-header">
                    <span className="transport-type">{t.transportType}</span>
                    <h4 className="route">{t.from} <span className="arrow">→</span> {t.to}</h4>
                  </header>
                  <ul className="timings">
                    <li><strong>Departure:</strong> {departure.toLocaleDateString()} <span className="time">{departure.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></li>
                    <li><strong>Arrival:</strong> {arrival.toLocaleDateString()} <span className="time">{arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></li>
                  </ul>
                  <div className="meta-row">
                    <span className="seats">Seats: <strong>{availableSeats}</strong>/<span>{t.totalSeats}</span></span>
                    <span className="price">${t.pricePerSeat}<small>/seat</small></span>
                  </div>
                  <Link to={`/trips/${t._id}`} className="btn book primary">
                    Book Now
                  </Link>
                </div>
              </article>
            );
          })
        ) : (
          !loading && <p className="no-results">No trips available.</p>
        )}
      </div>
    </div>
  );
}

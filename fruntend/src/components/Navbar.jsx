import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../store/authContext.jsx';

export default function Navbar() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  const authed = typeof isAuthenticated === 'function' ? isAuthenticated() : !!user;

  const navLinkBase = 'block px-4 py-2 md:px-0 md:py-0 md:mx-3 text-sm font-medium transition-colors';
  const navLinkClass = (isActive) => `${navLinkBase} ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`;

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-blue-600 text-xl">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✈</span>
          </div>
          Argo
        </Link>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
        >
          <svg
            className={`w-5 h-5 transition-transform ${open ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={({ isActive }) => navLinkClass(isActive)}>Home</NavLink>
          {authed && (
            <>
              <NavLink to="/my-bookings" className={({ isActive }) => navLinkClass(isActive)}>My Bookings</NavLink>
              <NavLink to="/profile" className={({ isActive }) => navLinkClass(isActive)}>Profile</NavLink>
            </>
          )}
          {authed && isAdmin?.() && (
            <NavLink to="/admin" className={({ isActive }) => navLinkClass(isActive)}>Admin</NavLink>
          )}
          {!authed ? (
            <div className="flex items-center gap-3">
              <NavLink to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Log In</NavLink>
              <NavLink to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50">Sign Up</NavLink>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-gray-700 text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900 leading-tight">{user?.name}</p>
                  <p className="text-xs text-gray-500">{isAdmin?.() ? 'Administrator' : 'User'}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-out bg-white border-b shadow-sm ${open ? 'max-h-[420px]' : 'max-h-0'}`}
      >
        <div className="px-4 pt-2 pb-4 flex flex-col">
          <NavLink onClick={() => setOpen(false)} to="/" className={({ isActive }) => navLinkClass(isActive)}>Home</NavLink>
          {authed && (
            <>
              <NavLink onClick={() => setOpen(false)} to="/my-bookings" className={({ isActive }) => navLinkClass(isActive)}>My Bookings</NavLink>
              <NavLink onClick={() => setOpen(false)} to="/profile" className={({ isActive }) => navLinkClass(isActive)}>Profile</NavLink>
            </>
          )}
          {authed && isAdmin?.() && (
            <NavLink onClick={() => setOpen(false)} to="/admin" className={({ isActive }) => navLinkClass(isActive)}>Admin</NavLink>
          )}
          {!authed ? (
            <div className="mt-2 flex flex-col gap-2">
              <NavLink onClick={() => setOpen(false)} to="/login" className="w-full text-left px-4 py-2 rounded-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100">Log In</NavLink>
              <NavLink onClick={() => setOpen(false)} to="/register" className="w-full text-left px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm">Sign Up</NavLink>
            </div>
          ) : (
            <div className="mt-3 flex items-center justify-between bg-gray-50 rounded-md px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-inner text-sm font-semibold text-gray-700">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">{isAdmin?.() ? 'Admin' : 'User'}</p>
                </div>
              </div>
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="text-xs font-medium text-red-600 hover:text-red-700 px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
              >Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}



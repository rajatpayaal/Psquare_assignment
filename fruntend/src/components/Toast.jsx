import { useEffect } from 'react';

export default function Toast({ type = 'info', message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(id);
  }, [message, duration, onClose]);

  if (!message) return null;
  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-500 text-gray-900'
  };

  return (
    <div
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={`fixed z-50 px-4 py-2 rounded-lg shadow-lg text-sm text-white flex items-center gap-2 max-w-xs sm:max-w-sm right-4 top-4 sm:top-4 sm:right-4 animate-slide-in ${colors[type] || colors.info}`}
      style={{
        animation: 'toast-slide-in 0.4s cubic-bezier(.4,0,.2,1), toast-fade-out 0.4s ease forwards',
        animationDelay: '0s, ' + (duration - 400) + 'ms'
      }}
    >
      {type === 'success' && (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      )}
      {type === 'error' && (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      )}
      {type === 'info' && (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )}
      {type === 'warning' && (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M4.93 19h14.14A2 2 0 0021 17.34L13.97 4.66a2 2 0 00-3.94 0L3 17.34A2 2 0 004.93 19z" /></svg>
      )}
      <span className="flex-1 leading-snug">
        {message}
      </span>
      <button
        aria-label="Close notification"
        onClick={() => onClose && onClose()}
        className="ml-2 text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded p-1 -mr-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <style>{`
        @keyframes toast-slide-in { from { transform: translateY(-8px) scale(.95); opacity:0; } to { transform: translateY(0) scale(1); opacity:1; } }
        @keyframes toast-fade-out { to { opacity:0; transform: translateY(-6px) scale(.98); } }
      `}</style>
    </div>
  );
}

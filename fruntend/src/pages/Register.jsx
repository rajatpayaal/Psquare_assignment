import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/apiService.js'

export default function Register() {
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    
    if (!form.name.trim()) {
      errors.name = 'Full name is required'
    } else if (form.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    
    if (!form.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!form.password) {
      errors.password = 'Password is required'
    } else if (form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }
    
    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(form.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setValidationErrors({})
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    try {
      await api.register(form)
      nav('/login', { state: { message: 'Registration successful! Please log in.' } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md bg-white rounded-xl shadow-lg p-8">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg">
          ✈️
        </div>
        <h1 className="text-2xl font-semibold mt-4 text-gray-900">Create Your Account</h1>
        <p className="text-sm text-gray-500 mt-2">Join thousands of travelers and start your journey</p>
      </div>
      
      <form className="mt-8 space-y-5" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            type="text"
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
            value={form.name} 
            onChange={(e) => setForm({...form, name: e.target.value})}
          />
          {validationErrors.name && (
            <p className="text-xs text-red-600 mt-1">{validationErrors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email"
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
            value={form.email} 
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
          {validationErrors.email && (
            <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password"
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Create a strong password"
            value={form.password} 
            onChange={(e) => setForm({...form, password: e.target.value})}
          />
          {validationErrors.password ? (
            <p className="text-xs text-red-600 mt-1">{validationErrors.password}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input 
            type="tel"
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              validationErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your phone number"
            value={form.phone} 
            onChange={(e) => setForm({...form, phone: e.target.value})}
          />
          {validationErrors.phone && (
            <p className="text-xs text-red-600 mt-1">{validationErrors.phone}</p>
          )}
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link className="text-blue-600 hover:text-blue-800 font-medium transition-colors" to="/login">
            Sign In
          </Link>
        </p>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}



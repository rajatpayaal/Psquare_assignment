import { useEffect, useState } from 'react'
import api from '../utils/apiService.js'
import { useAuth } from '../store/authContext.jsx'

function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="p-4 space-y-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  const { user, logout } = useAuth()
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [pwdOpen, setPwdOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [pwdSaving, setPwdSaving] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '' })
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '' })
  const [infoMsg, setInfoMsg] = useState('')

  useEffect(() => { 
    const loadProfile = async () => {
      try {
        const profileData = await api.profile()
        // profileData may now be { success, data } or raw object depending on backend wrapper
        const data = profileData?.data || profileData
        const normalized = data._doc ? data._doc : data
        setMe(normalized)
        setForm({ name: normalized.name || '', phone: normalized.phone || '' })
      } catch (err) {
        setError('Failed to load profile')
        console.error('Error loading profile:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    setError(''); setInfoMsg('')
    try {
      const resp = await api.updateProfile({ name: form.name, phone: form.phone })
      const updated = resp?.data || resp
      setMe(updated._doc ? updated._doc : updated)
      setInfoMsg('Profile updated')
      setEditOpen(false)
    } catch (e) {
      setError(e.message || 'Failed to update profile')
    } finally { setSaving(false) }
  }

  const handleChangePassword = async () => {
    if (!pwdForm.oldPassword || !pwdForm.newPassword) return
    setPwdSaving(true); setError(''); setInfoMsg('')
    try {
      await api.changePassword(pwdForm)
      setInfoMsg('Password changed')
      setPwdForm({ oldPassword: '', newPassword: '' })
      setPwdOpen(false)
    } catch (e) { setError(e.message || 'Failed to change password') }
    finally { setPwdSaving(false) }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!me) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Profile not found</p>
      </div>
    )
  }

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">Admin</span>
    }
    return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">User</span>
  }

  return (
    <>
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Account Information</h3>
          {getRoleBadge(me.role)}
        </div>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <div className="text-lg font-semibold text-gray-900">{me.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <div className="text-lg font-semibold text-gray-900">{me.email}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
              <div className="text-lg font-semibold text-gray-900">{me.phone || 'Not provided'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Account Status</label>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${me.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-lg font-semibold text-gray-900">
                  {me.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
              <div className="text-lg font-semibold text-gray-900">
                {new Date(me.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
              <div className="text-lg font-semibold text-gray-900">
                {new Date(me.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => setEditOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Edit Profile</button>
            <button onClick={() => setPwdOpen(true)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">Change Password</button>
            <button 
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
          {infoMsg && <p className="mt-4 text-sm text-green-600">{infoMsg}</p>}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>

      {/* Account Statistics */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Account Statistics</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{me.stats?.totalBookings ?? 0}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">${me.stats?.totalSpent ?? 0}</div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{me.stats?.loyaltyPoints ?? (me.loyaltyPoints || 0)}</div>
            <div className="text-sm text-gray-600">Loyalty Points</div>
          </div>
        </div>
      </div>
  </div>
  <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm mb-1">Phone</label>
          <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} className="w-full border rounded px-2 py-1" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={()=>setEditOpen(false)} className="px-3 py-1.5 text-sm rounded border">Cancel</button>
          <button disabled={saving} onClick={handleSaveProfile} className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white disabled:opacity-50">{saving?'Saving...':'Save'}</button>
        </div>
      </div>
  </Modal>
  <Modal open={pwdOpen} onClose={() => setPwdOpen(false)} title="Change Password">
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Old Password</label>
          <input type="password" value={pwdForm.oldPassword} onChange={e=>setPwdForm(f=>({...f,oldPassword:e.target.value}))} className="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm mb-1">New Password</label>
          <input type="password" value={pwdForm.newPassword} onChange={e=>setPwdForm(f=>({...f,newPassword:e.target.value}))} className="w-full border rounded px-2 py-1" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={()=>setPwdOpen(false)} className="px-3 py-1.5 text-sm rounded border">Cancel</button>
          <button disabled={pwdSaving} onClick={handleChangePassword} className="px-3 py-1.5 text-sm rounded bg-gray-600 text-white disabled:opacity-50">{pwdSaving?'Updating...':'Update'}</button>
        </div>
      </div>
    </Modal>
    </>
  )
}



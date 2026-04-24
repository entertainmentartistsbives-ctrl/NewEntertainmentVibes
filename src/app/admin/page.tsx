'use client';

import { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus, FaSignOutAlt, FaStar, FaCrown, FaQuoteLeft } from 'react-icons/fa';

// Helper to compress large base64 images before sending to backend to avoid 413 Payload Too Large
const compressImage = (base64Str: string, maxWidth = 500): Promise<string> => {
  return new Promise((resolve) => {
    if (!base64Str.startsWith('data:image')) return resolve(base64Str);
    
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = maxWidth / img.width;
      if (ratio >= 1) return resolve(base64Str); // No need to compress if already small
      
      canvas.width = maxWidth;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => resolve(base64Str);
  });
};

export default function AdminDashboard() {
  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'featured' | 'testimonials' | 'subscribers' | 'trending' | 'exclusive'>('featured');
  
  const [artists, setArtists] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Artist Form State
  const [artistFormOpen, setArtistFormOpen] = useState(false);
  const [editingArtistId, setEditingArtistId] = useState<number | null>(null);
  const [artistForm, setArtistForm] = useState({
    name: '', category: '', location: '', price: '', imageUrl: '', rating: '', bio: '',
    isExclusive: false, isFeatured: false, isTrending: false, isActive: true
  });

  // Testimonial Form State
  const [testiFormOpen, setTestiFormOpen] = useState(false);
  const [editingTestiId, setEditingTestiId] = useState<number | null>(null);
  const [testiForm, setTestiForm] = useState({
    name: '', role: '', content: '', rating: '5', imageUrl: '', isActive: true
  });
  // Trending Form State
  const [trendingFormOpen, setTrendingFormOpen] = useState(false);
  const [editingTrendingId, setEditingTrendingId] = useState<number | null>(null);
  const [trendingForm, setTrendingForm] = useState({
    name: '', imageUrl: '', order: '0', isActive: true
  });

  // Exclusive Form State
  const [exclusiveFormOpen, setExclusiveFormOpen] = useState(false);
  const [editingExclusiveId, setEditingExclusiveId] = useState<number | null>(null);
  const [exclusiveForm, setExclusiveForm] = useState({
    name: '', category: 'Singer', location: 'Mumbai', bio: '', price: 'On Request',
    imageUrl: '', rating: '5', order: '0', isActive: true
  });

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/artists', {
        headers: { 'x-admin-token': token }
      });
      if (res.ok) {
        setIsLoggedIn(true);
        const data = await res.json();
        fetchArtists();
        fetchTestimonials();
        fetchSubscribers();
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  const fetchArtists = async () => {
    const res = await fetch('/api/admin/artists', { headers: { 'x-admin-token': token } });
    if (res.ok) {
      const data = await res.json();
      setArtists(data.data);
    }
  };

  const fetchTestimonials = async () => {
    const res = await fetch('/api/admin/testimonials', { headers: { 'x-admin-token': token } });
    if (res.ok) {
      const data = await res.json();
      setTestimonials(data.data);
    }
  };

  const fetchSubscribers = async () => {
    const res = await fetch('/api/admin/subscribers', { headers: { 'x-admin-token': token } });
    if (res.ok) {
      const data = await res.json();
      setSubscribers(data.data);
    }
  };

  const handleLogout = () => {
    setToken('');
    setIsLoggedIn(false);
    setArtists([]);
    setTestimonials([]);
    setSubscribers([]);
  };

  const deleteSubscriber = async (id: number) => {
    if (!confirm('Remove this subscriber from the list?')) return;
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token },
      });
      if (res.ok) fetchSubscribers();
      else alert('Failed to delete subscriber');
    } catch {
      alert('Error deleting subscriber');
    }
  };

  // --- ARTIST HANDLERS ---
  const handleArtistFormChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setArtistForm({ ...artistForm, [e.target.name]: value });
  };

  const openNewArtistForm = () => {
    setEditingArtistId(null);
    setArtistForm({ 
      name: '', category: '', location: '', price: '', imageUrl: '', rating: '5', bio: '', 
      isExclusive: activeTab === 'exclusive', 
      isFeatured: activeTab === 'featured', 
      isTrending: activeTab === 'trending', 
      isActive: true 
    });
    setArtistFormOpen(true);
  };

  const openEditArtistForm = (artist: any) => {
    setEditingArtistId(artist.id);
    setArtistForm({
      name: artist.name, category: artist.category, location: artist.location, price: artist.price,
      imageUrl: artist.imageUrl || '', rating: artist.rating || '', bio: artist.bio || '',
      isExclusive: artist.isExclusive, isFeatured: artist.isFeatured, isTrending: artist.isTrending, isActive: artist.isActive
    });
    setArtistFormOpen(true);
  };

  const saveArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editingArtistId ? `/api/admin/artists/${editingArtistId}` : '/api/admin/artists';
    const method = editingArtistId ? 'PUT' : 'POST';

    try {
      // Compress image if they pasted a massive base64 string
      const compressedImageUrl = await compressImage(artistForm.imageUrl, 600);
      const payload = { ...artistForm, imageUrl: compressedImageUrl };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setArtistFormOpen(false);
        fetchArtists();
      } else {
        const errorData = await res.json();
        alert(`Failed to save artist: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Error saving artist');
    }
    setLoading(false);
  };

  const deleteArtist = async (id: number) => {
    if (!confirm('Are you sure you want to delete this artist?')) return;
    try {
      const res = await fetch(`/api/admin/artists/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      if (res.ok) fetchArtists();
      else alert('Failed to delete');
    } catch {
      alert('Error deleting');
    }
  };

  // --- TESTIMONIAL HANDLERS ---
  const handleTestiFormChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setTestiForm({ ...testiForm, [e.target.name]: value });
  };

  const openNewTestiForm = () => {
    setEditingTestiId(null);
    setTestiForm({ name: '', role: '', content: '', rating: '5', imageUrl: '', isActive: true });
    setTestiFormOpen(true);
  };

  const openEditTestiForm = (testi: any) => {
    setEditingTestiId(testi.id);
    setTestiForm({
      name: testi.name, role: testi.role || '', content: testi.content, 
      rating: testi.rating?.toString() || '5', imageUrl: testi.imageUrl || '', isActive: testi.isActive
    });
    setTestiFormOpen(true);
  };

  const saveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editingTestiId ? `/api/admin/testimonials/${editingTestiId}` : '/api/admin/testimonials';
    const method = editingTestiId ? 'PUT' : 'POST';

    try {
      // Compress image if they pasted a massive base64 string
      const compressedImageUrl = await compressImage(testiForm.imageUrl, 200);
      const payload = { ...testiForm, imageUrl: compressedImageUrl };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setTestiFormOpen(false);
        fetchTestimonials();
      } else {
        const errorData = await res.json();
        alert(`Failed to save testimonial: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Error saving testimonial');
    }
    setLoading(false);
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      if (res.ok) fetchTestimonials();
      else alert('Failed to delete');
    } catch {
      alert('Error deleting');
    }
  };

  const deleteExclusive = async (id: number) => {
    if (!confirm('Are you sure you want to delete this exclusive artist?')) return;
    try {
      const res = await fetch(`/api/admin/exclusive/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      if (res.ok) fetchArtists();
      else alert('Failed to delete');
    } catch {
      alert('Error deleting');
    }
  };

  // --- TRENDING HANDLERS ---
  const handleTrendingFormChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setTrendingForm({ ...trendingForm, [e.target.name]: value });
  };

  const openNewTrendingForm = () => {
    setEditingTrendingId(null);
    setTrendingForm({ name: '', imageUrl: '', order: '0', isActive: true });
    setTrendingFormOpen(true);
  };

  const openEditTrendingForm = (artist: any) => {
    setEditingTrendingId(artist.id);
    setTrendingForm({
      name: artist.name,
      imageUrl: artist.imageUrl || '',
      order: artist.order?.toString() || '0',
      isActive: artist.isActive,
    });
    setTrendingFormOpen(true);
  };

  const saveTrending = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editingTrendingId ? `/api/admin/trending/${editingTrendingId}` : '/api/admin/trending';
    const method = editingTrendingId ? 'PUT' : 'POST';
    try {
      const compressedImageUrl = await compressImage(trendingForm.imageUrl, 600);
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ ...trendingForm, imageUrl: compressedImageUrl }),
      });
      if (res.ok) {
        setTrendingFormOpen(false);
        fetchArtists();
      } else {
        alert('Failed to save trending artist');
      }
    } catch {
      alert('Error saving trending artist');
    }
    setLoading(false);
  };

  const deleteTrending = async (id: number) => {
    if (!confirm('Delete this trending artist?')) return;
    try {
      const res = await fetch(`/api/admin/trending/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token },
      });
      if (res.ok) fetchArtists();
      else alert('Failed to delete');
    } catch {
      alert('Error deleting');
    }
  };

  // --- EXCLUSIVE HANDLERS ---
  const handleExclusiveFormChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setExclusiveForm({ ...exclusiveForm, [e.target.name]: value });
  };

  const openNewExclusiveForm = () => {
    setEditingExclusiveId(null);
    setExclusiveForm({ name: '', category: 'Singer', location: 'Mumbai', bio: '', price: 'On Request', imageUrl: '', rating: '5', order: '0', isActive: true });
    setExclusiveFormOpen(true);
  };

  const openEditExclusiveForm = (artist: any) => {
    setEditingExclusiveId(artist.id);
    setExclusiveForm({
      name: artist.name,
      category: artist.category || 'Singer',
      location: artist.location || 'Mumbai',
      bio: artist.bio || '',
      price: artist.price || 'On Request',
      imageUrl: artist.imageUrl || '',
      rating: artist.rating?.toString() || '5',
      order: artist.order?.toString() || '0',
      isActive: artist.isActive,
    });
    setExclusiveFormOpen(true);
  };

  const saveExclusive = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editingExclusiveId ? `/api/admin/exclusive/${editingExclusiveId}` : '/api/admin/exclusive';
    const method = editingExclusiveId ? 'PUT' : 'POST';
    try {
      const compressedImageUrl = await compressImage(exclusiveForm.imageUrl, 600);
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ ...exclusiveForm, imageUrl: compressedImageUrl }),
      });
      if (res.ok) {
        setExclusiveFormOpen(false);
        fetchArtists();
      } else {
        alert('Failed to save exclusive artist');
      }
    } catch {
      alert('Error saving exclusive artist');
    }
    setLoading(false);
  };

  // --- LOGIN SCREEN ---

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4">
        <div className="card-glass p-8 w-full max-w-md text-center">
          <h1 className="font-display text-3xl font-bold text-[#d4a843] mb-2">Admin Login</h1>
          <p className="text-gray-400 mb-8">Enter the master password to manage content.</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter Password" 
              value={token} 
              onChange={(e) => setToken(e.target.value)} 
              required 
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Authenticating...' : 'Login to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD SCREEN ---
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-[#10101a] p-6 rounded-2xl border border-[rgba(255,255,255,0.05)] shadow-lg">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="btn btn-ghost btn-sm text-red-400 hover:text-red-500 hover:bg-red-500/10"><FaSignOutAlt /> Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-[rgba(255,255,255,0.05)] pb-2">
        <button 
          onClick={() => setActiveTab('featured')} 
          className={`px-4 py-2 font-bold text-lg border-b-2 transition-all ${activeTab === 'featured' ? 'text-[#d4a843] border-[#d4a843]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
        >
          Featured Artists ({artists.filter(a => a.isFeatured).length})
        </button>
        <button 
          onClick={() => setActiveTab('testimonials')} 
          className={`px-4 py-2 font-bold text-lg border-b-2 transition-all ${activeTab === 'testimonials' ? 'text-[#d4a843] border-[#d4a843]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
        >
          Testimonials ({testimonials.length})
        </button>
        <button 
          onClick={() => setActiveTab('subscribers')} 
          className={`px-4 py-2 font-bold text-lg border-b-2 transition-all ${activeTab === 'subscribers' ? 'text-[#d4a843] border-[#d4a843]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
        >
          Subscribers ({subscribers.length})
        </button>
        <button 
          onClick={() => setActiveTab('trending')} 
          className={`px-4 py-2 font-bold text-lg border-b-2 transition-all ${activeTab === 'trending' ? 'text-[#d4a843] border-[#d4a843]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
        >
          Trending ({artists.filter(a => a.isTrending).length})
        </button>
        <button 
          onClick={() => setActiveTab('exclusive')} 
          className={`px-4 py-2 font-bold text-lg border-b-2 transition-all ${activeTab === 'exclusive' ? 'text-[#d4a843] border-[#d4a843]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
        >
          Exclusive ({artists.filter(a => a.isExclusive).length})
        </button>
      </div>

      {/* --- FEATURED ARTISTS TAB --- */}
      {activeTab === 'featured' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Manage Featured Artists</h2>
            <button onClick={openNewArtistForm} className="btn btn-primary btn-sm"><FaPlus /> Add New Artist</button>
          </div>
          
          <div className="bg-[#14141f] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#1a1a2e] text-xs uppercase text-gray-300">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status / Badges</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artists.filter(a => a.isFeatured).map((artist) => (
                    <tr key={artist.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[#1a1a2e]/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{artist.name}</td>
                      <td className="px-6 py-4">{artist.category}</td>
                      <td className="px-6 py-4">{artist.location}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {artist.isExclusive && <span className="badge badge-gold"><FaCrown /> Exclusive</span>}
                          {artist.isFeatured && <span className="badge badge-purple"><FaStar /> Featured</span>}
                          {artist.isActive ? (
                            <span className="badge badge-success">Active</span>
                          ) : (
                            <span className="badge bg-red-500/10 text-red-500 border-red-500/30">Inactive</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openEditArtistForm(artist)} className="text-blue-400 hover:text-blue-300 mr-4"><FaEdit size={18} /></button>
                        <button onClick={() => deleteArtist(artist.id)} className="text-red-500 hover:text-red-400"><FaTrash size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {artists.filter(a => a.isFeatured).length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No featured artists found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TESTIMONIALS TAB --- */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Manage Testimonials</h2>
            <button onClick={openNewTestiForm} className="btn btn-primary btn-sm"><FaPlus /> Add Testimonial</button>
          </div>
          
          <div className="bg-[#14141f] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#1a1a2e] text-xs uppercase text-gray-300">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map((testi) => (
                    <tr key={testi.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[#1a1a2e]/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{testi.name}</td>
                      <td className="px-6 py-4">{testi.role || '-'}</td>
                      <td className="px-6 py-4 flex items-center text-[#d4a843] gap-1"><FaStar /> {testi.rating}</td>
                      <td className="px-6 py-4">
                        {testi.isActive ? <span className="badge badge-success">Active</span> : <span className="badge bg-red-500/10 text-red-500 border-red-500/30">Inactive</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openEditTestiForm(testi)} className="text-blue-400 hover:text-blue-300 mr-4"><FaEdit size={18} /></button>
                        <button onClick={() => deleteTestimonial(testi.id)} className="text-red-500 hover:text-red-400"><FaTrash size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {testimonials.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No testimonials found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBSCRIBERS TAB --- */}
      {activeTab === 'subscribers' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Newsletter Subscribers</h2>
            <button onClick={fetchSubscribers} className="btn btn-ghost btn-sm text-gray-400">Refresh List</button>
          </div>
          
          <div className="bg-[#14141f] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#1a1a2e] text-xs uppercase text-gray-300">
                  <tr>
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Email Address</th>
                    <th className="px-6 py-4">Subscribed Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub, index) => (
                    <tr key={sub.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[#1a1a2e]/50 transition-colors">
                      <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-white">{sub.email}</td>
                      <td className="px-6 py-4">{new Date(sub.createdAt).toLocaleDateString()} at {new Date(sub.createdAt).toLocaleTimeString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteSubscriber(sub.id)} className="text-red-500 hover:text-red-400" title="Remove subscriber"><FaTrash size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {subscribers.length === 0 && (
                    <tr><td colSpan={4} className="text-center py-8 text-gray-500">No subscribers found yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TRENDING TAB --- */}
      {activeTab === 'trending' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Manage Trending Artists</h2>
            <button onClick={openNewArtistForm} className="btn btn-primary btn-sm"><FaPlus /> Add Trending Artist</button>
          </div>
          
          <div className="bg-[#14141f] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#1a1a2e] text-xs uppercase text-gray-300">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status / Badges</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artists.filter(a => a.isTrending).map((artist) => (
                    <tr key={artist.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[#1a1a2e]/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{artist.name}</td>
                      <td className="px-6 py-4">{artist.category}</td>
                      <td className="px-6 py-4">{artist.location}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {artist.isExclusive && <span className="badge badge-gold"><FaCrown /> Exclusive</span>}
                          {artist.isFeatured && <span className="badge badge-purple"><FaStar /> Featured</span>}
                          {artist.isTrending && <span className="badge bg-orange-500/10 text-orange-500 border-orange-500/30">Trending</span>}
                          {artist.isActive ? (
                            <span className="badge badge-success">Active</span>
                          ) : (
                            <span className="badge bg-red-500/10 text-red-500 border-red-500/30">Inactive</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openEditArtistForm(artist)} className="text-blue-400 hover:text-blue-300 mr-4"><FaEdit size={18} /></button>
                        <button onClick={() => deleteArtist(artist.id)} className="text-red-500 hover:text-red-400"><FaTrash size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {artists.filter(a => a.isTrending).length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No trending artists found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- EXCLUSIVE TAB --- */}
      {activeTab === 'exclusive' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Manage Exclusive Artists</h2>
            <button onClick={openNewArtistForm} className="btn btn-primary btn-sm"><FaPlus /> Add Exclusive Artist</button>
          </div>
          
          <div className="bg-[#14141f] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#1a1a2e] text-xs uppercase text-gray-300">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status / Badges</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artists.filter(a => a.isExclusive).map((artist) => (
                    <tr key={artist.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[#1a1a2e]/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{artist.name}</td>
                      <td className="px-6 py-4">{artist.category}</td>
                      <td className="px-6 py-4">{artist.location}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {artist.isExclusive && <span className="badge badge-gold"><FaCrown /> Exclusive</span>}
                          {artist.isFeatured && <span className="badge badge-purple"><FaStar /> Featured</span>}
                          {artist.isTrending && <span className="badge bg-orange-500/10 text-orange-500 border-orange-500/30">Trending</span>}
                          {artist.isActive ? (
                            <span className="badge badge-success">Active</span>
                          ) : (
                            <span className="badge bg-red-500/10 text-red-500 border-red-500/30">Inactive</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openEditArtistForm(artist)} className="text-blue-400 hover:text-blue-300 mr-4"><FaEdit size={18} /></button>
                        <button onClick={() => deleteArtist(artist.id)} className="text-red-500 hover:text-red-400"><FaTrash size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {artists.filter(a => a.isExclusive).length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No exclusive artists found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD/EDIT ARTIST MODAL --- */}
      {artistFormOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title mb-6">{editingArtistId ? 'Edit Artist' : 'Add New Artist'}</h2>
            
            <form onSubmit={saveArtist} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label">Name *</label>
                  <input name="name" className="form-control" value={artistForm.name} onChange={handleArtistFormChange} required />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Category *</label>
                  <select name="category" className="form-control" value={artistForm.category} onChange={handleArtistFormChange} required>
                    <option value="">Select Category</option>
                    <option value="DJ">DJ</option>
                    <option value="Singer">Singer</option>
                    <option value="Dancer">Dancer</option>
                    <option value="Comedian">Comedian</option>
                    <option value="Band">Band</option>
                    <option value="Anchor">Anchor</option>
                    <option value="Musician">Musician</option>
                    <option value="Magician">Magician</option>
                    <option value="Stand-up Comic">Stand-up Comic</option>
                  </select>
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Location</label>
                  <input name="location" className="form-control" value={artistForm.location} onChange={handleArtistFormChange} />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Starting Price</label>
                  <input name="price" className="form-control" placeholder="e.g. ₹50,000 onwards" value={artistForm.price} onChange={handleArtistFormChange} />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Rating</label>
                  <input name="rating" type="number" step="0.1" min="1" max="5" className="form-control" placeholder="e.g. 4.5" value={artistForm.rating} onChange={handleArtistFormChange} />
                </div>
                <div className="form-group mb-0 col-span-2">
                  <label className="form-label">Bio / Details</label>
                  <textarea name="bio" className="form-control" rows={3} placeholder="Artist details..." value={artistForm.bio} onChange={handleArtistFormChange}></textarea>
                </div>
                <div className="form-group mb-0 col-span-2">
                  <label className="form-label">Photo Link (URL)</label>
                  <input name="imageUrl" className="form-control" placeholder="https://..." value={artistForm.imageUrl} onChange={handleArtistFormChange} />
                </div>
              </div>

              <div className="p-4 bg-[#1a1a2e] border border-[rgba(255,255,255,0.05)] rounded-lg flex flex-col gap-3 mt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isExclusive" checked={artistForm.isExclusive} onChange={handleArtistFormChange} className="w-4 h-4 accent-[#d4a843]" />
                  <span className="text-sm font-medium text-white">Exclusive Artist</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isFeatured" checked={artistForm.isFeatured} onChange={handleArtistFormChange} className="w-4 h-4 accent-[#d4a843]" />
                  <span className="text-sm font-medium text-white">Featured Artist</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isTrending" checked={artistForm.isTrending} onChange={handleArtistFormChange} className="w-4 h-4 accent-[#d4a843]" />
                  <span className="text-sm font-medium text-white">Trending Artist</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isActive" checked={artistForm.isActive} onChange={handleArtistFormChange} className="w-4 h-4 accent-[#d4a843]" />
                  <span className="text-sm font-medium text-white">Active</span>
                </label>
              </div>

              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setArtistFormOpen(false)} className="btn btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1" disabled={loading}>{loading ? 'Saving...' : 'Save Artist'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD/EDIT TESTIMONIAL MODAL --- */}
      {testiFormOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title mb-6">{editingTestiId ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
            
            <form onSubmit={saveTestimonial} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label">Client Name *</label>
                  <input name="name" className="form-control" value={testiForm.name} onChange={handleTestiFormChange} required />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Role / Company</label>
                  <input name="role" className="form-control" placeholder="e.g. Event Manager" value={testiForm.role} onChange={handleTestiFormChange} />
                </div>
                <div className="form-group mb-0 col-span-2">
                  <label className="form-label">Testimonial Content *</label>
                  <textarea name="content" className="form-control" rows={4} value={testiForm.content} onChange={handleTestiFormChange} required></textarea>
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Rating (1-5)</label>
                  <input name="rating" type="number" min="1" max="5" className="form-control" value={testiForm.rating} onChange={handleTestiFormChange} />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Avatar URL (Optional)</label>
                  <input name="imageUrl" className="form-control" placeholder="https://..." value={testiForm.imageUrl} onChange={handleTestiFormChange} />
                </div>
              </div>

              <div className="p-4 bg-[#1a1a2e] border border-[rgba(255,255,255,0.05)] rounded-lg flex flex-col gap-3 mt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isActive" checked={testiForm.isActive} onChange={handleTestiFormChange} className="w-4 h-4 accent-[#d4a843]" />
                  <span className="text-sm font-medium text-white">Active (Visible on homepage)</span>
                </label>
              </div>

              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setTestiFormOpen(false)} className="btn btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1" disabled={loading}>{loading ? 'Saving...' : 'Save Testimonial'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD/EDIT TRENDING MODAL --- */}
      {trendingFormOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title mb-6">{editingTrendingId ? 'Edit Trending Artist' : 'Add Trending Artist'}</h2>
            
            <form onSubmit={saveTrending} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input name="name" className="form-control" value={trendingForm.name} onChange={handleTrendingFormChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Photo URL / Base64 *</label>
                <input name="imageUrl" className="form-control" placeholder="https://..." value={trendingForm.imageUrl} onChange={handleTrendingFormChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Display Order (0, 1, 2...)</label>
                <input name="order" type="number" className="form-control" value={trendingForm.order} onChange={handleTrendingFormChange} />
              </div>

              <div className="p-4 bg-[#1a1a2e] border border-[rgba(255,255,255,0.05)] rounded-lg flex flex-col gap-3 mt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isActive" checked={trendingForm.isActive} onChange={handleTrendingFormChange} className="w-4 h-4 accent-[#d4a843]" />
                  <span className="text-sm font-medium text-white">Active (Visible in collage)</span>
                </label>
              </div>

              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setTrendingFormOpen(false)} className="btn btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1" disabled={loading}>{loading ? 'Saving...' : 'Save Trending Artist'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* --- ADD/EDIT EXCLUSIVE MODAL --- */}
      {exclusiveFormOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title mb-6">{editingExclusiveId ? 'Edit Exclusive Artist' : 'Add Exclusive Artist'}</h2>
            <form onSubmit={saveExclusive} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label">Name *</label>
                  <input name="name" className="form-control" value={exclusiveForm.name} onChange={handleExclusiveFormChange} required />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Category *</label>
                  <select name="category" className="form-control" value={exclusiveForm.category} onChange={handleExclusiveFormChange} required>
                    <option value="Singer">Singer</option>
                    <option value="DJ">DJ</option>
                    <option value="Dancer">Dancer</option>
                    <option value="Comedian">Comedian</option>
                    <option value="Band">Band</option>
                    <option value="Anchor">Anchor</option>
                    <option value="Musician">Musician</option>
                    <option value="Magician">Magician</option>
                    <option value="Stand-up Comic">Stand-up Comic</option>
                  </select>
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Location</label>
                  <input name="location" className="form-control" value={exclusiveForm.location} onChange={handleExclusiveFormChange} />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Starting Price</label>
                  <input name="price" className="form-control" placeholder="e.g. ₹5,00,000 onwards" value={exclusiveForm.price} onChange={handleExclusiveFormChange} />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Rating (1-5)</label>
                  <input name="rating" type="number" step="0.1" min="1" max="5" className="form-control" value={exclusiveForm.rating} onChange={handleExclusiveFormChange} />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Display Order</label>
                  <input name="order" type="number" className="form-control" value={exclusiveForm.order} onChange={handleExclusiveFormChange} />
                </div>
                <div className="form-group mb-0 col-span-2">
                  <label className="form-label">Bio / Description</label>
                  <textarea name="bio" className="form-control" rows={3} placeholder="Artist bio shown on the book page..." value={exclusiveForm.bio} onChange={handleExclusiveFormChange}></textarea>
                </div>
                <div className="form-group mb-0 col-span-2">
                  <label className="form-label">Photo URL *</label>
                  <input name="imageUrl" className="form-control" placeholder="https://..." value={exclusiveForm.imageUrl} onChange={handleExclusiveFormChange} required />
                  {exclusiveForm.imageUrl && <img src={exclusiveForm.imageUrl} alt="preview" className="mt-2 h-32 object-cover rounded-lg border border-gray-700" />}
                </div>
              </div>
              <div className="p-4 bg-[#1a1a2e] border border-[rgba(255,255,255,0.05)] rounded-lg flex flex-col gap-3 mt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isActive" checked={exclusiveForm.isActive} onChange={handleExclusiveFormChange} className="w-4 h-4 accent-[#d4a843]" />
                  <span className="text-sm font-medium text-white">Active (Visible on homepage)</span>
                </label>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setExclusiveFormOpen(false)} className="btn btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1" disabled={loading}>{loading ? 'Saving...' : 'Save Exclusive Artist'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

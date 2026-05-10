import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, X, Image as ImageIcon, MapPin, DollarSign, Bed, Bath, Square, Info, CheckCircle2 } from 'lucide-react';

export const AddProperty: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '1',
    bathrooms: '1',
    sqft: '',
    parking_spaces: '0',
    year_built: '',
    type: 'Villa',
    status: 'For Sale',
    featured: false,
    image_url: '',
    images: [] as string[]
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  if (!user) {
    navigate('/auth');
    return null;
  }

  const addImage = () => {
    if (newImageUrl && !formData.images.includes(newImageUrl)) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl] });
      setNewImageUrl('');
    }
  };

  const removeImage = (url: string) => {
    setFormData({ ...formData, images: formData.images.filter(img => img !== url) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          sqft: parseInt(formData.sqft),
          parking_spaces: parseInt(formData.parking_spaces),
          year_built: formData.year_built ? parseInt(formData.year_built) : null,
          featured: formData.featured
        })
      });

      if (!response.ok) throw new Error('Failed to list property');
      
      navigate('/properties');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#f8f9fa]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Partner With Us</span>
          <h1 className="text-5xl font-serif text-primary mb-6">List Your Property</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Showcase your estate to our global network of high-net-worth investors and discerning buyers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white rounded-[40px] p-12 shadow-sm border border-gray-50 space-y-10">
              <h2 className="text-2xl font-serif text-primary flex items-center">
                <Info className="w-6 h-6 mr-3 text-secondary" /> Basic Information
              </h2>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Property Title</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-gray-50 border-none px-8 py-5 rounded-2xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" 
                    placeholder="e.g. Modern Hilltop Villa in Hill Station"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                  <textarea 
                    rows={6}
                    required
                    className="w-full bg-gray-50 border-none px-8 py-5 rounded-3xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary resize-none" 
                    placeholder="Describe the unique features, views, and amenities..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
                      <input 
                        type="number" 
                        required
                        className="w-full bg-gray-50 border-none pl-16 pr-8 py-5 rounded-2xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" 
                        placeholder="500000"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
                      <input 
                        type="text" 
                        required
                        className="w-full bg-gray-50 border-none pl-16 pr-8 py-5 rounded-2xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" 
                        placeholder="e.g. Aberdeen, Freetown"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-12 shadow-sm border border-gray-50 space-y-10">
              <h2 className="text-2xl font-serif text-primary flex items-center">
                <ImageIcon className="w-6 h-6 mr-3 text-secondary" /> Media & Gallery
              </h2>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Main Featured Image URL</label>
                  <input 
                    type="url" 
                    required
                    className="w-full bg-gray-50 border-none px-8 py-5 rounded-2xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" 
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Additional Gallery Images</label>
                  <div className="flex gap-4">
                    <input 
                      type="url" 
                      className="flex-grow bg-gray-50 border-none px-8 py-5 rounded-2xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" 
                      placeholder="Add more image URLs..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={addImage}
                      className="bg-secondary text-primary px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-accent transition-all active:scale-95"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {formData.images.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                        <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button 
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Details */}
          <div className="lg:col-span-1 space-y-12">
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50 space-y-8 sticky top-32">
              <h2 className="text-xl font-serif text-primary">Specifications</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Property Type</label>
                  <select 
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary appearance-none"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option>Villa</option>
                    <option>Apartment</option>
                    <option>Estate</option>
                    <option>Penthouse</option>
                    <option>Commercial</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Listing Status</label>
                  <select 
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary appearance-none"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option>For Sale</option>
                    <option>For Rent</option>
                    <option>Sold</option>
                    <option>Rented</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Bedrooms</label>
                    <div className="relative">
                      <Bed className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                      <input 
                        type="number" 
                        className="w-full bg-gray-50 border-none pl-12 pr-4 py-4 rounded-xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" 
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Bathrooms</label>
                    <div className="relative">
                      <Bath className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                      <input 
                        type="number" 
                        className="w-full bg-gray-50 border-none pl-12 pr-4 py-4 rounded-xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" 
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Square Feet</label>
                  <div className="relative">
                    <Square className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                    <input 
                      type="number" 
                      required
                      className="w-full bg-gray-50 border-none pl-12 pr-4 py-4 rounded-xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" 
                      placeholder="2500"
                      value={formData.sqft}
                      onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Parking Spaces</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" 
                      value={formData.parking_spaces}
                      onChange={(e) => setFormData({ ...formData, parking_spaces: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Year Built</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" 
                      placeholder="2024"
                      value={formData.year_built}
                      onChange={(e) => setFormData({ ...formData, year_built: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative w-12 h-6 bg-gray-200 rounded-full transition-colors group-hover:bg-gray-300">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-7 peer-checked:bg-secondary"></div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Featured Listing</span>
                  </label>
                  <p className="text-[9px] text-gray-400 leading-relaxed">Featured properties are showcased in the premium carousel on our homepage for maximum visibility.</p>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-500 text-[10px] font-bold rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-6 rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Publish Listing'}
              </button>
              
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center space-x-3 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span>Vetted by our legal team</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

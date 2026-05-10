import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Bed, Bath, Search, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: string;
  image_url: string;
  status?: string;
  featured: boolean;
}

export const SavedProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, toggleSaveProperty, savedPropertyIds } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('/api/saved-properties', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      });
  }, [token, navigate, savedPropertyIds]); // Re-fetch or at least re-render when savedPropertyIds changes

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'For Sale': return 'bg-green-500 text-white';
      case 'For Rent': return 'bg-purple-500 text-white';
      case 'Sold': return 'bg-red-500 text-white';
      case 'Rented': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Personal Collection</span>
          <h1 className="text-5xl font-serif text-primary">Your Saved Favorites</h1>
          <p className="text-gray-400 mt-4 max-w-2xl">Manage the properties you've bookmarked for your future investment or home in Sierra Leone.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-12 h-12 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {properties.map((property, idx) => (
              <motion.div 
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer"
                onClick={() => navigate(`/properties/${property.id}`)}
              >
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={property.image_url} 
                    alt={property.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveProperty(property.id);
                      }}
                      className="p-3 bg-red-500 text-white rounded-full backdrop-blur-md transition-all shadow-xl active:scale-90 mb-2"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                    <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-primary shadow-lg">
                      {property.type}
                    </div>
                    {property.status && (
                      <div className={`${getStatusColor(property.status)} px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg`}>
                        {property.status}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-serif text-primary mb-2 group-hover:text-secondary transition-colors">{property.title}</h3>
                      <div className="flex items-center text-gray-400 text-xs font-medium">
                        <MapPin className="w-4 h-4 mr-2 text-secondary" />
                        {property.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-serif text-primary font-bold">${property.price.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-8 border-t border-gray-50">
                    <div className="flex space-x-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      <span className="flex items-center"><Bed className="w-4 h-4 mr-2 text-secondary" /> {property.bedrooms}</span>
                      <span className="flex items-center"><Bath className="w-4 h-4 mr-2 text-secondary" /> {property.bathrooms}</span>
                    </div>
                    <button 
                      className="bg-primary/5 text-primary px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[60px] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-2xl font-serif text-primary mb-2">No saved properties yet</h3>
            <p className="text-gray-400">Explore our portfolio and heart the properties you love!</p>
            <button 
              onClick={() => navigate('/properties')}
              className="mt-8 bg-primary text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-secondary transition-all active:scale-95"
            >
              Browse Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

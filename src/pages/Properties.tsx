import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Bed, Bath, X, Filter, ArrowRight, Plus, Heart, ShoppingBag } from 'lucide-react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ImageSlider } from '../components/ImageSlider';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

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
  images?: string[];
  status?: string;
  featured: boolean;
}

export const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBedrooms, setMinBedrooms] = useState('');
  const [minBathrooms, setMinBathrooms] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toggleSaveProperty, savedPropertyIds } = useAuth();
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    const url = filterStatus === 'All' ? '/api/properties' : `/api/properties?status=${filterStatus}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      });
  }, [filterStatus]);

  const filtered = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || p.type === filterType;
    const matchesMinPrice = minPrice === '' || p.price >= parseInt(minPrice);
    const matchesMaxPrice = maxPrice === '' || p.price <= parseInt(maxPrice);
    const matchesBedrooms = minBedrooms === '' || p.bedrooms >= parseInt(minBedrooms);
    const matchesBathrooms = minBathrooms === '' || p.bathrooms >= parseInt(minBathrooms);
    
    return matchesSearch && matchesType && matchesMinPrice && matchesMaxPrice && matchesBedrooms && matchesBathrooms;
  });

  const propertyTypes = ['All', 'Villa', 'Apartment', 'Estate', 'Penthouse', 'Commercial'];
  const statusTypes = ['All', 'For Sale', 'For Rent', 'Sold', 'Rented'];

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('All');
    setFilterStatus('All');
    setMinPrice('');
    setMaxPrice('');
    setMinBedrooms('');
    setMinBathrooms('');
  };

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
        {/* Header */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Our Portfolio</span>
              <h1 className="text-5xl font-serif text-primary">Exclusive Listings</h1>
            </div>
            <Link to="/add-property" className="bg-primary text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg active:scale-95 flex items-center">
              <Plus className="w-4 h-4 mr-2" /> List Your Property
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by neighborhood or property name..." 
                className="w-full pl-16 pr-8 py-5 bg-white rounded-2xl shadow-sm border border-gray-100 outline-none focus:border-secondary transition-all text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`lg:w-auto w-full px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center shadow-sm ${showAdvanced ? 'bg-secondary text-primary' : 'bg-white text-gray-400 hover:text-primary'}`}
            >
              <Filter className="w-4 h-4 mr-3" />
              {showAdvanced ? 'Hide Filters' : 'Advanced Filters'}
            </button>
            
            <div className="flex flex-col gap-6 w-full lg:w-auto">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary block ml-2">Property Type</span>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {propertyTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm ${filterType === type ? 'bg-primary text-white' : 'bg-white text-gray-400 hover:text-primary'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary block ml-2">Status</span>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {statusTypes.map(status => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm ${filterStatus === status ? 'bg-secondary text-primary' : 'bg-white text-gray-400 hover:text-primary'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-6"
              >
                <div className="bg-white p-8 rounded-[30px] shadow-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-2">Min Price</label>
                    <input 
                      type="number" 
                      placeholder="Any"
                      className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-2">Max Price</label>
                    <input 
                      type="number" 
                      placeholder="Any"
                      className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-2">Min Bedrooms</label>
                    <select 
                      className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary appearance-none" 
                      value={minBedrooms}
                      onChange={(e) => setMinBedrooms(e.target.value)}
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-2">Min Bathrooms</label>
                    <select 
                      className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary appearance-none" 
                      value={minBathrooms}
                      onChange={(e) => setMinBathrooms(e.target.value)}
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={clearFilters}
                      className="w-full bg-gray-100 text-gray-500 hover:bg-gray-200 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reset
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-12 h-12 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filtered.map((property, idx) => (
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
                      className={`p-3 rounded-full backdrop-blur-md transition-all shadow-xl active:scale-90 mb-2 ${
                        savedPropertyIds.includes(property.id) 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white/80 text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${savedPropertyIds.includes(property.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart({
                          id: property.id,
                          title: property.title,
                          price: property.price,
                          location: property.location,
                          image_url: property.image_url,
                          type: property.type
                        });
                      }}
                      className={`p-3 rounded-full backdrop-blur-md transition-all shadow-xl active:scale-90 ${
                        isInCart(property.id) 
                          ? 'bg-secondary text-primary' 
                          : 'bg-white/80 text-gray-400 hover:text-secondary'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
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
        )}
        
        {filtered.length === 0 && !loading && (
          <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-2xl font-serif text-primary mb-2">No properties found</h3>
            <p className="text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={clearFilters}
              className="mt-8 text-secondary font-black text-[10px] uppercase tracking-widest hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

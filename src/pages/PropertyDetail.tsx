import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Bed, Bath, Square, ArrowLeft, Phone, Mail, 
  Calendar, Share2, Heart, ShieldCheck, Globe, Info,
  CheckCircle2, MessageSquare, User, Navigation, Trash2, ShoppingBag,
  X, ChevronLeft, ChevronRight, Maximize2
} from 'lucide-react';
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
  images: string[];
  status?: string;
  featured: boolean;
  user_id: number;
  agent_id?: number;
  agent_name?: string;
  agent_email?: string;
  agent_phone?: string;
  agent_bio?: string;
  agent_image?: string;
  agent_specialization?: string;
}

export const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, token, toggleSaveProperty, savedPropertyIds } = useAuth();
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`/api/properties/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Property not found');
        return res.json();
      })
      .then(data => {
        setProperty(data);
        setLoading(false);
      })
      .catch(() => {
        navigate('/properties');
      });
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        navigate('/properties');
      } else {
        alert('Failed to delete property');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const handleInquiry = () => {
    navigate('/contact', { state: { propertyTitle: property?.title } });
  };

  if (loading || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const isOwner = user && (user.id === property.user_id || user.role === 'admin');

  const allImages = property.images && property.images.length > 0 
    ? property.images 
    : [property.image_url];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <Link 
            to="/properties" 
            className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-2 transition-transform" />
            Back to Portfolio
          </Link>
          
          <div className="flex items-center space-x-6">
            {isOwner && (
              <button 
                onClick={handleDelete}
                className="flex items-center text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Listing
              </button>
            )}
            <button className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary transition-colors">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </button>
            <button 
              onClick={() => toggleSaveProperty(property.id)}
              className={`flex items-center text-[10px] font-black uppercase tracking-widest transition-colors ${
                savedPropertyIds.includes(property.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 mr-2 ${savedPropertyIds.includes(property.id) ? 'fill-current' : ''}`} /> 
              {savedPropertyIds.includes(property.id) ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* High-Res Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-16 h-[60vh] lg:h-[70vh]">
          <div 
            className="lg:col-span-3 rounded-[60px] overflow-hidden shadow-2xl relative group cursor-zoom-in"
            onClick={() => setIsModalOpen(true)}
          >
            <motion.img 
              layoutId="property-main-image"
              src={allImages[activeImage]} 
              alt={property.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/20 backdrop-blur-md p-6 rounded-full border border-white/30 transform scale-75 group-hover:scale-100 transition-all duration-500">
                <Maximize2 className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="absolute top-8 left-8 flex flex-col gap-3 items-start pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary shadow-xl">
                {property.type}
              </div>
              {property.status && (
                <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl ${
                  property.status === 'For Sale' ? 'bg-green-500 text-white' : 
                  property.status === 'For Rent' ? 'bg-purple-500 text-white' : 
                  property.status === 'Sold' ? 'bg-red-500 text-white' : 
                  'bg-blue-500 text-white'
                }`}>
                  {property.status}
                </div>
              )}
            </div>
            {property.featured && (
              <div className="absolute top-8 right-8 bg-secondary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary shadow-xl pointer-events-none">
                Featured
              </div>
            )}
          </div>
          
          <div className="hidden lg:flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
            {allImages.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative aspect-square rounded-[32px] overflow-hidden shadow-lg transition-all duration-500 ${activeImage === idx ? 'ring-4 ring-secondary ring-offset-4' : 'opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Modal Lightbox */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-primary/95 backdrop-blur-2xl"
              onClick={() => setIsModalOpen(false)}
            >
              <button 
                className="absolute top-12 right-12 z-[110] p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all group"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(false);
                }}
              >
                <X className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div 
                className="relative w-full max-w-6xl aspect-[4/3] md:aspect-video rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.img 
                  layoutId="property-main-image"
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  src={allImages[activeImage]} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {allImages.length > 1 && (
                  <>
                    <button 
                      className="absolute left-8 top-1/2 -translate-y-1/2 p-6 bg-black/20 backdrop-blur-md hover:bg-secondary rounded-full transition-all group"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-8 h-8 text-white group-hover:text-primary transition-colors" />
                    </button>
                    <button 
                      className="absolute right-8 top-1/2 -translate-y-1/2 p-6 bg-black/20 backdrop-blur-md hover:bg-secondary rounded-full transition-all group"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-8 h-8 text-white group-hover:text-primary transition-colors" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex space-x-3 bg-black/20 backdrop-blur-md px-6 py-3 rounded-full">
                  {allImages.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${activeImage === idx ? 'bg-secondary w-8' : 'bg-white/30'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Title & Price */}
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                  <div className="flex items-center text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4">
                    <MapPin className="w-4 h-4 mr-2" /> {property.location}, Sierra Leone
                  </div>
                  <h1 className="text-5xl md:text-6xl font-serif text-primary leading-tight">{property.title}</h1>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Listing Price</div>
                  <div className="text-5xl font-serif text-primary font-bold">${property.price.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-8 py-10 border-y border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm">
                    <Bed className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bedrooms</div>
                    <div className="text-xl font-serif text-primary">{property.bedrooms}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 border-x border-gray-100 px-8">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm">
                    <Bath className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bathrooms</div>
                    <div className="text-xl font-serif text-primary">{property.bathrooms}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm">
                    <Square className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Square Feet</div>
                    <div className="text-xl font-serif text-primary">{property.sqft}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-12 md:p-16 rounded-[60px] shadow-sm border border-gray-50">
              <h2 className="text-3xl font-serif text-primary mb-8 flex items-center">
                <Info className="w-8 h-8 mr-4 text-secondary" /> Property Overview
              </h2>
              <p className="text-gray-500 text-xl leading-relaxed mb-12">
                {property.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center space-x-4">
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                  <span className="text-primary font-bold text-sm uppercase tracking-wider">Prime Location in {property.location}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                  <span className="text-primary font-bold text-sm uppercase tracking-wider">Secure Legal Documentation</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                  <span className="text-primary font-bold text-sm uppercase tracking-wider">Modern Infrastructure</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                  <span className="text-primary font-bold text-sm uppercase tracking-wider">High Investment Potential</span>
                </div>
              </div>
            </div>

            {/* Map View Placeholder */}
            <div className="space-y-8">
              <h2 className="text-3xl font-serif text-primary flex items-center">
                <Navigation className="w-8 h-8 mr-4 text-secondary" /> Location & Neighborhood
              </h2>
              <div className="h-[400px] bg-gray-200 rounded-[60px] overflow-hidden shadow-inner relative group">
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md p-10 rounded-[40px] shadow-2xl text-center max-w-sm border border-white/20">
                    <MapPin className="w-12 h-12 text-secondary mx-auto mb-6" />
                    <h4 className="text-2xl font-serif text-primary mb-2">{property.location}</h4>
                    <p className="text-gray-500 text-sm mb-6">Explore the surrounding amenities and landmarks in this prestigious Sierra Leonean neighborhood.</p>
                    <button className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline">View on Interactive Map</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Agent Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              {/* Agent Card */}
              <div className="bg-primary rounded-[60px] p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/4"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-6 mb-10">
                    <Link to={property.agent_id ? `/agents/${property.agent_id}` : '#'} className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-secondary shadow-xl hover:scale-105 transition-transform">
                      <img 
                        src={property.agent_image || "https://picsum.photos/seed/agent-sl/200/200"} 
                        alt={property.agent_name || "Agent"} 
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div>
                      <Link to={property.agent_id ? `/agents/${property.agent_id}` : '#'} className="hover:text-secondary transition-colors">
                        <h3 className="text-2xl font-serif">{property.agent_name || "Mohamed Bangura"}</h3>
                      </Link>
                      <p className="text-secondary text-[10px] font-black uppercase tracking-widest">{property.agent_specialization || "Senior Property Advisor"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6 mb-10">
                    <a href={`tel:${property.agent_phone}`} className="flex items-center space-x-4 group cursor-pointer">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-secondary group-hover:text-primary transition-all">
                        <Phone className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">{property.agent_phone || "+232 76 555 012"}</span>
                    </a>
                    <a href={`mailto:${property.agent_email}`} className="flex items-center space-x-4 group cursor-pointer">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-secondary group-hover:text-primary transition-all">
                        <Mail className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">{property.agent_email || "info@calabashsl.com"}</span>
                    </a>
                  </div>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={() => {
                        if (property) {
                          addToCart({
                            id: property.id,
                            title: property.title,
                            price: property.price,
                            location: property.location,
                            image_url: property.image_url,
                            type: property.type
                          });
                        }
                      }}
                      className={`w-full py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] transition-all shadow-xl active:scale-95 flex items-center justify-center ${
                        isInCart(property.id) 
                          ? 'bg-secondary text-primary cursor-default' 
                          : 'bg-white text-primary border border-gray-100 hover:bg-secondary cursor-pointer'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 mr-3" /> {isInCart(property.id) ? 'In Your Basket' : 'Add to Basket'}
                    </button>
                    <button 
                      onClick={handleInquiry}
                      className="w-full bg-secondary text-primary py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:bg-accent transition-all shadow-xl active:scale-95 flex items-center justify-center"
                    >
                      <MessageSquare className="w-4 h-4 mr-3" /> Send Message
                    </button>
                    <button 
                      onClick={handleInquiry}
                      className="w-full bg-white/10 backdrop-blur-md text-white border border-white/20 py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center"
                    >
                      <Calendar className="w-4 h-4 mr-3" /> Schedule Viewing
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50 text-center">
                <ShieldCheck className="w-12 h-12 text-secondary mx-auto mb-6" />
                <h4 className="text-xl font-serif text-primary mb-2">Calabash Verified</h4>
                <p className="text-gray-400 text-xs leading-relaxed">This property has been rigorously vetted by our legal and structural teams to ensure a secure investment.</p>
              </div>
              
              {/* Office Info */}
              <div className="text-center px-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-4">Firm Headquarters</p>
                <p className="text-gray-400 text-xs">Number 11 Dillet Street, Freetown, Sierra Leone</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

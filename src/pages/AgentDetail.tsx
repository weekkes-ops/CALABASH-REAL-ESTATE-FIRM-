import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Phone, Mail, Award, MapPin, ArrowLeft, 
  Linkedin, Twitter, Globe, Bed, Bath, Square, Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image_url: string;
  type: string;
  status: string;
}

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  bio: string;
  profile_picture_url: string;
  specialization: string;
  experience_years: number;
  properties: Property[];
}

export const AgentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const { toggleSaveProperty, savedPropertyIds } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`/api/agents/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Agent not found');
        return res.json();
      })
      .then(data => {
        setAgent(data);
        setLoading(false);
      })
      .catch(() => {
        navigate('/agents');
      });
  }, [id, navigate]);

  if (loading || !agent) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/agents" 
          className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-primary transition-colors group mb-12"
        >
          <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-2 transition-transform" />
          Our Professional Team
        </Link>

        {/* Hero Section */}
        <div className="bg-primary rounded-[60px] overflow-hidden shadow-2xl relative mb-24">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/4"></div>
          <div className="flex flex-col lg:flex-row items-stretch min-h-[600px]">
            <div className="lg:w-2/5 relative">
              <img 
                src={agent.profile_picture_url} 
                alt={agent.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
            </div>
            
            <div className="lg:w-3/5 p-12 md:p-20 text-white flex flex-col justify-center relative z-10">
              <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Expert Advisor</span>
              <h1 className="text-5xl md:text-7xl font-serif mb-6">{agent.name}</h1>
              
              <div className="flex flex-wrap gap-8 mb-10">
                <div className="flex items-center text-white/70">
                  <Award className="w-5 h-5 mr-3 text-secondary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{agent.experience_years} Years Experience</span>
                </div>
                <div className="flex items-center text-white/70">
                  <MapPin className="w-5 h-5 mr-3 text-secondary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{agent.specialization} specialist</span>
                </div>
              </div>

              <p className="text-white/60 text-xl leading-relaxed max-w-2xl mb-12 italic">
                "{agent.bio}"
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <a href={`tel:${agent.phone}`} className="flex items-center space-x-4 group p-6 bg-white/5 rounded-3xl hover:bg-white/10 transition-all border border-white/5">
                  <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">Direct Call</span>
                    <span className="text-lg font-serif">{agent.phone}</span>
                  </div>
                </a>
                <a href={`mailto:${agent.email}`} className="flex items-center space-x-4 group p-6 bg-white/5 rounded-3xl hover:bg-white/10 transition-all border border-white/5">
                  <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">Email Advisor</span>
                    <span className="text-lg font-serif">{agent.email}</span>
                  </div>
                </a>
              </div>

              <div className="flex space-x-6">
                <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all duration-300">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all duration-300">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all duration-300">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-12">
            <div>
              <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Our Portfolio</span>
              <h2 className="text-4xl md:text-5xl font-serif text-primary">Properties by {agent.name.split(' ')[0]}</h2>
            </div>
            <div className="bg-gray-50 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              {agent.properties.length} Active Listings
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {agent.properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer"
                onClick={() => navigate(`/properties/${property.id}`)}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={property.image_url} 
                    alt={property.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 right-6">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSaveProperty(property.id);
                      }}
                      className={`p-3 rounded-full backdrop-blur-md transition-all shadow-xl active:scale-90 ${
                        savedPropertyIds.includes(property.id) 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white/80 text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${savedPropertyIds.includes(property.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-primary shadow-lg">
                      {property.type}
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-serif text-primary mb-2 group-hover:text-secondary transition-colors">{property.title}</h3>
                      <div className="flex items-center text-gray-400 text-xs font-medium">
                        <MapPin className="w-4 h-4 mr-2 text-secondary" /> {property.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-gray-50">
                    <div className="flex space-x-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      <span className="flex items-center"><Bed className="w-4 h-4 mr-2 text-secondary" /> {property.bedrooms}</span>
                      <span className="flex items-center"><Bath className="w-4 h-4 mr-2 text-secondary" /> {property.bathrooms}</span>
                      <span className="flex items-center"><Square className="w-4 h-4 mr-2 text-secondary" /> {property.sqft}</span>
                    </div>
                    <div className="text-2xl font-serif text-primary font-bold">${property.price.toLocaleString()}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {agent.properties.length === 0 && (
            <div className="text-center py-24 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
              <p className="text-gray-400 font-serif text-xl italic">No properties currently listed by this agent.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, ArrowRight, Award, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  bio: string;
  profile_picture_url: string;
  specialization: string;
  experience_years: number;
}

export const Agents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        setAgents(data);
        setLoading(false);
      });
  }, []);

  const filteredAgents = agents
    .filter(agent => 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'experience') {
        return b.experience_years - a.experience_years;
      } else if (sortBy === 'specialization') {
        return a.specialization.localeCompare(b.specialization);
      }
      return 0;
    });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block"
          >
            Expert Guidance
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif text-primary mb-8"
          >
            Meet Our Exceptional <span className="italic text-secondary">Advisors</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg"
          >
            Dedicated professionals with deep roots in Sierra Leone's luxury real estate landscape, committed to your investment success.
          </motion.p>
        </div>

        {/* Search & Sort */}
        <div className="max-w-4xl mx-auto mb-20 flex flex-col md:flex-row gap-6">
          <div className="flex-grow relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name or specialization..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-8 py-6 bg-white rounded-[32px] shadow-xl border border-gray-100 outline-none focus:border-secondary transition-all text-lg"
            />
          </div>
          <div className="md:w-64 relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-full pl-8 pr-12 py-6 bg-white rounded-[32px] shadow-xl border border-gray-100 outline-none focus:border-secondary transition-all text-lg appearance-none cursor-pointer font-medium text-primary"
            >
              <option value="name">Sort by Name</option>
              <option value="experience">Experience (Years)</option>
              <option value="specialization">Specialization</option>
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-[60px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img 
                    src={agent.profile_picture_url} 
                    alt={agent.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex space-x-3">
                      <a href={`tel:${agent.phone}`} className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-secondary hover:text-primary transition-all">
                        <Phone className="w-5 h-5" />
                      </a>
                      <a href={`mailto:${agent.email}`} className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-secondary hover:text-primary transition-all">
                        <Mail className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-12 flex-grow flex flex-col">
                  <div className="mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-2 block">{agent.specialization}</span>
                    <h3 className="text-3xl font-serif text-primary mb-2">{agent.name}</h3>
                    <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                      <Award className="w-4 h-4 mr-2 text-secondary" /> {agent.experience_years} Years Experience
                    </div>
                  </div>
                  
                  <p className="text-gray-500 leading-relaxed mb-10 flex-grow line-clamp-3">
                    {agent.bio}
                  </p>

                  <Link 
                    to={`/agents/${agent.id}`} 
                    className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-secondary transition-colors"
                  >
                    View Agent Profile <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredAgents.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-serif text-primary mb-4">No agents matched your search</h3>
            <button 
              onClick={() => setSearchTerm('')}
              className="text-secondary font-black text-[10px] uppercase tracking-widest hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

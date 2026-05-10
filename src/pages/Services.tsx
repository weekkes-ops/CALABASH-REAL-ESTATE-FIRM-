import React from 'react';
import { motion } from 'motion/react';
import { Home, Key, BarChart3, ShieldCheck, Search, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Services: React.FC = () => {
  const services = [
    {
      title: 'Property Sales',
      desc: 'Expert representation for buyers and sellers of premium residential and commercial estates.',
      icon: Home,
      color: 'bg-blue-50'
    },
    {
      title: 'Property Management',
      desc: 'Comprehensive management services ensuring your investment is maintained to the highest standards.',
      icon: ShieldCheck,
      color: 'bg-gold-50'
    },
    {
      title: 'Investment Advisory',
      desc: 'Strategic insights and data-driven advice for building a robust real estate portfolio in Sierra Leone.',
      icon: BarChart3,
      color: 'bg-slate-50'
    },
    {
      title: 'Valuation Services',
      desc: 'Accurate and professional property appraisals based on current market trends and local expertise.',
      icon: Search,
      color: 'bg-indigo-50'
    },
    {
      title: 'Relocation Services',
      desc: 'Seamless transition support for international clients moving to Freetown.',
      icon: Users,
      color: 'bg-emerald-50'
    },
    {
      title: 'Leasing & Rentals',
      desc: 'Finding the perfect long-term or short-term rental in the most desirable locations.',
      icon: Key,
      color: 'bg-amber-50'
    }
  ];

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Our Expertise</span>
            <h1 className="text-5xl md:text-6xl font-serif text-primary mb-8">Comprehensive Real Estate Solutions</h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              From the first search to the final signature, we provide a full spectrum of services tailored to the unique Sierra Leonean market.
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-12 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group"
            >
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform bg-primary/5 text-primary group-hover:bg-secondary group-hover:text-primary`}>
                <service.icon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-serif text-primary mb-6">{service.title}</h3>
              <p className="text-gray-500 leading-relaxed mb-8">{service.desc}</p>
              <Link to="/contact" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors">
                Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-primary rounded-[60px] p-16 md:p-24 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif mb-8">Ready to Start Your Journey?</h2>
            <p className="text-white/60 text-lg mb-12 max-w-2xl mx-auto">
              Our expert advisors are standing by to provide a personalized consultation based on your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/contact" className="bg-secondary text-primary px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-accent transition-all shadow-xl active:scale-95">
                Contact An Advisor
              </Link>
              <Link to="/properties" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all active:scale-95">
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

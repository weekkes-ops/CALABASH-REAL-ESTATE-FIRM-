import React from 'react';
import { motion } from 'motion/react';
import { Award, Shield, Users, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Our Heritage</span>
            <h1 className="text-5xl md:text-7xl font-serif text-primary mb-8 leading-tight">
              Redefining Luxury <br />
              <span className="italic text-secondary">Since 2001.</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-10">
              Calabash Real Estate Firm was founded with a single vision: to bring world-class real estate standards to the beautiful shores of Sierra Leone. For over two decades, we have been the trusted partner for discerning investors and families seeking their perfect home.
            </p>
            <div className="grid grid-cols-2 gap-10">
              <div>
                <div className="text-4xl font-serif text-primary mb-2">25+</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Years Excellence</div>
              </div>
              <div>
                <div className="text-4xl font-serif text-primary mb-2">1.2k+</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Properties Sold</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/sl-about-hero/800/1000" 
                alt="Calabash Office" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-12 -left-12 bg-white p-12 rounded-[40px] shadow-2xl hidden md:block border border-gray-50">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Headquarters</div>
                  <div className="text-primary font-serif text-lg">Freetown, SL</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 max-w-[180px]">Located at Number 11 Dillet Street, the heart of the capital.</p>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="bg-primary rounded-[60px] p-16 md:p-24 text-white mb-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/4"></div>
          <div className="relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Our Core Values</span>
              <h2 className="text-5xl font-serif mb-8">The Pillars of Our Success</h2>
              <p className="text-white/50 text-lg">We operate with a commitment to transparency, excellence, and the long-term prosperity of our clients.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { title: 'Integrity', desc: 'Honesty is the foundation of every relationship we build.', icon: Shield },
                { title: 'Excellence', desc: 'We settle for nothing less than the highest standards in every detail.', icon: Award },
                { title: 'Community', desc: 'We are deeply invested in the growth and beauty of Sierra Leone.', icon: Users }
              ].map((value, i) => (
                <div key={i} className="text-center group">
                  <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-secondary group-hover:text-primary transition-all duration-500">
                    <value.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-serif mb-4">{value.title}</h3>
                  <p className="text-white/40 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="aspect-square rounded-[60px] overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/sl-mission/800/800" 
                alt="Our Mission" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Our Mission</span>
            <h2 className="text-5xl font-serif text-primary mb-8 leading-tight">Empowering Your <br /><span className="italic text-secondary">Property Journey</span></h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-10">
              Our mission is to provide a seamless, transparent, and rewarding real estate experience. Whether you are buying your first home, selling a family estate, or building a commercial portfolio, we provide the expertise and support you need to succeed.
            </p>
            <ul className="space-y-6">
              {[
                'Unmatched local market knowledge',
                'Comprehensive legal and financial vetting',
                'Personalized investment strategies',
                'Global marketing reach for sellers'
              ].map((item, i) => (
                <li key={i} className="flex items-center space-x-4">
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                  <span className="text-primary font-bold text-sm uppercase tracking-wider">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

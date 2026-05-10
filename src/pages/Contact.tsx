import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Send, Clock } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Contact: React.FC = () => {
  const location = useLocation();
  const [subject, setSubject] = useState('Property Inquiry');

  useEffect(() => {
    if (location.state && location.state.propertyTitle) {
      setSubject(`Inquiry: ${location.state.propertyTitle}`);
    }
  }, [location.state]);

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Get In Touch</span>
            <h1 className="text-5xl md:text-6xl font-serif text-primary mb-8">We're Here to Assist You</h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              Whether you're looking to buy, sell, or simply have a question about the Freetown market, our team is ready to help.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-32">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-8">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-start group">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-secondary mr-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Call Us</div>
                    <div className="text-xl font-serif text-primary">+232 76 555 012</div>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-secondary mr-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Us</div>
                    <div className="text-xl font-serif text-primary">info@calabashsl.com</div>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-secondary mr-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Visit Us</div>
                    <div className="text-xl font-serif text-primary">11 Dillet Street, Freetown</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-8">Office Hours</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Monday - Friday</span>
                  <span className="text-primary font-bold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Saturday</span>
                  <span className="text-primary font-bold">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Sunday</span>
                  <span className="text-secondary font-bold">Closed</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-6">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-primary hover:bg-secondary transition-all shadow-sm">
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[60px] p-12 md:p-20 shadow-2xl border border-gray-50">
              <h3 className="text-3xl font-serif text-primary mb-10">Send Us a Message</h3>
              <form className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <input type="text" className="w-full bg-gray-50 border-none px-8 py-5 rounded-2xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" placeholder="John Doe" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                    <input type="email" className="w-full bg-gray-50 border-none px-8 py-5 rounded-2xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" placeholder="john@example.com" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                    <input type="tel" className="w-full bg-gray-50 border-none px-8 py-5 rounded-2xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" placeholder="+232 ..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subject</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border-none px-8 py-5 rounded-2xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Your Message</label>
                  <textarea rows={5} className="w-full bg-gray-50 border-none px-8 py-5 rounded-3xl outline-none focus:ring-2 ring-secondary/50 transition-all text-primary resize-none" placeholder="How can we help you today?"></textarea>
                </div>

                <button className="w-full bg-primary text-white py-6 rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center group active:scale-95">
                  Send Message <Send className="w-4 h-4 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="h-[500px] bg-gray-200 rounded-[60px] overflow-hidden shadow-inner relative group">
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-md p-10 rounded-[40px] shadow-2xl text-center max-w-sm border border-white/20">
              <MapPin className="w-12 h-12 text-secondary mx-auto mb-6" />
              <h4 className="text-2xl font-serif text-primary mb-2">Our Office</h4>
              <p className="text-gray-500 text-sm mb-6">Number 11 Dillet Street, Freetown, Sierra Leone</p>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline">Open in Google Maps</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

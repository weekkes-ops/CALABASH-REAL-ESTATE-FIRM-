import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Bed, Bath, ChevronRight, ArrowRight, Shield, Award, Users, Square, Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageSlider } from '../components/ImageSlider';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface Property {
  id: number;
  title: string;
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

export const Home: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toggleSaveProperty, savedPropertyIds } = useAuth();
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => setProperties(data));
  }, []);

  const featured = properties.filter(p => p.featured);

  const heroImages = [
    "https://picsum.photos/seed/sl-hero1/1920/1080",
    "https://picsum.photos/seed/sl-hero2/1920/1080",
    "https://picsum.photos/seed/sl-hero3/1920/1080"
  ];

  return (
    <div>
      {/* Hero Section with Slider */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageSlider images={heroImages} />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 inline-block"
          >
            <span className="bg-secondary/90 backdrop-blur-md text-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">
              Excellence in Sierra Leone Real Estate
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl font-serif text-white mb-8 leading-[1.1] drop-shadow-2xl"
          >
            Discover Your <br />
            <span className="italic text-secondary">Luxury Sanctuary</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-2xl p-3 rounded-[32px] shadow-2xl flex flex-col md:flex-row items-center max-w-3xl mx-auto border border-white/20"
          >
            <div className="flex-1 flex items-center px-6 w-full">
              <Search className="text-secondary w-5 h-5 mr-4" />
              <input 
                type="text" 
                placeholder="Search by location, property type..." 
                className="w-full py-4 outline-none text-white placeholder:text-white/60 bg-transparent text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link 
              to={`/properties?search=${searchTerm}`}
              className="bg-secondary text-primary px-10 py-4 rounded-[24px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-lg w-full md:w-auto mt-2 md:mt-0 active:scale-95"
            >
              Search
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties Carousel Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Exclusive Collection</span>
          <h2 className="text-5xl font-serif text-primary">Featured Properties</h2>
        </div>
        
        <div className="relative h-[700px] max-w-[1400px] mx-auto rounded-[60px] overflow-hidden shadow-2xl bg-primary">
          {featured.length > 0 ? (
            <ImageSlider 
              autoPlay={true}
              images={featured.map(p => p.image_url)} 
              renderOverlay={(index) => {
                const property = featured[index];
                return (
                  <div className="absolute inset-0 flex items-center justify-start p-12 md:p-24 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent">
                    <motion.div 
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={property.id}
                      className="max-w-xl text-white"
                    >
                      <span className="text-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">{property.type}</span>
                      <h3 className="text-5xl md:text-6xl font-serif mb-6 leading-tight">{property.title}</h3>
                      <div className="flex items-center text-white/70 text-lg mb-8">
                        <MapPin className="w-5 h-5 mr-3 text-secondary" />
                        {property.location}
                      </div>
                      <div className="flex space-x-10 mb-12">
                        <div className="flex items-center"><Bed className="w-6 h-6 mr-3 text-secondary" /> {property.bedrooms} Beds</div>
                        <div className="flex items-center"><Bath className="w-6 h-6 mr-3 text-secondary" /> {property.bathrooms} Baths</div>
                        <div className="flex items-center"><Square className="w-6 h-6 mr-3 text-secondary" /> {property.sqft} Sq Ft</div>
                      </div>
                      <div className="flex items-center space-x-8">
                        <div className="text-4xl font-serif font-bold text-secondary">${property.price.toLocaleString()}</div>
                        <div className="flex space-x-4">
                          <Link 
                            to={`/properties/${property.id}`}
                            className="bg-white text-primary px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-secondary transition-all active:scale-95 shadow-xl"
                          >
                            View Listing
                          </Link>
                          <button 
                            onClick={() => toggleSaveProperty(property.id)}
                            className={`p-5 rounded-full backdrop-blur-md transition-all shadow-xl active:scale-95 ${
                              savedPropertyIds.includes(property.id) 
                                ? 'bg-red-500 text-white' 
                                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${savedPropertyIds.includes(property.id) ? 'fill-current' : ''}`} />
                          </button>
                          <button 
                            onClick={() => addToCart({
                              id: property.id,
                              title: property.title,
                              price: property.price,
                              location: property.location,
                              image_url: property.image_url,
                              type: property.type
                            })}
                            className={`p-5 rounded-full backdrop-blur-md transition-all shadow-xl active:scale-95 ${
                              isInCart(property.id) 
                                ? 'bg-secondary text-primary' 
                                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                            }`}
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-white/30 italic">
              No featured properties available.
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16 z-20 max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-[40px] shadow-2xl p-10 md:p-16 grid grid-cols-2 md:grid-cols-4 gap-12 border border-gray-100">
          {[
            { label: 'Properties Sold', value: '500+' },
            { label: 'Happy Clients', value: '1.2k' },
            { label: 'Years Experience', value: '25+' },
            { label: 'Awards Won', value: '15' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-serif text-primary mb-2">{stat.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Curated Selection</span>
            <h2 className="text-5xl font-serif text-primary mb-6">Featured Estates</h2>
            <p className="text-gray-500 text-lg">Explore our most exclusive properties in Freetown's most prestigious neighborhoods.</p>
          </div>
          <Link to="/properties" className="bg-primary/5 text-primary px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all flex items-center group">
            View All Listings <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featured.slice(0, 3).map((property, idx) => (
            <motion.div 
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to={`/properties/${property.id}`}>
                <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden mb-8 shadow-xl">
                  <img 
                    src={property.image_url} 
                    alt={property.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                    <div className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-primary shadow-lg">
                      Featured
                    </div>
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
                  </div>
                  <div className="absolute top-20 left-6">
                    {property.status && (
                      <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg ${
                        property.status === 'For Sale' ? 'bg-green-500 text-white' : 
                        property.status === 'Sold' ? 'bg-red-500 text-white' : 
                        'bg-blue-500 text-white'
                      }`}>
                        {property.status}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white/95 backdrop-blur-md p-6 rounded-[24px] shadow-2xl">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-serif font-bold text-primary">${property.price.toLocaleString()}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-secondary">{property.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-serif mb-2 text-primary group-hover:text-secondary transition-colors">{property.title}</h3>
                <div className="flex items-center text-gray-400 text-xs font-medium mb-4">
                  <MapPin className="w-4 h-4 mr-2 text-secondary" />
                  {property.location}
                </div>
                <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  <span className="flex items-center"><Bed className="w-4 h-4 mr-2 text-secondary" /> {property.bedrooms} Beds</span>
                  <span className="flex items-center"><Bath className="w-4 h-4 mr-2 text-secondary" /> {property.bathrooms} Baths</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">The Calabash Advantage</span>
            <h2 className="text-5xl font-serif mb-8">Why We Are The Leaders</h2>
            <p className="text-white/60 text-lg">With over 25 years of experience, we have redefined luxury real estate in Sierra Leone through unmatched expertise and dedication.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Market Authority', desc: 'Deepest insights into Freetown\'s evolving property landscape.', icon: Award },
              { title: 'Client Centric', desc: 'Tailored solutions that prioritize your long-term investment goals.', icon: Users },
              { title: 'Secure Process', desc: 'Rigorous legal vetting and transparent documentation for every deal.', icon: Shield }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-lg p-12 rounded-[40px] border border-white/10 hover:bg-white/10 transition-all group">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif mb-4">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/calabash-sl-about/800/1000" 
                alt="Calabash Team" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-12 -right-12 bg-secondary p-12 rounded-[40px] shadow-2xl hidden md:block">
              <div className="text-primary text-5xl font-serif mb-2">25+</div>
              <div className="text-primary/60 text-[10px] font-black uppercase tracking-widest">Years of Excellence</div>
            </div>
          </div>
          <div>
            <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Our Legacy</span>
            <h2 className="text-5xl font-serif text-primary mb-8 leading-tight">
              Rooted in Freetown, <br />
              <span className="italic text-secondary">Global in Vision.</span>
            </h2>
            <p className="text-gray-500 mb-10 leading-relaxed text-lg">
              Based at Number 11 Dillet Street, Calabash Real Estate Firm is more than just an agency. We are the custodians of luxury living in Sierra Leone, bridging the gap between local heritage and international standards.
            </p>
            <div className="space-y-6 mb-12">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                </div>
                <span className="text-primary font-bold text-sm uppercase tracking-wider">Premier Property Portfolio</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                </div>
                <span className="text-primary font-bold text-sm uppercase tracking-wider">Expert Investment Advisory</span>
              </div>
            </div>
            <Link to="/about" className="inline-flex items-center bg-primary text-white px-10 py-5 rounded-full transition-all uppercase tracking-widest text-[10px] font-black shadow-xl hover:shadow-primary/20 hover:-translate-y-1 active:scale-95">
              Discover Our Story <ArrowRight className="w-4 h-4 ml-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* List Property CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[60px] p-12 md:p-20 shadow-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center md:text-left">
              <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Want to Sell?</span>
              <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">List Your Property With The Experts</h2>
              <p className="text-gray-500 text-lg">Reach thousands of potential buyers in Sierra Leone and abroad by listing your property on our exclusive platform.</p>
            </div>
            <Link to="/add-property" className="bg-primary text-white px-12 py-6 rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-2xl shadow-primary/20 hover:-translate-y-1 active:scale-95 whitespace-nowrap">
              Add Your Property Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

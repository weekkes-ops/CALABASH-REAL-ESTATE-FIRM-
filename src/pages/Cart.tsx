import React from 'react';
import { motion } from 'motion/react';
import { Trash2, ShoppingBag, ArrowRight, MapPin, DollarSign, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export const Cart: React.FC = () => {
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Your Selection</span>
            <h1 className="text-5xl font-serif text-primary">Property <span className="italic text-secondary">Basket</span></h1>
          </div>
          {cartItems.length > 0 && (
            <button 
              onClick={clearCart}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear Basket
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-32 bg-gray-50 rounded-[60px] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <ShoppingBag className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-3xl font-serif text-primary mb-4">Your basket is empty</h2>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto">Explore our exclusive portfolio and add properties you're interested in to your basket for inquiry.</p>
            <Link 
              to="/properties" 
              className="inline-flex items-center bg-primary text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-secondary transition-all active:scale-95"
            >
              Browse Properties <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-100 flex items-center gap-8 group"
                >
                  <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1 block">{item.type}</span>
                        <h3 className="text-xl font-serif text-primary group-hover:text-secondary transition-colors line-clamp-1">{item.title}</h3>
                        <div className="flex items-center text-gray-400 text-xs mt-1">
                          <MapPin className="w-3 h-3 mr-1" /> {item.location}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        title="Remove from basket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-xl font-serif font-bold text-primary">
                        ${item.price.toLocaleString()}
                      </div>
                      <Link 
                        to={`/properties/${item.id}`}
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-primary rounded-[50px] p-10 text-white shadow-2xl sticky top-32">
                <h3 className="text-2xl font-serif mb-8 border-b border-white/10 pb-6">Summary</h3>
                
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-center text-white/60">
                    <span className="text-[10px] font-black uppercase tracking-widest">Total Properties</span>
                    <span className="font-serif text-xl text-white">{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Est. Investment</span>
                    <div className="text-right">
                      <div className="text-4xl font-serif font-bold text-secondary">
                        ${cartTotal.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full bg-secondary text-primary py-6 rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl active:scale-95">
                    Proceed to Inquiry
                  </button>
                  <p className="text-[9px] text-white/40 text-center uppercase tracking-widest leading-relaxed">
                    By proceeding, you agree to our terms of service regarding property reservations.
                  </p>
                </div>

                <div className="mt-10 pt-10 border-t border-white/10">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-secondary">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Need Help?</p>
                      <p className="text-sm font-medium">Contact Advisor</p>
                    </div>
                  </div>
                  <Link 
                    to="/contact" 
                    className="block text-center text-[10px] font-black uppercase tracking-widest text-secondary hover:text-white transition-colors"
                  >
                    Send Direct Message
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

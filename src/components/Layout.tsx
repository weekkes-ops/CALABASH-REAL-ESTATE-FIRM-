import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Mail, Facebook, Instagram, Twitter, LogOut, User as UserIcon, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const Logo = () => (
  <div className="flex items-center space-x-3 group">
    <div className="relative w-12 h-12 bg-primary rounded-full flex items-center justify-center overflow-hidden border-2 border-secondary shadow-lg transition-transform group-hover:scale-105">
      {/* Stylized Calabash Icon based on the logo */}
      <svg viewBox="0 0 100 100" className="w-8 h-8 text-secondary fill-current">
        <path d="M50 15 C40 15, 35 25, 35 35 C35 45, 45 48, 45 55 C45 65, 30 70, 30 80 C30 90, 70 90, 70 80 C70 70, 55 65, 55 55 C55 48, 65 45, 65 35 C65 25, 60 15, 50 15 Z M50 25 C55 25, 58 30, 58 35 C58 40, 50 42, 50 48 L50 52 C50 42, 42 40, 42 35 C42 30, 45 25, 50 25 Z" />
      </svg>
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-serif font-bold tracking-tight text-primary leading-none">CALABASH</span>
      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-secondary">Real Estate Firm</span>
    </div>
  </div>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Services', path: '/services' },
    { name: 'Saved', path: '/saved', private: true },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans flex flex-col">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] uppercase tracking-widest font-medium">
          <div className="flex items-center space-x-6">
            <span className="flex items-center"><Phone className="w-3 h-3 mr-2 text-secondary" /> +232 76 555 012</span>
            <span className="flex items-center"><Mail className="w-3 h-3 mr-2 text-secondary" /> info@calabashsl.com</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center"><MapPin className="w-3 h-3 mr-2 text-secondary" /> 11 Dillet Street, Freetown</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.filter(link => !link.private || user).map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-all relative group ${location.pathname === link.path ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-secondary transition-transform duration-300 origin-left ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </Link>
              ))}
              
              {user ? (
                <div className="flex items-center space-x-6 border-l border-gray-100 pl-8">
                  <Link to="/add-property" className="bg-primary text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95">
                    List Property
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-primary border border-gray-200">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">{user.name.split(' ')[0]}</span>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="bg-primary text-white px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-primary">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white border-b border-gray-100 overflow-hidden shadow-xl"
            >
              <div className="px-6 pt-4 pb-8 space-y-6">
                {navLinks.filter(link => !link.private || user).map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className={`block text-xs font-bold uppercase tracking-widest ${location.pathname === link.path ? 'text-primary' : 'text-gray-500'}`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-6 border-t border-gray-100 flex flex-col space-y-4">
                  {user ? (
                    <>
                      <Link to="/add-property" onClick={() => setIsMenuOpen(false)} className="bg-primary text-white px-6 py-3 rounded-xl text-center text-xs font-bold uppercase tracking-widest">List Property</Link>
                      <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-red-500 text-xs font-bold uppercase tracking-widest">Logout</button>
                    </>
                  ) : (
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="bg-primary text-white px-6 py-3 rounded-xl text-center text-xs font-bold uppercase tracking-widest">Sign In</Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="mb-8">
                <Logo />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
                Sierra Leone's premier luxury real estate firm, dedicated to excellence and integrity in every transaction.
              </p>
              <div className="flex space-x-5">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-8 text-secondary">Quick Links</h4>
              <ul className="space-y-4">
                {navLinks.map(link => (
                  <li key={link.path}><Link to={link.path} className="text-sm text-gray-400 hover:text-white transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-8 text-secondary">Contact Details</h4>
              <ul className="space-y-5">
                <li className="flex items-start group">
                  <Phone className="w-4 h-4 text-secondary mr-4 mt-1 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-400">+232 76 555 012</span>
                </li>
                <li className="flex items-start group">
                  <Mail className="w-4 h-4 text-secondary mr-4 mt-1 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-400">info@calabashsl.com</span>
                </li>
                <li className="flex items-start group">
                  <MapPin className="w-4 h-4 text-secondary mr-4 mt-1 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-400">11 Dillet Street, Freetown</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-8 text-secondary">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-6">Subscribe to receive the latest property updates.</p>
              <div className="flex">
                <input type="email" placeholder="Email address" className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-l-xl text-sm w-full outline-none focus:border-secondary transition-colors" />
                <button className="bg-secondary text-primary px-4 py-2.5 rounded-r-xl font-bold text-xs uppercase tracking-widest hover:bg-accent transition-colors">Join</button>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
            <div className="mb-4 md:mb-0">
              © 2026 Calabash Real Estate Firm. All Rights Reserved.
            </div>
            <div className="flex space-x-10">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

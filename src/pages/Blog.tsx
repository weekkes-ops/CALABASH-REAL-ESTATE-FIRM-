import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  image_url: string;
}

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-4 block">The Calabash Journal</span>
            <h1 className="text-5xl md:text-6xl font-serif text-primary mb-8">Insights & Perspectives</h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              Stay informed with the latest trends, investment opportunities, and lifestyle guides in Sierra Leone's real estate market.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-12 h-12 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {posts.map((post, idx) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col h-full"
              >
                <div className="relative aspect-[16/10] rounded-[40px] overflow-hidden mb-8 shadow-xl">
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="flex items-center space-x-6 mb-6 text-[10px] font-black uppercase tracking-widest text-secondary">
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-2" /> {post.date}</span>
                  <span className="flex items-center"><User className="w-3 h-3 mr-2" /> {post.author}</span>
                </div>
                
                <h2 className="text-3xl font-serif text-primary mb-6 group-hover:text-secondary transition-colors leading-tight">
                  {post.title}
                </h2>
                
                <p className="text-gray-500 leading-relaxed mb-8 line-clamp-3 text-lg">
                  {post.content}
                </p>
                
                <div className="mt-auto">
                  <Link to={`/blog/${post.id}`} className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-secondary transition-colors group/link">
                    Read Full Article <ArrowRight className="w-4 h-4 ml-3 group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-32 bg-secondary rounded-[60px] p-16 md:p-24 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-4xl font-serif text-primary mb-4">Never Miss an Update</h2>
            <p className="text-primary/60 text-lg">Subscribe to our monthly newsletter for exclusive property previews and market reports.</p>
          </div>
          <div className="flex w-full lg:w-auto max-w-md">
            <input type="email" placeholder="Your email address" className="bg-white/20 border border-primary/10 px-8 py-5 rounded-l-[24px] text-primary placeholder:text-primary/40 w-full outline-none focus:bg-white/40 transition-all" />
            <button className="bg-primary text-white px-10 py-5 rounded-r-[24px] font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl active:scale-95">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

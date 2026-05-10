import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Properties } from './pages/Properties';
import { Contact } from './pages/Contact';
import { Blog } from './pages/Blog';
import { Auth } from './pages/Auth';
import { AddProperty } from './pages/AddProperty';
import { PropertyDetail } from './pages/PropertyDetail';
import { SavedProperties } from './pages/SavedProperties';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/saved" element={<SavedProperties />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/add-property" element={<AddProperty />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

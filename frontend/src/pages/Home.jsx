// pages/Home.jsx
import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Advisor from '../components/Advisor';
import Memories from '../components/Memories';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Downloads from '../components/Downloads'; // Import here

const Home = ({ onNavigate }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100">
      <Navbar onNavigate={onNavigate} />
      
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-blue-600 z-[110] origin-left" 
        style={{ scaleX }} 
      />

      <Hero />
      <div id="about"><About /></div>
      <div id="services"><Services /></div>
      <div id="advisor"><Advisor /></div>
      {/* Downloads Section added here */}
      <Downloads /> 
      <div id="testimonials"><Memories /></div>
      <div id="contact"><Contact /></div>

      <Footer />
    </div>
  );
};

export default Home;
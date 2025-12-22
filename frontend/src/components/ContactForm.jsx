// components/ContactForm.jsx
import React from 'react';
import toast from 'react-hot-toast';

const ContactForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API Call
    toast.success('Thank you! We will contact you shortly.', {
      duration: 4000,
      icon: '🚗',
    });
    e.target.reset();
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Book Your First Lesson</h2>
          <p className="text-gray-600">Fill out the form below to register.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" required className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="email" placeholder="Email Address" required className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <select className="p-3 border rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500">
            <option>Manual Transmission</option>
            <option>Automatic Transmission</option>
            <option>Refresher Course</option>
          </select>
          <textarea placeholder="Your Message" rows="4" className="p-3 border rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
            Send Inquiry
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
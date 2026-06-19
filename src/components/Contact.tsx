import React, { useState } from 'react';
import { m as motion } from 'motion/react';
import { viewportConfig } from '../utils/animations';
import { MapPin, Mail, Send, Loader2, CheckCircle2, MessageCircle } from 'lucide-react';
import { COMPANY_DETAILS as fallbackCompanyDetails } from '../data';
import { submitContactForm, getCompanyDetails } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';

const Contact = () => {
  const { data: companyData } = useFetchData(getCompanyDetails, fallbackCompanyDetails);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await submitContactForm(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 6000);
      setFormData({ name: '', phone: '', email: '', service: '', message: '' });
    } catch (error: any) {
      setErrorMsg(error?.message || 'Something went wrong. Please try again or contact us via WhatsApp.');
      setTimeout(() => setErrorMsg(''), 8000);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section id="contact" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Let's build something <span className="text-gradient">extraordinary</span>
            </h2>
            <p className="text-slate-600 text-lg mb-10 max-w-md">
              Ready to take your brand to the next level? Drop us a line and let's start the conversation.
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-orange-500 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-slate-900">Visit Us</h4>
                  <a href={companyData.mapsLink} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 transition-colors block text-left focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-sm">
                    {companyData.address}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-green-500 shrink-0">
                  <MessageCircle size={20} aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-slate-900">WhatsApp Us</h4>
                  <a href={`https://wa.me/${companyData.phone.replace(/[\s+]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 transition-colors block text-left focus:outline-none focus:ring-2 focus:ring-green-500 rounded-sm">
                    {companyData.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-orange-400 shrink-0">
                  <Mail size={20} aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-slate-900">Email Us</h4>
                  <a href={`mailto:${companyData.email}`} className="text-slate-600 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-sm">{companyData.email}</a>
                </div>
              </div>
            </div>
            
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            className="glass-card p-8 md:p-10 rounded-3xl"
          >
            <h3 className="text-2xl font-bold font-heading mb-8 text-slate-900">Send us a message</h3>
            <form className="space-y-6" onSubmit={handleSubmit} data-endpoint="/api/contact">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
                  <input 
                    id="name"
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    disabled={loading || success}
                    placeholder="John Doe"
                    autoComplete="name"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 shadow-sm disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone</label>
                  <input 
                    id="phone"
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    disabled={loading || success}
                    placeholder="+91 1234567890"
                    autoComplete="tel"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 shadow-sm disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">Email <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                  disabled={loading || success}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 shadow-sm disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="service" className="text-sm font-medium text-slate-700">Select Service</label>
                <select 
                  id="service"
                  required
                  value={formData.service}
                  onChange={(e) => setFormData(prev => ({...prev, service: e.target.value}))}
                  disabled={loading || success}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-slate-900 shadow-sm disabled:opacity-50 appearance-none"
                >
                  <option value="" disabled>Select a service...</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Ads">Ads</option>
                  <option value="Branding">Branding</option>
                  <option value="Content">Content</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-700">How can we help?</label>
                <textarea 
                  id="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({...prev, message: e.target.value}))}
                  disabled={loading || success}
                  placeholder="Tell us about your project..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none text-slate-900 placeholder:text-slate-400 shadow-sm disabled:opacity-50"
                ></textarea>
              </div>

              {success && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-600 font-medium text-sm text-center bg-green-50 p-3 rounded-lg"
                  role="status"
                >
                  Thanks for reaching out! We will get back to you shortly.
                </motion.p>
              )}

              {errorMsg && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 font-medium text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100"
                  role="alert"
                >
                  {errorMsg}
                </motion.p>
              )}

              <button 
                type="submit"
                disabled={loading || success}
                aria-busy={loading}
                className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                {loading ? (
                  <>Sending... <Loader2 size={18} className="animate-spin" /></>
                ) : success ? (
                  <>Sent Successfully <CheckCircle2 size={18} /></>
                ) : (
                  <>Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                )}
              </button>
            </form>
          </motion.div>

        </div>
        
        {/* Google Maps embed below the form */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={viewportConfig}
           className="w-full h-80 rounded-3xl overflow-hidden glass-card p-2 mt-16 shadow-lg shadow-purple-500/10"
        >
          <iframe 
            src={companyData.mapEmbedUrl}
            title="ColourSplash Studio location on Google Maps"
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: '1.25rem' }} 
            allowFullScreen={false} 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(Contact);

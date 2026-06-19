import React from 'react';
import { COMPANY_DETAILS as fallbackCompanyDetails } from '../data';
import { getCompanyDetails } from '../services/api';
import { useFetchData } from '../hooks/useFetchData';
import { MessageCircle, Phone } from 'lucide-react';

const FloatingContact = () => {
  const { data: companyData } = useFetchData(getCompanyDetails, fallbackCompanyDetails);
  const whatsappNumber = companyData.phone.replace(/[^0-9]/g, '');
  const whatappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20Creator,%20I'm%20interested%20in%20your%20digital%20marketing%20services`;

  return (
    <>
      {/* Desktop WhatsApp Floating Button */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-[60] flex-col items-end gap-4">
        <a 
          href={whatappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative w-16 h-16 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-[#25D366] text-white shadow-lg shadow-green-500/40 flex items-center justify-center hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-green-400 group"
          aria-label="WhatsApp Us"
        >
          <div className="absolute inset-0 bg-[#25D366] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50 pointer-events-none" />
          <MessageCircle size={32} className="relative z-10 drop-shadow-sm group-hover:rotate-12 transition-transform" />
        </a>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe-area">
        <div className="flex">
          <a 
            href={`tel:${companyData.phone.replace(/[\s+]/g, '')}`} 
            aria-label={`Call ${companyData.phone}`}
            className="flex-1 flex flex-col items-center justify-center py-3 min-h-[48px] text-[#FF6D00] hover:bg-slate-50 transition-colors border-r border-slate-100"
          >
            <Phone size={24} className="mb-1 fill-current" />
            <span className="text-xs font-semibold">Call Now</span>
          </a>
          <a 
            href={whatappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex-1 flex flex-col items-center justify-center py-3 min-h-[48px] bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors"
          >
            <MessageCircle size={24} className="mb-1" />
            <span className="text-xs font-semibold">WhatsApp</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default React.memo(FloatingContact);

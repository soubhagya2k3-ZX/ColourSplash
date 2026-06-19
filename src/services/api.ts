/// <reference types="vite/client" />
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  COMPANY_DETAILS,
  PORTFOLIO,
  SERVICES,
  TESTIMONIALS,
  FAQS,
} from "../data";

import { apiClient } from './apiClient';

interface PortfolioItem {
  id: string | number;
  title: string;
  category: string;
  image: string;
  sketchImage?: string;
  tags?: string[];
  challenge?: string;
  solution?: string;
  result?: string;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

export const getCompanyDetails = async () => {
  return COMPANY_DETAILS;
};

const withTimeout = <T>(promise: Promise<T>, ms: number = 5000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ]);
};

export const getServices = async (): Promise<ServiceItem[]> => {
  try {
    const q = query(collection(db, 'services'), orderBy('created_at', 'desc'), limit(50));
    const snapshot = await withTimeout(getDocs(q));
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceItem));
    }
  } catch (e) {
    // Silently fall back to mock data
  }
  return SERVICES as ServiceItem[];
};

export const getPortfolio = async (): Promise<PortfolioItem[]> => {
  try {
    const q = query(collection(db, "portfolio_items"), orderBy("created_at", "desc"), limit(50));
    const snapshot = await withTimeout(getDocs(q));
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          image: data.image || data.image_url 
        } as PortfolioItem;
      });
    }
  } catch (e) {
    // Silently fall back to mock data
  }
  return PORTFOLIO as PortfolioItem[];
};

export const getTestimonials = async (): Promise<any[]> => {
  if (!USE_MOCK_DATA) {
    return apiClient<any[]>('/testimonials');
  }
  return TESTIMONIALS;
};

export const getFaqs = async (): Promise<any[]> => {
  if (!USE_MOCK_DATA) {
    return apiClient<any[]>('/faqs');
  }
  return FAQS;
};

export const submitContactForm = async (data: Record<string, string>) => {
  return apiClient('/contact', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

import { useFetchData } from './useFetchData';
import { getServices } from '../services/api';
import { SERVICES as fallbackData } from '../data';

/**
 * Hook to manage services data fetching.
 */
export const useServices = () => {
  return useFetchData(getServices, fallbackData, 'services');
};

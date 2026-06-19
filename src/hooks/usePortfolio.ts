import { useFetchData } from './useFetchData';
import { getPortfolio } from '../services/api';

/**
 * Hook to manage portfolio data fetching.
 * Currently uses the mocked/local getPortfolio, but serves as the standard
 * data layer hook so UI components remain completely agnostic of backend implementations.
 */
export const usePortfolio = () => {
  return useFetchData(getPortfolio, [], 'portfolio');
};

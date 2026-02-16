import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { FilterState, RegionFilter, StatusFilter, TypeFilter } from '../types';

interface FilterContextType extends FilterState {
  setRegion: (r: RegionFilter) => void;
  setStatus: (s: StatusFilter) => void;
  setType: (t: TypeFilter) => void;
  setYearRange: (from: number | null, to: number | null) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  region: 'all',
  status: 'all',
  type: 'all',
  yearFrom: null,
  yearTo: null,
};

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setRegion = useCallback((region: RegionFilter) => {
    setFilters(f => ({ ...f, region }));
  }, []);

  const setStatus = useCallback((status: StatusFilter) => {
    setFilters(f => ({ ...f, status }));
  }, []);

  const setType = useCallback((type: TypeFilter) => {
    setFilters(f => ({ ...f, type }));
  }, []);

  const setYearRange = useCallback((yearFrom: number | null, yearTo: number | null) => {
    setFilters(f => ({ ...f, yearFrom, yearTo }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <FilterContext.Provider
      value={{
        ...filters,
        setRegion,
        setStatus,
        setType,
        setYearRange,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
}

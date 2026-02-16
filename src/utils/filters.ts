import type { GeoJsonFeature } from '../types';
import type { FilterState, RegionFilter, StatusFilter, TypeFilter } from '../types';

const regionToCountry: Record<string, string> = {
  norway: 'Норвегия',
  uk: 'Великобритания',
  usa: 'США',
  russia: 'Россия',
};

export function filterFeatures(
  features: GeoJsonFeature[],
  filters: FilterState
): GeoJsonFeature[] {
  return features.filter(f => {
    const p = f.properties;

    if (filters.region !== 'all') {
      const country = regionToCountry[filters.region];
      if (p.country !== country) return false;
    }

    if (filters.status !== 'all' && p.status !== filters.status) return false;
    if (filters.type !== 'all' && p.objectType !== filters.type) return false;

    if (filters.yearFrom != null && p.startYear != null && p.startYear < filters.yearFrom) return false;
    if (filters.yearTo != null && p.startYear != null && p.startYear > filters.yearTo) return false;

    return true;
  });
}

export function getStatusLabel(s: StatusFilter): string {
  const map: Record<StatusFilter, string> = {
    all: 'Все статусы',
    production: 'В добыче',
    development: 'В разработке',
    decommissioned: 'Закрыто',
  };
  return map[s];
}

export function getTypeLabel(t: TypeFilter): string {
  const map: Record<TypeFilter, string> = {
    all: 'Все типы',
    oil: 'Нефть',
    gas: 'Газ',
    oil_gas: 'Нефть и газ',
  };
  return map[t];
}

export function getRegionLabel(r: RegionFilter): string {
  const map: Record<RegionFilter, string> = {
    all: 'Все регионы',
    norway: 'Норвегия',
    uk: 'Великобритания',
    usa: 'США',
    russia: 'Россия',
  };
  return map[r];
}

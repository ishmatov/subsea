export interface FieldProperties {
  id: string;
  name: string;
  region: string;
  country: string;
  objectType: 'oil' | 'gas' | 'oil_gas';
  status: 'production' | 'development' | 'decommissioned';
  startYear: number | null;
  waterDepth: number;
  source: string;
  sourceUrl: string;
}

export interface GeoJsonFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: FieldProperties;
}

export interface GeoJsonFields {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

export interface ProductionByYear {
  year: number;
  norway: number;
  uk: number;
  usa: number;
  russia?: number;
  total: number;
  forecast?: boolean;
}

export interface ProductionByRegion {
  region: string;
  value: number;
  fieldCount: number;
}

export interface ProductionByStatus {
  status: string;
  count: number;
  percent: number;
}

export interface ProductionByType {
  type: string;
  count: number;
  percent: number;
}

export interface SourceRecord {
  id: string;
  name: string;
  what: string;
  format: string;
  license: string;
  url: string;
  accessDate: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  description?: string;
  applications?: string[];
  keyFeatures?: string[];
  relatedTerms?: string[];
}

export type RegionFilter = 'all' | 'norway' | 'uk' | 'usa' | 'russia';
export type StatusFilter = 'all' | 'production' | 'development' | 'decommissioned';
export type TypeFilter = 'all' | 'oil' | 'gas' | 'oil_gas';

export interface FilterState {
  region: RegionFilter;
  status: StatusFilter;
  type: TypeFilter;
  yearFrom: number | null;
  yearTo: number | null;
}

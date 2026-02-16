import { useEffect, useState } from 'react';
import { FilterPanel } from '../components/Filters/FilterPanel';
import { ProductionCharts } from '../components/Charts/ProductionCharts';
import type {
  ProductionByYear,
  ProductionByRegion,
  ProductionByStatus,
  ProductionByType,
} from '../types';

interface ProductionData {
  byYear: ProductionByYear[];
  byRegion: ProductionByRegion[];
  byStatus: ProductionByStatus[];
  byType: ProductionByType[];
}

export function ChartsPage() {
  const [data, setData] = useState<ProductionData | null>(null);

  useEffect(() => {
    fetch('/data/production_timeseries.json')
      .then(r => r.json())
      .then((json: { byYear: ProductionByYear[]; byRegion: ProductionByRegion[]; byStatus: ProductionByStatus[]; byType: ProductionByType[] }) =>
        setData({
          byYear: json.byYear,
          byRegion: json.byRegion,
          byStatus: json.byStatus,
          byType: json.byType,
        })
      )
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-slate-600">Загрузка графиков...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Графики и диаграммы</h2>
      <p className="text-slate-600 mb-4">
        Визуализация добычи по годам, регионам и типам объектов. Фильтр «Регион» влияет на линейный график.
      </p>
      <FilterPanel />
      <ProductionCharts
        byYear={data.byYear}
        byRegion={data.byRegion}
        byStatus={data.byStatus}
        byType={data.byType}
      />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { SubseaMap } from '../components/Map/SubseaMap';
import { FilterPanel } from '../components/Filters/FilterPanel';
import type { GeoJsonFields } from '../types';

export function MapPage() {
  const [data, setData] = useState<GeoJsonFields | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/fields.geojson`)
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-slate-600">Загрузка карты...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Интерактивная карта объектов</h2>
      <p className="text-slate-600 mb-4">
        Карта месторождений Северного моря. Кликните по маркеру для просмотра карточки объекта.
        Фильтры синхронизированы с разделом «Графики».
      </p>
      <FilterPanel />
      <SubseaMap features={data.features} />
    </div>
  );
}

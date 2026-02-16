import { useFilters } from '../../context/FilterContext';
import { getRegionLabel } from '../../utils/filters';
import type { RegionFilter } from '../../types';

export function FilterPanel() {
  const { region, setRegion } = useFilters();

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4" role="search" aria-label="Фильтры данных">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label htmlFor="filter-region" className="block text-sm font-medium text-slate-600 mb-1">Регион</label>
          <select
            id="filter-region"
            value={region}
            onChange={e => setRegion(e.target.value as RegionFilter)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500"
            aria-label="Выбор региона"
          >
            {(['all', 'norway', 'uk', 'usa', 'russia'] as const).map(r => (
              <option key={r} value={r}>{getRegionLabel(r)}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

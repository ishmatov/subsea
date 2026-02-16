import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import { useFilters } from '../../context/FilterContext';
import type {
  ProductionByYear,
  ProductionByRegion,
  ProductionByStatus,
  ProductionByType,
} from '../../types';

interface ProductionChartsProps {
  byYear: ProductionByYear[];
  byRegion: ProductionByRegion[];
  byStatus: ProductionByStatus[];
  byType: ProductionByType[];
}

const COLORS = ['#0ea5e9', '#0c4a6e', '#0284c7', '#38bdf8', '#7dd3fc'];

export function ProductionCharts({
  byYear,
  byRegion,
  byStatus,
  byType,
}: ProductionChartsProps) {
  const { region } = useFilters();

  const filteredByYear = useMemo(() => {
    if (region === 'all') return byYear;
    const key = region === 'norway' ? 'norway' : region === 'uk' ? 'uk' : region === 'usa' ? 'usa' : 'russia';
    return byYear.map(row => ({
      year: row.year,
      value: row[key] ?? 0,
      total: row.total,
      forecast: row.forecast,
    }));
  }, [byYear, region]);

  const chartDataYear = useMemo(() => {
    if (region === 'all') {
      return byYear.map(row => ({
        year: String(row.year),
        'Норвегия': row.norway,
        'Великобритания': row.uk,
        'США (GOM)': row.usa,
        'Россия': row.russia ?? 0,
        _forecast: row.forecast,
      }));
    }
    return filteredByYear.map(row => ({
      year: String(row.year),
      value: 'value' in row ? row.value : 0,
      _forecast: row.forecast,
    }));
  }, [byYear, region, filteredByYear]);

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Добыча по годам (тыс. барр. н.э./сут, условные данные)
        </h3>
        <p className="text-xs text-slate-500 mb-2">
          Источник: NSTA PPRS, NOD, EIA, Роснедра. Прогноз 2026–2030: IEA Oil 2025, отраслевые обзоры. Дата доступа: 2024-01-15
        </p>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            {region === 'all' ? (
              <LineChart data={chartDataYear} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="forecastZone" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.12" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceArea
                  x1="2026"
                  x2="2030"
                  fill="url(#forecastZone)"
                  fillOpacity={1}
                />
                <ReferenceLine
                  x="2025"
                  stroke="#64748b"
                  strokeDasharray="4 2"
                  strokeWidth={1.5}
                  label={{ value: 'Прогноз', position: 'insideTopRight', fill: '#64748b', fontSize: 11 }}
                />
                <Line type="monotone" dataKey="Норвегия" stroke={COLORS[0]} strokeWidth={2} />
                <Line type="monotone" dataKey="Великобритания" stroke={COLORS[1]} strokeWidth={2} />
                <Line type="monotone" dataKey="США (GOM)" stroke={COLORS[2]} strokeWidth={2} />
                <Line type="monotone" dataKey="Россия" stroke={COLORS[3]} strokeWidth={2} />
              </LineChart>
            ) : (
              <LineChart data={chartDataYear} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="forecastZoneSingle" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.12" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <ReferenceArea x1="2026" x2="2030" fill="url(#forecastZoneSingle)" fillOpacity={1} />
                <ReferenceLine
                  x="2025"
                  stroke="#64748b"
                  strokeDasharray="4 2"
                  strokeWidth={1.5}
                  label={{ value: 'Прогноз', position: 'insideTopRight', fill: '#64748b', fontSize: 11 }}
                />
                <Line type="monotone" dataKey="value" stroke={COLORS[0]} strokeWidth={2} name="Добыча" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-3 rounded-sm bg-sky-100 border border-sky-200" aria-hidden />
            Прогноз 2026–2030 (рост глубоководной добычи GOM, Арктики, Johan Sverdrup)
          </span>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Сравнение регионов (текущая добыча)
        </h3>
        <p className="text-xs text-slate-500 mb-2">
          Источник: production_timeseries.json (агрегат по открытым данным)
        </p>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byRegion} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="region" width={70} />
              <Tooltip />
              <Bar dataKey="value" fill={COLORS[0]} name="Добыча (тыс. барр.)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Доли по статусу объектов
          </h3>
          <p className="text-xs text-slate-500 mb-2">В процентах и количестве объектов. Источник: NOD, NSTA</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name ?? ''} ${((percent ?? 0) <= 1 ? (percent ?? 0) * 100 : percent ?? 0).toFixed(0)}%`
                  }
                >
                  {byStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Доли по типу объектов
          </h3>
          <p className="text-xs text-slate-500 mb-2">В процентах и количестве объектов. Источник: NOD, NSTA</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byType}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name ?? ''} ${((percent ?? 0) <= 1 ? (percent ?? 0) * 100 : percent ?? 0).toFixed(0)}%`
                  }
                >
                  {byType.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}

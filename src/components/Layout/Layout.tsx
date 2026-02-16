import { useEffect, useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Главная' },
  { to: '/map', label: 'Карта' },
  { to: '/charts', label: 'Графики' },
  { to: '/technology', label: 'Технологии' },
  { to: '/prospects', label: 'Перспективы' },
  { to: '/sources', label: 'Источники' },
];

// тыс. барр./сут → барр./мин: * 1000 / (24 * 60)
function barrelsPerMinute(thousandsPerDay: number): number {
  return Math.round((thousandsPerDay * 1000) / 1440);
}

export function Layout() {
  const [bpm, setBpm] = useState<number | null>(null);
  const [cumulativeBarrels, setCumulativeBarrels] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/production_timeseries.json`)
      .then(r => r.json())
      .then((j: { byYear: { year: number; total: number; forecast?: boolean }[] }) => {
        const recent = j.byYear.filter((r: { forecast?: boolean }) => !r.forecast).slice(-3);
        const avg = recent.length ? recent.reduce((s: number, r: { total: number }) => s + r.total, 0) / recent.length : 4810;
        setBpm(barrelsPerMinute(avg));
      })
      .catch(() => setBpm(3340));
  }, []);

  useEffect(() => {
    if (bpm == null) return;
    const barrelsPerSecond = bpm / 60;
    const interval = setInterval(() => {
      setCumulativeBarrels(prev => prev + barrelsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [bpm]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-sky-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Подводный атлас</h1>
              <p className="text-sky-200 text-sm mt-1">Интерактивный образовательный сайт о подводной добыче нефти и газа</p>
            </div>
            {bpm != null && (
              <div className="shrink-0 flex flex-col sm:flex-row gap-2">
                <div className="bg-sky-800/50 rounded-lg px-4 py-2 text-right">
                  <p className="text-sky-200 text-xs">Средняя добыча подводным методом</p>
                  <p className="text-lg font-bold tabular-nums">
                    ≈ {(bpm).toLocaleString('ru-RU')} барр./мин
                  </p>
                </div>
                <div className="bg-sky-800/50 rounded-lg px-4 py-2 text-right">
                  <p className="text-sky-200 text-xs">Объём с момента загрузки страницы</p>
                  <p className="text-lg font-bold tabular-nums transition-[font-variant-numeric]">
                    {(Math.round(cumulativeBarrels)).toLocaleString('ru-RU')} барр.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <nav className="container mx-auto px-4 pb-3 flex flex-wrap gap-2" aria-label="Основная навигация">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors aria-[current]:bg-sky-700 ${
                  isActive ? 'bg-sky-700' : 'hover:bg-sky-800'
                }`
              }
              aria-current={to === '/' ? 'page' : undefined}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-slate-800 text-slate-300 text-sm py-4">
        <div className="container mx-auto px-4 text-center space-y-1">
          <p>Подводный атлас — образовательный проект. Данные из открытых источников.</p>
          <p className="text-slate-400">
            Автор: Ишматов Михаил, ученик 10Г класса, Гимназия Новый Уренгой, 2026 год
          </p>
        </div>
      </footer>
    </div>
  );
}

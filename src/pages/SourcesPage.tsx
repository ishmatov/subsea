import { useEffect, useState } from 'react';
import type { SourceRecord } from '../types';

interface SourcesData {
  sources: SourceRecord[];
  methodology: string;
}

export function SourcesPage() {
  const [data, setData] = useState<SourcesData | null>(null);

  useEffect(() => {
    fetch('/data/sources.json')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-slate-600">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Источники и данные</h2>
        <p className="text-slate-600 mb-6">
          Все данные на сайте получены из открытых источников. Ниже указаны название, описание, формат, лицензия
          и ссылка на каждый источник, а также дата доступа.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-xl shadow-md overflow-hidden" role="table" aria-label="Таблица источников данных">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-4 font-semibold text-slate-800">Источник</th>
                <th className="text-left p-4 font-semibold text-slate-800">Что содержит</th>
                <th className="text-left p-4 font-semibold text-slate-800">Формат</th>
                <th className="text-left p-4 font-semibold text-slate-800">Лицензия</th>
                <th className="text-left p-4 font-semibold text-slate-800">Ссылка</th>
                <th className="text-left p-4 font-semibold text-slate-800">Дата доступа</th>
              </tr>
            </thead>
            <tbody>
              {data.sources.map(s => (
                <tr key={s.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">{s.name}</td>
                  <td className="p-4 text-slate-600 text-sm">{s.what}</td>
                  <td className="p-4 text-slate-600 text-sm">{s.format}</td>
                  <td className="p-4 text-slate-600 text-sm">{s.license}</td>
                  <td className="p-4">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 hover:underline break-all"
                    >
                      {s.url}
                    </a>
                  </td>
                  <td className="p-4 text-slate-600 text-sm">{s.accessDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">Методика обработки данных</h3>
        <p className="text-slate-600 leading-relaxed whitespace-pre-line">{data.methodology}</p>
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface ProspectTrend {
  id: string;
  title: string;
  shortText: string;
  dataRef: string;
  image?: string;
}

export function ProspectsPage() {
  const [trends, setTrends] = useState<ProspectTrend[]>([]);
  const [limitations, setLimitations] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/prospects.json`)
      .then(r => r.json())
      .then((json: { trends: ProspectTrend[]; limitations?: string[] }) => {
        setTrends(json.trends);
        setLimitations(json.limitations ?? []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      <section className="prose prose-slate max-w-none">
        <h2 className="text-2xl font-bold text-slate-800">Перспективы и тренды</h2>
        <p className="text-slate-600 leading-relaxed">
          Развитие подводной добычи идёт в направлении больших глубин, большей автономности и интеграции
          с возобновляемыми источниками энергии. Ниже — структурированный обзор трендов с привязкой к данным,
          где возможно.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Ключевые тренды</h3>
        <div className="space-y-4">
          {trends.map(t => (
            <Link
              key={t.id}
              to={`/prospects/${t.id}`}
              className="group flex gap-4 bg-white rounded-xl shadow-md p-6 border-l-4 border-sky-500 hover:shadow-lg transition-shadow"
            >
              {t.image && (
                <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-slate-100">
                  <img src={`./${t.image.replace(/^\//, '')}`} alt="" className="w-full h-full object-contain p-1" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-slate-800 group-hover:text-sky-700">{t.title}</h4>
                <p className="text-slate-600 mt-2">{t.shortText}</p>
              <p className="text-xs text-slate-500 mt-2">Привязка к данным: {t.dataRef}</p>
                <span className="inline-block mt-2 text-sm text-sky-600 font-medium">Подробнее →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {limitations.length > 0 && (
        <section className="bg-amber-50 rounded-xl p-6 border border-amber-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Ограничения и выводы</h3>
          <ul className="list-disc list-inside text-slate-700 space-y-2">
            {limitations.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <p className="text-slate-600">
          <Link to="/sources" className="text-sky-600 hover:underline">
            Перейти к разделу «Источники и данные»
          </Link>{' '}
          для полного реестра источников и методики.
        </p>
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface ProspectTrend {
  id: string;
  title: string;
  shortText: string;
  description: string;
  keyPoints: string[];
  dataRef: string;
  image?: string;
  relatedTrends?: string[];
}

export function ProspectsDetailPage() {
  const { trendId } = useParams<{ trendId: string }>();
  const [trend, setTrend] = useState<ProspectTrend | null>(null);
  const [allTrends, setAllTrends] = useState<ProspectTrend[]>([]);

  useEffect(() => {
    fetch('/data/prospects.json')
      .then(r => r.json())
      .then((json: { trends: ProspectTrend[] }) => {
        setAllTrends(json.trends);
        const found = json.trends.find((t: ProspectTrend) => t.id === trendId);
        setTrend(found ?? null);
      })
      .catch(console.error);
  }, [trendId]);

  if (!trendId) return null;
  if (trend === undefined) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Загрузка...</p>
      </div>
    );
  }
  if (trend === null) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">Тренд не найден.</p>
        <Link to="/prospects" className="text-sky-600 hover:underline">
          Вернуться к перспективам
        </Link>
      </div>
    );
  }

  const related = trend.relatedTrends
    ?.map(id => allTrends.find(t => t.id === id))
    .filter((t): t is ProspectTrend => t != null) ?? [];

  return (
    <div className="space-y-8">
      <nav className="text-sm text-slate-600">
        <Link to="/prospects" className="text-sky-600 hover:underline">
          ← Перспективы и тренды
        </Link>
      </nav>

      <article className="bg-white rounded-xl shadow-md overflow-hidden">
        {trend.image && (
          <div className="w-full h-48 sm:h-64 bg-slate-100">
            <img src={trend.image} alt="" className="w-full h-full object-contain p-4" />
          </div>
        )}
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{trend.title}</h1>
          <p className="text-slate-600 mt-2 text-lg">{trend.shortText}</p>

          <div className="mt-8 space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Описание</h2>
              <p className="text-slate-600 leading-relaxed">{trend.description}</p>
            </section>

            {trend.keyPoints && trend.keyPoints.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-2">Ключевые моменты</h2>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  {trend.keyPoints.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </section>
            )}

            <section className="pt-4 border-t">
              <p className="text-sm text-slate-500">
                <strong>Привязка к данным:</strong> {trend.dataRef}
              </p>
            </section>
          </div>
        </div>

        {related.length > 0 && (
          <div className="bg-slate-50 px-6 md:px-8 py-4 border-t">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Связанные тренды</h3>
            <div className="flex flex-wrap gap-2">
              {related.map(t => (
                <Link
                  key={t.id}
                  to={`/prospects/${t.id}`}
                  className="px-3 py-1 bg-white rounded-full text-sm text-sky-600 hover:bg-sky-50 border border-slate-200"
                >
                  {t.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

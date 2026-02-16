import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { GlossaryTerm } from '../types';

export function TechnologyDetailPage() {
  const { termId } = useParams<{ termId: string }>();
  const [term, setTerm] = useState<GlossaryTerm | null>(null);
  const [allTerms, setAllTerms] = useState<GlossaryTerm[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/glossary.json`)
      .then(r => r.json())
      .then((json: { terms: GlossaryTerm[] }) => {
        setAllTerms(json.terms);
        const found = json.terms.find((t: GlossaryTerm) => t.id === termId);
        setTerm(found ?? null);
      })
      .catch(console.error);
  }, [termId]);

  if (!termId) return null;
  if (term === undefined) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Загрузка...</p>
      </div>
    );
  }
  if (term === null) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">Объект не найден.</p>
        <Link to="/technology" className="text-sky-600 hover:underline">
          Вернуться к справочнику
        </Link>
      </div>
    );
  }

  const related = term.relatedTerms
    ?.map(id => allTerms.find(t => t.id === id))
    .filter((t): t is GlossaryTerm => t != null) ?? [];

  return (
    <div className="space-y-8">
      <nav className="text-sm text-slate-600">
        <Link to="/technology" className="text-sky-600 hover:underline">
          ← Справочник технологий
        </Link>
      </nav>

      <article className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{term.term}</h1>
          <p className="text-slate-600 mt-2 text-lg">{term.definition}</p>

          <div className="mt-8 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="w-full aspect-square max-w-xs mx-auto md:mx-0 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={`./images/technology/${term.id}.svg`}
                  alt={`Схема: ${term.term}`}
                  className="max-w-full max-h-full object-contain p-4"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-6">
              {term.description && (
                <section>
                  <h2 className="text-lg font-semibold text-slate-800 mb-2">Описание</h2>
                  <p className="text-slate-600 leading-relaxed">{term.description}</p>
                </section>
              )}

              {term.applications && term.applications.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-slate-800 mb-2">Применение</h2>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    {term.applications.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </section>
              )}

              {term.keyFeatures && term.keyFeatures.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-slate-800 mb-2">Ключевые элементы</h2>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    {term.keyFeatures.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="bg-slate-50 px-6 md:px-8 py-4 border-t">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Связанные термины</h3>
            <div className="flex flex-wrap gap-2">
              {related.map(t => (
                <Link
                  key={t.id}
                  to={`/technology/${t.id}`}
                  className="px-3 py-1 bg-white rounded-full text-sm text-sky-600 hover:bg-sky-50 border border-slate-200"
                >
                  {t.term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

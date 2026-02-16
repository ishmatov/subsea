import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { GlossaryTerm } from '../types';

const termIds = ['subsea-tree', 'manifold', 'flowlines', 'rov', 'auv', 'fpso', 'tie-back'];

export function TechnologyPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/glossary.json`)
      .then(r => r.json())
      .then((json: { terms: GlossaryTerm[] }) => {
        const filtered = json.terms.filter((t: GlossaryTerm) => termIds.includes(t.id));
        setTerms(filtered);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Технологии (справочник)</h2>
        <p className="text-slate-600 mb-6">
          Краткие определения ключевых терминов подводной добычи.
        </p>

        <div className="space-y-6">
          {terms.map(t => (
            <Link
              key={t.id}
              to={`/technology/${t.id}`}
              className="group block bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-4 hover:shadow-lg transition-shadow border border-transparent hover:border-sky-200"
            >
              <div className="shrink-0 w-full sm:w-40 h-32 sm:h-36 flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden">
                <img
                  src={`./images/technology/${t.id}.svg`}
                  alt={`Схема: ${t.term}`}
                  className="max-w-full max-h-full object-contain p-2"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 text-lg group-hover:text-sky-700">{t.term}</h3>
                <p className="text-slate-600 mt-2">{t.definition}</p>
                <span className="inline-block mt-2 text-sm text-sky-600 font-medium">
                  Подробнее →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';

const facts = [
  {
    title: 'Глубина до 340 м',
    text: 'Месторождение Тролль в Норвегии — одно из крупнейших газовых месторождений Северного моря. Глубина воды на устье скважин достигает 340 метров.',
    source: 'NOD FactPages',
  },
  {
    title: 'С 1971 года',
    text: 'Экофиск — первое крупное нефтяное месторождение на норвежском шельфе. Запущено в 1971 году и положило начало эре подводной добычи в регионе.',
    source: 'NOD FactPages',
  },
  {
    title: '185 объектов в добыче',
    text: 'По данным открытых источников, около 185 подводных объектов находятся в активной добыче в Северном море и сопредельных акваториях.',
    source: 'NSTA, NOD',
  },
  {
    title: 'Российский шельф',
    text: 'Приразломное (Печорское море), Сахалин-1 (Охотское море) и месторождения им. Филановского и Корчагина (Каспий) — ключевые проекты подводной добычи в РФ.',
    source: 'Роснедра, Wikipedia',
  },
];

export function HomePage() {
  return (
    <div className="space-y-8">
      <section className="prose prose-slate max-w-none">
        <h2 className="text-2xl font-bold text-slate-800">Что такое подводная добыча?</h2>
        <p className="text-slate-600 leading-relaxed">
          <strong>Подводная добыча</strong> — это технологии извлечения нефти и газа с морского дна без
          сооружения стационарных платформ над поверхностью воды. Оборудование (устьевое оборудование, коллекторы,
          трубопроводы) размещается на дне, а управление ведётся с берега или с плавучих установок.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Подводная добыча применяется в Северном море, Мексиканском заливе, Бразилии, Западной Африке и других регионах.
          Это позволяет осваивать месторождения на глубинах от 70 до более 3000 метров.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Навигация</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <Link
            to="/map"
            className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-sky-500"
            aria-label="Перейти к интерактивной карте"
          >
            <span className="text-2xl" aria-hidden>🗺️</span>
            <h3 className="font-semibold text-slate-800 mt-2">Карта</h3>
            <p className="text-sm text-slate-600 mt-1">Объекты Северного моря и фильтры</p>
          </Link>
          <Link
            to="/charts"
            className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-sky-500"
            aria-label="Перейти к графикам"
          >
            <span className="text-2xl" aria-hidden>📊</span>
            <h3 className="font-semibold text-slate-800 mt-2">Графики</h3>
            <p className="text-sm text-slate-600 mt-1">Добыча по годам, регионам, типам</p>
          </Link>
          <Link
            to="/technology"
            className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-sky-500"
            aria-label="Перейти к технологиям"
          >
            <span className="text-2xl" aria-hidden>⚙️</span>
            <h3 className="font-semibold text-slate-800 mt-2">Технологии</h3>
            <p className="text-sm text-slate-600 mt-1">Подводные елки, ТНПА, плавучие установки и др.</p>
          </Link>
          <Link
            to="/prospects"
            className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-sky-500"
            aria-label="Перейти к перспективам"
          >
            <span className="text-2xl" aria-hidden>🔮</span>
            <h3 className="font-semibold text-slate-800 mt-2">Перспективы</h3>
            <p className="text-sm text-slate-600 mt-1">Тренды и ограничения</p>
          </Link>
          <Link
            to="/sources"
            className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-sky-500"
            aria-label="Перейти к источникам данных"
          >
            <span className="text-2xl" aria-hidden>📚</span>
            <h3 className="font-semibold text-slate-800 mt-2">Источники</h3>
            <p className="text-sm text-slate-600 mt-1">Открытые данные и лицензии</p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Факты</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {facts.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-4 border-t-4 border-sky-500"
              aria-labelledby={`fact-title-${i}`}
            >
              <h3 id={`fact-title-${i}`} className="font-semibold text-slate-800">
                {f.title}
              </h3>
              <p className="text-slate-600 text-sm mt-2">{f.text}</p>
              <p className="text-xs text-slate-500 mt-2">Источник: {f.source}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

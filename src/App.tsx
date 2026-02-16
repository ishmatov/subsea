import { createHashRouter, RouterProvider, Link, useRouteError } from 'react-router-dom';
import { FilterProvider } from './context/FilterContext';
import { Layout } from './components/Layout/Layout';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { ChartsPage } from './pages/ChartsPage';
import { SourcesPage } from './pages/SourcesPage';
import { ProspectsPage } from './pages/ProspectsPage';
import { ProspectsDetailPage } from './pages/ProspectsDetailPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { TechnologyDetailPage } from './pages/TechnologyDetailPage';
import './index.css';

// HashRouter: маршруты в # (например /#/map). Сервер всегда отдаёт index.html, роутинг на клиенте.

function ErrorFallback() {
  const error = useRouteError() as { status?: number; message?: string };
  const is404 = error?.status === 404 || (error?.message?.toLowerCase?.() ?? '').includes('not found');
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 p-4">
      <h1 className="text-2xl font-bold text-sky-900 mb-2">
        {is404 ? 'Страница не найдена' : 'Что-то пошло не так'}
      </h1>
      <p className="text-sky-700 mb-6">
        {is404 ? 'Такой страницы нет. Вернитесь на главную.' : (error?.message ?? 'Неизвестная ошибка')}
      </p>
      <Link to="/" className="text-sky-600 underline hover:text-sky-800">На главную</Link>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 p-4">
      <h1 className="text-2xl font-bold text-sky-900 mb-2">Страница не найдена</h1>
      <p className="text-sky-700 mb-6">Такой страницы нет. Вернитесь на главную.</p>
      <Link to="/" className="text-sky-600 underline hover:text-sky-800">На главную</Link>
    </div>
  );
}

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorFallback />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'charts', element: <ChartsPage /> },
      { path: 'sources', element: <SourcesPage /> },
      { path: 'prospects', element: <ProspectsPage /> },
      { path: 'prospects/:trendId', element: <ProspectsDetailPage /> },
      { path: 'technology', element: <TechnologyPage /> },
      { path: 'technology/:termId', element: <TechnologyDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  return (
    <FilterProvider>
      <RouterProvider router={router} />
    </FilterProvider>
  );
}

export default App;

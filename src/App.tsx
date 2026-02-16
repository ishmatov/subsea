import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'charts', element: <ChartsPage /> },
      { path: 'sources', element: <SourcesPage /> },
      { path: 'prospects', element: <ProspectsPage /> },
      { path: 'prospects/:trendId', element: <ProspectsDetailPage /> },
      { path: 'technology', element: <TechnologyPage /> },
      { path: 'technology/:termId', element: <TechnologyDetailPage /> },
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

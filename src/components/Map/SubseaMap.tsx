import { useMemo, useState, useEffect, useRef } from 'react';
import { Map, Marker } from 'pigeon-maps';
import { osm } from 'pigeon-maps/providers';
import { useFilters } from '../../context/FilterContext';
import { filterFeatures } from '../../utils/filters';
import type { GeoJsonFeature } from '../../types';

const YANDEX_API_KEY = '8f5d2cbb-e837-40fe-bc9e-19dba5b806ce';

declare global {
  interface Window {
    ymaps3?: {
      ready: Promise<unknown>;
      import: (pkg: string) => Promise<unknown>;
      YMap: new (el: HTMLElement, opts: { location: object; showScaleInCopyrights?: boolean }, children: unknown[]) => { addChild: (c: unknown) => void; removeChild: (c: unknown) => void; setLocation: (loc: object) => void };
      YMapDefaultSchemeLayer: new (opts?: object) => object;
      YMapDefaultFeaturesLayer: new (opts?: object) => object;
    };
  }
}

interface SubseaMapProps {
  features: GeoJsonFeature[];
}

function getCenterAndZoom(features: GeoJsonFeature[]): { center: [number, number]; zoom: number } {
  if (features.length === 0) return { center: [58.5, 2], zoom: 5 };
  const lats = features.map(f => f.geometry.coordinates[1]);
  const lngs = features.map(f => f.geometry.coordinates[0]);
  const center: [number, number] = [
    (Math.min(...lats) + Math.max(...lats)) / 2,
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
  ];
  const latSpan = Math.max(...lats) - Math.min(...lats);
  const lngSpan = Math.max(...lngs) - Math.min(...lngs);
  const span = Math.max(latSpan, lngSpan, 1);
  const zoom = Math.min(18, Math.max(2, Math.round(6 - Math.log2(span))));
  return { center, zoom };
}

function getTypeLabel(t: string): string {
  if (t === 'oil_gas') return 'Нефть и газ';
  if (t === 'oil') return 'Нефть';
  return 'Газ';
}

function getStatusLabel(s: string): string {
  if (s === 'production') return 'В добыче';
  if (s === 'development') return 'В разработке';
  return 'Закрыто';
}

function loadYandexScript(): Promise<boolean> {
  if (window.ymaps3) {
    return window.ymaps3.ready.then(() => true);
  }
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/v3/?apikey=${YANDEX_API_KEY}&lang=ru_RU`;
    script.async = true;
    script.onload = () => {
      if (window.ymaps3) {
        window.ymaps3.ready.then(() => resolve(true)).catch(() => resolve(false));
      } else {
        resolve(false);
      }
    };
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

function YandexMapPart({
  filtered,
  center,
  zoom,
  onSelect,
  mapRef,
  onReady,
}: {
  filtered: GeoJsonFeature[];
  center: [number, number];
  zoom: number;
  onSelect: (f: GeoJsonFeature) => void;
  mapRef: React.RefObject<HTMLDivElement | null>;
  onReady: () => void;
}) {
  const mapInstanceRef = useRef<{ map: { addChild: (c: unknown) => void; removeChild: (c: unknown) => void; setLocation: (loc: object) => void }; markers: unknown[] } | null>(null);

  useEffect(() => {
    const ymaps3 = window.ymaps3;
    if (!ymaps3 || !mapRef.current) return;

    let cancelled = false;

    const init = async () => {
      try {
        await ymaps3.ready;
        if (cancelled || !mapRef.current) return;

        const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } = ymaps3;
        const theme = (await ymaps3.import('@yandex/ymaps3-default-ui-theme')) as {
          YMapDefaultMarker: new (opts: {
            coordinates: [number, number];
            title?: string;
            subtitle?: string;
            color?: string;
            onClick?: () => void;
          }) => object;
        };

        const [lng, lat] = [center[1], center[0]];
        const map = new YMap(
          mapRef.current,
          {
            location: { center: [lng, lat], zoom },
            showScaleInCopyrights: true,
          },
          [new YMapDefaultSchemeLayer({}), new YMapDefaultFeaturesLayer({})]
        ) as { addChild: (c: unknown) => void; removeChild: (c: unknown) => void; setLocation: (loc: object) => void };

        const markers: unknown[] = [];
        for (const f of filtered) {
          const [lon, lat] = f.geometry.coordinates;
          const feature = f;
          const marker = new theme.YMapDefaultMarker({
            coordinates: [lon, lat],
            title: f.properties.name,
            subtitle: f.properties.country,
            color: 'blue',
            onClick: () => onSelect(feature),
          });
          map.addChild(marker);
          markers.push(marker);
        }

        mapInstanceRef.current = { map, markers };
        onReady();
      } catch {
        onReady();
      }
    };

    init();
    return () => {
      cancelled = true;
      if (mapInstanceRef.current && mapRef.current) {
        mapRef.current.innerHTML = '';
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const inst = mapInstanceRef.current;
    if (!inst) return;

    const { map, markers } = inst;
    for (const m of markers) {
      map.removeChild(m);
    }
    inst.markers = [];

    void (async () => {
      const ymaps3 = window.ymaps3;
      if (!ymaps3) return;

      const theme = (await ymaps3.import('@yandex/ymaps3-default-ui-theme')) as {
        YMapDefaultMarker: new (opts: {
          coordinates: [number, number];
          title?: string;
          subtitle?: string;
          color?: string;
          onClick?: () => void;
        }) => object;
      };

      const [lng, lat] = [center[1], center[0]];
      map.setLocation({ center: [lng, lat], zoom });

      const newMarkers: unknown[] = [];
      for (const f of filtered) {
        const [lon, lat] = f.geometry.coordinates;
        const feature = f;
        const marker = new theme.YMapDefaultMarker({
          coordinates: [lon, lat],
          title: f.properties.name,
          subtitle: f.properties.country,
          color: 'blue',
          onClick: () => onSelect(feature),
        });
        map.addChild(marker);
        newMarkers.push(marker);
      }
      inst.markers = newMarkers;
    })();
  }, [filtered, center, zoom, onSelect]);

  return <div ref={mapRef} className="w-full h-full" />;
}

export function SubseaMap({ features }: SubseaMapProps) {
  const { region, status, type, yearFrom, yearTo } = useFilters();
  const [selectedFeature, setSelectedFeature] = useState<GeoJsonFeature | null>(null);
  const [mapProvider, setMapProvider] = useState<'loading' | 'yandex' | 'osm'>('loading');
  const [yandexReady, setYandexReady] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [osmCenter, setOsmCenter] = useState<[number, number]>([58.5, 2]);
  const [osmZoom, setOsmZoom] = useState(5);

  const filtered = useMemo(
    () =>
      filterFeatures(features, {
        region,
        status,
        type,
        yearFrom,
        yearTo,
      }),
    [features, region, status, type, yearFrom, yearTo]
  );

  const { center, zoom } = useMemo(() => getCenterAndZoom(filtered), [filtered]);

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (cancelled || mapProvider !== 'loading') return;
      setMapProvider('osm');
      setYandexReady(true);
    }, 6000);

    loadYandexScript()
      .then((ok) => {
        if (cancelled) return;
        clearTimeout(timeout);
        if (ok) {
          setMapProvider('yandex');
        } else {
          setMapProvider('osm');
        }
        setYandexReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        clearTimeout(timeout);
        setMapProvider('osm');
        setYandexReady(true);
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    setOsmCenter(center);
    setOsmZoom(zoom);
  }, [center, zoom]);

  const popup = selectedFeature && (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white rounded-lg shadow-xl p-4 border border-slate-200 z-10">
      <h3 className="font-bold text-slate-800">{selectedFeature.properties.name}</h3>
      <dl className="mt-2 text-sm space-y-1 text-slate-600">
        <div>
          <dt className="text-slate-500 inline">Страна: </dt>
          <dd className="inline">{selectedFeature.properties.country}</dd>
        </div>
        <div>
          <dt className="text-slate-500 inline">Тип: </dt>
          <dd className="inline">{getTypeLabel(selectedFeature.properties.objectType)}</dd>
        </div>
        <div>
          <dt className="text-slate-500 inline">Статус: </dt>
          <dd className="inline">{getStatusLabel(selectedFeature.properties.status)}</dd>
        </div>
        <div>
          <dt className="text-slate-500 inline">Глубина воды: </dt>
          <dd className="inline">{selectedFeature.properties.waterDepth} м</dd>
        </div>
        {selectedFeature.properties.startYear && (
          <div>
            <dt className="text-slate-500 inline">Год запуска: </dt>
            <dd className="inline">{selectedFeature.properties.startYear}</dd>
          </div>
        )}
        <div className="mt-2 pt-2 border-t">
          <dt className="text-slate-500 text-xs">Источник</dt>
          <dd>
            <a
              href={selectedFeature.properties.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 hover:underline"
            >
              {selectedFeature.properties.source}
            </a>
          </dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={() => setSelectedFeature(null)}
        className="mt-2 text-sm text-slate-500 hover:text-slate-700"
      >
        Закрыть
      </button>
    </div>
  );

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200" style={{ minHeight: 400 }}>
      <div className="relative w-full h-[450px]" aria-label="Интерактивная карта объектов подводной добычи">
        {mapProvider === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-500">
            Загрузка карты...
          </div>
        )}

        {mapProvider === 'yandex' && yandexReady && (
          <YandexMapPart
            filtered={filtered}
            center={center}
            zoom={zoom}
            onSelect={setSelectedFeature}
            mapRef={mapRef}
            onReady={() => {}}
          />
        )}

        {mapProvider === 'osm' && yandexReady && (
          <div className="w-full h-full">
            <Map
              provider={osm}
              center={osmCenter}
              zoom={osmZoom}
              onBoundsChanged={({ center: c, zoom: z }) => {
                setOsmCenter(c);
                setOsmZoom(z);
              }}
              attribution={
                <>
                  © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
                </>
              }
            >
              {filtered.map((f) => (
                <Marker
                  key={f.properties.id}
                  anchor={[f.geometry.coordinates[1], f.geometry.coordinates[0]]}
                  payload={f}
                  onClick={({ payload }) => setSelectedFeature(payload)}
                />
              ))}
            </Map>
          </div>
        )}

        {popup}
      </div>
      <div className="bg-slate-100 px-4 py-2 text-sm text-slate-600">
        <strong>Легенда:</strong> Синяя точка — объект. Кликните для деталей. Подложка:{' '}
        {mapProvider === 'yandex' ? 'Яндекс Карты' : 'OpenStreetMap'}
        {mapProvider === 'osm' && ' (резервный вариант при 403)'}.
      </div>
    </div>
  );
}

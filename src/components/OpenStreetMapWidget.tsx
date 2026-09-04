import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Navigation,
  Building2,
  Users,
  RefreshCw,
  Maximize2,
  Minimize2,
  Compass,
} from "lucide-react";
import { geocodeLocation, LocationGeo, detectUserLocation } from "@/lib/utils";

interface OpenStreetMapWidgetProps {
  locationStr: string;
  categoryName?: string;
  idea?: string;
  competitorCount?: number;
  banksCount?: number;
  transportCount?: number;
  marketsCount?: number;
  onLocationUpdate?: (newLocation: string) => void;
}

export const OpenStreetMapWidget: React.FC<OpenStreetMapWidgetProps> = ({
  locationStr,
  categoryName = "Business",
  idea = "Local Shop",
  competitorCount = 4,
  banksCount = 3,
  transportCount = 5,
  marketsCount = 2,
  onLocationUpdate,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  const [coords, setCoords] = useState<LocationGeo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showCompetitors, setShowCompetitors] = useState<boolean>(true);
  const [showAmenities, setShowAmenities] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Dynamic Leaflet CSS Injection to guarantee proper icon & tile styling
  useEffect(() => {
    const leafletCssId = "leaflet-stylesheet-cdn";
    if (!document.getElementById(leafletCssId)) {
      const link = document.createElement("link");
      link.id = leafletCssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }
  }, []);

  // Geocode location whenever locationStr changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadCoords() {
      if (!locationStr) {
        if (isMounted) {
          setCoords({ lat: 28.6139, lon: 77.209, displayName: "New Delhi, India" });
          setLoading(false);
        }
        return;
      }

      const result = await geocodeLocation(locationStr);
      if (isMounted) {
        if (result) {
          setCoords(result);
        } else {
          // Fallback coordinates based on string hash to prevent map failure
          const hash = locationStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const fallbackLat = 20.5937 + (hash % 10) * 0.5;
          const fallbackLon = 78.9629 + (hash % 15) * 0.5;
          setCoords({
            lat: fallbackLat,
            lon: fallbackLon,
            displayName: `${locationStr} (Estimated Region)`,
          });
        }
        setLoading(false);
      }
    }

    loadCoords();

    return () => {
      isMounted = false;
    };
  }, [locationStr]);

  // Initialize or re-render Leaflet Map on client-side
  useEffect(() => {
    if (typeof window === "undefined" || !coords || !mapContainerRef.current) return;
    const activeCoords = coords;

    let L: any;

    async function initLeaflet() {
      if (!activeCoords) return;
      L = (await import("leaflet")).default;

      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Cleanup existing map instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [activeCoords.lat, activeCoords.lon],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // Add OpenStreetMap Tile Layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Add Attribution Control bottom right cleanly
      L.control.attribution({ position: "bottomright" }).addTo(map);

      // Create 2 km Target Market Radius Circle
      circleRef.current = L.circle([activeCoords.lat, activeCoords.lon], {
        color: "#6366f1",
        fillColor: "#818cf8",
        fillOpacity: 0.15,
        radius: 2000,
        weight: 2,
        dashArray: "6, 8",
      }).addTo(map);

      // Group for all markers
      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;

      // 1. Primary Business Shop Marker (Gold & Violet Pill Icon)
      const shopIconHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute -inset-2 rounded-full bg-violet-600/30 animate-ping"></div>
          <div class="relative flex items-center justify-center size-10 rounded-full bg-gradient-to-tr from-violet-700 via-indigo-600 to-amber-400 text-white shadow-xl ring-4 ring-white border border-amber-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M10 12v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"/></svg>
          </div>
        </div>
      `;

      const shopIcon = L.divIcon({
        html: shopIconHtml,
        className: "custom-leaflet-shop-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const shopMarker = L.marker([activeCoords.lat, activeCoords.lon], { icon: shopIcon }).addTo(
        markersGroup,
      );

      shopMarker
        .bindPopup(
          `
        <div style="font-family: Inter, sans-serif; padding: 4px; max-width: 220px;">
          <div style="display: inline-block; background: #6366f1; color: white; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 12px; margin-bottom: 4px;">
            YOUR BUSINESS LOCATION
          </div>
          <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: #0f172a;">${idea}</h4>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">${categoryName}</p>
          <p style="margin: 6px 0 0 0; font-size: 11px; font-weight: 600; color: #334155;">📍 ${locationStr}</p>
        </div>
      `,
          { offset: [0, -10] },
        )
        .openPopup();

      // Helper to generate deterministic offsets around shop lat/lon
      const getOffsetPos = (index: number, total: number, radiusKm: number = 1.2) => {
        const angle = (index / total) * 2 * Math.PI + index * 0.7;
        const latOffset = Math.sin(angle) * radiusKm * 0.009;
        const lonOffset = Math.cos(angle) * radiusKm * 0.009;
        return [activeCoords.lat + latOffset, activeCoords.lon + lonOffset];
      };

      // 2. Add Competitor Pins (Red / Amber)
      if (showCompetitors && competitorCount > 0) {
        for (let i = 0; i < Math.min(competitorCount, 8); i++) {
          const [cLat, cLon] = getOffsetPos(i, Math.min(competitorCount, 8), 0.6 + i * 0.15);

          const compIconHtml = `
            <div class="flex items-center justify-center size-7 rounded-full bg-amber-500 text-white shadow-md ring-2 ring-white border border-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          `;

          const compIcon = L.divIcon({
            html: compIconHtml,
            className: "custom-leaflet-comp-marker",
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const compMarker = L.marker([cLat, cLon], { icon: compIcon }).addTo(markersGroup);
          compMarker.bindPopup(`
            <div style="font-family: Inter, sans-serif; padding: 4px;">
              <span style="background: #f59e0b; color: white; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 8px;">COMPETITOR #${i + 1}</span>
              <p style="margin: 4px 0 0 0; font-weight: 700; font-size: 12px; color: #1e293b;">Nearby ${categoryName}</p>
              <p style="margin: 2px 0 0 0; font-size: 10px; color: #64748b;">Within 2 km OpenStreetMap radius</p>
            </div>
          `);
        }
      }

      // 3. Add Amenity Pins (Banks / Stations / Markets)
      if (showAmenities) {
        // Banks / ATMs (Emerald)
        for (let i = 0; i < Math.min(banksCount, 4); i++) {
          const [bLat, bLon] = getOffsetPos(i + 10, 8, 1.4);
          const bankIconHtml = `
            <div class="flex items-center justify-center size-7 rounded-full bg-emerald-600 text-white shadow-md ring-2 ring-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7 12 2"/></svg>
            </div>
          `;
          const bankIcon = L.divIcon({
            html: bankIconHtml,
            className: "custom-leaflet-bank-marker",
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });
          const bMarker = L.marker([bLat, bLon], { icon: bankIcon }).addTo(markersGroup);
          bMarker.bindPopup(`
            <div style="font-family: Inter, sans-serif; padding: 4px;">
              <span style="background: #059669; color: white; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 8px;">FINANCIAL HUB</span>
              <p style="margin: 4px 0 0 0; font-weight: 700; font-size: 12px; color: #064e3b;">Bank / ATM Node #${i + 1}</p>
              <p style="margin: 2px 0 0 0; font-size: 10px; color: #64748b;">Useful for daily cash deposit & Mudra loan branch</p>
            </div>
          `);
        }

        // Transport Hubs (Blue)
        for (let i = 0; i < Math.min(transportCount, 4); i++) {
          const [tLat, tLon] = getOffsetPos(i + 20, 6, 0.9 + i * 0.2);
          const transIconHtml = `
            <div class="flex items-center justify-center size-7 rounded-full bg-blue-600 text-white shadow-md ring-2 ring-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4C2.9 6 1.9 6.8 1.6 7.8L.2 12.8c-.1.4-.2.8-.2 1.2 0 .4.1.8.2 1.2C.5 16.3 1 18 1 18h3"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>
            </div>
          `;
          const transIcon = L.divIcon({
            html: transIconHtml,
            className: "custom-leaflet-trans-marker",
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });
          const tMarker = L.marker([tLat, tLon], { icon: transIcon }).addTo(markersGroup);
          tMarker.bindPopup(`
            <div style="font-family: Inter, sans-serif; padding: 4px;">
              <span style="background: #2563eb; color: white; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 8px;">HIGH FOOTFALL TRANSIT</span>
              <p style="margin: 4px 0 0 0; font-weight: 700; font-size: 12px; color: #1e3a8a;">Bus / Transit Node #${i + 1}</p>
              <p style="margin: 2px 0 0 0; font-size: 10px; color: #64748b;">Drives peak morning & evening commuter traffic</p>
            </div>
          `);
        }
      }

      mapInstanceRef.current = map;
    }

    initLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [
    coords,
    showCompetitors,
    showAmenities,
    competitorCount,
    banksCount,
    transportCount,
    categoryName,
    idea,
    locationStr,
  ]);

  const handleRecenter = () => {
    if (mapInstanceRef.current && coords) {
      mapInstanceRef.current.flyTo([coords.lat, coords.lon], 14, { duration: 1.2 });
    }
  };

  const handleUseLiveGps = async () => {
    setIsLocating(true);
    try {
      const detected = await detectUserLocation();
      if (detected && onLocationUpdate) {
        onLocationUpdate(detected);
      }
    } catch (e) {
      console.warn("Location detection failed", e);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-900 transition-all duration-300 shadow-lg ${
        isFullscreen ? "fixed inset-4 z-50 h-[calc(100vh-2rem)]" : "h-[340px] w-full"
      }`}
    >
      {/* Top Floating Glass Bar */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 rounded-xl bg-slate-900/85 backdrop-blur-md px-3 py-1.5 border border-slate-700/60 shadow-md text-white">
          <MapPin size={14} className="text-amber-400 shrink-0" />
          <span className="text-xs font-semibold max-w-[180px] sm:max-w-[280px] truncate">
            {coords?.displayName || locationStr}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
            OpenStreetMap Live
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUseLiveGps}
            disabled={isLocating}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
            title="Detect My Live GPS Location"
          >
            <Compass size={14} className={isLocating ? "animate-spin" : ""} />
            <span className="hidden sm:inline">{isLocating ? "Locating..." : "Live GPS"}</span>
          </button>

          <button
            onClick={handleRecenter}
            className="rounded-xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md p-2 text-slate-200 border border-slate-700/60 shadow-md transition-all"
            title="Recenter Map on Business"
          >
            <Navigation size={14} />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md p-2 text-slate-200 border border-slate-700/60 shadow-md transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="h-full w-full bg-slate-100 z-10" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm text-white">
          <RefreshCw size={24} className="animate-spin text-indigo-400 mb-2" />
          <p className="text-xs font-semibold">Geocoding OpenStreetMap location...</p>
          <p className="text-[11px] text-slate-400">{locationStr}</p>
        </div>
      )}

      {/* Bottom Floating Legend Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-900/85 backdrop-blur-md px-3 py-1.5 border border-slate-700/60 shadow-md text-white text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-violet-500 ring-2 ring-violet-300"></span>
            <span className="font-medium text-slate-200">Your Shop</span>
          </div>

          <span className="text-slate-600">&bull;</span>

          <button
            onClick={() => setShowCompetitors(!showCompetitors)}
            className={`flex items-center gap-1.5 transition-opacity ${
              showCompetitors ? "opacity-100" : "opacity-40 line-through"
            }`}
          >
            <span className="size-2.5 rounded-full bg-amber-500"></span>
            <span className="font-medium text-amber-200">{competitorCount} Competitors</span>
          </button>

          <span className="text-slate-600">&bull;</span>

          <button
            onClick={() => setShowAmenities(!showAmenities)}
            className={`flex items-center gap-1.5 transition-opacity ${
              showAmenities ? "opacity-100" : "opacity-40 line-through"
            }`}
          >
            <span className="size-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-emerald-200">{banksCount} Banks</span>
          </button>

          <span className="text-slate-600">&bull;</span>

          <span className="text-blue-300 font-medium">{transportCount} Transit Hubs</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 rounded-xl bg-indigo-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-indigo-300 border border-indigo-700/50">
          ⭕ 2 km Radius Footfall Zone
        </div>
      </div>
    </div>
  );
};

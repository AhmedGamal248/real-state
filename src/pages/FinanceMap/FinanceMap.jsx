import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";


import "leaflet-draw";
import "./FinanceMap.css";
import PropertyCard from "../../components/UI/PropertyCard/PropertyCard";
import * as turf from "@turf/turf";

const { BaseLayer } = LayersControl;

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://static.vecteezy.com/system/resources/previews/016/314/735/original/home-icon-free-png.png",
  iconRetinaUrl: "https://cdn-icons-png.flaticon.com/512/619/619034.png",
  shadowUrl: "",
  iconSize: [35, 35],
  iconAnchor: [20, 35],
});

// ── Types ──
// Property type annotations were removed for pure JSX.

// ── Map controller – captures map instance (replaces whenCreated) ──
function MapController({ setMapInstance }) {
  const map = useMap();
  useEffect(() => {
    setMapInstance(map);
  }, [map]);
  return null;
}

// ── Zoom to selected marker ──
function ZoomToLocation({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 18, { duration: 1 });
  }, [lat, lng]);
  return null;
}

// ── Draw polygon / rectangle and filter properties ──
function DrawControl({
  setFilteredByDraw,
  setHasFiltered,
  setPolygonDrawn,
  properties,
  clearDrawRef,
}) {
  const map = useMap();

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    clearDrawRef.current = () => drawnItems.clearLayers();

    const drawControl = new L.Control.Draw({
      edit: { featureGroup: drawnItems },
      draw: {
        rectangle: true,
        polygon: true,
        circle: false,
        marker: false,
        polyline: false,
      },
    });
    map.addControl(drawControl);

    const handleCreated = (event) => {
      drawnItems.clearLayers();
      const layer = event.layer;
      drawnItems.addLayer(layer);
      const drawnGeo = layer.toGeoJSON();
      const results = properties.filter((p) =>
        turf.booleanPointInPolygon(turf.point([p.lng, p.lat]), drawnGeo),
      );
      setFilteredByDraw(results);
      setPolygonDrawn(true);
      setHasFiltered(true);
    };

    map.on(L.Draw.Event.CREATED, handleCreated);
    return () => {
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.removeControl(drawControl);
    };
  }, [map, properties]);

  return null;
}
function FullscreenControl() {
  const map = useMap();
  useEffect(() => {
    const FullscreenBtn = L.Control.extend({
      onAdd() {
        const btn = L.DomUtil.create("button", "leaflet-bar leaflet-control");
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        btn.title = "تكبير الشاشة";
        btn.style.cssText = "width:30px;height:30px;cursor:pointer;background:#fff;border:none;display:flex;align-items:center;justify-content:center;";
        L.DomEvent.on(btn, "click", (e) => {
          L.DomEvent.stopPropagation(e);
          const container = map.getContainer();
          if (!document.fullscreenElement) {
            container.requestFullscreen();
            btn.title = "تصغير الشاشة";
            btn.style.background = "#f0f9ff";
          } else {
            document.exitFullscreen();
            btn.title = "تكبير الشاشة";
            btn.style.background = "#fff";
          }
        });
        return btn;
      },
      onRemove() {},
    });
    const ctrl = new FullscreenBtn({ position: "topleft" });
    ctrl.addTo(map);
    return () => ctrl.remove();
  }, [map]);
  return null;
}
// ── FitBounds ──
function FitBounds({ data, selected, isUserZooming }) {
  const map = useMap();
  const prevRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;
    if (selected) return;
    if (isUserZooming) return;
    if (JSON.stringify(prevRef.current) === JSON.stringify(data)) return;
    prevRef.current = data;
    const bounds = L.latLngBounds(data.map((p) => [p.lat, p.lng]));
    map.flyToBounds(bounds, { padding: [50, 50], duration: 1 });
  }, [data, selected, isUserZooming]);

  return null;
}

// ── Custom person icon ──
const personIcon = L.divIcon({
  html: `<div style="
    font-size:46px;line-height:1;
    filter:drop-shadow(0 4px 8px rgba(0,0,0,0.55));
    animation:person-bounce 1.4s ease-in-out infinite;
  ">🧍</div>`,
  className: "",
  iconSize: [50, 56],
  iconAnchor: [25, 56],
  popupAnchor: [0, -56],
});

// ── Property data ──
// الشقق id 7-10 مضافة بالقرب من مركز القاهرة (30.0444, 31.2357) داخل 500م

const properties = [
  {
    id: 1,
    gov: "القاهرة",
    center: "مدينة نصر",
    areaName: "عباس العقاد",
    name: "مدينة نصر",
    title: "شقة بمدينة نصر - عباس العقاد",
    address: "شارع عباس العقاد",
    area: 220,
    finishing: "تشطيب كامل",
    utilities: "كاملة",
    price: 1250000,
    lat: 30.056,
    lng: 31.337,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
    ],
    video: "https://www.youtube.com/embed/iqlohXTD6Zs",
  },

  {
    id: 2,
    gov: "القاهرة",
    center: "التجمع الخامس",
    areaName: "شارع التسعين",
    name: "التجمع الخامس",
    title: "شقة بالتجمع الخامس - شارع التسعين",
    address: "التسعين الشمالي",
    area: 160,
    finishing: "نصف تشطيب",
    utilities: "كاملة",
    price: 2100000,
    lat: 30.028,
    lng: 31.47,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    ],
    video: null,
  },

  {
    id: 3,
    gov: "القاهرة",
    center: "التجمع الخامس",
    areaName: "بيت الوطن",
    name: "التجمع الخامس",
    title: "شقة ببيت الوطن - التجمع",
    address: "حي بيت الوطن",
    area: 180,
    finishing: "تشطيب كامل",
    utilities: "كاملة",
    price: 2600000,
    lat: 30.032,
    lng: 31.48,
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
    video: null,
  },

  {
    id: 4,
    gov: "القاهرة",
    center: "التجمع الخامس",
    areaName: "اللوتس",
    name: "التجمع الخامس",
    title: "شقة في اللوتس - التجمع",
    address: "حي اللوتس",
    area: 140,
    finishing: "نصف تشطيب",
    utilities: "كاملة",
    price: 1950000,
    lat: 30.025,
    lng: 31.46,
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7"],
    video: null,
  },

  {
    id: 5,
    gov: "الجيزة",
    center: "الدقي",
    areaName: "شارع التحرير",
    name: "الدقي",
    title: "شقة بالدقي - شارع التحرير",
    address: "شارع التحرير",
    area: 130,
    finishing: "تشطيب متوسط",
    utilities: "كاملة",
    price: 1550000,
    lat: 30.038,
    lng: 31.21,
    images: ["https://images.unsplash.com/photo-1560448204-603b3fc33ddc"],
    video: null,
  },

  {
    id: 6,
    gov: "الإسكندرية",
    center: "سموحة",
    areaName: "شارع فوزي معاذ",
    name: "سموحة",
    title: "شقة في سموحة - فوزي معاذ",
    address: "شارع فوزي معاذ",
    area: 180,
    finishing: "تشطيب سوبر لوكس",
    utilities: "كاملة",
    price: 2500000,
    lat: 31.2156,
    lng: 29.9553,
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
    video: null,
  },

  {
    id: 7,
    gov: "الإسكندرية",
    center: "سيدي جابر",
    areaName: "شارع المشير",
    name: "سيدي جابر",
    title: "شقة بسيدي جابر",
    address: "شارع المشير",
    area: 145,
    finishing: "نصف تشطيب",
    utilities: "كاملة",
    price: 1850000,
    lat: 31.205,
    lng: 29.942,
    images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be"],
    video: null,
  },

  {
    id: 8,
    gov: "الإسكندرية",
    center: "ميامي",
    areaName: "كورنيش الإسكندرية",
    name: "ميامي",
    title: "شقة على البحر - ميامي",
    address: "كورنيش ميامي",
    area: 200,
    finishing: "تشطيب كامل",
    utilities: "كاملة",
    price: 3200000,
    lat: 31.239,
    lng: 29.968,
    images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511"],
    video: null,
  },

  // حلوان (قريبة من بعض لكن مختلفة فعلاً)
  {
    id: 9,
    gov: "القاهرة",
    center: "حلوان",
    areaName: "كورنيش النيل",
    name: "حلوان",
    title: "شقة بحلوان - كورنيش النيل",
    address: "كورنيش النيل",
    area: 120,
    finishing: "تشطيب كامل",
    utilities: "كاملة",
    price: 950000,
    lat: 29.899,
    lng: 31.298,
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7"],
    video: null,
  },

  {
    id: 10,
    gov: "القاهرة",
    center: "حلوان",
    areaName: "شارع الحرية",
    name: "حلوان",
    title: "شقة بحلوان - شارع الحرية",
    address: "شارع الحرية",
    area: 95,
    finishing: "نصف تشطيب",
    utilities: "كاملة",
    price: 780000,
    lat: 29.896,
    lng: 31.296,
    images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb"],
    video: null,
  },

  {
    id: 11,
    gov: "القاهرة",
    center: "حلوان",
    areaName: "شارع الصناعة",
    name: "حلوان",
    title: "شقة بحلوان - شارع الصناعة",
    address: "شارع الصناعة",
    area: 160,
    finishing: "تشطيب سوبر لوكس",
    utilities: "كاملة",
    price: 1350000,
    lat: 29.9,
    lng: 31.295,
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
    video: null,
  },
  {
    id: 12,
    gov: "القاهرة",
    center: "التجمع الخامس",
    areaName: "شارع التسعين1",
    name: "التجمع الخامس",
    title: "شقة بالتجمع الخامس - شارع التسعين1",
    address: "التسعين الشمالي",
    area: 150,
    finishing: "سوبر لوكس",
    utilities: "كاملة",
    price: 5000000,
    lat: 30.02909869912692,
    lng: 31.464569314799622,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    ],
    video: null,
  },
  {
    id: 13,
    gov: "القاهرة",
    center: "التجمع الخامس",
    areaName: "2شارع التسعين",
    name: "التجمع الخامس",
    title: "شقة بالتجمع الخامس - شارع التسعين2",
    address: "التسعين الشمالي",
    area: 120,
    finishing: "سوبر لوكس",
    utilities: "كاملة",
    price: 4000000,
    lat: 30.031518380835916,
    lng: 31.457531198420472,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    ],
    video: null,
  },
  {
    id: 14,
    gov: "القاهرة",
    center: "التجمع الخامس",
    areaName: "3شارع التسعين",
    name: "التجمع الخامس",
    title: "شقة بالتجمع الخامس - شارع التسعين3",
    address: "التسعين الشمالي",
    area: 150,
    finishing: "سوبر لوكس",
    utilities: "كاملة",
    price: 7000000,
    lat: 30.027984046605617,
    lng: 31.457745775139347,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    ],
    video: null,
  },
];

const locations = {
  القاهرة: {
    "مدينة نصر": ["عباس العقاد", "مكرم عبيد"],
    التجمع: ["التجمع الخامس", "التجمع الأول"],
    حلوان: ["حلوان"],
  },
  الجيزة: {
    الدقي: ["شارع التحرير", "البحوث"],
    المهندسين: ["جامعة الدول", "العجوزة"],
  },
  الإسكندرية: {
    سموحة: ["شارع فوزي معاذ", "شارع أبو قير"],
    "سيدي جابر": ["شارع المشير", "شارع جمال عبد الناصر"],
  },
};

// ── Main Component ──
export default function FinanceMap() {
  const [gov, setGov] = useState("");
  const [center, setCenter] = useState("");
  const [area, setArea] = useState("");
  const [selected, setSelected] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filteredByDraw, setFilteredByDraw] = useState([]);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [polygonDrawn, setPolygonDrawn] = useState(false);
  const [drawBtnText, setDrawBtnText] = useState("🟦 استعلام مكاني");
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  const [isUserZooming, setIsUserZooming] = useState(false);
  const [popupPos, setPopupPos] = useState(null);

  // Price filter state
  const PRICE_MIN = Math.min(...properties.map((p) => p.price));
  const PRICE_MAX = Math.max(...properties.map((p) => p.price));
  const [priceMin, setPriceMin] = useState(PRICE_MIN);
  const [priceMax, setPriceMax] = useState(PRICE_MAX);
  const [priceFilterActive, setPriceFilterActive] = useState(false);
  const [showPricePanel, setShowPricePanel] = useState(false);
  const sliderTrackRef = useRef(null);

  // Area (sqm) filter state
  const AREA_MIN = Math.min(
    ...properties.filter((p) => p.area).map((p) => p.area),
  );
  const AREA_MAX = Math.max(
    ...properties.filter((p) => p.area).map((p) => p.area),
  );
  const [areaMin, setAreaMin] = useState(AREA_MIN);
  const [areaMax, setAreaMax] = useState(AREA_MAX);
  const [areaFilterActive, setAreaFilterActive] = useState(false);
  const [showAreaPanel, setShowAreaPanel] = useState(false);
  const areaSliderTrackRef = useRef(null);

  // Mobile collapse – open by default on desktop, closed on mobile
  const [filtersOpen, setFiltersOpen] = useState(() => window.innerWidth > 700);

  const mapRef = useRef(null);
  const clearDrawRef = useRef(null);
  const popupRef = useRef(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handlePopupDragStart = (e) => {
    e.preventDefault();
    const popup = popupRef.current;
    const container = mapRef.current;
    if (!popup || !container) return;

    const rect = popup.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const startLeft = rect.left - containerRect.left;
    const startTop = rect.top - containerRect.top;

    isDragging.current = true;
    dragOffset.current = { x: e.clientX - startLeft, y: e.clientY - startTop };

    const onMove = (ev) => {
      if (!isDragging.current || !container) return;
      const cr = container.getBoundingClientRect();
      const newLeft = Math.max(
        0,
        Math.min(ev.clientX - dragOffset.current.x, cr.width - rect.width),
      );
      const newTop = Math.max(
        0,
        Math.min(ev.clientY - dragOffset.current.y, cr.height - 60),
      );
      setPopupPos({ left: newLeft, top: newTop });
    };

    const onUp = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  useEffect(() => {
    if (!isUserZooming) return;
    const t = setTimeout(() => setIsUserZooming(false), 3000);
    return () => clearTimeout(t);
  }, [isUserZooming]);

  // Fit bounds after user location set
  useEffect(() => {
    if (!userLocation || !mapInstance) return;
    const points = nearbyProperties.map((p) => [p.lat, p.lng]);
    setTimeout(() => {
      if (points.length === 0) {
        mapInstance.setView(L.latLng(userLocation[0], userLocation[1]), 17);
      } else {
        const bounds = L.latLngBounds([userLocation, ...points]);
        mapInstance.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 17,
          duration: 1,
        });
      }
    }, 100);
  }, [userLocation, nearbyProperties, mapInstance]);

  const handleDrawBtnClick = () => {
    setDrawMode((d) => {
      const next = !d;
      setDrawBtnText(next ? "❌ إلغاء الاستعلام المكاني" : "🟦 استعلام مكاني");
      return next;
    });
  };

  const findNearby = (loc) => {
    setUserLocation(loc);
    setIsUserZooming(true);
    const nearby = properties.filter((p) => {
      const dist = turf.distance(
        turf.point([loc[1], loc[0]]),
        turf.point([p.lng, p.lat]),
        { units: "meters" },
      );
      return dist <= 500;
    });
    setNearbyProperties(nearby);
  };

  const handleUserLocationZoom = () => {
    if (!navigator.geolocation) return alert("المتصفح لا يدعم تحديد الموقع");
    navigator.geolocation.getCurrentPosition(
      (pos) => findNearby([pos.coords.latitude, pos.coords.longitude]),
      () => alert("تعذر الحصول على الموقع الحالي"),
    );
  };

  // Filtered results
  const filteredProperties = properties.filter(
    (p) =>
      (gov === "ALL" || !gov || p.gov === gov) &&
      (!center || p.center === center) &&
      (!area || p.areaName === area) &&
      (!priceFilterActive || (p.price >= priceMin && p.price <= priceMax)) &&
      (!areaFilterActive ||
        !p.area ||
        (p.area >= areaMin && p.area <= areaMax)),
  );

  const displayProperties = (() => {
    if (drawMode) {
      // في وضع الرسم: لا نعرض شيئاً قبل رسم الـ polygon
      if (!polygonDrawn) return [];
      // بعد الرسم: نعرض فقط النقاط داخل الـ polygon (ولو فارغة يرجع [])
      const drawIds = new Set(filteredByDraw.map((p) => p.id));
      return filteredProperties.filter((p) => drawIds.has(p.id));
    }
    // وضع الفلاتر العادية
    if (hasFiltered) return filteredProperties;
    return [];
  })();

  const allDisplayed = [
    ...new Map(
      [...displayProperties, ...nearbyProperties].map((p) => [p.id, p]),
    ).values(),
  ];

  const toggleFullscreen = () => {
    const el = mapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
  };

  // Price histogram data
  const PRICE_BUCKETS = 10;
  const priceBucketSize = (PRICE_MAX - PRICE_MIN) / PRICE_BUCKETS;
  const priceHistogram = Array.from({ length: PRICE_BUCKETS }, (_, i) => {
    const lo = PRICE_MIN + i * priceBucketSize;
    const hi = lo + priceBucketSize;
    return properties.filter(
      (p) =>
        p.price >= lo &&
        (i === PRICE_BUCKETS - 1 ? p.price <= hi : p.price < hi),
    ).length;
  });
  const priceHistMax = Math.max(...priceHistogram, 1);

  // Area histogram data
  const AREA_BUCKETS = 8;
  const areaBucketSize = (AREA_MAX - AREA_MIN) / AREA_BUCKETS;
  const areaHistogram = Array.from({ length: AREA_BUCKETS }, (_, i) => {
    const lo = AREA_MIN + i * areaBucketSize;
    const hi = lo + areaBucketSize;
    return properties.filter(
      (p) =>
        p.area &&
        p.area >= lo &&
        (i === AREA_BUCKETS - 1 ? p.area <= hi : p.area < hi),
    ).length;
  });
  const areaHistMax = Math.max(...areaHistogram, 1);

  const applyPriceFilter = () => {
    setPriceFilterActive(true);
    setHasFiltered(true);
    setShowPricePanel(false);
  };
  const resetPriceFilter = () => {
    setPriceMin(PRICE_MIN);
    setPriceMax(PRICE_MAX);
    setPriceFilterActive(false);
  };

  const applyAreaFilter = () => {
    setAreaFilterActive(true);
    setHasFiltered(true);
    setShowAreaPanel(false);
  };
  const resetAreaFilter = () => {
    setAreaMin(AREA_MIN);
    setAreaMax(AREA_MAX);
    setAreaFilterActive(false);
  };

  const makeDragHandler =
    (
      handle,
      setMin,
      setMax,
      minVal,
      maxVal,
      globalMin,
      globalMax,
      trackRef,
      step = 10000,
    ) =>
    (e) => {
      e.preventDefault();
      const onMove = (ev) => {
        const track = trackRef.current;
        if (!track) return;
        const clientX = ev.clientX ?? ev.touches?.[0]?.clientX;
        const { left, width } = track.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (clientX - left) / width));
        const value =
          Math.round((globalMin + ratio * (globalMax - globalMin)) / step) *
          step;
        if (handle === "min") setMin(Math.min(value, maxVal - step));
        else setMax(Math.max(value, minVal + step));
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onUp);
    };

  const startPriceDrag = (h) =>
    makeDragHandler(
      h,
      setPriceMin,
      setPriceMax,
      priceMin,
      priceMax,
      PRICE_MIN,
      PRICE_MAX,
      sliderTrackRef,
      50000,
    );
  const startAreaDrag = (h) =>
    makeDragHandler(
      h,
      setAreaMin,
      setAreaMax,
      areaMin,
      areaMax,
      AREA_MIN,
      AREA_MAX,
      areaSliderTrackRef,
      5,
    );

  const pMinPct = ((priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const pMaxPct = ((priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const aMinPct = ((areaMin - AREA_MIN) / (AREA_MAX - AREA_MIN)) * 100;
  const aMaxPct = ((areaMax - AREA_MIN) / (AREA_MAX - AREA_MIN)) * 100;

  const activeFiltersCount = [
    gov,
    center,
    area,
    priceFilterActive,
    areaFilterActive,
    userLocation,
  ].filter(Boolean).length;

  // Close panels on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".filter-pill-popup")) {
        setShowPricePanel(false);
        setShowAreaPanel(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const RangePanel = ({
    title,
    icon,
    histogram,
    histMax,
    globalMin,
    globalMax,
    curMin,
    curMax,
    setCurMin,
    setCurMax,
    startMinDrag,
    startMaxDrag,
    trackRef,
    minPct,
    maxPct,
    onApply,
    onCancel,
    step = 50000,
    formatVal = (v) => v.toLocaleString("ar-EG"),
    unitLabel = "جنيه",
    previewMsg,
  }) => {
    const count = previewMsg;
    return (
      <div className="filter-pill-popup range-panel">
        {/* Header */}
        <div className="rp-header">
          <span className="rp-icon">{icon}</span>
          <span className="rp-title">{title}</span>
        </div>

        {/* Histogram */}
        <div className="rp-histogram">
          {histogram.map((c, i) => {
            const lo =
              globalMin + i * ((globalMax - globalMin) / histogram.length);
            const hi = lo + (globalMax - globalMin) / histogram.length;
            const inRange = lo < curMax && hi > curMin;
            return (
              <div key={i} className="rp-hist-col">
                <div
                  className={`rp-hist-bar${inRange ? " active" : ""}`}
                  style={{ height: `${Math.max(8, (c / histMax) * 100)}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Slider */}
        <div className="rp-slider-wrap">
          <div className="rp-track" ref={trackRef}>
            <div
              className="rp-fill"
              style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
            />
            <div
              className="rp-thumb rp-thumb-min"
              style={{ left: `${minPct}%` }}
              onMouseDown={startMinDrag}
              onTouchStart={startMinDrag}
            >
              <div className="rp-bubble">{formatVal(curMin)}</div>
            </div>
            <div
              className="rp-thumb rp-thumb-max"
              style={{ left: `${maxPct}%` }}
              onMouseDown={startMaxDrag}
              onTouchStart={startMaxDrag}
            >
              <div className="rp-bubble">{formatVal(curMax)}</div>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="rp-inputs">
          <div className="rp-input-block">
            <label className="rp-input-label">الحد الأدنى</label>
            <div className="rp-input-field">
              <input
                type="number"
                value={curMin}
                step={step}
                min={globalMin}
                max={curMax - step}
                onChange={(e) =>
                  setCurMin(Math.min(+e.target.value, curMax - step))
                }
              />
              <span className="rp-input-unit">{unitLabel}</span>
            </div>
          </div>
          <div className="rp-input-sep">
            <div className="rp-sep-line" />
          </div>
          <div className="rp-input-block">
            <label className="rp-input-label">الحد الأقصى</label>
            <div className="rp-input-field">
              <input
                type="number"
                value={curMax}
                step={step}
                min={curMin + step}
                max={globalMax}
                onChange={(e) =>
                  setCurMax(Math.max(+e.target.value, curMin + step))
                }
              />
              <span className="rp-input-unit">{unitLabel}</span>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className={`rp-preview ${count > 0 ? "found" : "empty"}`}>
          {count > 0 ? (
            <>
              <span className="rp-dot green" /> {count} عقار متاح في هذا النطاق
            </>
          ) : (
            <>
              <span className="rp-dot amber" /> لا يوجد عقارات في هذا النطاق
            </>
          )}
        </div>

        {/* Actions */}
        <div className="rp-actions">
          <button className="rp-btn-cancel" onClick={onCancel}>
            إلغاء
          </button>
          <button
            className="rp-btn-apply"
            onClick={onApply}
            disabled={count === 0}
          >
            تطبيق
          </button>
        </div>
      </div>
    );
  };

  const pricePreviewCount = properties.filter(
    (p) => p.price >= priceMin && p.price <= priceMax,
  ).length;
  const areaPreviewCount = properties.filter(
    (p) => !p.area || (p.area >= areaMin && p.area <= areaMax),
  ).length;
  const displayedResultsCount = allDisplayed.length;
  const locationSummary =
    gov === "ALL"
      ? "جميع المحافظات"
      : [area, center, gov].filter(Boolean).join(" / ") ||
        "ابحث حسب الموقع والسعر والمساحة";

  return (
    <div className="finance-page" ref={mapRef}>
      

      {/* Results popup - يظهر عند وجود نتائج أو عند رسم polygon فارضة */}
      {(allDisplayed.length > 0 || (drawMode && polygonDrawn)) && (
        <div
          className="results-popup"
          ref={popupRef}
          style={
            popupPos
              ? { top: popupPos.top, left: popupPos.left, right: "unset" }
              : undefined
          }
        >
          <div
            className="popup-drag-handle"
            onMouseDown={handlePopupDragStart}
            title="اسحب لتحريك الجدول"
          >
            <span className="drag-dots">⠿</span>
            <h3 className="popup-title" style={{ margin: 0 }}>
              {allDisplayed.length > 0
                ? `نتائج البحث (${allDisplayed.length})`
                : "نتائج البحث"}
              {nearbyProperties.length > 0 && (
                <span
                  className="nearby-badge"
                  style={{ marginRight: 8, fontSize: 11 }}
                >
                  {nearbyProperties.length} قريب منك
                </span>
              )}
            </h3>
            <span className="drag-dots">⠿</span>
          </div>

          {allDisplayed.length === 0 ? (
            <div className="no-results">
              <span>🏠</span>
              <p>لا يوجد عقارات في هذه المنطقة</p>
            </div>
          ) : (
            <table className="results-table">
              <thead>
                <tr>
                  <th>المنطقة</th>
                  <th>السعر</th>
                  <th>المساحة</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {allDisplayed.map((p) => {
                  const isNearby = nearbyProperties.some((n) => n.id === p.id);
                  return (
                    <tr
                      key={p.id}
                      style={
                        isNearby ? { background: "rgba(16,185,129,0.07)" } : {}
                      }
                    >
                      <td>
                        {isNearby && (
                          <span className="nearby-badge">📍قريب</span>
                        )}
                        {p.name}
                      </td>
                      <td className="price">
                        {p.price.toLocaleString("ar-EG")}جنيه
                      </td>

                      <td className="area">
                        {p.area ? `${p.area} م²` : "غير محددة"}
                      </td>
                      <td>
                        <button
                          className="zoomBtn"
                          onClick={() => setSelected(p)}
                        >
                          عرض
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Map */}
  




      <MapContainer
        center={[30.0444, 31.2357]}
        zoom={10}
        className="map-container"
      >
        <MapController setMapInstance={setMapInstance} />
        <FullscreenControl pageRef={mapRef} />
        <LayersControl position="topright">
          <BaseLayer checked name="Satellite">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </BaseLayer>
          <BaseLayer name="OpenStreetMap">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </BaseLayer>
        </LayersControl>
        {/* ══ Filters Bar ══ */}
      <div
        className={`filters${filtersOpen ? " filters--closed" :  " filters--open"}`}
      >
        {/* ── Collapsible header (always visible) ── */}
        <div
          className="filters-top"
          onClick={() => setFiltersOpen((v) => !v)}
          style={{ cursor: "pointer" }}
        >
          <div className="filters-heading">
            <span className="filters-kicker">لوحة البحث الذكية</span>
            <strong className="filters-title">
              اختيار أسرع للعقار المناسب
            </strong>
            <p className="filters-summary" onClick={(e) => e.stopPropagation()}>
              {locationSummary}
            </p>
          </div>

          <div className="filters-top-end">
            {/* Toggle chevron */}
            <button
              className="filters-toggle-btn"
              onClick={(e) => {
                e.stopPropagation();
                setFiltersOpen((v) => !v);
              }}
              aria-label={filtersOpen ? "إخفاء الفلاتر" : "عرض الفلاتر"}
            >
              <svg
                className={`filters-toggle-chevron${filtersOpen ? " filters-toggle-chevron--open" : ""}`}
                viewBox="0 0 10 6"
                fill="none"
                width="14"
                height="14"
              >
                <path
                  d="M1 1l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="filters-status">
              <div className="filters-status-chip">
                <span className="filters-status-value">
                  {displayedResultsCount}
                </span>
                <span className="filters-status-label">نتيجة ظاهرة</span>
              </div>
              <div className="filters-status-chip">
                <span className="filters-status-value">
                  {activeFiltersCount}
                </span>
                <span className="filters-status-label">فلتر نشط</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Collapsible body ── */}
        <div className="filters-body">
          <div className="filters-toolbar">
            {/* Brand chip */}
            <div className="filter-brand">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>عقارات</span>
            </div>

            <div className="filter-sep" />

            {/* ── المحافظة / المركز / الشياخة ── */}
            <div className="filter-pill-group">
              <span className="fpg-label">📍 الموقع</span>
              <div className="fpg-controls">
                <div className="fp-select-wrap">
                  <select
                    className="fp-select"
                    value={gov}
                    onChange={(e) => {
                      setGov(e.target.value);
                      setCenter("");
                      setArea("");
                      setHasFiltered(true);
                      setSelected(null);
                    }}
                  >
                    <option value="">المحافظة</option>
                    {Object.keys(locations).map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                    <option value="ALL">الكل</option>
                  </select>
                </div>
                <div className="fp-select-wrap">
                  <select
                    className="fp-select"
                    value={center}
                    onChange={(e) => {
                      setCenter(e.target.value);
                      setArea("");
                      setHasFiltered(true);
                      setSelected(null);
                    }}
                  >
                    <option value="">المركز</option>
                    {gov &&
                      locations[gov] &&
                      Object.keys(locations[gov]).map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                  </select>
                </div>
                <div className="fp-select-wrap">
                  <select
                    className="fp-select"
                    value={area}
                    onChange={(e) => {
                      setArea(e.target.value);
                      setHasFiltered(true);
                      setSelected(null);
                    }}
                  >
                    <option value="">الشياخة</option>
                    {gov &&
                      center &&
                      locations[gov]?.[center]?.map((a) => (
                        <option key={a}>{a}</option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="filter-sep" />

            {/* ── السعر ── */}
            <div className="filter-pill-group" style={{ position: "relative" }}>
              <span className="fpg-label">💰 السعر</span>
              <div className="fpg-controls">
                <button
                  className={`fp-pill-btn${priceFilterActive ? " fp-pill-active" : ""}${showPricePanel ? " fp-pill-open" : ""}`}
                  onClick={() => {
                    setShowPricePanel((v) => !v);
                    setShowAreaPanel(false);
                  }}
                >
                  <span className="fp-pill-icon">💰</span>
                  <span className="fp-pill-label">
                    {priceFilterActive
                      ? `${(priceMin / 1000000).toFixed(1)}م — ${(priceMax / 1000000).toFixed(1)}م`
                      : "نطاق السعر"}
                  </span>
                  {priceFilterActive ? (
                    <span
                      className="fp-pill-clear"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        resetPriceFilter();
                      }}
                    >
                      ✕
                    </span>
                  ) : (
                    <svg
                      className="fp-pill-chevron"
                      viewBox="0 0 10 6"
                      fill="none"
                    >
                      <path
                        d="M1 1l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>

                {showPricePanel && (
                  <RangePanel
                    title="نطاق السعر"
                    icon="💰"
                    histogram={priceHistogram}
                    histMax={priceHistMax}
                    globalMin={PRICE_MIN}
                    globalMax={PRICE_MAX}
                    curMin={priceMin}
                    curMax={priceMax}
                    setCurMin={setPriceMin}
                    setCurMax={setPriceMax}
                    startMinDrag={startPriceDrag("min")}
                    startMaxDrag={startPriceDrag("max")}
                    trackRef={sliderTrackRef}
                    minPct={pMinPct}
                    maxPct={pMaxPct}
                    onApply={applyPriceFilter}
                    onCancel={() => setShowPricePanel(false)}
                    step={50000}
                    formatVal={(v) => `${(v / 1000000).toFixed(2)}م`}
                    unitLabel="جنيه"
                    previewMsg={pricePreviewCount}
                  />
                )}
              </div>
            </div>

            <div className="filter-sep" />

            {/* ── المساحة ── */}
            <div className="filter-pill-group" style={{ position: "relative" }}>
              <span className="fpg-label">📐 المساحة</span>
              <div className="fpg-controls">
                <button
                  className={`fp-pill-btn${areaFilterActive ? " fp-pill-active fp-pill-area" : ""}${showAreaPanel ? " fp-pill-open" : ""}`}
                  onClick={() => {
                    setShowAreaPanel((v) => !v);
                    setShowPricePanel(false);
                  }}
                >
                  <span className="fp-pill-icon">📐</span>
                  <span className="fp-pill-label">
                    {areaFilterActive
                      ? `${areaMin} — ${areaMax} م²`
                      : "نطاق المساحة"}
                  </span>
                  {areaFilterActive ? (
                    <span
                      className="fp-pill-clear"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        resetAreaFilter();
                      }}
                    >
                      ✕
                    </span>
                  ) : (
                    <svg
                      className="fp-pill-chevron"
                      viewBox="0 0 10 6"
                      fill="none"
                    >
                      <path
                        d="M1 1l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>

                {showAreaPanel && (
                  <RangePanel
                    title="نطاق المساحة"
                    icon="📐"
                    histogram={areaHistogram}
                    histMax={areaHistMax}
                    globalMin={AREA_MIN}
                    globalMax={AREA_MAX}
                    curMin={areaMin}
                    curMax={areaMax}
                    setCurMin={setAreaMin}
                    setCurMax={setAreaMax}
                    startMinDrag={startAreaDrag("min")}
                    startMaxDrag={startAreaDrag("max")}
                    trackRef={areaSliderTrackRef}
                    minPct={aMinPct}
                    maxPct={aMaxPct}
                    onApply={applyAreaFilter}
                    onCancel={() => setShowAreaPanel(false)}
                    step={5}
                    formatVal={(v) => `${v} م²`}
                    unitLabel="م²"
                    previewMsg={areaPreviewCount}
                  />
                )}
              </div>
            </div>

            <div className="filter-sep" />

            {/* ── الموقع الجغرافي ── */}
            <div className="filter-pill-group">
              <span className="fpg-label">🧭 جغرافي</span>
              <div className="fpg-controls">
                <button
                  className={`fp-pill-btn fp-geo-btn${userLocation ? " fp-pill-active" : ""}`}
                  onClick={handleUserLocationZoom}
                >
                  <span className="fp-pill-icon">🧭</span>
                  <span className="fp-pill-label">موقعي</span>
                </button>
                <button
                  className={`fp-pill-btn fp-geo-btn${drawMode ? " fp-pill-draw" : ""}`}
                  onClick={handleDrawBtnClick}
                  title={drawBtnText}
                  aria-label={drawBtnText}
                >
                  <span className="fp-pill-icon">{drawMode ? "❌" : "🟦"}</span>
                  <span className="fp-pill-label">
                    {drawMode ? "إلغاء" : "استعلام"}
                  </span>
                </button>
              </div>
            </div>

            <div className="filter-sep" />

            {/* ── إلغاء الكل ── */}
            <button
              className="fp-reset-btn"
              onClick={() => {
                setFilteredByDraw([]);
                setHasFiltered(false);
                setPolygonDrawn(false);
                setDrawMode(false);
                setDrawBtnText("🟦 استعلام مكاني");
                setGov("");
                setCenter("");
                setArea("");
                setUserLocation(null);
                setNearbyProperties([]);
                setPopupPos(null);
                setPriceMin(PRICE_MIN);
                setPriceMax(PRICE_MAX);
                setPriceFilterActive(false);
                setShowPricePanel(false);
                setAreaMin(AREA_MIN);
                setAreaMax(AREA_MAX);
                setAreaFilterActive(false);
                setShowAreaPanel(false);
                if (clearDrawRef.current) clearDrawRef.current();
                if (mapInstance)
                  mapInstance.flyTo([30.0444, 31.2357], 10, { duration: 1 });
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
              </svg>
              مسح الكل
              {activeFiltersCount > 0 && (
                <span className="fp-reset-badge">{activeFiltersCount}</span>
              )}
            </button>
          </div>
        </div>
        {/* end filters-body */}
      </div>

        {/* Property markers */}
        {allDisplayed.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            eventHandlers={{ click: () => setSelectedProperty(p) }}
          >
            <Popup>
              <strong>{p.name}</strong>
              <br />
              السعر: {p.price.toLocaleString("ar-EG")} جنيه
            </Popup>
          </Marker>
        ))}

        {/* User location */}
        {userLocation && (
          <>
            <Marker position={userLocation} icon={personIcon}>
              <Popup>
                <div
                  style={{
                    textAlign: "center",
                    fontFamily: "Tajawal, sans-serif",
                    direction: "rtl",
                  }}
                >
                  <strong>📍 أنت هنا</strong>
                  <br />
                  <small style={{ color: "#64748b" }}>دائرة 500 متر حولك</small>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={userLocation}
              radius={500}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#000000",
                fillOpacity: 0.5,
                weight: 3,
              }}
            />
          </>
        )}

        {/* FitBounds */}
        {allDisplayed.length > 0 && (
          <FitBounds
            data={allDisplayed}
            selected={selected}
            isUserZooming={isUserZooming}
          />
        )}

        {selected && <ZoomToLocation lat={selected.lat} lng={selected.lng} />}

        {drawMode && (
          <DrawControl
            setFilteredByDraw={setFilteredByDraw}
            setHasFiltered={setHasFiltered}
            setPolygonDrawn={setPolygonDrawn}
            properties={properties}
            clearDrawRef={clearDrawRef}
          />
        )}
      </MapContainer>
      {/* Property Card Modal */}
      {selectedProperty && (
        <PropertyCard
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}

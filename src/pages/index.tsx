import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, MapPin, Wind, Sparkles } from "lucide-react";

/** Włącz lokalnie do edycji (przyciski, eksport JSON). Na produkcji ustaw false. */
const ENABLE_ADMIN = false;

/** ===== Typy ===== */
type Unit = {
  id: string;
  floor: number;          // nie musi być idealne – wyświetlanie i filtr opierają się na dfFromUnit
  number: string;         // np. "3.B.24" albo "Parter – rzut kondygnacji"
  rooms: number | null;   // null => rzut kondygnacji (garaż/parter)
  area: number | null;
  price: number | null;
  isAvailable: boolean;
  hasBalcony: boolean;
  orientation: string;
  planUrl: string;        // "/uploads/NAZWA.pdf"
};

/** ====== TUTAJ WKLEJASZ SWOJE UNITS ====== */
const UNITS: Unit[] = [
  // przykłady:
  // { id: "GARAZ_PLAN",  floor: 1, number: "Garaż – rzut kondygnacji", rooms: null, area: null, price: null, isAvailable: true, hasBalcony: false, orientation: "", planUrl: "/uploads/garaz.pdf" },
   { id: "PARTER_PLAN", floor: 2, number: "Parter – rzut kondygnacji", rooms: null, area: null, price: null, isAvailable: true, hasBalcony: false, orientation: "", planUrl: "/uploads/parter.pdf" },
  // { id: "A201", floor: 3, number: "2.A.1", rooms: 2, area: 50.57, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.A.1.pdf" },
{
    id: "GARAZ",
    floor: 1,
    number: "Garaż podziemny",
    rooms: null,
    area: null,
    price: null,
    isAvailable: true,
    hasBalcony: false,
    orientation: "",
    planUrl: "/uploads/0_-1.A.B.C.D_1-91.pdf",
  },
  { id: "A201", floor: 2, number: "2.A.1", rooms: 2, area: 50.57, price: 128800, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.A.1.pdf" },
  { id: "A202", floor: 2, number: "2.A.2", rooms: 2, area: 53.57, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.A.2.pdf" },
  { id: "A203", floor: 2, number: "2.A.3", rooms: 1, area: 30.47, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.A.3.pdf" },
  { id: "A204", floor: 2, number: "2.A.4", rooms: 3, area: 72.54, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/2.A.4.pdf" },
  { id: "A305", floor: 3, number: "3.A.5", rooms: 2, area: 50.57, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.A.5.pdf" },
  { id: "A306", floor: 3, number: "3.A.6", rooms: 2, area: 53.57, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.A.6.pdf" },
  { id: "A307", floor: 3, number: "3.A.7", rooms: 1, area: 30.47, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/3.A.7.pdf" },
  { id: "A308", floor: 3, number: "3.A.8", rooms: 3, area: 72.54, price: 121212, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/3.A.8.pdf" },
  { id: "A409", floor: 4, number: "4.A.9", rooms: 2, area: 50.57, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.A.9.pdf" },
  { id: "A410", floor: 4, number: "4.A.10", rooms: 2, area: 53.57, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/4.A.10.pdf" },
  { id: "A411", floor: 4, number: "4.A.11", rooms: 1, area: 30.47, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.A.11.pdf" },
  { id: "A412", floor: 4, number: "4.A.12", rooms: 3, area: 72.54, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/4.A.12.pdf" },

  // --- Klatka B (2. piętro) ---
  { id: "B214", floor: 2, number: "2.B.14", rooms: 1, area: 34.86, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.14.pdf" },
  { id: "B215", floor: 2, number: "2.B.15", rooms: 3, area: 75.39, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.15.pdf" },
  { id: "B216", floor: 2, number: "2.B.16", rooms: 3, area: 56.71, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.16.pdf" },
  { id: "B217", floor: 2, number: "2.B.17", rooms: 1, area: 34.73, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.17.pdf" },
  { id: "B218", floor: 2, number: "2.B.18", rooms: 3, area: 46.00, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.18.pdf" },
  { id: "B219", floor: 2, number: "2.B.19", rooms: 3, area: 46.01, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.19.pdf" },
  { id: "B220", floor: 2, number: "2.B.20", rooms: 3, area: 48.03, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.20.pdf" },
  { id: "B221", floor: 2, number: "2.B.21", rooms: 3, area: 48.17, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.21.pdf" },
  { id: "B222", floor: 2, number: "2.B.22", rooms: 3, area: 45.78, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.22.pdf" },

  // --- Klatka B (3. piętro) ---
  { id: "B323", floor: 3, number: "3.B.23", rooms: 1, area: 34.86, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.23.pdf" },
  { id: "B324", floor: 3, number: "3.B.24", rooms: 3, area: 75.39, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.24.pdf" },
  { id: "B325", floor: 3, number: "3.B.25", rooms: 3, area: 56.71, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.25.pdf" },
  { id: "B326", floor: 3, number: "3.B.26", rooms: 1, area: 34.73, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.26.pdf" },
  { id: "B327", floor: 3, number: "3.B.27", rooms: 3, area: 46.00, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.27.pdf" },
  { id: "B328", floor: 3, number: "3.B.28", rooms: 3, area: 46.02, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.28.pdf" },
  { id: "B329", floor: 3, number: "3.B.29", rooms: 3, area: 48.03, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.29.pdf" },
  { id: "B330", floor: 3, number: "3.B.30", rooms: 3, area: 48.17, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.30.pdf" },
  { id: "B331", floor: 3, number: "3.B.31", rooms: 3, area: 45.80, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.31.pdf" },

  // --- Klatka B (4. piętro) ---
  { id: "B432", floor: 4, number: "4.B.32", rooms: 1, area: 34.86, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.32.pdf" },
  { id: "B433", floor: 4, number: "4.B.33", rooms: 3, area: 75.39, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.33.pdf" },
  { id: "B434", floor: 4, number: "4.B.34", rooms: 3, area: 56.71, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.34.pdf" },
  { id: "B435", floor: 4, number: "4.B.35", rooms: 1, area: 34.73, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.35.pdf" },
  { id: "B436", floor: 4, number: "4.B.36", rooms: 3, area: 46.00, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.36.pdf" },
  { id: "B437", floor: 4, number: "4.B.37", rooms: 3, area: 46.02, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.37.pdf" },
  { id: "B438", floor: 4, number: "4.B.38", rooms: 3, area: 48.03, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.38.pdf" },
  { id: "B439", floor: 4, number: "4.B.39", rooms: 3, area: 48.17, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.39.pdf" },
  { id: "B440", floor: 4, number: "4.B.40", rooms: 3, area: 45.80, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.40.pdf" },

  // --- Klatka C ---
  { id: "C241", floor: 2, number: "2.C.41", rooms: 1, area: 33.14, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.C.41.pdf" },
  { id: "C242", floor: 2, number: "2.C.42", rooms: 3, area: 57.47, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.C.42.pdf" },
  { id: "C243", floor: 2, number: "2.C.43", rooms: 3, area: 51.14, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.C.43.pdf" },
  { id: "C244", floor: 2, number: "2.C.44", rooms: 2, area: 42.64, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.C.44.pdf" },
  { id: "C345", floor: 3, number: "3.C.45", rooms: 1, area: 33.14, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/3.C.45.pdf" },
  { id: "C346", floor: 3, number: "3.C.46", rooms: 3, area: 57.47, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/3.C.46.pdf" },
  { id: "C347", floor: 3, number: "3.C.47", rooms: 3, area: 51.14, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/3.C.47.pdf" },
  { id: "C348", floor: 3, number: "3.C.48", rooms: 2, area: 42.64, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.C.48.pdf" },
  { id: "C449", floor: 4, number: "4.C.49", rooms: 1, area: 33.14, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.C.49.pdf" },
  { id: "C450", floor: 4, number: "4.C.50", rooms: 3, area: 57.47, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/4.C.50.pdf" },
  { id: "C451", floor: 4, number: "4.C.51", rooms: 3, area: 51.14, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/4.C.51.pdf" },
  { id: "C452", floor: 4, number: "4.C.52", rooms: 2, area: 42.64, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.C.52.pdf" },

  // --- Klatka D (2. piętro) ---
  { id: "D253", floor: 2, number: "2.D.53", rooms: 1, area: 33.06, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.D.53.pdf" },
  { id: "D254", floor: 2, number: "2.D.54", rooms: 1, area: 47.11, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.D.54.pdf" },
  { id: "D255", floor: 2, number: "2.D.55", rooms: 3, area: 79.54, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.D.55.pdf" },
  { id: "D256", floor: 2, number: "2.D.56", rooms: 2, area: 45.59, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.D.56.pdf" },
  { id: "D257", floor: 2, number: "2.D.57", rooms: 2, area: 46.45, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.D.57.pdf" },
  { id: "D258", floor: 2, number: "2.D.58", rooms: 3, area: 58.59, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.D.58.pdf" },
  { id: "D259", floor: 2, number: "2.D.59", rooms: 2, area: 46.67, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.D.59.pdf" },
  { id: "D260", floor: 2, number: "2.D.60", rooms: 3, area: 65.33, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/2.D.60.pdf" },

  // --- Klatka D (3. piętro) ---
  { id: "D361", floor: 3, number: "3.D.61", rooms: 1, area: 33.06, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.D.61.pdf" },
  { id: "D362", floor: 3, number: "3.D.62", rooms: 2, area: 46.35, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.D.62.pdf" },
  { id: "D363", floor: 3, number: "3.D.63", rooms: 3, area: 79.54, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.D.63.pdf" },
  { id: "D364", floor: 3, number: "3.D.64", rooms: 2, area: 45.59, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.D.64.pdf" },
  { id: "D365", floor: 3, number: "3.D.65", rooms: 2, area: 46.45, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.D.65.pdf" },
  { id: "D366", floor: 3, number: "3.D.66", rooms: 3, area: 58.59, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.D.66.pdf" },
  { id: "D367", floor: 3, number: "3.D.67", rooms: 2, area: 46.67, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.D.67.pdf" },
  { id: "D368", floor: 3, number: "3.D.68", rooms: 4, area: 69.05, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.D.68.pdf" },

  // --- Klatka D (4. piętro) ---
  { id: "D469", floor: 4, number: "4.D.69", rooms: 1, area: 33.06, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.D.69.pdf" },
  { id: "D470", floor: 4, number: "4.D.70", rooms: 2, area: 46.35, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.D.70.pdf" },
  { id: "D471", floor: 4, number: "4.D.71", rooms: 3, area: 79.54, price: null, isAvailable: false, hasBalcony: true, orientation: "", planUrl: "/uploads/4.D.71.pdf" },
  { id: "D472", floor: 4, number: "4.D.72", rooms: 2, area: 45.59, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.D.72.pdf" },
  { id: "D473", floor: 4, number: "4.D.73", rooms: 2, area: 46.45, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.D.73.pdf" },
  { id: "D474", floor: 4, number: "4.D.74", rooms: 3, area: 58.59, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.D.74.pdf" },
  { id: "D475", floor: 4, number: "4.D.75", rooms: 2, area: 46.67, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.D.75.pdf" },
  { id: "D476", floor: 4, number: "4.D.76", rooms: 4, area: 69.05, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.D.76.pdf" },


];

/** ===== Slider ===== */
const HERO_IMAGES = [
  "/uploads/Siedlce_Inicjatywa_uj02b.jpg",
  "/uploads/Siedlce_Inicjatywa_uj02vbezdrzew_001.jpg",
  "/uploads/Siedlce_Inicjatywa_uj01b.jpg",
];

/** ===== Specjalne teksty dla planów kondygnacji ===== */
const GARAGE_PRICE_TEXT = "40 000 zł za miejsce postojowe";
const PARTER_INFO_TEXT  = "Komórka lokatorska 3 000 zł/m²";

/** ===== Utils ===== */
const formatPrice = (n: number | null) =>
  n == null ? "" : n.toLocaleString("pl-PL", { maximumFractionDigits: 0 }) + " zł";

const getStaircase = (unitNumber: string) => {
  const m = unitNumber.match(/\.(\w)\./);
  return m ? m[1] : "";
};

const floorLabel = (df: number) =>
  df === 0 ? "Garaż" : df === 1 ? "Parter" : `Piętro ${df - 1}`;

const chip = (active: boolean) =>
  "px-3 py-1.5 rounded-full border text-sm bg-white hover:bg-neutral-50 " +
  (active ? "ring-2 ring-[#D22121]/40 border-[#D22121]/40 font-medium" : "");

/** Mapowanie na „display floor” po numerze lokalu/ścieżce pliku. */
function dfFromUnit(u: Unit): number {
  // Garaż
  if (u.rooms === null && (/garaż/i.test(u.number) || /\/garaz\.pdf$/i.test(u.planUrl))) return 0;
  // Parter
  if (u.rooms === null && (/parter/i.test(u.number) || /\/parter\.pdf$/i.test(u.planUrl))) return 1;
  // Mieszkania po prefiksie numeru
  const m = (u.number || "").match(/^(\d)\./);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n === 2) return 2; // Piętro 1
    if (n === 3) return 3; // Piętro 2
    if (n === 4) return 4; // Piętro 3
    if (n === 1) return 0; // ewentualne 1.* → traktuj jako garaż
  }
  // Fallback – floor-1
  return Math.max(0, (u.floor ?? 3) - 1);
}

/** ===== Strona ===== */
export default function HomePage() {
  const [q, setQ] = useState("");
  const [stair, setStair] = useState<"" | "A" | "B" | "C" | "D">("");
  // "G"=garaż, "P"=parter, number=2/3/4 (piętra), ""=brak
  const [floorState, setFloorState] = useState<"" | "G" | "P" | number>("");
  const [rooms, setRooms] = useState<number | "">("");
  const [minArea, setMinArea] = useState<number>(25);
  const [maxArea, setMaxArea] = useState<number>(120);
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  const [editMode, setEditMode] = useState(false);
  const [priceMap, setPriceMap] = useState<Record<string, number | null>>({});
  const [availMap, setAvailMap] = useState<Record<string, boolean | null>>({});
  const [statusMap, setStatusMap] = useState<Record<string, "available" | "reserved" | "sold">>({});

  const [slide, setSlide] = useState(0);
  const [touched, setTouched] = useState(false);
  const requireSelection = !touched && stair === "" && floorState === "" && q.trim() === "";

  // localStorage
  useEffect(() => {
    const savedP = localStorage.getItem("priceMap");
    if (savedP) setPriceMap(JSON.parse(savedP));
    const savedA = localStorage.getItem("availMap");
    if (savedA) setAvailMap(JSON.parse(savedA));
    const savedS = localStorage.getItem("statusMap");
    if (savedS) setStatusMap(JSON.parse(savedS));
  }, []);
  useEffect(() => { localStorage.setItem("priceMap", JSON.stringify(priceMap)); }, [priceMap]);
  useEffect(() => { localStorage.setItem("availMap", JSON.stringify(availMap)); }, [availMap]);
  useEffect(() => { localStorage.setItem("statusMap", JSON.stringify(statusMap)); }, [statusMap]);

  // wczytaj overrides.json (produkcyjny nadpis)
  useEffect(() => {
    fetch("/data/overrides.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((o) => {
        if (!o) return;
        if (o.priceMap) setPriceMap((m) => ({ ...m, ...o.priceMap }));
        if (o.availMap) setAvailMap((m) => ({ ...m, ...o.availMap }));
        if (o.statusMap) setStatusMap((m) => ({ ...m, ...o.statusMap }));
      })
      .catch(() => {});
  }, []);

  const setUnitPrice = (id: string, v: string) => {
    const num = v === "" ? null : Math.max(0, Math.round(Number(v.replace(/\s/g, ""))));
    setPriceMap((m) => ({ ...m, [id]: num }));
  };

  /** Spójny odczyt statusu z kompatybilnością wstecz (availMap). */
  function getStatusFor(u: Unit): "available" | "reserved" | "sold" {
    const s = statusMap[u.id];
    if (s) return s;
    const effAvail = (availMap[u.id] ?? u.isAvailable) ?? true;
    return effAvail ? "available" : "reserved";
  }

  /** ===== Filtr ===== */
  const filtered = useMemo(() => {
    return UNITS.filter((u) => {
      const df = dfFromUnit(u);
      const status = getStatusFor(u);

      // wyszukiwarka po numerze
      if (q && !u.number.toLowerCase().includes(q.toLowerCase())) return false;

      // Garaż / Parter / Piętra
      if (floorState === "G" && df !== 0) return false;
      if (floorState === "P" && df !== 1) return false;
      if (typeof floorState === "number" && df !== floorState) return false;

      // Od 1. piętra w górę – klasyczne filtry
      if (df >= 2) {
        if (stair && getStaircase(u.number) !== stair) return false;
        if (rooms !== "" && u.rooms !== rooms) return false;
        if (u.area != null && (u.area < minArea || u.area > maxArea)) return false;
      }

      if (onlyAvailable && status !== "available") return false;

      const price = priceMap[u.id] ?? u.price;
      if (!editMode && maxPrice !== "" && price != null && price > maxPrice) return false;

      return true;
    });
  }, [q, stair, floorState, rooms, minArea, maxArea, onlyAvailable, maxPrice, priceMap, statusMap, availMap, editMode]);

  return (
    <div className="min-h-screen bg-white">
      {/* === NAGŁÓWEK === */}
      <header className="sticky top-0 z-30 border-b bg-white/75 backdrop-blur bg-[linear-gradient(180deg,rgba(255,255,255,.9)_0%,rgba(255,255,255,.6)_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-4 grid grid-cols-3 items-center">
          <div />
          <div className="flex justify-center">
            <img src="/uploads/logo.svg" alt="Logo firmy" className="h-40 w-auto" />
          </div>
          <div className="flex justify-end items-center gap-2">
            <input
              className="border rounded-full px-4 py-2 w-72 text-sm bg-white/80"
              placeholder="Szukaj (np. 3.B.24)"
              value={q}
              onChange={(e) => { setQ(e.target.value); setTouched(true); }}
            />
            {ENABLE_ADMIN && (
              <>
                <button
                  onClick={() => setEditMode((s) => !s)}
                  className={`rounded-full px-4 py-2 text-sm border transition ${editMode ? "bg-black text-white" : "bg-white hover:bg-neutral-50"}`}
                >
                  {editMode ? "Zakończ edycję" : "Edytuj"}
                </button>
                <button
                  onClick={() => {
                    const data = { priceMap, availMap, statusMap };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = "overrides.json";
                    document.body.appendChild(a); a.click(); a.remove();
                    URL.revokeObjectURL(url);
                  }}
                  className="rounded-full px-4 py-2 text-sm border bg-white hover:bg-neutral-50"
                >
                  Eksportuj JSON
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* === HERO === */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="relative rounded-2xl overflow-hidden border aspect-[21/9]">
          <AnimatePresence mode="wait">
            <motion.img
              key={HERO_IMAGES[slide]}
              src={HERO_IMAGES[slide]}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0.0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.35 }}
              alt="Wizualizacja"
            />
          </AnimatePresence>
          <button onClick={() => setSlide((s) => (s - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 border">‹</button>
          <button onClick={() => setSlide((s) => (s + 1) % HERO_IMAGES.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 border">›</button>
        </div>
      </section>

      {/* === ATUTY === */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10 text-neutral-800">Atuty inwestycji</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-lg ring-1 ring-[#D22121]/20">
            <Building2 className="h-10 w-10 text-[#D22121] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Jedynie 4 kondygnacje</h3>
            <p className="text-sm text-neutral-600">Kameralny budynek o niskiej zabudowie zapewnia prywatność i komfort mieszkańcom.</p>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#D22121] to-transparent opacity-100" />
          </div>
          <div className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-lg ring-1 ring-[#D22121]/20">
            <MapPin className="h-10 w-10 text-[#D22121] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Atrakcyjna lokalizacja</h3>
            <p className="text-sm text-neutral-600">Blisko centrum, terenów zielonych i infrastruktury miejskiej.</p>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#D22121] to-transparent opacity-100" />
          </div>
          <div className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-lg ring-1 ring-[#D22121]/20">
            <Wind className="h-10 w-10 text-[#D22121] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Klimatyzacja w standardzie</h3>
            <p className="text-sm text-neutral-600">Mieszkania przygotowane pod montaż klimatyzacji.</p>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#D22121] to-transparent opacity-100" />
          </div>
          <div className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-lg ring-1 ring-[#D22121]/20">
            <Sparkles className="h-10 w-10 text-[#D22121] mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nowoczesna architektura</h3>
            <p className="text-sm text-neutral-600">Elegancki design i funkcjonalne układy mieszkań.</p>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#D22121] to-transparent opacity-100" />
          </div>
        </div>
      </section>

      <div className="h-px w-full my-12 bg-[linear-gradient(90deg,#0000,rgba(0,0,0,.12),#0000)]" />

      {/* === FILTRY + LISTA === */}
      <main className="mx-auto max-w-7xl px-4 pb-12">
        {/* PANEL FILTRÓW – 3 RZĘDY */}
        <section className="relative rounded-2xl border overflow-hidden bg-[radial-gradient(1200px_600px_at_50%_-20%,#fef2f2,#ffffff)]">
          <div className="px-6 py-8 md:px-10 md:py-10">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center">
              Wybierz <span className="text-[#D22121]">mieszkanie</span>
            </h2>

            {/* Rząd 1: KLATKI */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {(["A","B","C","D"] as const).map(k => (
                <button key={k} onClick={() => { setStair(k); setTouched(true); }} className={chip(stair === k)} aria-pressed={stair === k}>
                  Klatka {k}
                </button>
              ))}
              <button onClick={() => { setStair(""); setTouched(true); }} className={chip(stair === "")} aria-pressed={stair === ""}>
                Wszystkie klatki
              </button>
            </div>

            {/* Rząd 2: GARAŻ + PARTER + PIĘTRA */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <button onClick={() => { setFloorState("G"); setTouched(true); }} className={chip(floorState === "G")} aria-pressed={floorState === "G"}>Garaż</button>
              <button onClick={() => { setFloorState("P"); setTouched(true); }} className={chip(floorState === "P")} aria-pressed={floorState === "P"}>Parter</button>
              {[2,3,4].map(df => (
                <button key={df} onClick={() => { setFloorState(df); setTouched(true); }} className={chip(floorState === df)} aria-pressed={floorState === df}>
                  {floorLabel(df)}
                </button>
              ))}
              <button onClick={() => { setFloorState(""); setTouched(true); }} className={chip(floorState === "")} aria-pressed={floorState === ""}>
                Wszystkie piętra
              </button>
            </div>

            {/* Rząd 3: POKOJE */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {[1,2,3,4].map(r => (
                <button key={r} onClick={() => { setRooms(r); setTouched(true); }} className={chip(rooms === r)} aria-pressed={rooms === r}>
                  {r} pokoje
                </button>
              ))}
              <button onClick={() => { setRooms(""); setTouched(true); }} className={chip(rooms === "")} aria-pressed={rooms === ""}>
                Wszystkie pokoje
              </button>
            </div>

            {/* Dodatkowe szybkie filtry */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={onlyAvailable} onChange={(e) => { setOnlyAvailable(e.target.checked); setTouched(true); }} />
                Tylko dostępne
              </label>

              <div className="flex items-center gap-1">
                <span>Max m²:</span>
                <input type="number" className="w-24 border rounded px-2 py-1" value={maxArea}
                  onChange={(e) => { setMaxArea(Number(e.target.value || 0)); setTouched(true); }} />
              </div>

              <div className="flex items-center gap-1">
                <span>Cena maks.:</span>
                <input type="number" className="w-28 border rounded px-2 py-1" placeholder="bez limitu"
                  value={maxPrice === "" ? "" : String(maxPrice)}
                  onChange={(e) => { setMaxPrice(e.target.value === "" ? "" : Math.max(0, Math.round(Number(e.target.value)))); setTouched(true); }} />
              </div>

              <button
                onClick={() => {
                  setQ(""); setStair(""); setFloorState(""); setRooms("");
                  setMinArea(25); setMaxArea(120); setMaxPrice(""); setOnlyAvailable(false);
                  setTouched(true);
                }}
                className="px-3 py-1.5 rounded-full border bg-white hover:bg-neutral-50"
              >
                Pokaż wszystkie
              </button>

              <button
                onClick={() => {
                  setQ(""); setStair(""); setFloorState(""); setRooms("");
                  setMinArea(25); setMaxArea(120); setMaxPrice(""); setOnlyAvailable(false);
                  setTouched(false);
                }}
                className="px-3 py-1.5 rounded-full border bg-white hover:bg-neutral-50"
              >
                Wyczyść wszystko
              </button>
            </div>

            {!requireSelection && (
              <div className="mt-3 text-center text-sm text-neutral-600">
                Wyników: <b>{filtered.length}</b>
              </div>
            )}
          </div>
        </section>

        {/* LISTA KART */}
        <section className="mt-6">
          {requireSelection ? (
            <div className="text-center text-neutral-500 py-8">
              Wybierz klatkę lub piętro powyżej, aby zobaczyć mieszkania.
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((u) => {
                const jpg = u.planUrl?.replace("/uploads/", "/thumbnails/").replace(/\.pdf$/i, ".jpg");
                const stairName = getStaircase(u.number);
                const df = dfFromUnit(u);
                const price = priceMap[u.id] ?? u.price ?? null;
                const status = getStatusFor(u);
                const isGaragePlan = df === 0;
                const isParterPlan = df === 1;
                const isSold = status === "sold";

                return (
                  <div
                    key={u.id}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter") window.open(u.planUrl, "_blank"); }}
                    className={"group rounded-2xl border overflow-hidden bg-white transition " +
                      "hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-[#D22121] hover:border-[#D22121]/40 " +
                      "focus-within:shadow-lg focus-within:ring-1 focus-within:ring-[#D22121]"}
                  >
                    {/* Miniatura – wyszarzenie tylko obrazka + overlay */}
                    <div className="relative aspect-video bg-neutral-100 overflow-hidden">
                      <img
                        src={jpg}
                        alt={`Miniatura ${u.number}`}
                        className={
                          "absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 " +
                          (isSold ? "grayscale" : "")
                        }
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://dummyimage.com/900x600/eeeeee/222&text=Brak+miniatury";
                        }}
                      />
                      {isSold && <div className="absolute inset-0 bg-white/55 z-10 pointer-events-none" />}
                      <div className="absolute bottom-2 left-2 right-2 z-20 flex justify-between items-center">
                        {isGaragePlan ? (
                          <GarageBadge />
                        ) : (
                          <FloorBadge floor={df} total={4} />
                        )}
                        <button
                          onClick={() => window.open(u.planUrl, "_blank")}
                          className={"text-xs px-2 py-1 rounded border " + (isSold ? "bg-white/70 cursor-not-allowed" : "bg-white/90 backdrop-blur hover:bg-white")}
                        >
                          Otwórz PDF
                        </button>
                      </div>
                    </div>

                    {/* Treść karty */}
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold">{u.number}</div>
                          <div className="text-xs text-neutral-600">
                            {isGaragePlan ? (
                              "Garaż – rzut kondygnacji"
                            ) : isParterPlan ? (
                              "Parter – rzut kondygnacji"
                            ) : (
                              <>Klatka {stairName || "?"} • {floorLabel(df)} • {u.rooms ?? "—"} pok. • {u.area ?? "—"} m²</>
                            )}
                          </div>
                        </div>

                        {/* Cena / specjalne teksty / edycja */}
                        <div className="text-right">
                          {isGaragePlan ? (
                            <div className="text-base font-semibold text-neutral-800">
                              {GARAGE_PRICE_TEXT}
                            </div>
                          ) : isParterPlan ? (
                            <div className="text-base font-semibold text-neutral-800">
                              {PARTER_INFO_TEXT}
                            </div>
                          ) : ENABLE_ADMIN && editMode ? (
                            <input
                              type="number"
                              inputMode="numeric"
                              min={0}
                              step={1}
                              className="w-28 border rounded-lg px-2 py-1 text-right tabular-nums"
                              value={price == null ? "" : String(price)}
                              onChange={(e) => setUnitPrice(u.id, e.target.value)}
                              onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                          ) : (
                            status === "sold" ? null : (
                              <div className="text-base font-semibold">{formatPrice(price)}</div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Status (kolory: zielony / żółty / czerwony) + edycja statusu w trybie admin */}
                      {!isParterPlan && !isGaragePlan && (
                        <div className="mt-2 text-xs">
                          {status === "available" && (
                            <span className="inline-block px-2 py-1 rounded border bg-emerald-50 border-emerald-200 text-emerald-700">Dostępne</span>
                          )}
                          {status === "reserved" && (
                            <span className="inline-block px-2 py-1 rounded border bg-amber-50 border-amber-200 text-amber-700">Zarezerwowane</span>
                          )}
                          {status === "sold" && (
                            <span className="inline-block px-2 py-1 rounded border bg-red-50 border-red-200 text-red-700">Sprzedane</span>
                          )}

                          {ENABLE_ADMIN && editMode && (
                            <span className="inline-flex gap-1 ml-2 align-middle">
                              <button onClick={() => setStatusMap((m) => ({ ...m, [u.id]: "available" }))} className="px-2 py-1 text-xs rounded border hover:bg-neutral-50">Dostępne</button>
                              <button onClick={() => setStatusMap((m) => ({ ...m, [u.id]: "reserved" }))} className="px-2 py-1 text-xs rounded border hover:bg-neutral-50">Zarezerw.</button>
                              <button onClick={() => setStatusMap((m) => ({ ...m, [u.id]: "sold" }))} className="px-2 py-1 text-xs rounded border hover:bg-neutral-50">Sprzedane</button>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Kontakt (prosty) */}
      <section id="contact-section" className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="text-sm text-neutral-500 mb-2">Kontakt</div>
            <h2 className="text-4xl font-semibold leading-tight">
              Zapytaj <span className="text-[#D22121]">o lokal</span>
            </h2>
            <p className="mt-4 text-neutral-600 max-w-lg">Zadzwoń, napisz albo odwiedź nas w biurze sprzedaży.</p>
            <div className="mt-8 space-y-6 text-neutral-800">
              <div><div className="text-[#D22121] font-medium">Biuro sprzedaży</div><div>ul. Jagiełły 10, Siedlce, Biurowiec Społem</div></div>
              <div><div className="text-[#D22121] font-medium">Godziny otwarcia</div><div>Poniedziałek – Piątek: 7:00 – 15:00</div></div>
              <div><div className="text-[#D22121] font-medium">Telefon</div><a href="tel:(025) 6327761" className="text-lg font-semibold hover:underline">(025) 632 77 61</a></div>
              <div><div className="text-[#D22121] font-medium">E-mail</div><a href="mailto:administracja@spolem.siedlce.pl" className="hover:underline">administracja@spolem.siedlce.pl</a></div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img src="/uploads/Siedlce_Inicjatywa_uj01b.jpg" alt="Budynek" className="rounded-2xl shadow-md mb-6" />
            <a href="tel:(025) 6327761" className="inline-flex items-center justify-center rounded-lg bg-[#D22121] px-6 py-3 text-white font-medium hover:bg-[#B51A1A]">
              Zadzwoń teraz
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-neutral-600">© 2025 Primo Development</div>
      </footer>
    </div>
  );
}

/** ===== Badge pięter / garażu ===== */
function FloorBadge({ floor, total = 4 }: { floor: number; total?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="grid gap-0.5" style={{ gridTemplateRows: `repeat(${total}, minmax(0, 1fr))`, gridAutoFlow: "row" }}>
        {Array.from({ length: total }, (_, i) => total - i).map((f) => (
          <div key={f} className={`h-2.5 w-6 rounded ${f === floor ? "bg-black" : "bg-neutral-300"}`} />
        ))}
      </div>
      <span className="text-xs text-neutral-700">
        {floorLabel(floor)}
      </span>
    </div>
  );
}
function GarageBadge() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2.5 w-10 rounded bg-neutral-800" title="Garaż" />
      <span className="text-xs text-neutral-700">Garaż</span>
    </div>
  );
}

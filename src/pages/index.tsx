import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, MapPin, Wind, Sparkles } from "lucide-react";

// 🔧 Prosta flaga admina – lokalnie true, na serwerze false
const ENABLE_ADMIN = false;

// ================== TYPY ==================
type Unit = {
  id: string;
  floor: number;
  number: string;
  rooms: number | null;
  area: number | null;
  price: number | null;
  isAvailable: boolean;
  hasBalcony: boolean;
  orientation: string;
  planUrl: string;
};

// ================== DANE ==================
const UNITS: Unit[] = [
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
  { id: "A201", floor: 2, number: "2.A.1", rooms: 2, area: 50.57, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.A.1.pdf" },
  { id: "A202", floor: 2, number: "2.A.2", rooms: 2, area: 53.57, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.A.2.pdf" },
  { id: "A203", floor: 2, number: "2.A.3", rooms: 1, area: 30.47, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.A.3.pdf" },
  { id: "A204", floor: 2, number: "2.A.4", rooms: 3, area: 72.54, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.A.4.pdf" },
  { id: "A305", floor: 3, number: "3.A.5", rooms: 2, area: 50.57, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.A.5.pdf" },
  { id: "A306", floor: 3, number: "3.A.6", rooms: 2, area: 53.57, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.A.6.pdf" },
  { id: "A307", floor: 3, number: "3.A.7", rooms: 1, area: 30.47, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.A.7.pdf" },
  { id: "A308", floor: 3, number: "3.A.8", rooms: 3, area: 72.54, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.A.8.pdf" },
  { id: "A409", floor: 4, number: "4.A.9", rooms: 2, area: 50.57, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.A.9.pdf" },
  { id: "A410", floor: 4, number: "4.A.10", rooms: 2, area: 53.57, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.A.10.pdf" },
  { id: "A411", floor: 4, number: "4.A.11", rooms: 1, area: 30.47, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.A.11.pdf" },
  { id: "A412", floor: 4, number: "4.A.12", rooms: 3, area: 72.54, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.A.12.pdf" },

  // --- Klatka B (2. piętro) ---
  { id: "B214", floor: 2, number: "2.B.14", rooms: 1, area: 34.86, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.14.pdf" },
  { id: "B215", floor: 2, number: "2.B.15", rooms: 3, area: 75.39, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.15.pdf" },
  { id: "B216", floor: 2, number: "2.B.16", rooms: 3, area: 56.71, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.16.pdf" },
  { id: "B217", floor: 2, number: "2.B.17", rooms: 1, area: 34.73, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.17.pdf" },
  { id: "B218", floor: 2, number: "2.B.18", rooms: null, area: null, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.18.pdf" },
  { id: "B219", floor: 2, number: "2.B.19", rooms: 3, area: 46.01, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.19.pdf" },
  { id: "B220", floor: 2, number: "2.B.20", rooms: 3, area: 48.03, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.20.pdf" },
  { id: "B221", floor: 2, number: "2.B.21", rooms: 3, area: 48.17, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.21.pdf" },
  { id: "B222", floor: 2, number: "2.B.22", rooms: 3, area: 45.78, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.B.22.pdf" },

  // --- Klatka B (3. piętro) ---
  { id: "B323", floor: 3, number: "3.B.23", rooms: 1, area: 34.86, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.23.pdf" },
  { id: "B324", floor: 3, number: "3.B.24", rooms: 3, area: 75.39, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.24.pdf" },
  { id: "B325", floor: 3, number: "3.B.25", rooms: 2, area: 56.71, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.25.pdf" },
  { id: "B326", floor: 3, number: "3.B.26", rooms: 1, area: 34.73, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.26.pdf" },
  { id: "B327", floor: 3, number: "3.B.27", rooms: 2, area: 46.00, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.27.pdf" },
  { id: "B328", floor: 3, number: "3.B.28", rooms: null, area: null, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.28.pdf" },
  { id: "B329", floor: 3, number: "3.B.29", rooms: null, area: null, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.29.pdf" },
  { id: "B330", floor: 3, number: "3.B.30", rooms: 2, area: 48.17, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.30.pdf" },
  { id: "B331", floor: 3, number: "3.B.31", rooms: 2, area: 45.80, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.B.31.pdf" },

  // --- Klatka B (4. piętro) ---
  { id: "B432", floor: 4, number: "4.B.32", rooms: 1, area: 34.86, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.32.pdf" },
  { id: "B433", floor: 4, number: "4.B.33", rooms: 3, area: 75.39, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.33.pdf" },
  { id: "B434", floor: 4, number: "4.B.34", rooms: 3, area: 56.71, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.34.pdf" },
  { id: "B435", floor: 4, number: "4.B.35", rooms: 1, area: 34.73, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.35.pdf" },
  { id: "B436", floor: 4, number: "4.B.36", rooms: 3, area: 46.00, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.36.pdf" },
  { id: "B437", floor: 4, number: "4.B.37", rooms: 3, area: 46.02, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.37.pdf" },
  { id: "B438", floor: 4, number: "4.B.38", rooms: 3, area: 48.03, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.38.pdf" },
  { id: "B439", floor: 4, number: "4.B.39", rooms: 3, area: 48.17, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.39.pdf" },
  { id: "B440", floor: 4, number: "4.B.40", rooms: 3, area: 45.80, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.B.40.pdf" },

  // --- Klatka C ---
  { id: "C241", floor: 2, number: "2.C.41", rooms: null, area: null, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.C.41.pdf" },
  { id: "C242", floor: 2, number: "2.C.42", rooms: null, area: null, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.C.42.pdf" },
  { id: "C243", floor: 2, number: "2.C.43", rooms: null, area: null, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.C.43.pdf" },
  { id: "C244", floor: 2, number: "2.C.44", rooms: 2, area: 42.64, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.C.44.pdf" },
  { id: "C345", floor: 3, number: "3.C.45", rooms: 1, area: 33.14, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.C.45.pdf" },
  { id: "C346", floor: 3, number: "3.C.46", rooms: null, area: null, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.C.46.pdf" },
  { id: "C347", floor: 3, number: "3.C.47", rooms: null, area: null, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.C.47.pdf" },
  { id: "C348", floor: 3, number: "3.C.48", rooms: null, area: null, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/3.C.48.pdf" },
  { id: "C449", floor: 4, number: "4.C.49", rooms: null, area: null, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.C.49.pdf" },
  { id: "C450", floor: 4, number: "4.C.50", rooms: null, area: null, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.C.50.pdf" },
  { id: "C451", floor: 4, number: "4.C.51", rooms: 3, area: 51.14, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.C.51.pdf" },
  { id: "C452", floor: 4, number: "4.C.52", rooms: 2, area: 42.64, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.C.52.pdf" },

  // --- Klatka D (2. piętro) ---
  { id: "D253", floor: 2, number: "2.D.53", rooms: 1, area: 33.06, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.D.53.pdf" },
  { id: "D254", floor: 2, number: "2.D.54", rooms: 1, area: 47.11, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.D.54.pdf" },
  { id: "D255", floor: 2, number: "2.D.55", rooms: 3, area: 79.54, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.D.55.pdf" },
  { id: "D256", floor: 2, number: "2.D.56", rooms: 2, area: 45.59, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.D.56.pdf" },
  { id: "D257", floor: 2, number: "2.D.57", rooms: 2, area: 46.45, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.D.57.pdf" },
  { id: "D258", floor: 2, number: "2.D.58", rooms: 3, area: 58.59, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.D.58.pdf" },
  { id: "D259", floor: 2, number: "2.D.59", rooms: 2, area: 46.67, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.D.59.pdf" },
  { id: "D260", floor: 2, number: "2.D.60", rooms: 3, area: 65.33, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/2.D.60.pdf" },

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
  { id: "D471", floor: 4, number: "4.D.71", rooms: 3, area: 79.54, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.D.71.pdf" },
  { id: "D472", floor: 4, number: "4.D.72", rooms: 2, area: 45.59, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.D.72.pdf" },
  { id: "D473", floor: 4, number: "4.D.73", rooms: null, area: null, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.D.73.pdf" },
  { id: "D474", floor: 4, number: "4.D.74", rooms: 3, area: 58.59, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.D.74.pdf" },
  { id: "D475", floor: 4, number: "4.D.75", rooms: 2, area: 46.67, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.D.75.pdf" },
  { id: "D476", floor: 4, number: "4.D.76", rooms: 4, area: 69.05, price: null, isAvailable: true, hasBalcony: true, orientation: "", planUrl: "/uploads/4.D.76.pdf" },
];
  // ... 🔽 reszta mieszkań tak jak masz w poprzednim pliku 🔽


// ================== SLIDER ==================
const HERO_IMAGES = [
  "/uploads/Siedlce_Inicjatywa_uj02b.jpg",
  "/uploads/Siedlce_Inicjatywa_uj02vbezdrzew_001.jpg",
  "/uploads/Siedlce_Inicjatywa_uj01b.jpg",
];

// ================== POMOCNICZE ==================
const formatPrice = (n: number | null) =>
  n == null ? "—" : n.toLocaleString("pl-PL", { maximumFractionDigits: 0 }) + " zł";

const getStaircase = (unitNumber: string) => {
  const m = unitNumber.match(/\.(\w)\./);
  return m ? m[1] : "";
};

const displayFloor = (f: number) => f - 1;
const TOTAL_DISPLAY_FLOORS = Math.max(...UNITS.map((u) => displayFloor(u.floor))) || 3;

// ================== STRONA ==================
export default function HomePage() {
  const [q, setQ] = useState("");
  const [stair, setStair] = useState<"" | "A" | "B" | "C" | "D">("");
  const [floor, setFloor] = useState<number | "">("");
  const [rooms, setRooms] = useState<number | "">("");
  const [minArea, setMinArea] = useState<number>(25);
  const [maxArea, setMaxArea] = useState<number>(120);
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  const [editMode, setEditMode] = useState(false);
  const [priceMap, setPriceMap] = useState<Record<string, number | null>>({});
  const [availMap, setAvailMap] = useState<Record<string, boolean | null>>({});

  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("priceMap");
    if (saved) setPriceMap(JSON.parse(saved));
    const savedAvail = localStorage.getItem("availMap");
    if (savedAvail) setAvailMap(JSON.parse(savedAvail));
  }, []);
  useEffect(() => {
    localStorage.setItem("priceMap", JSON.stringify(priceMap));
  }, [priceMap]);
  useEffect(() => {
    localStorage.setItem("availMap", JSON.stringify(availMap));
  }, [availMap]);
// ⬇️ Ładowanie public/data/overrides.json (działa lokalnie i na produkcji)
useEffect(() => {
  fetch("/data/overrides.json", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then((o) => {
      if (!o) return;
      if (o.priceMap) setPriceMap((m) => ({ ...m, ...o.priceMap }));
      if (o.availMap) setAvailMap((m) => ({ ...m, ...o.availMap }));
    })
    .catch(() => {});
}, []);

  const setAvailability = (id: string, v: boolean) => setAvailMap((m) => ({ ...m, [id]: v }));
  const setPrice = (id: string, v: string) => {
    const num = v === "" ? null : Math.max(0, Math.round(Number(v)));
    setPriceMap((m) => ({ ...m, [id]: num }));
  };

  const floors = useMemo(
    () => Array.from(new Set(UNITS.map((u) => displayFloor(u.floor)))).sort((a, b) => a - b),
    []
  );

  const filtered = useMemo(() => {
    return UNITS.filter((u) => {
      const df = displayFloor(u.floor);
      const effectiveAvailable = (availMap[u.id] ?? u.isAvailable);

      if (q && !u.number.toLowerCase().includes(q.toLowerCase())) return false;
      if (stair && df !== 0 && getStaircase(u.number) !== stair) return false;
      if (floor !== "" && df !== floor) return false;
      if (rooms !== "" && df !== 0 && u.rooms !== rooms) return false;
      if (u.area != null && df !== 0 && (u.area < minArea || u.area > maxArea)) return false;
      if (onlyAvailable && !effectiveAvailable) return false;

      const price = priceMap[u.id] ?? u.price;
      if (maxPrice !== "" && price != null && price > maxPrice) return false;

      return true;
    });
  }, [q, stair, floor, rooms, minArea, maxArea, onlyAvailable, maxPrice, priceMap, availMap]);

 return (
    <div className="min-h-screen bg-white">
      {/* === NAGŁÓWEK === */}
      {/* === NAGŁÓWEK (logo na środku, akcje po prawej) === */}
<header className="sticky top-0 z-30 border-b bg-white/75 backdrop-blur bg-[linear-gradient(180deg,rgba(255,255,255,.9)_0%,rgba(255,255,255,.6)_100%)]">
  <div className="mx-auto max-w-7xl px-4 py-4 grid grid-cols-3 items-center">
    {/* lewa kolumna pusta dla wyśrodkowania logo */}
    <div />

    {/* środek – logo (SVG) */}
    <div className="flex justify-center">
      <img src="/uploads/logo.svg" alt="Logo firmy" className="h-40 w-auto" />
    </div>

    {/* prawa – search + (adminowe) przyciski */}
    <div className="flex justify-end items-center gap-2">
      <input
        className="border rounded-full px-4 py-2 w-72 text-sm bg-white/80"
        placeholder="Szukaj (np. 3.B.24)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {ENABLE_ADMIN && (
        <>
          <button
            onClick={() => setEditMode((s) => !s)}
            className={`rounded-full px-4 py-2 text-sm border transition ${
              editMode ? "bg-black text-white" : "bg-white hover:bg-neutral-50"
            }`}
            title="Tryb edycji cen i dostępności"
          >
            {editMode ? "Zakończ edycję" : "Edytuj ceny"}
          </button>

          {/* Eksport nadpisań (JSON) */}
          <button
            onClick={() => {
              const data = { priceMap, availMap };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "overrides.json";
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}
            className="rounded-full px-4 py-2 text-sm border bg-white hover:bg-neutral-50"
            title="Zapisz aktualne ceny i dostępność do pliku JSON"
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
          <button onClick={() => setSlide((s) => (s - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 border">‹</button>
          <button onClick={() => setSlide((s) => (s + 1) % HERO_IMAGES.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 border">›</button>
        </div>
      </section>
{/* === ATUTY INWESTYCJI (nowoczesne kafelki) === */}
{/* === ATUTY INWESTYCJI === */}
<section className="mx-auto max-w-7xl px-4 py-16">
  <h2 className="text-2xl font-bold text-center mb-10 text-neutral-800">
    Atuty inwestycji
  </h2>
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    {/* Kafelek 1 */}
    <div className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-lg ring-1 ring-[#D22121]/20">
      <Building2 className="h-10 w-10 text-[#D22121] mb-4" />
      <h3 className="text-lg font-semibold mb-2">Jedynie 4 kondygnacje</h3>
      <p className="text-sm text-neutral-600">
        Kameralny budynek o niskiej zabudowie zapewnia prywatność i komfort mieszkańcom.
      </p>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#D22121] to-transparent opacity-100" />
    </div>

    {/* Kafelek 2 */}
    <div className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-lg ring-1 ring-[#D22121]/20">
      <MapPin className="h-10 w-10 text-[#D22121] mb-4" />
      <h3 className="text-lg font-semibold mb-2">Atrakcyjna lokalizacja</h3>
      <p className="text-sm text-neutral-600">
        Blisko centrum, terenów zielonych i infrastruktury miejskiej – idealne połączenie.
      </p>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#D22121] to-transparent opacity-100" />
    </div>

    {/* Kafelek 3 */}
    <div className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-lg ring-1 ring-[#D22121]/20">
      <Wind className="h-10 w-10 text-[#D22121] mb-4" />
      <h3 className="text-lg font-semibold mb-2">Klimatyzacja w standardzie</h3>
      <p className="text-sm text-neutral-600">
        Mieszkania przygotowane pod montaż klimatyzacji dla Twojego komfortu przez cały rok.
      </p>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#D22121] to-transparent opacity-100" />
    </div>

    {/* Kafelek 4 */}
    <div className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-lg ring-1 ring-[#D22121]/20">
      <Sparkles className="h-10 w-10 text-[#D22121] mb-4" />
      <h3 className="text-lg font-semibold mb-2">Nowoczesna architektura</h3>
      <p className="text-sm text-neutral-600">
        Elegancki design i funkcjonalne układy mieszkań zaprojektowane z myślą o mieszkańcach.
      </p>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#D22121] to-transparent opacity-100" />
    </div>
  </div>
</section>


<div className="h-px w-full my-12 bg-[linear-gradient(90deg,#0000,rgba(0,0,0,.12),#0000)]" />

      {/* === TREŚĆ === */}
      <main className="mx-auto max-w-7xl px-4 pb-12 grid grid-cols-12 gap-6">
        {/* FILTRY */}
        <aside className="col-span-12 md:col-span-5 lg:col-span-4">
  <div className="rounded-2xl border p-4 sticky top-[180px] bg-white">
    <div className="font-semibold mb-3">Filtry</div>

    {/* Klatka */}
    <label className="block text-sm mb-2">
      Klatka
      <div className="mt-1 flex gap-2 flex-wrap">
        {(["", "A", "B", "C", "D"] as const).map((k) => (
          <button
            key={k || "all"}
            onClick={() => setStair(k)}
            className={`px-3 py-1 rounded-lg border ${stair === k ? "bg-black text-white" : "bg-white"}`}
          >
            {k || "Wszystkie"}
          </button>
        ))}
      </div>
    </label>

    {/* Piętro (z Garażem) */}
    <label className="block text-sm mb-2 mt-3">
      Piętro
      <div className="mt-1 flex gap-2 flex-nowrap overflow-x-auto pb-1">
        <button
          onClick={() => setFloor("")}
          className={`px-3 py-1 rounded-lg border ${floor === "" ? "bg-black text-white" : "bg-white"}`}
        >
          Wszystkie
        </button>
        {floors.map((f) => (
          <button
            key={f}
            onClick={() => setFloor(f)}
            className={`px-3 py-1 rounded-lg border ${floor === f ? "bg-black text-white" : "bg-white"}`}
          >
            {f === 0 ? "Garaż" : f}
          </button>
        ))}
      </div>
    </label>

    {/* Pokoje */}
    <label className="block text-sm mb-2 mt-3">
      Pokoje
      <div className="mt-1 flex gap-2 flex-wrap">
        {(["", 1, 2, 3, 4] as const).map((r) => (
          <button
            key={r || "all"}
            onClick={() => setRooms(r as any)}
            className={`px-3 py-1 rounded-lg border ${rooms === r ? "bg-black text-white" : "bg-white"}`}
          >
            {r === "" ? "Wszystkie" : r}
          </button>
        ))}
      </div>
    </label>

    {/* Metraż */}
    <div className="grid grid-cols-2 gap-2 mt-3">
      <label className="block text-sm">
        Min m²
        <input
          type="number"
          className="mt-1 w-full border rounded-lg px-2 py-1"
          value={minArea}
          onChange={(e) => setMinArea(Number(e.target.value || 0))}
          disabled={floor === 0} // wyłącz dla Garażu
        />
      </label>
      <label className="block text-sm">
        Max m²
        <input
          type="number"
          className="mt-1 w-full border rounded-lg px-2 py-1"
          value={maxArea}
          onChange={(e) => setMaxArea(Number(e.target.value || 0))}
          disabled={floor === 0} // wyłącz dla Garażu
        />
      </label>
    </div>

    {/* Cena maks. */}
    <label className="block text-sm mt-3">
      Cena maks.
      <input
        type="number"
        className="mt-1 w-full border rounded-lg px-2 py-1"
        placeholder="bez limitu"
        value={maxPrice === "" ? "" : String(maxPrice)}
        onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Math.max(0, Math.round(Number(e.target.value))))}
      />
    </label>

    {/* Tylko dostępne */}
    <label className="mt-3 flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={onlyAvailable}
        onChange={(e) => setOnlyAvailable(e.target.checked)}
      />
      Tylko dostępne
    </label>

    {/* Wyczyść */}
    <button
      onClick={() => {
        setQ("");
        setStair("");
        setFloor("");
        setRooms("");
        setMinArea(25);
        setMaxArea(120);
        setMaxPrice("");
        setOnlyAvailable(false);
      }}
      className="mt-4 w-full rounded-lg border px-3 py-2"
    >
      Wyczyść filtry
    </button>
  </div>
</aside>


        {/* LISTA */}
        <section className="col-span-12 md:col-span-7 lg:col-span-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-sm text-neutral-600">Wyników: <b>{filtered.length}</b></div>
            {ENABLE_ADMIN && editMode && (
              <>
                <button onClick={() => { /* zaznaczone dostępne */ }} className="ml-3 text-xs px-2 py-1 rounded border hover:bg-neutral-50">Zaznaczone → dostępne</button>
                <button onClick={() => { /* zaznaczone zarezerw. */ }} className="text-xs px-2 py-1 rounded border hover:bg-neutral-50">Zaznaczone → zarezerwowane</button>
              </>
            )}
          </div>

          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
  {filtered.map((u) => {
    const jpg = u.planUrl?.replace("/uploads/", "/thumbnails/").replace(/\.pdf$/i, ".jpg");
    const stair = getStaircase(u.number);
    const price = priceMap[u.id] ?? u.price ?? null;
    const dispFloor = displayFloor(u.floor);
    const effectiveAvailable = availMap[u.id] ?? u.isAvailable;

    return (
      <div
        key={u.id}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") window.open(u.planUrl, "_blank");
        }}
        className="group rounded-2xl border overflow-hidden bg-white transition
                   hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-[#D22121] hover:border-[#D22121]/40
                   focus-within:shadow-lg focus-within:ring-1 focus-within:ring-[#D22121]"
      >
        {/* Miniatura */}
        <div className="relative aspect-video bg-neutral-100 overflow-hidden">
          <img
            src={jpg}
            alt={`Miniatura ${u.number}`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://dummyimage.com/900x600/eeeeee/222&text=Brak+miniatury";
            }}
          />
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
            {dispFloor === 0 ? (
              <GarageBadge />
            ) : (
              <FloorBadge floor={dispFloor} total={TOTAL_DISPLAY_FLOORS} />
            )}
            <button
              onClick={() => window.open(u.planUrl, "_blank")}
              title="Otwórz plan w PDF"
              className="text-xs px-2 py-1 rounded bg-white/90 backdrop-blur border hover:bg-white"
            >
              Otwórz PDF
            </button>
          </div>
        </div>

        {/* Treść */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-semibold">{u.number}</div>
              <div className="text-xs text-neutral-600">
                {dispFloor === 0 ? (
                  "Garaż podziemny"
                ) : (
                  <>
                    Klatka {stair || "?"} • Piętro {dispFloor} • {u.rooms ?? "—"} pok. • {u.area ?? "—"} m²
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              {!ENABLE_ADMIN || !editMode ? (
                <div className="text-base font-semibold">{formatPrice(price)}</div>
              ) : (
                <input
                  type="number"
                  className="w-28 border rounded-lg px-2 py-1 text-right"
                  value={price == null ? "" : String(price)}
                  onChange={(e) => setPrice(u.id, e.target.value)}
                />
              )}
            </div>
          </div>

          {/* Status dostępności */}
          <div className="mt-2 text-xs">
            <span
              className={`inline-block px-2 py-1 rounded border ${
                effectiveAvailable
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              {effectiveAvailable ? "Dostępne" : "Zarezerwowane"}
            </span>
            {ENABLE_ADMIN && editMode && (
              <button
                onClick={() => setAvailability(u.id, !effectiveAvailable)}
                className="inline-block ml-2 text-xs px-2 py-1 rounded border hover:bg-neutral-50"
              >
                {effectiveAvailable ? "Oznacz jako zarezerw." : "Oznacz jako dostępne"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  })}
</div>
</section>

      </main>

      <ContactSimple />

      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-neutral-600">© 2025 Primo Development</div>
      </footer>
    </div>
  );
}

// ================== KOMPONENTY ==================
function FloorBadge({ floor, total = 3 }: { floor: number; total?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="grid gap-0.5" style={{ gridTemplateRows: `repeat(${total}, minmax(0, 1fr))`, gridAutoFlow: "row" }}>
        {Array.from({ length: total }, (_, i) => total - i).map((f) => (
          <div key={f} className={`h-2.5 w-6 rounded ${f === floor ? "bg-black" : "bg-neutral-300"}`} />
        ))}
      </div>
      <span className="text-xs text-neutral-700">Piętro {floor}</span>
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

  function ContactSimple() {
  return (
    <section id="contact-section" className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* lewa kolumna – dane biura */}
        <div>
          <div className="text-sm text-neutral-500 mb-2">Kontakt</div>
          <h2 className="text-4xl font-semibold leading-tight">
            Zapytaj <span className="text-[#D22121]">o lokal</span>
          </h2>
          <p className="mt-4 text-neutral-600 max-w-lg">
            Zadzwoń, napisz albo odwiedź nas w biurze sprzedaży.
          </p>

          <div className="mt-8 space-y-6 text-neutral-800">
            <div>
              <div className="text-[#D22121] font-medium">Biuro sprzedaży</div>
              <div>ul. Jagiełły 10, Siedlce, Biurowiec Społem</div>
            </div>
            <div>
              <div className="text-[#D22121] font-medium">Godziny otwarcia</div>
              <div>Poniedziałek – Piątek: 7:00 – 15:00</div>
              
            </div>
            <div>
              <div className="text-[#D22121] font-medium">Telefon</div>
              <a href="tel:(025) 6327761" className="text-lg font-semibold hover:underline">
                (025) 632 77 61
              </a>
            </div>
            <div>
              <div className="text-[#D22121] font-medium">E-mail</div>
              <a href="mailto:administracja@spolem.siedlce.pl" className="hover:underline">
                administracja@spolem.siedlce.pl
              </a>
            </div>
          </div>
        </div>

        {/* prawa kolumna – obrazek + CTA */}
        <div className="flex flex-col items-center justify-center">
          <img
            src="/uploads/Siedlce_Inicjatywa_uj01b.jpg"
            alt="Budynek"
            className="rounded-2xl shadow-md mb-6"
          />
          <a
            href="tel:(025) 6327761"
            className="inline-flex items-center justify-center rounded-lg bg-[#D22121] px-6 py-3 text-white font-medium hover:bg-[#B51A1A]"
          >
            Zadzwoń teraz
          </a>
        </div>
      </div>
    </section>
  );
}

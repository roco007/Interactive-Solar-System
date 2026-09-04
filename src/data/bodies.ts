export interface CelestialBody {
  id: string;
  name: string;
  kind: "star" | "planet";
  order: number; // 0 = sun
  color: string; // base hue
  colorDeep: string; // shadow side
  colorPale: string; // lit highlight
  radius: number; // display radius in viewBox px
  au: number; // semi-major axis, AU (0 for sun)
  distMkm: number; // mean distance from sun, million km
  diameterKm: number;
  periodDays: number; // sidereal orbital period (0 for sun)
  periodLabel: string;
  dayLength: string;
  moons: string;
  temp: string;
  distLabel: string;
  fact: string;
  startAngle: number; // radians, so planets scatter on load
  ring?: { rx: number; ry: number; rot: number; width: number; color: string; faint: boolean };
  bands?: boolean;
  spot?: boolean;
  terra?: boolean;
  moonlet?: boolean; // Earth's moon
}

/** Compressed radial scale so all eight orbits fit on screen. */
export const orbitRadius = (au: number): number => 44 + 54 * Math.pow(au, 0.55);

export const SUN: CelestialBody = {
  id: "sun",
  name: "Sun",
  kind: "star",
  order: 0,
  color: "#f6b73c",
  colorDeep: "#c2611c",
  colorPale: "#fff3c4",
  radius: 30,
  au: 0,
  distMkm: 0,
  diameterKm: 1392700,
  periodDays: 0,
  periodLabel: "—",
  dayLength: "≈27 Earth days (equator)",
  moons: "8 planets in tow",
  temp: "5,505 °C surface · 15M °C core",
  distLabel: "Center of the system",
  fact: "The Sun holds 99.86% of the Solar System's mass. Every second it fuses ~600 million tonnes of hydrogen into helium — the light you see left its surface 8 minutes 20 seconds ago.",
  startAngle: 0,
};

export const PLANETS: CelestialBody[] = [
  {
    id: "mercury",
    name: "Mercury",
    kind: "planet",
    order: 1,
    color: "#c9b9a6",
    colorDeep: "#5f5348",
    colorPale: "#efe6d8",
    radius: 3.4,
    au: 0.39,
    distMkm: 57.9,
    diameterKm: 4879,
    periodDays: 88,
    periodLabel: "88 Earth days",
    dayLength: "58.6 Earth days",
    moons: "0",
    temp: "−173 to 427 °C",
    distLabel: "57.9M km · 0.39 AU",
    fact: "Mercury's year lasts just 88 days, yet one full day–night cycle there (sunrise to sunrise) takes 176 Earth days — two of its years pass in a single day.",
    startAngle: 0.9,
  },
  {
    id: "venus",
    name: "Venus",
    kind: "planet",
    order: 2,
    color: "#ecc37e",
    colorDeep: "#9c6a30",
    colorPale: "#fbeed0",
    radius: 5.4,
    au: 0.72,
    distMkm: 108.2,
    diameterKm: 12104,
    periodDays: 224.7,
    periodLabel: "225 Earth days",
    dayLength: "243 days, backwards",
    moons: "0",
    temp: "464 °C mean",
    distLabel: "108.2M km · 0.72 AU",
    fact: "Venus spins backwards, so its Sun rises in the west — and its runaway greenhouse atmosphere makes it the hottest planet, hotter even than Mercury.",
    startAngle: 3.6,
  },
  {
    id: "earth",
    name: "Earth",
    kind: "planet",
    order: 3,
    color: "#4f9df0",
    colorDeep: "#173a6b",
    colorPale: "#cfe8ff",
    radius: 5.7,
    au: 1,
    distMkm: 149.6,
    diameterKm: 12742,
    periodDays: 365.25,
    periodLabel: "365.25 days · 1 year",
    dayLength: "23.9 hours",
    moons: "1",
    temp: "15 °C mean",
    distLabel: "149.6M km · 1.00 AU",
    fact: "The only world known to host liquid surface water — and life. Its large Moon steadies Earth's axial tilt, keeping the climate stable enough for biology to flourish.",
    startAngle: 5.6,
    terra: true,
    moonlet: true,
  },
  {
    id: "mars",
    name: "Mars",
    kind: "planet",
    order: 4,
    color: "#e06a3c",
    colorDeep: "#7e2f14",
    colorPale: "#ffc7a3",
    radius: 4.3,
    au: 1.52,
    distMkm: 227.9,
    diameterKm: 6779,
    periodDays: 687,
    periodLabel: "687 days · 1.9 years",
    dayLength: "24.6 hours",
    moons: "2 — Phobos & Deimos",
    temp: "−63 °C mean",
    distLabel: "227.9M km · 1.52 AU",
    fact: "Home of Olympus Mons, a volcano three times the height of Everest, and Valles Marineris, a canyon that would span the entire United States.",
    startAngle: 2.2,
  },
  {
    id: "jupiter",
    name: "Jupiter",
    kind: "planet",
    order: 5,
    color: "#dfa978",
    colorDeep: "#7c4a28",
    colorPale: "#f7e3c4",
    radius: 14.5,
    au: 5.2,
    distMkm: 778.5,
    diameterKm: 139820,
    periodDays: 4331,
    periodLabel: "4,331 days · 11.9 years",
    dayLength: "9.9 hours — fastest spin",
    moons: "95 confirmed",
    temp: "−108 °C cloud tops",
    distLabel: "778.5M km · 5.20 AU",
    fact: "Jupiter outweighs every other planet combined. Its Great Red Spot — a storm wider than Earth — has been raging for at least 190 years.",
    startAngle: 4.6,
    bands: true,
    spot: true,
  },
  {
    id: "saturn",
    name: "Saturn",
    kind: "planet",
    order: 6,
    color: "#e6cd93",
    colorDeep: "#8a6c3a",
    colorPale: "#faf0d2",
    radius: 12.2,
    au: 9.58,
    distMkm: 1432,
    diameterKm: 116460,
    periodDays: 10747,
    periodLabel: "10,747 days · 29.4 years",
    dayLength: "10.7 hours",
    moons: "146 confirmed",
    temp: "−139 °C cloud tops",
    distLabel: "1.43B km · 9.58 AU",
    fact: "Saturn's rings are 280,000 km across yet only ~10 metres thick in places. The planet itself is less dense than water — it would float, given a big enough bathtub.",
    startAngle: 0.35,
    bands: true,
    ring: { rx: 2.15, ry: 0.62, rot: -18, width: 4.2, color: "#d9c08b", faint: false },
  },
  {
    id: "uranus",
    name: "Uranus",
    kind: "planet",
    order: 7,
    color: "#8fd8dd",
    colorDeep: "#3d7f8c",
    colorPale: "#e2fbfc",
    radius: 8.6,
    au: 19.2,
    distMkm: 2867,
    diameterKm: 50724,
    periodDays: 30589,
    periodLabel: "30,589 days · 84 years",
    dayLength: "17.2 hours, tilted 98°",
    moons: "28 known",
    temp: "−195 °C",
    distLabel: "2.87B km · 19.2 AU",
    fact: "Uranus rolls around the Sun on its side — its axis is tilted 98°, so each pole gets 42 years of continuous daylight followed by 42 years of night.",
    startAngle: 5.0,
    ring: { rx: 1.55, ry: 0.42, rot: 74, width: 1.6, color: "#9fd6da", faint: true },
  },
  {
    id: "neptune",
    name: "Neptune",
    kind: "planet",
    order: 8,
    color: "#5f7fe8",
    colorDeep: "#26379c",
    colorPale: "#c8d6ff",
    radius: 8.3,
    au: 30.05,
    distMkm: 4515,
    diameterKm: 49244,
    periodDays: 59800,
    periodLabel: "59,800 days · 164.8 years",
    dayLength: "16.1 hours",
    moons: "16 known",
    temp: "−201 °C",
    distLabel: "4.51B km · 30.1 AU",
    fact: "Neptune was found with mathematics before telescopes — its position was predicted from wobbles in Uranus' orbit. Its winds top 2,000 km/h, the fastest in the Solar System.",
    startAngle: 2.9,
  },
];

export const ALL_BODIES: CelestialBody[] = [SUN, ...PLANETS];

export const bodyById = (id: string | null): CelestialBody | null =>
  ALL_BODIES.find((b) => b.id === id) ?? null;

export const formatNumber = (n: number): string => n.toLocaleString("en-US");

export const distanceText = (b: CelestialBody): string => {
  if (b.kind === "star") return "—";
  return b.distLabel;
};

export const periodText = (b: CelestialBody): string => b.periodLabel;

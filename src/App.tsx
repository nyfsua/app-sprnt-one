// src/App.tsx
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-sprntText flex flex-col">
      <Nav />

      <main className="relative flex-1 overflow-hidden">
        {/* Starfield */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <Starfield />
        </div>

        {/* MOBILE: flex at bottom, DESKTOP: 3-column grid */}
        <div
          className="
            relative z-10 h-full
            flex flex-col justify-end items-center gap-10
            px-6 md:px-10 py-8
            md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)_minmax(0,1fr)]
            md:items-center md:gap-8
          "
        >
          {/* LEFT PANEL */}
          <section className="space-y-5 max-w-sm text-center md:text-left">
            <div className="leading-none">
              <h1 className="text-5xl font-semibold">One</h1>
              <h2 className="text-3xl font-semibold text-[#B74735] mt-2">
                Core S1 V1.4
              </h2>
            </div>
            <p className="text-xs text-white/60 leading-tight">
              Primary neural cluster visualizing real-time thought processing
              and decision tree branching.
            </p>
            <p className="text-xs">
              Status:{" "}
              <span className="text-[#629B80] font-semibold">
                COGNISANT, LISTENING
              </span>
            </p>
          </section>

          {/* CENTER PANEL – 3D */}
          <section className="flex justify-center items-center">
            <div className="relative w-[80vw] max-w-xl aspect-square md:w-full scale-[1.05] md:scale-100">
             

              <Canvas
                camera={{ position: [0, 0, 4.2], fov: 45 }}
                className="rounded-full"
              >
                <Suspense fallback={null}>
                  <color attach="background" args={["#000000"]} />
                  <ambientLight intensity={0.4} />
                  <directionalLight
                    position={[2, 2, 3]}
                    intensity={1.5}
                    color={new THREE.Color("#B74735")}
                  />
                  <directionalLight position={[-3, -2, -4]} intensity={0.5} />
                 
                  <CoreBlob />
                  <OrbitControls
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={0.4}
                  />
                </Suspense>
              </Canvas>
            </div>
          </section>

          {/* RIGHT PANEL */}
          <section className="flex flex-col gap-6 text-center md:text-right text-xs font-pp tracking-tight">
            <Metric label="PROCESSING LOAD" value="94.2%" />
            <Metric label="SYNAPTIC FIRING RATE" value="402 THz" />
            <Metric label="ACTIVE THOUGHTS" value="8.2M" />
          </section>
        </div>

        {/* BOTTOM BAR */}
        <footer className="absolute bottom-0 left-0 right-0 border-t border-white/10 px-8 py-2 flex items-center justify-between text-[10px] text-white/50">
          <span>● LIVE SIMULATION</span>
          <span>MOUSE_INTERACTION: DISABLED</span>
        </footer>
      </main>
    </div>
  );
}

/* ---------------- NAVIGATION ---------------- */

function Nav() {
  const [date, setDate] = useState({ day: "", month: "", year: "" });

  useEffect(() => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = d
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();
    const year = String(d.getFullYear());
    setDate({ day, month, year });
  }, []);

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-sprntBorder text-[10px] uppercase tracking-[0.22em]">
      {/* LEFT — date */}
      <div className="hidden md:flex items-center gap-[6px] font-ocr">
        <NavTag>{date.day}</NavTag>
        <NavTag>{date.month}</NavTag>
        <NavTag>{date.year}</NavTag>
      </div>

      {/* CENTER LINKS */}
      <div className="flex items-center gap-8 font-ocr text-[12px] text-sprntText tracking-tight">
        <NavLink active>INTERFACE</NavLink>
        <NavLink>NEURAL NET</NavLink>
        <NavLink>PROTOCOL</NavLink>
        <NavLink>LOGS</NavLink>
      </div>

      {/* RIGHT — CTA */}
      <button
        className="hidden md:inline-flex items-center bg-sprntBg border border-sprntAccent text-sprntText px-4 py-[6px]
                   text-[10px] tracking-[0.18em] uppercase font-ocr transition-all
                   hover:bg-sprntAccent hover:text-sprntBg hover:border-sprntAccent"
      >
        Initialize
      </button>
    </nav>
  );
}

function NavTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 py-[3px] bg-sprntBg border border-sprntBorder text-sprntText text-[10px]">
      {children}
    </div>
  );
}

function NavLink({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={
        "transition-colors " +
        (active
          ? "text-sprntAccent"
          : "text-sprntText/70 hover:text-sprntText")
      }
    >
      {children}
    </button>
  );
}

/* ---------------- METRICS ---------------- */

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] tracking-[0.22em] text-white/40">{label}</div>
      <div className="text-xl">{value}</div>
    </div>
  );
}

/* ---------------- 3D ELEMENTS ---------------- */



function CoreBlob() {
  const ref = useRef<THREE.Mesh>(null!);
  const noise = useRef<Float32Array | null>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();

    const geom = ref.current.geometry as THREE.SphereGeometry;
    const pos = geom.attributes.position as THREE.BufferAttribute;

    if (!noise.current) {
      noise.current = new Float32Array(pos.count);
      for (let i = 0; i < pos.count; i++) {
        noise.current[i] = Math.random() * 0.6 + 0.4;
      }
    }

    for (let i = 0; i < pos.count; i++) {
      const nx = pos.getX(i);
      const ny = pos.getY(i);
      const nz = pos.getZ(i);
      const n = noise.current[i];

      const r = 1 + Math.sin(t * 1.4 + n * 4.0) * 0.25;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      pos.setXYZ(i, (nx / len) * r, (ny / len) * r, (nz / len) * r);
    }

    pos.needsUpdate = true;
    ref.current.rotation.y += 0.005;
  });

  const material = new THREE.MeshStandardMaterial({
    metalness: 0.25,
    roughness: 0.15,
    color: new THREE.Color("#B74838"),
    emissive: new THREE.Color("#C85F40"),
    emissiveIntensity: 0.55,
    transparent: true,
    opacity: 0.2,
  });

  return (
    <mesh ref={ref} material={material}>
      <sphereGeometry args={[1.0, 120, 120]} />
    </mesh>
  );
}

function Starfield() {
  const stars = Array.from({ length: 180 });
  return (
    <svg className="w-full h-full" preserveAspectRatio="none">
      {stars.map((_, i) => (
        <circle
          key={i}
          cx={`${Math.random() * 100}%`}
          cy={`${Math.random() * 100}%`}
          r={Math.random() * 0.4 + 0.2}
          fill="white"
          opacity={Math.random() * 0.8}
        />
      ))}
    </svg>
  );
}

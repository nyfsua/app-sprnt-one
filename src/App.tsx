import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { LoginPage } from "./features/auth";
import * as THREE from "three";
import { ProtocolShell } from "./features/protocol";
import { LogShell } from "./features/logbook";

type SectionId = "INTERFACE" | "(O)" | "PROTOCOL" | "LOGS" | "LOGIN";

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>("(O)");

  let content;
  switch (activeSection) {
    case "PROTOCOL":
      content = <ProtocolShell />;
      break;
    case "LOGIN":
      content = <LoginPage />;
      break;
    case "(O)":
      default:
        content = <Home/>;
        break;
    case "LOGS":
    content = <LogShell />;
    break;
    case "INTERFACE":
      content = <InterfaceLayout />;
      break;
  }

  return (
    <div className="min-h-screen bg-black text-sprntText flex flex-col">
      <Nav activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="relative flex-1 overflow-hidden">{content}</main>
    </div>
  );
}
function Home() {
  return (
    <div className="flex items-center justify-center h-full py-60">
      <h1 className="mt-20 text-3xl text-[#C6C6C8]/60">Welcome to One.</h1>
    </div>
  );
}

function InterfaceLayout() {
  return (
    <>
      {/* Starfield */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <Starfield />
      </div>

       

        {/* CENTER PANEL – 3D */}
        <section className="mt-30 flex justify-center items-center">
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
    </>
  );
}

function Nav({
  activeSection,
  onSectionChange,
}: {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
}) {
  const [date, setDate] = useState({ day: "", month: "", year: "" });

  useEffect(() => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const year = String(d.getFullYear());
    setDate({ day, month, year });
  }, []);

  return (
    <nav className="fixed top-[10px] left-[20px] right-[20px] h-12 z-50 flex items-center justify-between bg-transparent font-ocr">
      {/* LEFT – DATE */}
      <div className="hidden md:flex items-center gap-[6px] font-ocr">
        <NavTag>{date.day}</NavTag>
        <NavTag>{date.month}</NavTag>
        <NavTag>{date.year}</NavTag>
      </div>

      {/* CENTER LINKS */}
      <div className="flex items-center gap-[6px] text-[10px] md:px-5 md:py-[6px] font-ocr tracking-tight transition-colors
      hover:text-[#303032]
      hover:border-sprntAccent">

        <NavLink
          active={activeSection === "(O)"}
          onClick={() => onSectionChange("(O)")}
        >
          (O)
        </NavLink>

        <NavLink
          active={activeSection === "INTERFACE"}
          onClick={() => onSectionChange("INTERFACE")}
        >
          INTERFACE
        </NavLink>
        
        <NavLink
          active={activeSection === "PROTOCOL"}
          onClick={() => onSectionChange("PROTOCOL")}
        >
          PROTOCOL
        </NavLink>

        <NavLink
          active={activeSection === "LOGS"}
          onClick={() => onSectionChange("LOGS")}
        >
          LOGS
        </NavLink>
      </div>

      {/* RIGHT — CTA -> LOGIN VIEW */}
      <button
        onClick={() => onSectionChange("LOGIN")}
        className="
          inline-flex items-center
      bg-transparent
      border border-sprntAccent
      px-3 py-[4px] font-ocr uppercase
      md:px-5 md:py-[6px] md:text-[10px] md:tracking-tight
      uppercase
      text-sprntAccent
      transition-colors
      hover:bg-sprntAccent
      hover:text-sprntBg
      hover:border-sprntAccent
        "
      >
        INITIALIZE ONE
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
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex items-center px-2 py-[3px] border text-[10px] md:text-[11px] " +
        "tracking-tight transition-colors " +
        (active
          ? "border-sprntAccent bg-sprntAccent text-sprntBg"
          : "border-sprntBorder/60 bg-black/30 text-sprntText/70 hover:border-sprntAccent hover:text-sprntText")
      }
    >
      {children}
    </button>
  );
}

/* ---------------- 3D elements ---------------- */

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

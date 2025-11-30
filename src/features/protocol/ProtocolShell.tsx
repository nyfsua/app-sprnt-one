// src/features/protocol/ProtocolShell.tsx
import React, { useState } from "react";
import ProtocolMap from "./components/ProtocolMap";
import ProtocolSidebar from "./components/ProtocolSidebar";
import MissionPanel from "./components/MissionPanel";
import type { ProtocolLayerId } from "./types/events";

const ProtocolShell: React.FC = () => {
  const [visibleLayers, setVisibleLayers] = useState<
    Record<ProtocolLayerId, boolean>
  >({
    conflict: true,
    protests: true,
    shipping: true,
    air: true,
    infrastructure: true,
    cultural: true,
  });

  const handleToggleLayer = (layer: ProtocolLayerId) => {
    setVisibleLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="relative w-full h-screen bg-black text-sprntText overflow-hidden">
      {/* MAP BACKGROUND */}
      <ProtocolMap visibleLayers={visibleLayers} />

      {/* FLOATING UI OVERLAYS */}
      <div className="pointer-events-none absolute inset-0">
        {/* LEFT SIDEBAR */}
        <div className="pointer-events-auto absolute left-4 top-[72px] bottom-10 w-[18%] min-w-[220px] max-w-[320px]">
          <ProtocolSidebar
            visibleLayers={visibleLayers}
            onToggleLayer={handleToggleLayer}
          />
        </div>

        {/* RIGHT MISSION PANEL */}
        <div className="pointer-events-auto absolute right-4 top-[72px] bottom-10 w-[18%] min-w-[260px] max-w-[360px]">
          <MissionPanel />
        </div>

        
      </div>
    </div>
  );
};

export default ProtocolShell;

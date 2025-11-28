
import React from "react";
import ProtocolMap from "./components/ProtocolMap";
import ProtocolSidebar from "./components/ProtocolSidebar";
import MissionPanel from "./components/MissionPanel";


const ProtocolShell: React.FC = () => {
  return (
   
    <div className="relative w-full h-screen bg-black text-sprntText overflow-hidden">
      
      <ProtocolMap />

      <div className="pointer-events-none absolute inset-0">
       
        <div className="pointer-events-auto absolute left-4 top-16 bottom-8 w-[18%] min-w-[220px] max-w-[320px]">
  <ProtocolSidebar />
</div>


       

      
       
<div className="pointer-events-auto absolute right-4 top-16 bottom-8 w-[18%] min-w-[260px] max-w-[360px]">
  <MissionPanel />
</div>


        
      </div>
    </div>
  );
};

export default ProtocolShell;









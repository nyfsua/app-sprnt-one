import React from "react";

const BORDER = "#303032";
const BG = "#151515";

const ProtocolSidebar: React.FC = () => {
  return (
    <div
      className=" h-full w-full flex flex-col text-sprntText"
      style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}
    >
      
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <AgentDossierSection />
        <Divider />
        <AgentActivitySection />
        <Divider />
        <ProtocolLayersSection />
        <Divider />
        <ActivityAnalysisSection />
      </div>
    </div>
  );
};

export default ProtocolSidebar;



function AgentDossierSection() {
  return (
    <section className="px-5 pt-5 pb-6 overflow-y-auto scrollbar-hide
">
      {/* avatar + title */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="h-[112px] w-[96px] flex items-center justify-center bg-black"
          style={{ border: `1px solid ${BORDER}` }}
        >
          {/* avatar placeholder */}
          <img className="h-[112px] w-[96px] bg-black " src="public/assets/avatar-placeholder.png"/>
        </div>

        <div className="flex-1">
          <div className="text-[16px] font-pp font-semibold leading-tight">
            User Dossier
          </div>
          <div className="mt-[4px] font-ocr tracking-tight text-[8px] text-[#C6C6C8] leading-tight">
            Personnel Information
          </div>
        </div>
      </div>

      {/* Agent ID */}
      <div className="mb-4">
        <div className="text-[16px] font-ocr uppercase tracking-tight">
          USER 007
        </div>
      </div>

      {/* fields */}
      <dl className="space-y-[6px] text-[10px] leading-tight">
        <DossierRow label="Age" value="unknown" />
        <DossierRow label="Code Name" value="parsival." />
        <DossierRow label="Active Since" value="26/07/2001" />
      </dl>
    </section>
  );
}

function AgentActivitySection() {
  return (
    <section className="px-5 pt-5 pb-6">
      <h2 className="mb-5 text-[15px] font-ocr uppercase tracking-tight">
        USER ACTIVITY
      </h2>

      {/* Totals row */}
      <div className="mb-1 flex justify-between text-[11px] text-sprntMuted">
        <span>Total Missions</span>
        <span>Successful</span>
        <span>Failed</span>
      </div>

      <div className="mb-5 flex justify-between text-[30px] font-ocr tracking-[0.16em]">
        <span>96</span>
        <span>72</span>
        <span>34</span>
      </div>

      {/* Risk rows */}
      <div className="space-y-2">
        <RiskRow count="36" label="High Risk" />
        <RiskRow count="48" label="Medium Risk" />
        <RiskRow count="12" label="Low Risk" />
      </div>
    </section>
  );
}

function ActivityAnalysisSection() {
  return (
    <section className="px-5 pt-5 pb-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-ocr uppercase tracking-tight">
          ACTIVITY ANALYSIS
        </h2>
        <span className="h-[8px] w-[8px] bg-sprntAccent" />
      </div>

      <div className="flex gap-4">
        {/* bubbles */}
        <div className="flex-1 relative h-[170px]">
          <Circle size={130} left={4} top={10} />
          <Circle size={105} left={40} top={70} />
          <Circle size={80} left={0} top={110} />
          <Circle size={60} left={110} top={115} />
        </div>

        {/* region numbers */}
        <div className="flex-1 text-[11px] text-sprntMuted space-y-4">
          <RegionBlock name="AFRICA" value="49.40" />
          <RegionBlock name="AMERICAS" value={`39642\n2637\n8.`} />
          <RegionBlock name="EUROPE" value={`.9\n24609\n6.4`} />
        </div>
      </div>
    </section>
  );
}

function ProtocolLayersSection() {
  const layers = [
    {
      id: "conflict",
      label: "CONFLICTS, POLITICAL VIOLENCE",
      defaultOn: true,
    },
    {
      id: "protests",
      label: "PROTESTS, CIVIL UNREST",
      defaultOn: true,
    },
    {
      id: "shipping",
      label: "SHIPPING LANES AND PORTS",
      defaultOn: true,
    },
    {
      id: "air",
      label: "AIR TRAFFIC CORRIDORS",
      defaultOn: false,
    },
    {
      id: "infrastructure",
      label: "NASCENT INFRASTRUCTURE",
      defaultOn: false,
    },
    {
      id: "culture",
      label: "CULTURAL EVENTS",
      defaultOn: false,
    },
  ];

  return (
    <section className="px-5 pt-5 pb-6">
      <h2 className="mb-4 text-[15px] font-ocr uppercase tracking-tight">
        PROTOCOL LAYERS
      </h2>

      <ul className="space-y-[6px] font-ocr text-[8px] leading-snug tracking-tight">
        {layers.map((layer) => (
          <li key={layer.id}>
            <label className="flex items-center gap-3 cursor-pointer">
              {/* checkbox */}
              <input
                type="checkbox"
                defaultChecked={layer.defaultOn}
                className="
                  h-[8px] w-[8px]
                  cursor-pointer
                  appearance-none
                  border
                  border-[#606062]
                  bg-transparent
                  outline-none
                  checked:bg-sprntAccent
                  checked:border-sprntAccent
                "
              />
              <span className="tracking-[0.08em]">{layer.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}


/* ---------------- SMALL SUBCOMPONENTS ---------------- */

function Divider() {
  return (
    <div
      style={{ borderTop: `1px solid ${BORDER}` }}
      className="mx-0"
    />
  );
}

function DossierRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <div className="flex-1 flex items-center gap-1">
        <span className="text-sprntMuted"></span>
        <span className="uppercase">{label}</span>
      </div>
      <div className="w-[10px] text-sprntMuted text-center">:</div>
      <div className="flex-[1.2]">{value}</div>
    </div>
  );
}

function RiskRow({ count, label }: { count: string; label: string }) {
  return (
    <div className="flex items-stretch gap-2 text-[11px]">
      <div
        className="w-14 flex items-center justify-center text-sprntAccent"
        style={{ border: `1px solid ${BORDER}` }}
      >
        {count}
      </div>
      <div
        className="flex-1 flex items-center px-3"
        style={{ border: `1px solid ${BORDER}` }}
      >
        {label}
      </div>
      <div className="w-12" style={{ border: `1px solid ${BORDER}` }} />
    </div>
  );
}

function RegionBlock({ name, value }: { name: string; value: string }) {
  const lines = value.split("\n");
  return (
    <div>
      <div className="text-sprntText uppercase">{name}</div>
      {lines.map((line, idx) => (
        <div key={idx}>{line}</div>
      ))}
    </div>
  );
}

function Circle({
  size,
  left,
  top,
}: {
  size: number;
  left: number;
  top: number;
}) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left,
        top,
        border: `1px solid ${BORDER}`,
      }}
    />
  );
}

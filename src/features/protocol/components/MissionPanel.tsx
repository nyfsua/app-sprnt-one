// src/features/protocol/components/MissionPanel.tsx
import React from "react";

const BORDER = "#303032";
const BG = "#151515";

interface Mission {
  id: string;
  code: string;
  time: string;
  objective: string;
  status: string;
  location: string;
}

const MOCK_MISSIONS: Mission[] = [
  {
    id: "068",
    code: "loveeseat.",
    time: "13:29",
    objective: "Retrieve documents from truck.",
    status: "Ongoing",
    location: "Western Africa",
  },
  {
    id: "067",
    code: "ninjamonkey.",
    time: "12:56",
    objective: "Infiltrate truck.",
    status: "Successful",
    location: "Western Africa",
  },
  {
    id: "066",
    code: "palantir II.",
    time: "12:23",
    objective: "Track truck.",
    status: "Successful",
    location: "Western Africa",
  },
  {
    id: "065",
    code: "palantir I.",
    time: "11:07",
    objective: "Identify truck.",
    status: "Successful",
    location: "Western Africa",
  },
  {
    id: "064",
    code: "homeweethome.",
    time: "10:38",
    objective: "Visit safehouse, set up equipment.",
    status: "Successful",
    location: "Western Africa",
  },
  {
    id: "063",
    code: "tenets.",
    time: "09:30",
    objective: "Hitchless MMA checkout.",
    status: "Successful",
    location: "Western Africa",
  },
];

const MissionPanel: React.FC = () => {
  return (
    <div
      className="h-full w-full flex flex-col"
      style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}
    >
      {/* HEADER */}
      <header className="px-5 pt-4 pb-3 border-b" style={{ borderColor: BORDER }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[16px] font-ocr uppercase tracking-tight leading-tight">
              Mission Highlights
              <span className="text-sprntAccent align-top text-[11px] ml-[2px]">
                13
              </span>
            </div>
            <div className="mt-[4px] text-[11px] text-sprntMuted leading-tight">
              6 Updates in the last 3 Hours
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-sprntMuted">
            {/* refresh icon placeholder */}
            <div
              className="h-[24px] w-[24px] flex items-center justify-center"
              style={{ border: `1px solid ${BORDER}` }}
            >
              ↻
            </div>
            {/* AI icon placeholder */}
            <div
              className="h-[24px] w-[24px] flex items-center justify-center"
              style={{ border: `1px solid ${BORDER}` }}
            >
              AI
            </div>
          </div>
        </div>
      </header>

      {/* SCROLLABLE LIST */}
      <div className="flex-1 overflow-y-auto overflow-y-auto scrollbar-hide">
        {MOCK_MISSIONS.map((mission, idx) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            isLast={idx === MOCK_MISSIONS.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default MissionPanel;

/* ---------------- CARD ---------------- */

function MissionCard({
  mission,
  isLast,
}: {
  mission: Mission;
  isLast: boolean;
}) {
  return (
    <article
      className={`py-8 px-5 pt-4 pb-4 ${
        !isLast ? "border-b" : ""
      }`}
      style={{ borderColor: BORDER }}
    >
      {/* Top row: task ID + time */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-[18px] font-ocr uppercase tracking-[0.16em]">
          Task {mission.id}
        </div>
        <div className="text-[16px] font-ocr text-sprntAccent">
          {mission.time}
        </div>
      </div>

      {/* Details list */}
      <dl className="text-[11px] leading-[1.5] mb-3">
        <MissionRow label="Code" value={mission.code} boldValue />
        <MissionRow label="Objective" value={mission.objective} />
        <MissionRow label="Status" value={mission.status} />
        <MissionRow label="Location" value={mission.location} />
      </dl>

      {/* Buttons */}
      <div className="flex items-center gap-3 mt-1">
        <button
          className="
            flex-1 h-[32px]
            text-[11px] font-ocr uppercase tracking-[0.16em]
            bg-[#151515]
            text-sprntText
            border
            border-[#C6C6C8]
            flex items-center justify-center
            hover:border-sprntAccent hover:text-sprntAccent
            transition-colors
          "
          
        >
          Details
        </button>

        <button
          className="
            flex-1 h-[32px]
            text-[11px] font-ocr uppercase tracking-[0.16em]
            border
            flex items-center justify-center
            bg-transparent
            text-sprntAccent
            hover:bg-sprntAccent hover:text-black
            transition-colors
          "
          style={{ borderColor: "#B74735" }}
        >
          Raise Alarm
        </button>
      </div>
    </article>
  );
}

/* ---------------- SMALL SUBCOMPONENTS ---------------- */

function MissionRow({
  label,
  value,
  boldValue,
}: {
  label: string;
  value: string;
  boldValue?: boolean;
}) {
  return (
    <div className="flex">
      <div className="w-[68px] text-sprntMuted">{label}</div>
      <div className="w-[10px] text-sprntMuted text-center">:</div>
      <div className={`flex-1 ${boldValue ? "font-semibold" : ""}`}>
        {value}
      </div>
    </div>
  );
}

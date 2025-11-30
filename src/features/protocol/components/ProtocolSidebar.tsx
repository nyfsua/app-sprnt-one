import React, { useEffect, useState } from "react";
import type { ProtocolLayerId } from "../types/events";

const BORDER = "#303032";
const BG = "#151515";

interface ProtocolSidebarProps {
  visibleLayers: Record<ProtocolLayerId, boolean>;
  onToggleLayer: (layer: ProtocolLayerId) => void;
}

const ProtocolSidebar: React.FC<ProtocolSidebarProps> = ({
  visibleLayers,
  onToggleLayer,
}) => {
  return (
    <div
      className="h-full w-full flex flex-col text-sprntText bg-[#050505]/75 border border-[#303032]"
      style={{ backgroundColor: BG, borderColor: BORDER }}
    >
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <AgentDossierSection />
        <Divider />

        <ProtocolLayersSection
          visibleLayers={visibleLayers}
          onToggleLayer={onToggleLayer}
        />

        <Divider />

        <BreakingNewsSection />

        <Divider />
        <ActivityAnalysisSection />
      </div>
    </div>
  );
};

export default ProtocolSidebar;

/* ---------------- SECTIONS ---------------- */

function AgentDossierSection() {
  return (
    <section
      className="px-5 pt-5 pb-6 overflow-y-auto scrollbar-hide
"
    >
      {/* avatar + title */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="h-[112px] w-[96px] flex items-center justify-center bg-black"
          style={{ border: `1px solid ${BORDER}` }}
        >
          {/* avatar placeholder */}
          <img
            className="h-[112px] w-[96px] bg-black "
            src="/assets/avatar-placeholder.png"
          />
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
      <dl className="space-y-[6px] text-[10px] font-ocr leading-tight">
        <DossierRow label="Age" value="unknown" />
        <DossierRow label="Code Name" value="parsival." />
        <DossierRow label="Active Since" value="26/07/2001" />
      </dl>
    </section>
  );
}

function ActivityAnalysisSection() {
  return (
    <section className="px-5 pt-5 pb-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[16px] font-ocr uppercase tracking-tight">
          ACTIVITY ANALYSIS
        </h2>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative h-[170px]">
          <Circle size={130} left={4} top={10} />
          <Circle size={105} left={40} top={70} />
          <Circle size={80} left={0} top={110} />
          <Circle size={60} left={110} top={115} />
        </div>

        <div className="flex-1 px-40 text-[10px] text-sprntMuted space-y-4">
          <RegionBlock name="AFRICA" lines={["49.40"]} />
          <RegionBlock name="AMERICAS" lines={["39642", "2637", "8.0"]} />
          <RegionBlock name="EUROPE" lines={["0.9", "24609", "6.4"]} />
        </div>
      </div>
    </section>
  );
}

function ProtocolLayersSection({
  visibleLayers,
  onToggleLayer,
}: {
  visibleLayers: Record<ProtocolLayerId, boolean>;
  onToggleLayer: (layer: ProtocolLayerId) => void;
}) {
  const layers: { id: ProtocolLayerId; label: string }[] = [
    { id: "conflict", label: "CONFLICTS, POLITICAL VIOLENCE" },
    { id: "protests", label: "PROTESTS, CIVIL UNREST" },
    { id: "shipping", label: "SHIPPING LANES AND PORTS" },
    { id: "air", label: "AIR TRAFFIC CORRIDORS" },
    { id: "infrastructure", label: "NASCENT INFRASTRUCTURE" },
    { id: "cultural", label: "CULTURAL EVENTS" },
  ];

  return (
    <section className="px-5 pt-5 pb-6">
      <h2 className="mb-4 text-[16px] font-ocr uppercase tracking-tight">
        PROTOCOL LAYERS
      </h2>

      <ul className="space-y-[6px] font-ocr text-[10px] leading-snug tracking-tight">
        {layers.map((layer) => (
          <li key={layer.id}>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onToggleLayer(layer.id)}>
              
              {/* TICKER */}
              <div
                className={`h-[10px] w-[10px] border ${
                  visibleLayers[layer.id]
                    ? "bg-sprntAccent border-sprntAccent"
                    : "bg-transparent border-[#606062]"
                }`}
              />

              <span className="tracking-tight">{layer.label}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------- BREAKING NEWS ---------------- */

interface NewsItem {
  id: string;
  title: string;
  url?: string;
  source?: string;
  publishedAt?: string;
}

function BreakingNewsSection() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchNews = async () => {
      try {
        setIsLoading(true);

        // Expect backend to proxy Reuters / geopolitics into this endpoint.
        // Response shape: { articles: Array<{ title, url, source, publishedAt }> }
        const res = await fetch("/api/protocol/news");
        if (!res.ok) throw new Error("Failed to fetch news");

        const data = await res.json();

        if (cancelled) return;

        const articles = Array.isArray(data?.articles)
          ? data.articles.slice(0, 5)
          : [];

        const mapped: NewsItem[] = articles.map((a: any, idx: number) => ({
          id: a.id ?? a.url ?? `news-${idx}`,
          title: a.title ?? "Untitled headline",
          url: a.url,
          source: a.source?.name ?? a.source ?? "Reuters",
          publishedAt: a.publishedAt,
        }));

        if (mapped.length > 0) {
          setItems(mapped);
        } else {
          // fallback if API returns nothing usable
          setItems(getFallbackNews());
        }

        setLastUpdated(new Date().toISOString());
      } catch {
        if (!cancelled) {
          // fallback if request fails
          setItems(getFallbackNews());
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    // initial fetch
    fetchNews();

    // refresh every 7 minutes
    const intervalId = window.setInterval(fetchNews, 7 * 60 * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  const displayTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <section className="px-5 pt-5 pb-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[16px] font-ocr uppercase tracking-tight">
          BREAKING NEWS
        </h2>
        <div className="flex items-center gap-2">
          <span className="h-[8px] w-[8px] bg-sprntAccent rounded-full animate-pulse" />
          <span className="text-[8px] font-ocr text-[#C6C6C8] tracking-tight">
            {isLoading ? "updating…" : "refresh in 7 min"}
          </span>
        </div>
      </div>

      {displayTime && (
        <div className="mb-2 text-[8px] font-ocr text-[#8F8F92] tracking-tight">
          Last update {displayTime}
        </div>
      )}

      <ul className="space-y-[6px] font-ocr text-[10px] leading-snug tracking-tight">
        {items.map((item) => (
          <li key={item.id}>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  block
                  text-sprntText
                  hover:text-sprntAccent
                  transition-colors
                "
              >
                <span className="text-sprntAccent mr-1">•</span>
                {item.title}
              </a>
            ) : (
              <div className="text-sprntText">
                <span className="text-sprntAccent mr-1">•</span>
                {item.title}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function getFallbackNews(): NewsItem[] {
  return [
    {
      id: "fallback-1",
      title: "Geopolitical risk index holds near multi-year highs",
      source: "Reuters",
    },
    {
      id: "fallback-2",
      title: "Major shipping lanes face renewed security threats",
      source: "Reuters",
    },
    {
      id: "fallback-3",
      title: "Regional powers reposition assets after border flare-up",
      source: "Reuters",
    },
    {
      id: "fallback-4",
      title: "Energy corridors under pressure as sanctions expand",
      source: "Reuters",
    },
    {
      id: "fallback-5",
      title: "Central banks weigh conflict risk in outlook revisions",
      source: "Reuters",
    },
  ];
}

/* ---------------- SMALL SUBCOMPONENTS ---------------- */

function Divider() {
  return <div style={{ borderTop: `1px solid ${BORDER}` }} />;
}

function DossierRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <div className="flex-1 flex items-center gap-1">
        <span className="uppercase">{label}</span>
      </div>
      <div className="w-[10px] text-sprntText font-ocr text-center">:</div>
      <div className="flex-[1.2]">{value}</div>
    </div>
  );
}

function RegionBlock({ name, lines }: { name: string; lines: string[] }) {
  return (
    <div>
      <div className="text-sprntText uppercase">{name}</div>
      {lines.map((line) => (
        <div key={name + line}>{line}</div>
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

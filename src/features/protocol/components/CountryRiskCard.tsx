// src/features/protocol/components/CountryRiskCard.tsx
import React from "react";

interface CountryRiskCardProps {
  onClose?: () => void;
}

const CountryRiskCard: React.FC<CountryRiskCardProps> = ({ onClose }) => {
  return (
    <div className="bg-[#050505]/80 border border-[#303032] px-4 py-3 text-[11px] relative">
      {/* Close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="
            absolute right-2 top-2
            h-5 w-5
            flex items-center justify-center
            text-[10px]
            border border-[#303032]
            bg-black/60
            text-sprntMuted
            hover:text-sprntAccent hover:border-sprntAccent
            transition-colors
          "
        >
          ×
        </button>
      )}

      <div className="flex items-center justify-between mb-1 pr-6">
        <div className="font-ocr tracking-[0.18em] uppercase">Nigeria</div>
        <div className="text-sprntAccent font-ocr text-[10px]">
          HIGH RISK
        </div>
      </div>

      <div className="text-sprntMuted mb-2 pr-6">
        Elevated conflict, port congestion, and FX volatility.
      </div>

      <div className="flex justify-between text-[10px] text-sprntMuted pr-6">
        <span>
          Conflict Index: <span className="text-sprntText">0.78</span>
        </span>
        <span>
          Logistics: <span className="text-sprntText">0.62</span>
        </span>
      </div>
    </div>
  );
};

export default CountryRiskCard;

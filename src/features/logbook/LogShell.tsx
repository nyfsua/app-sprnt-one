import React from "react";

type LineItem = {
  id: number;
  product: string;
  price: string;
  qty: string;
  unit: string;
  amount: string;
};

const ITEMS: LineItem[] = [
  {
    id: 1,
    product: "Pipe Ø89×3,5 galvanized electrically welded straight seam G10704-91 (7,8 m) TMK",
    price: "799,68",
    qty: "1",
    unit: "m",
    amount: "799,68",
  },
  {
    id: 2,
    product: "Bend Ø89×3,5 (Du-80) steel (St. 20) 90 degrees G17375",
    price: "366,00",
    qty: "1",
    unit: "qty",
    amount: "366,00",
  },
  {
    id: 3,
    product: "Flat steel flange 80-16-01-1-B-Ct.20-IV G3355915",
    price: "587,44",
    qty: "1",
    unit: "qty",
    amount: "587,44",
  },
  {
    id: 4,
    product: "Steel bolt M16×70 G7798/7805",
    price: "171,71",
    qty: "1",
    unit: "kg",
    amount: "171,71",
  },
  // add more lines or swap for real data
];

const TOTAL_VAT = "9348,85";
const TOTAL_AMOUNT = "2156093,07";

const LogShell: React.FC = () => {
  return (
    <div className=" w-[full] min-h-screen flex items-center justify-center px-4 py-6">
      <div className="relative w-full max-w-4xl border border-[#B74735] bg-[#050505] text-[#E2E1DF] font-ocr text-[11px] leading-tight">
        {/* corner dots (white) */}
        <span className="absolute -top-[6px] -left-[6px] h-[6px] w-[6px] rounded-full bg-white" />
        <span className="absolute -top-[6px] -right-[6px] h-[6px] w-[6px] rounded-full bg-white" />
        <span className="absolute -bottom-[6px] -left-[6px] h-[6px] w-[6px] rounded-full bg-white" />
        <span className="absolute -bottom-[6px] -right-[6px] h-[6px] w-[6px] rounded-full bg-white" />

        {/* TITLE LINE */}
        <div className="border-b border-[#B74735] px-6 py-4">
          <div className="text-[14px] text-[#E2E1DF]">
            Logbook for User 007 from{" "}
            <span className="text-[#B74735]">20.09.2022</span>
          </div>
        </div>

        {/* TABLE HEADER */}
        <div className="border-b border-[#B74735]/80 px-6 pt-4 pb-2 text-[9px] tracking-[0.18em] uppercase text-[#C6C6C8]">
          <div className="grid grid-cols-[26px_minmax(0,3fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3">
            <div>№</div>
            <div>Product Name</div>
            <div className="text-right">Price</div>
            <div className="text-right">Quant</div>
            <div className="text-right">Unit</div>
            <div className="text-right">Amount</div>
          </div>
        </div>

        {/* TABLE BODY */}
        <div className="px-6 pb-4 pt-[6px]">
          {ITEMS.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[26px_minmax(0,3fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3 py-[4px] border-b border-[#262626] last:border-b-0"
            >
              <div className="text-[#B74735]">{item.id}</div>
              <div className="text-[10px] text-[#E2E1DF]">
                <span className="block">{item.product}</span>
              </div>
              <div className="text-right text-[10px]">{item.price}</div>
              <div className="text-right text-[10px]">{item.qty}</div>
              <div className="text-right text-[10px]">{item.unit}</div>
              <div className="text-right text-[10px]">{item.amount}</div>
            </div>
          ))}
        </div>

        {/* LOWER GRID: Payer / Terms / Delivery / VAT */}
        <div className="border-t border-[#B74735]/80 px-6 pt-4 pb-5 grid grid-cols-1 gap-y-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,0.9fr)] md:gap-6 text-[10px]">
          {/* Payer */}
          <div>
            <div className="text-[9px] uppercase tracking-[0.18em] text-[#C6C6C8] mb-[3px]">
              Payer
            </div>
            <div className="text-[#E2E1DF]">Name Company Ltd.</div>
            <div className="mt-1 text-[9px] text-[#8F8F92]">
              119330, Greencountry, C. 04, 41 h 1
            </div>
          </div>

          {/* Terms */}
          <div>
            <div className="text-[9px] uppercase tracking-[0.18em] text-[#C6C6C8] mb-[3px]">
              Terms
            </div>
            <div className="text-[9px] text-[#8F8F92]">
              Prepayment 100%. Prices and terms are valid for 5 banking days.
            </div>
          </div>

          {/* Delivery times */}
          <div>
            <div className="text-[9px] uppercase tracking-[0.18em] text-[#C6C6C8] mb-[3px]">
              Delivery times
            </div>
            <div className="text-[9px] text-[#8F8F92]">
              Completion. Positions 3, 4, 7, 12, 15 available. The rest 3–5
              working days. Shipping is free.
            </div>
          </div>

          {/* VAT + TOTAL */}
          <div className="text-right">
            <div className="text-[9px] tracking-[0.18em] uppercase text-[#C6C6C8]">
              VAT {TOTAL_VAT}
            </div>
            <div className="mt-1 text-[20px] text-[#B74735] leading-none">
              {TOTAL_AMOUNT}
            </div>
            <div className="mt-1 text-[9px] text-[#8F8F92]">
              One hundred ninety-five roubles seven kopecks
            </div>
          </div>
        </div>

        {/* BOTTOM CONTACT + LOGO */}
        <div className="border-t border-[#B74735]/80 px-6 py-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between text-[10px]">
          {/* left: contacts */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-[9px] uppercase tracking-[0.18em] text-[#C6C6C8] mb-[2px]">
                  Responsible
                </div>
                <div className="text-[#E2E1DF]">Nikolas Ferma</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.18em] text-[#C6C6C8] mb-[2px]">
                  E-mail
                </div>
                <div className="text-[#E2E1DF]">ferma.n@gremir.io</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-[#C6C6C8] mb-[2px]">Self Number</div>
                <div className="text-[#B74735]">
                  +6 (334) 728-11-01 &mdash; WhatsApp, Telegram
                </div>
              </div>
              <div>
                <div className="text-[#C6C6C8] mb-[2px]">Work Number</div>
                <div className="text-[#B74735]">
                  +6 (334) 001-14-04,-0329
                </div>
              </div>
            </div>
          </div>

          {/* right: circular logo with S + signature placeholder */}
          <div className="flex items-center gap-6 justify-end">
            <div className="relative h-24 w-24 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full border border-[#B74735] flex items-center justify-center">
                <div className="h-18 w-18 rounded-full border border-[#B74735] flex items-center justify-center">
                  <span className="text-[#B74735] text-[22px] tracking-[0.3em]">
                    S
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right text-[9px] text-[#8F8F92]">
              <div>Manager</div>
              <div className="mt-3 text-[#E2E1DF]">Ferma N.</div>
              <div className="mt-1 italic text-[#B74735] text-[11px]">
                {/* signature placeholder */}
                /s/
              </div>
            </div>
          </div>
        </div>

        {/* very bottom tiny legal line */}
        <div className="border-t border-[#B74735]/80 px-6 py-2 text-[8px] text-[#8F8F92] leading-snug">
          INVOICE/CONTRACT (scan copy sent by e-mail to buyer). This INVOICE is
          an offer to conclude a contract. The buyer&apos;s paid goods shall be
          recognized as accepted under this invoice within the 1st banking day.
        </div>
      </div>
    </div>
  );
};

export default LogShell;

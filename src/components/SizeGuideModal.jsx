import { useEffect } from "react";
import { X } from "lucide-react";

const ink = "#2E236C";
const pink = "#E96B9C";
const cream = "#FDFAF6";

function LogoMark() {
  return (
    <div className="mx-auto flex w-fit flex-col items-center text-center">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <span className="font-display text-[clamp(1.9rem,5.4vw,3.25rem)] font-black leading-none tracking-normal text-[#123B82]">
          Bake
        </span>
        <span className="relative grid h-[clamp(2.35rem,6.3vw,3.7rem)] w-[clamp(2.45rem,6.5vw,3.9rem)] place-items-center rounded-[14px] border-[3px] border-[#123B82] bg-[#F9B5CA] text-[clamp(0.95rem,2.6vw,1.45rem)] font-black leading-none text-white shadow-[inset_0_-8px_0_rgba(18,59,130,0.14)]">
          <span className="absolute -top-3.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-[#123B82] bg-[#E95886]" />
          <span className="absolute -top-1.5 h-2.5 w-10 rounded-t-full border-t-[3px] border-[#123B82]" />
          me
        </span>
        <span className="font-display text-[clamp(1.9rem,5.4vw,3.25rem)] font-black leading-none tracking-normal text-[#123B82]">
          Happy
        </span>
      </div>
      <div className="mt-1.5 flex items-center justify-center gap-2 text-[clamp(0.58rem,1.25vw,0.76rem)] font-semibold uppercase tracking-[0.3em] text-[#123B82]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#F29AB8]" />
        Pastelería artesanal
        <span className="h-1.5 w-1.5 rounded-full bg-[#F29AB8]" />
      </div>
    </div>
  );
}

function Doodles() {
  return (
    <>
      <svg
        className="absolute left-4 top-12 h-24 w-20 text-[#9C5BAA] sm:left-7 sm:top-12 sm:h-[7.5rem] sm:w-24"
        viewBox="0 0 92 130"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M23 16C14 4 4 14 13 27c8 12 22 19 22 19s8-16 6-29c-2-14-15-13-18-1Z"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M63 45c-8-11-19-1-10 12 8 12 22 18 22 18s7-15 4-27c-3-12-13-12-16-3Z"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M31 86C15 66-2 83 12 105c13 20 39 30 39 30s13-26 8-47c-5-22-23-19-28-2Z"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        className="absolute right-4 top-9 h-28 w-20 text-[#9C5BAA] sm:right-8 sm:top-9 sm:h-32 sm:w-24"
        viewBox="0 0 120 160"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M42 10c0 23-11 35-31 39 20 4 31 16 31 39 0-23 11-35 31-39-20-4-31-16-31-39Z"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M83 76c0 19-9 30-27 34 18 4 27 15 27 34 0-19 9-30 27-34-18-4-27-15-27-34Z"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <circle cx="93" cy="23" r="4" fill="#E96B9C" />
        <circle cx="105" cy="57" r="4" fill="#E96B9C" />
        <circle cx="26" cy="91" r="3.5" fill="#E96B9C" />
      </svg>
    </>
  );
}

function SectionPill({ children, className = "" }) {
  return (
    <div
      className={`mx-auto flex min-h-6 w-fit min-w-[7.2rem] items-center justify-center rounded-full bg-[linear-gradient(90deg,#FBC4D2,#B264B4)] px-5 text-center text-[0.68rem] font-bold uppercase tracking-[0.3em] text-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function GuideTitle() {
  return (
    <h2
      id="size-guide-title"
      className="mx-auto mt-4 flex max-w-[28rem] items-center justify-center rounded-full border border-dashed border-[#D86092] bg-[#FFE3EC] px-4 py-2.5 text-center text-[clamp(1.18rem,3.25vw,1.9rem)] font-bold uppercase tracking-[0.18em] text-[#542477] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.75)] sm:tracking-[0.22em]"
    >
      Guía de tamaños
    </h2>
  );
}

function LabelPill({ children }) {
  return (
    <div className="mx-auto mt-1 w-fit min-w-[6.4rem] rounded-full bg-[#F5D1E6] px-4 py-1 text-center text-[0.62rem] font-bold uppercase tracking-[0.3em] text-[#4B2673]">
      {children}
    </div>
  );
}

function MeasureText({ x, y, fontSize = 13.5, children }) {
  return (
    <text
      x={x}
      y={y}
      fill={pink}
      stroke={cream}
      strokeWidth="3.2"
      paintOrder="stroke"
      fontSize={fontSize}
      fontWeight="800"
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Poppins, sans-serif"
    >
      {children}
    </text>
  );
}

function HorizontalMeasure({
  x1,
  x2,
  y,
  label,
  labelPosition = "above",
  labelOffset = 12,
  fontSize,
}) {
  const center = (x1 + x2) / 2;
  const labelY = labelPosition === "below" ? y + labelOffset : y - labelOffset;

  return (
    <>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={pink} strokeWidth="1.5" />
      <line x1={x1} x2={x1} y1={y - 5} y2={y + 5} stroke={pink} strokeWidth="1.5" />
      <line x1={x2} x2={x2} y1={y - 5} y2={y + 5} stroke={pink} strokeWidth="1.5" />
      <MeasureText x={center} y={labelY} fontSize={fontSize}>
        {label}
      </MeasureText>
    </>
  );
}

function VerticalMeasure({ x, y1, y2, label, labelOffset = 14, fontSize = 13.5 }) {
  return (
    <>
      <line x1={x} x2={x} y1={y1} y2={y2} stroke={pink} strokeWidth="1.5" />
      <line x1={x - 5} x2={x + 5} y1={y1} y2={y1} stroke={pink} strokeWidth="1.5" />
      <line x1={x - 5} x2={x + 5} y1={y2} y2={y2} stroke={pink} strokeWidth="1.5" />
      <text
        x={x + labelOffset}
        y={(y1 + y2) / 2}
        fill={pink}
        stroke={cream}
        strokeWidth="3.2"
        paintOrder="stroke"
        fontSize={fontSize}
        fontWeight="800"
        dominantBaseline="middle"
        fontFamily="Poppins, sans-serif"
      >
        {label}
      </text>
    </>
  );
}

function Cylinder({ cx, topY, width, height }) {
  const rx = width / 2;
  const ry = Math.max(9, width * 0.11);
  const left = cx - rx;
  const bottomY = topY + height;

  return (
    <g stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx={cx} cy={topY} rx={rx} ry={ry} fill={cream} />
      <path d={`M${left} ${topY}v${height}c0 ${ry} ${width} ${ry} ${width} 0V${topY}`} fill={cream} />
      <path d={`M${left} ${bottomY}c0 ${ry} ${width} ${ry} ${width} 0`} />
    </g>
  );
}

function Cherry({ cx, cy }) {
  return (
    <g stroke={ink} strokeWidth="1.8" fill="none" strokeLinecap="round">
      <ellipse cx={cx} cy={cy} rx="8" ry="4.5" fill={cream} />
      <path d={`M${cx} ${cy - 4}c2-8 9-10 15-13`} />
    </g>
  );
}

function TwoTierCake({ top, base, label, portions }) {
  const cakeCenter = 128;
  const baseWidth = base === "18 cm." ? 112 : base === "22 cm." ? 132 : 154;
  const topWidth = top === "14 cm." ? 84 : 104;
  const topHeight = 58;
  const baseHeight = 60;
  const topY = 66;
  const baseY = 132;
  const topLeft = cakeCenter - topWidth / 2;
  const topRight = cakeCenter + topWidth / 2;
  const baseLeft = cakeCenter - baseWidth / 2;
  const baseRight = cakeCenter + baseWidth / 2;

  return (
    <article className="text-center">
      <svg
        viewBox="0 0 290 250"
        className="mx-auto h-auto w-full max-w-[13.1rem] sm:max-w-[14.25rem]"
        aria-hidden="true"
      >
        <HorizontalMeasure x1={topLeft} x2={topRight} y={34} label={top} fontSize={13.5} />
        <Cylinder cx={cakeCenter} topY={baseY} width={baseWidth} height={baseHeight} />
        <Cylinder cx={cakeCenter} topY={topY} width={topWidth} height={topHeight} />
        <Cherry cx={cakeCenter} cy={topY} />
        <VerticalMeasure
          x={topRight + 22}
          y1={topY}
          y2={topY + topHeight}
          label="14 cm."
          labelOffset={15}
          fontSize={13.5}
        />
        <VerticalMeasure
          x={baseRight + 22}
          y1={baseY}
          y2={baseY + baseHeight}
          label="14 cm."
          labelOffset={15}
          fontSize={13.5}
        />
        <HorizontalMeasure
          x1={baseLeft}
          x2={baseRight}
          y={218}
          label={base}
          labelPosition="below"
          labelOffset={13}
          fontSize={13.5}
        />
      </svg>
      <LabelPill>{label}</LabelPill>
      <p className="mt-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#1E3264] sm:text-[0.72rem]">
        {portions}
      </p>
    </article>
  );
}

function OneTierCake({ diameter, height, name, portions }) {
  const cakeCenter = 96;
  const width = diameter === "18 cm." ? 92 : 116;
  const cakeHeight = height === "14 cm." ? 58 : height === "15 cm." ? 65 : 76;
  const topY = 58;
  const left = cakeCenter - width / 2;
  const right = cakeCenter + width / 2;

  return (
    <article className="text-center">
      <svg
        viewBox="0 0 250 178"
        className="mx-auto h-auto w-full max-w-[10.1rem] sm:max-w-[10.75rem]"
        aria-hidden="true"
      >
        <HorizontalMeasure x1={left} x2={right} y={29} label={diameter} fontSize={13.5} />
        <Cylinder cx={cakeCenter} topY={topY} width={width} height={cakeHeight} />
        <Cherry cx={cakeCenter} cy={topY} />
        <VerticalMeasure
          x={right + 18}
          y1={topY}
          y2={topY + cakeHeight}
          label={height}
          labelOffset={11}
          fontSize={13.5}
        />
      </svg>
      <LabelPill>{name}</LabelPill>
      <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.11em] text-[#1E3264] sm:text-[0.68rem]">
        {portions}
      </p>
    </article>
  );
}

function GiftCake() {
  return (
    <svg
      viewBox="0 0 132 118"
      className="mx-auto h-auto w-full max-w-[8.5rem] sm:max-w-[9.5rem]"
      aria-hidden="true"
    >
      <g stroke={ink} strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round">
        <path d="M23 38 66 16l43 22-43 23-43-23Z" fill={cream} />
        <path d="M23 38v40l43 23V61L23 38Z" fill={cream} />
        <path d="M109 38v40l-43 23V61l43-23Z" fill={cream} />
        <path d="M66 16v85M43 27l43 23M88 27 45 50" />
        <path d="M60 27c-7-12-25-8-21 5 3 10 19 8 27 0 8 8 24 10 27 0 4-13-14-17-21-5" />
      </g>
    </svg>
  );
}

function MiniRoundCake() {
  return (
    <svg
      viewBox="0 0 195 150"
      className="mx-auto h-auto w-full max-w-[9.5rem] sm:max-w-[10.5rem]"
      aria-hidden="true"
    >
      <g transform="translate(10, 2) scale(1.28)">
        <Cylinder cx={60} topY={39} width={60} height={38} />
        <path
          d="M30 39c6-8 12 3 18-5s11 4 18-5 11 6 18 0"
          fill="none"
          stroke={ink}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g fill={pink}>
          <circle cx="34" cy="31" r="2.6" />
          <circle cx="60" cy="25" r="2.6" />
          <circle cx="84" cy="32" r="2.6" />
        </g>
      </g>
      <HorizontalMeasure
        x1={48}
        x2={125}
        y={118}
        label="14 cm."
        labelPosition="below"
        labelOffset={11}
        fontSize={14}
      />
      <VerticalMeasure
        x={143}
        y1={52}
        y2={101}
        label="7 cm."
        labelOffset={11}
        fontSize={14}
      />
    </svg>
  );
}

function MiniHeartCake() {
  return (
    <svg
      viewBox="0 0 195 150"
      className="mx-auto h-auto w-full max-w-[9.5rem] sm:max-w-[10.5rem]"
      aria-hidden="true"
    >
      <g transform="translate(10, 2) scale(1.28)">
        <g stroke={ink} strokeWidth="2.4" fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path
            d="M60 37c-11-17-35-7-31 13 4 23 31 30 31 30s27-7 31-30c4-20-20-30-31-13Z"
            fill={cream}
          />
          <path d="M29 50v17c0 18 31 28 31 28s31-10 31-28V50" />
          <path d="M28 49c7-4 11 4 17-3s10 5 16-2 10 5 16-2 11 5 16 1" />
        </g>
      </g>
      <HorizontalMeasure
        x1={47}
        x2={126}
        y={135}
        label="14 cm."
        labelPosition="below"
        labelOffset={11}
        fontSize={14}
      />
      <VerticalMeasure
        x={144}
        y1={66}
        y2={110}
        label="7 cm."
        labelOffset={11}
        fontSize={14}
      />
    </svg>
  );
}

function TinyCakeSection() {
  return (
    <section className="flex min-h-full flex-col items-center justify-center">
      <SectionPill className="min-w-[9.5rem] !bg-[#F5C3D5] !text-[#4B2673]">
        Tiny cake
      </SectionPill>
      <p className="mt-1.5 text-center text-[0.54rem] font-bold uppercase tracking-[0.15em] text-[#4B2673] sm:text-[0.58rem]">
        Pequeñas para 6 a 7 porciones
      </p>
      <div className="mt-4 grid w-full gap-6 items-end sm:grid-cols-3 sm:gap-3">
        <GiftCake />
        <MiniRoundCake />
        <MiniHeartCake />
      </div>
    </section>
  );
}

function HeartCake({ width, portions }) {
  const config =
    width === "17 cm."
      ? {
          shapeTransform: "translate(48 18) scale(.93)",
          measureLeft: 73,
          measureRight: 200,
          measureY: 175,
          measureX: 218,
          verticalTop: 78,
          verticalBottom: 140,
        }
      : {
          shapeTransform: "translate(16 2) scale(1.19)",
          measureLeft: 48,
          measureRight: 210,
          measureY: 196,
          measureX: 228,
          verticalTop: 79,
          verticalBottom: 158,
        };

  return (
    <article className="text-center">
      <svg
        viewBox="0 0 300 214"
        className="mx-auto h-auto w-full max-w-[12rem] sm:max-w-[13.15rem]"
        aria-hidden="true"
      >
        <g transform={config.shapeTransform}>
          <path
            d="M95 40C73 9 24 24 27 66c3 50 68 65 68 65s65-15 68-65c3-42-46-57-68-26Z"
            fill={cream}
            stroke={ink}
            strokeWidth="3"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M27 65v26c0 43 68 57 68 57s68-14 68-57V65"
            fill="none"
            stroke={ink}
            strokeWidth="3"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M24 66c10-7 16 7 25-4s15 7 24-4 15 7 24-5 16 8 25-4 15 7 25 1 15 7 20 3"
            fill="none"
            stroke={ink}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M39 85c8-4 13 4 21-3s13 5 21-2 13 5 21-3 13 5 21-3 12 5 20 1"
            fill="none"
            stroke={ink}
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>
        <HorizontalMeasure
          x1={config.measureLeft}
          x2={config.measureRight}
          y={config.measureY}
          label={width}
          labelPosition="below"
          labelOffset={13}
          fontSize={14}
        />
        <VerticalMeasure
          x={config.measureX}
          y1={config.verticalTop}
          y2={config.verticalBottom}
          label="12 cm."
          labelOffset={12}
          fontSize={14}
        />
      </svg>
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#1E3264] sm:text-xs">
        Corazón {portions}
      </p>
    </article>
  );
}

function Divider() {
  return (
    <div className="my-4 flex items-center gap-3 text-[#E96B9C] sm:my-5">
      <span className="h-px flex-1 bg-[#F0A8BF]" />
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path
          d="M12 20s-7-4.7-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.3-7 10-7 10Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
      <span className="h-px flex-1 bg-[#F0A8BF]" />
    </div>
  );
}

export default function SizeGuideModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/60 p-3 sm:p-5"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="relative max-h-[94dvh] w-full max-w-[920px] overflow-y-auto rounded-lg bg-[#FDFAF6] shadow-lift"
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
      >
        <button
          type="button"
          className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-ink shadow-sm sm:right-4 sm:top-4"
          onClick={onClose}
          aria-label="Cerrar guía de tamaños"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className="relative overflow-hidden px-4 pb-7 pt-12 sm:px-8 sm:pb-8 sm:pt-12">
          <Doodles />
          <LogoMark />
          <GuideTitle />

          <div className="relative z-10 mt-4 sm:mt-5">
            <SectionPill>2 pisos</SectionPill>
            <div className="mt-3 grid gap-4 sm:grid-cols-3 sm:gap-4">
              <TwoTierCake
                top="14 cm."
                base="18 cm."
                label="Small"
                portions="25 - 30 porciones"
              />
              <TwoTierCake
                top="18 cm."
                base="22 cm."
                label="Medium"
                portions="40 - 45 porciones"
              />
              <TwoTierCake
                top="18 cm."
                base="26 cm."
                label="Large"
                portions="60 - 65 porciones"
              />
            </div>

            <Divider />

            <section>
              <SectionPill className="!bg-[#F9C7D8] !text-[#4B2673]">
                1 piso
              </SectionPill>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <OneTierCake
                  diameter="18 cm."
                  height="14 cm."
                  name="Small"
                  portions="15 porciones"
                />
                <OneTierCake
                  diameter="22 cm."
                  height="15 cm."
                  name="Medium"
                  portions="20 porciones"
                />
                <OneTierCake
                  diameter="22 cm."
                  height="18 cm."
                  name="Large"
                  portions="30 porciones"
                />
              </div>
            </section>

            <Divider />

            <section>
              <TinyCakeSection />
            </section>

            <Divider />

            <section>
              <SectionPill className="!bg-[#F9C7D8] !text-[#4B2673]">
                Corazón
              </SectionPill>
              <div className="mt-3 grid gap-5 sm:grid-cols-2">
                <HeartCake width="17 cm." portions="20 porciones" />
                <HeartCake width="23 cm." portions="30 porciones" />
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

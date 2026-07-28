import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const ink = "#2E236C";
const pink = "#E96B9C";
const cream = "#FFF7F0";

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
      className={`mx-auto flex min-h-6 w-fit min-w-[7.2rem] items-center justify-center rounded-full bg-[linear-gradient(90deg,#E49AAF,#A16BAA)] px-5 text-center text-[0.68rem] font-bold uppercase tracking-[0.3em] text-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function GuideTitle() {
  return (
    <h2
      id="size-guide-title"
      className="mx-auto mt-4 flex max-w-[28rem] items-center justify-center rounded-full border border-dashed border-[#C84478] bg-[#FFD4E2] px-4 py-2.5 text-center text-[clamp(1.18rem,3.25vw,1.9rem)] font-bold uppercase tracking-[0.18em] text-[#542477] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.75)] sm:tracking-[0.22em]"
    >
      Guía de tamaños
    </h2>
  );
}

function LabelPill({ children }) {
  return (
    <div className="mx-auto mt-2 w-fit min-w-[6.8rem] rounded-full bg-[#EFB2D2] px-4 py-1.5 text-center text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#4B2673]">
      {children}
    </div>
  );
}

function MeasureText({
  x,
  y,
  fontSize = 19,
  textAnchor = "middle",
  children,
}) {
  return (
    <text
      x={x}
      y={y}
      fill="#C84F80"
      fontSize={fontSize}
      fontWeight="800"
      textAnchor={textAnchor}
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
  labelOffset = 17,
  fontSize = 19,
}) {
  const center = (x1 + x2) / 2;
  const labelY = labelPosition === "below" ? y + labelOffset : y - labelOffset;

  return (
    <>
      <line
        x1={x1}
        x2={x2}
        y1={y}
        y2={y}
        stroke={pink}
        strokeWidth="1.8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={x1}
        x2={x1}
        y1={y - 5}
        y2={y + 5}
        stroke={pink}
        strokeWidth="1.8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={x2}
        x2={x2}
        y1={y - 5}
        y2={y + 5}
        stroke={pink}
        strokeWidth="1.8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <MeasureText x={center} y={labelY} fontSize={fontSize}>
        {label}
      </MeasureText>
    </>
  );
}

function VerticalMeasure({ x, y1, y2, label, labelOffset = 14, fontSize = 19 }) {
  return (
    <>
      <line
        x1={x}
        x2={x}
        y1={y1}
        y2={y2}
        stroke={pink}
        strokeWidth="1.8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={x - 5}
        x2={x + 5}
        y1={y1}
        y2={y1}
        stroke={pink}
        strokeWidth="1.8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={x - 5}
        x2={x + 5}
        y1={y2}
        y2={y2}
        stroke={pink}
        strokeWidth="1.8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <MeasureText
        x={x + labelOffset}
        y={(y1 + y2) / 2}
        fontSize={fontSize}
        textAnchor="start"
      >
        {label}
      </MeasureText>
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
  const baseWidth = base === "18 cm" ? 112 : base === "22 cm" ? 132 : 154;
  const topWidth = top === "14 cm" ? 84 : 104;
  const topHeight = 58;
  const baseHeight = 60;
  const topY = 66;
  const baseY = 132;
  const topLeft = cakeCenter - topWidth / 2;
  const topRight = cakeCenter + topWidth / 2;
  const baseLeft = cakeCenter - baseWidth / 2;
  const baseRight = cakeCenter + baseWidth / 2;

  return (
    <article className="flex h-full flex-col items-center text-center">
      <div className="flex w-full justify-center">
        <svg
          viewBox="0 0 320 256"
          className="block h-auto w-full max-w-[13.75rem] sm:max-w-[14.85rem]"
          aria-hidden="true"
        >
          <HorizontalMeasure x1={topLeft} x2={topRight} y={34} label={top} />
          <Cylinder cx={cakeCenter} topY={baseY} width={baseWidth} height={baseHeight} />
          <Cylinder cx={cakeCenter} topY={topY} width={topWidth} height={topHeight} />
          <Cherry cx={cakeCenter} cy={topY} />
          <VerticalMeasure
            x={topRight + 18}
            y1={topY}
            y2={topY + topHeight}
            label="14 cm"
          />
          <VerticalMeasure
            x={baseRight + 18}
            y1={baseY}
            y2={baseY + baseHeight}
            label="14 cm"
          />
          <HorizontalMeasure
            x1={baseLeft}
            x2={baseRight}
            y={218}
            label={base}
            labelPosition="below"
            labelOffset={17}
          />
        </svg>
      </div>
      <LabelPill>{label}</LabelPill>
      <p className="mt-1.5 min-h-[1.2rem] text-center text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#1E3264] sm:text-[0.76rem]">
        {portions}
      </p>
    </article>
  );
}

function OneTierCake({ diameter, height, name, portions }) {
  const cakeCenter = 96;
  const width = diameter === "18 cm" ? 92 : 116;
  const cakeHeight = height === "14 cm" ? 58 : height === "15 cm" ? 65 : 76;
  const cakeBottom = 142;
  const topY = cakeBottom - cakeHeight;
  const left = cakeCenter - width / 2;
  const right = cakeCenter + width / 2;

  return (
    <article className="flex h-full flex-col items-center text-center">
      <div className="flex w-full justify-center">
        <svg
          viewBox="0 0 272 190"
          className="block h-auto w-full max-w-[10.6rem] sm:max-w-[11.3rem]"
          aria-hidden="true"
        >
          <HorizontalMeasure
            x1={left}
            x2={right}
            y={topY - 28}
            label={diameter}
          />
          <Cylinder cx={cakeCenter} topY={topY} width={width} height={cakeHeight} />
          <Cherry cx={cakeCenter} cy={topY} />
          <VerticalMeasure
            x={right + 18}
            y1={topY}
            y2={topY + cakeHeight}
            label={height}
          />
        </svg>
      </div>
      <LabelPill>{name}</LabelPill>
      <p className="mt-1.5 min-h-[1.2rem] text-center text-[0.7rem] font-bold uppercase tracking-[0.11em] text-[#1E3264] sm:text-[0.74rem]">
        {portions}
      </p>
    </article>
  );
}

function GiftCake() {
  return (
    <svg
      viewBox="0 0 132 118"
      className="mx-auto h-auto w-full max-w-[7.5rem] sm:max-w-[8rem]"
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

function ButtercreamDrop({ x, y, scale = 1, rotate = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path
        d="M0-8C-1-4-6-1-6 4c0 4 3 6 6 6s6-2 6-6c0-5-5-8-6-12Z"
        fill={cream}
        stroke={ink}
        strokeWidth="2"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M-2 6C-1 3-1 0 0-3M2 6C1 3 1 0 0-3"
        fill="none"
        stroke={ink}
        strokeWidth="1.1"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}

function MiniRoundCake() {
  return (
    <svg
      viewBox="0 0 235 170"
      className="mx-auto h-auto w-full max-w-[9.25rem] sm:max-w-[9.75rem]"
      aria-hidden="true"
    >
      <g transform="translate(-13 -5) scale(1.12)">
        <path
          d="M68 51v53c0 9 84 9 84 0V51"
          fill={cream}
          stroke={ink}
          strokeWidth="2.7"
          strokeLinejoin="round"
        />
        <ellipse
          cx="110"
          cy="51"
          rx="42"
          ry="11"
          fill={cream}
          stroke={ink}
          strokeWidth="2.7"
        />
        <path
          d="M68 103c0 10 84 10 84 0"
          fill="none"
          stroke={ink}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        <ButtercreamDrop x={73} y={49} scale={0.78} rotate={-18} />
        <ButtercreamDrop x={81} y={43} scale={0.82} rotate={-12} />
        <ButtercreamDrop x={93} y={39} scale={0.86} rotate={-6} />
        <ButtercreamDrop x={106} y={37} scale={0.88} />
        <ButtercreamDrop x={120} y={38} scale={0.86} rotate={5} />
        <ButtercreamDrop x={133} y={42} scale={0.82} rotate={11} />
        <ButtercreamDrop x={145} y={49} scale={0.78} rotate={18} />
        <ButtercreamDrop x={78} y={55} scale={0.8} rotate={-16} />
        <ButtercreamDrop x={90} y={58} scale={0.84} rotate={-8} />
        <ButtercreamDrop x={104} y={60} scale={0.86} />
        <ButtercreamDrop x={119} y={59} scale={0.84} rotate={7} />
        <ButtercreamDrop x={133} y={56} scale={0.8} rotate={15} />
      </g>

      <HorizontalMeasure
        x1={63}
        x2={157}
        y={134}
        label="14 cm"
        labelPosition="below"
        labelOffset={16}
      />
      <VerticalMeasure
        x={172}
        y1={52}
        y2={113}
        label="7 cm"
      />
    </svg>
  );
}

function MiniHeartCake() {
  const heartTopPath =
    "M108 45C96 29 70 31 62 49c-11 25 13 45 46 62 33-17 57-37 46-62-8-18-34-20-46-4Z";

  return (
    <svg
      viewBox="0 0 235 170"
      className="mx-auto h-auto w-full max-w-[9.25rem] sm:max-w-[9.75rem]"
      aria-hidden="true"
    >
      <g transform="translate(5 -5) rotate(5 108 88)">
        <path
          d="M62 55v28c0 26 46 49 46 49s46-23 46-49V55Z"
          fill={cream}
          stroke={ink}
          strokeWidth="2.7"
          strokeLinejoin="round"
        />
        <path
          d={heartTopPath}
          fill={cream}
          stroke={ink}
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
      </g>

      <HorizontalMeasure
        x1={57}
        x2={159}
        y={148}
        label="14 cm"
        labelPosition="below"
        labelOffset={16}
      />
      <VerticalMeasure
        x={176}
        y1={55}
        y2={123}
        label="7 cm"
      />
    </svg>
  );
}

function TinyCakeItem({ label, children }) {
  return (
    <div className="grid h-full grid-rows-[8.5rem_auto] text-center">
      <div className="flex items-center justify-center">{children}</div>
      <p className="mt-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#1E3264]">
        {label}
      </p>
    </div>
  );
}

function TinyCakeSection() {
  return (
    <section className="flex flex-col items-center">
      <SectionPill className="min-w-[9.5rem] !bg-[#EFA6C2] !text-[#4B2673]">
        Tiny cake
      </SectionPill>
      <p className="mt-2 text-center text-[0.64rem] font-bold uppercase tracking-[0.13em] text-[#4B2673] sm:text-[0.68rem]">
        Pequeñas para 6 a 7 porciones
      </p>
      <div className="mt-4 grid w-full auto-rows-fr items-stretch gap-7 md:grid-cols-3 md:gap-6">
        <TinyCakeItem label="Presentación">
          <GiftCake />
        </TinyCakeItem>
        <TinyCakeItem label="Redonda">
          <MiniRoundCake />
        </TinyCakeItem>
        <TinyCakeItem label="Corazón">
          <MiniHeartCake />
        </TinyCakeItem>
      </div>
    </section>
  );
}

function HeartCake({ width, portions }) {
  const config =
    width === "17 cm"
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
          shapeTransform: "translate(16 -20) scale(1.19)",
          measureLeft: 48,
          measureRight: 210,
          measureY: 174,
          measureX: 228,
          verticalTop: 57,
          verticalBottom: 136,
        };

  return (
    <article className="flex h-full flex-col items-center text-center">
      <div className="flex w-full justify-center">
        <svg
          viewBox="0 0 332 226"
          className="block h-auto w-full max-w-[12.75rem] sm:max-w-[13.85rem]"
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
          </g>
          <HorizontalMeasure
            x1={config.measureLeft}
            x2={config.measureRight}
            y={config.measureY}
            label={width}
            labelPosition="below"
            labelOffset={17}
          />
          <VerticalMeasure
            x={config.measureX}
            y1={config.verticalTop}
            y2={config.verticalBottom}
            label="12 cm"
          />
        </svg>
      </div>
      <p className="mt-3 min-h-[1.2rem] text-center text-[0.74rem] font-bold uppercase tracking-[0.12em] text-[#1E3264] sm:text-xs">
        Corazón {portions}
      </p>
    </article>
  );
}

function Divider() {
  return (
    <div className="my-6 flex items-center gap-4 text-[#E96B9C] sm:my-7">
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

export function SizeGuideContent({ className = "" }) {
  return (
    <div className={`relative overflow-hidden px-4 pb-7 pt-12 sm:px-8 sm:pb-8 sm:pt-12 ${className}`}>
      <Doodles />
      <LogoMark />
      <GuideTitle />

      <div className="relative z-10 mt-7">
        <SectionPill>2 pisos</SectionPill>
        <div className="mt-5 grid auto-rows-fr items-stretch gap-8 md:grid-cols-3 md:gap-6">
          <TwoTierCake
            top="14 cm"
            base="18 cm"
            label="Small"
            portions="25 - 30 porciones"
          />
          <TwoTierCake
            top="18 cm"
            base="22 cm"
            label="Medium"
            portions="40 - 45 porciones"
          />
          <TwoTierCake
            top="18 cm"
            base="26 cm"
            label="Large"
            portions="60 - 65 porciones"
          />
        </div>

        <Divider />

        <section>
          <SectionPill className="!bg-[#EFA6C2] !text-[#4B2673]">
            1 piso
          </SectionPill>
          <div className="mt-5 grid auto-rows-fr items-stretch gap-8 md:grid-cols-3 md:gap-6">
            <OneTierCake
              diameter="18 cm"
              height="14 cm"
              name="Small"
              portions="15 porciones"
            />
            <OneTierCake
              diameter="22 cm"
              height="15 cm"
              name="Medium"
              portions="20 porciones"
            />
            <OneTierCake
              diameter="22 cm"
              height="18 cm"
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
          <SectionPill className="!bg-[#EFA6C2] !text-[#4B2673]">
            Corazón
          </SectionPill>
          <div className="mt-5 grid auto-rows-fr items-stretch gap-8 sm:grid-cols-2 sm:gap-6">
            <HeartCake width="17 cm" portions="20 porciones" />
            <HeartCake width="23 cm" portions="30 porciones" />
          </div>
        </section>
      </div>
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

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/60 p-3 sm:p-5"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="modal-panel-enter relative max-h-[94dvh] w-full max-w-[920px] overflow-y-auto rounded-lg bg-[#FFF7F0] shadow-lift"
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

        <SizeGuideContent />
      </section>
    </div>,
    document.body,
  );
}

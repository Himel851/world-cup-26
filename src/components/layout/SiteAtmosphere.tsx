import { AnimatedFlagField } from "@/components/layout/AnimatedFlagField";
import { hostFlag } from "@/data/host-stadiums";

/** Single compressed stadium photo — one request, low priority. */
const STADIUM_PHOTO =
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=55";

const HOST_NATIONS = [
  { code: "us", className: "left-[2%] top-[6%] -rotate-12" },
  { code: "mx", className: "right-[2%] top-[8%] rotate-12" },
  { code: "ca", className: "bottom-[10%] left-1/2 -translate-x-1/2 rotate-3" },
] as const;

interface SiteAtmosphereProps {
  children: React.ReactNode;
}

/** Site-wide fixed backdrop: stadium + animated flags on every page. */
export function SiteAtmosphere({ children }: SiteAtmosphereProps) {
  return (
    <div className="relative isolate flex min-h-full flex-1 flex-col">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        {/* Stadium — dimmed for night-match shadow feel */}
        <img
          src={STADIUM_PHOTO}
          alt=""
          width={1600}
          height={900}
          decoding="async"
          fetchPriority="low"
          className="absolute inset-0 h-full w-full scale-105 object-cover object-center brightness-[0.32] contrast-[1.08] saturate-[0.65]"
        />

        {/* Deep base shadow */}
        <div className="absolute inset-0 bg-[#030508]/75" />

        {/* Animated random flags — 14 nations, CSS only */}
        <AnimatedFlagField count={14} />

        {/* Host nation flags — ghosted in the dark */}
        {HOST_NATIONS.map(({ code, className }) => (
          <div
            key={code}
            className={`absolute h-24 w-36 overflow-hidden rounded-xl opacity-25 blur-[3px] sm:h-32 sm:w-48 sm:opacity-30 ${className}`}
          >
            <img
              src={hostFlag(code)}
              alt=""
              width={80}
              height={53}
              decoding="async"
              className="h-full w-full object-cover brightness-75"
            />
          </div>
        ))}

        {/* Subtle stadium floodlights — muted in shadow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-5%,rgba(34,211,164,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_105%,rgba(22,163,74,0.08),transparent_50%)]" />

        {/* Edge shadows / vignette */}
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-transparent to-black/70" />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(3,5,8,0.85)_100%)]" />
        <div className="absolute inset-0 bg-linear-to-b from-[#06080d]/55 via-emerald-950/50 to-[#06080d]/92" />
        <div className="absolute inset-0 pitch-grid opacity-[0.07]" />
      </div>

      <div className="relative z-10 flex min-h-full flex-1 flex-col">{children}</div>
    </div>
  );
}

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Film } from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import { mediaUrl } from "@/lib/mediaUrl";

const SLIDES = [
  {
    img: mediaUrl("repo.png"),
    title: "The repository",
    tag: "01 / github.com/CharanBharathula/agentnotary",
    caption:
      "7 commits. Apache 2.0. 169 tests. The canonical open-source trust primitive for AI agents.",
  },
  {
    img: mediaUrl("terminal.png"),
    title: "Natural CLI",
    tag: "02 / agentnotary ▸ seal · guard · attack",
    caption:
      "Every command produces deterministic, cryptographically-verifiable artifacts you can diff in CI.",
  },
  {
    img: mediaUrl("hero.png"),
    title: "The trust layer",
    tag: "03 / agent.lock — the missing primitive",
    caption:
      "Sits alongside your observability stack. Doesn't watch agents — it certifies them.",
  },
];

export default function Walkthrough() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "center" });
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIdx(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    return () => embla.off("select", onSelect);
  }, [embla]);

  return (
    <section id="walkthrough" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-400/80 border border-emerald-400/20 bg-emerald-400/5 rounded-full px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Walkthrough · Voice-over navigation
            </div>
            <h2
              data-testid="walkthrough-heading"
              className="mt-5 font-semibold tracking-tighter text-white text-3xl sm:text-5xl leading-[1.05]"
            >
              A 40-second tour, narrated.
            </h2>
            <p className="mt-5 text-white/60 max-w-xl leading-relaxed">
              Scroll through the repo and the CLI in action, or press play and
              let the voice-over walk you through it.
            </p>
          </div>
        </div>

        {/* Video walkthrough */}
        <div className="mb-10">
          <div className="relative rounded-xl border border-white/10 bg-[#050505] overflow-hidden shadow-[0_30px_80px_-30px_rgba(16,185,129,0.25)]">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#0A0A0A]">
              <div className="flex items-center gap-2 font-mono text-[11px] text-white/50 uppercase tracking-widest">
                <Film className="h-3.5 w-3.5 text-emerald-400/80" />
                walkthrough.mp4 · AI-narrated
              </div>
              <div className="font-mono text-[10px] text-white/30">1280 × 720</div>
            </div>
            <video
              data-testid="walkthrough-video"
              src={mediaUrl("walkthrough.mp4")}
              controls
              preload="metadata"
              poster={mediaUrl("hero.png")}
              className="w-full aspect-video bg-black"
            />
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="embla-fade-mask overflow-hidden" ref={emblaRef} data-testid="walkthrough-carousel">
            <div className="flex">
              {SLIDES.map((s, i) => (
                <div key={i} className="shrink-0 w-full sm:w-[80%] md:w-[70%] lg:w-[60%] px-3">
                  <div className="rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden group">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#070707]">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#FF5F57]/70" />
                        <span className="h-2 w-2 rounded-full bg-[#FEBC2E]/70" />
                        <span className="h-2 w-2 rounded-full bg-[#28C840]/70" />
                      </div>
                      <div className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
                        {s.tag}
                      </div>
                      <div className="w-10" />
                    </div>
                    <div className="relative aspect-[16/10] bg-black">
                      <img
                        src={s.img}
                        alt={s.title}
                        data-testid={`walkthrough-slide-${i}`}
                        className="w-full h-full object-cover object-top opacity-95 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="p-5">
                      <div className="font-mono text-[10px] tracking-widest uppercase text-emerald-400/70 mb-1">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className="text-white text-base font-medium tracking-tight">
                        {s.title}
                      </h3>
                      <p className="mt-1.5 text-white/55 text-sm leading-relaxed">
                        {s.caption}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => embla && embla.scrollPrev()}
              data-testid="walkthrough-prev"
              className="h-9 w-9 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/30 flex items-center justify-center transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => embla && embla.scrollTo(i)}
                  data-testid={`walkthrough-dot-${i}`}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === i ? "w-8 bg-emerald-400" : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => embla && embla.scrollNext()}
              data-testid="walkthrough-next"
              className="h-9 w-9 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/30 flex items-center justify-center transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Voice-over player */}
        <div className="mt-12">
          <div className="text-center mb-4 font-mono text-[11px] tracking-widest uppercase text-white/40">
            Voice-over navigation · AI-generated
          </div>
          <AudioPlayer />
        </div>
      </div>
    </section>
  );
}

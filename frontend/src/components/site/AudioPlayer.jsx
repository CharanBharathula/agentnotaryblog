import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { mediaUrl } from "@/lib/mediaUrl";

const AUDIO_URL = mediaUrl("voiceover.mp3");

const BARS = 46;

function fmt(t) {
  if (!isFinite(t)) return "0:00";
  const s = Math.max(0, Math.floor(t));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setTime(a.currentTime);
    const onLoad = () => {
      setDur(a.duration);
      setReady(true);
    };
    const onEnd = () => setPlaying(false);
    const onErr = () => setErr("audio unavailable");
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onLoad);
    a.addEventListener("ended", onEnd);
    a.addEventListener("error", onErr);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onLoad);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("error", onErr);
    };
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (a.paused) {
        await a.play();
        setPlaying(true);
      } else {
        a.pause();
        setPlaying(false);
      }
    } catch (e) {
      setErr("playback failed");
    }
  };

  const progress = dur > 0 ? time / dur : 0;

  // deterministic bar heights (stable per render)
  const barHeights = Array.from({ length: BARS }, (_, i) => {
    const base = 0.35 + 0.55 * Math.abs(Math.sin(i * 0.9 + 1.3) * Math.cos(i * 0.3));
    return Math.max(0.15, Math.min(1, base));
  });

  const onScrub = (e) => {
    const a = audioRef.current;
    if (!a || !dur) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    a.currentTime = pct * dur;
    setTime(pct * dur);
  };

  return (
    <div
      data-testid="voiceover-audio-player"
      className="relative w-full max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-4 bg-[#0A0A0A] border border-white/10 rounded-full pl-2 pr-5 py-2">
        <button
          onClick={toggle}
          data-testid="voiceover-play-toggle"
          disabled={!!err}
          className="h-11 w-11 shrink-0 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center transition-all active:scale-95 disabled:opacity-40"
          aria-label={playing ? "Pause narration" : "Play narration"}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </button>

        {/* Waveform / scrubber */}
        <div
          className="relative flex-1 h-10 flex items-center gap-[2px] cursor-pointer group"
          onClick={onScrub}
          data-testid="voiceover-waveform"
        >
          {barHeights.map((h, i) => {
            const lit = i / BARS <= progress;
            return (
              <div
                key={i}
                className="flex-1 rounded-full transition-colors"
                style={{
                  height: `${h * 100}%`,
                  background: lit ? "rgba(16,185,129,0.95)" : "rgba(255,255,255,0.12)",
                  boxShadow: lit ? "0 0 6px rgba(16,185,129,0.55)" : "none",
                }}
              />
            );
          })}
        </div>

        <div className="font-mono text-[11px] text-white/60 tabular-nums shrink-0 w-20 text-right">
          {fmt(time)} / {fmt(dur)}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-white/40 text-[11px] font-mono uppercase tracking-widest shrink-0 pl-2 border-l border-white/10">
          <Volume2 className="h-3.5 w-3.5" />
          AI voice
        </div>
      </div>

      {!ready && !err && (
        <div className="mt-3 text-center font-mono text-[11px] text-white/40">
          synthesizing voice-over…
        </div>
      )}
      {err && (
        <div className="mt-3 text-center font-mono text-[11px] text-rose-400/80">
          {err}
        </div>
      )}

      <audio
        ref={audioRef}
        src={AUDIO_URL}
        preload="metadata"
        data-testid="voiceover-audio-element"
      />
    </div>
  );
}

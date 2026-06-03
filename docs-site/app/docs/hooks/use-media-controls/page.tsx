export const metadata = { title: "useMediaControls — use-web-kit" };

const sig = `function useMediaControls(
  ref: RefObject<HTMLMediaElement>
): {
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;           // 0–1
  muted: boolean;
  playbackRate: number;
  buffered: TimeRanges | null;
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  setPlaybackRate: (r: number) => void;
  toggleMute: () => void;
}`;

const usage = `import { useRef } from 'react';
import { useMediaControls } from 'use-web-kit';

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    playing, currentTime, duration,
    togglePlay, seek, volume, setVolume,
    toggleMute, muted, playbackRate, setPlaybackRate,
  } = useMediaControls(videoRef);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div>
      <video ref={videoRef} src="/video.mp4" />

      <div className="controls">
        <button onClick={togglePlay}>{playing ? 'Pause' : 'Play'}</button>

        <input
          type="range" min={0} max={100} value={progress}
          onChange={e => seek((Number(e.target.value) / 100) * duration)}
        />

        <button onClick={toggleMute}>{muted ? 'Unmute' : 'Mute'}</button>
        <input
          type="range" min={0} max={1} step={0.05} value={volume}
          onChange={e => setVolume(Number(e.target.value))}
        />

        <select value={playbackRate} onChange={e => setPlaybackRate(Number(e.target.value))}>
          {[0.5, 1, 1.5, 2].map(r => <option key={r} value={r}>{r}x</option>)}
        </select>
      </div>
    </div>
  );
}`;

export default function Page() {
  return (
    <>
      <div className="mb-10">
        <span
          className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full mb-3"
          style={{
            background: "rgba(244,114,182,0.1)",
            border: "1px solid rgba(244,114,182,0.3)",
            color: "#f472b4",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Media
        </span>
        <h1
          className="text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          useMediaControls
        </h1>
        <p className="text-[#9ca3af] text-sm leading-relaxed">
          Full reactive control over HTML video and audio elements. Attach to
          any media element via a ref and get play/pause, volume, seek, and
          playback rate controls.
        </p>
      </div>
      <div className="section-divider mb-10" />
      <div className="mb-10">
        <h2
          className="text-sm font-semibold text-[#f0f0f0] mb-4 uppercase tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Signature
        </h2>
        <div className="code-block rounded-lg p-4 text-xs overflow-x-auto">
          <pre style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {sig.split("\n").map((l, i) => (
              <div key={i} className="text-[#9ca3af]">
                {l || "\u00A0"}
              </div>
            ))}
          </pre>
        </div>
      </div>
      <div className="mb-10">
        <h2
          className="text-sm font-semibold text-[#f0f0f0] mb-4 uppercase tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Usage
        </h2>
        <div className="code-block rounded-lg p-4 text-xs overflow-x-auto">
          <pre style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {usage.split("\n").map((l, i) => {
              const c = l.trimStart().startsWith("//");
              return (
                <div
                  key={i}
                  style={{ color: c ? "rgba(163,255,18,0.45)" : undefined }}
                  className={c ? "" : "text-[#9ca3af]"}
                >
                  {l || "\u00A0"}
                </div>
              );
            })}
          </pre>
        </div>
      </div>
    </>
  );
}

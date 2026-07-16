"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { cn } from "@/lib/utils";

interface HlsVideoProps {
  src: string;
  className?: string;
  flip?: boolean;
  overlayClassName?: string;
  overlayOpacity?: number;
}

/**
 * HLS video player that loads an .m3u8 source.
 * - Uses hls.js when supported, falls back to native HLS (Safari).
 * - Auto-plays muted, looped, inline (background video).
 * - Optional vertical flip + dark overlay.
 */
export function HlsVideo({
  src,
  className,
  flip = false,
  overlayClassName,
  overlayOpacity = 0.2,
}: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    const isM3u8 = src.includes(".m3u8");

    if (isM3u8 && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: false });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      // native (Safari) or non-hls source
      video.src = src;
    }

    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          /* autoplay can fail if not muted; ignore */
        });
      }
    };
    video.addEventListener("loadedmetadata", tryPlay);
    tryPlay();

    return () => {
      video.removeEventListener("loadedmetadata", tryPlay);
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className={cn(
          "absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2",
          flip && "scale-y-[-1]"
        )}
        aria-hidden
      />
      <div
        className={cn("absolute inset-0 bg-black", overlayClassName)}
        style={{ opacity: overlayOpacity }}
        aria-hidden
      />
    </div>
  );
}

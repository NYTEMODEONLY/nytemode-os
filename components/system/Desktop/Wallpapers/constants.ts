import {
  type WallpaperMenuItem,
  type WallpaperFunc,
} from "components/system/Desktop/Wallpapers/types";
import { type WallpaperFit } from "contexts/session/types";

export const bgPositionSize: Record<WallpaperFit, string> = {
  center: "center center",
  fill: "center center / cover",
  fit: "center center / contain",
  stretch: "center center / 100% 100%",
  tile: "50% 50%",
};

export const WALLPAPER_PATHS: Record<
  string,
  () => Promise<{ default: WallpaperFunc; libs: string[] }>
> = {
  MATRIX: () => import("components/system/Desktop/Wallpapers/Matrix"),
  VANTA: () => import("components/system/Desktop/Wallpapers/vantaWaves"),
};

export const WALLPAPER_WORKERS: Record<string, () => Worker> = {
  VANTA: (): Worker =>
    new Worker(
      new URL(
        "components/system/Desktop/Wallpapers/vantaWaves/wallpaper.worker",
        import.meta.url
      ),
      { name: "Wallpaper (Vanta Waves)" }
    ),
};

export const WALLPAPER_WORKER_NAMES = Object.keys(WALLPAPER_WORKERS);

export const REDUCED_MOTION_PERCENT = 0.1;

export const WALLPAPER_MENU: WallpaperMenuItem[] = [
  {
    id: "MATRIX 2D",
    name: "Matrix (2D)",
  },
  {
    id: "MATRIX 3D",
    name: "Matrix (3D)",
  },
  {
    id: "SLIDESHOW",
    name: "Picture Slideshow",
    disabled: true,
  },
  {
    id: "VANTA",
    name: "Vanta Waves",
    startsWith: true,
  },
];

export const BASE_CANVAS_SELECTOR = ":scope > canvas";

export const BASE_VIDEO_SELECTOR = ":scope > video";

export const STABLE_DIFFUSION_DELAY_IN_MIN = 10;

export const PRELOAD_ID = "preloadWallpaper";

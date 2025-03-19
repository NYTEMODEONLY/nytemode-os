import { memo, useEffect, useState } from "react";

// Use local high-resolution icon for better clarity
const LOCAL_ICON_PATH = "/System/Icons/144x144/desktop.webp";
const FALLBACK_ICON_PATH = "/System/Icons/96x96/desktop.webp";
const DEFAULT_ICON_SIZE = "24px";

const StartButtonIcon = memo(() => {
  const [iconPath, setIconPath] = useState(LOCAL_ICON_PATH);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadIcon = () => {
      const img = new Image();
      img.onload = () => {
        setIsLoading(false);
      };
      img.onerror = () => {
        console.error("Failed to load high-res icon, trying fallback");
        setIconPath(FALLBACK_ICON_PATH);

        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          setIsLoading(false);
        };
        fallbackImg.onerror = () => {
          console.error("Failed to load fallback icon");
          setIsLoading(false);
        };
        fallbackImg.src = FALLBACK_ICON_PATH;
      };
      img.src = LOCAL_ICON_PATH;
    };

    loadIcon();

    return () => {
      // No cleanup needed
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: DEFAULT_ICON_SIZE,
        height: DEFAULT_ICON_SIZE,
        overflow: "hidden",
      }}
    >
      {isLoading ? (
        <div
          style={{
            width: DEFAULT_ICON_SIZE,
            height: DEFAULT_ICON_SIZE,
            backgroundColor: "transparent",
          }}
        />
      ) : (
        <img
          src={iconPath}
          alt="Start"
          style={{
            width: DEFAULT_ICON_SIZE,
            height: DEFAULT_ICON_SIZE,
            objectFit: "contain",
            imageRendering: "pixelated", // Better for downscaling high-res images
            display: "block",
            maxWidth: "100%",
            maxHeight: "100%",
            transform: "scale(0.9)", // Slightly smaller to avoid pixelation at edges
          }}
          draggable={false}
        />
      )}
    </div>
  );
});

export default StartButtonIcon;

import { memo, useEffect, useState } from "react";

// Use a direct URL to a clearer version of the favicon if possible
// For best results, consider adding multiple sizes for better clarity
const NYTEMODE_FAVICON_URL = "https://nytemode.com/favicon.ico";
const NYTEMODE_BACKUP_URL = "https://nytemode.com/apple-touch-icon.png"; // Try to find higher-res icon
const DEFAULT_ICON_SIZE = "24px";

const StartButtonIcon = memo(() => {
  const [faviconUrl, setFaviconUrl] = useState(NYTEMODE_FAVICON_URL);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // First try the high-resolution icon if available
    const tryHighResIcon = () => {
      const highResImg = new Image();
      highResImg.onload = () => {
        setFaviconUrl(NYTEMODE_BACKUP_URL);
        setIsLoading(false);
      };
      highResImg.onerror = () => {
        // Fall back to standard favicon
        const img = new Image();
        img.onload = () => {
          setIsLoading(false);
        };
        img.onerror = () => {
          console.error("Failed to load favicon from nytemode.com");
          setIsLoading(false);
        };
        img.src = NYTEMODE_FAVICON_URL;
      };
      highResImg.src = NYTEMODE_BACKUP_URL;
    };

    tryHighResIcon();

    // Cleanup function
    return () => {
      // Nothing to clean up
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
          src={faviconUrl}
          alt="Start"
          style={{
            width: DEFAULT_ICON_SIZE,
            height: DEFAULT_ICON_SIZE,
            objectFit: "contain",
            imageRendering: "crisp-edges", // Helps with pixel-perfect rendering
            display: "block", // Removes any extra spacing
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          draggable={false} // Prevent accidental dragging
        />
      )}
    </div>
  );
});

export default StartButtonIcon;

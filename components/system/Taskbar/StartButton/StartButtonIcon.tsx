import { memo, useEffect, useState } from "react";

const NYTEMODE_FAVICON_URL = "https://nytemode.com/favicon.ico";
const DEFAULT_ICON_SIZE = "24px";

const StartButtonIcon = memo(() => {
  const [faviconUrl, setFaviconUrl] = useState(NYTEMODE_FAVICON_URL);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
    };
    img.onerror = () => {
      console.error("Failed to load favicon from nytemode.com");
      setIsLoading(false);
    };
    img.src = NYTEMODE_FAVICON_URL;

    return () => {
      img.onload = null;
      img.onerror = null;
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
          }}
        />
      )}
    </div>
  );
});

export default StartButtonIcon;

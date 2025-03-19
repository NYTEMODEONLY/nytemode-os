import { memo } from "react";

const DEFAULT_ICON_SIZE = "24px";

// Define SVG as a constant for reuse
const NYTEMODE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#7c519d" font-size="36" font-weight="bold" font-family="Arial, sans-serif">N</text>
</svg>
`;

const StartButtonIcon = memo(() => {
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
      <div
        style={{
          width: DEFAULT_ICON_SIZE,
          height: DEFAULT_ICON_SIZE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        dangerouslySetInnerHTML={{ __html: NYTEMODE_SVG }}
      />
    </div>
  );
});

export default StartButtonIcon;

import { memo } from "react";

const DEFAULT_ICON_SIZE = "24px";

// Define SVG as a constant for reuse
const NYTEMODE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <path fill="#6B4E9C" d="M100,0 C155.228,0 200,44.772 200,100 C200,155.228 155.228,200 100,200 C44.772,200 0,155.228 0,100 C0,44.772 44.772,0 100,0 Z M100,20 C145.456,20 182,56.544 182,102 C182,147.456 145.456,184 100,184 C54.544,184 18,147.456 18,102 C18,56.544 54.544,20 100,20 Z M100,40 C134.912,40 164,69.088 164,104 C164,138.912 134.912,168 100,168 C65.088,168 36,138.912 36,104 C36,69.088 65.088,40 100,40 Z M100,60 C124.464,60 144,79.536 144,104 C144,128.464 124.464,148 100,148 C75.536,148 56,128.464 56,104 C56,79.536 75.536,60 100,60 Z M100,80 C114.928,80 126,91.072 126,106 C126,120.928 114.928,132 100,132 C85.072,132 74,120.928 74,106 C74,91.072 85.072,80 100,80 Z M100,100 C105.464,100 110,104.536 110,110 C110,115.464 105.464,120 100,120 C94.536,120 90,115.464 90,110 C90,104.536 94.536,100 100,100 Z" />
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

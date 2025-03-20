const colors = {
  background: "#000",
  fileEntry: {
    background: "hsla(270, 40%, 30%, 25%)",
    backgroundFocused: "hsla(270, 60%, 40%, 35%)",
    backgroundFocusedHover: "hsla(270, 90%, 50%, 30%)",
    border: "hsla(270, 40%, 40%, 30%)",
    borderFocused: "hsla(270, 60%, 50%, 35%)",
    borderFocusedHover: "hsla(270, 90%, 60%, 40%)",
    text: "#FFF",
    textShadow: `
      0 0 1px rgba(0, 0, 0, 75%),
      0 0 2px rgba(0, 0, 0, 50%),

      0 1px 1px rgba(0, 0, 0, 75%),
      0 1px 2px rgba(0, 0, 0, 50%),

      0 2px 1px rgba(0, 0, 0, 75%),
      0 2px 2px rgba(0, 0, 0, 50%)`,
  },
  highlight: "hsla(270, 100%, 70%, 90%)",
  progress: "hsla(270, 90%, 60%, 90%)",
  progressBackground: "hsla(270, 60%, 40%, 70%)",
  progressBarRgb: "rgb(120, 50, 200)",
  selectionHighlight: "hsla(270, 100%, 60%, 90%)",
  selectionHighlightBackground: "hsla(270, 100%, 40%, 30%)",
  taskbar: {
    active: "hsla(270, 30%, 15%, 90%)",
    activeForeground: "hsla(270, 30%, 22%, 90%)",
    ai: {
      balanced: ["rgb(150, 90, 255)", "rgb(120, 70, 225)", "rgb(90, 50, 200)"],
      creative: ["rgb(180, 90, 255)", "rgb(150, 50, 220)", "rgb(120, 30, 180)"],
      precise: ["rgb(120, 90, 255)", "rgb(90, 60, 220)", "rgb(60, 30, 180)"],
    },
    background: "hsla(270, 30%, 10%, 90%)",
    button: {
      color: "#FFF",
    },
    foreground: "hsla(270, 30%, 18%, 90%)",
    foregroundHover: "hsla(270, 30%, 25%, 90%)",
    foregroundProgress: "hsla(270, 30%, 20%, 30%)",
    hover: "hsla(270, 30%, 15%, 90%)",
    peekBorder: "hsla(270, 30%, 25%, 50%)",
  },
  text: "rgba(255, 255, 255, 90%)",
  titleBar: {
    background: "rgb(50, 0, 80)",
    backgroundHover: "rgb(70, 10, 100)",
    backgroundInactive: "rgb(40, 20, 70)",
    buttonInactive: "rgb(140, 100, 180)",
    closeHover: "rgb(232, 17, 35)",
    text: "rgb(255, 255, 255)",
    textInactive: "rgb(190, 170, 210)",
  },
  window: {
    background: "#2a1a40",
    outline: "hsla(270, 40%, 30%, 75%)",
    outlineInactive: "hsla(270, 40%, 40%, 100%)",
    shadow: "0 0 14px 0 rgba(50, 0, 100, 50%)",
    shadowInactive: "0 0 10px 0 rgba(50, 0, 100, 45%)",
  },
};

export default colors;

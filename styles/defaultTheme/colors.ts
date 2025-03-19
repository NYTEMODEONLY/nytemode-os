const colors = {
  background: "#000",
  fileEntry: {
    background: "hsla(230, 40%, 30%, 25%)",
    backgroundFocused: "hsla(230, 60%, 40%, 35%)",
    backgroundFocusedHover: "hsla(230, 90%, 50%, 30%)",
    border: "hsla(230, 40%, 40%, 30%)",
    borderFocused: "hsla(230, 60%, 50%, 35%)",
    borderFocusedHover: "hsla(230, 90%, 60%, 40%)",
    text: "#FFF",
    textShadow: `
      0 0 1px rgba(0, 0, 0, 75%),
      0 0 2px rgba(0, 0, 0, 50%),

      0 1px 1px rgba(0, 0, 0, 75%),
      0 1px 2px rgba(0, 0, 0, 50%),

      0 2px 1px rgba(0, 0, 0, 75%),
      0 2px 2px rgba(0, 0, 0, 50%)`,
  },
  highlight: "hsla(230, 100%, 70%, 90%)",
  progress: "hsla(200, 90%, 60%, 90%)",
  progressBackground: "hsla(200, 60%, 40%, 70%)",
  progressBarRgb: "rgb(0, 120, 255)",
  selectionHighlight: "hsla(230, 100%, 60%, 90%)",
  selectionHighlightBackground: "hsla(230, 100%, 40%, 30%)",
  taskbar: {
    active: "hsla(230, 40%, 15%, 90%)",
    activeForeground: "hsla(230, 40%, 30%, 90%)",
    ai: {
      balanced: ["rgb(0, 150, 255)", "rgb(0, 100, 225)", "rgb(0, 50, 200)"],
      creative: [
        "rgb(150, 100, 255)",
        "rgb(100, 50, 200)",
        "rgb(50, 0, 150)",
      ],
      precise: ["rgb(0, 200, 255)", "rgb(0, 150, 200)", "rgb(0, 100, 150)"],
    },
    background: "hsla(230, 40%, 10%, 90%)",
    button: {
      color: "#FFF",
    },
    foreground: "hsla(230, 40%, 30%, 90%)",
    foregroundHover: "hsla(230, 40%, 40%, 90%)",
    foregroundProgress: "hsla(200, 60%, 40%, 30%)",
    hover: "hsla(230, 40%, 20%, 90%)",
    peekBorder: "hsla(230, 40%, 50%, 50%)",
  },
  text: "rgba(255, 255, 255, 90%)",
  titleBar: {
    background: "rgb(0, 0, 30)",
    backgroundHover: "rgb(10, 10, 40)",
    backgroundInactive: "rgb(20, 20, 50)",
    buttonInactive: "rgb(100, 100, 150)",
    closeHover: "rgb(232, 17, 35)",
    text: "rgb(255, 255, 255)",
    textInactive: "rgb(170, 170, 200)",
  },
  window: {
    background: "#101030",
    outline: "hsla(230, 40%, 30%, 75%)",
    outlineInactive: "hsla(230, 40%, 40%, 100%)",
    shadow: "0 0 14px 0 rgba(0, 0, 50, 50%)",
    shadowInactive: "0 0 10px 0 rgba(0, 0, 50, 45%)",
  },
};

export default colors;

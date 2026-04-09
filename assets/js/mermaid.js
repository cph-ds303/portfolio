function css(name) {
  return "rgb(" + getComputedStyle(document.documentElement).getPropertyValue(name) + ")";
}

function initMermaidLight() {
  mermaid.initialize({
    theme: "base",
    themeVariables: {
      background: "#171320",
      primaryColor: "#2a2036",
      secondaryColor: "#221b2d",
      tertiaryColor: "#1d1727",
      primaryBorderColor: "#d08bc4",
      secondaryBorderColor: "#c07ab5",
      tertiaryBorderColor: "#8f6f9d",
      lineColor: "#f1dbe8",
      primaryTextColor: "#f7e9f1",
      secondaryTextColor: "#f7e9f1",
      tertiaryTextColor: "#f7e9f1",
      fontFamily:
        "ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,noto sans,sans-serif",
      fontSize: "16px",
    },
  });
}

function initMermaidDark() {
  mermaid.initialize({
    theme: "dark",
    themeVariables: {
      background: "#171320",
      primaryColor: "#2a2036",
      secondaryColor: "#221b2d",
      tertiaryColor: "#1d1727",
      primaryBorderColor: "#d08bc4",
      secondaryBorderColor: "#c07ab5",
      tertiaryBorderColor: "#8f6f9d",
      lineColor: "#f1dbe8",
      primaryTextColor: "#f7e9f1",
      secondaryTextColor: "#f7e9f1",
      tertiaryTextColor: "#f7e9f1",
      fontFamily:
        "ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,noto sans,sans-serif",
      fontSize: "16px",
    },
  });
}

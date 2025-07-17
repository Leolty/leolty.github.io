// Has to be in the head tag, otherwise a flicker effect will occur.

// Dynamic luxury color palettes with weighted probabilities
const colorPalettes = [
  {
    name: "Tiffany & Hermès",
    light: "#0ABAB5", // Tiffany blue
    dark: "#F37021",   // Hermès orange (fixed double ##)
    weight: 80 // 80% probability
  },
  {
    name: "Anthropic Orange & Tiffany Blue",
    light: "#D87756", // Anthropic orange
    dark: "#0ABAB5",   // Tiffany blue
    weight: 10 // 10% probability
  },
  {
    name: "Deep Ocean & Amber",
    light: "#1E40AF", // Deep blue
    dark: "#D97706",   // Amber orange
    weight: 10 // 10% probability
  }
];

// Weighted random selection function
function selectWeightedPalette() {
  const totalWeight = colorPalettes.reduce((sum, palette) => sum + palette.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let palette of colorPalettes) {
    random -= palette.weight;
    if (random <= 0) {
      return palette;
    }
  }
  
  // Fallback to first palette
  return colorPalettes[0];
}

// Select palette based on weighted probability
let selectedPalette = selectWeightedPalette();

// Apply dynamic colors to CSS variables
function applyDynamicColors() {
  const root = document.documentElement;
  const currentTheme = localStorage.getItem("theme") || "light";
  
  if (currentTheme === "dark") {
    root.style.setProperty('--global-theme-color', selectedPalette.dark);
    root.style.setProperty('--global-hover-color', selectedPalette.dark);
  } else {
    root.style.setProperty('--global-theme-color', selectedPalette.light);
    root.style.setProperty('--global-hover-color', selectedPalette.light);
  }
  
  console.log(`🎨 Applied palette: ${selectedPalette.name}`);
}

let toggleTheme = (theme) => {
  if (theme == "dark") {
    setTheme("light");
  } else {
    setTheme("dark");
  }
};

let setTheme = (theme) => {
  transTheme();
  setHighlight(theme);
  setGiscusTheme(theme);

  if (theme) {
    document.documentElement.setAttribute("data-theme", theme);

    // Add class to tables.
    let tables = document.getElementsByTagName("table");
    for (let i = 0; i < tables.length; i++) {
      if (theme == "dark") {
        tables[i].classList.add("table-dark");
      } else {
        tables[i].classList.remove("table-dark");
      }
    }

    // Set jupyter notebooks themes.
    let jupyterNotebooks = document.getElementsByClassName("jupyter-notebook-iframe-container");
    for (let i = 0; i < jupyterNotebooks.length; i++) {
      let bodyElement = jupyterNotebooks[i].getElementsByTagName("iframe")[0].contentWindow.document.body;
      if (theme == "dark") {
        bodyElement.setAttribute("data-jp-theme-light", "false");
        bodyElement.setAttribute("data-jp-theme-name", "JupyterLab Dark");
      } else {
        bodyElement.setAttribute("data-jp-theme-light", "true");
        bodyElement.setAttribute("data-jp-theme-name", "JupyterLab Light");
      }
    }

  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  localStorage.setItem("theme", theme);
  
  // Apply dynamic colors after theme change
  applyDynamicColors();

  // Updates the background of medium-zoom overlay.
  if (typeof medium_zoom !== "undefined") {
    medium_zoom.update({
      background:
        getComputedStyle(document.documentElement).getPropertyValue(
          "--global-bg-color"
        ) + "ee", // + 'ee' for trasparency.
    });
  }
};

let setHighlight = (theme) => {
  if (theme == "dark") {
    document.getElementById("highlight_theme_light").media = "none";
    document.getElementById("highlight_theme_dark").media = "";
  } else {
    document.getElementById("highlight_theme_dark").media = "none";
    document.getElementById("highlight_theme_light").media = "";
  }
};

let setGiscusTheme = (theme) => {
  function sendMessage(message) {
    const iframe = document.querySelector("iframe.giscus-frame");
    if (!iframe) return;
    iframe.contentWindow.postMessage({ giscus: message }, "https://giscus.app");
  }

  sendMessage({
    setConfig: {
      theme: theme,
    },
  });
};

let transTheme = () => {
  document.documentElement.classList.add("transition");
  window.setTimeout(() => {
    document.documentElement.classList.remove("transition");
  }, 500);
};

let initTheme = (theme) => {
  if (theme == null || theme == "null") {
    const userPref = window.matchMedia;
    if (userPref && userPref("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    }
  }

  setTheme(theme);
};

initTheme(localStorage.getItem("theme"));

// Bonus: Function to manually change palette (accessible via browser console)
window.changePalette = function() {
  selectedPalette = selectWeightedPalette();
  applyDynamicColors();
  return `🎨 Switched to: ${selectedPalette.name}`;
};

// Also apply colors on initial load
document.addEventListener('DOMContentLoaded', function() {
  applyDynamicColors();
});

console.log(`🎨 Dynamic color palettes loaded! Type changePalette() in console to switch colors.`);

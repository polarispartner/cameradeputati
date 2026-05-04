const VALID = new Set(["horizontal", "vertical"]);

// Each app calls this once at boot from main.jsx with its fixed orientation.
// CSS in shared/index.css branches on [data-orientation="vertical"].
export function setOrientation(value) {
  if (!VALID.has(value)) return;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.orientation = value;
  }
}

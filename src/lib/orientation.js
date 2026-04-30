import { useSyncExternalStore } from "react";

const STORAGE_KEY = "cd-orientation";
const VALID = new Set(["horizontal", "vertical"]);
const listeners = new Set();

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return VALID.has(v) ? v : "horizontal";
  } catch {
    return "horizontal";
  }
}

function applyToDom(value) {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.orientation = value;
  }
}

export function initOrientation() {
  applyToDom(readStored());
}

export function getOrientation() {
  if (typeof document !== "undefined") {
    const v = document.documentElement.dataset.orientation;
    if (VALID.has(v)) return v;
  }
  return readStored();
}

export function setOrientation(value) {
  if (!VALID.has(value)) return;
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* noop */
  }
  applyToDom(value);
  listeners.forEach((l) => l());
}

function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useOrientation() {
  return useSyncExternalStore(
    subscribe,
    getOrientation,
    () => "horizontal",
  );
}

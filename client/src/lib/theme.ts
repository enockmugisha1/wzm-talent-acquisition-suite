import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

function applyTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    { name: "wzm-theme" }
  )
);

// Call on app init to apply saved theme immediately
export function initTheme() {
  try {
    const raw = localStorage.getItem("wzm-theme");
    if (raw) {
      const { state } = JSON.parse(raw);
      if (state?.theme) applyTheme(state.theme);
    }
  } catch {}
}

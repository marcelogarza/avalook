/**
 * Theme utility functions for daisyUI
 */

// Get current theme
export const getCurrentTheme = (): string => {
  return document.documentElement.getAttribute("data-theme") || "light";
};

// Set theme
export const setTheme = (theme: string): void => {
  // Set data-theme attribute on html element
  document.documentElement.setAttribute("data-theme", theme);

  // Update document classes for Tailwind compatibility
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // Optionally store the theme preference
  localStorage.setItem("theme", theme);
};

// Toggle between light and dark
export const toggleTheme = (): void => {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
};

// Initialize theme based on saved preference or system preference
export const initTheme = (): void => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    setTheme(savedTheme);
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    setTheme("dark");
  } else {
    setTheme("light");
  }

  // Add listener for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      if (!localStorage.getItem("theme")) {
        setTheme(event.matches ? "dark" : "light");
      }
    });
};

import { useState, useEffect } from "react";

function usePrefersDarkMode() {
    // Initialize state with the current preference
    const [prefersDark, setPrefersDark] = useState(
        () => window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersDark(event.matches);
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handleChange);
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(handleChange);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener("change", handleChange);
            } else {
                mediaQuery.removeListener(handleChange);
            }
        };
    }, []);

    return prefersDark;
}

export default usePrefersDarkMode;

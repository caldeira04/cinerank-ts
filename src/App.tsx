"use client";

import { ThemeProvider } from "next-themes";
import Home from "./pages/Home";

export default function App() {
    return (
        <ThemeProvider>
            <Home />

        </ThemeProvider>
    );
}


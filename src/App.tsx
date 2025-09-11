"use client";

import { ThemeProvider } from "next-themes";
import Home from "./pages/Home";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInSignUp } from "./pages/SignUp";
import { Toaster } from "./components/ui/sonner";

export default function App() {
    return (
        <ThemeProvider>
            <Authenticated>
                <Home />
                <Toaster />
            </Authenticated>
            <Unauthenticated>
                <SignInSignUp />
            </Unauthenticated>
        </ThemeProvider>
    );
}


"use client";

import { ThemeProvider } from "next-themes";
import Home from "./pages/Home";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInSignUp } from "./pages/SignUp";

export default function App() {
    return (
        <ThemeProvider>
            <Authenticated>
                <Home />
            </Authenticated>
            <Unauthenticated>
                <SignInSignUp />
            </Unauthenticated>
        </ThemeProvider>
    );
}


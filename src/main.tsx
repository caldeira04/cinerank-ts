import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import "./index.css";
import App from "./App.tsx";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { SignInSignUp } from "./pages/SignUp.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/login",
        element: <SignInSignUp />,
    },
]);

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ConvexAuthProvider client={convex}>
            <RouterProvider router={router} />
        </ConvexAuthProvider>
    </StrictMode>,
);

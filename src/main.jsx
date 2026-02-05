// src/main.jsx
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes"
import { AuthProvider } from "./providers/AuthProvider";
import { DataProvider } from "./providers/DataProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import "./index.css";

const router = createBrowserRouter(routes)

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ThemeProvider>
      <DataProvider>
        <RouterProvider router={router} />
      </DataProvider>
    </ThemeProvider>
  </AuthProvider>,
);

// src/routes.jsx
import App from "./App.jsx";
import { ErrorPage } from "./pages/ErrorPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { LoginPage } from "../LoginPage.jsx";
import { SignupPage } from "./pages/SignupPage.jsx";
import { ProtectedRoute } from "./components/shared/ProtectedRoute.jsx";

export const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // Public routes
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },

      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [{ index: true, element: <HomePage /> }],
      },
    ],
  },
];

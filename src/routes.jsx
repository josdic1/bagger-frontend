// src/routes.jsx
import App from "./App.jsx";
import { ErrorPage } from "./pages/ErrorPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { SignupPage } from "./pages/SignupPage.jsx";
import { ProtectedRoute } from "./components/shared/ProtectedRoute.jsx";
import { TopicForm } from "./components/topics/TopicForm.jsx";
import { TopicsPage } from "./pages/TopicsPage.jsx";
import { PlatformsPage } from "./pages/PlatformsPage.jsx";
import { PlatformForm } from "./components/platforms/PlatformForm.jsx";
import { CheatsPage } from "./pages/CheatsPage.jsx";
import { CheatForm } from "./components/cheats/CheatForm.jsx";
import { VisualDashboard } from "./components/shared/VisualDashboard.jsx";
import { IdePage } from "./pages/IdePage.jsx";

export const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // public
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "ide", element: <IdePage /> },
      // protected group
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <CheatsPage /> },
          { path: "data", element: <VisualDashboard /> },

          { path: "topics", element: <TopicsPage /> },
          { path: "topic/new", element: <TopicForm /> },
          { path: "topic/:id/edit", element: <TopicForm /> },

          { path: "platforms", element: <PlatformsPage /> },
          { path: "platform/new", element: <PlatformForm /> },
          { path: "platform/:id/edit", element: <PlatformForm /> },

          { path: "cheats", element: <CheatsPage /> },
          { path: "cheat/new", element: <CheatForm /> },
          { path: "cheat/:id/edit", element: <CheatForm /> },
        ],
      },
    ],
  },
];

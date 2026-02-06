// src/routes.jsx
import App from "./App.jsx";
import { ErrorPage } from "./pages/ErrorPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { SignupPage } from "./pages/SignupPage.jsx";
import { ProtectedRoute } from "./components/shared/ProtectedRoute.jsx";
import { TopicForm } from "./components/topics/TopicForm.jsx";
import { TopicPage } from "./pages/TopicPage.jsx";

export const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // public
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },

      // protected group
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "topics", element: <TopicPage /> },
          { path: "topic/new", element: <TopicForm /> },
          { path: "topic/:id/edit", element: <TopicForm /> },
        ],
      },
    ],
  },
];

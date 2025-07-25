import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DeletePage from "./pages/delete.jsx";
import { destroy } from "./actions/destroy.jsx";
import ErrorPage from "./pages/error.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
  }
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider
      router={router}
      fallbackElement={<div>Carregando...</div>}
    />
  </StrictMode>
);

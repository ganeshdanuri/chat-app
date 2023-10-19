import React from "react";
import ReactDOM from "react-dom/client";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import LoginNew from "./components/Login/Login.jsx";

import { App } from "./App.jsx";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import "./index.css";
import store from "./store/store.js";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute component={<App />} />,
  },
  {
    path: "/login",
    element: <LoginNew />,
  },
  {
    path: "/sign-up",
    element: <LoginNew />,
  },
  {
    path: "*",
    element: <LoginNew />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <NextUIProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </NextUIProvider>
    </Provider>
  </React.StrictMode>
);

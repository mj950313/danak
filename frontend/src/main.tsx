import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SignIn from "./pages/SignIn.tsx";
import HomePage from "./pages/HomePage.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import ProductDetailPage from "./pages/ProductDetailPage.tsx";
import CommunityPage from "./pages/CommunityPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import WritePage from "./pages/WritePage.tsx";
import CommunityDetailPage from "./pages/CommunityDetailPage.tsx";
import WriteUpdatePage from "./pages/WriteUpdatePage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, path: "/", element: <HomePage /> },
      {
        path: "/products",
        element: <ProductPage />,
      },
      {
        path: "/products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "/community",
        element: <CommunityPage />,
      },
      {
        path: "/community/:id",
        element: <CommunityDetailPage />,
      },
      {
        path: "/community/write",
        element: <WritePage />,
      },
      {
        path: "/community/write/:id",
        element: <WriteUpdatePage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

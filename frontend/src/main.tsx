import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import ProductDetailPage from "./pages/ProductDetailPage.tsx";
import CommunityPage from "./pages/CommunityPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import WritePage from "./pages/WritePage.tsx";
import CommunityDetailPage from "./pages/CommunityDetailPage.tsx";
import WriteUpdatePage from "./pages/WriteUpdatePage.tsx";
import store, { persistor } from "./store/store.ts";
import { Provider } from "react-redux";
import MyPage from "./pages/MyPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistGate } from "redux-persist/es/integration/react";

const queryClient = new QueryClient();

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
        path: "/mypage",
        element: <MyPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);

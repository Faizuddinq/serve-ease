import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import BaseLayout from "./layout/Layout";
// import ErrorBoundary from "./components/ErrorBoundary";
import { Home, Auth, Orders, Tables, Menu, Dashboard } from "./pages";

// Define Routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    // errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />, // Redirect to Dashboard
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "tables",
        element: <Tables />,
      },
      {
        path: "menu",
        element: <Menu />,
      },
      {
        path: "home",
        element: <Home />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);

// Main App Component
function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate} from "react-router-dom";
import { Home, Auth, Orders, Tables, Menu, Dashboard } from "./pages";
import Header from "./components/shared/Header";
import { useSelector } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import FullScreenLoader from "./components/shared/FullScreenLoader";
import { RootState } from "./redux/store"; // ✅ Import RootState for useSelector
import { ReactNode, useMemo } from "react";

// ✅ Type for Layout Component
const Layout: React.FC = () => {
  const isLoading = useLoadData();
  const location = useLocation();
  const hideHeaderRoutes = useMemo(() => ["/auth"], []); // ✅ Use useMemo for optimization
  const { isAuth } = useSelector((state: RootState) => state.user); // ✅ Type-safe state selection

  if (isLoading) return <FullScreenLoader />;

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route path="/auth" element={isAuth ? <Navigate to="/" replace /> : <Auth />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoutes>
              <Orders />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/tables"
          element={
            <ProtectedRoutes>
              <Tables />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoutes>
              <Menu />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </>
  );
};

// ✅ Define Props Type for ProtectedRoutes
interface ProtectedRoutesProps {
  children: ReactNode;
}

// ✅ Type-safe ProtectedRoutes Component
const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const { isAuth } = useSelector((state: RootState) => state.user);
  if (!isAuth) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

// ✅ Type-safe App Component
const App: React.FC = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;

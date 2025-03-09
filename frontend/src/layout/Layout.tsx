import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/shared/Header";

// Define hidden header routes
const HIDE_HEADER_ROUTES = ["/auth", "/signin", "/signup"];

const BaseLayout = () => {
  const location = useLocation();

  return (
    <>
      {!HIDE_HEADER_ROUTES.includes(location.pathname) && <Header />}
      <Outlet /> {/* This will render child routes */}
    </>
  );
};

export default BaseLayout;

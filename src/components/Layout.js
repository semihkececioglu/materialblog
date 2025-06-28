import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTopButton from "./ScrollTopButton";
import { useLocation, Outlet } from "react-router-dom";

function Layout({ toggleTheme, searchTerm, setSearchTerm }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const isProfilePage = location.pathname.startsWith("/profile");

  const hideHeader = isAdmin || isAuthPage;
  const hideFooter = isAdmin || isAuthPage || isProfilePage;
  const hideScrollButton = isAuthPage || isProfilePage;

  return (
    <>
      {!hideHeader && (
        <Header
          toggleTheme={toggleTheme}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      <main style={{ minHeight: "80vh" }}>
        <Outlet />
      </main>

      {!hideScrollButton && <ScrollToTopButton />}
      {!hideFooter && <Footer />}
    </>
  );
}

export default Layout;

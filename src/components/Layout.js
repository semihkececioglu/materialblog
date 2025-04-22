import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTopButton from "./ScrollTopButton";
import { useLocation } from "react-router-dom";

function Layout({ children, toggleTheme, searchTerm, setSearchTerm }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <Header
        toggleTheme={toggleTheme}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <main style={{ minHeight: "80vh" }}>{children}</main>
      <ScrollToTopButton />

      {!isAdmin && <Footer />}
    </>
  );
}

export default Layout;

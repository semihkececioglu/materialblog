import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTopButton from "./ScrollTopButton";

function Layout({ children, toggleTheme, searchTerm, setSearchTerm }) {
  return (
    <>
      <Header
        toggleTheme={toggleTheme}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <main style={{ minHeight: "80vh" }}>{children}</main>
      <ScrollToTopButton />

      <Footer />
    </>
  );
}

export default Layout;

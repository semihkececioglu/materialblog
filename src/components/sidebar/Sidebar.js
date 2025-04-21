import React from "react";
import SocialMediaBox from "./SocialMediaBox";
import CategoryList from "./CategoryList";
import SidebarTags from "./SidebarTags";

const Sidebar = () => {
  return (
    <>
      <CategoryList />
      <SocialMediaBox />
      <SidebarTags />
    </>
  );
};

export default Sidebar;

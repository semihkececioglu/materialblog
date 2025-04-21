import React from "react";
import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  useTheme,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import SocialMediaBox from "./SocialMediaBox";
import CategoryList from "./CategoryList";
import SidebarTags from "./SidebarTags";

const categories = ["React", "JavaScript", "Tasarım"];

const Sidebar = () => {
  const theme = useTheme();

  return (
    <>
      <CategoryList />
      <SocialMediaBox />
      <SidebarTags />
    </>
  );
};

export default Sidebar;

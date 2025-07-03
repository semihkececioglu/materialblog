import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  IconButton,
  Collapse,
  useMediaQuery,
  Box,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CloseIcon from "@mui/icons-material/Close";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const TableOfContents = () => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h2, h3"));
    const newHeadings = elements.map((el) => {
      const id = el.id || el.textContent.replace(/\s+/g, "-").toLowerCase();
      if (!el.id) el.id = id;
      return {
        id,
        text: el.textContent,
        level: el.tagName,
        offsetTop: el.offsetTop,
      };
    });
    setHeadings(newHeadings);
    setActiveId(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      let current = null;
      for (let i = 0; i < headings.length; i++) {
        if (headings[i].offsetTop <= scrollPosition) {
          current = headings[i].id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (isMobile) setMobileOpen(false);
  };

  const groupedHeadings = headings.reduce((acc, heading) => {
    if (heading.level === "H2") {
      acc.push({ ...heading, children: [] });
    } else if (heading.level === "H3" && acc.length > 0) {
      acc[acc.length - 1].children.push(heading);
    }
    return acc;
  }, []);

  if (!headings.length) return null;

  const TOCContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mt: 2,
          borderRadius: 2,
          bgcolor:
            theme.palette.mode === "dark"
              ? "grey.900"
              : theme.palette.grey[100],
          border: `1px solid ${
            theme.palette.mode === "dark"
              ? theme.palette.grey[800]
              : theme.palette.grey[300]
          }`,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <MenuBookIcon color="primary" fontSize="small" />
            <Typography variant="h6">İçindekiler</Typography>
          </Box>
          {!isMobile && (
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? (
                <CloseIcon fontSize="small" />
              ) : (
                <MenuOpenIcon fontSize="small" />
              )}
            </IconButton>
          )}
        </Box>
        <Collapse in={open || isMobile}>
          <List dense>
            {groupedHeadings.map((heading, index) => (
              <div key={heading.id}>
                <ListItemButton
                  selected={activeId === heading.id}
                  onClick={() => handleClick(heading.id)}
                >
                  <ListItemText
                    primary={`${index + 1}. ${heading.text}`}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: activeId === heading.id ? 600 : 400,
                    }}
                  />
                </ListItemButton>
                {heading.children.map((child, childIndex) => (
                  <ListItemButton
                    key={child.id}
                    sx={{ pl: 4 }}
                    selected={activeId === child.id}
                    onClick={() => handleClick(child.id)}
                  >
                    <ListItemText
                      primary={`${index + 1}.${childIndex + 1} ${child.text}`}
                      primaryTypographyProps={{
                        fontSize: "0.8rem",
                        fontWeight: activeId === child.id ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                ))}
              </div>
            ))}
          </List>
        </Collapse>
      </Paper>
    </motion.div>
  );

  return (
    <>
      {isMobile ? (
        <Box sx={{ my: 2 }}>
          <IconButton onClick={() => setMobileOpen(!mobileOpen)}>
            <MenuBookIcon color="primary" />
            <Typography variant="body2" ml={1}>
              İçindekiler
            </Typography>
          </IconButton>
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {TOCContent}
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      ) : (
        TOCContent
      )}
    </>
  );
};

export default TableOfContents;

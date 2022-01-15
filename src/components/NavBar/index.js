import React, { useEffect } from "react";
import PropTypes from "prop-types";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Typography,
  Toolbar,
  ListItemIcon,
  IconButton,
  ListItem,
  List,
  Divider,
  CssBaseline,
  Box,
  AppBar,
  ListItemText,
  Drawer,
} from "@mui/material";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const windowLocation = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (!currentUser?.id && windowLocation.pathname !== "/") navigate("/");
  }, [windowLocation]);

  const SIDE_BAR = [
    {
      key: "users",
      name: "Users",
      location: "/",
      divider: true,
      icon: <GroupIcon />,
      canShowChild: !!currentUser?.id,
      children: [
        {
          key: "dashboard",
          name: "Dashboard",
          location: `/dashboard/${currentUser?.id}`,
          icon: <DashboardIcon />,
        },
        {
          key: "posts",
          name: "Posts",
          location: `/posts/${currentUser?.id}`,
          icon: <DynamicFeedIcon />,
        },
        {
          key: "todos",
          name: "Todos",
          location: `/todos/${currentUser?.id}`,
          icon: <PlaylistAddCheckIcon />,
        },
      ],
    },
  ];

  const getSideBarList = (list, isChild = false) => {
    return list.map(
      (
        {
          key,
          name,
          location,
          icon,
          divider = false,
          canShowChild = false,
          children = [],
        },
        index
      ) => {
        const isActive = windowLocation?.pathname?.includes(location);
        const style = {};
        if (isChild) style.paddingLeft = "30px";

        return (
          <>
            <ListItem
              selected={isActive}
              sx={style}
              button
              key={key}
              onClick={() => navigate(location)}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
            {divider && <Divider />}
            {canShowChild && getSideBarList(children, true)}
          </>
        );
      }
    );
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>{getSideBarList(SIDE_BAR)}</List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Guardian Link
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;

"use client"

import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Badge,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material"
import { Search, ShoppingCart, User, Menu, Heart } from "lucide-react"

export default function EcommerceHeader({ cartItemCount = 0, onCartClick, onSearch }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleDrawer = () => setMobileOpen(!mobileOpen)

  // 🔍 Handle search action
  const handleSearch = () => {
    if (onSearch) onSearch(searchQuery.trim())
  }

  return (
    <>
      {/* Main Header */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #2874f0, #6a1b9a)",
          boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          {/* Logo */}
          <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer" }}>
            ShopSmart
          </Typography>

          {/* Search bar (desktop only) */}
          <Box
            sx={{
              flex: 1,
              maxWidth: 500,
              display: { xs: "none", sm: "block" },
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search for products, brands and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{
                        color: "#fff",
                        bgcolor: "#ff5722",
                        "&:hover": { bgcolor: "#e64a19" },
                      }}
                      onClick={handleSearch}
                    >
                      <Search size={18} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: "white",
                  borderRadius: 20,
                  px: 1,
                },
              }}
            />
          </Box>

          {/* Right side actions */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, alignItems: "center" }}>
        

            <IconButton color="inherit">
              <Heart size={20} />
            </IconButton>

            <IconButton color="inherit" onClick={onCartClick}>
              <Badge badgeContent={cartItemCount} color="error">
                <ShoppingCart size={22} />
              </Badge>
            </IconButton>
          </Box>

          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={toggleDrawer}
          >
            <Menu size={22} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 280 }} role="presentation" onClick={toggleDrawer}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              ShopSmart
            </Typography>
          </Box>
          <Divider />

          {/* 🔍 Mobile Search */}
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                      <Search size={18} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Divider />
          <List>
          
            <ListItem button>
              <Heart size={18} style={{ marginRight: 8 }} /> <ListItemText primary="Wishlist" />
            </ListItem>
            <ListItem button onClick={onCartClick}>
              <ShoppingCart size={18} style={{ marginRight: 8 }} />
              <ListItemText primary={`Cart (${cartItemCount})`} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  )
}

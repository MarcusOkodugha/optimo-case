

import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { Container, Box, Button } from "@mui/material";
import SalesPage from "./pages/Sales";
import PurchaseOrders from "./pages/PurchaseOrders";

export default function App() {
  return (
    <BrowserRouter>
      <Container>

        <Box component="nav" sx={{ display: "flex", alignItems: "center",height:"50px"}}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{mr:2}}></Box>
            <Box
              component="img"
              src="/optimo.png"
              alt="Optimo AB"
              sx={{ height: 100, mr:  48}}
            />
            <Button
              component={Link}
              to="/sales"
              variant="text"
              sx={{ color: "black", textTransform: "none" }}
            >
              Sales
            </Button>
          <Button
            component={Link}
            to="/purchase-orders"
            variant="text"
            sx={{ color: "black", textTransform: "none", marginLeft: "auto" }}
          >
            Orders
          </Button>
          </Box>
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
        <Route path="/" element={<Navigate to="/sales" replace />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

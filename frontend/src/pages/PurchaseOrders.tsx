

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Box,
} from "@mui/material";

type PO = {
  id: number;
  supplier: string;
  quantity: number;
  order_date: string;
  estimated_delivery: string;
};

export default function PurchaseOrders() {
  const [list, setList] = useState<PO[]>([]);
  const [form, setForm] = useState({
    supplier: "",
    quantity: 0,
    order_date: "",
    estimated_delivery: "",
  });

  const fetchPOs = () =>
    fetch("http://localhost:8080/purchase-orders")
      .then((r) => r.json())
      .then(setList);

  useEffect(() => {
    fetchPOs();
  }, []);

  const addPO = () => {
    fetch("http://localhost:8080/purchase-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((r) => r.json())
      .then(() => {
        setForm({ supplier: "", quantity: 0, order_date: "", estimated_delivery: "" });
        fetchPOs();
      });
  };

  const delPO = (id: number) => {
    fetch(`http://localhost:8080/purchase-orders/${id}`, { method: "DELETE" }).then(fetchPOs);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4"  gutterBottom>
        Purchase Orders
      </Typography>
      <Paper
        sx={{
          p: 3,
          borderRadius: 5,
          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* Form section */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="Supplier"
            value={form.supplier}
            onChange={(e) => setForm({ ...form, supplier: e.target.value })}
          />
          <TextField
            label="Quantity"
            type="number"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: Number(e.target.value) })
            }
          />
          <TextField
            label="Order Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.order_date}
            onChange={(e) =>
              setForm({ ...form, order_date: e.target.value })
            }
          />
          <TextField
            label="Delivery Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.estimated_delivery}
            onChange={(e) =>
              setForm({ ...form, estimated_delivery: e.target.value })
            }
          />
<Button
  variant="contained"
  onClick={addPO}
  sx={{
    backgroundColor: "black",
    color: "white",
    "&:hover": {
      backgroundColor: "#333",
    },
    textTransform: "none",
    width: "220px",
  }}
>
  Add
</Button>
        </Box>

        {/* Table section */}
        <Box sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Supplier</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Est. Delivery</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((po) => (
                <TableRow key={po.id}>
                  <TableCell>{po.supplier}</TableCell>
                  <TableCell>{po.quantity}</TableCell>
                  <TableCell>{po.order_date}</TableCell>
                  <TableCell>{po.estimated_delivery}</TableCell>
                  <TableCell align="right">
                    <Button
                      color="error"
                      onClick={() => delPO(po.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Container>
  );
}
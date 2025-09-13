
import React, { useEffect, useState } from 'react';
import { getStockHistory } from '../services/stockHistoryService';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

export default function StockHistory() {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    getStockHistory().then(setHistory);
  }, []);

  return (
  <Box sx={{ p: { xs: 2, md: 6 }, mt: { xs: 2, md: 6 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} mb={4}>Stock History</Typography>
      <Grid container spacing={2} columns={12}>
        {history.map(h => (
          <Grid key={h.id} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Typography fontWeight={700} fontSize={18} mb={1}>ID: {h.id}</Typography>
                <Typography color="text.secondary" fontSize={14} mb={1}><b>Item:</b> {h.item_id}</Typography>
                <Typography color="text.secondary" fontSize={14} mb={1}><b>Date:</b> {h.date}</Typography>
                <Typography color="text.secondary" fontSize={14} mb={1}><b>Stock Level:</b> {h.stock_level}</Typography>
                <Typography color="text.secondary" fontSize={14} mb={1}><b>Sales:</b> {h.sales}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

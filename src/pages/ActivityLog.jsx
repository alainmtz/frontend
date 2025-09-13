
import React, { useEffect, useState } from 'react';
import { getActivityLog } from '../services/activityLogService';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    getActivityLog().then(setLogs);
  }, []);

  return (
  <Box sx={{ p: { xs: 2, md: 6 }, mt: { xs: 2, md: 6 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} mb={4}>Activity Log</Typography>
      <Grid container spacing={2} columns={12}>
        {logs.map(log => (
          <Grid key={log.id} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Typography fontWeight={700} fontSize={18} mb={1}>ID: {log.id}</Typography>
                <Typography color="text.secondary" fontSize={14} mb={1}><b>Item:</b> {log.item_id}</Typography>
                <Typography color="text.secondary" fontSize={14} mb={1}><b>Date:</b> {log.date}</Typography>
                <Typography color="text.secondary" fontSize={14} mb={1}><b>User:</b> {log.user}</Typography>
                <Typography color="text.secondary" fontSize={14} mb={1}><b>Action:</b> {log.action}</Typography>
                <Typography color="text.secondary" fontSize={14} mb={1}><b>Quantity:</b> {log.quantity}</Typography>
                <Typography color="text.secondary" fontSize={14} mb={1}><b>Details:</b> {log.details}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

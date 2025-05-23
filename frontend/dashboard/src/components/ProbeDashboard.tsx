import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Box
} from '@mui/material';

interface ProbeData {
  colo: string;
  region: string;
  timestamp: string;
  latency: number;
}

const ProbeDashboard: React.FC = () => {
  const [probes, setProbes] = useState<ProbeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get<ProbeData[]>('http://localhost:3001/api/probes')
      .then(response => {
        setProbes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching probes:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box m={4}>
      <Typography variant="h5" gutterBottom>
        🌐 EdgeLens Cloudflare Probes
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Region</TableCell>
              <TableCell>Colo</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Latency (ms)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {probes.map((probe, index) => (
              <TableRow key={index}>
                <TableCell>{probe.region}</TableCell>
                <TableCell>{probe.colo}</TableCell>
                <TableCell>{new Date(probe.timestamp).toLocaleString()}</TableCell>
                <TableCell style={{ color: probe.latency > 200 ? 'red' : 'green' }}>
                  {probe.latency}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProbeDashboard;


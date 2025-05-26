import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Card,
  CardContent,
  Container,
  Grid,
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';

interface ProbeData {
  colo: string;
  region: string;
  timestamp: string;
  latency: number;
}

const ProbeDashboard: React.FC = () => {
  const [probes, setProbes] = useState<ProbeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<ProbeData[]>('/api/probes')
      .then((response) => {
        const latestByRegion: Record<string, ProbeData> = {};
        response.data.forEach((probe) => {
          const regionKey = probe.region.toUpperCase();
          if (
            !latestByRegion[regionKey] ||
            new Date(probe.timestamp) > new Date(latestByRegion[regionKey].timestamp)
          ) {
            latestByRegion[regionKey] = probe;
          }
        });
        setProbes(Object.values(latestByRegion));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching probes:', err);
        setError('Failed to load probe data.');
        setLoading(false);
      });
  }, []);

  const avgLatency = probes.length
    ? (probes.reduce((sum, p) => sum + p.latency, 0) / probes.length).toFixed(1)
    : '-';

  const lastUpdated = probes.length
    ? new Date(
        Math.max(...probes.map((p) => new Date(p.timestamp).getTime()))
      ).toLocaleString()
    : '-';

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: '100vh',
        py: 4,
        backgroundColor: '#121212',
        color: 'white',
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
          borderRadius: 4,
          p: 4,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          color: 'white',
        }}
      >
        <Typography variant="h5" gutterBottom>
          🌐 EdgeLens Cloudflare Probes
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {[
            { label: '📈 Average Latency', value: `${avgLatency} ms` },
            { label: '📅 Last Updated', value: lastUpdated },
            { label: '📍 Total Probes', value: probes.length },
          ].map((item, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 3,
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" color="gray">
                    {item.label}
                  </Typography>
                  <Typography variant="h6" color="white">
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 440,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 3,
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            mt: 4,
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
              >
                {['Region', 'Colo', 'Timestamp', 'Latency'].map((col, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      color: '#00BFFF', // DeepSkyBlue header text
                      fontWeight: 600,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {probes.map((probe, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Chip
                      label={probe.region.toUpperCase()}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>{probe.colo}</TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {new Date(probe.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Box
                      display="flex"
                      alignItems="center"
                      color={probe.latency <= 200 ? '#66ff66' : '#ff6666'}
                    >
                      {probe.latency <= 200 ? (
                        <CheckCircle fontSize="small" style={{ marginRight: 4 }} />
                      ) : (
                        <ErrorIcon fontSize="small" style={{ marginRight: 4 }} />
                      )}
                      <Typography variant="body2">{probe.latency} ms</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default ProbeDashboard;

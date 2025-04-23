import React, { useState } from 'react';
import { searchGamesByPlatform } from './services/api';
import GameList from './components/GameList';
import './App.css';
import { Container, Grid, Alert, CircularProgress, Box, Typography, Paper, InputBase, IconButton, Tooltip } from '@mui/material';
import PlatformComboBox from './components/PlatformComboBox';
import SearchIcon from '@mui/icons-material/Search';
import Footer from './components/Footer';

interface Platform {
  id: number;
  name: string;
  alias?: string;
  icon?: string;
}

function App() {
  const [search, setSearch] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<any | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchGamesByPlatform(search, selectedPlatform?.id);
      setGames(results);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error en la búsqueda');
      setGames([]);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
        <img src="/logo.svg" alt="Logo Carátulas" width={54} height={54} style={{ marginRight: 16, filter: 'drop-shadow(0 2px 8px #1976d2cc)' }} />
        <Typography variant="h3" align="center" gutterBottom className="buscador-title" sx={{ fontWeight: 700, letterSpacing: 2, color: '#283593', mb: 0 }}>
          Buscador de Carátulas
        </Typography>
      </Box>
      <Paper elevation={3} className="buscador-box" sx={{ p: 3, mb: 4, borderRadius: 3, background: '#f5f7fa' }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={5}>
            <PlatformComboBox
              onSelect={setSelectedPlatform}
              selectedPlatformId={selectedPlatform?.id}
              label="Filtrar por consola"
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <form onSubmit={e => { e.preventDefault(); handleSearch(); }}>
              <Paper
                component="div"
                sx={{ display: 'flex', alignItems: 'center', borderRadius: 2, boxShadow: '0 2px 8px rgba(40,53,147,0.08)', background: '#fff', px: 2 }}
                elevation={0}
              >
                <InputBase
                  className="buscador-input"
                  sx={{ ml: 1, flex: 1, fontSize: 18 }}
                  placeholder="Buscar juego..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  inputProps={{ 'aria-label': 'buscar juego', style: { fontWeight: 500 } }}
                />
                <Tooltip title="Buscar">
                  <span>
                    <IconButton
                      className="buscador-btn"
                      color="primary"
                      type="submit"
                      aria-label="buscar"
                      disabled={loading || !selectedPlatform || !search.trim()}
                      sx={{ p: 1 }}
                    >
                      <SearchIcon sx={{ fontSize: 28 }} />
                    </IconButton>
                  </span>
                </Tooltip>
              </Paper>
            </form>
          </Grid>
        </Grid>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        )}
      </Paper>
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="120px">
          <CircularProgress size={48} color="primary" />
        </Box>
      )}
      <GameList games={games} selectedPlatform={selectedPlatform} search={search} />
      <Footer />
    </Container>
  );
}

export default App;

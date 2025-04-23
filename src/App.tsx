import React, { useState } from 'react';
import PlatformSelector from './PlatformSelector';
import { searchGamesByPlatform } from './services/api';
import GameList from './components/GameList';
import './App.css';
import { Container, TextField, Button, Grid, Alert, CircularProgress, Box, Typography } from '@mui/material';

interface Platform {
  id: number;
  name: string;
  alias?: string;
  icon?: string;
}

function App() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [search, setSearch] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlatformSelect = (p: Platform) => {
    setPlatform(p);
    setGames([]);
    setSearch('');
    setError(null);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchGamesByPlatform(search, platform?.id);
      setGames(results);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error en la búsqueda');
      setGames([]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!platform) {
    return <PlatformSelector onSelect={handlePlatformSelect} />;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)', py: 6 }}>
      <Container maxWidth="md" sx={{ background: '#fff', borderRadius: 6, boxShadow: 6, py: 4, px: { xs: 2, sm: 6 } }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, color: '#333', letterSpacing: 1 }}>
          Buscador de Carátulas de Consolas
        </Typography>
        <Button onClick={() => setPlatform(null)} variant="outlined" sx={{ mb: 2 }}>Elegir otra plataforma</Button>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label={`Buscar juego en ${platform.name}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyPress}
              variant="outlined"
              autoFocus
              sx={{ borderRadius: 3, background: '#f0f4fa' }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button 
              fullWidth
              variant="contained" 
              size="large"
              onClick={handleSearch}
              disabled={loading}
              sx={{ borderRadius: 3, py: 1.5, fontWeight: 700, fontSize: '1.1rem', mt: { xs: 0, sm: 2 } }}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          {loading && (
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <CircularProgress />
            </Grid>
          )}
          <Grid item xs={12}>
            <GameList games={games} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;

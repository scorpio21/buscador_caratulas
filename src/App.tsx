import React, { useState } from 'react';
import { searchGamesByPlatform } from './services/api';
import GameList from './components/GameList';
import './App.css';
import { Container, Grid, Alert, CircularProgress, Box, Typography, Paper, InputBase, IconButton, Tooltip, ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import PlatformComboBox from './components/PlatformComboBox';
import SearchIcon from '@mui/icons-material/Search';
import Footer from './components/Footer';
import theme, { darkTheme } from './theme';

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
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

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
    <ThemeProvider theme={prefersDarkMode ? darkTheme : theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
          <img src="/logo.svg" alt="Logo Carátulas" width={54} height={54} className="logo-imagen" />
          <Typography variant="h3" align="center" gutterBottom className="buscador-title" sx={{ fontWeight: 700, letterSpacing: 2, color: '#283593', mb: 0 }}>
            Buscador de Carátulas
          </Typography>
        </Box>
        <Paper elevation={3} className="buscador-box" sx={{ p: 3, mb: 4, borderRadius: 3, background: '#f5f7fa' }}>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12}>
              <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" gap={2}>
                <Box flex={{ xs: 'unset', md: '0 0 260px' }} width={{ xs: '100%', md: 260 }}>
                  <PlatformComboBox
                    onSelect={setSelectedPlatform}
                    selectedPlatformId={selectedPlatform?.id}
                    label="Filtrar por consola"
                    data-testid="combo-plataforma"
                  />
                </Box>
                <Box flex={1} width="100%">
                  <form onSubmit={e => { e.preventDefault(); handleSearch(); }} className="formulario-ancho-completo">
                    <Paper
                      component="div"
                      className="buscador-paper"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 2,
                        boxShadow: '0 2px 16px 0 rgba(40,53,147,0.12)',
                        background: 'rgba(255,255,255,0.20)',
                        backdropFilter: 'blur(9px) saturate(160%)',
                        WebkitBackdropFilter: 'blur(9px) saturate(160%)',
                        border: '1.5px solid rgba(40,53,147,0.18)',
                        px: 2,
                        width: '100%',
                        height: 48,
                        mt: { xs: 2, md: 0 },
                        transition: 'box-shadow 0.25s cubic-bezier(.4,2,.6,1), background 0.2s, border 0.3s',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          bottom: 0,
                          width: '0%',
                          height: '3px',
                          background: 'linear-gradient(90deg,#1976d2 0%,#42a5f5 100%)',
                          borderRadius: 2,
                          transition: 'width 0.35s cubic-bezier(.4,2,.6,1)',
                          zIndex: 1,
                        },
                        '&.focus-glow:before': {
                          width: '100%',
                        },
                        '&.focus-glow': {
                          boxShadow: '0 0 0 4px #1976d255, 0 8px 24px #1976d230',
                          background: 'rgba(255,255,255,0.35)',
                          border: '1.5px solid #1976d2',
                          transform: 'translateY(-2px) scale(1.02)',
                        },
                        '&:hover': {
                          boxShadow: '0 8px 32px #1976d230',
                          background: 'rgba(255,255,255,0.32)',
                          border: '1.5px solid #42a5f5',
                        }
                      }}
                      elevation={0}
                    >
                      <InputBase
                        className="buscador-input"
                        sx={{
                          ml: 1,
                          flex: 1,
                          fontSize: 18,
                          borderRadius: 2,
                          background: 'transparent',
                          fontWeight: 500,
                          height: 48,
                          px: 2,
                          boxShadow: 'none',
                          color: 'var(--buscador-text, #283593)',
                          transition: 'box-shadow 0.2s, background 0.2s',
                          '&:focus-within': {
                            outline: 'none',
                          }
                        }}
                        placeholder="Buscar juego..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        inputProps={{ 'aria-label': 'buscar juego', style: { fontWeight: 500 }, 'data-testid': 'buscador-input' }}
                        onFocus={e => e.currentTarget.closest('.buscador-paper')?.classList.add('focus-glow')}
                        onBlur={e => e.currentTarget.closest('.buscador-paper')?.classList.remove('focus-glow')}
                      />
                      <Tooltip title="Buscar">
                        <span>
                          <IconButton
                            className="buscador-btn"
                            color="primary"
                            type="submit"
                            aria-label="buscar"
                            disabled={loading || !selectedPlatform || !search.trim()}
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              transition: 'background 0.2s, transform 0.15s',
                              boxShadow: '0 2px 8px #1976d220',
                              background: 'var(--buscador-btn-bg, #fff)',
                              '&:hover': {
                                background: '#e3eafc',
                                transform: 'scale(1.12) rotate(-8deg)'
                              }
                            }}
                            data-testid="btn-buscar"
                          >
                            <SearchIcon sx={{ fontSize: 28, color: 'var(--buscador-text, #1976d2)', transition: 'color 0.2s' }} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Paper>
                  </form>
                </Box>
              </Box>
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
    </ThemeProvider>
  );
}

export default App;

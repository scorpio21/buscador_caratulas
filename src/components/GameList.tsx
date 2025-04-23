import React, { useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Dialog, DialogContent, DialogTitle, Box, Divider, Link, CircularProgress, Alert, Chip, Grow, CardActionArea } from '@mui/material';
import { fetchGameDetails } from '../services/api';

interface Game {
  id: number;
  name: string;
  cover: string | null;
  release_date?: string | null;
  platform?: string | null;
  region_id?: number | null;
  players?: string | null;
  coop?: string | null;
  developer?: string | null;
  genres?: string | null;
  overview?: string | null;
  thegamesdb_url?: string;
}

interface GameListProps {
  games: Game[];
  selectedPlatform?: any | null;
  selectedRegion?: { id: number; label: string } | null;
  search?: string;
}

const REGION_MAP: Record<number, string> = {
  1: 'North America',
  2: 'Europe',
  3: 'Australia',
  4: 'Japan',
  5: 'China',
  6: 'Asia',
  7: 'Worldwide',
  8: 'Brazil',
  9: 'Korea',
};

const GameList = ({ games, selectedPlatform, selectedRegion, search }: GameListProps) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailedGame, setDetailedGame] = useState<Game | null>(null);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/no-cover.png';
  };

  const handleCardClick = async (game: Game) => {
    setSelectedGame(game);
    setDetailedGame(null);
    setLoadingDetails(true);
    try {
      const details = await fetchGameDetails(game.id);
      setDetailedGame(details);
    } catch (e) {
      setDetailedGame(game); // fallback to basic info
    }
    setLoadingDetails(false);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
    setDetailedGame(null);
    setLoadingDetails(false);
  };

  const filteredGames = games;

  const gameToShow = detailedGame || selectedGame;

  // Mostrar mensaje solo si se ha realizado una búsqueda
  const showNoGamesMsg = search && filteredGames.length === 0;

  return (
    <>
      <Grow in timeout={600}>
        <Grid container spacing={2}>
          {showNoGamesMsg ? (
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
                No hay juegos con estos filtros.
              </Typography>
            </Grid>
          ) : (
            filteredGames.map((game) => (
              <Grid item xs={12} sm={6} md={4} key={game.id}>
                <Grow in timeout={500}>
                  <Card
                    className="game-card-glass"
                    style={{ cursor: game.cover ? 'pointer' : 'default', boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)' }}
                  >
                    <CardActionArea onClick={() => handleCardClick(game)}>
                      <CardMedia
                        component="img"
                        height="220"
                        image={game.cover || '/no-cover.png'}
                        alt={game.name}
                        onError={handleImageError}
                        sx={{ filter: 'drop-shadow(0 2px 12px #1976d2aa)' }}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#232526' }}>{game.name}</Typography>
                        {game.release_date && (
                          <Typography variant="body2" color="text.secondary">
                            Fecha de lanzamiento: {game.release_date}
                          </Typography>
                        )}
                        {game.platform && (
                          <Typography variant="body2" color="text.secondary">
                            Plataforma: {game.platform}
                          </Typography>
                        )}
                        {game.region_id && (
                          <Typography variant="body2" color="text.secondary">
                            Región: {REGION_MAP[game.region_id]}
                          </Typography>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grow>
              </Grid>
            ))
          )}
        </Grid>
      </Grow>
      <Dialog open={!!selectedGame} onClose={handleCloseModal} maxWidth="md">
        {gameToShow && (
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center">
            <Box p={2}>
              <img src={gameToShow.cover ?? '/no-cover.png'} alt={gameToShow.name} style={{ maxHeight: 400, maxWidth: 280, borderRadius: 12, boxShadow: '0 8px 32px rgba(60, 60, 120, 0.2)' }} />
            </Box>
            <DialogContent>
              <DialogTitle>{gameToShow.name}</DialogTitle>
              {loadingDetails ? (
                <Box textAlign="center" mt={2}><CircularProgress /></Box>
              ) :
                (!gameToShow.platform && !gameToShow.region_id && !gameToShow.release_date && !gameToShow.players && !gameToShow.coop && !gameToShow.developer && !gameToShow.genres && !gameToShow.overview) ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Información detallada no disponible para este juego en la base de datos.
                  </Typography>
                ) : (
                  <Typography variant="body1" gutterBottom>
                    {gameToShow.platform && (<><strong>Platform:</strong> {gameToShow.platform}<br /></>)}
                    {gameToShow.region_id && (<><strong>Region:</strong> {REGION_MAP[gameToShow.region_id] || gameToShow.region_id}<br /></>)}
                    {gameToShow.release_date && gameToShow.release_date !== '0' && (<><strong>Release Date:</strong> {gameToShow.release_date}<br /></>)}
                    {gameToShow.players && (<><strong>Players:</strong> {gameToShow.players}<br /></>)}
                    {gameToShow.coop && (<><strong>Co-op:</strong> {gameToShow.coop}<br /></>)}
                    {gameToShow.developer && (<><strong>Developer:</strong> {gameToShow.developer}<br /></>)}
                    {gameToShow.genres && (<><strong>Genres:</strong> {gameToShow.genres}<br /></>)}
                  </Typography>
                )
              }
              {gameToShow.overview ? (
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {gameToShow.overview}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Algunos datos no están disponibles vía API.<br />
                  <Link href={`https://thegamesdb.net/game.php?id=${gameToShow.id}`} target="_blank" rel="noopener">
                    Consulta la ficha oficial en TheGamesDB.
                  </Link>
                </Typography>
              )}
              <Box mt={2} display="flex" gap={2}>
                <Link href={`https://thegamesdb.net/game.php?id=${gameToShow.id}`} target="_blank" rel="noopener" underline="hover">
                  Ver ficha oficial en TheGamesDB
                </Link>
                {gameToShow.cover && (
                  <Link href={gameToShow.cover} download target="_blank" rel="noopener" underline="hover">
                    Descargar carátula
                  </Link>
                )}
                <button
                  style={{ cursor: 'pointer', padding: '6px 16px', borderRadius: 4, border: '1px solid #aaa', background: '#fafafa', fontSize: 14 }}
                  onClick={() => {
                    const datos = [
                      `Título: ${gameToShow.name}`,
                      gameToShow.platform && `Plataforma: ${gameToShow.platform}`,
                      gameToShow.region_id && `Región: ${REGION_MAP[gameToShow.region_id] || gameToShow.region_id}`,
                      gameToShow.release_date && gameToShow.release_date !== '0' && `Fecha de lanzamiento: ${gameToShow.release_date}`,
                      gameToShow.players && `Jugadores: ${gameToShow.players}`,
                      gameToShow.coop && `Co-op: ${gameToShow.coop}`,
                      gameToShow.developer && `Desarrollador: ${gameToShow.developer}`,
                      gameToShow.genres && `Géneros: ${gameToShow.genres}`,
                      gameToShow.overview && `Descripción: ${gameToShow.overview}`,
                      gameToShow.cover && `Carátula: ${gameToShow.cover}`,
                      `Ficha: https://thegamesdb.net/game.php?id=${gameToShow.id}`
                    ].filter(Boolean).join('\n');
                    navigator.clipboard.writeText(datos);
                  }}
                  title="Copiar todos los datos al portapapeles"
                >
                  Copiar datos
                </button>
              </Box>
            </DialogContent>
          </Box>
        )}
      </Dialog>
    </>
  );
};

export default GameList;

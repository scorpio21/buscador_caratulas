import React, { useEffect, useState } from 'react';
import { fetchPlatforms } from './services/api';
import { Container, Grid, Card, CardActionArea, CardContent, Typography, CircularProgress, Box, CardMedia } from '@mui/material';

interface Platform {
  id: number;
  name: string;
  alias?: string;
  icon?: string;
}

interface PlatformSelectorProps {
  onSelect: (platform: Platform) => void;
}

const getPlatformImage = (alias?: string) => {
  // Puedes personalizar las imágenes locales para algunas consolas populares
  if (!alias) return '/no-cover.png';
  // Ejemplo: busca en public/platforms/
  return `/platforms/${alias}.png`;
};

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ onSelect }) => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlatforms()
      .then((data) => {
        const arr = Array.isArray(data) ? data : Object.values(data);
        setPlatforms(arr);
        setLoading(false);
      })
      .catch((err) => {
        setError('No se pudieron cargar las plataformas');
        setLoading(false);
      });
  }, []);

  if (loading) return <Box textAlign="center" mt={6}><CircularProgress /></Box>;
  if (error) return <Box textAlign="center" mt={6}><Typography color="error">{error}</Typography></Box>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Selecciona una plataforma
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {platforms.map((platform) => (
          <Grid item xs={12} sm={6} md={4} key={platform.id}>
            <Card>
              <CardActionArea onClick={() => onSelect(platform)}>
                <CardMedia
                  component="img"
                  height="120"
                  image={getPlatformImage(platform.alias)}
                  alt={platform.name}
                  onError={(e: any) => { e.target.src = '/no-cover.png'; }}
                  sx={{ objectFit: 'contain', background: '#f0f0f0' }}
                />
                <CardContent>
                  <Typography variant="h6" align="center">{platform.name}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PlatformSelector;

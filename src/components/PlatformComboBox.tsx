import React, { useEffect, useState } from 'react';
import { fetchPlatforms } from '../services/api';
import { Autocomplete, TextField, Avatar, Box, CircularProgress, Typography } from '@mui/material';

interface Platform {
  id: number;
  name: string;
  alias?: string;
  icon?: string; // URL de la imagen
}

interface PlatformComboBoxProps {
  onSelect: (platform: Platform | null) => void;
  selectedPlatformId?: number;
  label?: string;
}

const getPlatformImage = (alias?: string) => {
  if (!alias) return '/no-cover.png';
  return `/platforms/${alias}.png`;
};

// Lista de plataformas retro (puedes ampliarla a tu gusto)
const RETRO_PLATFORM_IDS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 49, 50, 58, 59, 60, 61, 62];
// Mapea IDs a iconos personalizados (puedes añadir más PNG/SVG en /public/platforms/)
const CUSTOM_PLATFORM_ICONS: Record<number, string> = {
  10: '/platforms/ps1.png',
  11: '/platforms/ps2.png',
  14: '/platforms/xbox.png',
  15: '/platforms/xbox360.png',
  23: '/platforms/gamecube.png',
  24: '/platforms/dreamcast.png',
  25: '/platforms/wii.png',
  26: '/platforms/nes.png',
  27: '/platforms/snes.png',
  28: '/platforms/n64.png',
  32: '/platforms/megadrive.png',
  33: '/platforms/genesis.png',
  34: '/platforms/mastersystem.png',
  35: '/platforms/gameboy.png',
  36: '/platforms/gameboycolor.png',
  37: '/platforms/gameboyadvance.png',
  38: '/platforms/gbmicro.png',
  39: '/platforms/virtualboy.png',
  40: '/platforms/gamegear.png',
  41: '/platforms/lynx.png',
};

const PlatformComboBox: React.FC<PlatformComboBoxProps> = ({ onSelect, selectedPlatformId, label }) => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState<Platform | null>(null);

  useEffect(() => {
    fetchPlatforms().then((data) => {
      const arr = Array.isArray(data) ? data : Object.values(data);
      // Filtrar solo plataformas retro
      let filtered = arr.filter((p) => RETRO_PLATFORM_IDS.includes(p.id));
      // Ordenar alfabéticamente
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
      setPlatforms(filtered);
      setLoading(false);
      if (selectedPlatformId) {
        const found = filtered.find(p => p.id === selectedPlatformId) || null;
        setValue(found);
      }
    });
  }, [selectedPlatformId]);

  return (
    <Autocomplete
      options={platforms}
      loading={loading}
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue);
        onSelect(newValue);
      }}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      renderOption={(props, option) => (
        <Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }} {...props}>
          <Avatar src={CUSTOM_PLATFORM_ICONS[option.id] || option.icon || getPlatformImage(option.alias)} alt={option.name} sx={{ width: 32, height: 32, background: '#fff' }} />
          <Typography variant="body2">{option.name}</Typography>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label || 'Selecciona una plataforma'}
          InputProps={{
            ...params.InputProps,
            startAdornment: loading ? <CircularProgress color="inherit" size={18} sx={{ mr: 1 }} /> : params.InputProps.startAdornment,
          }}
        />
      )}
      sx={{ minWidth: 260, mb: 2 }}
    />
  );
};

export default PlatformComboBox;

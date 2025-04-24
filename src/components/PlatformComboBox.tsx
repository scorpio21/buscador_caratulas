import React, { useEffect, useState } from 'react';
import { fetchPlatforms } from '../services/api';
import { Autocomplete, TextField, Box, CircularProgress, Typography } from '@mui/material';

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

// Nuevo helper para obtener PNG o SVG con soporte para iconos personalizados
const getPlatformIcon = (alias?: string, id?: number) => {
  if (!alias) return '/no-cover.png';
  // Usa icono personalizado si existe para el ID
  if (id && CUSTOM_PLATFORM_ICONS[id]) {
    return CUSTOM_PLATFORM_ICONS[id];
  }
  // Si no, usa alias
  return `/platforms/${alias}.png`;
};

// Lista de plataformas retro (puedes ampliarla a tu gusto)
const RETRO_PLATFORM_IDS = [
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 21,
  24, 33, 35, 36, 38, 39, 41,
  4911, 4947 // Amiga y Amiga CD32 añadidos
  // Quitado: 37 (Mac OS)
];
// Mapea IDs a iconos personalizados (puedes añadir más PNG/SVG en /platforms/)
const CUSTOM_PLATFORM_ICONS: Record<number, string> = {
  10: '/platforms/sony-playstation.png',      // PlayStation 1
  11: '/platforms/sony-playstation-2.svg',    // PlayStation 2
  12: '/platforms/sony-playstation-3.svg',    // PlayStation 3
  4919: '/platforms/sony-playstation-4.svg',  // PlayStation 4 (ID correcto)
  4980: '/platforms/sony-playstation-5.svg',  // PlayStation 5 (ID correcto)
  13: '/platforms/sony-playstation-portable.svg', // PlayStation Portable
  39: '/platforms/sony-psvita.svg',           // PlayStation Vita
  4911: '/platforms/amiga.svg',               // Amiga
  4947: '/platforms/amiga-cd32.png',          // Amiga CD32
  // Microsoft / Xbox
  14: '/platforms/xbox.png',                  // Microsoft Xbox
  15: '/platforms/xbox-360.png',              // Microsoft Xbox 360
  // SNK / Neo Geo
  24: '/platforms/neo-geo.png',               // Neo Geo
  // Nintendo
  8: '/platforms/nintendo-ds.png',            // Nintendo DS
  7: '/platforms/nintendo-nes.png',           // Nintendo Entertainment System (NES)
  41: '/platforms/game-boy-color.png',        // Nintendo Game Boy Color
  9: '/platforms/nintendo-wii.png',           // Nintendo Wii
  38: '/platforms/nintendo-wiiu.png',         // Nintendo Wii U
  // Sega
  33: '/platforms/sega-32x.png',              // Sega 32X
  21: '/platforms/sega-cd.png',               // Sega CD
  16: '/platforms/sega-dreamcast.png',        // Sega Dreamcast
  18: '/platforms/sega-genesis.png',          // Sega Genesis
  35: '/platforms/sega-mastersystem.png',     // Sega Master System
  36: '/platforms/sega-megadrive.png',        // Sega Mega Drive
};

// Componente para mostrar el icono de plataforma con fallback de PNG a SVG y finalmente a no-cover.png
const PlatformIcon: React.FC<{ alias?: string; src?: string; alt?: string; size?: number; id?: number }> = ({ alias, src, alt, size = 32, id }) => {
  const [imgSrc, setImgSrc] = React.useState<string | undefined>(src || (alias ? getPlatformIcon(alias, id) : undefined));
  const [triedFallback, setTriedFallback] = React.useState(false);
  React.useEffect(() => {
    setImgSrc(src || (alias ? getPlatformIcon(alias, id) : undefined));
    setTriedFallback(false);
  }, [alias, src, id]);
  if (!imgSrc) return null;
  // Log de depuración: alias, id y ruta inicial
  console.log('PlatformIcon alias:', alias, 'id:', id, 'imgSrc inicial:', imgSrc);
  return (
    <Box
      component="img"
      src={imgSrc}
      alt={alt}
      width={size}
      height={size}
      onError={() => {
        if (!triedFallback && imgSrc) {
          // Fallback: si es PNG intenta SVG, si es SVG intenta PNG
          let fallbackSrc = '';
          if (imgSrc.endsWith('.png')) {
            fallbackSrc = imgSrc.replace('.png', '.svg');
          } else if (imgSrc.endsWith('.svg')) {
            fallbackSrc = imgSrc.replace('.svg', '.png');
          }
          setImgSrc(fallbackSrc);
          setTriedFallback(true);
        } else {
          // Si ya intentó el fallback y sigue fallando, muestra no-cover
          setImgSrc('/platforms/no-cover.png');
        }
      }}
      style={{ objectFit: 'contain', borderRadius: 8, boxShadow: '0 1px 6px #1976d211', background: '#fff' }}
    />
  );
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
      value={value === null ? undefined : value}
      onChange={(_, newValue) => {
        setValue(newValue);
        onSelect(newValue);
      }}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      renderOption={(props, option) => {
        const { key, ...rest } = props;
        return (
          <Box component="li" key={key} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.2, px: 1.5, borderRadius: 2, transition: 'background 0.2s', '&:hover': { background: '#e3eafc' } }} {...rest}>
            <PlatformIcon alias={option.alias} src={CUSTOM_PLATFORM_ICONS[option.id] || option.icon} alt={option.name} size={32} id={option.id} />
            <Typography variant="body1" sx={{ fontWeight: 500, color: '#1976d2', letterSpacing: 0.5 }}>{option.name}</Typography>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label || 'Selecciona una plataforma'}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              loading ? <CircularProgress color="primary" size={18} sx={{ mr: 1 }} /> : value && (
                <PlatformIcon alias={value.alias} src={CUSTOM_PLATFORM_ICONS[value.id] || value.icon} alt={value.name} size={24} id={value.id} />
              )
            ),
            sx: {
              borderRadius: 2,
              background: 'rgba(255,255,255,0.20)',
              backdropFilter: 'blur(9px) saturate(160%)',
              WebkitBackdropFilter: 'blur(9px) saturate(160%)',
              fontWeight: 500,
              fontSize: 17,
              boxShadow: '0 2px 16px 0 rgba(40,53,147,0.12)',
              height: 48,
              px: 1.5,
              border: '1.5px solid rgba(40,53,147,0.18)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'box-shadow 0.25s cubic-bezier(.4,2,.6,1), background 0.2s, border 0.3s',
              color: '#1976d2', // <-- color más visible para el texto seleccionado
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
            },
            onFocus: (e) => {
              e.target.closest('.MuiOutlinedInput-root')?.classList.add('focus-glow');
            },
            onBlur: (e) => {
              e.target.closest('.MuiOutlinedInput-root')?.classList.remove('focus-glow');
            }
          }
        }
      />
    )}
    sx={{ width: '100%', minWidth: 220, mb: 2, borderRadius: 2, boxShadow: '0 2px 8px #1976d220', background: '#f9fafd', transition: 'box-shadow 0.2s' }}
    popupIcon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 10l5 5 5-5" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    ListboxProps={{ sx: { borderRadius: 2, boxShadow: '0 4px 24px #1976d250', background: '#fff' } }}
    autoHighlight
    disableClearable
    blurOnSelect
    openOnFocus
  />
 );
}

export default PlatformComboBox;

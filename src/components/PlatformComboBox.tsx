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
const RETRO_PLATFORM_IDS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 49, 50, 58, 59, 60, 61, 62];
// Mapea IDs a iconos personalizados (puedes añadir más PNG/SVG en /platforms/)
const CUSTOM_PLATFORM_ICONS: Record<number, string> = {
  10: '/platforms/sony-playstation.png',      // PlayStation 1
  11: '/platforms/sony-playstation-2.svg',    // PlayStation 2
  12: '/platforms/sony-playstation-3.svg',    // PlayStation 3
  4919: '/platforms/sony-playstation-4.svg',  // PlayStation 4 (ID correcto)
  4980: '/platforms/sony-playstation-5.svg',  // PlayStation 5 (ID correcto)
  13: '/platforms/sony-playstation-portable.svg', // PlayStation Portable (si tienes el icono)
  39: '/platforms/sony-psvita.svg',           // PlayStation Vita (ID correcto)
  7: '/platforms/no-cover.png',
  8: '/platforms/no-cover.png',
  9: '/platforms/no-cover.png',
  14: '/platforms/no-cover.png',
  15: '/platforms/no-cover.png',
  16: '/platforms/no-cover.png',
  18: '/platforms/no-cover.png',
  21: '/platforms/no-cover.png',
  22: '/platforms/no-cover.png',
  23: '/platforms/no-cover.png',
  24: '/platforms/no-cover.png',
  25: '/platforms/no-cover.png',
  26: '/platforms/no-cover.png',
  27: '/platforms/no-cover.png',
  28: '/platforms/no-cover.png',
  29: '/platforms/no-cover.png',
  30: '/platforms/no-cover.png',
  32: '/platforms/no-cover.png',
  33: '/platforms/no-cover.png',
  34: '/platforms/no-cover.png',
  35: '/platforms/no-cover.png', // Mega Drive/Genesis (corrígelo si tienes el icono)
  36: '/platforms/no-cover.png',
  37: '/platforms/no-cover.png',
  38: '/platforms/no-cover.png', // Wii U (corrígelo si tienes el icono)
  40: '/platforms/no-cover.png',
  41: '/platforms/no-cover.png',
  49: '/platforms/no-cover.png',
  50: '/platforms/no-cover.png',
  58: '/platforms/no-cover.png',
  59: '/platforms/no-cover.png',
  60: '/platforms/no-cover.png',
  61: '/platforms/no-cover.png',
  62: '/platforms/no-cover.png',
};

// Componente para mostrar el icono de plataforma con fallback de PNG a SVG
const PlatformIcon: React.FC<{ alias?: string; src?: string; alt?: string; size?: number; id?: number }> = ({ alias, src, alt, size = 32, id }) => {
  const [imgSrc, setImgSrc] = React.useState<string | undefined>(src || (alias ? getPlatformIcon(alias, id) : undefined));
  React.useEffect(() => {
    setImgSrc(src || (alias ? getPlatformIcon(alias, id) : undefined));
  }, [alias, src, id]);
  if (!imgSrc) return null;
  // Log de depuración: alias, id y ruta inicial
  console.log('PlatformIcon alias:', alias, 'id:', id, 'imgSrc inicial:', imgSrc);
  return (
    <Box
      component="img"
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (alias && imgSrc.endsWith('.png')) {
          // Fallback SVG: usa icono personalizado si existe, si no usa alias
          let svgPath = '';
          if (id && CUSTOM_PLATFORM_ICONS[id]) {
            svgPath = CUSTOM_PLATFORM_ICONS[id].replace('.png', '.svg');
          } else {
            svgPath = `/platforms/${alias}.svg`;
          }
          console.warn('Intentando fallback SVG:', svgPath, 'para alias:', alias, 'id:', id);
          setImgSrc(svgPath);
        } else {
          console.warn('Mostrando no-cover.png para', alias, 'id:', id);
          setImgSrc('/no-cover.png');
        }
      }}
      sx={{ width: size, height: size, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 8px #1976d230', objectFit: 'contain', mr: size === 24 ? 1 : 0 }}
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
            <Typography variant="body1" sx={{ fontWeight: 500, color: '#283593', letterSpacing: 0.5 }}>{option.name}</Typography>
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
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              fontWeight: 500,
              background: 'rgba(255,255,255,0.20)',
              fontSize: 17,
              height: 48,
              boxShadow: '0 2px 16px 0 rgba(40,53,147,0.12)',
              px: 1.5,
              border: '1.5px solid rgba(40,53,147,0.18)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'box-shadow 0.25s cubic-bezier(.4,2,.6,1), background 0.2s, border 0.3s',
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
            '& .MuiInputLabel-root': {
              fontWeight: 500,
              color: '#283593',
              fontSize: 16
            }
          }}
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
};

export default PlatformComboBox;

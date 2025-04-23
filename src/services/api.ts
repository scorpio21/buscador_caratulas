import axios from 'axios';

const API_KEY = import.meta.env.VITE_THEGAMESDB_API_KEY;
const BASE_URL = '/api/thegamesdb';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Implementación de throttling
let lastRequestTime = 0;
const THROTTLE_DELAY = 1000; // 1 segundo entre solicitudes

// Mapeo de plataformas (puedes ampliar según tus necesidades)
const PLATFORM_IDS: Record<string, number> = {
  'ps2': 11,
  'playstation 2': 11,
  'ps1': 10,
  'playstation': 10,
  'ps3': 12,
  'playstation 3': 12,
  'xbox': 14,
  'xbox 360': 15,
  'gamecube': 23,
  'wii': 25,
  // Agrega más si lo necesitas
};

export function getPlatformId(query: string): number | undefined {
  const lower = query.toLowerCase();
  for (const key in PLATFORM_IDS) {
    if (lower.includes(key)) return PLATFORM_IDS[key];
  }
  return PLATFORM_IDS['ps2']; // Por defecto PS2
}

export async function searchGamesByPlatform(query: string, platformId?: number) {
  // Throttling
  const now = Date.now();
  if (now - lastRequestTime < THROTTLE_DELAY) {
    await new Promise((res) => setTimeout(res, THROTTLE_DELAY - (now - lastRequestTime)));
  }
  lastRequestTime = Date.now();

  // Usar platformId explícito si se pasa, si no, detectar por query
  const platform = platformId ?? getPlatformId(query);
  const cleanQuery = query.trim();

  // Buscar juegos por nombre y plataforma, incluyendo carátulas
  const resp = await api.get('/Games/ByGameName', {
    params: {
      apikey: API_KEY,
      name: cleanQuery,
      'filter[platform]': platform,
      include: 'boxart,platforms,developers,genres',
    }
  });

  const games = resp.data.data?.games || [];
  const images = resp.data.include?.boxart?.data || {};
  const baseImgUrl = resp.data.include?.boxart?.base_url?.original || '';
  const platforms = resp.data.include?.platforms || {};
  const developers = resp.data.include?.developers || {};
  const genres = resp.data.include?.genres || {};

  // Formatear resultados para el frontend
  return games.map((game: any) => {
    let cover = null;
    if (images[game.id] && images[game.id].length > 0) {
      const front = images[game.id].find((img: any) => img.side === 'front');
      const filename = front ? front.filename : images[game.id][0].filename;
      if (filename) {
        if (filename.startsWith('http')) {
          cover = filename;
        } else if (baseImgUrl && baseImgUrl.startsWith('http')) {
          cover = baseImgUrl + filename;
        } else {
          cover = 'https://cdn.thegamesdb.net/images/original/' + filename;
        }
      }
    }
    // Extra info
    const platform = platforms[game.platform]?.name || '';
    // Developer(s)
    let devs = '';
    if (game.developers && Array.isArray(game.developers)) {
      devs = game.developers.map((id: number) => developers[id]?.name).filter(Boolean).join(', ');
    }
    // Genres
    let genreList = '';
    if (game.genres && Array.isArray(game.genres)) {
      genreList = game.genres.map((id: number) => genres[id]?.name).filter(Boolean).join(', ');
    }
    return {
      id: game.id,
      name: game.game_title,
      release_date: game.release_date,
      cover,
      platform,
      region_id: game.region_id,
      players: game.players,
      coop: game.co_op,
      developer: devs,
      genres: genreList,
      overview: game.overview,
    };
  });
}

// Nueva función para obtener plataformas desde la API
export async function fetchPlatforms() {
  const resp = await api.get('/Platforms', {
    params: {
      apikey: API_KEY
    }
  });
  // El array de plataformas está en resp.data.data.platforms
  return resp.data.data?.platforms || [];
}

export async function fetchGameDetails(gameId: number) {
  const resp = await api.get('/Games/ByGameID', {
    params: {
      apikey: API_KEY,
      id: gameId,
      include: 'boxart,platforms,developers,genres'
    }
  });
  const game = resp.data.data?.games?.[gameId] || resp.data.data?.games?.[0] || {};
  const images = resp.data.include?.boxart?.data || {};
  const baseImgUrl = resp.data.include?.boxart?.base_url?.original || '';
  const platforms = resp.data.include?.platforms || {};
  const developers = resp.data.include?.developers || {};
  const genres = resp.data.include?.genres || {};
  let cover = null;
  if (images[gameId] && images[gameId].length > 0) {
    const front = images[gameId].find((img: any) => img.side === 'front');
    const filename = front ? front.filename : images[gameId][0].filename;
    if (filename) {
      if (filename.startsWith('http')) {
        cover = filename;
      } else if (baseImgUrl && baseImgUrl.startsWith('http')) {
        cover = baseImgUrl + filename;
      } else {
        cover = 'https://cdn.thegamesdb.net/images/original/' + filename;
      }
    }
  }
  const platform = platforms[game.platform]?.name || '';
  let devs = '';
  if (game.developers && Array.isArray(game.developers)) {
    devs = game.developers.map((id: number) => developers[id]?.name).filter(Boolean).join(', ');
  }
  let genreList = '';
  if (game.genres && Array.isArray(game.genres)) {
    genreList = game.genres.map((id: number) => genres[id]?.name).filter(Boolean).join(', ');
  }
  return {
    id: game.id,
    name: game.game_title,
    release_date: game.release_date,
    cover,
    platform,
    region_id: game.region_id,
    players: game.players,
    coop: game.co_op,
    developer: devs,
    genres: genreList,
    overview: game.overview,
    thegamesdb_url: `https://thegamesdb.net/game.php?id=${gameId}`
  };
}

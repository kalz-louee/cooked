
export type Category = 'spotify' | 'valorant' | 'anime';

export interface SpotifyData {
  topArtists: string[];
  topGenres: string[];
  recentTracks: string[];
}

export interface ValorantData {
  username: string;
  rank: string;
  mainAgent: string;
  kd: string;
  hsPercentage: string;
}

export interface AnimeData {
  topAnime: string[];
  waifuHusband: string;
  episodesWatched: string;
}

export interface RoastResult {
  roast: string;
  cookingLevel: number; // 1 to 10
  verdict: string;
}

export type RoastData = SpotifyData | ValorantData | AnimeData;

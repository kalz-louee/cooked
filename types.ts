
// Category defines the three specific things we can roast
export type Category = 'spotify' | 'gaming' | 'anime';

// Interface for Spotify data
export interface SpotifyData {
  topArtists: string[];
  topGenres: string[];
  recentTracks: string[];
}

// Generalized Gaming data
export interface GamingData {
  gameTitle: string;
  rank: string;
  playstyle: string;
  stats: string;
}

// Interface for Anime data
export interface AnimeData {
  topAnime: string[];
  waifuHusband: string;
  episodesWatched: string;
}

// Interface for the AI's response
export interface RoastResult {
  roast: string;              // The "Bad Cop" insult
  recommendations: string[];  // The "Good Cop" suggestions (3-5 items)
  cookingLevel: number;       // Roast score 1-10
  verdict: string;            // Short verdict
}

// A Union Type for all possible inputs
export type RoastData = SpotifyData | GamingData | AnimeData;

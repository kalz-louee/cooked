
// Category defines the three specific things we can roast
export type Category = 'spotify' | 'valorant' | 'anime';

// Interface for Spotify data: what we expect the user to provide
export interface SpotifyData {
  topArtists: string[];
  topGenres: string[];
  recentTracks: string[];
}

// Interface for Valorant data: stats that we can mock
export interface ValorantData {
  username: string;
  rank: string;
  mainAgent: string;
  kd: string;
  hsPercentage: string;
}

// Interface for Anime data: your watching habits
export interface AnimeData {
  topAnime: string[];
  waifuHusband: string;
  episodesWatched: string;
}

// Interface for the AI's response: structured so we can display it nicely
export interface RoastResult {
  roast: string;         // The actual text of the insult
  cookingLevel: number;  // A score from 1 to 10
  verdict: string;       // A short title like "ABSOLUTELY MID"
}

// A Union Type: RoastData can be any of the three data structures above
export type RoastData = SpotifyData | ValorantData | AnimeData;

export const MOOD_PRESETS = {
  chill: 'lofi chill beats to relax',
  energetic: 'upbeat energetic music mix',
  focus: 'deep focus study music',
  sad: 'sad emotional music',
  happy: 'happy upbeat music',
  party: 'party dance music mix',
  workout: 'workout gym music',
  sleep: 'sleep relaxing ambient music',
  morning: 'morning coffee music',
  night: 'night drive music',
  jazz: 'smooth jazz music',
  classical: 'classical music masterpieces',
  electronic: 'electronic music mix',
  rock: 'rock music classics',
  indie: 'indie alternative music',
  ambient: 'ambient atmospheric music',
  romantic: 'romantic love songs',
  melancholic: 'melancholic nostalgic music',
  motivation: 'motivational inspiring music',
  rain: 'rain sounds relaxing music',
} as const;

export type MoodName = keyof typeof MOOD_PRESETS;

/**
 * Get a random mood from the available presets
 */
export function getRandomMood(): MoodName {
  const moods = Object.keys(MOOD_PRESETS) as MoodName[];
  return moods[Math.floor(Math.random() * moods.length)];
}

/**
 * Get the search query for a given mood
 * @param mood - The mood name to look up
 * @returns The search query string, or null if mood doesn't exist
 */
export function getMoodQuery(mood: string): string | null {
  if (mood in MOOD_PRESETS) {
    return MOOD_PRESETS[mood as MoodName];
  }

  return null;
}

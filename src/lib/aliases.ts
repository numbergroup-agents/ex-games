const ADJECTIVES = [
  "Teal", "Crimson", "Velvet", "Neon", "Shadow", "Cosmic", "Frosty", "Amber",
  "Scarlet", "Mystic", "Jade", "Royal", "Toxic", "Silver", "Golden", "Salty",
  "Savage", "Petty", "Shady", "Spicy", "Bitter", "Wild", "Fierce", "Bold",
  "Chaotic", "Dramatic", "Messy", "Iconic", "Ruthless", "Cunning",
];

const ANIMALS = [
  "Panda", "Phoenix", "Viper", "Wolf", "Fox", "Raven", "Tiger", "Cobra",
  "Falcon", "Shark", "Lynx", "Owl", "Mantis", "Jaguar", "Hawk", "Bear",
  "Scorpion", "Dragon", "Panther", "Crow", "Mongoose", "Orca", "Crane",
  "Coyote", "Leopard", "Serpent", "Badger", "Stag", "Wasp", "Spider",
];

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

export function getAlias(address: string): string {
  const h = simpleHash(address.toLowerCase());
  const adj = ADJECTIVES[h % ADJECTIVES.length];
  const animal = ANIMALS[(h >> 8) % ANIMALS.length];
  const num = (h >> 16) % 1000;
  return `${adj}${animal}${num}`;
}

export const TIER_NAMES = ["Gossip", "Advisor", "Oracle"] as const;
export const TIER_EMOJIS = ["👀", "🔮", "🌟"] as const;

export const DRAMA_TIER_EMOJIS = ["", "🍵", "🔥", "💀"] as const;
export const DRAMA_TIER_LABELS = ["", "Tea Time", "Spicy", "Nuclear"] as const;

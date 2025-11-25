import { Rarity } from '../../../prisma/generated/prisma/enums';

export const MS_SHIP_NAME = 'ms-ship';
export const RABBIT_MQ_QUEUE_SHIP = 'ship-queue';
export const MS_SHIP_PATTERNS = {
  MINING_START: 'ship.mining_start',
  MINING_FINISH: 'ship.mining_finish',
  MINING_CLAIM: 'ship.mining_claim',
  MINING_PROGRESS: 'ship.mining_progress',
};

export const RARITY_MINING_MULTIPLIER: Record<Rarity, number> = {
  COMMON: 5,
  UNCOMMON: 3.5,
  RARE: 2.2,
  EPIC: 1.5,
  LEGENDARY: 1,
};

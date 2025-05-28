import { horseColors } from '../constants/horseConstants'
import type { Horse } from '../models/horse'

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomVelocity(): number {
  return getRandomInt(1, 10) * 10
}

export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function initializeHorses(): Horse[] {
  const indices = shuffleArray(Array.from({ length: 20 }, (_, i) => i))
  return indices.map((index) => ({
    id: index,
    position: 0,
    color: horseColors[index],
    speed: Math.random() * 20 + 10,
    condition: Math.floor(Math.random() * 100 + 1),
  }))
}

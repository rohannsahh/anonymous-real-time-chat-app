// utils/generatePseudoName.ts
import { v4 as uuidv4 } from 'uuid';

const adjectives = ["Quick", "Happy", "Bright", "Brave", "Eager", "Calm", "Bold", "Gentle"];
const nouns = ["Tiger", "Elephant", "Panda", "Eagle", "Lion", "Shark", "Dolphin", "Falcon"];

export const generatePseudoName = () => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const uniqueId = uuidv4().split('-')[0]; // Taking the first part of the UUID for brevity

  return `${adjective}${noun}${uniqueId}`;
};

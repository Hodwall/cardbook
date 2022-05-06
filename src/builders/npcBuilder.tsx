import npcData from './npcData.json';
import { npc } from '../features/npcsSlice.model';

interface npcnames {
  [key: string]: {
    male: string[],
    female: string[],
    family: string[]
  }
}

const names: npcnames = npcData.names;
const d = npcData.description;


const createNpc = (ancestry: string): npc => {
  const doRoll = (arr: string[]) => { return arr[Math.floor((Math.random() * arr.length))] }

  const description = `He has ${doRoll(d.hair_feature)}, ${doRoll(d.hair_length)} ${doRoll(d.hair_color)} hair. `
    + `His eyes are ${doRoll(d.eyes)} and ${doRoll(d.eyes_color)}. `
    + `His nose is ${doRoll(d.nose)} and his mouth ${doRoll(d.mouth)}. `
    + `He wears ${doRoll(d.accesories)} and a ${doRoll(d.accesories)}.`

  return {
    id: Date.now(),
    isStored: false,
    name: `${doRoll(names[ancestry]["male"])} ${doRoll(names[ancestry]["family"])}`,
    ancestry: ancestry,
    high_ability: doRoll(npcData.abilities),
    low_ability: doRoll(npcData.abilities),
    alignment: doRoll(npcData.alignments),
    age: doRoll(npcData.age),
    occupation: doRoll(npcData.occupations),
    interaction: doRoll(npcData.interactions),
    relationship: doRoll(npcData.relationships),
    voice: doRoll(npcData.voices),
    description: description
  };
}

export default createNpc;
import npcData from './npcs-data.json';
import { npc } from '../features/npcsSlice.model';

interface npcnames {
  [key: string]: string[]
}

const npcNames: npcnames = npcData.names;
 

const createNpc = (ancestry: string): npc => {
  const doRoll = (arr: string[]) => { return arr[Math.floor((Math.random() * arr.length))] }
  return {
      id: Date.now(),
      isStored: false,
      name: doRoll(npcNames[ancestry]),
      ancestry: ancestry,
      high_ability: doRoll(npcData.abilities),
      low_ability: doRoll(npcData.abilities),
      alignment: doRoll(npcData.alignments),
      occupation: doRoll(npcData.occupations),
      interaction: doRoll(npcData.interactions),
      relationship: doRoll(npcData.relationships)
  };
}

export default createNpc;
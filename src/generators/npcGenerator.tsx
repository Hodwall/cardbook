import npcData from './npcs-data.json';
import { npc } from '../features/npcsSlice.model';

const abilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const aligntment = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];
const relationship = ['friendly', 'indifferent', 'hostile'];

const createNpc = (ancestry: string): npc => {
  const doRoll = (max: number) => { return Math.floor((Math.random() * max)); }
  return {
    name: npcData.names[doRoll(npcData.names.length)],
    ancestry: ancestry,
    high_ability: abilities[doRoll(6)],
    low_ability: abilities[doRoll(6)],
    alignment: aligntment[doRoll(9)],
    occupation: 'Fisherman',
    relationship: relationship[doRoll(3)]
  };
}

export default createNpc;
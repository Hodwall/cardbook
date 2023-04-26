//@ts-nocheck
import dungeonData from './dungeonData.json';

const doRoll = (arr: string[]) => { return arr[Math.floor((Math.random() * arr.length))]; };

export const rollChamber = (purpose: string) => doRoll(dungeonData.chambers[purpose]);
export const rollChamberState = () => doRoll(dungeonData.chamber_state);
export const rollChamberContents = () => doRoll(dungeonData.chamber_contents);

export const rollDungeonRoom = (purpose: string, activeTags: number[] | [], defaultBg?: string) => {
  return {
    label: '',
    color: '#606060',
    background: defaultBg,
    tags: [...activeTags],
    content: {
      ops: [
        { insert: rollChamber(purpose), attributes: { bold: true } },
        { insert: '\n' },
        { insert: rollChamberState() },
        { insert: '\n' },
        { insert: rollChamberContents() },]
    }
  };
};

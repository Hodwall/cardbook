//@ts-nocheck
import dungeonData from './dungeonData.json';

const doRoll = (arr: string[]) => { return arr[Math.floor((Math.random() * arr.length))]; };

export const rollChamber = (purpose: string) => doRoll(dungeonData.chambers[purpose]);
export const rollChamberState = () => doRoll(dungeonData.chamber_state);
export const rollChamberContents = () => doRoll(dungeonData.chamber_contents);

export const rollFeatures = () => {
  const amount = Math.floor(Math.random() * 4);
  let features = [];
  for (let i = 0; i < amount; i++) {
    features.push(doRoll(dungeonData.features));
  }
  let features_text = '';
  for (let i = 0; i < amount; i++) {
    features_text += `${doRoll([
      'There is ',
      'You can see ',
      'There are some ',
    ])} ${features[i]}. `;
  }
  return features_text;
};

export const rollDungeonRoom = (purpose: string, activeTags: number[] | [], defaultBg?: string) => {
  return {
    label: rollChamber(purpose),
    color: '#606060',
    background: defaultBg,
    tags: [...activeTags],
    content: {
      ops: [
        { insert: rollChamber(purpose), attributes: { bold: true } },
        { insert: '\n' },
        { insert: rollChamberState() },
        { insert: '\n' },
        { insert: rollChamberContents() },
        { insert: '\n' },
        { insert: `The air is ${doRoll(dungeonData.air)}. Faint ${doRoll(dungeonData.noises)} can be heard once you enter.` },
        { insert: '\n' },
        { insert: rollFeatures() },
      ]
    }
  };
};

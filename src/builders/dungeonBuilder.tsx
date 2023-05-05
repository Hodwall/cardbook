//@ts-nocheck
import dungeonData from './dungeonData.json';

const doRoll = (arr: string[]) => { return arr[Math.floor((Math.random() * arr.length))]; };


export const rollChamber = (purpose: string) => {
  if (Math.random() < 0.3) return doRoll(dungeonData.chambers[purpose]);
  else return doRoll(dungeonData.chambers['general']);
};

export const rollChamberState = () => {
  const roll = doRoll(dungeonData.chamber_state);
  if (roll === 'This room is now being used as ') return `${roll}${doRoll(dungeonData.chambers['mine'])}`;
  else return roll;
};

export const rollChamberContents = () => {
  const result = doRoll(dungeonData.chamber_contents);
  let contents = [];
  contents.push({ insert: result, attributes: { bold: true } });
  if (!result.includes('Empty')) {
    contents.push({ insert: '\n' });
    contents.push({ insert: `This encounter is ${['easy', 'medium', 'difficult'][Math.floor((Math.random() * 3))]}` });
  }
  return contents;
};


export const rollFurnishings = (type: string) => {
  const amount = Math.floor(Math.random() * 4);
  let furnishings = [];
  for (let i = 0; i < amount; i++) {
    furnishings.push(
      { insert: `${doRoll(dungeonData.furnishings['general'])}`, attributes: { 'list': 'unordered' } }
    );
    furnishings.push({ insert: '\n', attributes: { 'list': 'unordered' } });
  }
  return furnishings;
};

export const rollFeatures = () => {
  const amount = Math.floor(Math.random() * 4);
  let features = [];
  for (let i = 0; i < amount; i++) {
    features.push(
      { insert: `${doRoll(dungeonData.features)} is ${doRoll(dungeonData.features_state)}`, attributes: { 'list': 'unordered' } }
    );
    features.push({ insert: '\n', attributes: { 'list': 'unordered' } });
  }
  return features;
};

export const rollDungeonRoom = (purpose: string, activeTags: number[] | [], defaultBg?: string) => {
  return {
    label: rollChamber(purpose),
    color: '#606060',
    background: defaultBg,
    tags: [...activeTags],
    content: {
      ops: [
        { insert: rollChamberState() },
        { insert: '\n' },
        { insert: `The air is ${doRoll(dungeonData.air)}. ${doRoll(dungeonData.noises)} can be heard`, attributes: { italic: true } },
        { insert: '\n' },
        ...rollFurnishings(),
        { insert: '\n' },
        ...rollChamberContents(),
        { insert: '\n' },
        { insert: '\n' },
        ...rollFeatures(),
      ]
    }
  };
};

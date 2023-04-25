import npcData from './npcData.json';
const names: any = npcData.names;
const d = npcData.description;


const rollNpc = (ancestry: string, gender: string, activeTags: number[] | []) => {
  const doRoll = (arr: string[]) => { return arr[Math.floor((Math.random() * arr.length))]; };
  const pronoun = gender === 'male' ? ['he', 'his'] : ['she', 'her'];
  const pronoun_uppercase = gender === 'male' ? ['He', 'His'] : ['She', 'Her'];
  const description = `${pronoun_uppercase[0]} has ${doRoll(d.hair_feature)}, ${doRoll(d.hair_length)} ${doRoll(d.hair_color)} hair. `
    + `${pronoun_uppercase[1]} eyes are ${doRoll(d.eyes)} and ${doRoll(d.eyes_color)}. `
    + `${pronoun_uppercase[1]} nose is ${doRoll(d.nose)} and ${pronoun[1]} mouth ${doRoll(d.mouth)}. `
    + `${pronoun_uppercase[0]} wears ${doRoll(d.accesories)} and a ${doRoll(d.accesories)}.`;

  const data = {
    id: Date.now(),
    isPinned: false,
    name: `${doRoll(names[ancestry][gender])} ${doRoll(names[ancestry]["family"])}`,
    ancestry: ancestry,
    gender: gender,
    high_ability: doRoll(npcData.abilities),
    low_ability: doRoll(npcData.abilities),
    alignment: doRoll(npcData.alignments),
    age: doRoll(npcData.age),
    occupation: doRoll(npcData.occupations),
    interaction: doRoll(npcData.interactions),
    relationship: doRoll(npcData.relationships),
    voice: doRoll(npcData.voices),
    description: description,
    tags: [...activeTags]
  };

  const relationship_colors: any = {
    'Friendly': '#17dd32',
    'Indifferent': '#dab202',
    'Hostile': '#f23427',
  };

  const ancestry_colors: any = {
    'human': '#2AB8D4',
    'elf': '#68D42A',
    'dwarf': '#7C695C',
  };

  return {
    label: `${data.name}
    ${data.ancestry}`,
    color: ancestry_colors[data.ancestry],
    // background: 'https://cdn.openart.ai/stable_diffusion/6913ee5a973ce7cb4584ccd59d7bd665fe2b5875_2000x2000.webp',
    tags: data.tags,
    content: {
      ops: [
        { insert: `${data.alignment} ` },
        { insert: `${data.relationship}`, attributes: { color: `${relationship_colors[data.relationship]}`, align: 'right' } },
        { insert: `\n` },
        { insert: `${data.voice}`, attributes: { color: '#14cedb' } },
        { insert: `\n` },
        { insert: `A ${data.age}, ${data.interaction} ${data.occupation}`, attributes: { bold: true } },
        { insert: `\n` },
        { insert: `\n` },
        { insert: `${data.description}`, attributes: { italics: true } }
      ]
    },
  };
};

export default rollNpc;
export interface npc {
  id: number,
  name: string,
  ancestry: string,
  gender: string,
  age: string,
  high_ability: string,
  low_ability: string,
  alignment: string,
  occupation: string,
  interaction: string,
  relationship: string,
  isStored: boolean,
  voice: string,
  description: string
}

export interface npcsSliceState {
  gender: 'male' | 'female',
  generated: npc[],
  stored: npc[],
}
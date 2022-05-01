export interface npc {
  id: number,
  name: string,
  ancestry: string,
  high_ability: string,
  low_ability: string,
  alignment: string,
  occupation: string,
  interaction: string,
  relationship: string,
  isStored: boolean,
}

export interface npcsSliceState {
  gender: 'male' | 'female',
  generated: npc[],
  stored: npc[],
}
export interface npc {
  name: string,
  ancestry: string,
  high_ability: string,
  low_ability: string,
  alignment: string,
  occupation: string,
  relationship: string,
}

export interface npcsSliceState {
  gender: 'male' | 'female',
  generated: npc[],
  saved: npc[],
}
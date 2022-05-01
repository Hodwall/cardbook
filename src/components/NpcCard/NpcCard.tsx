import Card from '../Card';
import './NpcCard.css';
import { npc } from '../../features/npcsSlice.model';

import dwarfMale from '../../img/dwarf-male.png';
import human from '../../img/human.png';

const NpcCard = (props: { data: npc }) => {
  return (
    <Card
      class={`npc-card ${props.data.ancestry}`}
      label={props.data.name}
      art={props.data.ancestry === 'human' ? human : dwarfMale}
    >
      <p className="alignment">{props.data.alignment}</p>
      <p className={`relationship ${props.data.relationship}`}>{props.data.relationship}</p>
      <p className='voice'>Has a gravel voice</p>
      <p className='occupation'>An irritable fisherman, who believes in Respect</p>
      <p className='abilities'><span className="high-ability">▲ DEX</span><span className="low-ability">▼ CHA</span></p>
      <p className='description'>He has black long hair. His nose is wide. His beard is short and braided. He wears a worn leather hood.</p>
    </Card>
  )
}

export default NpcCard;
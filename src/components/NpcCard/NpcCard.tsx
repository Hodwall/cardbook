import Card from '../Card';
import { npc } from '../../features/npcsSlice.model';

import kobold from '../../img/kobold.png';
import human from '../../img/human.png';

const NpcCard = (props: { data: npc }) => {
  return (
    <Card
      label={props.data.name}
      style={props.data.ancestry}
      art={props.data.ancestry === 'human' ? human : kobold}
      content={[
        {style: `alignment`, text: props.data.alignment }, 
        {style: `relationship ${props.data.relationship}`, text: props.data.relationship }]}
    />
  )
}

export default NpcCard;
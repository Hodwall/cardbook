import './ResultsGallery.css';

import { useAppSelector } from '../../app/hooks';
import { selectGeneratedNpcs } from '../../features/npcsSlice';

import NpcCard from "../../components/NpcCard";

const ResultsGallery = () => {
  const npcs = useAppSelector(selectGeneratedNpcs);
  return (
    <div className="results-gallery">
      {npcs.map((npc) => <NpcCard data={npc} />)}
    </div>
  )
}

export default ResultsGallery;
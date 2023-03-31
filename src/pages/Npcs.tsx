import { useState } from 'react';
import { useNpcStore, iNpc } from '../hooks/useNpcStore';
import { iTag, useTagStore } from '../hooks/useTagStore';
import ResultsGallery from '../components/ResultsGallery';
import NpcCard from "../components/NpcCard";
import NavBar from '../components/NavBar';
import createNpc from '../builders/npc/npcBuilder';


const Npcs = () => {
    const [showPinned, setShowPinned] = useState(true);
    const { npcStore, addNpc } = useNpcStore();
    const { activeTags } = useTagStore();
    const gender = 'male';

    return (
        <>
            <NavBar>
                <button onClick={() => addNpc(createNpc('human', gender, activeTags))}>Human</button>
                <button onClick={() => addNpc(createNpc('dwarf', gender, activeTags))}>Dwarf</button>
                <button onClick={() => addNpc(createNpc('elf', gender, activeTags))}>Elf</button>
            </NavBar>
            {/* tools={[
                    // <button onClick={() => dispatch(deleteAllNpcs())}>Male</button>,
                    // <button onClick={() => dispatch(deleteAllNpcs())}>Male</button>,
                    // <button onClick={() => setShowStored(!showStored)} className={`${showStored && 'active'}`}>Stored</button>,
                    // <button onClick={() => dispatch(deleteNotStoredNpcs())}>Delete not stored</button>,
                    // <button onClick={() => dispatch(deleteAllNpcs())}>Delete All</button>,
                    // <button onClick={() => dispatch(toggleGender())}>{gender}</button>
                ]} */}
            <ResultsGallery>
                {
                    (() => {
                        if (activeTags.length) {
                            return npcStore.reduce((results: iNpc[], npc: iNpc) => {
                                if (activeTags.every((tag_id: number) => npc.tags.includes(tag_id))) {
                                    results.push(npc);
                                }
                                return results;
                            }, []);
                        } else {
                            return npcStore;
                        }
                    })().map((npc: iNpc) => <NpcCard key={npc.id} data={npc} />)
                }
            </ResultsGallery>
        </>
    );
};

export default Npcs;
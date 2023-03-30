import { useState } from 'react';
import { useNpcStore } from '../hooks/useNpcStore';
import ResultsGallery from '../components/ResultsGallery';
import NpcCard from "../components/NpcCard";
import NavBar from '../components/NavBar';
import createNpc from '../builders/npc/npcBuilder';
import { iNpc } from '../builders/npc/npc.model';

import { useTagStore } from '../hooks/useTagStore';


const Npcs = () => {
    const [showPinned, setShowPinned] = useState(true);
    const { npcStore, addNpc } = useNpcStore();
    const { createTag } = useTagStore();
    const gender = 'male';

    return (
        <>
            <NavBar>
                <button onClick={() => addNpc(cregenialateNpc('human', gender))}>Human</button>
                <button onClick={() => addNpc(createNpc('dwarf', gender))}>Dwarf</button>
                <button onClick={() => addNpc(createNpc('elf', gender))}>Elf</button>
                <button onClick={() => createTag({ id: 0, label: 'A test tag ;D', type: 'default', is_active: true })}>ADD A TAG</button>
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
                    // npcStore.filter((npc: iNpc) => npc.isPinned === showPinned).map((npc: iNpc) => <NpcCard data={npc} />)
                    npcStore.map((npc: iNpc) => <NpcCard data={npc} />)
                }
            </ResultsGallery>
        </>
    );
};

export default Npcs;
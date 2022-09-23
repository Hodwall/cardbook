import React, { useState } from 'react';
import OptionsBar from '../containers/OptionsBar';
import ResultsGallery from '../containers/ResultsGallery';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addNpc, deleteAllNpcs, selectGeneratedNpcs, selectStoredNpcs, deleteNotStoredNpcs, selectGender, toggleGender } from '../features/npcsSlice';
import createNpc from '../builders/npcBuilder';

import NpcCard from "../components/NpcCard";


const Npcs = () => {
    const [showStored, setShowStored] = useState(false);
    const dispatch = useAppDispatch();
    const generatedNpcs = useAppSelector(selectGeneratedNpcs);
    const storedNpcs = useAppSelector(selectStoredNpcs);
    const gender = useAppSelector(selectGender);

    return (
        <React.Fragment>
            <OptionsBar
                options={[
                    <button onClick={() => dispatch(addNpc(createNpc('human', gender)))}>Human</button>,
                    <button onClick={() => dispatch(addNpc(createNpc('dwarf', gender)))}>Dwarf</button>,
                    <button onClick={() => dispatch(addNpc(createNpc('elf', gender)))}>Elf</button>,
                ]}
                tools={[
                    // <button onClick={() => dispatch(deleteAllNpcs())}>Male</button>,
                    // <button onClick={() => dispatch(deleteAllNpcs())}>Male</button>,
                    <button onClick={() => setShowStored(!showStored)} className={`${showStored && 'active'}`}>Stored</button>,
                    <button onClick={() => dispatch(deleteNotStoredNpcs())}>Delete not stored</button>,
                    <button onClick={() => dispatch(deleteAllNpcs())}>Delete All</button>,
                    <button onClick={() => dispatch(toggleGender())}>{gender}</button>
                ]}
            />
            <ResultsGallery>
                {/* {showStored ? generatedNpcs.map((npc) => <NpcCard data={npc} />) : storedNpcs.map((npc) => <NpcCard data={npc} />)} */}
                {showStored ? storedNpcs.map((npc) => <NpcCard data={npc} />) : generatedNpcs.map((npc) => <NpcCard data={npc} />)}
            </ResultsGallery>
        </React.Fragment>
    )
}

export default Npcs;
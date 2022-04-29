import React from 'react';
import OptionsBar from '../containers/OptionsBar';
import ResultsGallery from '../containers/ResultsGallery';

import { useAppDispatch } from '../app/hooks';
import { addNpc, deleteAllNpcs } from '../features/npcsSlice';
import createNpc from '../generators/npcGenerator';


 const Npcs = () => {
    const dispatch = useAppDispatch();

    return (
        <React.Fragment>
            <OptionsBar
                options={[
                    <button onClick={() => dispatch(addNpc(createNpc('human')))}>Human</button>,
                    <button onClick={() => dispatch(addNpc(createNpc('dwarf')))}>Dwarf</button>,
                    <button onClick={() => dispatch(addNpc(createNpc('elf')))}>Elf</button>,
                ]}
                tools={[
                    // <button onClick={() => dispatch(deleteAllNpcs())}>Male</button>,
                    <button onClick={() => dispatch(deleteAllNpcs())}>Delete All</button>
                ]}
            />
            <ResultsGallery />
        </React.Fragment>
    )
}

export default Npcs;
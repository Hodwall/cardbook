import { useEffect, useState, useRef } from 'react';
import { animated, useSpring } from 'react-spring';

import rollNpc from '../../builders/npcBuilder';
import { rollDungeonRoom } from '../../builders/dungeonBuilder';

import { useTagStore } from '../../hooks/useTagStore';
import { useCardStore } from '../../hooks/useCardStore';
import { useDeckStore } from '../../hooks/useDeckStore';
import { useSettingsStore } from '../../hooks/useSettingsStore';
import useWindowSize from '../../hooks/useWindowSize';

import PopMenu from '../PopMenu';

import { MdInsertDriveFile, MdOutlineInsertDriveFile, MdOutlineMale, MdOutlineFemale } from 'react-icons/md';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { FaTags, FaDiceD20 } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';

import './NavBar.css';
import Button from '../Button';




const NavBar = (props: {
    tagsDisplayHandler: Function,
    toolbarDisplayHandler: Function,
    displayToolbar: boolean;
}) => {
    const { tagStore, updateTagStore, activeTags, getTagByLabel } = useTagStore();
    const { deckStore, updateDeckStore } = useDeckStore();
    const { cardStore, updateCardStore, addCard, createCard, } = useCardStore();
    const { settingsStore, updateSettingsStore, updateCardScale, updateCardDefaultBg } = useSettingsStore();
    const { width } = useWindowSize();

    const [navbarSection, setNavBarSection] = useState<string>('');
    const [navbarDisplay, setNavBarDisplay] = useState(true);

    const [npcGender, setNpcGender] = useState('male');
    const [cardScale, setCardScale] = useState(settingsStore.cardScale);

    const [file, setFile] = useState<File | null>();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [popmenuSection, setPopmenuSection] = useState('');


    const animation_navbar = useSpring({
        y: props.displayToolbar ? 0 : -100,
        height: props.displayToolbar ? '22.3em' : '0em',
        opacity: props.displayToolbar ? 1 : 0,
    });

    useEffect(() => {
        updateCardScale(cardScale);
    }, [cardScale]);



    // IMPORT - EXPORT CARDS
    const handleFileChange = (e: any) => {
        if (e.target.files) setFile(e.target.files[0]);
    };

    const exportData = () => {
        const store = {
            cardStore: [...cardStore],
            deckStore: [...deckStore],
            settingsStore: settingsStore,
            tagStore: [...tagStore],
        };
        var a = document.createElement("a");
        //@ts-ignore
        var file = new Blob([JSON.stringify(store)], { type: 'text/plain' });
        a.href = URL.createObjectURL(file);
        a.download = `deckbook-backup-${Date.now()}.json`;
        a.click();
    };

    const importData = () => {
        if (file) {
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (event: any) => {
                const new_data = JSON.parse(event.target.result);
                updateCardStore(new_data.cardStore);
                updateDeckStore(new_data.deckStore);
                updateTagStore(new_data.tagStore);
                updateSettingsStore(new_data.settingsStore);
                setFile(null);
            };
        }
    };


    const getCardMenuElements = () => {
        switch (popmenuSection) {
            case 'dungeons':
                return (
                    <>
                        <Button label={'DRAW A MINE ROOM'}
                            clickHandler={() => createCard(rollDungeonRoom('mine', [... new Set([...activeTags, getTagByLabel('DUNGEON ROOM')])], settingsStore.cardDefaultBg['dungeon_mine']))}
                            defaultBgHandler={(url: string) => updateCardDefaultBg('dungeon_mine', url)}
                            defaultBg={settingsStore.cardDefaultBg['dungeon_mine']}
                        />
                        <Button clickHandler={() => setPopmenuSection('')} label={<RiArrowGoBackFill />} highlighted />
                    </>
                );
            case 'npcs':
                return (
                    <>
                        <Button clickHandler={() => setNpcGender(`${npcGender === 'male' ? 'female' : 'male'}`)} label={<span>{npcGender === 'male' ? <MdOutlineMale /> : <MdOutlineFemale />}{npcGender}</span>} highlighted />
                        <Button label={'DRAW A HUMAN'}
                            clickHandler={() => createCard(rollNpc('human', npcGender, [... new Set([...activeTags, getTagByLabel('NPC')])], settingsStore.cardDefaultBg[`npc_human_${npcGender}`]))}
                            defaultBgHandler={(url: string) => updateCardDefaultBg(`npc_human_${npcGender}`, url)}
                            defaultBg={settingsStore.cardDefaultBg[`npc_human_${npcGender}`]}
                        />
                        <Button label={'DRAW AN ELF'}
                            clickHandler={() => createCard(rollNpc('elf', npcGender, [... new Set([...activeTags, getTagByLabel('NPC')])], settingsStore.cardDefaultBg[`npc_elf_${npcGender}`]))}
                            defaultBgHandler={(url: string) => updateCardDefaultBg(`npc_elf_${npcGender}`, url)}
                            defaultBg={settingsStore.cardDefaultBg[`npc_elf_${npcGender}`]}
                        />
                        <Button label={'DRAW A DWARF'}
                            clickHandler={() => createCard(rollNpc('dwarf', npcGender, [... new Set([...activeTags, getTagByLabel('NPC')])], settingsStore.cardDefaultBg[`npc_dwarf_${npcGender}`]))}
                            defaultBgHandler={(url: string) => updateCardDefaultBg(`npc_dwarf_${npcGender}`, url)}
                            defaultBg={settingsStore.cardDefaultBg[`npc_dwarf_${npcGender}`]}
                        />
                        <Button clickHandler={() => setPopmenuSection('')} label={<RiArrowGoBackFill />} highlighted />
                    </>
                );
            default:
                return (
                    <>
                        <Button clickHandler={() => addCard(activeTags)} label={'DRAW AN EMPTY CARD'} />
                        <Button clickHandler={() => setPopmenuSection('npcs')} label={'NPCs'} />
                        <Button clickHandler={() => setPopmenuSection('quests')} label={'QUESTS'} />
                        <Button clickHandler={() => setPopmenuSection('settlements')} label={'SETTLEMENTS'} />
                        <Button clickHandler={() => setPopmenuSection('dungeons')} label={'DUNGEONS'} />
                        <Button clickHandler={() => setPopmenuSection('travel')} label={'TRAVEL'} />
                    </>
                );
        }
    };

    const getToolbarElements = () => {
        switch (navbarSection) {
            case 'settings':
                return (
                    <>
                        <div className={'card-scale'}>
                            <input type="range" min="50" max="150" value={cardScale} onChange={(e: any) => setCardScale(e.target.value)} />
                            <span>CARD SCALE {cardScale}%</span>
                        </div>
                        <Button clickHandler={() => setCardScale(100)} label={'RESET'} />
                        <Button clickHandler={() => setNavBarSection('')} label={<RiArrowGoBackFill />} highlighted />
                    </>
                );
            case 'data':
                return (
                    <>
                        <Button
                            clickHandler={() => inputRef.current?.click()}
                            label={file ? <span><MdInsertDriveFile />{file.name}</span> : <span><MdOutlineInsertDriveFile />Select a file ...</span>}
                        />
                        <input type="file" ref={inputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".json" />
                        <Button clickHandler={() => importData()} label={'IMPORT'} />
                        <Button clickHandler={() => exportData()} label={'EXPORT'} />
                        <Button clickHandler={() => setNavBarSection('')} label={<RiArrowGoBackFill />} highlighted />
                    </>
                );
            default:
                return (
                    <>

                        <PopMenu label={'CARDS'} content={(() => getCardMenuElements())()} />
                        <Button clickHandler={() => setNavBarSection('settings')} label={'SETTINGS'} />
                        <Button clickHandler={() => setNavBarSection('data')} label={'DATA'} />
                        <Button label={'ABOUT'} />
                    </>
                );
        }
    };


    return (
        <>
            {width < 800 && <button className={'ham-menu'} onClick={() => props.toolbarDisplayHandler()}><GiHamburgerMenu /></button>}
            <div className={'navbar'}>
                {
                    width < 800 ?
                        <animated.div className={`navbar-drawer ${props.displayToolbar ? '' : 'hidden'}`
                        } style={animation_navbar} >
                            <div className={`navbar-drawer-options`}>
                                {getToolbarElements()}
                            </div>
                        </animated.div >
                        :
                        getToolbarElements()
                }
                <Button clickHandler={() => props.tagsDisplayHandler()} label={<FaTags />} highlighted />
            </div >
        </>
    );
};

export default NavBar;
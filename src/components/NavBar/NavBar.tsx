import { useEffect, useState, FormEvent, useRef } from 'react';
import { animated, useSpring } from 'react-spring';

import rollNpc from '../../builders/npcBuilder';
import { rollDungeonRoom } from '../../builders/dungeonBuilder';

import { useTagStore, iTag } from '../../hooks/useTagStore';
import { useCardStore } from '../../hooks/useCardStore';
import { useDeckStore } from '../../hooks/useDeckStore';
import { useSettingsStore } from '../../hooks/useSettingsStore';
import useWindowSize from '../../hooks/useWindowSize';

import Tag from '../Tag';
import Deck from '../Deck';
import BigTag from '../BigTag';
import BackgroundPicker from '../BackgroundPicker/BackgroundPicker';

import PopButton from '../PopButton';
import PopMenu from '../PopMenu';

import { MdInsertDriveFile, MdOutlineInsertDriveFile, MdOutlineMale, MdOutlineFemale } from 'react-icons/md';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { FaTags, FaDiceD20 } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';

import './NavBar.css';




const NavBar = (props: {
    tagsDisplayHandler: Function,
}) => {
    const { tagStore, activeTags, updateActiveTags, createTag, setTagInactive, updateTagStore, getTagByLabel } = useTagStore();
    const { deckStore, createDeck, activeDeck, updateActiveDeck, updateDeckIsStrict, updateDeckTags, updateDeckStore } = useDeckStore();
    const { cardStore, addCard, createCard, updateCardStore } = useCardStore();
    const { settingsStore, updateCardScale, updateSettingsStore, updateCardDefaultBg } = useSettingsStore();
    const { width } = useWindowSize();

    const [navbarSection, setNavBarSection] = useState<string>('');
    const [navbarDisplay, setNavBarDisplay] = useState(true);
    const [tagDrawerDisplay, setTagDrawerDisplay] = useState(false);
    const [resultsTagsDrawer, setResultsTagsDrawer] = useState(tagStore);
    const [searchString, setSearchString] = useState('');
    const [deckLabel, setDeckLabel] = useState('');
    const [deckStrictMode, setDeckStrictMode] = useState(activeDeck?.isStrict);
    const [npcGender, setNpcGender] = useState('male');
    const [cardScale, setCardScale] = useState(settingsStore.cardScale);

    const [file, setFile] = useState<File | null>();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [popmenuSection, setPopmenuSection] = useState('');


    const animation = useSpring({
        to: { opacity: 1, y: 0, scale: 1, rotateZ: 0, rotateX: 0 },
        from: { opacity: 0, y: -20, scale: 1, rotateZ: 0, rotateX: 0 },
        config: { mass: 5, friction: 120, tension: 1000 }
    });
    const animation_navbar = useSpring({
        y: navbarDisplay ? 0 : -100,
        height: navbarDisplay ? '22.3em' : '0em',
        opacity: navbarDisplay ? 1 : 0,
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




    const getToolbarElements = (section: string) => {
        switch (section) {
            case 'npcs':
                return (
                    <>
                        <button onClick={() => setNpcGender(`${npcGender === 'male' ? 'female' : 'male'}`)}><span>{npcGender === 'male' ? <MdOutlineMale /> : <MdOutlineFemale />}{npcGender}</span></button>

                        <div className={'btn'}>
                            <BackgroundPicker changeBackgroundHandler={(url: string) => updateCardDefaultBg(`npc_human_${npcGender}`, url)} disabledOutsideClickHandler />
                            <span onClick={() => createCard(rollNpc('human', npcGender, [... new Set([...activeTags, getTagByLabel('NPC')])], settingsStore.cardDefaultBg[`npc_human_${npcGender}`]))}>ROLL A HUMAN</span>
                        </div>
                        <div className={'btn'}>
                            <BackgroundPicker changeBackgroundHandler={(url: string) => updateCardDefaultBg(`npc_elf_${npcGender}`, url)} disabledOutsideClickHandler />
                            <span onClick={() => createCard(rollNpc('elf', npcGender, [... new Set([...activeTags, getTagByLabel('NPC')])], settingsStore.cardDefaultBg[`npc_elf_${npcGender}`]))}>ROLL AN ELF</span>
                        </div>
                        <div className={'btn'}>
                            <BackgroundPicker changeBackgroundHandler={(url: string) => updateCardDefaultBg(`npc_dwarf_${npcGender}`, url)} disabledOutsideClickHandler />
                            <span onClick={() => createCard(rollNpc('dwarf', npcGender, [... new Set([...activeTags, getTagByLabel('NPC')])], settingsStore.cardDefaultBg[`npc_dwarf_${npcGender}`]))}>ROLL A DWARF</span>
                        </div>
                        <button className={'return'} onClick={() => setNavBarSection('generators')}><RiArrowGoBackFill /></button>
                    </>
                );
            case 'dungeons':
                return (
                    <>
                        <div className={'btn'}>
                            <BackgroundPicker changeBackgroundHandler={(url: string) => updateCardDefaultBg('dungeon_mine', url)} disabledOutsideClickHandler />
                            <span onClick={() => createCard(rollDungeonRoom('mine', [... new Set([...activeTags, getTagByLabel('DUNGEON ROOM')])], settingsStore.cardDefaultBg['dungeon_mine']))}>ROLL A MINE ROOM</span>
                        </div>
                        <button className={'return'} onClick={() => setNavBarSection('generators')}><RiArrowGoBackFill /></button>
                    </>
                );
            case 'settings':
                return (
                    <>
                        <div className={'card-scale'}>
                            <input type="range" min="50" max="150" value={cardScale} onChange={(e: any) => setCardScale(e.target.value)} />
                            <span>CARD SCALE {cardScale}%</span>
                        </div>
                        <PopButton clickHandler={() => setCardScale(100)} label={'RESET'} />
                        <PopButton clickHandler={() => setNavBarSection('')} label={<RiArrowGoBackFill />} highlighted />
                    </>
                );
            case 'data':
                return (
                    <>
                        <PopButton
                            clickHandler={() => inputRef.current?.click()}
                            label={file ? <span><MdInsertDriveFile />{file.name}</span> : <span><MdOutlineInsertDriveFile />Select a file ...</span>}
                        />
                        <input type="file" ref={inputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".json" />
                        <PopButton clickHandler={() => importData()} label={'IMPORT'} />
                        <PopButton clickHandler={() => exportData()} label={'EXPORT'} />
                        <PopButton clickHandler={() => setNavBarSection('')} label={<RiArrowGoBackFill />} highlighted />
                    </>
                );
            default:
                return (
                    <>
                        <PopButton clickHandler={() => addCard(activeTags)} label={'ADD EMPTY CARD'} />
                        {/* <NavButton clickHandler={() => setNavBarSection('generators')} label={'GENERATE CARD'} /> */}

                        <PopButton label={'GENERATE CARD'} content={
                            <PopMenu>
                                {
                                    (() => {
                                        switch (popmenuSection) {
                                            case 'npcs':
                                                return (
                                                    <>
                                                        {/* <button onClick={() => setNpcGender(`${npcGender === 'male' ? 'female' : 'male'}`)}><span>{npcGender === 'male' ? <MdOutlineMale /> : <MdOutlineFemale />}{npcGender}</span></button> */}

                                                        <div className='option' onClick={() => setNpcGender(`${npcGender === 'male' ? 'female' : 'male'}`)}><span>{npcGender === 'male' ? <MdOutlineMale /> : <MdOutlineFemale />}{npcGender}</span></div>

                                                        {/* <PopButton
                                                            label={'ROLL HUMAN'}
                                                            clickHandler={() => createCard(rollNpc('human', npcGender, [... new Set([...activeTags, getTagByLabel('NPC')])], settingsStore.cardDefaultBg[`npc_human_${npcGender}`]))}
                                                            defaultBg={settingsStore.cardDefaultBg[`npc_human_${npcGender}`]}
                                                        /> */}

                                                        <div className='option' onClick={() => createCard(rollNpc('elf', npcGender, [... new Set([...activeTags, getTagByLabel('NPC')])], settingsStore.cardDefaultBg[`npc_elf_${npcGender}`]))} >ROLL AN ELF</div>
                                                        <div className='option' onClick={() => createCard(rollNpc('dwarf', npcGender, [... new Set([...activeTags, getTagByLabel('NPC')])], settingsStore.cardDefaultBg[`npc_dwarf_${npcGender}`]))} >ROLL A DWARF</div>

                                                        {/* <div className='option'>
                                                            <BackgroundPicker changeBackgroundHandler={(url: string) => updateCardDefaultBg(`npc_human_${npcGender}`, url)} disabledOutsideClickHandler />
                                                            <span onClick={() => createCard(rollNpc('human', npcGender, [... new Set([...activeTags, getTagByLabel('NPC')])], settingsStore.cardDefaultBg[`npc_human_${npcGender}`]))}>ROLL A HUMAN</span>
                                                        </div>
                                                        <div className='option'>
                                                            <BackgroundPicker changeBackgroundHandler={(url: string) => updateCardDefaultBg(`npc_elf_${npcGender}`, url)} disabledOutsideClickHandler />
                                                            <span onClick={() => createCard(rollNpc('elf', npcGender, [... new Set([...activeTags, getTagByLabel('NPC')])], settingsStore.cardDefaultBg[`npc_elf_${npcGender}`]))}>ROLL AN ELF</span>
                                                        </div>
                                                        <div className='option'>
                                                            <BackgroundPicker changeBackgroundHandler={(url: string) => updateCardDefaultBg(`npc_dwarf_${npcGender}`, url)} disabledOutsideClickHandler />
                                                            <span onClick={() => createCard(rollNpc('dwarf', npcGender, [... new Set([...activeTags, getTagByLabel('NPC')])], settingsStore.cardDefaultBg[`npc_dwarf_${npcGender}`]))}>ROLL A DWARF</span>
                                                        </div> */}

                                                        <div className='option' onClick={() => setPopmenuSection('')} ><RiArrowGoBackFill /></div>
                                                    </>
                                                );
                                            default:
                                                return (
                                                    <>
                                                        <div className='option' onClick={() => setPopmenuSection('npcs')} >NPCs</div>
                                                        <div className='option' onClick={() => setPopmenuSection('quests')} >QUESTS</div>
                                                        <div className='option' onClick={() => setPopmenuSection('settlements')} >SETTLEMENTS</div>
                                                        <div className='option' onClick={() => setPopmenuSection('dungeons')} >DUNGEONS</div>
                                                        <div className='option' onClick={() => setPopmenuSection('travel')} >TRAVEL</div>
                                                    </>
                                                );
                                        }
                                    })()
                                }
                            </PopMenu>
                        } />

                        <PopButton clickHandler={() => setNavBarSection('settings')} label={'SETTINGS'} />
                        <PopButton clickHandler={() => setNavBarSection('data')} label={'MANAGE DATA'} />
                        <PopButton label={'ABOUT'} />
                    </>
                );
        }
    };


    return (
        <>
            {width < 800 && <button className={'ham-menu'} onClick={() => props.tagsDisplayHandler()}><GiHamburgerMenu /></button>}
            < div className={'navbar'} >
                {
                    width < 800 ?
                        <animated.div className={`navbar-drawer ${navbarDisplay ? '' : 'hidden'}`
                        } style={animation_navbar} >
                            <div className={`navbar-drawer-options`}>
                                {getToolbarElements(navbarSection)}
                            </div>
                        </animated.div >
                        :
                        getToolbarElements(navbarSection)
                }
                <PopButton clickHandler={() => props.tagsDisplayHandler()} label={<FaTags />} highlighted />
            </div >
        </>
    );
};

export default NavBar;
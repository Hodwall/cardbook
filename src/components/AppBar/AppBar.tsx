import { useEffect, useState, FormEvent, useRef } from 'react';
import { animated, useSpring } from 'react-spring';
import rollNpc from '../../builders/npc/npcBuilder';
import { useTagStore, iTag } from '../../hooks/useTagStore';
import { useCardStore } from '../../hooks/useCardStore';
import { useDeckStore } from '../../hooks/useDeckStore';
import { useSettingsStore } from '../../hooks/useSettingsStore';
import useWindowSize from '../../hooks/useWindowSize';
import Tag from '../Tag';
import Deck from '../Deck';
import BigTag from '../BigTag';
import { MdInsertDriveFile, MdOutlineInsertDriveFile, MdOutlineMale, MdOutlineFemale } from 'react-icons/md';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { FaTags, FaDiceD20 } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import './AppBar.css';


const AppBar = () => {
	const { tagStore, activeTags, updateActiveTags, createTag, setTagInactive, updateTagStore, getTagByLabel } = useTagStore();
	const { deckStore, createDeck, activeDeck, updateActiveDeck, updateDeckIsStrict, updateDeckTags } = useDeckStore();
	const { cardStore, addCard, createCard, updateCardStore } = useCardStore();
	const { settingsStore, updateCardScale } = useSettingsStore();
	const { width } = useWindowSize();

	const [toolbarSection, setToolbarSection] = useState<string>('');
	const [toolbarDisplay, setToolbarDisplay] = useState(true);
	const [tagDrawerDisplay, setTagDrawerDisplay] = useState(false);
	const [resultsTagsDrawer, setResultsTagsDrawer] = useState(tagStore);
	const [searchString, setSearchString] = useState('');
	const [deckLabel, setDeckLabel] = useState('');
	const [deckStrictMode, setDeckStrictMode] = useState(activeDeck?.isStrict);
	const [cardScale, setCardScale] = useState(settingsStore.cardScale);
	const [npcGender, setNpcGender] = useState('male');
	const [file, setFile] = useState<File | null>();

	const inputRef = useRef<HTMLInputElement | null>(null);

	const animation = useSpring({
		y: tagDrawerDisplay ? 0 : -100,
		height: tagDrawerDisplay ? '400px' : '0px',
		opacity: tagDrawerDisplay ? 1 : 0,
	});

	const animation_toolbar = useSpring({
		y: toolbarDisplay ? 0 : -100,
		height: toolbarDisplay ? '400px' : '0px',
		opacity: toolbarDisplay ? 1 : 0,
	});

	useEffect(() => {
		updateCardScale(cardScale);
	}, [cardScale]);

	// SEARCH TAGS
	useEffect(() => {
		const search_store = [... new Set([...tagStore, ...deckStore])];
		if (!searchString || searchString === '') {
			setResultsTagsDrawer(search_store);
		} else {
			setResultsTagsDrawer(search_store.reduce((results: any[], item: any) => {
				if (item.label.search(searchString) != -1) results.push(item);
				return results;
			}, []));
		}
	}, [tagStore, deckStore, searchString]);

	useEffect(() => {
		if (activeDeck) setDeckStrictMode(activeDeck.isStrict);
	}, [activeDeck]);

	const handleSearchKeyDown = (e: any) => {
		if (e.key === 'Enter' && resultsTagsDrawer.length === 0) {
			let new_tag = { label: searchString, type: 'default' };
			createTag(new_tag);
			setSearchString('');
		}
	};

	// IMPORT - EXPORT CARDS
	const handleFileChange = (e: any) => {
		if (e.target.files) setFile(e.target.files[0]);
	};

	const exportData = () => {
		const store = {
			cardStore: [...cardStore],
			tagStore: [...tagStore]
		};
		var a = document.createElement("a");
		//@ts-ignore
		var file = new Blob([JSON.stringify(store)], { type: 'text/plain' });
		a.href = URL.createObjectURL(file);
		a.download = 'deckbook-backup.json';
		a.click();
	};

	const importData = () => {
		if (file) {
			let reader = new FileReader();
			reader.readAsText(file);
			reader.onload = (event: any) => {
				const new_data = JSON.parse(event.target.result);
				updateCardStore(new_data.cardStore);
				updateTagStore(new_data.tagStore);
				setFile(null);
			};
		}
	};

	// DECK MANAGEMENT
	const handleCreateDeck = (e: any) => {
		if (e.key === 'Enter') {
			createDeck(e.target.value, deckStrictMode, activeTags);
			setDeckLabel('');
		}
	};

	const handleReturnDeck = () => {
		updateActiveDeck(null);
		updateActiveTags(null);
	};

	const handleStrictMode = () => {
		if (activeDeck) updateDeckIsStrict(activeDeck.id, !deckStrictMode);
		setDeckStrictMode(!deckStrictMode);
	};

	// HANDLERS
	const handleToggleToolbarDisplay = () => {
		if (tagDrawerDisplay) setTagDrawerDisplay(false);
		setToolbarDisplay(!toolbarDisplay);
	};

	const handleToggleTagsDisplay = () => {
		if (toolbarDisplay) setToolbarDisplay(false);
		setTagDrawerDisplay(!tagDrawerDisplay);
	};

	const getToolbarElements = (section: string) => {
		switch (section) {
			case 'npcs':
				return (
					<>
						<button onClick={() => setNpcGender(`${npcGender === 'male' ? 'female' : 'male'}`)}><span>{npcGender === 'male' ? <MdOutlineMale /> : <MdOutlineFemale />}{npcGender}</span></button>
						<button onClick={() => createCard(rollNpc('human', npcGender, [... new Set([...activeTags, getTagByLabel('NPC')])]))}>ROLL A HUMAN</button>
						<button onClick={() => createCard(rollNpc('elf', npcGender, [... new Set([...activeTags, getTagByLabel('NPC')])]))}>ROLL AN ELF</button>
						<button onClick={() => createCard(rollNpc('dwarf', npcGender, [... new Set([...activeTags, getTagByLabel('NPC')])]))}>ROLL A DWARF</button>
						<button className={'return'} onClick={() => setToolbarSection('')}><RiArrowGoBackFill /></button>
					</>
				);
			case 'generators':
				return (
					<>
						<button onClick={() => setToolbarSection('npcs')}>NPCs</button>
						<button onClick={() => setToolbarSection('locations')}>BUILDINGS</button>
						<button onClick={() => setToolbarSection('locations')}>DUNGEONS</button>
						<button onClick={() => setToolbarSection('locations')}>TRAVEL</button>
						<button className={'return'} onClick={() => setToolbarSection('')}><RiArrowGoBackFill /></button>
					</>
				);
			case 'settings':
				return (
					<>
						<div className={'card-scale'}>
							<input type="range" min="50" max="150" value={cardScale} onChange={(e: any) => setCardScale(e.target.value)} />
							<span>CARD SCALE {cardScale}%</span>
						</div>
						<button onClick={() => setCardScale(100)}>RESET</button>
						<button className={'return'} onClick={() => setToolbarSection('')}><RiArrowGoBackFill /></button>
					</>
				);
			case 'data':
				return (
					<>
						<button onClick={() => inputRef.current?.click()}>
							{file ? <span><MdInsertDriveFile />`${file.name}`</span> : <span><MdOutlineInsertDriveFile />Select a file ...</span>}
						</button>
						<input type="file" ref={inputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".json" />
						<button onClick={() => importData()}>IMPORT</button>
						<button onClick={() => exportData()}>EXPORT</button>
						<button className={'return'} onClick={() => setToolbarSection('')}><RiArrowGoBackFill /></button>
					</>
				);
			default:
				return (
					<>
						<button onClick={() => addCard(activeTags)}>ADD EMPTY CARD</button>
						<button onClick={() => setToolbarSection('generators')}>GENERATE CARD</button>
						<button onClick={() => setToolbarSection('settings')}>SETTINGS</button>
						<button onClick={() => setToolbarSection('data')}>MANAGE DATA</button>
					</>
				);
		}
	};


	return (
		<div className={'appbar'}>

			<div className={'header'}>
				<div className={'logo'}>
					<span>DUNGEON MASTER'S</span>
					<span>DECKBOOK</span>
				</div>
				{width < 800 && <button className={'ham-menu'} onClick={handleToggleToolbarDisplay}><GiHamburgerMenu /></button>}
				<div className={'toolbar'}>
					{
						width < 800 ?
							<animated.div className={`toolbar-drawer ${toolbarDisplay ? '' : 'hidden'}`} style={animation_toolbar}>
								<div className={`toolbar-drawer-options`}>
									{getToolbarElements(toolbarSection)}
								</div>
							</animated.div>
							:
							getToolbarElements(toolbarSection)
					}
					<button className={'tags'} onClick={handleToggleTagsDisplay}><FaTags /></button>
				</div>
			</div>

			<div className={'tag-deck-bar'}>
				<div className={'tagbar'}>
					{
						activeTags.reduce((results: iTag[], tag_id: number) => {
							results.push(tagStore.find((tag: iTag) => tag.id === tag_id));
							return results;
						}, [])
							.sort((a: iTag, b: iTag) => (a.label > b.label) ? 1 : (a.label < b.label) ? -1 : 0)
							.map((tag: iTag, index: number) =>
							(<Tag
								key={index}
								id={tag.id}
								label={tag.label}
								type={tag.type}
								deleteHandler={() => setTagInactive(tag.id)}
								canDelete
								canManageDeck
							/>))
					}
				</div>
				<div className={'deckbar'}>
					<button onClick={() => updateActiveTags([])}>CLEAR</button>
					<button className={`${deckStrictMode ? 'strict' : ''}`} onClick={handleStrictMode}>STRICT</button>
					{activeDeck &&
						<>
							{/* <button onClick={() => updateDeckTags(activeDeck.id, activeTags)}><MdSave /></button> */}
							<button onClick={handleReturnDeck}><RiArrowGoBackFill /></button>
							<button>{activeDeck?.label}</button>
						</>
					}
					{!activeDeck && <input type="text" value={deckLabel} onChange={(e) => setDeckLabel(e.target.value)} onKeyDown={handleCreateDeck} />}
				</div>
			</div>


			<animated.div className={`tags-drawer ${tagDrawerDisplay ? '' : 'hidden'}`} style={animation}>
				<div className={'results'}>
					{
						resultsTagsDrawer.reduce((results: any[], item: any) => {
							if (!activeTags.includes(item.id) && (!activeDeck || activeDeck.id != item.id)) results.push(item);
							return results;
						}, [])
							.sort((a: any, b: any) => (a.label > b.label) ? 1 : (a.label < b.label) ? -1 : 0)
							.map((item: any, index: number) => {
								if (item.tags) return <Deck key={index} id={item.id} label={item.label} tags={item.tags} />;
								else return <BigTag key={index} id={item.id} label={item.label} />;
							})
					}
				</div>
				<form onSubmit={(e: FormEvent) => { e.preventDefault(); }}>
					<input type="text" value={searchString} onChange={(e) => setSearchString(e.target.value)} onKeyDown={handleSearchKeyDown} />
				</form>
			</animated.div>

		</div >
	);
};

export default AppBar;
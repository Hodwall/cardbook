import { useEffect, useState, FormEvent, useRef } from 'react';
import { animated, useSpring } from 'react-spring';
import createNpc from '../../builders/npc/npcBuilder';
import { useNpcStore } from '../../hooks/useNpcStore';
import { useTagStore, iTag } from '../../hooks/useTagStore';
import { useCardStore } from '../../hooks/useCardStore';
import { iDeck, useDeckStore } from '../../hooks/useDeckStore';
import Tag from '../Tag';
import Deck from '../Deck';
import BigTag from '../BigTag';
import './AppBar.css';


const AppBar = () => {
	const { tagStore, activeTags, updateActiveTags, createTag, setTagInactive, updateTagStore } = useTagStore();
	const { deckStore, createDeck, deleteDeck, activeDeck, updateActiveDeck, getDeck } = useDeckStore();
	const { cardStore, addCard, updateCardStore } = useCardStore();
	const { npcStore, updateNpcStore, addNpc } = useNpcStore();

	const [toolbarSection, setToolbarSection] = useState<string>('');
	const [tagDrawerDisplay, setTagDrawerDisplay] = useState(false);
	const [searchString, setSearchString] = useState('');
	const [deckLabel, setDeckLabel] = useState('');
	const [resultsTagsDrawer, setResultsTagsDrawer] = useState(tagStore);
	const [file, setFile] = useState<File | null>();

	const inputRef = useRef<HTMLInputElement | null>(null);

	const animation = useSpring({
		y: tagDrawerDisplay ? 0 : -100,
		height: tagDrawerDisplay ? '400px' : '0px',
		opacity: tagDrawerDisplay ? 1 : 0,
	});

	useEffect(() => {
		if (!searchString || searchString === '') {
			setResultsTagsDrawer(tagStore);
		} else {
			setResultsTagsDrawer(tagStore.reduce((results: iTag[], tag: iTag) => {
				if (tag.label.search(searchString) != -1) results.push(tag);
				return results;
			}, []));
		}
	}, [tagStore, searchString]);

	const handleSearchChange = (e: any) => {
		setSearchString(e.target.value);
	};

	const handleSearchKeyDown = (e: any) => {
		if (e.key === 'Enter') {
			if (resultsTagsDrawer.length === 0) {
				let new_tag = { label: searchString, type: 'default' };
				createTag(new_tag);
				setSearchString('');
			}
		}
	};

	const handleUploadClick = () => {
		inputRef.current?.click();
	};

	const handleFileChange = (e: any) => {
		if (e.target.files) setFile(e.target.files[0]);
	};

	const handleCreateDeck = (e: any) => {
		if (e.key === 'Enter') {
			createDeck(e.target.value, activeTags);
			setDeckLabel('');
		}
	};

	const handleReturnDeck = () => {
		updateActiveDeck(null);
		updateActiveTags([]);
	};

	const exportData = () => {
		const store = {
			cardStore: [...cardStore],
			npcStore: [...npcStore],
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
				updateNpcStore(new_data.npcStore);
				updateTagStore(new_data.tagStore);
				setFile(null);
			};
		}
	};

	const getToolbarElements = (section: string) => {
		switch (section) {
			case 'npcs':
				return (
					<>
						<button>MALE</button>
						<button onClick={() => addNpc(createNpc('human', 'male', activeTags))}>ROLL A HUMAN</button>
						<button onClick={() => addNpc(createNpc('elf', 'male', activeTags))}>ROLL AN ELF</button>
						<button onClick={() => addNpc(createNpc('dwarf', 'male', activeTags))}>ROLL A DWARF</button>
						<button className={'return'} onClick={() => setToolbarSection('')}>RETURN</button>
					</>
				);
			case 'blank':
				return (
					<>
						<button onClick={() => addCard(activeTags)}>ADD BLANK CARD</button>
						<button className={'return'} onClick={() => setToolbarSection('')}>RETURN</button>
					</>
				);
			case 'data':
				return (
					<>
						<button onClick={handleUploadClick}>
							{file ? `${file.name}` : 'Click to select'}
						</button>
						<input type="file" ref={inputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".json" />
						<button onClick={() => importData()}>IMPORT DATA</button>
						<button onClick={() => exportData()}>EXPORT DATA</button>
						<button className={'return'} onClick={() => setToolbarSection('')}>RETURN</button>
					</>
				);
			default:
				return (
					<>
						<button onClick={() => setToolbarSection('treasures')}>TREASURES</button>
						<button onClick={() => setToolbarSection('npcs')}>NPCs</button>
						<button onClick={() => setToolbarSection('locations')}>LOCATIONS</button>
						<button onClick={() => setToolbarSection('blank')}>BLANK</button>
						<button onClick={() => setToolbarSection('data')}>DATA</button>
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

				<div className={'toolbar'}>
					{getToolbarElements(toolbarSection)}
					<button className={'tags'} onClick={() => setTagDrawerDisplay(!tagDrawerDisplay)}>TAGS</button>
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
							/>))
					}
				</div>
				<div className={'deckbar'}>
					<button onClick={() => updateActiveTags([])}>CLEAR ACTIVE TAGS</button>
					{activeDeck &&
						<>
							<button onClick={handleReturnDeck}>RETURN DECK</button>
							<button>{getDeck(activeDeck)?.label}</button>
						</>
					}
					{!activeDeck && <input type="text" value={deckLabel} onChange={(e) => setDeckLabel(e.target.value)} onKeyDown={handleCreateDeck} />}
				</div>
			</div>


			<animated.div className={'tags-drawer'} style={animation}>
				<div className={'results'}>
					{
						resultsTagsDrawer.reduce((results: iTag[], tag: iTag) => {
							if (!activeTags.includes(tag.id)) {
								results.push(tag);
							}
							return results;
						}, [])
							.sort((a: iTag, b: iTag) => (a.label > b.label) ? 1 : (a.label < b.label) ? -1 : 0)
							.map((tag: iTag, index: number) => <BigTag key={index} id={tag.id} label={tag.label} />)
					}
					{
						!activeDeck && deckStore.sort((a: iDeck, b: iDeck) => (a.label > b.label) ? 1 : (a.label < b.label) ? -1 : 0)
							.map((deck: iDeck, index: number) =>
							(<Deck
								key={index}
								id={deck.id}
								label={deck.label}
								tags={deck.tags}
							/>))
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
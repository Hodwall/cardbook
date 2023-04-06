import { useEffect, useState, FormEvent } from 'react';
import { animated, useSpring } from 'react-spring';
import createNpc from '../../builders/npc/npcBuilder';
import { useNpcStore } from '../../hooks/useNpcStore';
import { useTagStore, iTag } from '../../hooks/useTagStore';
import { useCardStore, iCard } from '../../hooks/useCardStore';
import Tag from '../Tag';
import BigTag from '../BigTag';
import './AppBar.css';


const AppBar = () => {
	const { tagStore, activeTags, createTag, setTagInactive } = useTagStore();
	const { cardStore, addCard } = useCardStore();
	const [toolbarSection, setToolbarSection] = useState<string>('');
	const [tagDrawerDisplay, setTagDrawerDisplay] = useState(false);
	const [searchString, setSearchString] = useState('');
	const [resultsTagsDrawer, setResultsTagsDrawer] = useState(tagStore);
	const { addNpc } = useNpcStore();

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

	const handleKeyDown = (e: any) => {
		if (e.key === 'Enter') {
			if (resultsTagsDrawer.length === 0) {
				let new_tag = { label: searchString, type: 'default' };
				createTag(new_tag);
				setSearchString('');
			}
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
			default:
				return (
					<>
						<button onClick={() => setToolbarSection('treasures')}>TREASURES</button>
						<button onClick={() => setToolbarSection('npcs')}>NPCs</button>
						<button onClick={() => setToolbarSection('locations')}>LOCATIONS</button>
						<button onClick={() => setToolbarSection('blank')}>BLANK</button>
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



			<div className={'tagbar'}>
				{
					tagStore.reduce((results: iTag[], tag: iTag) => {
						if (tag.is_active) results.push(tag);
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
				</div>
				<form onSubmit={(e: FormEvent) => { e.preventDefault(); }}>
					<input type="text" value={searchString} onChange={handleSearchChange} onKeyDown={handleKeyDown} />
				</form>
			</animated.div>

		</div >
	);
};

export default AppBar;
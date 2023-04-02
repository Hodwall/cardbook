import { useEffect, useState, FormEvent } from 'react';
import { animated, useSpring } from 'react-spring';
import createNpc from '../../builders/npc/npcBuilder';
import { useNpcStore } from '../../hooks/useNpcStore';
import { useTagStore, iTag } from '../../hooks/useTagStore';
import Tag from '../Tag';
import BigTag from '../BigTag';
import styles from './AppBar.module.css';


const AppBar = () => {
	const { tagStore, activeTags, createTag, setTagInactive } = useTagStore();
	const [toolbarSection, setToolbarSection] = useState<string | null>(null);
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
					</>
				);
			case 'blank':
				return (
					<>
						<button>ADD BLANK CARD</button>
					</>
				);
			default:
				return null;
		}
	};

	return (
		<div className={styles.appbar}>
			<div className={styles.header}>
				<div className={styles.logo}>
					<span>DUNGEON MASTER'S</span>
					<span>DECKBOOK</span>
				</div>
				<button onClick={() => setToolbarSection('treasures')}>TREASURES</button>
				<button onClick={() => setToolbarSection('npcs')}>NPCs</button>
				<button onClick={() => setToolbarSection('locations')}>LOCATIONS</button>
				<button onClick={() => setToolbarSection('blank')}>BLANK</button>
			</div>
			<div className={styles.toolbar}>
				{toolbarSection && getToolbarElements(toolbarSection)}
				<button onClick={() => setTagDrawerDisplay(!tagDrawerDisplay)}>TAGS</button>
			</div>
			<div className={styles.tagbar}>
				{
					tagStore.reduce((results: iTag[], tag: iTag) => {
						if (tag.is_active) results.push(tag);
						return results;
					}, []).map((tag: iTag, index: number) =>
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
			<animated.div className={styles.tags_drawer} style={animation}>
				<div className={styles.tags_results}>
					{
						resultsTagsDrawer.reduce((results: iTag[], tag: iTag) => {
							if (!activeTags.includes(tag.id)) {
								results.push(tag);
							}
							return results;
						}, []).map((tag: iTag, index: number) => <BigTag key={index} id={tag.id} label={tag.label} />)
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
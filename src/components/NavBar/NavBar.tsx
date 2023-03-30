import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { animated, useSpring } from 'react-spring';
import { useTagStore, iTag } from '../../hooks/useTagStore';
import NavTag from '../NavTag';
import Tag from '../Tag';
import './NavBar.css';


const NavBar = (props: { children?: React.ReactNode; }) => {
	const { tagStore, createTag } = useTagStore();
	const [displayTagsDrawer, setDisplayTagsDrawer] = useState(false);
	const [resultsTagsDrawer, setResultsTagsDrawer] = useState(tagStore);
	const [searchString, setSearchString] = useState('');
	const animation = useSpring({
		y: displayTagsDrawer ? 0 : -100,
		height: displayTagsDrawer ? '300px' : '0px',
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

	const handleSearchSubmit = () => {
		console.log('search change');
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			if (resultsTagsDrawer.length === 0) {
				let new_tag = { label: searchString, type: 'default' };
				createTag(new_tag);
				setSearchString('');
			}
		}
	};

	return (
		<div className="navigation-bar">
			<div className="navigation">
				<div className="logo">
					<span>DUNGEON MASTER'S</span>
					<span>TOOLBOOK</span>
				</div>
				<NavLink className={"nav-link"} to="/treasures">{'TREASURES'}</NavLink>
				<NavLink className={"nav-link"} to="/npcs">{'NPCs'}</NavLink>
				<NavLink className={"nav-link"} to="/locations">{'LOCATIONS'}</NavLink>
			</div>
			<div className="tools-bar">
				{props.children}
				<button onClick={() => setDisplayTagsDrawer(!displayTagsDrawer)}>TAGS</button>
			</div>
			<div className="tags-bar">
				{
					tagStore.map((tag: iTag, index: number) => <NavTag key={index} id={tag.id} label={tag.label} type={tag.type} />)
				}
			</div>
			<animated.div className="tags-drawer" style={animation}>
				<div className="tags-result">
					{
						resultsTagsDrawer.map((tag: iTag, index: number) => <Tag key={index} label={tag.label} />)
					}
				</div>
				<form>
					<input type="text" value={searchString} onChange={handleSearchChange} onKeyDown={handleKeyDown} />
				</form>
			</animated.div>
		</div>
	);
};

export default NavBar;
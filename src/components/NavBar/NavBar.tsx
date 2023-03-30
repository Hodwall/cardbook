import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { animated, useSpring, a } from 'react-spring';
import Tag from '../Tag/Tag';
import './NavBar.css';

import { iTag } from '../../hooks/useTagStore';
import NavTag from '../NavTag';
import { useTagStore } from '../../hooks/useTagStore';


const NavBar = (props: { children?: React.ReactNode; }) => {
	const [displayTagsDrawer, setDisplayTagsDrawer] = useState(false);
	const [searchString, setSearchString] = useState('');
	const { tagStore } = useTagStore();

	const animation = useSpring({
		y: displayTagsDrawer ? 0 : -100,
		height: displayTagsDrawer ? '300px' : '0px',
	});

	const handleSearchChange = (e: any) => {
		setSearchString(e.target.value);
		console.log('search change');
	};
	const handleSearchSubmit = () => {
		console.log('search change');
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
					tagStore.map((tag: iTag) => <NavTag label={'a test tag'} />)
				}
			</div>
			{
				true &&
				<animated.div className="tags-drawer" style={animation}>
					<div className="tags-result">
						<Tag label='Debug Tag' />
					</div>
					<form onSubmit={handleSearchSubmit}>
						<input type="text" value={searchString} onChange={handleSearchChange} />
						{/* <input type="submit" value="Submit" /> */}
					</form>
				</animated.div>
			}
		</div>
	);
};

export default NavBar;
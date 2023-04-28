import { useState } from 'react';
import NavBar from '../NavBar';
import TagBar from '../TagBar';
import './AppBar.css';


const AppBar = () => {
	const [toolbarDisplay, setToolbarDisplay] = useState(true);
	const [tagsDrawerDisplay, setTagDrawerDisplay] = useState(false);

	const handleToggleToolbarDisplay = () => {
		if (tagsDrawerDisplay) setTagDrawerDisplay(false);
		setToolbarDisplay(!toolbarDisplay);
	};

	const handleToggleTagsDisplay = () => {
		console.log('clicked');
		if (toolbarDisplay) setToolbarDisplay(false);
		setTagDrawerDisplay(!tagsDrawerDisplay);
	};

	return (
		<div className='appbar'>
			<div className='top-row'>
				<div className='logo'>
					<span>DUNGEON MASTER'S</span>
					<span>DECKBOOK</span>
				</div>
				<NavBar tagsDisplayHandler={handleToggleTagsDisplay} />
			</div>
			<div className='bottom-row'>
				<TagBar displayDrawer={tagsDrawerDisplay} />
			</div>
		</div >
	);
};

export default AppBar;
import './NavBar.css';
import NavButton from '../../components/NavButton';

const NavBar = () => {
	return (
		<div className="navigation-bar">
			<div className="logo">DM<span>TOOL</span>BOOK</div>
			<NavButton label="TREASURES" destination="/treasures" />
			<NavButton label="NPCs" destination="/npcs" />
			<NavButton label="LOCATIONS" destination="/locations" />
		</div>
	)
}

export default NavBar;
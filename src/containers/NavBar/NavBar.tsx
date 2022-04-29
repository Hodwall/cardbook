import './NavBar.css';
import NavButton from '../../components/NavButton';

const NavBar = () => {
	return (
		<div className="navigation-bar">
			<NavButton label="TREASURES" destination="/treasures" />
			<NavButton label="NPCs" destination="/npcs" />
			<NavButton label="LOCATIONS" destination="/locations" />
		</div>
	)
}

export default NavBar;
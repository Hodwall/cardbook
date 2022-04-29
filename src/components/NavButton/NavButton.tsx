import './NavButton.css'
import { NavLink, useMatch, useResolvedPath } from 'react-router-dom';

const NavButton = (props: { label: string, destination: string }) => {
	let resolved = useResolvedPath(props.destination);
	let match = useMatch({ path: resolved.pathname, end: true });
	return (
		<NavLink
			className={"nav-link" + (match ? " active" : "") }
			to={props.destination}>
			{props.label}
		</NavLink>
	)
}

export default NavButton;
import './NavTag.css';
import { useSpring, animated } from 'react-spring';


const NavTag = (props: {
    id?: number,
    label: string,
    type?: string;
}) => {
    const animation = useSpring({ to: { opacity: 1, y: 0, rotateZ: 0 }, from: { opacity: 0, y: -10, rotateZ: -2 } });
    return (
        <animated.div className='navtag' style={animation}>
            <div className={props.type}>{props.label}</div>
        </animated.div>
    );
};

export default NavTag;
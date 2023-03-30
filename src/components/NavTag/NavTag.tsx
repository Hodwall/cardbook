import './NavTag.css';
import { useSpring, animated } from 'react-spring';
import { useTagStore } from '../../hooks/useTagStore';

const NavTag = (props: {
    id: number,
    label: string,
    type?: string;
}) => {
    const animation = useSpring({ to: { opacity: 1, y: 0, rotateZ: 0 }, from: { opacity: 0, y: -10, rotateZ: -2 } });
    const { deleteTag } = useTagStore();

    return (
        <animated.div className={`navtag ${props.type}`} style={animation}>
            <span>{props.label}</span><span><button onClick={() => deleteTag(props.id)}>X</button></span>
        </animated.div>
    );
};

export default NavTag;
import './Tag.css';
import { useSpring, animated } from 'react-spring';


const Tag = (props: {
    label: string;
}) => {
    const animation = useSpring({ to: { opacity: 1, y: 0, rotateZ: 0 }, from: { opacity: 0, y: -10, rotateZ: -2 } });
    return (
        <animated.div className='tag' style={animation}>
            <div className='tag-label'>{props.label}</div>
            <div className='tag-details'>
                <span>H: 21</span>
                <span>H: 21</span>
            </div>
        </animated.div>
    );
};

export default Tag;
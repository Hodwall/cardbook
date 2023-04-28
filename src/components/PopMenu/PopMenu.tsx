import { useSpring, animated, a } from 'react-spring';
import './PopMenu.css';
import { useContext } from 'react';
import { PopButtonContext } from '../PopButton/PopButtonContext';
import { MdOutlineClose } from 'react-icons/md';


const PopMenu = (props: { children: any; }) => {
    const popbuttonCtxData = useContext(PopButtonContext);
    console.log(popbuttonCtxData);

    const animation = useSpring({
        to: { y: 0, scale: 1, rotateZ: 0, rotateX: 0 },
        from: { y: -20, scale: 1, rotateZ: 0, rotateX: 0 },
        config: { mass: 15, friction: 220, tension: 4000 }
    });
    const animation_opacity = useSpring({
        to: { opacity: 1 },
        from: { opacity: 0 },
    });
    return (
        <animated.div className={`popmenu`} style={{ ...animation, ...animation_opacity }} >
            <div className={'tools'}>
                <div onClick={popbuttonCtxData.handlePopover}><MdOutlineClose /></div>
            </div>
            {props.children}
        </animated.div>
    );
};

export default PopMenu;
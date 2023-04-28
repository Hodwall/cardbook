import { useState } from 'react';
import { PopMenuContext } from './PopMenuContext';
import { Popover } from 'react-tiny-popover';
import PopMenuAnimation from './PopMenuAnimation';
import { MdOutlineClose } from 'react-icons/md';
import './PopMenu.css';


const PopMenu = (props: {
    clickHandler?: Function,
    label: any,
    highlighted?: boolean,
    content?: any;
}) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const handlePopover = () => setIsPopoverOpen(!isPopoverOpen);

    if (props.content) {
        return (
            <Popover
                isOpen={isPopoverOpen}
                positions={['bottom', 'right']} // if you'd like, you can limit the positions
                padding={10} // adjust padding here!
                reposition={false} // prevents automatic readjustment of content position that keeps your popover content within its parent's bounds
                // onClickOutside={() => setIsPopoverOpen(false)} // handle click events outside of the popover/target here!
                content={({ position, nudgedLeft, nudgedTop }) => ( // you can also provide a render function that injects some useful stuff!
                    <>
                        <PopMenuContext.Provider value={{ handlePopover }}>
                            <PopMenuAnimation >
                                <div className={'tools'}>
                                    <div onClick={handlePopover}><MdOutlineClose /></div>
                                </div>
                                {props.content}
                            </PopMenuAnimation>
                        </PopMenuContext.Provider>
                    </>
                )}
            >
                <div className={`button ${props.highlighted ? 'highlighted' : ''}`}>
                    <span onClick={() => setIsPopoverOpen(!isPopoverOpen)}>{props.label}</span>
                </div >
            </Popover>
        );
    } else {
        return (
            <div className={`button ${props.highlighted ? 'highlighted' : ''}`}>
                <span onClick={() => props.clickHandler && props.clickHandler()}>{props.label}</span>
            </div >
        );
    }
};

export default PopMenu;
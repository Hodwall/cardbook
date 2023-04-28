import { useState } from 'react';
import { PopButtonContext } from './PopButtonContext';
import { Popover } from 'react-tiny-popover';
import './PopButton.css';


const PopButton = (props: {
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
                onClickOutside={() => setIsPopoverOpen(false)} // handle click events outside of the popover/target here!
                content={({ position, nudgedLeft, nudgedTop }) => ( // you can also provide a render function that injects some useful stuff!
                    <>
                        <PopButtonContext.Provider value={{ handlePopover }}>
                            {props.content}
                        </PopButtonContext.Provider>
                    </>
                )}
            >
                <div className={`popbutton ${props.highlighted ? 'highlighted' : ''}`}>
                    <span onClick={() => setIsPopoverOpen(!isPopoverOpen)}>{props.label}</span>
                </div >
            </Popover>
        );
    } else {
        return (
            <div className={`popbutton ${props.highlighted ? 'highlighted' : ''}`}>
                <span onClick={() => props.clickHandler && props.clickHandler()}>{props.label}</span>
            </div >
        );
    }
};

export default PopButton;
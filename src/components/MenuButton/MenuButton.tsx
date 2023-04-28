import { useState } from 'react';
import { Popover } from 'react-tiny-popover';

import './MenuButton.css';

const MenuButton = (props: {
    clickHandler?: Function,
    label: any,
    highlighted?: boolean,
    defaultBgHandler?: Function,
    defaultBg?: string,
}) => {
    const defaultBg = `${props.defaultBg ? `url(${props.defaultBg})` : ''} 0 0 / auto 100%, hsl(0, 0%, 20%) 100%)`;

    return (
        <div className={`menubutton ${props.highlighted ? 'highlighted' : ''}`} style={{ background: defaultBg }}>
            {props.defaultBgHandler && <div onClick={() => console.log('custom clicked')}>CUSTOM</div>}
            <span onClick={() => props.clickHandler && props.clickHandler()}>{props.label}</span>
        </div >
    );
};

export default MenuButton;
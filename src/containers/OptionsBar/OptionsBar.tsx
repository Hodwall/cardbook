import React, { ReactChild } from 'react';
import './OptionsBar.css'

const OptionsBar = (props: { options?: any, tools?: any }) => {
    return (
        <div className="options-bar">
            {props.options}
            {props.tools}
        </div>
    )
}

export default OptionsBar;


import './Tag.css';
import { useSpring, animated, a } from 'react-spring';
import { useState } from 'react';
import Card from '../Card';


const Tag = (props: {
    label: string;
    art?: string;
}) => {
    return (
        <Card
            style={'tag'}
            label={props.label}
            back={
                <>
                    <p>Treasures in tag: 10</p>
                    <p>NPCs in tag: 10</p>
                    <p>Locations in tag: 10</p>
                </>
            }
        />
    );

};

export default Tag;






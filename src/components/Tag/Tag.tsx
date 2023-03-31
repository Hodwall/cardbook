import './Tag.css';
import { useSpring, animated, a } from 'react-spring';
import { useState } from 'react';
import Card from '../Card';
import { useTagStore } from '../../hooks/useTagStore';


const Tag = (props: {
    id: number,
    label: string;
    art?: string;
}) => {
    const { setTagActive } = useTagStore();
    return (
        <div className="tag" onClick={() => setTagActive(props.id)}>
            {props.label}
        </div>
    );

};

export default Tag;






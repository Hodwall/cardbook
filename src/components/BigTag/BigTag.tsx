import './BigTag.css';
import { useSpring, animated, a } from 'react-spring';
import { PointerEvent, useState } from 'react';
import Card from '../Card';
import { useTagStore } from '../../hooks/useTagStore';


const BigTag = (props: {
    id: number,
    label: string;
    art?: string;
}) => {
    const { setTagActive, deleteTag } = useTagStore();
    return (
        <div className="tag" onClick={() => setTagActive(props.id)}>
            <button onClick={(e: any) => {
                e.stopPropagation();
                deleteTag(props.id);
            }}>X</button>
            {props.label}
        </div>
    );

};

export default BigTag;






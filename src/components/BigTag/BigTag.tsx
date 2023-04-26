import { useTagStore } from '../../hooks/useTagStore';
import { MdDeleteForever } from 'react-icons/md';
import './BigTag.css';


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
            }}><MdDeleteForever /></button>
            {props.label}
        </div>
    );

};

export default BigTag;






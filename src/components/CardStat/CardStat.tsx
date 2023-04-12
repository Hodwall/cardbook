import { useEffect, useState } from "react";
import { useCardStore } from "../../hooks/useCardStore";
import './CardStat.css';


const CardStat = (props: {
    stat: {
        id: number,
        label: string,
        value: number | null;
    };
    cardId: number,
    editMode?: boolean,
}) => {
    const [label, setLabel] = useState(props.stat.label);
    const [value, setValue] = useState<any>(props.stat.value);
    const { updateStat, removeStatFromCard } = useCardStore();

    useEffect(() => {
        updateStat(props.stat.id, props.cardId, { label, value });
    }, [label, value]);

    return (
        <div className={'card-stat'} onClick={(e) => e.stopPropagation()}>
            {
                props.editMode ?
                    <>
                        <input className={'edit-label'} type="text" value={label} onChange={(e: any) => setLabel(e.target.value)} />
                        <button onClick={() => removeStatFromCard(props.stat.id, props.cardId)}>REMOVE</button>
                    </>
                    :
                    <>
                        <span>{label}</span>
                        <input className={'edit-value'} type="number" value={value} onChange={(e: any) => setValue(e.target.value)} />
                    </>
            }
        </div>
    );
};

export default CardStat;
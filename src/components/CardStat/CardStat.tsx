import { useEffect, useState } from "react";
import { useCardStore } from "../../hooks/useCardStore";
import './CardStat.css';
import ColorPicker from "../ColorPicker/ColorPicker";


const CardStat = (props: {
    stat: {
        id: number,
        label: string,
        color?: string,
        value: number | null;
    };
    cardId: number,
    editMode?: boolean,
}) => {
    const [label, setLabel] = useState(props.stat.label);
    const [value, setValue] = useState<any>(props.stat.value);
    const [color, setColor] = useState<string | undefined>(props.stat.color);
    const { updateStat, removeStatFromCard } = useCardStore();

    useEffect(() => {
        updateStat(props.stat.id, props.cardId, { label, value, color });
    }, [label, value, color]);

    return (
        <div className={'card-stat'} onClick={(e) => e.stopPropagation()}>
            {
                props.editMode ?
                    <>
                        <div className={'card-stat-edit'}>
                            <button className={'remove-stat'} onClick={() => removeStatFromCard(props.stat.id, props.cardId)}>X</button>
                            <ColorPicker pickerStyle={'slider'} changeColorHandler={(color: any) => setColor(color)} useColorStyle={props.stat.color} defaultColor={props.stat.color} />
                        </div>
                        <input className={'edit-label'} type="text" value={label} onChange={(e: any) => setLabel(e.target.value)} />
                    </>
                    :
                    <>
                        <input className={'edit-value'} type="number" value={value} onChange={(e: any) => setValue(e.target.value)} style={{ backgroundColor: `${props.stat.color}` }} />
                        <span>{label}</span>
                    </>
            }
        </div>
    );
};

export default CardStat;
import { useEffect, useState } from "react";
import { useCardStore } from "../../hooks/useCardStore";
import './CardStat.css';
import ColorPicker from "../ColorPicker/ColorPicker";


const CardStat = (props: {
    stat: {
        id: number,
        label: string,
        color?: string,
        useTotal?: boolean,
        value: number | null;
    };
    cardId: number,
    editMode?: boolean,
}) => {
    const [label, setLabel] = useState(props.stat.label);
    const [value, setValue] = useState<any>(props.stat.value);
    const [color, setColor] = useState<string | undefined>(props.stat.color);
    const [useTotal, setUseTotal] = useState<boolean>(props.stat.useTotal || false);
    const { updateStat, removeStatFromCard } = useCardStore();

    useEffect(() => {
        setValue(props.stat.value);
        setLabel(props.stat.label);
    }, [props]);

    const handleUpdateLabel = (e: any) => {
        updateStat(props.stat.id, props.cardId, { label: e.target.value });
        setLabel(e.target.value);
    };
    const handleUpdateValue = (e: any) => {
        updateStat(props.stat.id, props.cardId, { value: e.target.value });
        setValue(e.target.value);
    };
    const handleUpdateColor = (color: any) => {
        updateStat(props.stat.id, props.cardId, { color: color });
        setColor(color);
    };
    const handleUpdateUseTotal = () => {
        updateStat(props.stat.id, props.cardId, { useTotal: !useTotal });
        setUseTotal(!useTotal);
    };

    return (
        <div className={`card-stat ${props.stat.id}`} onClick={(e) => e.stopPropagation()}>
            {
                props.editMode ?
                    <>
                        <div className={'card-stat-edit'}>
                            <button className={'remove-stat'} onClick={() => removeStatFromCard(props.stat.id, props.cardId)}>X</button>
                            <ColorPicker pickerStyle={'slider'} changeColorHandler={handleUpdateColor} useColorStyle={color} defaultColor={props.stat.color} />
                        </div>
                        <input className={'edit-label'} type="text" value={label} onChange={handleUpdateLabel} />
                    </>
                    :
                    <>
                        <input className={'edit-value'} type="number" value={value} onChange={handleUpdateValue} style={{ backgroundColor: `${props.stat.color}` }} />
                        <span style={useTotal ? { color: 'tomato' } : {}} onClick={handleUpdateUseTotal}>{label}</span>
                    </>
            }
            {
                props.stat.useTotal &&
                <>
                    <div className={'card-stat-total-effect'}></div>
                </>
            }
        </div>
    );
};

export default CardStat;
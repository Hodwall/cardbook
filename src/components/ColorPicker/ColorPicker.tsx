import { useEffect, useRef, useState } from 'react';
import { ChromePicker, SliderPicker } from 'react-color';
import { MdColorLens } from 'react-icons/md';
import './ColorPicker.css';


const ColorPicker = (props: {
    defaultColor?: string,
    pickerStyle?: string,
    changeColorHandler?: Function,
    useColorStyle?: string,
}) => {
    const [display, setDisplay] = useState(false);
    const [color, setColor] = useState(props.defaultColor ?? false);

    // handles outside clicks
    const ref = useRef<any>(null);
    const handleClickOutside = (event: any) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setDisplay(false);
        }
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);


    const handleClick = () => {
        setDisplay(!display);
    };

    const handleClose = () => {
        setDisplay(false);
    };

    const handleColorChange = (color: any) => {
        if (props.changeColorHandler) props.changeColorHandler(color.hex);
        setColor(color.hex);
    };

    return (
        <>
            <button className={"color-picker"} onClick={handleClick} style={props.useColorStyle ? { backgroundColor: `${props.useColorStyle}` } : {}}><MdColorLens /></button>
            {
                display &&
                <div style={{
                    position: 'absolute',
                    zIndex: '2'
                }} ref={ref}>
                    <div style={{
                        position: 'fixed',
                        top: '0px',
                        right: '0px',
                        bottom: '0px',
                        left: '0px',
                    }}
                        onClick={handleClose}
                    />
                    {
                        (() => {
                            switch (props.pickerStyle) {
                                case 'slider':
                                    return <SliderPicker color={color} onChange={handleColorChange} />;
                                default:
                                    return <ChromePicker color={color} onChange={handleColorChange} />;
                            }
                        })()
                    }

                </div>
            }
        </>
    );
};

export default ColorPicker;
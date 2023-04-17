import { useEffect, useRef, useState } from 'react';
import { ChromePicker } from 'react-color';
import { MdColorLens } from 'react-icons/md';


const ColorPicker = (props: {
    defaultColor?: string,
    changeColorHandler?: Function,
}) => {
    const [display, setDisplay] = useState(false);
    const [color, setColor] = useState(false);

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
        console.log(color);
        if (props.changeColorHandler) props.changeColorHandler(color.hex);
        setColor(color.hex);
    };

    return (
        <>
            <button onClick={handleClick}><MdColorLens /></button>
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
                    <ChromePicker
                        disableAlpha
                        color={color}
                        onChange={handleColorChange}
                    />
                </div>
            }
        </>
    );
};

export default ColorPicker;
import { useEffect, useRef, useState } from 'react';
import { MdImage, MdSave, MdHideImage } from 'react-icons/md';
import { FaImage, FaRegImage } from 'react-icons/fa';
import './BackgroundPicker.css';


const BackgroundPicker = (props: {
    changeBackgroundHandler?: Function,
    disabledOutsideClickHandler?: boolean,
    hasValue?: boolean;
}) => {
    const [display, setDisplay] = useState(false);

    // handles outside clicks
    const ref = useRef<any>(null);
    const handleClickOutside = (event: any) => {
        if (props.disabledOutsideClickHandler) return;
        else if (ref.current && !ref.current.contains(event.target)) setDisplay(false);
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => document.removeEventListener('click', handleClickOutside, true);
    }, []);

    const handleClick = (e: any) => {
        e.stopPropagation();
        setDisplay(!display);
    };

    const handleBackgroundChange = (e: any) => {
        e.stopPropagation();
        const url = new URL(e.target[0].value);
        if (url) {
            if (props.changeBackgroundHandler) props.changeBackgroundHandler(e.target[0].value);
            setDisplay(false);
        }
    };

    const deleteBackground = () => {
        if (props.changeBackgroundHandler) props.changeBackgroundHandler('');
        setDisplay(false);
    };

    return (
        <>
            <span className={'background-picker-btn'} onClick={handleClick}>{props.hasValue ? <FaImage /> : <FaRegImage />}</span>
            {
                display &&
                <div className={'background-picker'} ref={ref}>
                    <form onSubmit={handleBackgroundChange}>
                        <input name="url_input" />
                        <input type="submit" value="SAVE" />
                        <span onClick={deleteBackground}><MdHideImage /></span>
                    </form>
                </div>
            }
        </>
    );
};

export default BackgroundPicker;
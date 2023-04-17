import { useEffect, useRef, useState } from 'react';
import { MdImage, MdSave, MdHideImage } from 'react-icons/md';
import './BackgroundPicker.css';


const BackgroundPicker = (props: {
    changeBackgroundHandler?: Function,
}) => {
    const [display, setDisplay] = useState(false);

    // handles outside clicks
    const ref = useRef<any>(null);
    const handleClickOutside = (event: any) => {
        if (ref.current && !ref.current.contains(event.target)) setDisplay(false);
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => document.removeEventListener('click', handleClickOutside, true);
    }, []);

    const handleClick = () => setDisplay(!display);

    const handleBackgroundChange = (e: any) => {
        e.preventDefault();
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
            <button onClick={handleClick}><MdImage /></button>
            {
                display &&
                <div className={'background-picker'} ref={ref}>
                    <form onSubmit={handleBackgroundChange}>
                        <input name="url_input" />
                        <button type="submit" value="Submit"><MdSave /></button>
                        <button onClick={deleteBackground}><MdHideImage /></button>
                    </form>
                </div>
            }
        </>
    );
};

export default BackgroundPicker;
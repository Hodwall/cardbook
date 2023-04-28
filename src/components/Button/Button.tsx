
import './Button.css';
import BackgroundPicker from '../BackgroundPicker/BackgroundPicker';

const Button = (props: {
    clickHandler?: Function,
    label: any,
    highlighted?: boolean,
    defaultBgHandler?: Function,
    defaultBg?: string,
}) => {
    const defaultBg = `${props.defaultBg ? `url(${props.defaultBg})` : ''} 0 0 / auto 100%, hsl(0, 0%, 20%) 100%)`;

    return (
        <div className={`button ${props.highlighted ? 'highlighted' : ''}`} style={{ background: defaultBg }}>
            {

                props.defaultBgHandler &&
                <BackgroundPicker changeBackgroundHandler={props.defaultBgHandler} hasValue={!!props.defaultBg} disabledOutsideClickHandler />

                // props.defaultBgHandler &&
                // <div onClick={() => props.defaultBgHandler && props.defaultBgHandler()}>
                //     {props.defaultBg ? <FaImage /> : <FaRegImage />}
                // </div>
            }
            <span onClick={() => props.clickHandler && props.clickHandler()}>{props.label}</span>
        </div >
    );
};

export default Button;
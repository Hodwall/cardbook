import React from 'react';
import OptionsBar from '../containers/OptionsBar';
import Blacksmith from '../img/blacksmith.png';

const Locations = () => {
    return (
        <React.Fragment>
            <OptionsBar></OptionsBar>
            <div className="bg-message">SECTION BEING BUILT</div>
            <img className="bg-icon" src={Blacksmith} />
        </React.Fragment>
    )
}

export default Locations;
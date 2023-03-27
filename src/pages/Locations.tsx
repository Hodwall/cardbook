import React from 'react';
import Blacksmith from '../assets/img/blacksmith.png';
import NavBar from '../components/NavBar';
import Tag from '../components/Tag/Tag';

const Locations = () => {
    return (
        <React.Fragment>
            <NavBar>
            </NavBar>
            <div className="bg-message">SECTION BEING BUILT</div>
            <img className="bg-icon" src={Blacksmith} />
        </React.Fragment>
    );
};

export default Locations;
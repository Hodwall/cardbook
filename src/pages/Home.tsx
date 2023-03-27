import React from 'react';
import Blacksmith from '../assets/img/blacksmith.png';
import NavBar from '../components/NavBar';

const Home = () => {
    return (
        <React.Fragment>
            <NavBar>
                <h1>testtttt</h1>
                <h1>testtt124455tt</h1>
                <h1>testttt123t</h1>
                <h1>testtt212</h1>
            </NavBar>
            <div className="bg-message">SECTION BEING BUILT</div>
            <img className="bg-icon" src={Blacksmith} />
        </React.Fragment>
    );
};

export default Home;
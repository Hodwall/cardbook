import Gallery from '../Gallery/Gallery';
import './AppBody.css';

const AppBody = () => {
  return (
    <div className="appbody">
      <div className="top-divider">
        <div className="top-divider-left" />
        <div className="top-divider-center" />
        <div className="top-divider-right" />
      </div>
      <div className="body">
        <div className="border-left" />
        <div className="content">
          <Gallery />
        </div>
        <div className="border-right" />
      </div>
    </div>
  );
};

export default AppBody;



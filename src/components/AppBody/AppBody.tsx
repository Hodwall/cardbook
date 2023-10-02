import Gallery from '../Gallery/Gallery';
import './AppBody.css';

const AppBody = () => {
  return (
    <div className="appbody">
      <div className="divider-left" />
      <div className="divider-center" />
      <div className="divider-right" />
      <div className="border-left" />
      <div className="content">
        <Gallery />
      </div>
      <div className="border-right" />
    </div>
  );
};

export default AppBody;



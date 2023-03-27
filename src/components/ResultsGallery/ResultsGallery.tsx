import './ResultsGallery.css';
import { ReactChild, ReactNode } from 'react';


const ResultsGallery = (props: { children?: ReactNode; }) => {
  return (
    <div className="results-gallery">
      {props.children}
    </div>
  );
};

export default ResultsGallery;
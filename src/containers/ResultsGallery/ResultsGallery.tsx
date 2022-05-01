import './ResultsGallery.css';
import { ReactChild } from 'react';


const ResultsGallery = (props: { children?: ReactChild | ReactChild[] }) => {
  return (
    <div className="results-gallery">
      {props.children}
    </div>
  )
}

export default ResultsGallery;
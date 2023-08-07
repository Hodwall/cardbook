import 'react-quill/dist/quill.snow.css';
import './DisplayCard.css';



const DisplayCard = (props: { children: any; }) => {
  return (
    <div className={'display-card'}>
      {props.children}
    </div>
  );
};

export default DisplayCard;
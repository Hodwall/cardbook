import './Card.css';


import { useSpring, animated } from 'react-spring';
import { ReactChild, ReactChildren } from 'react';

const Card = (props: {
  class?: string,
  label: string,
  art?: string,
  children: ReactChild | ReactChild[]
}) => {
  const animation = useSpring({ to: { opacity: 1, y: 0, rotateZ: 0 }, from: { opacity: 0, y: -10, rotateZ: -2 } })

  return (
    <animated.div className={`card ${props.class}`} style={animation}>
      <div className={'card-header'}>
        <div className="label">{props.label}</div>
        <img className="art" src={props.art} alt={props.art} />
      </div>
      <div className="card-body">
        { props.children }
      </div>
      <div className="card-tools">
        <button>SAVE</button>
        <button>EXPORT</button>
        <button>DELETE</button>
      </div>
    </animated.div>
  )
}

export default Card;
import React, { useState } from 'react';
import './Card.css';
import { useSpring, animated, a } from 'react-spring';
import { ReactChild } from 'react';

const Card = (props: {
  class?: string,
  label: string,
  art?: string,
  tools?: ReactChild | ReactChild[],
  front: ReactChild | ReactChild[],
  back: ReactChild | ReactChild[]
  stored: boolean
}) => {
  const [flipped, setFlipped] = useState(false);
  
  const animation = useSpring({ to: { opacity: 1, y: 0, rotateZ: 0 }, from: { opacity: 0, y: -10, rotateZ: -2 } })
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 10, tension: 500, friction: 80 },
  })

  return (
    <animated.div className={`card ${props.class}`} style={animation}>

      <a.div className={'card-side'} style={{ opacity: opacity.to(o => 1 - o), transform }} >
        <div onClick={() => setFlipped(!flipped)}>
          <div className={'card-header'}>
            <div className="label">{props.label}</div>
            <img className="art" src={props.art} alt={props.art} />
          </div>
          <div className="card-body">
            {props.front}
          </div>
        </div>
        <div className="card-tools">
          {!flipped && props.tools}
        </div>
        {props.stored && <div className="stored"></div>}
      </a.div>

      <a.div className="card-side back" style={{ opacity, transform, rotateY: '180deg' }}>
        <div className="card-body">
          {props.back}
        </div>
      </a.div>

    </animated.div>
  )
}

export default Card;
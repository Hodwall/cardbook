import { ReactFragment, ReactNode, useState } from 'react';
import { useSpring, animated, a } from 'react-spring';
import './Card.css';

const Card = (props: {
  style?: string,
  label: string,
  art?: string,
  front: ReactNode,
  back?: ReactNode,
  front_tools?: ReactNode,
  back_tools?: ReactNode,
  is_pinned?: boolean;
}) => {
  const [flipped, setFlipped] = useState(false);

  const animation = useSpring({
    to: { opacity: 1, y: 0, scale: 1, rotateZ: 0, rotateX: 0 },
    from: { opacity: 0, y: -10, scale: 1.2, rotateZ: -10, rotateX: -80 },
    config: { mass: 5, friction: 120, tension: 1000 }
  });
  const { transform, opacity, } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 10, tension: 500, friction: 80 },
  });

  return (
    <animated.div className={`card ${props.style}`} style={animation}>

      <a.div className={'card-side'} style={{ opacity: opacity.to(o => 1 - o), transform }} >
        <div onClick={() => setFlipped(!flipped)}>
          <div className={'card-header'}>
            <div className="label">{props.label}</div>
            {props.art && <img className="art" src={props.art} alt={props.art} />}
          </div>
          <div className="card-body">
            {props.front}
          </div>
        </div>
        <div className="card-tools">
          {!flipped && props.front_tools}
        </div>
        {props.is_pinned && <div className="stored"></div>}
      </a.div>

      <a.div className="card-side back" style={{ opacity, transform, rotateY: '180deg' }}>
        <div className="card-body">
          <div className={'card-header'}>
            <div className="label">{props.label}</div>
            {props.art && <img className="art" src={props.art} alt={props.art} />}
          </div>
          <div className="card-body">
            {props.back}
          </div>
          <div className="card-tools">
            {!flipped && props.back_tools}
          </div>
        </div>
      </a.div>

    </animated.div>
  );
};

export default Card;
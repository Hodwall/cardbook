import './Card.css';


import { useSpring, animated } from 'react-spring';

const Card = (props: {
  label: string,
  style: string,
  art?: string,
  content: { style?: string, text: string }[]
}) => {
  const animation = useSpring({ to: { opacity: 1, y: 0, rotateZ: 0 }, from: { opacity: 0, y: -10, rotateZ: -2 } })

  return (
    <animated.div className="card" style={animation}>
      <div className={`card-header ${props.style}`}>
        <div className="label">{props.label}</div>
        <img className="art" src={props.art} alt={props.art} />
      </div>
      <div className="card-body">
        {
          props.content.map((el) => {
            return <p className={el.style}>{el.text}</p>
          })
        }
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
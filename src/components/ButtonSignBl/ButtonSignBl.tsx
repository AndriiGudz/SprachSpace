import './styles.css'

interface ButtonSignProps {
  text: string
  onClick: () => void
}

function ButtonSignBl({ text, onClick }: ButtonSignProps) {
  return (
    <div id="container">
      <button onClick={onClick} className="learn-more">
        <span className="circle" aria-hidden="true">
          <span className="icon arrow"></span>
        </span>
        <span className="button-text">{text}</span>
      </button>
    </div>
  )
}

export default ButtonSignBl

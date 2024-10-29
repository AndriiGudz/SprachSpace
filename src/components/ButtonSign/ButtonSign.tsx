import './styles.css'

interface ButtonSignProps {
  text: string
  onClick: () => void
  variant?: 'light' | 'dark'
}

function ButtonSign({ text, onClick, variant }: ButtonSignProps) {
  return (
    <div id="container">
      <button onClick={onClick} className={`learn-more ${variant}`}>
        <span className="circle" aria-hidden="true">
          <span className="icon arrow"></span>
        </span>
        <span className="button-text">{text}</span>
      </button>
    </div>
  )
}

export default ButtonSign

import './styles.css'

interface ButtonSignProps {
  text: string
  onClick?: () => void
  variant?: 'light' | 'dark'
  type?: 'button' | 'submit' | 'reset'
}

function ButtonSign({ text, onClick, variant = 'light', type = 'button' }: ButtonSignProps) {
  return (
    <div id="container">
      <button onClick={onClick} className={`learn-more ${variant}`} type={type}>
        <span className="circle" aria-hidden="true">
          <span className="icon arrow"></span>
        </span>
        <span className="button-text">{text}</span>
      </button>
    </div>
  )
}

export default ButtonSign

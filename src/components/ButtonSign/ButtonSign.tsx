import './styles.css'

interface ButtonSignProps {
  text: string
  onClick?: () => void
  variant?: 'light' | 'dark'
  type?: 'button' | 'submit' | 'reset'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

function ButtonSign({
  text,
  onClick,
  variant = 'light',
  type = 'button',
  size = 'medium',
  disabled = false,
}: ButtonSignProps) {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'btn-small'
      case 'large':
        return 'btn-large'
      default:
        return 'btn-medium'
    }
  }

  return (
    <button
      onClick={onClick}
      className={`learn-more ${variant} ${getSizeClass()}`}
      type={type}
      disabled={disabled}
    >
      <span className="circle" aria-hidden="true">
        <span className="icon arrow"></span>
      </span>
      <span className="button-text">{text}</span>
    </button>
  )
}

export default ButtonSign

import './styles.css';

interface ButtonSignProps {
  text: string;
}

function ButtonSign({ text }: ButtonSignProps) {
  return (
    <div id="container">
      <button className="learn-more">
        <span className="circle" aria-hidden="true">
          <span className="icon arrow"></span>
        </span>
        <span className="button-text">{text}</span>
      </button>
    </div>
  );
}

export default ButtonSign;

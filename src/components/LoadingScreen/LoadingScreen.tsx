import './LoadingScreen.css'
import logoImage from '../../assets/logo.png'

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="header-container">
          <img src={logoImage} alt="Logo" className="logo-image" />
          <div className="text-container">
            <h1 className="project-name">SprachSpace</h1>
            <p className="project-slogan">Connect, Speak, Learn</p>
          </div>
        </div>
        <div className="slogan2">
          <span>Where language meets conversation</span>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen

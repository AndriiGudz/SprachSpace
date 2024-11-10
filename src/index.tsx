import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import GlobalStyles from './styles/GlobalStyles';
import { store } from './store/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
  <GlobalStyles />
  <App />
</Provider>  
);

reportWebVitals();

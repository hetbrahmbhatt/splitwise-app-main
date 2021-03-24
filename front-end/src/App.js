import logo from './logo.svg';
import './App.css';
import Main from './components/Main';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { withRouter } from "react-router-dom";
import Navbar from './components/landing-page/navbar';
import store from './store'
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div>
          <Main />
        </div>
        <ToastContainer />
      </BrowserRouter>  
    </Provider>

  );
}

export default App;

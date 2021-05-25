import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'
import AuthProvider from './Contexts/auth';
import Routes from './Router';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer autoClose={3000} />
        <Routes />
      </BrowserRouter>
    </AuthProvider>
    
  );
}

export default App;

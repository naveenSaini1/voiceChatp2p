import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import UserAuthProvider from './contextapi/UserAuth.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
     <UserAuthProvider>
    <App />
    </UserAuthProvider>

)

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import MainScreen from './Screens/MainScreen'
import CallingPage from './pages/CallingPage/CallingPage'
import RegisterScreen from './Screens/RegisterScreen'
import LoginScreen from './Screens/LoginScreen'
import Protected from './Auth/Protected'
import CallingApiContextProvider from './contextapi/CallingApi'
import RoomPage from './pages/RoomPage/RoomPage'
import RoomApiProvider from './contextapi/RoomApi'
import Room from './pages/RoomPage/Room'
import  RoomPageApiProvider from './contextapi/RoomPageApi'
const route=createBrowserRouter([
  {
    path:"/",
    element:<Protected> <MainScreen/></Protected>,
    children:[
      {
        path:"",
        element: <HomePage/>
      },
      {
        path:"calling",
        element: <CallingApiContextProvider><CallingPage/></CallingApiContextProvider>
      },
      {
        path:"room",
        element:<RoomPageApiProvider><RoomPage/></RoomPageApiProvider> 
      },
      {
        path:"room/:roomId",
        element:<RoomApiProvider><Room/></RoomApiProvider>
      },
    ]
  },
  {
    path:"/login",
    element:<LoginScreen/>
  },
  {
    path:"/register",
    element:<RegisterScreen/>
  }
])

function App() {

  return (
    <>


     <RouterProvider router={route} />
     
    </>
  )
}

export default App

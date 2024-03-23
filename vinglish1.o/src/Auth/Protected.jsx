import { useContext } from "react"
import { UserAuth } from "../contextapi/UserAuth"
import { Navigate, useNavigate } from "react-router-dom";

const Protected=({children})=>{
     const {user}= useContext(UserAuth);
     if(user==null)  return <Navigate to={"/login"}/>

  return (
    <>
    {children}
    </>
  )  


}
export default Protected;
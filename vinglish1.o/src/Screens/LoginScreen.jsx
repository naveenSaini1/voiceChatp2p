import { Link, Navigate, useNavigate } from "react-router-dom";
import "./LoginScreen.css"
import { useContext, useRef } from "react";
import { UserAuth } from "../contextapi/UserAuth";
const LoginScreen = () => {
    const {handleLogin}=useContext(UserAuth);
    const navigate = useNavigate();

        const emailRef=useRef();
        const passwordRef=useRef();
        const submit=()=>{
            handleLogin(emailRef.current.value,passwordRef.current.value);
            console.log("calling")
            emailRef.current.value="";
            passwordRef.current.value="";

            navigate("/")
            
        }

    return (
        <div className="loginDiv">
            <h1 style={{ textAlign: "center" }}>Login </h1>
            <label htmlFor="fname">UserName</label>
            <input ref={emailRef} type="text" id="fname" name="username" placeholder="Your UserName.." />

            <label htmlFor="lname">Password</label>
            <input ref={passwordRef} type="text" id="lname" name="password" placeholder="Your Password.." />
            <input onClick={submit} type="submit" value="Login" />
           <p style={{textAlign:"center"}}>if you don't have a account    <Link to={"/register"}>Register </Link> </p>
        

        </div>
    )
}
export default LoginScreen;
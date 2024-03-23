import { Link } from "react-router-dom";
import "./LoginScreen.css"
const RegisterScreen=()=>{
    return (
        <>
         <div className="loginDiv">
            <h1 style={{ textAlign: "center" }}>Register</h1>
            <label htmlFor="fname">Name</label>
            <input type="text" id="fname" name="username" placeholder="Your name.." />

            <label htmlFor="lname">Enter Your Email</label>
            <input type="text" id="lname" name="email" placeholder="Your Email.." />

            <label htmlFor="password">Enter Your password</label>
            <input type="text" id="password" name="password" placeholder="Your Password.." />
            <input type="submit" value="Register" />
           <p style={{textAlign:"center"}}>if you already have account    <Link to={"/login"}>Login </Link> </p>
        

        </div>
        </>
    )
}
export default RegisterScreen;
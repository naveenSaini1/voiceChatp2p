import { useContext } from "react";
import { UserAuth } from "../contextapi/UserAuth";

const Navbar = () => {
    const {user}=useContext(UserAuth);

    return (
        <>
            <div style={{padding:"6px 19px",display:"flex",justifyContent:"space-between",boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}} >
                <div>
                    <img src="../../src/assets/react.svg" alt="" />
                </div>
                <div>
                    <h1>welcome <span style={{color:"green"}}>{user.email}</span> To Connect With Random Person</h1>
                </div>
                <div>
                <img src="../../src/assets/react.svg" alt="" />
                </div>
            </div>
        </>
    )
}

export default Navbar;

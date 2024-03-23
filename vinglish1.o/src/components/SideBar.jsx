import { NavLink } from "react-router-dom";
import styles from "./SideBar.module.css"
const SideBar=()=>{
    return (
        <>
        <div style={{width:"300px",height:"100vh",boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}}>
            <div style={{display:"flex",flexDirection:"column"}}>
                <NavLink  to={"/calling"} style={{width:"60%",margin:"auto",padding:"8px",marginTop:"30px"}} className={styles.button5}>Calling</NavLink>
                <NavLink to={"/room"}  style={{width:"60%",margin:"auto",padding:"8px",marginTop:"10px"}} className={styles.button5}>Rooms</NavLink>

                <NavLink to={"/logout"} style={{width:"60%",margin:"auto",padding:"8px",marginTop:"10px"}} className={styles.button5}>Log Out</NavLink>
            </div>
        </div>
        </>

    )
}
export default SideBar;
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";

const MainScreen=()=>{
    return (
        <>
        <Navbar/>
        <div style={{display:"flex",marginTop:"50px"}}>
        <SideBar/>
        <Outlet/>
        {/* <Container/> */}
        </div>

        </>
    )
}
export default MainScreen;
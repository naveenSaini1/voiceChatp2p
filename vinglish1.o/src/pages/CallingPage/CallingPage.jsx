import { useContext } from "react";
import styles from "./CallingPage.module.css"
import { CallingApiContext } from "../../contextapi/CallingApi";
import ConnectedPage from "./ConnectedPage";


const CallingPage=()=>{
    const {handleCall,onCall,isCallLoading}= useContext(CallingApiContext)
    return (
        <>
          <div className={styles.Container}>
            <div>
                <p style={{fontSize:"50px",textAlign:"center"}}>Let's Connect To The People</p>
            </div>

            <div className={styles.ContainerChild}>
                {(isCallLoading)&& <p>Loadding....</p>}
                {(onCall)&&<ConnectedPage/>}
                {(!isCallLoading && !onCall) && <button className={styles.button5} onClick={handleCall} > Connect</button>}
                
            </div>
        </div>
        </>
    )
}
export default CallingPage;
import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react";
import {addUser, getUser} from "../RequestsToServer";

const SignForm = ({setAuthorization}:{setAuthorization:any}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const sign = location.state as boolean;

    const [login,setLogin]=useState("");
    const [pass,setPass]=useState("");
    const [wrongLogin, setWrongLogin] = useState(false);

    const closeModal = function () {
        navigate('/');
    }

    function onSubmit(){
            if(sign){
                addUser(login,pass).then((res)=>{
                    setLogin("");
                    setPass("");
                    navigate('/home');
                    setAuthorization(true);
                }).catch((err)=>{
                    console.log(err);
                });
            }
            else{
                getUser(login,pass).then((res)=>{
                    if(res.data === true){
                        setLogin("");
                        setPass("");
                        navigate('/home');
                        setWrongLogin(false);
                        setAuthorization(true);
                    }
                    else {
                        setWrongLogin(true);
                    }
                }).catch((err)=>{
                    console.log(err);
                });
            }
        }

    return(
        <>
        <div className="singFormFon form">
                <div className="signFormButtonBlock">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="closeIcon lucide lucide-circle-x-icon lucide-circle-x"
                         onClick={closeModal}>
                        <circle cx="12" cy="12" r="10"/>
                        <path d="m15 9-6 6"/>
                        <path d="m9 9 6 6"/>

                    </svg>
                </div>
                    <h3 className="signFormHeader">{sign ? "Sign up" : "Log in"} </h3>
                    <hr/>
                    <p className="signFormDescription">Login</p>
                    <input
                        className="signFormInput"
                        value={login}
                        type="text"
                        placeholder="Enter login"
                        onChange={(e) => setLogin(e.target.value)}/>
                    <p className="signFormDescription">Password</p>
                    <input
                        className="signFormInput"
                        value={pass}
                        type="password"
                        placeholder="Enter password"
                        onChange={(e) => setPass(e.target.value)}
                    />
                <div className="errorLoginMessage">
                    {!sign && wrongLogin &&
                        <p className="errorLoginText">*You entered a wrong login or password</p>
                    }
                </div>
                    <div className="signFormButtonBlock">
                        <button className="signFormButton" onClick={onSubmit}>
                            {sign ? "Sign up" : "Log in"}
                        </button>
                    </div>
                </div>
        </>
    )
}

export default SignForm;
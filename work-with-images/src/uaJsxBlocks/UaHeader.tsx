import React, { useState} from "react";
import { useNavigate,useLocation } from "react-router-dom";
import {isAuthorised} from "../RequestsToServer";

const UaHeader = ({saveUser,isAuthenticated, setAuthorization, onLanguageChange}:
                  {saveUser: any,isAuthenticated:boolean , setAuthorization:any, onLanguageChange:any}) => {
    const navigate = useNavigate();
    const logClick = () => {
        navigate('/sigh-form', {state:false})
    };

    const signClick = () => {
        navigate('/sigh-form', {state:true})
    };

    const openHistory = () => {
        if(isAuthenticated){
            navigate('/history')
        }
        else {
            navigate('/sigh-form', {state:false})
        }
    }

    const goHome = () => {
        if(isAuthenticated){
            navigate('/home')
        }
        else {
            navigate('/')
        }
    }

    const openUserManual = () => {
        navigate("/user-manual")
    }

    const openAboutApp = () => {
        navigate("/about-app")
    }

    const openAboutAuthors = () => {
        navigate("/about-authors")
    }

    const logOut = () => {
        saveUser();
        setAuthorization(false);
        navigate('/')
    }

    const changeLanguage = () => {
        onLanguageChange();
    }

    return (
        <>
            <div className='header'>
                <div className='inlineHeaderBlock mainHeaderBlock'>
                    <h1 onClick={goHome} id="logo">BitMap Factory</h1>
                    <div className="blockOfConstInfo">
                        <p className="topHeaderLinks" onClick={openUserManual}  id="links">Інструкція користувача</p>
                        <hr/>
                        <p className="topHeaderLinks" onClick={openAboutApp}  id="links">Про програму</p>
                        <hr/>
                        <p className="topHeaderLinks" onClick={openAboutAuthors}  id="links">Про авторів</p>
                    </div>
                </div>
                <div className='inlineHeaderBlock headerButtons' >
                    <div className="out-language-block">
                        <button className="logOutButton" onClick={logOut} id="logou">
                            <p className="logOutText">Вийти</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                 className="lucide lucide-log-out-icon lucide-log-out">
                                <path d="m16 17 5-5-5-5"/>
                                <path d="M21 12H9"/>
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            </svg>
                        </button>
                        <img src="ukr_lan.png" alt="changeLanguage" className="languageImage" onClick={changeLanguage}/>
                        <p className="languageName">UA</p>
                    </div>
                    <div>
                        <p className="historyLink" onClick={openHistory}>Історія</p>
                        <button className='enterButton ukButton' onClick={logClick}>Авторизуватись</button>
                        <button onClick={signClick} className="ukButton">Зареєструватись</button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default UaHeader;

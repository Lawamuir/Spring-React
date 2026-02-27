import logo from './logo.svg';
import './App.css';

import UserManual from "./jsxBlocks/UserManual";
import AboutApp from "./jsxBlocks/AboutApp";
import AboutAuthors from "./jsxBlocks/AboutAuthors";
import History from "./jsxBlocks/History";
import Home from './jsxBlocks/Home';
import SignForm from "./jsxBlocks/SignForm";
import Header from "./jsxBlocks/Header";

import uaHeader from "./uaJsxBlocks/UaHeader"
import uaSignForm from "./uaJsxBlocks/UaSignForm";
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {useRef, useState} from "react";
import useNavigate from "react-router-dom";
import {User} from "./data/dataTypes";
import {saveMode, setWorkspace} from "./RequestsToServer";
import UaHeader from "./uaJsxBlocks/UaHeader";
import UaHome from "./uaJsxBlocks/UaHome";
import UaHistory from "./uaJsxBlocks/UaHistory";
import UaSignForm from "./uaJsxBlocks/UaSignForm";
import UaAboutApp from "./uaJsxBlocks/UaAboutApp";
import UaAboutAuthors from "./uaJsxBlocks/UaAboutAuthors";
import UaUserManual from "./uaJsxBlocks/UaUserManual";

function App() {
    const [toggleLanguage, setLanguage] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const saveUserState = () =>{
        if(user){
            saveMode(user.mode).then((res)=>(
                setUser(null)
            )
            ) .catch((err)=>{
                console.log(err);
                }
            )
        }
    }

    const onToggleLanguage = () => {
        setLanguage(!toggleLanguage);
    }
  return (
    <div className="App">
      <header className="App-header">
        <Router>
            {
                toggleLanguage ? (
                    <>
                        <Header saveUser={saveUserState} isAuthenticated={isAuthenticated}
                                setAuthorization={setIsAuthenticated} onLanguageChange={onToggleLanguage}/>
                        <Routes>
                            <Route path='/sigh-form' element={<SignForm setAuthorization={setIsAuthenticated}/>}/>
                            <Route path='/home' element={<Home user={user} setUser={setUser}/>}/>
                            <Route path='/history' element={<History/>}/>
                            <Route path='/user-manual' element={<UserManual/>}/>
                            <Route path='/about-app' element={<AboutApp/>}/>
                            <Route path='/about-authors' element={<AboutAuthors/>}/>
                        </Routes>
                    </>
                ):(
                    <>
                        <UaHeader saveUser={saveUserState} isAuthenticated={isAuthenticated}
                                  setAuthorization={setIsAuthenticated} onLanguageChange={onToggleLanguage}/>
                        <Routes>
                            <Route path='/sigh-form' element={<UaSignForm setAuthorization={setIsAuthenticated}/>}/>
                            <Route path='/home' element={<UaHome user={user} setUser={setUser}/>}/>
                            <Route path='/history' element={<UaHistory/>}/>
                            <Route path='/user-manual' element={<UaUserManual/>}/>
                            <Route path='/about-app' element={<UaAboutApp/>}/>
                            <Route path='/about-authors' element={<UaAboutAuthors/>}/>
                        </Routes>
                    </>
                )
            }

        </Router>
      </header>
    </div>
  );
}

export default App;

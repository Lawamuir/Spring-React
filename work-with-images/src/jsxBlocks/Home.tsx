import React, { useState, useRef, useEffect } from "react";
import {
    deleteLatestIm, getBuildingWays, uploadImage, userChoseWay,
    getUserWorkSpace, setWorkspace, sendSecretText, getSecretText
} from "../RequestsToServer";
import {User} from "../data/dataTypes";

const BASE_URL = "http://localhost:8080/";

const Home = (
    {user,setUser}:{user:User|null,setUser:any}
) =>{
    const [chooseWayForm, setChooseWayForm] = useState<boolean>(false);
    const [example, setExample] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);


    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isThereAnImage, setIsThereAnImage] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [previewImage, setPreviewImage] = useState<string|null>();
    const [stop, setStop] = useState<boolean>(false);
    const [openTextArea, setOpenTextArea] = useState<boolean>(false);
    const [waysToBuildMap, setWaysToBuildMap] = useState<string[]>();

    useEffect(() => {
        if(user){
            if (user.mode == null){
                setUserMode(0);
            }
        }
    }, [user])


    const buildMap = () => {
        if(example){
            setIsThereAnImage(true);
            if(user && user.mode){
                userChoseWay(user.mode).then((res)=>{
                    console.log(res.data);
                    setUserUpdatedPath(res.data);
                }).catch((err)=>{
                    console.log(err);
                })
            }
            else {
                userChoseWay(0).then((res)=>{
                    console.log(res.data);
                    setUserUpdatedPath(res.data);
                }).catch((err)=>{
                    console.log(err);
                })
            }
        }
    }

    const chooseFile = () => {
        fileInputRef.current?.click();
    }

    const chooseWay = (index:number)=> {
        setChooseWayForm(false);
        setUserMode(index);
    }

    const closeChooseWayForm = () => {
        setChooseWayForm(false);
    }

    const extractSecretMessage = () => {
        setOpenTextArea(false);
        getMessage();
    }

    const getMessage = () => {
        if(user?.updatedPath)
            getSecretText(user.updatedPath).then((res) => {
                alert("From image was exported message " + res.data);
            }).catch((err) => {
                console.log(err);
            })
    }

    const getLatestUserWorkSpace = () => {
        getUserWorkSpace().then((res)=>{
            console.log(res.data);
            const userData = res.data;
            if(userData.path){
                setExample(true);
            }
            if(userData.updatedPath){
                setIsThereAnImage(true);
            }

            console.log(userData);
            setUser(userData);

        }).catch((err)=>{
            console.log(err);
        })
        getWaysToBuildMap();
        setStop(true);
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(user){
            if(user.path){
                deleteLatestIm()
                    .catch((err)=>{
                        console.log(err);
                    })
            }
            if(e.target.files){
                setUserPath(URL.createObjectURL(e.target.files[0]));
                setFile(e.target.files?.[0]);
                setPreviewImage(URL.createObjectURL(e.target.files[0]));
                if(e.target.files?.[0] != null){
                    const formData = new FormData();
                    formData.append('image', e.target.files?.[0]);
                    uploadImage(formData).then((res)=>{
                        setUserPath(res.data);

                        console.log(res.data);
                        setExample(true);

                    }).catch((err)=>{
                        console.log(err);
                    })
                }
            }
        }
    }

    const onOpenTextArea = () => {
        setOpenTextArea(true);
    }

    const onTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    }

    const saveData = () => {
        if(user){

            setWorkspace(user).catch((err)=>{
                console.log(err);
            })
        }
    }

    const sendHideMessage = () => {
        const formData = new URLSearchParams();
        formData.append("message", message);
        if(user?.updatedPath)
            formData.append("path", user.updatedPath);
        else
            formData.append("path", "");

        sendSecretText(formData).catch((err)=>{
            console.log(err);
        })
    }

    const setUserMode = (mode:number) => {
        setUser({
            id: user?.id || 1,
            login:user?.login || "",
            pass:user?.pass || "",
            mode: mode,
            path:user?.path,
            updatedPath:user?.updatedPath,
        })
    }

    const setUserPath = (path:string) => {
        setUser({
            id: user?.id || 1,
            login:user?.login || "",
            pass:user?.pass || "",
            mode: user?.mode,
            path:path,
            updatedPath:user?.updatedPath,
        })
    }

    const setUserUpdatedPath = (updatedPath:string) => {
        setUser({
            id: user?.id || 1,
            login:user?.login,
            pass:user?.pass,
            mode: user?.mode,
            path:user?.path,
            updatedPath:updatedPath,
        })
    }

    const getWaysToBuildMap = () => {
        getBuildingWays().then((res)=>{
            setWaysToBuildMap(res.data);
        }).catch((err)=>{
            console.log(err);
        })
    }

    const wayOfBuildingMap = () =>{
        setChooseWayForm(true)
    }

    return (
        <>
            <div className="mainContent">
                <h3>Current way to build map: {user && user?.mode != undefined && waysToBuildMap?.[user?.mode]}</h3>
                <button className="chooseFile" onClick={chooseFile}>
                    Choose an image with bmp extension
                </button>
                <input
                    style={{display:"none"}}
                    ref={fileInputRef}
                    type="file"
                    accept=".bmp"
                    onChange={onFileChange}
                />
                <>
                    {
                        !stop && getLatestUserWorkSpace()
                    }
                </>
                {

                    user && user.path != null &&
                    <>
                        <div>
                            <img src={BASE_URL + user.path} alt="" className="bitMapPrewiew"/>
                        </div>
                        <div className="waysButtonBlock">
                            <button className="waysButton" onClick={buildMap}>
                                Build map
                            </button >
                            <button  className="waysButton" onClick={wayOfBuildingMap}>
                                Choose another way to build map
                            </button>
                        </div>

                        {
                            chooseWayForm &&
                            <div className="chooseWayForm form">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                     className="closeIcon lucide lucide-circle-x-icon lucide-circle-x"
                                     onClick={closeChooseWayForm}>
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="m15 9-6 6"/>
                                    <path d="m9 9 6 6"/>

                                </svg>
                                <h3 className="signFormHeader">Choose way of map</h3>
                                <hr/>
                                {
                                    waysToBuildMap?.map((way, index) =>(
                                        <div className="chooseButtonBlock">
                                            <button className="chooseWayButton" onClick={() => chooseWay(index)}>{way}</button>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                            <div className="imageSingleResults">
                                {
                                    isThereAnImage &&
                                    <>
                                        <div className="imageSingleResultItem">
                                            <div>
                                                <div className="imageMenu">
                                                    <img src={BASE_URL +user.updatedPath} alt="imageResult" className="imageResult"/>

                                                </div>

                                            </div>

                                            <div className="bottomBlockOfHomeImage">
                                                <p className="homeResultText">Result</p>
                                                <a href={BASE_URL + user.updatedPath} download className="downloadIcon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round"
                                                         className=" lucide lucide-arrow-down-to-line-icon lucide-arrow-down-to-line">
                                                        <path d="M12 17V3"/>
                                                        <path d="m6 11 6 6 6-6"/>
                                                        <path d="M19 21H5"/>
                                                    </svg>
                                                </a>
                                            </div>

                                        </div>
                                        <div className="imageButtonsMenu">
                                            <button className="imageButtonMenu" onClick={onOpenTextArea}>Add a hidden message</button>
                                            <button className="imageButtonMenu" onClick={extractSecretMessage}>Extract a hidden message</button>
                                            {
                                                openTextArea &&
                                                <div>
                                                    <p className="addMessageHeader">Add a secret message in this image</p>
                                                    <textarea className="secretMessage" onChange={onTextAreaChange} id="message" cols={30} rows={4}/>
                                                    <button className="imageButtonMenu" onClick={sendHideMessage}>Send</button>

                                                </div>
                                            }
                                        </div>
                                    </>
                                }
                            </div>
                    </>
                }
            </div>
        </>
    )
}

export default Home;
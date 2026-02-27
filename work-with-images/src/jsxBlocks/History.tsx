import {useState} from "react";
import {getUserHistory, getBuildingWays, getSecretText} from "../RequestsToServer";
import {History as HistoryStruct} from "../data/dataTypes";
import '../App.css';

const BASE_URL = "http://localhost:8080/";

const History = () => {
    const [history, setHistory] = useState<HistoryStruct>();
    const [isSendRequest, setSendRequest] = useState<boolean>(false);
    const [waysToBuildMap, setWaysToBuildMap] = useState<string[]>();

    const getHistory = () => {
        getUserHistory().then((res) => {
            setHistory(res.data);
            console.log(res.data);
            getBuildingWays().then((res) => {
                setWaysToBuildMap(res.data);
            }).catch((err) => {
                console.log(err);
            })

        }).catch((err) => {
            console.log(err);
        })
        setSendRequest(true);
    }

    const getMessage = (index: number) => {
        if(history)
            getSecretText(history?.imagePaths[index]).then((res) => {
                index+=1
                alert("From image " + index + " was exported message " + res.data);
                history.exportedMessages.unshift(res.data);
                if(history.exportedMessages.length > 3){
                    history.exportedMessages.pop();
                }
        }).then((res) =>(
                setHistory(history)
            )) .catch((err) => {
            console.log(err);
            })
    }

    return (
        <>
            {
                !isSendRequest &&
                getHistory()
            }
            <div className="mainContent">
                <div className="imageResults">
                    {
                        history?.imagePaths.map((path, index) => (
                            <div className="imageResultItem">
                                <img src={BASE_URL +path} alt="imageResult" className="imageResult"/>
                                <div className="bottomBlockOfHistoryImage">
                                    <button onClick={() => getMessage(index)}>Extract message</button>
                                    <a href={BASE_URL + path} download className="downloadIcon">
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
                                    <p className="imageResultText">{
                                        history && waysToBuildMap && history.mode && typeof history.mode[index] === 'number'
                                            ? waysToBuildMap[history.mode[index]]
                                            : ''}</p>

                            </div>
                        ))
                    }
                    <br/>
                    </div>
                    <div className="historyMessagesBlock">
                        <p id="hst">Latest inserted messages into images:</p>
                        {
                            history?.insertedMessage.map((message, index) => (
                                <p>{message}</p>
                            ))
                        }
                        <p id="hst">Latest exported messages from images:</p>
                        {
                            history?.exportedMessages.map((message, index) => (
                                <p>{message}</p>
                            ))
                        }
                    </div>

                </div>
        </>
    )
}

export default History;
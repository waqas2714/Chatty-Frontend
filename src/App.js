import './App.css';
import {nanoid} from "nanoid";
import io from "socket.io-client";
import {useEffect, useState} from 'react'

const socket = io.connect("http://localhost:5000");
const userName = nanoid(4);

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendChat = (e)=>{
    e.preventDefault();
    socket.emit("chat",{message, userName});
    setMessage("");
  }

  useEffect(()=>{
    localStorage.clear();
    localStorage.setItem("name", userName);
  },[])

  useEffect(()=>{
    socket.on("chat",(payload)=>{
      setChat([...chat, payload]);
    })
  })
  return (
    <>
      <div className="header">
        <h1 style={{margin: "0",padding: "0"}}>Chatty</h1>
      </div>
      <hr style={{width:"247px"}}/>
      <div className="container">
        <div className={`chat-container `}>
        {chat.map((payload, index)=>{
          return(
            <div className={`row ${localStorage.getItem("name")===payload.userName?"own":"others"}`}>
            <code key={index}>{payload.userName}</code>
            <hr style={{width:"131px"}}/>
            <p key={index} className='message'>{payload.message}</p>
            </div>
          )
        })}
        </div>
        <form onSubmit={sendChat}>
          <input type="text" name="chat" value={message} placeholder="Type Message..." onChange={(e)=>setMessage(e.target.value)}/>
          <button type='submit'>Send</button>
        </form>
        </div>
    </>
  );
}

export default App;

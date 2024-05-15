import React, { useState, useRef, useEffect } from 'react'
import {
  Container,
  Dropdown,
  Header,
  Menu,
  Segment,
  Message,
  Input,
  Button,
  Grid,
  Divider
} from 'semantic-ui-react'
import { FaPlaneArrival, FaRobot } from "react-icons/fa6";
import Lottie from 'lottie-react';
import loading from "./loading.json";
import Project from './Project';
import ChatDocumentation from './ChatDocumentation';
import DriverDocumentation from './DriverDocumentation';


const App = () => {
  const [selectedWindow, setSelectedWindow] = useState('home'); 
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Menu fixed='top' inverted>
        <Container fixed>
          <Menu.Item as='a' header onClick={()=>setSelectedWindow('home')}>
            <FaPlaneArrival style={{ marginRight: '1.5em' }} />
            Pilot Pete
          </Menu.Item>
          <Menu.Item as='a' onClick={()=>{
            setSelectedWindow('project')
            }
            }>Project</Menu.Item>
          <Dropdown item simple text='Documentation'>
            <Dropdown.Menu>
              <Dropdown.Item as='a' onClick={()=>{setSelectedWindow('documentation-driver')}}>Driver Docs</Dropdown.Item>
              <Dropdown.Item as='a' onClick={()=>{setSelectedWindow('documentation-chat')}}>Chat Docs</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Menu>
      {selectedWindow === 'home' ? <Home/> : (selectedWindow === 'project' ? <Project/> : (selectedWindow === 'documentation-chat' ? <ChatDocumentation/> : <DriverDocumentation/> ) )}
      {}
      
    </div>
  );
}



const Screen = ({ setIsActive, setIsDriverInvalid }) => {
    const handleSetIsActive = (isActive) => {
        setIsActive(isActive);
    };

    const handleSetIsDriverInvalid = (isDriverInvalid) => {
        setIsDriverInvalid(isDriverInvalid);
    };


  const [image, setImage] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    handleSetIsDriverInvalid(false);
    handleSetIsActive(false);

    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    // const host = window.location.hostname;
    // const port = window.location.port ? `:${window.location.port}` : ''; 
    const host = '10.122.0.151'
    const port = ':8182';
    const wsurl = `${protocol}${host}${port}/stream`;
    ws.current = new WebSocket(wsurl);


    ws.current.onopen = () => {
      handleSetIsDriverInvalid(false);
      handleSetIsActive(true);
      console.log("WebSocket connection established");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message) {
          const base64Image = `data:image/png;base64,${data.message}`;
          setImage(base64Image);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message: ", error);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    ws.current.onclose = () => {
      handleSetIsActive(false);
      handleSetIsDriverInvalid(true);
      console.log("WebSocket connection closed");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);


  return (
    image === '' ? (
      <div style={{
        width: "1200px",
        height: "760px",
        display: "flex",
        justifyContent: "center",  
        alignItems: "center" 
      }}>
        <Lottie animationData={loading}  style={{ width: "120px"}}/>
      </div>
    ) :
      (
        <img
          src={image}
          alt="Live Stream"
          style={{
            width: '100%',
            objectFit: 'cover',
            borderRadius: "8px",
            maxWidth: "100%",
            height: "auto",
            cursor: "pointer",
            userSelect: "none",
            WebkitTouchCallout: "none",
            WebkitTapHighlightColor: "transparent",
            MozUserSelect: "none",
            WebkitUserSelect: "none",
            msUserSelect: "none"
          }}
        />
      )

  );
}




export default App;

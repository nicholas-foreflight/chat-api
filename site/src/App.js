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
import Documentation from './Documentation';


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
              <Dropdown.Item as='a' onClick={()=>{setSelectedWindow('documentation')}}>Driver Docs</Dropdown.Item>
              <Dropdown.Item as='a' onClick={()=>{setSelectedWindow('documentation')}}>Chat Docs</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Menu>
      {selectedWindow === 'home' ? <Home/> : (selectedWindow === 'project' ? <Project/> : (selectedWindow === 'documentation' ? <Documentation/> : <></> ) )}
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


const Home = () =>{
  const [isHiddenConfig, setIsHiddenConfig] = useState(false);
  const [isDriverConnected, setIsDriverConnected] = useState(false);
  const [isDriverInvalid, setIsDriverInvalid] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', message: 'Welcome to Pilot Pete!' },
    { role: 'user', message: 'Get the latest METAR for KJFK' },
    { role: 'assistant', message: 'Did you want a screenshot too?' },
    { role: 'user', message: 'Yes that would be wicked neat' },
    { role: 'assistant', message: 'Yes that would be wicked neat' },
    { role: 'user', message: 'Yes that would be wicked neatuld be wicked neatuld be wicked neatuld be wicked neat' },
    { role: 'user', message: 'Yes that would be wicked neat' },
    { role: 'user', message: 'Yes that would be wicked neat' },
    { role: 'assistant', message: 'Yes that would be wicked neatuld be wicked neatuld be wicked neatuld be wicked neat' },
    { role: 'user', message: 'Yes that would be wicked neat' },
    { role: 'user', message: 'Yes that would be wicked neat' },
    { role: 'assistant', message: 'Yes that would be wicked neat' },
    { role: 'user', message: 'Yes that would be wicked neatuld be wicked neatuld be wicked neatuld be wicked neat' },
    { role: 'user', message: 'Yes that would be wicked neat' },
    { role: 'user', message: 'Yes that would be wicked neat' },
    { role: 'assistant', message: 'Yes that would be wicked neatuld be wicked neatuld be wicked neatuld be wicked neat' },
    { role: 'user', message: 'Yes that would be wicked neat' },
    { role: 'user', message: 'Yes that would be wicked neat' },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    setMessages([...messages, { role: 'user', message: userInput }]);
    setUserInput('');
  };
  return (
    <>
        {/*               ======================  Screen  =================================               */}
        <Container style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '4em' }}>
            {isHiddenConfig && (
                <Container>
                    <Segment attached>
                        <Screen setIsActive={setIsDriverConnected} setIsDriverInvalid={setIsDriverInvalid}/>
                    </Segment>
                </Container>
            )}
            {/*               ======================  Screen Config  ===============================               */}
                <Container>
                    {!isHiddenConfig && (<h5 className="ui top attached header">Driver Configuration</h5>)}
                    {!isHiddenConfig && (
                        <Segment attached>
                            <Input
                                label='http://'
                                placeholder='10.0.0.1:8000'
                                style={{ marginBottom: '5px' }}
                            />
                            <Button primary onClick={() => setIsHiddenConfig(!isHiddenConfig)} floated='right' >Connect</Button>
                        </Segment>
                    )}
                    {!isDriverInvalid && !isHiddenConfig && (
                        <Message warning attached='bottom'>
                            <Message.Header>No Driver has been provided</Message.Header>
                            <p>Cannot use Device interaction feature</p>
                        </Message>
                    )}
                    {isDriverInvalid && !isHiddenConfig && (
                        <Message negative attached='bottom'>
                            <Message.Header>This Driver doesn't seem to exist</Message.Header>
                            <p>Check the Driver settings</p>
                        </Message>
                    )}
                    {!isDriverConnected && isHiddenConfig && (
                        <Message info attached='bottom'>
                            <Message.Header>Connecting to *.*.*.* ... </Message.Header>
                        </Message>
                    )}
                    {isDriverConnected && isHiddenConfig && (
                        <Message positive attached='bottom'>
                            <Message.Header>Connected to *.*.*.*</Message.Header>
                        </Message>
                    )}
                </Container>
        </Container>


        {/*               ======================  Pete Header  =================================               */}
        <Container text >
        </Container>

        {/*               ======================  Chat  =================================               */}
      <Container style={{ margin: '1rem', padding: '1rem' }}>
        <Segment style={{ display: 'flex', flexDirection: 'column', height: '50rem' }}>
          <Header as='h1'> Pilot Pete <FaRobot /></Header>
          <Container style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {messages.map((msg, index) => (
              <Message
                key={index}
                compact={true}
                content={msg.message}
                className={msg.role === 'assistant' ? 'assistant-message' : 'user-message'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: msg.role === 'assistant' ? 'flex-start' : 'flex-end',
                  backgroundColor: msg.role === 'assistant' ? '#f1f1f1' : '#d4eaff',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '1em',
                  maxWidth: '75%',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
              />
            ))}
            <div ref={messagesEndRef} />
          </Container>
          <Divider />
          <Container>
            <Grid>
              <Grid.Row>
                <Grid.Column width={14}>
                  <Input
                    fluid
                    placeholder='Type your message...'
                    value={userInput}
                    onChange={handleInputChange}
                  />
                </Grid.Column>
                <Grid.Column width={2}>
                  <Button
                    color='blue'
                    content='Submit'
                    onClick={handleSubmit}
                    fluid
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
      </Container>
    </>
    
  )
}

export default App;

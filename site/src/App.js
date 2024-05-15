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
              <Dropdown.Item onClick={()=>window.open('/documentation')}>Driver Docs</Dropdown.Item>
              <Dropdown.Item onClick={()=>window.open('/docs')}>Chat Docs</Dropdown.Item> 
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Menu>
      {selectedWindow === 'home' ? <Home/> : (selectedWindow == 'project' ? <Project/> : <></> )}
      {}
      
    </div>
  );
}



const Screen = () => {
  const [image, setImage] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    // const host = window.location.hostname;
    // const port = window.location.port ? `:${window.location.port}` : ''; 
    const host = '10.122.0.151'
    const port = ':8182';
    const wsurl = `${protocol}${host}${port}/stream`;
    ws.current = new WebSocket(wsurl);


    ws.current.onopen = () => {
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
      console.log("WebSocket connection closed");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);


  return (
    image == '' ? (
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
          <Container text style={{ marginTop: '7em' }}>
        <Header as='h1'> Pilot Pete <FaRobot /></Header>
        <p>The ForeFlight action bot</p>
        <p>
          Ask Pilot Pete to get you the latest weather information, or to file a flight plan. He has access to all of the resources
          ForeFlight has to offer. Start by asking him to get you the latest METAR for your airport. He can even show you what hes
          doing on the iPad if you ask him to share his screen.
        </p>
      </Container>

      <Container style={{ margin: '50px 0', padding: '1rem' }}>
        <Segment style={{ display: 'flex', flexDirection: 'column', height: '50rem' }}>
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

      <Container style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Segment >
          <Screen />
        </Segment>
      </Container>

      <Container style={{ paddingBottom: '20px' }}>
        <h5 className="ui top attached header">Driver Configuration</h5>
        <Segment attached>
          <Input
            label='http://'
            placeholder='10.0.0.1:8000'
            style={{ marginBottom: '5px' }}
          />
          <Button floated='right'>Update</Button>
        </Segment>
        <Message warning attached='bottom'>
          <Message.Header>You have not defined a valid Driver.</Message.Header>
          <p>You cannot use Device interaction.</p>
        </Message>
      </Container>
    </>
    
  )
}

export default App;

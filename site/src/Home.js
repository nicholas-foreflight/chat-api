import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Divider, Grid, Header, Input, Message, Segment } from "semantic-ui-react";
import { FaRobot } from "react-icons/fa6";
import Lottie from "lottie-react";
import loading from "./loading.json";
import styled from "styled-components"
import ReactMarkdown from 'react-markdown';


const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: "•";
    width:3em;
    font-size: 0.8em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: "•";
    }
    33% {
      content: "••";
    }
    66% {
      content: "•••";
    }
  }
`

const Home = () => {
    const [isHiddenConfig, setIsHiddenConfig] = useState(false);
    const [isDriverConnected, setIsDriverConnected] = useState(false);
    const [isDriverInvalid, setIsDriverInvalid] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [thinking, setThinking] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', message: 'Welcome to Pilot Pete! Ask me any questions you have about ForeFlight' },
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

    const sendChatMessage = (message) => {
        setThinking(true);
        setMessages(messages => [...messages, { role: 'user', message }]);
        console.log('Sending message to pete: ', message);
        fetch('http://localhost:8080/threads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ message })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Received response from pete: ', data);
                setMessages(messages => [...messages, { role: 'assistant', message: data.message }]);
                setThinking(false);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    const handleSubmit = () => {
        setUserInput('');
        sendChatMessage(userInput);
    };
    return (
        <>
            {/*               ======================  Screen  =================================               */}
            <Container style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '4em' }}>
                {isHiddenConfig && (
                    <Container>
                        <Segment attached>
                            <Screen setIsActive={setIsDriverConnected} setIsDriverInvalid={setIsDriverInvalid} />
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
                                placeholder='10.0.0.1:8001'
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
                                content={
                                    <ReactMarkdown>{msg.message}</ReactMarkdown>
                                  }
                                className={msg.role === 'assistant' ? 'assistant-message' : 'user-message'}
                                style={{
                                    alignSelf: msg.role === 'assistant' ? 'flex-start' : 'flex-end',
                                    backgroundColor: msg.role === 'assistant' ? '#f1f1f1' : '#d4eaff',
                                    maxWidth: '75%',
                                    wordBreak: 'break-word',
                                    whiteSpace: 'pre-wrap'
                                }}
                            />
                        ))}
                        {thinking && (
                            <Message
                                key={-1}
                                compact
                                content={<Dots></Dots>}
                                className="assistant-message"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    alignSelf: 'flex-start',
                                    backgroundColor: '#f1f1f1',
                                    borderRadius: '10px',
                                    padding: '1rem',
                                    marginBottom: '1em',
                                    maxWidth: '75%',
                                    wordBreak: 'break-word',
                                    whiteSpace: 'pre-wrap',
                                }}
                            />)}
                        <div ref={messagesEndRef} />
                    </Container>
                    <Divider />
                    <Container>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={14}>
                                <form onSubmit={(e)=>{
                                        e.preventDefault();
                                        handleSubmit(); 
                                }} style={{ width: '100%' }}>
                                    <Input
                                        tabIndex={0}
                                        disabled={thinking}
                                        fluid
                                        placeholder='Type your message...'
                                        value={userInput}
                                        onChange={handleInputChange}
                                        loading={thinking}
                                        style={{ paddingRight: '40px' }}
                                        />
                                        </form>
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    <Button
                                        color='blue'
                                        content='Submit'
                                        onClick={handleSubmit}
                                        fluid
                                        disabled={thinking}
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
                <Lottie animationData={loading} style={{ width: "120px" }} />
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

export default Home;
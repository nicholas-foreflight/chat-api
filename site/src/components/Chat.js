import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Divider, Grid, Header, Input, Message, Segment } from "semantic-ui-react";
import { FaRobot } from "react-icons/fa6";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'https://esm.sh/remark-gfm@4'
import Dots from './Dots';


const Chat = ({threadId, setThreadId}) => {
    const welcomeMessage = [{ role: 'assistant', message: 'Welcome to Pilot Pete! Ask me any questions you have about ForeFlight' }];

    // State to store the user's input in the message field
    const [userInput, setUserInput] = useState('');

    // State to store the thinking status of the assistant (true when the assistant is thinking, false otherwise)
    const [thinking, setThinking] = useState(false);

    // State to store the angry status of the assistant (true when the assistant is angry, false otherwise)
    const [angry, setAngry] = useState(false);
    
    // State to store the messages in the chat window
    const [messages, setMessages] = useState(welcomeMessage);

    // Scroll to the bottom of the chat window when a new message is added or received
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        if (threadId) {
            fetch(`/threads/${threadId}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Received response from Pete: ', data);
                    const updatedMessages = data.messages.map((msg, index) => {
                        const userSectionRegex = /#### From the user:\n```text\n([\s\S]*?)\n```/;
                        const match = msg.message.match(userSectionRegex);
                        let text = msg.message;
                        if (match && match[1]) {
                            text = match[1].trim();
                        }
                        return { id: index, role: msg.role, message: text };
                    });

                    setMessages(prevMessages => {
                        return [...welcomeMessage, ...updatedMessages.reverse()];
                    });
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        }
    }, [threadId]);


    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendChatMessage = () => {
        setThinking(true);
        setAngry(false);
        setUserInput('');
        setMessages((prevMessages) => [...prevMessages, { role: 'user', message: userInput }]);
        console.log(userInput)
        console.log(messages)
        fetch(!threadId ? `/threads` : `/threads/${threadId}` , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },

            body: JSON.stringify({ message: userInput }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Received response from pete: ', data);
                setMessages((prevMessages) => [...prevMessages, { role: 'assistant', message: data.message }]);
                setThinking(false);
                setThreadId(data.threadId);
            })
            .catch(error => {
                setThinking(false);
                setAngry(true);
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    return (
        <>
            <Container style={{ margin: '1rem', padding: '1rem' }}>
                <Segment style={{ display: 'flex', flexDirection: 'column', height: '50rem' }}>
                        <Header as='h1' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Pilot Pete <span style={{ marginLeft: '0.5rem' }}><FaRobot color={angry?"red":null} size={50} /></span>
                            <span style={{flex:1}}></span>
                        </Header>
                        <Divider style={{padding: 0, margin: 0}}/>
                    <Container style={{ overflowY: 'auto', flex: 1 }}>
                        <Container style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {messages.map((msg, index) => (
                                <Message
                                    size='small'
                                    key={index}
                                    content={<ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.message}</ReactMarkdown>}
                                    className={msg.role === 'assistant' ? 'assistant-message' : 'user-message'}
                                    style={{
                                        alignSelf: msg.role === 'assistant' ? 'flex-start' : 'flex-end',
                                        backgroundColor: msg.role === 'assistant' ? '#f1f1f1' : '#d4eaff',
                                        wordBreak: 'break-word',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                />
                            ))}
                            {thinking && (
                                <Message
                                    key={-1}
                                    compact
                                    content={<Dots />}
                                    className="assistant-message"
                                    style={{
                                        alignItems: 'center',
                                        alignSelf: 'flex-start',
                                        backgroundColor: '#f1f1f1',
                                    }}
                                />
                            )}
                            <div  ref={messagesEndRef}/>
                        </Container>
                    </Container>
                    <Divider style={{padding: 0, margin: 0, marginBottom:10}}/>
                    <Container>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={14}>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        sendChatMessage();
                                    }} style={{ width: '100%' }}>
                                        <Input
                                            tabIndex={0}
                                            disabled={thinking}
                                            fluid
                                            placeholder='Type your message...'
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            loading={thinking}
                                            style={{ paddingRight: '40px' }}
                                        />
                                    </form>
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    <Button
                                        color='blue'
                                        content='Submit'
                                        onClick={()=>sendChatMessage()}
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
export default Chat;
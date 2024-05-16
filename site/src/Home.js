import React from 'react';
import Chat from './components/Chat';
import Driver from './components/Driver';

const Home = ({setThreadId, threadId}) => {
  
    return (
        <>
            <Driver />
            <Chat threadId={threadId} setThreadId={setThreadId} />
        </>
    );
};

export default Home;

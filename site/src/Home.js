import React from 'react';
import Chat from './components/Chat';
import Driver from './components/Driver';

const Home = ({setThreadId, threadId}) => {
  
    return (
        <>
            <Chat threadId={threadId} setThreadId={setThreadId} />
            <Driver />
        </>
    );
};

export default Home;

import React, { useState } from 'react';
import { Grid } from 'semantic-ui-react';
import Chat from './components/Chat';
import Driver from './components/Driver';


const Home = ({ setThreadId, threadId }) => {
    const [isDriverRunning, setIsDriverRunning] = useState(false);

    return (
        <Grid columns={2}>
            <Grid.Row>
                <Grid.Column width={10}>
                        <Driver setIsDriverRunning={setIsDriverRunning} />
                </Grid.Column>
                <Grid.Column width={6}>
                        <Chat
                            threadId={threadId}
                            setThreadId={setThreadId}
                            isDriverRunning={isDriverRunning}
                        />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default Home;
import React, { useEffect, useState } from 'react';
import { Header, Button, Container, Dropdown, Message, Segment } from "semantic-ui-react";
import Screen from './Screen';

const Driver = () => {
    const [driverList, setDriverList] = useState([{
        name: 'iPad 1',
        ip: '10.122.0.151',
    }, {
        name: 'Local',
        ip: '0.0.0.0'
    }]);

    const [driverSelected, setDriverSelected] = useState(driverList[0].ip);
    const [driverIP, setDriverIP] = useState('');
    const [isDriverConnected, setIsDriverConnected] = useState(false);

    const [driverConfigError, setDriverConfigError] = useState(false);


    useEffect(() => {
        fetch('/drivers')
            .then(response => response.json())
            .then(data => {
                // setDriverList(data);
            })
            .catch(error => {
                // setDriverConfigError(true);
                // console.error('Error fetching Driver list:', error);
            });
    }, []);

    return (
        <Container style={{ margin: '1rem', padding: '1rem' }}>
            <Container>
                <Header className="top attached">App Driver</Header>
                <Segment attached compact>
                    <Dropdown
                        placeholder='Select Driver'
                        fluid
                        selection
                        defaultValue={driverList && driverList[0].ip}
                        options={driverList && driverList.map(driver => ({
                            key: driver.name,
                            text: `${driver.name} (${driver.ip})`,
                            value: driver.ip,
                        }))}
                        onChange={(e, { value }) => setDriverSelected(value)}
                        style={{ marginBottom: '5px' }}
                    />
                    <Button primary onClick={() => setDriverIP(driverSelected)} floated='right' disabled={isDriverConnected || driverConfigError || !driverSelected}>
                        Connect
                    </Button>
                    {isDriverConnected &&
                        <Button positive={false} onClick={() => {
                            setDriverIP()
                            setIsDriverConnected(false)
                        }} floated='right'>
                            Disconnect
                        </Button>}
                </Segment>
                {driverIP && (
                    <Container>
                        <Segment attached>
                            <Screen setIsDriverConnected={setIsDriverConnected} driverIp={driverIP} />
                        </Segment>
                    </Container>
                )}
                {!isDriverConnected && !driverSelected && (
                    <Message warning attached='bottom'>
                        <Message.Header>No Driver has been provided</Message.Header>
                        <p>Cannot use Device interaction feature</p>
                    </Message>
                )}
                {driverConfigError && driverSelected && (
                    <Message negative attached='bottom'>
                        <Message.Header>Error in the Driver Config</Message.Header>
                    </Message>
                )}
                {!driverConfigError && driverSelected && !driverIP && (
                    <Message info attached='bottom'>
                        <Message.Header>Ready to connect to {driverSelected} ... </Message.Header>
                    </Message>
                )}
                {driverSelected && driverIP && !isDriverConnected && (
                    <Message info attached='bottom'>
                        <Message.Header>Connecting to {driverIP} ... </Message.Header>
                    </Message>
                )}
                {isDriverConnected && (
                    <Message positive attached='bottom'>
                        <Message.Header>Connected to {driverIP}</Message.Header>
                    </Message>
                )}
            </Container>
        </Container>
    );
};

export default Driver;

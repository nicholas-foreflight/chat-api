import React from 'react'
import {
    Container,
    Header,

} from 'semantic-ui-react'
import { FaRobot } from "react-icons/fa6";

const Project = () => {
    return (
        <Container text style={{ marginTop: '7em' }}>
            <Header as='h1'> Project Pete <FaRobot /></Header>
            <p>Project Pete is a ForeFlight action bot that can help you with all of your ForeFlight needs. He can get you the latest METAR, TAF, and NOTAM information for your airport. He can also help you file a flight plan, and show you his screen if you ask him to.</p>
        </Container>
    )
}

export default Project;
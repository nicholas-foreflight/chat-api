import React from 'react'
import {
    Container

} from 'semantic-ui-react'
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';


const DriverDocumentation = () => {
    return (
        <Container text style={{ marginTop: '7em' }}>
            <SwaggerUI url="/driver-docs.json" />
        </Container>
    )
}

export default DriverDocumentation;
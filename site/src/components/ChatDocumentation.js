import React from 'react'
import {
    Container
} from 'semantic-ui-react'
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';


const ChatDocumentation = () => {
    return (
        <Container text style={{ marginTop: '7em' }}>
            <SwaggerUI url="/v3/api-docs" />
        </Container>
    )
}

export default ChatDocumentation;
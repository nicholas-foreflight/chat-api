import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { Menu, Container, Dropdown } from 'semantic-ui-react';
import { FaPlaneArrival } from 'react-icons/fa';
import Home from './Home'; // Import your actual components
import Project from './Project'
import ChatDocumentation from './ChatDocumentation';
import DriverDocumentation from './DriverDocumentation';


const App = () => (
    <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Menu fixed='top' inverted>
                <Container fixed>
                    <Menu.Item as={Link} to='/' header>
                        <FaPlaneArrival style={{ marginRight: '1.5em' }} /> Pilot Pete
                    </Menu.Item>
                    <Menu.Item as={Link} to='/project'>Project</Menu.Item>
                    <Dropdown item simple text='Documentation'>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to='/documentation-driver'>Driver Docs</Dropdown.Item>
                            <Dropdown.Item as={Link} to='/documentation-chat'>Chat Docs</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Container>
            </Menu>

            <Container style={{ marginTop: '7em' }}>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/project' element={<Project />} />
                    <Route path='/documentation-chat' element={<ChatDocumentation />} />
                    <Route path='/documentation-driver' element={<DriverDocumentation />} />
                </Routes>
            </Container>
        </div>
    </Router>
);

// Ensure the App component is exported as default
export default App;
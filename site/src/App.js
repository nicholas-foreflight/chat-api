import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { Menu, Container, Dropdown } from 'semantic-ui-react';
import { FaPlaneArrival } from 'react-icons/fa';
import Home from './Home';
import Project from './components/Project';
import ChatDocumentation from './components/ChatDocumentation';
import DriverDocumentation from './components/DriverDocumentation';
import { useParams, useNavigate } from 'react-router-dom';

const Thread = ({ threadId, setThreadId }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id && id !== threadId) {
            setThreadId(id);
        } else if (threadId) {
            window.history.replaceState(null, '', `/thread/${threadId}`);
        }
    }, [id, threadId, setThreadId, navigate]);

    return <Home threadId={threadId} setThreadId={setThreadId} />;
};

const App = () => {
    const [threadId, setThreadId] = useState(null);

    return (
        <BrowserRouter>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'Arial', 'sans-serif'" }}>
                <Menu fixed='top' inverted>
                    <Container>
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
                <Container fluid style={{ marginTop: '4em' }}>
                    <Routes>
                        <Route path='/' element={<Thread threadId={threadId} setThreadId={setThreadId} />} />
                        <Route path='/project' element={<Project />} />
                        <Route path='/documentation-chat' element={<ChatDocumentation />} />
                        <Route path='/documentation-driver' element={<DriverDocumentation />} />
                        <Route path='/thread/:id' element={<Thread threadId={threadId} setThreadId={setThreadId} />} />
                    </Routes>
                </Container>
            </div>
        </BrowserRouter>
    );
};

export default App;
// src/App.js
import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import HeatMap from './components/HeatMap';
import DeviceManagement from './components/DeviceManagement';
import OperationModes from './components/OperationModes';

function App() {
  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#">Mi App Meteorológica</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#map">Mapa de Calor</Nav.Link>
            <Nav.Link href="#devices">Dispositivos</Nav.Link>
            <Nav.Link href="#modes">Modos de Operación</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid style={{ padding: 0 }}>
        <HeatMap />
        <DeviceManagement />
        <OperationModes />
      </Container>
    </div>
  );
}

export default App;

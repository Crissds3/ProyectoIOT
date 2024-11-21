// src/App.js
import React, { useState } from 'react';
import { Container, Navbar, Row, Col } from 'react-bootstrap';
import HeatMap from './components/HeatMap';
import AddSensorForm from './components/AddSensorForm';
import OperationModes from './components/OperationModes';

function App() {
  const [sensors, setSensors] = useState([]);

  const handleAddSensor = (sensor) => {
    setSensors([...sensors, sensor]);
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#">Mi App Meteorológica</Navbar.Brand>
      </Navbar>

      <Container fluid style={{ padding: '20px' }}>
        <Row>
          <Col md={8}>
            <HeatMap sensors={sensors} />
          </Col>
          <Col md={4}>
            <h2>Agregar Sensor</h2>
            <AddSensorForm onAddSensor={handleAddSensor} />
            <OperationModes />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;

// src/App.js
import React, { useState, useEffect } from 'react';
import { Container, Navbar, Row, Col, Button } from 'react-bootstrap';
import HeatMap from './components/HeatMap';
import AddSensorForm from './components/AddSensorForm';
import OperationModes from './components/OperationModes';

function App() {
  const [sensors, setSensors] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [addingSensor, setAddingSensor] = useState(false);

  // Cargar sensores desde localStorage al montar el componente
  useEffect(() => {
    const storedSensors = localStorage.getItem('sensors');
    if (storedSensors) {
      setSensors(JSON.parse(storedSensors));
    }
  }, []);

  // Guardar sensores en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('sensors', JSON.stringify(sensors));
  }, [sensors]);

  const handleAddSensor = (sensor) => {
    setSensors([...sensors, sensor]);
    setAddingSensor(false);
    setSelectedPosition(null);
  };

  const handleDeleteSensor = (index) => {
    const updatedSensors = [...sensors];
    updatedSensors.splice(index, 1);
    setSensors(updatedSensors);
  };

  const handlePositionSelect = (position) => {
    setSelectedPosition(position);
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#">Mi App Meteorológica</Navbar.Brand>
      </Navbar>

      <Container fluid style={{ padding: '20px' }}>
        <Row>
          <Col md={8}>
            <HeatMap
              sensors={sensors}
              onPositionSelect={handlePositionSelect}
              addingSensor={addingSensor}
            />
          </Col>
          <Col md={4}>
            {!addingSensor ? (
              <>
                <Button variant="primary" onClick={() => setAddingSensor(true)}>
                  Agregar Sensor
                </Button>
                <h2 className="mt-4">Sensores</h2>
                {sensors.length > 0 ? (
                  <ul>
                    {sensors.map((sensor, index) => (
                      <li key={`list-sensor-${index}`}>
                        {sensor.type} - {sensor.measurement}{' '}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteSensor(index)}
                        >
                          Eliminar
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay sensores agregados.</p>
                )}
              </>
            ) : (
              <>
                <h2>Agregar Sensor</h2>
                <AddSensorForm
                  onAddSensor={handleAddSensor}
                  selectedPosition={selectedPosition}
                />
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={() => {
                    setAddingSensor(false);
                    setSelectedPosition(null);
                  }}
                >
                  Cancelar
                </Button>
              </>
            )}
            <OperationModes />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;

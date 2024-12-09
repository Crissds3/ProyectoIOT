// src/MainApp.js
import React, { useState, useEffect } from 'react';
import { Container, Navbar, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import HeatMap from './components/HeatMap';
import AddSensorForm from './components/AddSensorForm';
import OperationModes from './components/OperationModes';

function MainApp() {
  const [sensors, setSensors] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [addingSensor, setAddingSensor] = useState(false);
  const navigate = useNavigate();

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

  const handleReturnToWelcome = () => {
    navigate('/');
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>
            <i className="fas fa-cloud-sun mr-2"></i>
            Sistema de Monitoreo Meteorológico
          </Navbar.Brand>
          <Button variant="outline-light" onClick={handleReturnToWelcome}>
            Volver a Bienvenida
          </Button>
        </Container>
      </Navbar>

      {/* Contenido Principal */}
      <Container fluid>
        <Row className="g-4">
          <Col lg={8}>
            <div className="map-container shadow-sm rounded">
              <HeatMap
                sensors={sensors}
                onPositionSelect={handlePositionSelect}
                addingSensor={addingSensor}
              />
            </div>
          </Col>
          <Col lg={4}>
            <div className="control-panel">
              {!addingSensor ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Panel de Control</h4>
                    <Button
                      variant="primary"
                      onClick={() => setAddingSensor(true)}
                      className="btn-custom"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Agregar Sensor
                    </Button>
                  </div>
                  <div className="sensor-list-container">
                    <h5 className="mb-3">Sensores Activos</h5>
                    {sensors.length > 0 ? (
                      <ListGroup>
                        {sensors.map((sensor, index) => (
                          <ListGroup.Item
                            key={`sensor-${index}`}
                            className="d-flex justify-content-between align-items-center sensor-item"
                          >
                            <span>
                              <i
                                className={`fas ${
                                  sensor.type === 'Temperatura'
                                    ? 'fa-thermometer-half'
                                    : 'fa-cloud-rain'
                                } mr-2`}
                              ></i>
                              {sensor.type} - {sensor.measurement}
                            </span>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteSensor(index)}
                              className="btn-custom-sm"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </Button>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <div className="text-center text-muted p-4">
                        <i className="fas fa-exclamation-circle fa-2x mb-3"></i>
                        <p>No hay sensores agregados</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="add-sensor-form">
                  <h4 className="mb-4">Agregar Nuevo Sensor</h4>
                  <AddSensorForm
                    onAddSensor={handleAddSensor}
                    selectedPosition={selectedPosition}
                  />
                  <Button
                    variant="outline-secondary"
                    className="mt-3 w-100"
                    onClick={() => {
                      setAddingSensor(false);
                      setSelectedPosition(null);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
              <div className="mt-4">
                <OperationModes />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MainApp;
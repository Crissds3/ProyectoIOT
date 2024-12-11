// src/MainApp.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Navbar,
  Row,
  Col,
  Button,
  ListGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import HeatMap from "./components/HeatMap";
import AddSensorForm from "./components/AddSensorForm";
import OperationModes from "./components/OperationModes";

function MainApp() {
  const [sensors, setSensors] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [addingSensor, setAddingSensor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedSensors = localStorage.getItem("sensors");
    if (storedSensors) {
      setSensors(JSON.parse(storedSensors));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sensors", JSON.stringify(sensors));
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
    navigate("/");
  };

  const getSensorIconClass = (type) => {
    switch (type) {
      case "Temperatura":
        return "fa-thermometer-half";
      case "Humedad":
        return "fa-tint";
      case "Lluvia":
        return "fa-cloud-rain";
      case "Presion":
        return "fa-tachometer-alt";
      case "Viento":
        return "fa-wind";
      default:
        return "fa-question-circle";
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar expand="md" className="custom-navbar mb-4">
        <Container fluid className="navbar-container">
          <Navbar.Brand className="navbar-brand-custom m-0">
            <i className="fas fa-cloud-sun me-2"></i>
            Sistema de Monitoreo Meteorológico
          </Navbar.Brand>
          <Button
            variant="light"
            className="welcome-btn"
            onClick={handleReturnToWelcome}
          >
            <i className="fas fa-home me-2"></i>Bienvenida
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
            <div className="control-panel p-4 rounded shadow-sm">
              {!addingSensor ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 panel-title">Panel de Control</h4>
                    <Button
                      variant="primary"
                      onClick={() => setAddingSensor(true)}
                      className="btn-custom-add"
                    >
                      <i className="fas fa-plus me-2"></i>
                      Agregar Sensor
                    </Button>
                  </div>
                  <div className="sensor-list-container">
                    <h5 className="mb-3">Sensores Activos</h5>
                    {sensors.length > 0 ? (
                      <ListGroup className="sensor-list">
                        {sensors.map((sensor, index) => (
                          <ListGroup.Item
                            key={`sensor-${index}`}
                            className="d-flex justify-content-between align-items-center sensor-item"
                          >
                            <span>
                              <i
                                className={`fas ${getSensorIconClass(sensor.type)} sensor-icon`}
                              ></i>
                              {sensor.type} - {sensor.measurement}
                            </span>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteSensor(index)}
                              className="botonBorrar bin-button"
                              title="Eliminar sensor"
                            >
                              <svg
                                className="bin-top"
                                viewBox="0 0 39 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <line
                                  y1="5"
                                  x2="39"
                                  y2="5"
                                  stroke="white"
                                  strokeWidth="4"
                                ></line>
                                <line
                                  x1="12"
                                  y1="1.5"
                                  x2="26.0357"
                                  y2="1.5"
                                  stroke="white"
                                  strokeWidth="3"
                                ></line>
                              </svg>
                              <svg
                                className="bin-bottom"
                                viewBox="0 0 33 39"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <mask id="path-1-inside-1_8_19" fill="white">
                                  <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z" />
                                </mask>
                                <path
                                  d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                                  fill="white"
                                  mask="url(#path-1-inside-1_8_19)"
                                ></path>
                                <path
                                  d="M12 6L12 29"
                                  stroke="white"
                                  strokeWidth="4"
                                ></path>
                                <path
                                  d="M21 6V29"
                                  stroke="white"
                                  strokeWidth="4"
                                ></path>
                              </svg>
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
                    className="mt-3 w-100 cancel-button"
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

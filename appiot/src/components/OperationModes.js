// src/components/OperationModes.js
import React, { useState, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import mqtt from 'mqtt';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './OperationModes.css'; 

function OperationModes() {
  const [mode, setMode] = useState('automatico');
  const [subMode, setSubMode] = useState(null);
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [temperatureThreshold, setTemperatureThreshold] = useState('');
  const [consoleMessages, setConsoleMessages] = useState([]);
  const [consoleVisible, setConsoleVisible] = useState(false);

  const modes = [
    { name: 'Manual', value: 'manual', command: 'MANUAL' },
    { name: 'Semiautomático', value: 'semiautomatico', command: 'SEMIAUTOMATIC' },
    { name: 'Automático', value: 'automatico', command: 'AUTOMATIC' },
  ];

  const subModes = [
    { name: 'Automático', value: 'automatico', command: 'AUTOMATICO' },
    { name: 'Manual', value: 'manual', command: 'MANUAL' },
  ];

  useEffect(() => {
    const mqttClient = mqtt.connect('ws://35.192.191.68:9001/mqtt');

    mqttClient.on('connect', () => {
      setIsConnected(true);
      console.log('Conectado al broker MQTT');
      mqttClient.subscribe('all_prints');
    });

    mqttClient.on('error', (err) => {
      console.error('Error de conexión MQTT:', err);
      setIsConnected(false);
      mqttClient.end();
    });

    mqttClient.on('message', (topic, message) => {
      if (topic === 'all_prints') {
        setConsoleMessages((prevMessages) => {
          const newMessages = [...prevMessages, message.toString()];
          return newMessages.slice(-8);
        });
      }
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    setSubMode(null);
    const modeCommand = modes.find((m) => m.value === selectedMode)?.command;
    if (client && isConnected && modeCommand) {
      client.publish('sensor_commands', modeCommand);
      console.log(`Publicado comando: ${modeCommand}`);
    }
  };

  const handleSubModeChange = (selectedSubMode) => {
    setSubMode(selectedSubMode);
    const subModeCommand = subModes.find((sm) => sm.value === selectedSubMode)?.command;
    if (client && isConnected && subModeCommand) {
      client.publish('sensor_commands', subModeCommand);
      console.log(`Publicado comando: ${subModeCommand}`);
    }
  };

  const handleManualControl = (command) => {
    if (
      client &&
      isConnected &&
      (mode === 'manual' || (mode === 'semiautomatico' && subMode === 'manual'))
    ) {
      client.publish('sensor_commands', command.toLowerCase());
      console.log(`Publicado comando: ${command.toLowerCase()}`);
    }
  };

  const handleUpdateTemperature = () => {
    if (client && isConnected && temperatureThreshold !== '') {
      client.publish(
        'sensor_commands',
        `TEMPERATURE_THRESHOLD:${temperatureThreshold}`
      );
      console.log(`Publicado comando: TEMPERATURE_THRESHOLD:${temperatureThreshold}`);

      Swal.fire({
        title: 'Umbral de Temperatura Actualizado',
        text: `El umbral se ha cambiado a ${temperatureThreshold} °C`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });

      setTemperatureThreshold('');
    }
  };

  const toggleConsoleVisibility = () => {
    setConsoleVisible(!consoleVisible);
  };

  return (
    <Card id="operation-modes">
      <Card.Body>
        <Card.Title>Modos de Operación</Card.Title>
        <div className="mode-buttons">
          {modes.map((m, idx) => (
            <button
              key={idx}
              className={`mode-button ${mode === m.value ? 'active' : ''}`}
              onClick={() => handleModeChange(m.value)}
            >
              <input
                type="radio"
                name="mode"
                value={m.value}
                checked={mode === m.value}
                readOnly
              />
              {m.name}
            </button>
          ))}
        </div>

        {mode === 'semiautomatico' && (
          <div className="submode-buttons">
            {subModes.map((sm, idx) => (
              <button
                key={idx}
                className={`submode-button ${subMode === sm.value ? 'active' : ''}`}
                onClick={() => handleSubModeChange(sm.value)}
              >
                {sm.name}
              </button>
            ))}
          </div>
        )}

        {(mode === 'manual' || (mode === 'semiautomatico' && subMode === 'manual')) && (
          <div className="manual-controls">
            <button
              className="control-button encender"
              onClick={() => handleManualControl('ENCENDER')}
            >
              Encender
            </button>{' '}
            <button
              className="control-button apagar"
              onClick={() => handleManualControl('APAGAR')}
            >
              Apagar
            </button>
          </div>
        )}

        <div className="temperature-control">
          <Form.Group className="mb-3" controlId="formTemperatureThreshold">
            <Form.Label>Umbral de Temperatura</Form.Label>
            <Form.Control
              type="number"
              value={temperatureThreshold}
              onChange={(e) => setTemperatureThreshold(e.target.value)}
              placeholder="Ingrese el umbral de temperatura"
            />
          </Form.Group>
          <button className="update-temperature" onClick={handleUpdateTemperature}>
            Actualizar
          </button>
        </div>

        <div className="console-toggle">
          <button className="console-button" onClick={toggleConsoleVisibility}>
            {consoleVisible ? 'Ocultar Consola' : 'Mostrar Consola'}
          </button>
        </div>

        {consoleVisible && (
          <div className="console">
            <h5><strong>Consola de MQTT</strong></h5>
            <div className="console-messages">
              {consoleMessages.map((msg, idx) => (
                <p key={idx}>{msg}</p>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default OperationModes;

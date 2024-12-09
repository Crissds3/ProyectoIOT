// src/components/OperationModes.js
import React, { useState, useEffect } from 'react';
import { Card, ButtonGroup, ToggleButton, Button, Form } from 'react-bootstrap';
import mqtt from 'mqtt';

function OperationModes() {
  const [mode, setMode] = useState('manual');
  const [subMode, setSubMode] = useState(null); // Nuevo estado para submodes
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [temperatureThreshold, setTemperatureThreshold] = useState(''); // Estado para el campo de texto
  const [consoleMessages, setConsoleMessages] = useState([]); // Estado para los mensajes de la consola
  const [consoleVisible, setConsoleVisible] = useState(false); // Estado para mostrar/ocultar la consola

  const modes = [
    { name: 'Manual', value: 'manual', command: 'MANUAL' },
    { name: 'Semiautomático', value: 'semiautomatico', command: 'SEMIAUTOMATIC' },
    { name: 'Automático', value: 'automatico', command: 'AUTOMATIC' },
  ];

  const subModes = [
    { name: 'Automático', value: 'automatico', command: 'AUTOMATICO' },
    { name: 'Manual', value: 'manual', command: 'MANUAL' },
  ];

  // Conectar al broker MQTT
  useEffect(() => {
    // Asegúrate de que el broker MQTT esté configurado para conexiones WebSocket en el puerto 9001
    const mqttClient = mqtt.connect('ws://35.192.191.68:9001/mqtt');

    mqttClient.on('connect', () => {
      setIsConnected(true);
      console.log('Conectado al broker MQTT');
      mqttClient.subscribe('all_prints'); // Suscribirse al tópico al conectar
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
          return newMessages.slice(-8); // Mantener solo los últimos 5 mensajes
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
    setSubMode(null); // Resetear subMode al cambiar el modo principal
    const modeCommand = modes.find(m => m.value === selectedMode)?.command;
    if (client && isConnected && modeCommand) {
      client.publish('sensor_commands', modeCommand);
      console.log(`Publicado comando: ${modeCommand}`);
    }
  };

  const handleSubModeChange = (selectedSubMode) => {
    setSubMode(selectedSubMode);
    const subModeCommand = subModes.find(sm => sm.value === selectedSubMode)?.command;
    if (client && isConnected && subModeCommand) {
      client.publish('sensor_commands', subModeCommand);
      console.log(`Publicado comando: ${subModeCommand}`);
    }
  };

  const handleManualControl = (command) => {
    if (client && isConnected && (mode === 'manual' || (mode === 'semiautomatico' && subMode === 'manual'))) {
      client.publish('sensor_commands', command.toLowerCase());
      console.log(`Publicado comando: ${command.toLowerCase()}`);
    }
  };

  const handleUpdateTemperature = () => {
    if (client && isConnected && temperatureThreshold) {
      const message = `UpdateTemp: ${temperatureThreshold}`;
      client.publish('sensor_commands', message);
      console.log(`Publicado comando: ${message}`);
      alert(`Umbral de temperatura del relé actualizado a ${temperatureThreshold} grados Celsius`);
      setTemperatureThreshold(''); // Limpiar el campo de texto después de enviar el mensaje
    }
  };

  const toggleConsoleVisibility = () => {
    setConsoleVisible(!consoleVisible);
  };

  return (
    <Card id="modes">
      <Card.Body>
        <Card.Title>Modos de Operación</Card.Title>
        <ButtonGroup className="mt-2 d-flex">
          {modes.map((m, idx) => (
            <ToggleButton
              key={idx}
              type="radio"
              variant="outline-primary"
              name="mode"
              value={m.value}
              checked={mode === m.value}
              onChange={(e) => handleModeChange(e.currentTarget.value)}
            >
              {m.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
        
        {/* Sub-botones para modo Semiautomático */}
        {mode === 'semiautomatico' && (
          <div className="mt-3 d-flex justify-content-center gap-2">
            <Button
              variant="secondary"
              onClick={() => handleSubModeChange('automatico')}
            >
              Automático
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSubModeChange('manual')}
            >
              Manual
            </Button>
          </div>
        )}

        {/* Botones de control manual */}
        <div className="mt-3 d-flex justify-content-center gap-2">
          <Button
            variant="success"
            disabled={
              !(
                mode === 'manual' ||
                (mode === 'semiautomatico' && subMode === 'manual')
              )
            }
            onClick={() => handleManualControl('ENCENDER')}
          >
            Encender
          </Button>
          <Button
            variant="danger"
            disabled={
              !(
                mode === 'manual' ||
                (mode === 'semiautomatico' && subMode === 'manual')
              )
            }
            onClick={() => handleManualControl('APAGAR')}
          >
            Apagar
          </Button>
        </div>

        {/* Campo de texto y botón de actualizar */}
        <div className="mt-3">
          <Form.Group className="mb-3" controlId="formTemperatureThreshold">
            <Form.Label>Umbral de Temperatura</Form.Label>
            <Form.Control
              type="number"
              value={temperatureThreshold}
              onChange={(e) => setTemperatureThreshold(e.target.value)}
              placeholder="Ingrese el umbral de temperatura"
            />
          </Form.Group>
          <Button variant="primary" onClick={handleUpdateTemperature}>
            Actualizar
          </Button>
        </div>

        {/* Botón para mostrar/ocultar la consola */}
        <div className="mt-3">
          <Button variant="info" onClick={toggleConsoleVisibility}>
            {consoleVisible ? 'Ocultar Consola' : 'Mostrar Consola'}
          </Button>
        </div>

        {/* Consola de mensajes */}
        {consoleVisible && (
          <div className="mt-3 console">
            <h5>Consola de Mensajes</h5>
            <div className="console-messages">
              {consoleMessages.map((msg, idx) => (
                <div key={idx}>{msg}</div>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default OperationModes;
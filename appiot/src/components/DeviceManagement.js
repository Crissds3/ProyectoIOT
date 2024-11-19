// src/components/DeviceManagement.js
import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

function DeviceManagement() {
  const [devices, setDevices] = useState([]);
  const [deviceName, setDeviceName] = useState('');

  const addDevice = () => {
    if (deviceName) {
      setDevices([...devices, deviceName]);
      setDeviceName('');
    }
  };

  const removeDevice = (name) => {
    setDevices(devices.filter((device) => device !== name));
  };

  return (
    <div id="devices" style={{ padding: '20px' }}>
      <h2>Gestión de Dispositivos</h2>
      <Form inline className="mb-3">
        <Form.Control
          type="text"
          placeholder="Nombre de la estación"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          className="mr-sm-2"
        />
        <Button variant="primary" onClick={addDevice}>
          Agregar Estación
        </Button>
      </Form>
      <div>
        {devices.map((device, index) => (
          <Card key={index} style={{ marginBottom: '10px' }}>
            <Card.Body>
              <Card.Title>{device}</Card.Title>
              <Button variant="danger" onClick={() => removeDevice(device)}>
                Eliminar
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default DeviceManagement;

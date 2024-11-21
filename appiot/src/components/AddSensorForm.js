// src/components/AddSensorForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { fetchMeasurements } from '../services/influxservice.js';

function AddSensorForm({ onAddSensor }) {
  const [sensorType, setSensorType] = useState(null);
  const [measurement, setMeasurement] = useState(null);
  const [availableMeasurements, setAvailableMeasurements] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const sensorOptions = [
    { value: 'Lluvia', label: 'Lluvia' },
    { value: 'Temperatura', label: 'Temperatura' },
  ];

  useEffect(() => {
    const getMeasurements = async () => {
      const measurements = await fetchMeasurements();
      setAvailableMeasurements(
        measurements.map((m) => ({ value: m, label: m }))
      );
    };

    getMeasurements();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sensorType && measurement && latitude && longitude) {
      onAddSensor({
        type: sensorType.value,
        measurement: measurement.value,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      // Resetear el formulario
      setSensorType(null);
      setMeasurement(null);
      setLatitude('');
      setLongitude('');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="sensorType">
        <Form.Label>Tipo de Sensor</Form.Label>
        <Select
          options={sensorOptions}
          value={sensorType}
          onChange={setSensorType}
        />
      </Form.Group>
      <Form.Group controlId="measurement">
        <Form.Label>Measurement</Form.Label>
        <Select
          options={availableMeasurements}
          value={measurement}
          onChange={setMeasurement}
        />
      </Form.Group>
      <Form.Group controlId="latitude">
        <Form.Label>Latitud</Form.Label>
        <Form.Control
          type="number"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="Ej: -33.0458"
        />
      </Form.Group>
      <Form.Group controlId="longitude">
        <Form.Label>Longitud</Form.Label>
        <Form.Control
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Ej: -71.6197"
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3">
        Agregar Sensor
      </Button>
    </Form>
  );
}

export default AddSensorForm;

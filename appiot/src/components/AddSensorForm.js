// src/components/AddSensorForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { fetchMeasurements } from '../services/influxservice';
import './AddSensorForm.css';

function AddSensorForm({ onAddSensor, selectedPosition }) {
  const [sensorType, setSensorType] = useState(null);
  const [measurement, setMeasurement] = useState(null);
  const [availableMeasurements, setAvailableMeasurements] = useState([]);

  const sensorOptions = [
    { value: 'Lluvia', label: 'Lluvia' },
    { value: 'Temperatura', label: 'Temperatura' },
    { value: 'Humedad', label: 'Humedad' },
    { value: 'Presion', label: 'Presion' },
    { value: 'Viento', label: 'Viento' },
  ];

  useEffect(() => {
    const getMeasurements = async () => {
      const measurements = await fetchMeasurements();
      setAvailableMeasurements(
        measurements.map((m) => ({ value: m.label, label: `${m.label} (${m.source})` }))
      );
    };

    getMeasurements();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sensorType && measurement && selectedPosition) {
      onAddSensor({
        type: sensorType.value,
        measurement: measurement.value,
        latitude: selectedPosition.lat,
        longitude: selectedPosition.lng,
      });
      // Resetear el formulario
      setSensorType(null);
      setMeasurement(null);
    } else {
      alert('Por favor, complete todos los campos y seleccione una ubicación en el mapa.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="sensorType">
        <Form.Label>Tipo de Sensor</Form.Label>
        <Select
          className="sensorType-select"
          options={sensorOptions}
          value={sensorType}
          onChange={setSensorType}
          placeholder="Seleccione un tipo de sensor..."
        />
      </Form.Group>
      <Form.Group controlId="measurement" className="mt-3">
        <Form.Label>Medición</Form.Label>
        <Select
          className="measurement-select"
          options={availableMeasurements}
          value={measurement}
          onChange={setMeasurement}
          placeholder="Seleccione una medición..."
        />
      </Form.Group>
      <Form.Group controlId="location" className="mt-3">
        <Form.Label>Ubicación Seleccionada</Form.Label>
        {selectedPosition ? (
          <p>
            Latitud: {selectedPosition.lat.toFixed(5)}, Longitud: {selectedPosition.lng.toFixed(5)}
          </p>
        ) : (
          <p>Haga clic en el mapa para seleccionar una ubicación.</p>
        )}
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3" disabled={!selectedPosition}>
        Agregar Sensor
      </Button>
    </Form>
  );
}

export default AddSensorForm;

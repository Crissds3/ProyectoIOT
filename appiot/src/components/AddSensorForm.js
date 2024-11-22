// src/components/AddSensorForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { fetchMeasurements } from '../services/influxservice';

function AddSensorForm({ onAddSensor, selectedPosition }) {
  const [sensorType, setSensorType] = useState(null);
  const [measurement, setMeasurement] = useState(null);
  const [availableMeasurements, setAvailableMeasurements] = useState([]);

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
      <Form.Group controlId="location">
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

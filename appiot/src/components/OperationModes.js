// src/components/OperationModes.js
import React, { useState } from 'react';
import { Card, ButtonGroup, ToggleButton } from 'react-bootstrap';

function OperationModes() {
  const [mode, setMode] = useState('manual');

  const modes = [
    { name: 'Manual', value: 'manual' },
    { name: 'Semiautomático', value: 'semiautomatico' },
    { name: 'Automático', value: 'automatico' },
  ];

  return (
    <div id="modes" style={{ padding: '20px' }}>
      <h2>Modos de Operación</h2>
      <Card>
        <Card.Body>
          <Card.Title>Seleccione el modo de operación</Card.Title>
          <ButtonGroup toggle className="mt-2">
            {modes.map((m, idx) => (
              <ToggleButton
                key={idx}
                type="radio"
                variant="secondary"
                name="mode"
                value={m.value}
                checked={mode === m.value}
                onChange={(e) => setMode(e.currentTarget.value)}
              >
                {m.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </Card.Body>
      </Card>
    </div>
  );
}

export default OperationModes;

// src/components/Bienvenido.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Bienvenido.css';

function Bienvenido() {
  const navigate = useNavigate();

  const handleEntrar = () => {
    navigate('/main');
  };

  return (
    <div className="bienvenido-container">
      <div className="overlay">
        <div className="content-box">
          <h1>PROYECTO INTERNET DE LAS COSAS</h1>
          <p className="descripcion">
            Integrantes: Felipe Castillo, Felipe Guerra y Cristóbal Núñez
          </p>
          <p className="descripcion2">
            Dispositivos utilizados: 2 ESP32 C3, 2 Sensores de temperatura (DS18B20), 1 de lluvia (Rain Seer) y 1 Relé de 4 módulos.
          </p>

          <Button variant="dark" size="lg" onClick={handleEntrar}>
            ENTRAR
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Bienvenido;
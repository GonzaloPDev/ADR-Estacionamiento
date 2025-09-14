import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AutoList from './components/AutoList';
import AutoForm from './components/AutoForm';
import AutoDetail from './components/AutoDetail';
import HistorialAuto from './components/HistorialAuto';
import Estadisticas from './components/Estadisticas';
import Loading from './components/Loading';
import { autoService } from './services/api';
import './styles/App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState(null);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const response = await autoService.getEstadisticas();
      setEstadisticas(response.data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="App">
        <Navbar estadisticas={estadisticas} />
        
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<AutoList />} />
            <Route path="/autos" element={<AutoList />} />
            <Route path="/autos/nuevo" element={<AutoForm />} />
            <Route path="/autos/editar/:id" element={<AutoForm />} />
            <Route path="/autos/:id" element={<AutoDetail />} />
            <Route path="/historial/:patente" element={<HistorialAuto />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
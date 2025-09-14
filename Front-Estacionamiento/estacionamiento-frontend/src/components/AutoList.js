import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { autoService } from '../services/api';

const AutoList = () => {
  const [autos, setAutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPatente, setSearchPatente] = useState('');

  useEffect(() => {
    cargarAutos();
  }, []);

  const cargarAutos = async () => {
    try {
      const response = await autoService.getAllAutos();
      setAutos(response.data.results || response.data);
    } catch (error) {
      console.error('Error cargando autos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, patente) => {
    if (window.confirm(`¿Estás seguro de eliminar el auto con patente ${patente}?`)) {
      try {
        await autoService.deleteAuto(id);
        cargarAutos();
        alert('Auto eliminado correctamente');
      } catch (error) {
        alert('Error al eliminar el auto');
      }
    }
  };

  const filteredAutos = autos.filter(auto =>
    auto.patente.toLowerCase().includes(searchPatente.toLowerCase())
  );

  if (loading) {
    return <div className="text-center">Cargando autos...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de Autos</h2>
        <Link to="/autos/nuevo" className="btn btn-primary">
          ➕ Nuevo Auto
        </Link>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por patente..."
            value={searchPatente}
            onChange={(e) => setSearchPatente(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Patente</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Color</th>
              <th>Estado</th>
              <th>Visitas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAutos.map((auto) => (
              <tr key={auto.id}>
                <td>
                  <strong>{auto.patente}</strong>
                </td>
                <td>{auto.marca}</td>
                <td>{auto.modelo}</td>
                <td>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: getColorCode(auto.color),
                      color: 'white'
                    }}
                  >
                    {auto.color}
                  </span>
                </td>
                <td>
                  <span className={`badge ${auto.estado_actual === 'Estacionado' ? 'bg-success' : 'bg-secondary'}`}>
                    {auto.estado_actual}
                  </span>
                </td>
                <td>
                  <span className="badge bg-info">{auto.total_visitas}</span>
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <Link
                      to={`/autos/${auto.id}`}
                      className="btn btn-sm btn-info"
                    >
                      👀 Ver
                    </Link>
                    <Link
                      to={`/historial/${auto.patente}`}
                      className="btn btn-sm btn-warning"
                    >
                      📋 Historial
                    </Link>
                    <button
                      onClick={() => handleDelete(auto.id, auto.patente)}
                      className="btn btn-sm btn-danger"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAutos.length === 0 && (
        <div className="text-center text-muted mt-4">
          {searchPatente ? 'No se encontraron autos con esa patente' : 'No hay autos registrados'}
        </div>
      )}
    </div>
  );
};

// Función auxiliar para colores
const getColorCode = (color) => {
  const colorMap = {
    'Rojo': '#dc3545',
    'Azul': '#007bff',
    'Verde': '#28a745',
    'Negro': '#000000',
    'Blanco': '#6c757d',
    'Gris': '#6c757d',
    'Plateado': '#6c757d',
    'Otro': '#17a2b8'
  };
  return colorMap[color] || '#6c757d';
};

export default AutoList;
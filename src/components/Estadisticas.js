import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { autoService } from '../services/api';

const Estadisticas = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [autosEstacionados, setAutosEstacionados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [statsResponse, estacionadosResponse] = await Promise.all([
        autoService.getEstadisticas(),
        autoService.getEstacionados()
      ]);
      
      setEstadisticas(statsResponse.data);
      setAutosEstacionados(estacionadosResponse.data.results || estacionadosResponse.data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTiempo = (tiempoStr) => {
    if (!tiempoStr || tiempoStr === 'En estacionamiento') return tiempoStr;
    return tiempoStr.replace(' horas', 'h');
  };

  if (loading) {
    return <div className="text-center">Cargando estadísticas...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Estadísticas del Estacionamiento</h2>
        <button onClick={cargarDatos} className="btn btn-primary">
          🔄 Actualizar
        </button>
      </div>

      {estadisticas && (
        <>
          {/* Tarjetas de estadísticas */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card text-center bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">Capacidad Total</h5>
                  <h2 className="card-text">{estadisticas.cupo_maximo}</h2>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 mb-3">
              <div className="card text-center bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">Ocupados</h5>
                  <h2 className="card-text">{estadisticas.autos_estacionados}</h2>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 mb-3">
              <div className="card text-center bg-info text-white">
                <div className="card-body">
                  <h5 className="card-title">Disponibles</h5>
                  <h2 className="card-text">{estadisticas.cupo_disponible}</h2>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 mb-3">
              <div className="card text-center bg-warning text-white">
                <div className="card-body">
                  <h5 className="card-title">Total Autos</h5>
                  <h2 className="card-text">{estadisticas.total_autos_registrados}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Ocupación Actual</h5>
            </div>
            <div className="card-body">
              <div className="progress" style={{ height: '30px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${(estadisticas.autos_estacionados / estadisticas.cupo_maximo) * 100}%`
                  }}
                >
                  {estadisticas.autos_estacionados} / {estadisticas.cupo_maximo}
                </div>
              </div>
              
              <div className="mt-2">
                <small className="text-muted">
                  {Math.round((estadisticas.autos_estacionados / estadisticas.cupo_maximo) * 100)}% de ocupación
                </small>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Autos actualmente estacionados */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            Autos Actualmente Estacionados ({autosEstacionados.length})
          </h5>
        </div>
        <div className="card-body">
          {autosEstacionados.length === 0 ? (
            <div className="text-center text-muted">
              No hay autos estacionados actualmente.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Patente</th>
                    <th>Auto</th>
                    <th>Entrada</th>
                    <th>Tiempo transcurrido</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {autosEstacionados.map((registro) => (
                    <tr key={registro.id}>
                      <td>
                        <strong>{registro.patente}</strong>
                      </td>
                      <td>
                        {registro.marca} {registro.modelo}
                      </td>
                      <td>
                        {new Date(registro.fecha_ingreso).toLocaleString('es-ES')}
                      </td>
                      <td>
                        <span className="badge bg-warning">
                          {formatTiempo(registro.tiempo_estacionado)}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/historial/${registro.patente}`}
                          className="btn btn-sm btn-info"
                        >
                          Ver Historial
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
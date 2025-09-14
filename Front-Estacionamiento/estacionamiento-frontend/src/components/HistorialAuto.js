import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { autoService } from '../services/api';

const HistorialAuto = () => {
  const { patente } = useParams();
  const [historial, setHistorial] = useState(null);
  const [autoInfo, setAutoInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarHistorial();
  }, [patente]);

  const cargarHistorial = async () => {
    try {
      const response = await autoService.getHistorialPorPatente(patente);
      setHistorial(response.data.historial);
      setAutoInfo(response.data.auto);
    } catch (error) {
      console.error('Error cargando historial:', error);
      alert('Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES');
  };

  const calcularTiempo = (ingreso, salida) => {
    if (!salida) return 'En estacionamiento';
    
    const diffMs = new Date(salida) - new Date(ingreso);
    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${horas}h ${minutos}m`;
  };

  if (loading) {
    return <div className="text-center">Cargando historial...</div>;
  }

  if (!historial || !autoInfo) {
    return (
      <div className="text-center">
        <h2>Auto no encontrado</h2>
        <Link to="/autos" className="btn btn-primary">
          Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Historial de Estacionamiento</h2>
        <Link to="/autos" className="btn btn-secondary">
          ← Volver
        </Link>
      </div>

      {/* Información del auto */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Información del Auto</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <strong>Patente:</strong> {autoInfo.patente}
            </div>
            <div className="col-md-3">
              <strong>Marca:</strong> {autoInfo.marca}
            </div>
            <div className="col-md-3">
              <strong>Modelo:</strong> {autoInfo.modelo}
            </div>
            <div className="col-md-3">
              <strong>Color:</strong> {autoInfo.color}
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total de visitas</h5>
              <h2 className="card-text">{historial.length}</h2>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card text-center bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Visitas completadas</h5>
              <h2 className="card-text">
                {historial.filter(r => r.fecha_salida).length}
              </h2>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card text-center bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Actual estacionado</h5>
              <h2 className="card-text">
                {historial.filter(r => !r.fecha_salida).length}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de historial */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Registros de Estacionamiento</h5>
        </div>
        <div className="card-body">
          {historial.length === 0 ? (
            <div className="text-center text-muted">
              No hay registros de estacionamiento para este auto.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Entrada</th>
                    <th>Salida</th>
                    <th>Tiempo</th>
                    <th>Estado</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((registro) => (
                    <tr key={registro.id}>
                      <td>{formatFecha(registro.fecha_ingreso)}</td>
                      <td>
                        {registro.fecha_salida 
                          ? formatFecha(registro.fecha_salida)
                          : '-'
                        }
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {calcularTiempo(registro.fecha_ingreso, registro.fecha_salida)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          registro.fecha_salida ? 'bg-success' : 'bg-warning'
                        }`}>
                          {registro.fecha_salida ? 'Completado' : 'En curso'}
                        </span>
                      </td>
                      <td>{registro.observaciones || '-'}</td>
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

export default HistorialAuto;
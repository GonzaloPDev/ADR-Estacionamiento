import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { autoService } from '../services/api';

const AutoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auto, setAuto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    cargarAuto();
  }, [id]);

  const cargarAuto = async () => {
    try {
      const response = await autoService.getAutoById(id);
      setAuto(response.data);
    } catch (error) {
      console.error('Error cargando auto:', error);
      alert('Error al cargar el auto');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarEntrada = async () => {
    setActionLoading(true);
    try {
      await autoService.registrarEntrada(id);
      alert('Entrada registrada correctamente');
      cargarAuto();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al registrar entrada');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegistrarSalida = async () => {
    setActionLoading(true);
    try {
      await autoService.registrarSalida(id);
      alert('Salida registrada correctamente');
      cargarAuto();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al registrar salida');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de eliminar este auto?`)) {
      try {
        await autoService.deleteAuto(id);
        alert('Auto eliminado correctamente');
        navigate('/autos');
      } catch (error) {
        alert('Error al eliminar el auto');
      }
    }
  };

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (!auto) {
    return <div className="text-center">Auto no encontrado</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Detalle del Auto</h2>
        <div>
          <Link to="/autos" className="btn btn-secondary me-2">
            ← Volver
          </Link>
          <Link to={`/autos/editar/${id}`} className="btn btn-warning me-2">
            ✏️ Editar
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            🗑️ Eliminar
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Información del Auto</h5>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-4"><strong>Patente:</strong></div>
                <div className="col-8">
                  <span className="badge bg-dark fs-6">{auto.patente}</span>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-4"><strong>Marca:</strong></div>
                <div className="col-8">{auto.marca}</div>
              </div>
              
              <div className="row mb-3">
                <div className="col-4"><strong>Modelo:</strong></div>
                <div className="col-8">{auto.modelo}</div>
              </div>
              
              <div className="row mb-3">
                <div className="col-4"><strong>Color:</strong></div>
                <div className="col-8">
                  <span
                    className="badge"
                    style={{
                      backgroundColor: getColorCode(auto.color),
                      color: 'white',
                      padding: '0.5em 1em'
                    }}
                  >
                    {auto.color}
                  </span>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-4"><strong>Estado:</strong></div>
                <div className="col-8">
                  <span className={`badge ${auto.estado_actual === 'Estacionado' ? 'bg-success' : 'bg-secondary'}`}>
                    {auto.estado_actual}
                  </span>
                </div>
              </div>
              
              <div className="row">
                <div className="col-4"><strong>Total visitas:</strong></div>
                <div className="col-8">
                  <span className="badge bg-info">{auto.total_visitas}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Acciones</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button
                  onClick={handleRegistrarEntrada}
                  disabled={actionLoading || auto.estado_actual === 'Estacionado'}
                  className="btn btn-success"
                >
                  {actionLoading ? 'Procesando...' : '🚗 Registrar Entrada'}
                </button>
                
                <button
                  onClick={handleRegistrarSalida}
                  disabled={actionLoading || auto.estado_actual !== 'Estacionado'}
                  className="btn btn-warning"
                >
                  {actionLoading ? 'Procesando...' : '🚪 Registrar Salida'}
                </button>
                
                <Link
                  to={`/historial/${auto.patente}`}
                  className="btn btn-info"
                >
                  📋 Ver Historial Completo
                </Link>
              </div>
              
              {auto.estado_actual === 'Estacionado' && (
                <div className="alert alert-info mt-3 mb-0">
                  <strong>⚠️ Atención:</strong> Este auto se encuentra actualmente estacionado.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default AutoDetail;
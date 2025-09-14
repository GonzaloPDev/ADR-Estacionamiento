import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { autoService } from '../services/api';

const AutoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    modelo: '',
    marca: '',
    color: '',
    patente: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      cargarAuto();
    }
  }, [id]);

  const cargarAuto = async () => {
    try {
      const response = await autoService.getAutoById(id);
      setFormData(response.data);
    } catch (error) {
      console.error('Error cargando auto:', error);
      alert('Error al cargar el auto');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Limpiar error del campo
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (isEdit) {
        await autoService.updateAuto(id, formData);
        alert('Auto actualizado correctamente');
      } else {
        await autoService.createAuto(formData);
        alert('Auto creado correctamente');
      }
      navigate('/autos');
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        alert('Error al guardar el auto');
      }
    } finally {
      setLoading(false);
    }
  };

  const marcas = ['Toyota', 'Ford', 'Chevrolet', 'Honda', 'Volkswagen', 'Fiat', 'Renault', 'Peugeot', 'Otro'];
  const colores = ['Rojo', 'Azul', 'Verde', 'Negro', 'Blanco', 'Gris', 'Plateado', 'Otro'];

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2>{isEdit ? 'Editar Auto' : 'Nuevo Auto'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Patente *</label>
            <input
              type="text"
              className={`form-control ${errors.patente ? 'is-invalid' : ''}`}
              name="patente"
              value={formData.patente}
              onChange={handleChange}
              required
              maxLength={10}
            />
            {errors.patente && <div className="invalid-feedback">{errors.patente}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Marca *</label>
            <select
              className={`form-select ${errors.marca ? 'is-invalid' : ''}`}
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar marca</option>
              {marcas.map(marca => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>
            {errors.marca && <div className="invalid-feedback">{errors.marca}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Modelo *</label>
            <input
              type="text"
              className={`form-control ${errors.modelo ? 'is-invalid' : ''}`}
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              required
            />
            {errors.modelo && <div className="invalid-feedback">{errors.modelo}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Color *</label>
            <select
              className={`form-select ${errors.color ? 'is-invalid' : ''}`}
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar color</option>
              {colores.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            {errors.color && <div className="invalid-feedback">{errors.color}</div>}
          </div>

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
            </button>
            
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/autos')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AutoForm;
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ estadisticas }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
      <div className="container">
        <Link className="navbar-brand" to="/">
            Estacionamiento
        </Link>
        
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/autos">
                Autos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/autos/nuevo">
                Nuevo Auto
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/estadisticas">
                Estadísticas
              </Link>
            </li>
          </ul>
          
          {estadisticas && (
            <div className="d-flex text-white">
              <span className="badge bg-success me-2">
                🅿️ {estadisticas.autos_estacionados}/{estadisticas.cupo_maximo}
              </span>
              <span className="badge bg-info">
                📊 {estadisticas.cupo_disponible} libres
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
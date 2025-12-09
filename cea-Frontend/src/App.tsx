import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Usuario {
  id: number;
  username: string;
  role: string;
  email: string;
}

interface Gasto {
  id: number;
  fecha: string;
  valor: number;
  lugar: string;
  descripcion: string;
  usuario: string;
}

function App() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [fecha, setFecha] = useState('');
  const [valorInput, setValorInput] = useState('');
  const [lugar, setLugar] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:8080/api/auth/login';

  useEffect(() => {
    const session = localStorage.getItem('cea_session');
    if (session) {
      setUser(JSON.parse(session));
    }

    const gastosVisuales = localStorage.getItem('cea_gastos_visuales');
    if (gastosVisuales) {
      setGastos(JSON.parse(gastosVisuales));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(API_URL, {
        username: username,
        password: password
      });

      if (response.data.success) {
        const userData = response.data.user;
        
        if (userData.role && userData.role.toUpperCase() === 'ADMIN') {
            userData.role = 'ADMIN';
        }

        setUser(userData);
        localStorage.setItem('cea_session', JSON.stringify(userData));
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 404) {
        setError('Usuario no encontrado en la Base de Datos o contraseña incorrecta.');
      } else {
        setError('Error: No se puede conectar al servidor (8080).');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cea_session');
    setUser(null);
    setUsername('');
    setPassword('');
  };

  const handleRegistrar = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setError('');

    const valStr = valorInput.replace(',', '.');
    const valor = parseFloat(valStr);

    if (isNaN(valor) || valor <= 0) {
      setError('Monto inválido.');
      return;
    }

    const nuevoGasto: Gasto = {
      id: Date.now(),
      fecha: fecha,
      valor: valor,
      lugar: lugar,
      descripcion: descripcion,
      usuario: user?.username || 'Anónimo'
    };

    const nuevaLista = [...gastos, nuevoGasto];
    setGastos(nuevaLista);
    localStorage.setItem('cea_gastos_visuales', JSON.stringify(nuevaLista));

    setMsg(' Gasto guardado (Visualmente)');
    setValorInput(''); setLugar(''); setDescripcion('');
    setTimeout(() => setMsg(''), 3000);
  };

  const isAdmin = user?.role === 'ADMIN';
  const misGastos = isAdmin 
    ? gastos 
    : gastos.filter(g => g.usuario === user?.username);

  const totalAcumulado = misGastos.reduce((acc, curr) => acc + curr.valor, 0);

  const resumenPorUsuario = Object.values(gastos.reduce((acc: any, curr) => {
    if (!acc[curr.usuario]) {
      acc[curr.usuario] = { nombre: curr.usuario, total: 0, conteo: 0 };
    }
    acc[curr.usuario].total += curr.valor;
    acc[curr.usuario].conteo += 1;
    return acc;
  }, {}));

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" 
           style={{background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'}}>
        <div className="card p-4 shadow border-0" style={{maxWidth: '400px', width: '100%'}}>
          <div className="text-center mb-4">
            <h3 className="fw-bold text-primary">CORPORACIÓN JDCY</h3>
            <p className="text-muted small">GESTIÓN DE GASTOS</p>
          </div>
          
          {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="fw-bold small text-muted">USUARIO (BASE DE DATOS)</label>
              <input className="form-control" placeholder="Ej: jesus" value={username} onChange={e=>setUsername(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="fw-bold small text-muted">CONTRASEÑA</label>
              <input type="password" className="form-control" placeholder="****" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary w-100 fw-bold py-2" disabled={loading}>
              {loading ? 'VALIDANDO EN BD...' : 'INICIAR SESIÓN'}
            </button>
          </form>
          <div className="mt-3 text-center">
            <small className="text-muted" style={{fontSize:'0.75rem'}}>
              Conexión: MySQL (Login) | Local (Gastos)
            </small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-dark px-4 mb-4 shadow">
        <span className="navbar-brand fw-bold">CORPORACIÓN JDCY</span>
        <div className="d-flex align-items-center gap-3">
          <div className="text-end text-white d-none d-sm-block">
            <div className="fw-bold" style={{fontSize: '0.9rem'}}>{user.username}</div>
            <div className="small opacity-75">{user.role}</div>
          </div>
          <button onClick={handleLogout} className="btn btn-sm btn-danger">Salir</button>
        </div>
      </nav>

      <div className="container pb-5">
        {isAdmin && (
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-secondary text-white fw-bold d-flex justify-content-between align-items-center">
              <span>RESUMEN GERENCIAL POR USUARIO</span>
              <span className="badge bg-light text-dark">Admin</span>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Usuario</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-end">Total Acumulado</th>
                  </tr>
                </thead>
                <tbody>
                  {resumenPorUsuario.length > 0 ? (
                    resumenPorUsuario.map((u: any, i) => (
                      <tr key={i}>
                        <td className="fw-bold text-dark">{u.nombre}</td>
                        <td className="text-center"><span className="badge bg-light text-dark border">{u.conteo}</span></td>
                        <td className="text-end fw-bold text-primary">
                          ${u.total.toLocaleString('es-CO', {minimumFractionDigits: 2})}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="text-center py-3 text-muted">No hay gastos visuales registrados aún.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white text-primary fw-bold border-bottom">
                REGISTRAR GASTO (VISUAL)
              </div>
              <div className="card-body">
                {msg && <div className="alert alert-success p-2 small text-center fw-bold">{msg}</div>}
                {error && <div className="alert alert-danger p-2 small text-center fw-bold">{error}</div>}

                <form onSubmit={handleRegistrar}>
                  <div className="mb-3">
                    <label className="small text-muted fw-bold">FECHA</label>
                    <input type="date" className="form-control" value={fecha} onChange={e=>setFecha(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="small text-muted fw-bold">VALOR TOTAL</label>
                    <input type="text" className="form-control form-control-lg" placeholder="0.00" 
                           value={valorInput} onChange={e=>setValorInput(e.target.value)} required />
                    <div className="form-text small">Use coma (,) o punto (.)</div>
                  </div>
                  <div className="mb-3">
                    <label className="small text-muted fw-bold">LUGAR</label>
                    <input type="text" className="form-control" placeholder="Establecimiento" 
                           value={lugar} onChange={e=>setLugar(e.target.value)} required />
                  </div>
                  <div className="mb-4">
                    <label className="small text-muted fw-bold">DESCRIPCIÓN</label>
                    <textarea className="form-control" rows={2} placeholder="Detalles..." 
                              value={descripcion} onChange={e=>setDescripcion(e.target.value)} required />
                  </div>
                  <button className="btn btn-primary w-100 fw-bold py-2">AGREGAR A TABLA</button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <span className="fw-bold text-dark">HISTORIAL DE GASTOS</span>
                <span className="badge bg-light text-dark border">{misGastos.length} Registros</span>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Fecha</th>
                      {isAdmin && <th>Usuario</th>}
                      <th>Lugar</th>
                      <th>Descripción</th>
                      <th className="text-end">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misGastos.length > 0 ? (
                      misGastos.map((g) => (
                        <tr key={g.id}>
                          <td>{g.fecha}</td>
                          {isAdmin && <td className="fw-bold text-primary">{g.usuario}</td>}
                          <td className="fw-bold text-dark">{g.lugar}</td>
                          <td className="text-muted small">{g.descripcion}</td>
                          <td className="text-end fw-bold fs-6">
                            ${g.valor.toLocaleString('es-CO', {minimumFractionDigits: 2})}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-5 text-muted">
                          No hay gastos en la lista visual.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {misGastos.length > 0 && (
                    <tfoot className="table-light border-top">
                      <tr>
                        <td colSpan={isAdmin ? 4 : 3} className="text-end fw-bold text-uppercase">Total:</td>
                        <td className="text-end fw-bold text-success fs-5">
                          ${totalAcumulado.toLocaleString('es-CO', {minimumFractionDigits: 2})}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
function App() {
    const [role, setRole] = useState(null); 
  
    if (role === null) {
      return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1>Selecciona El inicio a mostrar</h1>
          <button onClick={() => setRole('admin')}>Inicio Admin</button>
          <button onClick={() => setRole('colaborador')}>Inicio Colaborador</button>
        </div>
      );
    }
  
  
    return (
      <div>
        {role === 'admin' ? <InicioAdmin /> : <InicioColaborador />}
      </div>
    );
  }
  
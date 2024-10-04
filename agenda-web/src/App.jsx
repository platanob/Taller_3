import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/login.jsx'

function App() {
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      setLoading(false);
    }, []);
  
    if (loading) {
      return <p>Loading...</p>;
    }
    return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </BrowserRouter>
    );
  }
  export default App;
  
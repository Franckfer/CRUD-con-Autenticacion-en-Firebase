import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './components/Admin';
import Inicio from './components/Inicio';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { auth } from './firebase/firebaseConfig'
import { Spinner } from 'reactstrap'



function App() {

  const [firebaseUser, setFirebaseUser] = useState(false)

  useEffect(() => {

    auth.onAuthStateChanged(user => {
      console.log(user);
      if(user) {
        setFirebaseUser(user)
      } else {
        setFirebaseUser(null)
      }

    })
  }, [])

  return firebaseUser !== false ? (
    <Router>
      <div className="container mt-3">
        <Navbar firebaseUser={firebaseUser} />
        <Routes>

          <Route path="/" element={ <Inicio /> } />
          <Route path="/login" element={ <Login /> } />
          <Route path="/admin" element={ <Admin /> } />
          <Route path="*" element={ <h2>Ruta no encontrada</h2> } />
          
        </Routes>

      </div>
    </Router>
  ) : (
    <div className="container text-center mt-4">
      <h2>Cargando...</h2>
      <div>
      <Spinner color='info' children={false} />
      </div>
    </div>
  );
}

export default App;

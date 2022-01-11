import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { auth } from '../firebase/firebaseConfig'



const Navbar = ({ firebaseUser }) => {

    const navigate = useNavigate()

    const cerrarSesion = () => {
        auth.signOut()
            .then(() => {
                navigate("/login")
            })
    }

    return (
        <div className='navbar navbar-dark bg-dark'>
            <Link className='navbar-brand' to="/" >AUTH</Link>
            <div>
                <div className="d-flex">

                    <NavLink className="btn btn-dark mr-2" to="/">
                        Inicio
                    </NavLink>

                    {
                        firebaseUser !== null ? (
                            <NavLink className="btn btn-dark mr-2" to="/admin">
                                Admin
                            </NavLink>
                        ) : (
                            null
                        )
                    }
                    
                    {
                        firebaseUser !== null ? (
                            <button 
                                className="btn btn-dark"
                                onClick={() => cerrarSesion()}
                            >
                                Cerrar Sesión
                            </button>
                        ) : (

                            <NavLink className="btn btn-dark mr-2" to="/Login">
                                Login
                            </NavLink>
                        )
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default Navbar

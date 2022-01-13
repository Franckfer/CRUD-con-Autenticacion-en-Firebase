import React from 'react'
import { auth } from '../firebase/firebaseConfig'
import { useState, useEffect } from 'react'



const Inicio = () => {

    const [user, setUser] = useState(null)

    useEffect(() => {
        if(auth.currentUser) {
            setUser(auth.currentUser)
        } 
    }, [])

    return (
        <div>
            {
                // user && (
                //     <h2>Bienvenido {user.email}</h2>
                // )
                user ? (
                    <h2>Bienvenid@ {user.email}</h2>
                    ) : (
                    <h3>Inicia Sesión o Registrate para ver las tareas</h3>
                )
            }
        </div>
    )
}

export default Inicio

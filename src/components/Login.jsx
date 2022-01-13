import React, { useState, useCallback } from 'react';
import { auth, db } from '../firebase/firebaseConfig'
import { useNavigate } from 'react-router-dom'


const Login = () => {

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState(null);
    const [isRegister, setIsRegister] = useState(false)

    const navigate = useNavigate()

    const procesarDatos = e => {
        e.preventDefault()

        if(!email.trim()) {
            console.log("Ingrese un Email");
            setError("Ingrese un Email")
            return
        }
        if(!pass.trim()) {
            console.log("Ingrese Password");
            setError("Ingrese su Password")
            return
        }
        if(pass.length < 6) {
            console.log("Ingrese Password mayor a 6 caracteres");
            setError("Ingrese un Password mayor a 6 Caracteres")
            return
        }

        setError(null)

        if(isRegister) {
            register()
        } else {
            login()
        }
    }

    const register = useCallback(async () => {

        try {
            /* Creamos la autenticacion de un usuario relacionado con una base de datos en firestore */
            const res = await auth.createUserWithEmailAndPassword(email, pass)
            await db.collection('users').doc(res.user.uid).set({
                email: res.user.email,
                uid: res.user.uid
            })
            await db.collection(res.user.uid).add({
                name:'ejemplo',
                fecha:Date.now()
            })

            console.log(res);
            setEmail('')
            setPass('')
            setError(null)

            navigate("/")

        } catch (error) {
            console.log(error);
            if(error.code === 'auth/invalid-email') {
                setError("Email no válido")
            }
            if(error.code === 'auth/email-already-in-use') {
                setError("El email ya existe")
            }
        }
        
    }, [email, pass])


    const login = useCallback(async () => {

        try {
            await auth.signInWithEmailAndPassword(email, pass)
            setEmail('')
            setPass('')
            setError(null)

            navigate("/admin", /* { replace: true } */)

        } catch (error) {
            console.log(error);
            if(error.code === 'auth/invalid-email') {
                setError("Email no válido")
            }
            if(error.code === 'auth/user-not-found') {
                setError("Usuario no encontrado o registrado")
            }
            if(error.code === 'auth/wrong-password') {
                setError("La contraseña es incorrecta")
            }
        }    

    },[email, pass])
        
 
    return (
        <div className='mt-5'>

            <h3 className='text-center'>
                {
                    isRegister ? "Registro de usuarios" : "Login de acceso"
                }
            </h3>
            <hr />
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md6 col-xl-4">
                    <form onSubmit={procesarDatos}>
                        {
                        /* Si existe un error lo pintamos sino sigue con su valor inicial que es null */
                            error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )
                        }
                        <input 
                            type="email" 
                            className='form-control mb-2' 
                            placeholder='Ingrese un email' 
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                        />
                        <input 
                            type="password" 
                            className='form-control' 
                            placeholder='Ingrese su password' 
                            onChange={e => setPass(e.target.value)}
                            value={pass}

                        />
                        <button 
                            className="btn btn-dark btn-lg btn-block mt-2"
                            type='submit'
                        >
                            {
                                isRegister ? "Registarse" : "Iniciar Sesion"
                            }
                        </button>
                        <button 
                            className="btn btn-info btn-sm btn-block mt-2"
                            onClick={() => setIsRegister(!isRegister)}
                            type='button'
                        >
                            {
                                isRegister ? "Ya tengo una Cuenta" : "Crear Cuenta"
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login

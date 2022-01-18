import React, {useState, useCallback} from 'react';
import {auth} from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Reset = () => {

    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const procesarDatos = e => {
        e.preventDefault()

        if(!email.trim()) {
            setError("Ingrese un Email")
            return
        }

        setError(null)
        recoveryPass()
    }

    const recoveryPass = useCallback(async () => {

        try {
            await auth.sendPasswordResetEmail(email)
            console.log("correo enviado");

            navigate('/login')
            setError(null)

        } catch (error) {
            console.log(error);
            if(error.code === 'auth/invalid-email') {
                setError("Email no válido")
            }
            if(error.code === 'auth/user-not-found') {
                setError("Usuario o email no registrado")
            }
        }

    }, [email, navigate])


    return (
        <div className='mt-5'>

            <h3 className='text-center'>
                Reiniciar contraseña
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

                        <button 
                            className="btn btn-success btn-lg btn-block mt-2"
                            type='submit'
                        >
                           Reinicia la contraseña
                        </button>
    
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Reset

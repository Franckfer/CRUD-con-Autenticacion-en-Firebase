import React, { useState, useEffect } from 'react';
import {db} from '../firebase/firebaseConfig'
import moment from 'moment'
import 'moment/locale/es'

const Crud = ({user}) => {

  const [addTareas, setAddTareas] = useState([])
  const [tarea, setTarea] = useState('')
  const [modoEdicion, setModoEdicion] = useState(false)
  const [id, setId] = useState('')
  const [ultimaTarea, setUltimaTarea] = useState(null)
  const [desactivar, setDesactivar] = useState(false)


  useEffect(() => {

    const obtenerDatos = async () => {

      try {
        setDesactivar(true)

        const data = await db.collection(user.uid)
          .limit(5)
          .orderBy('fecha')
          .get()

        const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        console.log(arrayData)
        setAddTareas(arrayData)

        setUltimaTarea(data.docs[data.docs.length - 1])

        const query = await db.collection(user.uid)
          .limit(5)
          .orderBy('fecha')
          .startAfter(data.docs[data.docs.length - 1])
          .get()
        if(query.empty) {
          console.log("no hay mas documentos");
          setDesactivar(true)
        } else {
          setDesactivar(false)
        }
        
      } catch (error) {
        console.log(error)
      }

    }

    obtenerDatos()

  }, [])

  const agregar = async (e) => {
    e.preventDefault()

    if(!tarea.trim()){
      console.log('está vacio')
      return
    }

    try {

      const nuevaTarea = {
        name: tarea,
        fecha: Date.now()
      }
      const data = await db.collection(user.uid).add(nuevaTarea)

      setAddTareas([
        ...addTareas,
        {...nuevaTarea, id: data.id}
      ])

      setTarea('')
      
    } catch (error) {
      console.log(error)
    }

    console.log(tarea)
  }

  const eliminar = async (id) => {
    try {
      
      await db.collection(user.uid).doc(id).delete()

      const arrayFiltrado = addTareas.filter(item => item.id !== id)
      setAddTareas(arrayFiltrado)

    } catch (error) {
      console.log(error)
    }
  }

  const activarEdicion = (item) => {
    setModoEdicion(true)
    setTarea(item.name)
    setId(item.id)
  }

  const editar = async (e) => {
    e.preventDefault()
    if(!tarea.trim()){
      console.log('vacio')
      return
    }
    try {
      
      await db.collection(user.uid).doc(id).update({
        name: tarea
      })
      const arrayEditado = addTareas.map(item => (
        item.id === id ? {id: item.id, fecha: item.fecha, name: tarea} : item
      ))
      setAddTareas(arrayEditado)
      setModoEdicion(false)
      setTarea('')
      setId('')
    } catch (error) {
      console.log(error)
    }
  }

  /* paginacion */
  const siguientePag = async() => {
    setDesactivar(true)
    try {
      const data = await db.collection(user.uid)
          .limit(5)
          .orderBy('fecha')
          .startAfter(ultimaTarea)
          .get()

      const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setAddTareas([
        ...addTareas,
        ...arrayData
      ])
       
      setUltimaTarea(data.docs[data.docs.length - 1])

      const query = await db.collection(user.uid)
          .limit(5)
          .orderBy('fecha')
          .startAfter(data.docs[data.docs.length - 1])
          .get()
        if(query.empty) {
          console.log("no hay mas documentos");
          setDesactivar(true)
        } else {
          setDesactivar(false)
        }

    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <h3>Lista de Tareas</h3>
          <ul className="list-group">
            {
              addTareas.length === 0 ? (
                <li className="list-group-item">No hay tareas</li>
              ) : (
              addTareas.map(item => (
                  <li className="list-group-item" key={item.id}>
                    {item.name} - {moment(item.fecha).format('LLL')}
                    <button 
                      className="btn btn-danger btn-sm float-right"
                      onClick={() => eliminar(item.id)}
                    >
                      Eliminar
                    </button>
                    <button 
                      className="btn btn-info btn-sm float-right mr-2"
                      onClick={() => activarEdicion(item)}
                    >
                      Editar
                    </button>
                  </li>
                ))
              )
            }
          </ul>

          <button 
            className="btn btn-info btn-block mt-2 btn-sm"
            onClick={() => siguientePag()}
            disabled={desactivar}
          >
            Siguiente...
          </button>

        </div>
        <div className="col-md-6">
          <h3>
            {
              modoEdicion ? 'Editar Tarea' : 'Agregar Tarea'
            }
          </h3>
          <form onSubmit={modoEdicion ? editar : agregar}>
            <input 
              type="text"
              placeholder="Ingrese tarea"
              className="form-control mb-2"
              onChange={e => setTarea(e.target.value)}
              value={tarea}
            />
            <button 
              className={
                modoEdicion ? 'btn btn-info btn-block' : 'btn btn-dark btn-block'
              }
              type="submit"
            >
              {
                modoEdicion ? 'Editar' : 'Agregar'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Crud;


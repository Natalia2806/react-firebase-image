import { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { nanoid } from 'nanoid'
import { firebase } from '../firebase'

const Form = () => {
    const [data, setData] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false)

    const [name, setName] = useState('');
    const [apellido, setApellido] = useState('');
    const [edad, setEdad] = useState(0);
    const [correo, setCorreo] = useState('');
    const [idn, setIdn] = useState('');
    const [tel, setTel] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [id, setId] = useState(0);
    const [imagen, setImagen] = useState("");

    const [error, setError] = useState(null)

    const [modalInsertar, setModalInsertar] = useState(false);

    //Metodos
    const openModalCreate = () => {
        setModalInsertar(true);
        setError(null);
    }

    function validar_email(email) {
        var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        return regex.test(email) ? true : false;
    }
//Metodo para obtener imagenes
    const obtenerImagen = async () => {
        try {
            const res = await fetch("https://picsum.photos/200");
            const data = await res;
            setImagen(data.url)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const db = firebase.firestore()
                const data = await db.collection('user').get()
                const array = data.docs.map(item => (
                    {
                        id: item.id, ...item.data()
                    }
                ))
                setData(array)

            } catch (error) {
                console.log(error)
            }
        }
        obtenerDatos()
    })

    const add = async () => {
        if (!name.trim()) {
            setError('El nombre es requerido!')
            return
        }

        if (!apellido.trim()) {
            setError('El apellido es requerido!')
            return
        }
        if (edad < 0) {
            setError('La edad no puede ser negativa')
            return
        }
        if (edad === 0) {
            setError('La edad es requerida')
            return
        }
        if (!idn.trim()) {
            setError('Numero de identificación requerido!')
            return
        }
        if (!tel.trim()) {
            setError('Número de telefono requerido!')
            return
        }
        if (!validar_email(correo)) {
            setError('Por favor ingrese un correo valido!')
            return
        }
        if (!correo.trim()) {
            setError('Correo requerido!')
            return
        }
        if (!ciudad.trim()) {
            setError('Nombre de la ciudad requerido')
            return
        }

        try {
            obtenerImagen();
            const db = firebase.firestore()
            const newUser = {
                nombre: name,
                apellido: apellido,
                edad: edad,
                idn: idn,
                correo: correo,
                tel: tel,
                ciudad: ciudad,
                imagen: imagen
            }
            await db.collection('user').add(newUser)
            setData([...data, {
                id: nanoid(),
                nombre: name,
                apellido: apellido,
                edad: edad,
                idn: idn,
                correo: correo,
                tel: tel,
                ciudad: ciudad,
                imagen: imagen
            }])

        } catch (error) {
            console.log(error)
        }
        setModalInsertar(false)
        setName("")
        setApellido("")
        setEdad(0)
        setCorreo("")
        setIdn("")
        setTel("")
        setCiudad("")
        setError(null)
    }

    const auxEditar = (item) => {
        setId(item.id)
        setName(item.nombre)
        setApellido(item.apellido)
        setEdad(item.edad)
        setCorreo(item.correo)
        setIdn(item.idn)
        setTel(item.tel)
        setCiudad(item.ciudad)
        setModoEdicion(true)
        openModalCreate()

    }

    const editar = async () => {
        try {
            const db = firebase.firestore()
            await db.collection('user').doc(id).update({
                nombre: name,
                apellido: apellido,
                edad: edad,
                idn: idn,
                correo: correo,
                tel: tel,
                ciudad: ciudad
            })

        } catch (error) {
            console.log(error)
        }
        setModoEdicion(false)
        setModalInsertar(false)
        setName("")
        setApellido("")
        setEdad(0)
        setCorreo("")
        setIdn("")
        setTel("")
        setCiudad("")
    }

    const eliminar = async (id) => {
        try {
            const db = firebase.firestore()
            await db.collection('user').doc(id).delete()
            const aux = data.filter(item => item.id !== id)
            setData(aux)
        } catch (error) {
            console.log(error)
        }
    }

    const cancelar = async () => {
        setModalInsertar(false)
        setModoEdicion(false)
        setName("")
        setApellido("")
        setEdad(0)
        setCorreo("")
        setIdn("")
        setTel("")
        setCiudad("")
        setError(null)
    }

    return (
        <div className="container mt-5">
            <h1 className='text-center'>REGISTRO DE USUARIOS</h1>
            <hr />
            <button className="btn btn-success" onClick={() => openModalCreate()}>CREAR</button>
            <br /><br />
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Edad</th>
                        <th>N° ID</th>
                        <th>Télefono</th>
                        <th>Correo</th>
                        <th>Ciudad</th>
                        <th>Imagen</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(elemento => (
                    
                        <tr>
                            <td>{elemento.nombre}</td>
                            <td>{elemento.apellido}</td>
                            <td>{elemento.edad}</td>
                            <td>{elemento.idn}</td>
                            <td>{elemento.tel}</td>
                            <td>{elemento.correo}</td>
                            <td>{elemento.ciudad}</td>
                            <td><img src={elemento.imagen} alt="imagen aleatoria" /></td>
                            <td><button className="btn btn-warning" onClick={() => auxEditar(elemento)}>Editar</button></td>
                            <td><button className="btn btn-danger" onClick={() => eliminar(elemento.id)}>Eliminar</button></td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>

            <Modal isOpen={modalInsertar}>
                <ModalHeader>
                    <div>
                        <h3>Crear Usuario</h3>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        {error ? <div class="alert alert-danger" role="alert">{error}</div> : null}
                        <div className="row">
                            <div className="col-5">
                                <label>Nombre</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="nombre"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="col-5">
                                <label>Apellido</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="Apellido"
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                />
                            </div>
                            <div className="col-2">
                                <label>Edad</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="Edad"
                                    value={edad}
                                    onChange={(e) => setEdad(e.target.value)}
                                />
                            </div>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-6">
                                <label>Identificación</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="id"
                                    value={idn}
                                    onChange={(e) => setIdn(e.target.value)}
                                />
                            </div>
                            <div className="col-6">
                                <label>Telefóno</label>
                                <br />
                                <input
                                    className="form-control"
                                    type="text"
                                    name="tel"
                                    value={tel}
                                    onChange={(e) => setTel(e.target.value)}
                                />
                            </div>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-6">
                                <label>Correo</label>
                                <input
                                    className="form-control"
                                    type="email"
                                    name="correo"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                />
                            </div>
                            <div className="col-6">
                                <label>Ciudad</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="tel"
                                    value={ciudad}
                                    onChange={(e) => setCiudad(e.target.value)}
                                />
                            </div>
                        </div>

                    </div>
                </ModalBody>
                <ModalFooter>
                    {
                        modoEdicion ? (
                            <button className="btn btn-warning"
                                onClick={() => editar()}
                            > Editar </button>
                        )
                            :
                            (
                                <button className="btn btn-primary"
                                    onClick={() => add()}
                                > Crear </button>
                            )
                    }
                    <button
                        className="btn btn-danger"
                        onClick={() => cancelar()}
                    >
                        Cancelar
                    </button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default Form

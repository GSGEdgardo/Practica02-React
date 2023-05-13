import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.css';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from './functions';
import Modal from 'bootstrap/js/dist/modal';

const ShowForms = () => {
    const url = 'http://20.231.202.18:8000/api/form';
    const [forms, setForms] = useState([]);
    const [id, setId] = useState([]);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [deleted_at, setDeleted_at] = useState(null);
    const [created_at, setCreated_at] = useState('');
    const [updated_at, setUpdated_at] = useState('');
    const [status, setStatus] = useState(null);
    const [components, setComponents] = useState(null);
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');

    useEffect(() => {
        getForms();
    }, []);

    const getForms = async () => {
        const respuesta = await axios.get(url);
        setForms(respuesta.data);
    }

    const openModal = (op, id, code, name, description, deleted_at, created_at, updated_at, status, components) => {
        setCode('');
        setName('');
        setDescription('');
        setDeleted_at(null);
        setCreated_at('');
        setUpdated_at('');
        setStatus(null);
        setComponents(null);
        setOperation(op);

        if (op === 1) {
            setTitle('Registrar Producto');
        } else if (op === 2) {
            setTitle('Editar Producto');
            setCode(code);
            setName(name);
            setDescription(description);
            setDeleted_at(deleted_at);
            setCreated_at(created_at);
            setUpdated_at(updated_at);
            setStatus(status);
            setComponents(components);
        }
        window.setTimeout(function () {
            document.getElementById('nombre').focus();
        }, 500);
    }

    const validar = () => {
        var parametros;
        var metodo;
        if (name.trim() === '') {
            show_alerta('Ingrese el campo nombre', 'warning');
        } else if (code.trim() === '') {
            show_alerta('Ingrese el campo codigo', 'warning');
        } else if (description.trim() === '') {
            show_alerta('Ingrese el campo descripcion', 'warning');
        } else if (created_at.trim() === '') {
            show_alerta('Ingrese la fecha de creacion', 'warning');
        } else if (updated_at.trim() === '') {
            show_alerta('Ingrese la fecha de actualizacion', 'warning');
        } else {
            if (operation === 1) {
                parametros = { code: code.trim(), name: name.trim(), description: description.trim(), deleted_at: deleted_at?.trim(), created_at: created_at.trim(), updated_at: updated_at.trim(), status: status?.trim(), components: components };
                metodo = 'POST';
            } else {
                parametros = { id: id, code: code.trim(), name: name.trim(), description: description.trim(), deleted_at: deleted_at?.trim(), created_at: created_at.trim(), updated_at: updated_at.trim(), status: status?.trim(), components: components };
                metodo = 'PUT';
            }
            enviarSolicitud(metodo, parametros);
        }
    }
    const enviarSolicitud = async (metodo, parametros) => {
        await axios({ method:metodo,url:url,data:parametros}).then(function(respuesta){
            var tipo = respuesta.data[0];
            var msj = respuesta.data[1];
            show_alerta(msj,tipo);
            if(tipo === 'success'){
                document.getElementById('btnCerrar').click();
                getForms();
            }
        })
        .catch(function(error){
            show_alerta('Error en la solicitud','error');
            console.log(error);
        })
    }

    const deleteForm = (id,name) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title:'Seguro que quieres eliminar el formulario '+name+'?',
            icon:'question',text:'No se podrá dar marcha atrás',
            showCancelButton:true,confirmButtonText:'Si, eliminar', cancelButtonText:'Cancelar'
        }).then((result)=>{
            if(result.isConfirmed){
                setId(id);
                enviarSolicitud('DELETE',{id:id});
            }else{
                show_alerta('El formulario no fue eliminado','info');
            }
        })
    }

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col md-4 offset-4'>
                        <div className='d-grid mx auto'>
                            <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' style={{marginRight: '450px'}} data-bs-target='#modalProducts'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr><th>id</th><th>code</th><th>name</th><th>description</th>
                                    <th>deleted_at</th><th>created_at</th><th>updated_at</th><th>status</th><th>components</th></tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {forms.map((form, i) => (
                                    <tr key={form.id}>
                                        <td>{(i + 1)}</td>
                                        <td>{(form.code)}</td>
                                        <td>{(form.name)}</td>
                                        <td>{(form.description)}</td>
                                        <td>{(form.deleted_at)}</td>
                                        <td>{(form.created_at)}</td>
                                        <td>{(form.updated_at)}</td>
                                        <td>{(form.status)}</td>
                                        <td>{(form.components)}</td>
                                        <td>
                                            <button onClick={() => openModal(2, form.id, form.code, form.name, form.description, form.deleted_at, form.created_at, form.updated_at, form.status, form.components)}
                                                className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalForms'>
                                                <i className='fa-solid fa-edit'></i>
                                            </button>
                                            &nbsp;
                                            <button onClick={() =>deleteForm(form.id,form.name)} className='btn btn-danger'>
                                                <i className='fa-solid fa-trash'></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div id='modalForms' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{name}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='code' className='form-control' placeholder='Code' value={code}
                                    onChange={(e) => setCode(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={name}
                                    onChange={(e) => setName(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='description' className='form-control' placeholder='description' value={description}
                                    onChange={(e) => setDescription(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='deleted_at' className='form-control' placeholder='deleted_at' value={deleted_at}
                                    onChange={(e) => setDeleted_at(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='created_at' className='form-control' placeholder='created_at' value={created_at}
                                    onChange={(e) => setCreated_at(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='updated_at' className='form-control' placeholder='updated_at' value={updated_at}
                                    onChange={(e) => setUpdated_at(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='status' className='form-control' placeholder='status' value={status}
                                    onChange={(e) => setStatus(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='components' className='form-control' placeholder='components' value={components}
                                    onChange={(e) => setComponents(e.target.value)}></input>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={() => validar()} className='btn btn-succes'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowForms

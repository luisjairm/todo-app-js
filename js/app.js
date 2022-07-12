// Variables
const formulario = document.querySelector('#formulario');
const listGroup = document.querySelector('#list-group');

let tareas = [];
let tareasTerminadas = [];

// eventos
eventListener();
function eventListener() {
    // validacion formulario
    formulario.addEventListener('submit', validarFormulario);

    // cargar la lista cuando el html este listo
    document.addEventListener('DOMContentLoaded', () => {
        tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        crearHTML();
    });
}

function validarFormulario(e) {
    e.preventDefault();

    const tarea = document.querySelector('#tarea').value;
    // verificar que la tarea contenga algo
    if (tarea === '') {
        mensajeError('! Tiene que escribir algo');
        return;
    }

    const tareaObj = {
        id: Date.now(),
        tarea,
    };

    // guardando la tarea
    tareas = [...tareas, tareaObj];

    crearHTML();

    formulario.reset();
}
// agregando tarea al listgroup
function crearHTML() {
    limpiarHTML();

    if (tareas.length > 0) {
        tareas.forEach((tarea) => {
            // crear boton eliminar
            const boton = document.createElement('button');
            boton.classList.add('btn', 'btn-outline-danger', 'text-dark');

            boton.textContent = 'X';
            boton.onclick = () => {
                eliminarTarea(tarea.id);
            };

            // crear elemento strong
            const strong = document.createElement('strong');
            strong.textContent = tarea.tarea;

            // crear elemento li
            const li = document.createElement('li');
            li.classList.add(
                'list-group-item',
                'd-flex',
                'justify-content-between'
            );

            // agrega los elemento al li y a la lista de tareas
            li.appendChild(strong);
            li.appendChild(boton);
            listGroup.appendChild(li);
        });
    }

    sincronizarStorage();
}

function sincronizarStorage() {
    // agrega las tareas al local storage
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

// elimina una tarea
function eliminarTarea(id) {
    tareas = tareas.filter((tarea) => tarea.id !== id);
    crearHTML();
}

// mensaje de error
function mensajeError(msjError) {
    // creando elemento error
    const div = document.createElement('div');
    div.classList.add('alert', 'alert-danger');
    div.textContent = msjError;

    // agregando el error al html
    formulario.appendChild(div);

    // Elimina el error despues de 3 minutos
    setTimeout(() => {
        div.remove();
    }, 3000);
}

// limipa las lista para que no se dupliquen
function limpiarHTML() {
    while (listGroup.firstChild) {
        listGroup.removeChild(listGroup.firstChild);
    }
}

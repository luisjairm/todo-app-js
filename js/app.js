// Variables
const formulario = document.querySelector('#formulario');
const listGroup = document.querySelector('#list-group');
const listGroupTerminadas = document.querySelector('#list-group-terminadas');

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
        tareasTerminadas =
            JSON.parse(localStorage.getItem('tareasTerminadas')) || [];
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
    limpiarHTML(listGroup);
    limpiarHTML(listGroupTerminadas);

    // crea Html de tareas pendientes
    if (tareas.length > 0) {
        tareas.forEach((tarea) => {
            // crear boton completar
            const btnCompletar = document.createElement('button');
            btnCompletar.classList.add(
                'btn',
                'btn-outline-success',
                'text-green',
                'd-flex',
                'justify-content-center',
                'align-items-center'
            );
            btnCompletar.innerHTML =
                '<ion-icon name="checkmark-done"></ion-icon>';
            btnCompletar.onclick = () => {
                completarTarea(tarea.id);
            };

            // crear elemento strong que contiene el nombre de la tarea
            const strong = document.createElement('strong');
            strong.classList.add('d-flex', 'align-items-center');
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
            li.appendChild(btnCompletar);
            listGroup.appendChild(li);
        });
    }

    // crea html de tareas terminadas
    if (tareasTerminadas.length > 0) {
        tareasTerminadas.forEach((tarea) => {
            // crear boton eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add(
                'btn',
                'btn-outline-danger',
                'text-red',
                'd-flex',
                'justify-content-center',
                'align-items-center'
            );
            btnEliminar.innerHTML = '<ion-icon name="trash"></ion-icon>';
            btnEliminar.onclick = () => {
                eliminarTarea(tarea.id);
            };

            // crear elemento span que contiene el nombre de la tarea
            const span = document.createElement('span');
            span.classList.add(
                'd-flex',
                'align-items-center',
                'text-decoration-line-through'
            );
            span.textContent = tarea.tarea;

            // crear elemento li
            const li = document.createElement('li');
            li.classList.add(
                'list-group-item',
                'd-flex',
                'justify-content-between'
            );

            // agrega los elemento al li y a la lista de tareas
            li.appendChild(span);
            li.appendChild(btnEliminar);
            listGroupTerminadas.appendChild(li);
        });
    }

    sincronizarStorage();
}

// Sincroniza las tareas al localStorage
function sincronizarStorage() {
    // agrega las tareas al local storage
    localStorage.setItem('tareas', JSON.stringify(tareas));
    localStorage.setItem('tareasTerminadas', JSON.stringify(tareasTerminadas));
}

// marca una tarea como completada
function completarTarea(id) {
    let tareasPendientes = tareas.filter((tarea) => tarea.id !== id);
    let tareasTer = tareas.filter((tarea) => tarea.id === id);

    tareas = tareasPendientes;
    tareasTerminadas = tareasTerminadas.concat(tareasTer);
    crearHTML();
}

// Eliminar las tareas
function eliminarTarea(id) {
    tareasTerminadas = tareasTerminadas.filter((tarea) => tarea.id !== id);
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
function limpiarHTML(list) {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

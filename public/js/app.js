let estudiantes = [];

document.addEventListener('DOMContentLoaded', function () {
    // Agregar estudiantes
    document.getElementById('studentForm').addEventListener('submit', function (e) {
        e.preventDefault();
        agregarEstudiante();
    });

    // Reporte
    document.getElementById('btnReporte').addEventListener('click', generarReporte);

    // Limpiar
    document.getElementById('btnLimpiar').addEventListener('click', limpiarLista);
});

function agregarEstudiante() {
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const edad = parseInt(document.getElementById('edad').value);
    const nota = parseFloat(document.getElementById('nota').value);

    // Validaciones con if
    if (!nombre) {
        mostrarError('nombreError', 'El nombre es obligatorio');
        return;
    } else {
        ocultarError('nombreError');
    }

    if (!edad || edad < 15 || edad > 60) {
        mostrarError('edadError', 'Edad entre 15-60 años');
        return;
    } else {
        ocultarError('edadError');
    }

    if (!nota || nota < 0 || nota > 20) {
        mostrarError('notaError', 'Nota entre 0-20');
        return;
    } else {
        ocultarError('notaError');
    }

    // Determinar estado con if-else
    let estado;
    if (nota >= 14) {
        estado = 'Aprobado';
    } else if (nota >= 10) {
        estado = 'Regular';
    } else {
        estado = 'Reprobado';
    }

    // Crear estudiante
    const estudiante = {
        id: Date.now(),
        nombre: nombre,
        edad: edad,
        nota: nota,
        estado: estado
    };

    // Agregar al array
    estudiantes.push(estudiante);

    // Actualizar la vista
    actualizarTabla();
    actualizarEstadisticas();
    limpiarFormulario();

    // Mensaje de éxito
    Swal.fire('Exito', 'Estudiante agregado correctamente', 'success');
}

function actualizarTabla() {
    const tbody = document.getElementById('studentsTable');

    if (estudiantes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay estudiantes</td></tr>';
        return;
    }

    let html = '';

    // Usar ciclo for para la tabla
    for (let i = 0; i < estudiantes.length; i++) {
        const est = estudiantes[i];
        const claseFila = est.nota >= 14 ? 'approved' : est.nota >= 10 ? '' : 'failed';

        html += `
            <tr class="${claseFila}">
                <td>${i + 1}</td>
                <td>${est.nombre}</td>
                <td>${est.edad}</td>
                <td>${est.nota.toFixed(1)}</td>
                <td>
                    <span class="badge ${obtenerColorEstado(est.estado)}">
                        ${est.estado}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarEstudiante(${est.id})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    }

    tbody.innerHTML = html;
}

function obtenerColorEstado(estado) {
    // Usar if para colores
    if (estado === 'Aprobado') {
        return 'bg-success';
    } else if (estado === 'Regular') {
        return 'bg-warning';
    } else {
        return 'bg-danger';
    }
}

function actualizarEstadisticas() {
    if (estudiantes.length === 0) {
        // Resetear estadísticas
        document.getElementById('totalEstudiantes').textContent = '0';
        document.getElementById('promedioNotas').textContent = '0.00';
        document.getElementById('totalAprobados').textContent = '0';
        document.getElementById('totalReprobados').textContent = '0';
        document.getElementById('contadorEstudiantes').textContent = '0 estudiantes';
        return;
    }

    let totalNotas = 0;
    let aprobados = 0;
    let reprobados = 0;

    // Usar ciclo while para calcular
    let i = 0;
    while (i < estudiantes.length) {
        const est = estudiantes[i];
        totalNotas += est.nota;

        // Contar aprobados/reprobados con if
        if (est.nota >= 14) {
            aprobados++;
        } else if (est.nota < 10) {
            reprobados++;
        }

        i++;
    }

    const promedio = totalNotas / estudiantes.length;

    // Actualizar la página
    document.getElementById('totalEstudiantes').textContent = estudiantes.length;
    document.getElementById('promedioNotas').textContent = promedio.toFixed(2);
    document.getElementById('totalAprobados').textContent = aprobados;
    document.getElementById('totalReprobados').textContent = reprobados;
    document.getElementById('contadorEstudiantes').textContent = estudiantes.length + ' estudiantes';
}

function generarReporte() {
    if (estudiantes.length === 0) {
        Swal.fire('Error', 'No hay estudiantes para generar reporte', 'error');
        return;
    }

    const promedio = parseFloat(document.getElementById('promedioNotas').textContent);
    const alertDiv = document.getElementById('reporteAlert');

    // Usar if-else if para el reporte
    if (promedio >= 14) {
        alertDiv.className = 'alert alert-success';
        alertDiv.innerHTML = '<strong>Buen Rendimiento</strong><br>Promedio: ' + promedio.toFixed(2);
    } else if (promedio >= 10) {
        alertDiv.className = 'alert alert-warning';
        alertDiv.innerHTML = '<strong>Rendimiento Regular</strong><br>Promedio: ' + promedio.toFixed(2);
    } else {
        alertDiv.className = 'alert alert-danger';
        alertDiv.innerHTML = '<strong>Rendimiento Bajo</strong><br>Promedio: ' + promedio.toFixed(2);
    }

    alertDiv.style.display = 'block';

    // Usar do-while para estudiantes con baja nota
    let j = 0;
    let bajasNotas = [];
    do {
        if (estudiantes[j].nota < 10) {
            bajasNotas.push(estudiantes[j].nombre);
        }
        j++;
    } while (j < estudiantes.length);

    if (bajasNotas.length > 0) {
        alertDiv.innerHTML += '<br><small>Estudiantes con nota < 10: ' + bajasNotas.join(', ') + '</small>';
    }
}

function eliminarEstudiante(id) {
    // Buscar estudiante con for
    for (let i = 0; i < estudiantes.length; i++) {
        if (estudiantes[i].id === id) {
            estudiantes.splice(i, 1);
            break;
        }
    }

    actualizarTabla();
    actualizarEstadisticas();
    Swal.fire('Exito', 'Estudiante eliminado', 'success');
}

function limpiarLista() {
    if (estudiantes.length === 0) {
        Swal.fire('Advertencia', 'La lista ya está vacía', 'warning');
        return;
    }

    if (confirm('¿Borrar todos los estudiantes?')) {
        estudiantes = [];
        actualizarTabla();
        actualizarEstadisticas();
        Swal.fire('Exito', 'Lista limpiada', 'success');
    }
}

function limpiarFormulario() {
    document.getElementById('studentForm').reset();
    ocultarError('nombreError');
    ocultarError('edadError');
    ocultarError('notaError');
}

function mostrarError(elementoId, mensaje) {
    const elemento = document.getElementById(elementoId);
    elemento.textContent = mensaje;
    elemento.style.display = 'block';
}

function ocultarError(elementoId) {
    const elemento = document.getElementById(elementoId);
    elemento.style.display = 'none';
}
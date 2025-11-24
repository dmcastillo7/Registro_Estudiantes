let estudiantes = [];

document.addEventListener('DOMContentLoaded', function() {
    // Agregar estudiantes
    document.getElementById('studentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        agregarEstudiante();
    });

});

function agregarEstudiante() {
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const edad = parseInt(document.getElementById('edad').value);
    const nota = parseFloat(document.getElementById('nota').value);

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
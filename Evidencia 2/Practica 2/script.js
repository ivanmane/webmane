const contenedor = document.getElementById('contenedor');
const tabla = document.getElementById('tabla_3x3');

function generar_tabla() {
    while (tabla.firstChild) {
        tabla.removeChild(tabla.firstChild);
    }
    let numero = 1;
    for (let i = 0; i < 3; i++) {
        const fila = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            const celda = document.createElement('td');
            celda.textContent = numero;
            numero++;
            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }
}

function borrar_tabla() {
    while (tabla.firstChild) {
        tabla.removeChild(tabla.firstChild);
    }
}
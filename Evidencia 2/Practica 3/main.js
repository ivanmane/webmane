const TOTAL_POKEMON = 1010;

document.addEventListener('DOMContentLoaded', function() {
    
    mostrarFechaActual();
    
    const boton = document.getElementById('botonGenerar');
    
    boton.addEventListener('click', function() {
        const pokemonDelDia = calcularPokemonDelDia();
        obtenerPokemon(pokemonDelDia);
    });
});

function mostrarFechaActual() {
    const hoy = new Date();
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = hoy.toLocaleDateString('es-ES', opciones);
    document.getElementById('fechaActual').textContent = fechaFormateada;
}

function calcularPokemonDelDia() {
    const hoy = new Date();
    const dia = hoy.getDate();
    const mes = hoy.getMonth() + 1;
    const año = hoy.getFullYear();
    
    const numeroBase = (dia * mes * año) % TOTAL_POKEMON;
    const numeroPokemon = numeroBase === 0 ? 1 : numeroBase;
    
    return numeroPokemon;
}

async function obtenerPokemon(id) {
    const cargando = document.getElementById('cargando');
    const resultados = document.getElementById('seccionResultados');
    const mensajeError = document.getElementById('mensajeError');
    
    cargando.style.display = 'block';
    resultados.style.display = 'none';
    mensajeError.style.display = 'none';
    
    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }
        
        const datos = await respuesta.json();
        
        mostrarPokemon(datos);
        
    } catch (error) {
        mostrarError('Hubo un error al buscar el Pokémon. Por favor intenta de nuevo.');
        console.error('Error al obtener Pokémon:', error);
    } finally {
        cargando.style.display = 'none';
    }
}

function mostrarPokemon(pokemon) {
    const nombre = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    document.getElementById('nombrePokemon').textContent = nombre;
    
    document.getElementById('numeroPokemon').textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
    
    const imagenUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    document.getElementById('imagenPokemon').src = imagenUrl;
    document.getElementById('imagenPokemon').alt = nombre;
    
    mostrarTipos(pokemon.types);
    
    mostrarStats(pokemon.stats);
    
    mostrarHabilidades(pokemon.abilities);
    
    const altura = (pokemon.height / 10).toFixed(1);
    document.getElementById('altura').textContent = `${altura} m`;
    
    const peso = (pokemon.weight / 10).toFixed(1);
    document.getElementById('peso').textContent = `${peso} kg`;
    
    document.getElementById('experiencia').textContent = pokemon.base_experience;
    
    document.getElementById('seccionResultados').style.display = 'block';
    
    document.getElementById('seccionResultados').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function mostrarTipos(tipos) {
    const contenedorTipos = document.getElementById('tiposPokemon');
    contenedorTipos.innerHTML = '';
    
    tipos.forEach(tipoInfo => {
        const span = document.createElement('span');
        span.className = `tipo tipo-${tipoInfo.type.name}`;
        span.textContent = traducirTipo(tipoInfo.type.name);
        contenedorTipos.appendChild(span);
    });
}

function mostrarStats(stats) {
    const contenedorStats = document.getElementById('statsLista');
    contenedorStats.innerHTML = '';
    
    stats.forEach(statInfo => {
        const statDiv = document.createElement('div');
        statDiv.className = 'stat-item';
        
        const nombreStat = traducirStat(statInfo.stat.name);
        const valorStat = statInfo.base_stat;
        
        statDiv.innerHTML = `
            <div class="stat-nombre">${nombreStat}</div>
            <div class="stat-barra-contenedor">
                <div class="stat-barra" style="width: ${(valorStat / 255) * 100}%"></div>
            </div>
            <div class="stat-valor">${valorStat}</div>
        `;
        
        contenedorStats.appendChild(statDiv);
    });
}

function mostrarHabilidades(habilidades) {
    const contenedorHabilidades = document.getElementById('habilidadesLista');
    contenedorHabilidades.innerHTML = '';
    
    habilidades.forEach(habilidadInfo => {
        const span = document.createElement('span');
        span.className = 'habilidad-badge';
        const nombreHabilidad = habilidadInfo.ability.name.replace('-', ' ');
        span.textContent = nombreHabilidad.charAt(0).toUpperCase() + nombreHabilidad.slice(1);
        
        if (habilidadInfo.is_hidden) {
            span.classList.add('habilidad-oculta');
            span.textContent += ' (Oculta)';
        }
        
        contenedorHabilidades.appendChild(span);
    });
}

function traducirTipo(tipo) {
    const tipos = {
        'normal': 'Normal',
        'fire': 'Fuego',
        'water': 'Agua',
        'grass': 'Planta',
        'electric': 'Eléctrico',
        'ice': 'Hielo',
        'fighting': 'Lucha',
        'poison': 'Veneno',
        'ground': 'Tierra',
        'flying': 'Volador',
        'psychic': 'Psíquico',
        'bug': 'Bicho',
        'rock': 'Roca',
        'ghost': 'Fantasma',
        'dragon': 'Dragón',
        'dark': 'Siniestro',
        'steel': 'Acero',
        'fairy': 'Hada'
    };
    return tipos[tipo] || tipo;
}

function traducirStat(stat) {
    const stats = {
        'hp': 'PS',
        'attack': 'Ataque',
        'defense': 'Defensa',
        'special-attack': 'At. Especial',
        'special-defense': 'Def. Especial',
        'speed': 'Velocidad'
    };
    return stats[stat] || stat;
}

function mostrarError(mensaje) {
    const elementoError = document.getElementById('mensajeError');
    elementoError.textContent = mensaje;
    elementoError.style.display = 'block';
    
    elementoError.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}
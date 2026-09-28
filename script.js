//BASE  DE DATOS DE PRODUCTOS PARA ENTRADA DINAMICA
const MAQUIMARK = [
    { id: 1, tipo: "maquinaria", nombre: "Excavadora Oruga CAT 320", precio: 780000.00, foto: "img/id1.png", toneladas: 22.5 },
    { id: 2, tipo: "maquinaria", nombre: "Mini Cargador Bobcat S450", precio: 170000.00, foto: "img/id2.jpg", toneladas: 2.36 },
    { id: 3, tipo: "maquinaria", nombre: "Rodillo Compactador Dynapac CA250", precio: 370000.00, foto: "img/id3.jpg", toneladas: 12.9 },
    { id: 4, tipo: "maquinaria", nombre: "Retroexcavadora John Deere 310L", precio: 400000.00, foto: "img/id4.webp", toneladas: 7.5 },
    { id: 5, tipo: "maquinaria", nombre: "Cargador Frontal Komatsu WA380", precio: 850000.00, foto: "img/id5.jpg", toneladas: 18.5 },
    { id: 6, tipo: "maquinaria", nombre: "Camion Volquete JAC 15m3", precio: 300000.00, foto: "img/id6.jpg", toneladas: 16.5 },
    { id: 7, tipo: "equipo", nombre: "Generador Eléctrico Honda EP2500CX", precio: 3500.00, foto: "img/id7.webp", alimentacion: "Gasolina" },
    { id: 8, tipo: "equipo", nombre: "Rotomartillo Bosch GBH 2-24 D", precio: 900.00, foto: "img/id8.jpg", alimentacion: "Electrica 220V" },
    { id: 9, tipo: "equipo", nombre: "Apisonador Tipo Canguro Honda 5.5 HP", precio: 5000.00, foto: "img/id9.jpg", alimentacion: "Gasolina" },
    { id: 10, tipo: "equipo", nombre: "Mezcladora de Concreto T/Trompo 11P3", precio: 6500.00, foto: "img/id10.jpg", alimentacion: "Gasolina" },
    { id: 11, tipo: "equipo", nombre: "Compresor de Aire Truper 3-1/2 HP", precio: 800.00, foto: "img/id11.webp", alimentacion: "Electrica 220V" },
    { id: 12, tipo: "equipo", nombre: "Plancha Compactadora BPU3050", precio: 10500.00, foto: "img/id12.png", alimentacion: "Gasolina" }
];

// CLASES
class Producto {
    constructor(id, tipo, nombre, precio, foto) {
        this.id = id;
        this.tipo = tipo;
        this.nombre = nombre;
        this.precio = precio;
        this.foto = foto;
    }
}
//HERENCIA
//SUB CLASE MAQUINARIA
class Maquinaria extends Producto {
    constructor(id, tipo, nombre, precio, foto, toneladas) {
        super(id, tipo, nombre, precio, foto); 
        this.toneladas = toneladas; //PESO
    }
    obtenerFichaTecnica() { return `Peso : ${this.toneladas} Toneladas`; }
}
//SUB CLASE EQUIPO
class Equipo extends Producto {
    constructor(id, tipo, nombre, precio, foto, alimentacion) {
        super(id, tipo, nombre, precio, foto); 
        this.alimentacion = alimentacion; //FUENTE DE ENERGIA
    }
    obtenerFichaTecnica() { return `Energía: ${this.alimentacion}`; }
}

// CLASE: CONTROLADOR DEL CARRITO PARA LOGICA Y VISUALIZACION
class Carrito {
    constructor() {
        // Usamos localstorage para guardar datos del carrito aunque presionemos F5
        const datosGuardados = localStorage.getItem('carrito_maquinaria_equipo');
        this.items = datosGuardados ? JSON.parse(datosGuardados) : []; // Estructura: { producto, cantidad }
        this.listaHTML = document.getElementById('lista-carrito');
        this.totalHTML = document.getElementById('total-carrito');
        this.contadorHTML = document.getElementById('contador-carrito');
        this.actualizarInterfaz();
    }
    //FUNCIONES, METODOS
    // Aumenta la cantidad en 1 en las compras del carrito(Boton agregar compra y "+")
    agregar(producto) {
        const elementoExistente = this.items.find(item => item.producto.id === producto.id);
        // ESTRUCTURA DE CONTROL
        if (elementoExistente) {//Si el elemento ya esta en el carrito
            elementoExistente.cantidad++;//Aumenta cantidad
        } else {
            this.items.push({ producto: producto, cantidad: 1 });//Si no esta, se agrega
        }

        this.actualizarInterfaz();//Actualizar panel lateral
    }

    // Disminuye la cantidad en 1 (Boton "-")
    disminuirCantidad(idProducto) {
        const elemento = this.items.find(item => item.producto.id === idProducto);
        
        if (elemento) {
            if (elemento.cantidad > 1) {//Si hay mas de 1 elemento en el carrito
                elemento.cantidad--;//Disminuye 1
            } else {
                // Si solo queda 1 y presionan '-', lo removemos por completo
                this.eliminarTodoElProducto(idProducto);
                return; // Cortamos la ejecución ya que eliminarTodoElProducto actualiza la interfaz
            }
        }
        this.actualizarInterfaz();
    }

    // Acción de la X: Borra el producto completo independiente de la cantidad
    eliminarTodoElProducto(idProducto) {
        const indice = this.items.findIndex(item => item.producto.id === idProducto);
        
        if (indice !== -1) {
            this.items.splice(indice, 1);
        }
        
        this.actualizarInterfaz();
        if (typeof miTienda !== 'undefined') {
            miTienda.renderizarFiltrados();
        }
    }

    actualizarInterfaz() {
        // Calcular cantidad de compra y suma precio total
        let totalUnidades = 0;
        let sumaTotalDinero = 0;

        for (let item of this.items) {
            totalUnidades += item.cantidad;
            const precioActual = item.producto.precio;
            sumaTotalDinero += precioActual * item.cantidad;
        }
        this.contadorHTML.innerText = totalUnidades;//Actualiza el contador de unidades

        // Si el carrito se quedo vacio
        if (this.items.length === 0) {
            this.listaHTML.innerHTML = "<p id='carrito-vacio'>El carrito está vacío.</p>";
            this.totalHTML.innerText = "S/. 0";
            return;
        }

        // Dibujar la lista de productos con sus nuevos controles
        this.listaHTML.innerHTML = "";
        // Estructura iterativa
        for (let item of this.items) {
            const prod = item.producto;
            const precioActual = prod.precio;
            const subtotalItem = precioActual * item.cantidad;
            // 
            const divItem = document.createElement('div');
            divItem.className = 'item-carrito';
            divItem.innerHTML = `
              <img src="${prod.foto}" class="foto-mini">
                <div class="detalles-mini">
                    <h4>${prod.nombre}</h4>
                    <p>S/. ${precioActual.toLocaleString()}</p>
                    
                    <div class="control-cantidad-carrito">
                        <!-- Boton para disminuir cantidad de productos -->  
                        <button class="btn-cantidad-carrito" onclick="miCarrito.disminuirCantidad(${prod.id})">-</button>
                        <span class="cantidad-texto-carrito">${item.cantidad}</span>
                        <!-- Boton para aumentar cantidad de productos -->  
                        <button class="btn-cantidad-carrito" onclick="miCarrito.agregar(${JSON.stringify(prod).replace(/"/g, '&quot;')})">+</button>
                    </div>
                    <small style="color: #64748b; display:block; margin-top:4px;">
                        Subtotal: S/. ${subtotalItem.toLocaleString()}
                    </small>
                </div>
                <!-- Boton para eliminar toda la compra -->
                <button class="btn-eliminar" onclick="miCarrito.eliminarTodoElProducto(${prod.id})">&times;</button>`;
                
            this.listaHTML.appendChild(divItem);
        }

        // Actualizar la suma total de la compra
        this.totalHTML.innerText = `S/. ${sumaTotalDinero.toLocaleString()}`; 
        // Usamos localstorage para guardar datos del carrito aunque presionemos F5
        localStorage.setItem('carrito_maquinaria_equipo', JSON.stringify(this.items));
    }
    procesarCotizacionAlerta() {
    //Validamos si el arreglo de productos está vacío
    if (this.items.length === 0) {
        alert("Panel vacío. Agrega algun producto.");
    } else {
        // Si tiene productos, muestra la alerta de confirmación
        alert("Compra Realizada con Exito");
        //  Vaciamos el carrito en la memoria y actualizamos la pantalla a cero
        this.items = [];
        this.actualizarInterfaz();
    }
}
}

// CLASE CONTROLADOR DE LA TIENDA PARA LISTAR PRODUCTOS DINAMICAMENTE
class Tienda {
    constructor() {
        this.listaProductos = [];
        // Grilla para colocar productos
        this.contenedorHTML = document.getElementById('contenedor-productos');
        this.panelHTML = document.getElementById('panel-carrito');
        // Filtrar Productos por tipo y por nombre
        this.buscador = document.getElementById('buscador');
        this.chkMaquinaria = document.getElementById('chk-maquinaria');
        this.chkEquipo = document.getElementById('chk-equipo');

        this.vincularEventos();
        this.cargarDatos();
    }
    //Abrir barra lateral del carrito de compras y no sobreponer a la tienda
    vincularEventos() {
        document.getElementById('btn-carrito').addEventListener('click', () => {
        this.panelHTML.classList.add('activo');
        document.body.classList.add('carrito-abierto'); 
        });
        document.getElementById('btn-cerrar').addEventListener('click', () => {
        this.panelHTML.classList.remove('activo');
        document.body.classList.remove('carrito-abierto'); 
        });

        this.buscador.addEventListener('input', () => this.renderizarFiltrados());
        this.chkMaquinaria.addEventListener('change', () => this.renderizarFiltrados());
        this.chkEquipo.addEventListener('change', () => this.renderizarFiltrados());
    }
    //Datos de productos filtrados 
    cargarDatos() {
        for (let item of MAQUIMARK) {
            if (item.tipo === "maquinaria") {
                this.listaProductos.push(new Maquinaria(item.id, item.tipo, item.nombre, item.precio, item.foto, item.toneladas));
            } else if (item.tipo === "equipo") {
                this.listaProductos.push(new Equipo(item.id, item.tipo, item.nombre, item.precio, item.foto, item.alimentacion));
            }
        }
        this.renderizar(this.listaProductos); 
    }
    // Renderizar productos filtrados
    renderizarFiltrados() {
        const textoBusqueda = this.buscador.value.toLowerCase();
        const mostrarMaquinaria = this.chkMaquinaria.checked;
        const mostrarEquipo = this.chkEquipo.checked;

        const productosFiltrados = [];

        for (let producto of this.listaProductos) {
            const coincideTexto = producto.nombre.toLowerCase().includes(textoBusqueda);
            const coincideTipo = (producto.tipo === 'maquinaria' && mostrarMaquinaria) || 
                                 (producto.tipo === 'equipo' && mostrarEquipo);

            if (coincideTexto && coincideTipo) {
                productosFiltrados.push(producto);
            }
        }
        this.renderizar(productosFiltrados);
    }
    //Renderizar los productos
    renderizar(listaAMostrar) {
        this.contenedorHTML.innerHTML = ""; 

        if (listaAMostrar.length === 0) {//Si no encuentra coincidencias
            this.contenedorHTML.innerHTML = "<p  class='cargando'>No se encontraron maquinarias o equipos con esos filtros.</p>";
            return;
        }
        for (let producto of listaAMostrar) {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-producto';
            
            const etiquetaClase = producto.tipo === 'maquinaria' ? 'etiqueta-maquinaria' : 'etiqueta-equipo';
            const etiquetaTipo = producto.tipo === 'maquinaria' ? 'Maquinaria' : 'Equipo';

            tarjeta.innerHTML = `
                <span class="etiqueta-tipo ${etiquetaClase}">${etiquetaTipo}</span>
                <div class="contenedor-foto">
                    <img src="${producto.foto}" alt="${producto.nombre}" class="foto-productoReal">
                </div>
                <h3>${producto.nombre}</h3>
                <p class="precio">S/. ${producto.precio.toLocaleString()}</p>
                <p class="especificacion-tecnica">${producto.obtenerFichaTecnica()}</p>
                <button class="btn-comprar" onclick="miTienda.comprarProducto(${producto.id})">
                    Agregar a Carrito
                </button>
            `;
            this.contenedorHTML.appendChild(tarjeta);
        }
    }

    comprarProducto(id) {
        const producto = this.listaProductos.find(p => p.id === id);
        if (producto) {
            // Enviamos el producto directamente a la clase Carrito
            miCarrito.agregar(producto);
        }
    }
}

// Inicializar las instancias de Carrito y Tienda
const miCarrito = new Carrito();
const miTienda = new Tienda();
//Declaración de clase constructora con las Propiedades de Producto

class Producto{

    constructor(id, nombre, tipo, precio, imagen, pais){

        this.id = id,
        this.nombre = nombre,
        this.tipo = tipo,
        this.precio = precio,
        this.imagen = imagen,
        this.pais = pais

    }

}


// Declaración de Array vacio
let listaProductos = [];

//Carga de productos de productos.json al array listaProductos por medio de Fetch
const cargaListaProductos = async ()=>{

    const resp = await fetch("productos.json");
    const data = await resp.json();
    data.forEach((nuevoProducto) => {

        let cargaNuevoProducto = new Producto (nuevoProducto.id, nuevoProducto.nombre, nuevoProducto.tipo, nuevoProducto.precio, nuevoProducto.imagen, nuevoProducto.pais);

        listaProductos.push(cargaNuevoProducto);

    });
    localStorage.setItem("listaDeProductos", JSON.stringify(listaProductos));
    imprimirCards(listaProductos);

}
//Condicional que agrega los productos al Storage, en caso de no haber nada en el Storage porque el usuario entra por primera vez, se ejecuta lo que esta en el ELSE sino se ejecuta lo que esta en el IF
if (localStorage.getItem("listaDeProductos")){
    
    listaProductos = JSON.parse(localStorage.getItem("listaDeProductos"));
    
}else {

    cargaListaProductos();
    localStorage.setItem("listaDeProductos", JSON.stringify(listaProductos));

}

//Declaración de Array vacio
let productosEnCarrito = [];

//Condicional que guarda los productos del carrito en el storage
if (localStorage.getItem("carrito")){
    
    productosEnCarrito = JSON.parse(localStorage.getItem("carrito"));
    
} else {
    
    localStorage.setItem("carrito", JSON.stringify(productosEnCarrito));
    
}

//Capturas DOM
let mainProductos = document.getElementById ("productos");
let filtrarBusqueda = document.getElementById ("filtrarBusqueda");
let btnCarrito = document.getElementById ("btnCarrito");
let modalBody = document.getElementById ("modalBody");
let buscador = document.getElementById ("buscador");
let resultadoBusqueda = document.getElementById ("resultadoBusqueda");
let btnBuscar = document.getElementById ("btnBuscar");
let precioTotal = document.getElementById ("precioTotal");
let btnFinalizarCompra = document.getElementById ("btnFinalizarCompra");


//FUNCIONES

//Funcion que imprime las Cards de los productos 
function imprimirCards (array){
    
    mainProductos.innerHTML = ""
    //For que recorre cada objeto del array de productos
    for (let indumentaria of array){

        //Crea un DIV, le agrega una clase y crea una card por cada objeto del ARRAY
        let indumentariaCard = document.createElement ("div");
        indumentariaCard.classList.add("main_cards")
        indumentariaCard.innerHTML = `<div id="indumentaria${indumentaria.id}" class="card">
                                        <img src="./pictures/${indumentaria.imagen}" class="card-img-top" alt="${indumentaria.nombre}">
                                        <div class="card-body">
                                            <h4 class="card-title">${indumentaria.nombre}</h4>
                                            <h5 class="card-prize ${indumentaria.precio <= 8500 ? "ofertaColor" : "precioComun"}">$${indumentaria.precio}</h5>
                                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                            <div class="card-btn">
                                                <button id="agregarBtn${indumentaria.id}" class="btn btn-outline-success">Agregar al carrito</button>
                                            </div>
                                        </div>
                                    </div>`

        //Inserta todos los elementos creados en indumentariaCard y lo mete dentro de un div
        mainProductos.appendChild(indumentariaCard);
        //Captura el boton de agregar al carrito y se le da un evento que al hacer click se imprime por consola el nombre del producto
        let btnAgregar = document.getElementById(`agregarBtn${indumentaria.id}`); 
        btnAgregar.addEventListener ("click", ()=>{
            
            agregarAlCarrito(indumentaria);
            
        })
        
    }
    
}

//Funcion que ordena el array de Menor a Mayor

function filtrarMenorMayor (array){
    
    let menorMayor = [].concat(array);
    menorMayor.sort((a,b) => (a.precio - b.precio));
    imprimirCards(menorMayor);
    
}

//Función que ordena el array de Mayor a menor

function filtrarMayorMenor (array){
    
    let mayorMenor = [].concat(array);
    mayorMenor.sort((a,b) => (b.precio - a.precio));
    imprimirCards(mayorMenor);
    
}

//Función que ordena el array alfabéticamente

function filtrarAlfabéticamente (array){
    
    let alfabeticamente = [].concat(array);
    alfabeticamente.sort((a,b) => {
        
        if (a.pais < b.pais) return -1;
        if (a.pais > b.pais) return 1;
        return 0;
        
    })
    imprimirCards (alfabeticamente);
    
}

//Función que ordena el array de productos más viejos a más nuevos segun el ID del producto

function filtrarViejoNuevo (array){
    
    let viejoNuevo = [].concat(array);
    viejoNuevo.sort ((a, b) => (a.id - b.id));
    imprimirCards(viejoNuevo);

    
}

//Función que ordena el array de productos más nuevos a más viejos segun el ID del producto

function filtrarNuevoViejo (array){
    
    let nuevoViejo = [].concat(array);
    nuevoViejo.sort((a,b) => (b.id - a.id));
    imprimirCards(nuevoViejo);
    
}

//Función que agrega los productos seleccionados al ARRAY y los guarda en el LocalStorage (No permite agregar el producto 2 veces)

function agregarAlCarrito (array){
    
    let agregarProducto = productosEnCarrito.find((pr) => pr.id == array.id);
    console.log(agregarProducto);
    if (agregarProducto === undefined){

        productosEnCarrito.push(array);
        localStorage.setItem("carrito", JSON.stringify(productosEnCarrito));
        
        Toastify({
            text: `Se agregó "${array.nombre}" al carrito`,
            duration: "1500",
            gravity: "top", 
            position: "center",
            style: {
                background: "#4BB543",
                fontSize: "1.2em",
            }
        }).showToast();
        imprimirEnCarrito(productosEnCarrito);
    } else {

        swal.fire({

            icon: 'error',
            title: 'Este producto ya ha sido agregado',
            text: 'No se puede agregar el mismo producto al carrito',

        })

    }
    
}

//Función que imprime el poducto seleccionado en el Modal del Carrito y tambien lo elimina del Carrito si el usuario desea

function imprimirEnCarrito (array){
    
    modalBody.innerHTML = ""
    
    array.forEach ((elementoCarrito) => {
        
        //Agrega un producto al carrito
        modalBody.innerHTML += `<div id= "productoCarrito${elementoCarrito.id}" class="card mb-3 cardCart" style="max-width: 540px;">
                                    <div class="row g-0">
                                        <div class="col-md-4 cardCartPic">
                                            <img src="./pictures/${elementoCarrito.imagen}" class="img-fluid rounded-start cardCartImg" alt="${elementoCarrito.nombre}">
                                        </div>
                                        <div class="col-md-8">
                                            <div class="card-body">
                                                <h5 class="card-title cardCartTitle">${elementoCarrito.nombre}</h5>
                                                <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                                <p class="card-text"><small class="text-muted cardCartPrize">Precio: $${elementoCarrito.precio}</small></p>
                                                <button class= "btn btn-danger" id="botonEliminar${elementoCarrito.id}"><i class="fas fa-trash-alt">Eliminar Producto</i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`
    });
    
    //Elimina producto del Carrito
    array.forEach((elementoCarrito, indice) => {
        
        //Captura el producto que se desee eliminar y se le da un Evento
        document.getElementById(`botonEliminar${elementoCarrito.id}`).addEventListener ("click", () => {
            
            //Elimina del DOM
            let cardProducto = document.getElementById(`productoCarrito${elementoCarrito.id}`);
            cardProducto.remove();
            Toastify({
                text: `Se eliminó "${elementoCarrito.nombre}" del carrito`,
                duration: "1500",
                gravity: "top", 
                position: "center",
                style: {
                    background: "#DC4C64",
                    fontSize: "1.2em",
                }
            }).showToast();
            
            //Elimina del Array ProductosEnCarrito
            productosEnCarrito.splice(indice, 1);
            
            //Elimina del LocalStorage
            localStorage.setItem("carrito", JSON.stringify(productosEnCarrito));
            
            calcularTotal(array)
            
        })
        
    })
    if (array.length == 0){
        
        modalBody.innerHTML = ` <div>
        <h4 class="empty_cart">No se agregaron productos al carrito</h4>
        </div>`;
        
    }
    
    calcularTotal(array);
    
}

//Funcion que busca los productos en tiempo real

function buscarProductos (busqueda, array){
    
    let buscar = array.filter((product) => product.nombre.toLowerCase().includes(busqueda.toLowerCase()) || product.pais.toLowerCase().includes(busqueda.toLowerCase()) || product.tipo.toLowerCase().includes(busqueda.toLowerCase()));
    resultadoBusqueda.innerHTML = "";
    
    if (buscar.length == 0){
        
        resultadoBusqueda.innerHTML = `<h3 class="resultado_busqueda">No se ha encontrado</h3>`;
        
    }

        imprimirCards (buscar);

        //Función que permite usar los filtros de búsqueda en el nuevo array que contiene los productos buscados
        filtrosDeBusqueda(buscar)

}

//Función que calcula el precio total de la compra

function calcularTotal (array){
    
    let productosAcumulados = 0;
    productosAcumulados = array.reduce ((acc, itemCarrito) => acc + itemCarrito.precio, 0);
    if (productosAcumulados == 0){
        
        precioTotal.innerHTML = "";
        modalBody.innerHTML = ` <div>
        <h4 class="empty_cart">No se agregaron productos al carrito</h4>
        </div>`;
        
    } else {
        
        precioTotal.innerHTML = `Total a pagar: ${productosAcumulados}`;
        precioTotal.classList.add ("total_text");
        
    }
    
}

//Función que filtra los productos según la opción seleccionada

function filtrosDeBusqueda (array){
    
    filtrarBusqueda.addEventListener ("change", () => {
        
        if (filtrarBusqueda.value == 1){
            
            filtrarMenorMayor(array);
            
        } else if (filtrarBusqueda.value == 2){
            
            filtrarMayorMenor(array);
            
        } else if (filtrarBusqueda.value == 3){
            
            filtrarAlfabéticamente(array);
            
        } else if (filtrarBusqueda.value == 4){
            
            filtrarViejoNuevo(array);
            
        } else if (filtrarBusqueda.value == 5){
            
            filtrarNuevoViejo(array);
            
        }
        
    })
    
}


//Llamada a las funciones

imprimirCards(listaProductos);
imprimirEnCarrito(productosEnCarrito);
filtrosDeBusqueda(listaProductos);


//EVENTOS

//Evento que ejecuta la función de buscarProductos que permite realizar busqueda de productos
buscador.addEventListener("input", () => {

    buscarProductos(buscador.value, listaProductos);

});

//Evento que ejecuta un Sweet Alert al finalizar la compra

btnFinalizarCompra.addEventListener("click", ()=>{

    //En caso de que el usuario haga click en Finalizar Compra sin productos en el carrito se ejecuta el if
    if (productosEnCarrito.length === 0){

        swal.fire({

            icon: 'error',
            title: 'No se ha podido realizar la compra',
            text: 'No se han encontrado productos en el carrito',

        })

    } else {

        Swal.fire({
            title: '¿Desea realizar la compra?',
            text: "Una vez que finalice la compra no podrá volver atras.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Finalizar Compra'
            }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                'Se ha realizado la compra con exito',
                '¡Muchas Gracias por su compra!',
                'success',
                )
                }
                precioTotal.innerHTML = "";
                modalBody.innerHTML = ` <div>
                <h4 class="empty_cart">No se agregaron productos al carrito</h4>
                </div>`;
                productosEnCarrito = [];
                localStorage.removeItem("carrito");
            });

    }
    })



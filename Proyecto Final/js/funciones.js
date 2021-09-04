//Interfaz de productos con JQUERY
function productosUI(productos, id){
  $(id).empty();
  for (const producto of productos) {
     $(id).append(`<div class="card" style="width: 18rem;">
                    <img src="${producto.imagen}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${producto.nombre}</h5>
                      <p class="card-text">${producto.precio}</p>
                      <h5>${producto.categoria}</h5>
                      <button  href="#" id='${producto.id}' class="btn-compra btnComprar">COMPRAR </button>
                    </div>
                  </div>`);
  }
  $('.btn-compra').on("click", comprarProducto);
}
//manejador de compra
function comprarProducto(e){
  //Prevenir refresco
  e.preventDefault();
  //Obtener ID del boton seleccionado
  const idProducto   = e.target.id;
  //Buscar el objeto en el carrito
  const seleccionado = carrito.find(p => p.id == idProducto);
  //Si no se encontro buscar en el array
  if(seleccionado == undefined){
    carrito.push(productos.find(p => p.id == idProducto));
  }else{
    //Si se encontro agregar cantidad
    seleccionado.agregarCantidad(1);
  }
 
  //Guardar en storage
  localStorage.setItem("CARRITO",JSON.stringify(carrito));
  //Salida de producto
  carritoUI(carrito);
}

 //Funcion para generar la interfaz del carrito
 function carritoUI(productos){
  //Cantidad de productos
  $('#carritoCantidad').html(productos.length);
  //Vaciar el interior del cuarpo
  $('#carritoProductos').empty();
  for (const producto of productos) {
    $('#carritoProductos').append(registroCarrito(producto));
  }
  //Agregar total
  $('#carritoProductos').append(`<p id="totalCarrito"> TOTAL ${totalCarrito(productos)}</p>`);
  //Boton confirmar
  $('#carritoProductos').append('<div id="divConfirmar" class="text-center"><button id="btnConfimar" class="btn-compra btnConfirmar">CONFIRMAR</button></div>')
  //Asociar eventos
  $('.btn-delete').on('click', eliminarCarrito);
  $('.btn-add').click(addCantidad);
  $('.btn-sub').click(subCantidad);
  $('#btnConfimar').click(confirmarCompra);
}


//Funcion generar estructura registro HTML
function registroCarrito(producto){
  return `<p class="ml-1 textoCarrito"> ${producto.nombre} 
          <span class="precioCarrito">$ ${producto.precio}</span>
          <span class="cantidadCarrito">${producto.cantidad}</span>
          <span class="subtotalCarrito"> $ ${producto.subtotal()}</span>
          <a id="${producto.id}" class="btn btn-info    btn-add">+</a>
          <a id="${producto.id}" class="btn btn-warning btn-sub">-</a>
          <a id="${producto.id}" class="btn btn-danger  btn-delete">x</a>
          </p>`
}




function eliminarCarrito(e){
  console.log(e.target.id);
  //Eliminar carrito recortando el array con splice
  let posicion = carrito.findIndex(p => p.id == e.target.id);
  carrito.splice(posicion, 1);
  //Generar nuevamente interfaz
  carritoUI(carrito);
  //Guardar en storage nuevo carrito
  localStorage.setItem("CARRITO",JSON.stringify(carrito));
}
//Manejador para agregar cantidad
function addCantidad(){
  let producto = carrito.find(p => p.id == this.id);
  producto.agregarCantidad(1);
  $(this).parent().children()[1].innerHTML = producto.cantidad;
  $(this).parent().children()[2].innerHTML = producto.subtotal();
  //Modificador total
  $("#totalCarrito").html(`TOTAL ${totalCarrito(carrito)}`);
  //Guardar en storage
  localStorage.setItem("CARRITO",JSON.stringify(carrito));
}
//MManejador restar cantidad
function subCantidad(){
  let producto = carrito.find(p => p.id == this.id);
  if(producto.cantidad > 1){
    producto.agregarCantidad(-1);
    //$(this).parent().children()[1].innerHTML = producto.cantidad;
    let registroUI = $(this).parent().children();
    registroUI[1].innerHTML = producto.cantidad;
    registroUI[2].innerHTML = producto.subtotal();
    //MOodificar total
    $("#totalCarrito").html(`TOTAL ${totalCarrito(carrito)}`);
    //Guardar en storage
    localStorage.setItem("CARRITO",JSON.stringify(carrito));
  }
}
//FUNCION PARA GENERAR OPCIONES DE UN SELECT
function selectUI(lista, selector){
  //Vaciar opciones existentes
  $(selector).empty();
  //Recorrer lista y añadir opcion
  lista.forEach(element => {
      $(selector).append(`<option value='${element}'>${element}</option>`);
  });
  $(selector).prepend(`<option value='TODOS' selected>TODOS</option>`);
}
//Precio total del carrito
function totalCarrito(carrito){
  console.log(carrito);
  let total = 0;
  carrito.forEach(p => total += p.subtotal());
  return total.toFixed(2);
}
//Procesamiento de compra
function confirmarCompra(){
  //OCULTAR EL BOTON
  $('#btnConfirmar').hide();
  //AÑADIR SPINNER
  $('#divConfirmar').append(`<div class="spinner-border text-success" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>`);
  console.log("ENVIAR AL BACKEND");
  //REALIZAMOS LA PETICION POST
  //const URLPOST = '/compra.php';
  const URLPOST = 'https://jsonplaceholder.typicode.com/posts';
  //INFORMACION A ENVIAR
  const DATA   = {productos: JSON.stringify(carrito), total: totalCarrito(carrito)}
  //PETICION POST CON AJAX
  $.post(URLPOST, DATA,function(respuesta,estado){
      //console.log(respuesta);
      //console.log(estado);
      if(estado == 'success'){
        //MOSTRAMOS NOTIFICACION DE CONFIRMACIÓN (CON ANIMACIONES)
        $("#notificaciones").html(`<div class="alert alert-sucess alert-dismissible fade show alertaCompra" role="alert">
                    <strong >COMPRA CONFIRMADA!</strong> Comprobante Nº ${respuesta.id}.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                    </div>`).fadeIn().delay(2000).fadeOut('');
        //VACIAR CARRITO;
        carrito.splice(0, carrito.length);
        //SOBREESCRIBIR ALMACENADO EN STORAGE
        localStorage.setItem("CARRITO",'[]');
        //VACIAR CONTENIDO DEL MENU
        $('#carritoProductos').empty();
        //VOLVER INDICADOR A 0
        $('#carritoCantidad').html(0);
      }
  });
}

//Funcion cuando carga el DOM
$(document).ready(function () {
    if("CARRITO" in localStorage){
        const arrayLiterales = JSON.parse(localStorage.getItem("CARRITO"));
        for (const literal of arrayLiterales) {
            carrito.push(new Producto(literal.id, literal.nombre, literal.precio, literal.categoria, literal.cantidad));
        }
        console.log(carrito);
        carritoUI(carrito);
    }
    $(".dropdown-menu").click(function (e) { 
        e.stopPropagation();
    });

    //Carga asincrona local de productos

    $.get('../data/producto.json',function(datos, estado){
        console.log(datos);
        console.log(estado);
        if(estado == 'success'){
            for (const literal of datos) {
                productos.push(new Producto(literal.id, literal.nombre, literal.precio, literal.categoria, literal.cantidad, literal.imagen));
            }
        }
        console.log(productos);
        //Generar interfaz de productos
        productosUI(productos, '#productosContenedor');
    });




});


//Se ejecuta cuando se cargan las imagenes
window.addEventListener('load',()=>{
    //Eliminar elemento del DOM
    $('#indicadorCarga').remove();
    //Fade
    $('#productosContenedor').fadeIn("slow",()=>{ console.log('ANIMACION FINALIZADA')});
})



//Generar opciones para el filtro
selectUI(categorias,"#filtroCategorias");
//Definir eventos sobre el select
$('#filtroCategorias').change(function (e) { 
    //Nuevo valor del select
    const value = this.value;

    //Animaciones
    $('#productosContenedor').fadeOut(600,function(){
        //El filtro se realiza una vez oculto el contenedor
        if(value == 'TODOS'){
            productosUI(productos, '#productosContenedor');
        }else{
            const filtrados = productos.filter(producto => producto.categoria == value);
            productosUI(filtrados, '#productosContenedor');
        }
        //Mostrar una vez generados los productos
        $('#productosContenedor').fadeIn();
    });
});

//GENERAR OPCIONES PARA FILTRAR POR CATEGORIA
selectUI(categorias,"#filtroCategorias");
//DEFINIR EVENTOS SOBRE EL SELECT GENERADO
$('#filtroCategorias').change(function (e) { 
    //OBTENEMOS EL NUEVO VALOR DEL SELECT
    const value = this.value;
    //SOLUCION CON ANIMACIONES
    $('#productosContenedor').fadeOut(600,function(){
        //EL FILTRO SE REALIZA UNA VEZ OCULTO EL CONTENEDOR
        if(value == 'TODOS'){
            productosUI(productos, '#productosContenedor');
        }else{
            const filtrados = productos.filter(producto => producto.categoria == value);
            productosUI(filtrados, '#productosContenedor');
        }
        //MOSTRAR UNA VEZ GENERADOS LOS PRODUCTOS
        $('#productosContenedor').fadeIn();
    });
});


//DEFINIR EVENTOS SOBRE EL INPUT DE BUSCADA -> USA keyup cuando la tecla se suelta
$("#busquedaProducto").keyup(function (e) { 
    const criterio = this.value.toUpperCase();
    console.log(criterio);
    if(criterio != ""){
                                                        //el resulado de esto es verdadero
        const encontrados = productos.filter(p =>       p.nombre.includes(criterio.toUpperCase()) 
                                                    || p.categoria.includes(criterio.toUpperCase()));
        productosUI(encontrados, '#productosContenedor');
    }
});


//DEFINIR EVENTOS SOMBRE EL INPUT DE FILTRO DE PRECIO
$(".inputPrecio").change(function (e) { 
    const min = $("#minProducto").val();
    const max = $("#maxProducto").val();
    if((min > 0) && (max > 0)){
                                                 //el resulado de esto es verdadero
        const encontrados = productos.filter(p => p.precio >= min && p.precio <= max);
        productosUI(encontrados, '#productosContenedor');
    }
});



//Barra lateral

const btnToggle = document.querySelector('.toggle-btn');

btnToggle.addEventListener('click', function (){
    document.getElementById('sidebar').classList.toggle('active');
})


//Sweet alert

const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

Toast.fire({
    icon: 'success',
    title: 'Signed in successfully'
})
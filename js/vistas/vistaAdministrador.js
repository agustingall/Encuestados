/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });
  this.modelo.preguntaBorrada.suscribir(function(){
    contexto.reconstruirLista();
  });
};


VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    this.configuracionDeBotones();
    this.reconstruirLista();
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
  },

  construirElementoPregunta: function(pregunta){
    var contexto = this;
    var nuevoItem;
    //completar
    nuevoItem = $("<li>");
    nuevoItem.attr({id : pregunta.id, class : "list-group-item"}); nuevoItem.text(pregunta.textoPregunta);
    //asignar a nuevoitem un elemento li con clase "list-group-item", id "pregunta.id" y texto "pregunta.textoPregunta"
    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp){
      return " " + resp.respuesta;
    }));
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },

  reconstruirLista: function() {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.preguntas;
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;

    //asociacion de eventos a boton
    controlarEventosBorrar = function(){
    // Controla cuando se hace click sobre borrar una pregunta
      $(".botonBorrarRespuesta").click(function(e){
        $(e.target).parents("div .form-group").fadeOut().remove(); // los padres contenedores se removeran
    });
    },
    vistaAdmin.elementos.botonAgregarPregunta.click(function(){
        var respuestas = []; 
        $('[name="option[]"].respuesta').each(function(k,v) { 
          // solo se obtendrá los valores de los input con nombre option y clase respuesta y asi no obtener el valor vacio
          // del template
        respuestas.push({respuesta : v.value, votos : 0});
      })
         // los objetos respuesta se almacenaran en un array
        contexto.modelo.agregarPregunta(vistaAdmin.elementos.pregunta.val(),respuestas); // por último se agrega la pregunta y al arrays con las respuestas
      });
    
      // Controla cuando se agrega una respuesta o toda la pregunta
      vistaAdmin.elementos.botonAgregarRespuesta.click(function(){
       var clon = vistaAdmin.elementos.template.clone().removeClass("hide").removeAttr('id');
        clon.children("input").addClass("respuesta");    
        $(".botonAgregarRespuesta").before(clon);
        controlarEventosBorrar();
        contexto.limpiarFormulario();    
    });
      
    //asociar el resto de los botones a eventos
    e.borrarTodo.click(function(){
      contexto.modelo.borrarPreguntas();
    });
    e.botonEditarPregunta.click(function(){
      var item = $(".list-group-item.active");

      if(item.length == 0){
        swal("Debes elegir una pregunta", "Haz click en una pregunta para editarla", "warning");
        return 0;
      }
      swal("Editar pregunta", {
        content: "input",
      })
      .then((value) => {
        if(value != null){
        contexto.nuevaPregunta = value;
        contexto.controlador.editarPregunta(item.attr("id"),value);
        swal(`La nueva pregunta es: ${value}`);
        }
      });
    });
    e.botonBorrarPregunta.click(function(){
      var item = $(".list-group-item.active");
      if(item.length == 0){
        swal("Debes elegir una pregunta", "Haz click en una pregunta para borrarla", "warning");
        return 0;
      }
      contexto.controlador.borrarPregunta(item.attr("id"));
      swal(`La pregunta ha sido eliminada`);
      
    });
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};

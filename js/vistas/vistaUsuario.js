/*
 * Vista usuario
 */
var VistaUsuario = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  //suscripcion a eventos del modelo
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });
};

VistaUsuario.prototype = {
  //muestra la lista por pantalla y agrega el manejo del boton agregar
  inicializar: function() {
    this.reconstruirLista();
    var elementos = this.elementos;
    var contexto = this;
    
    elementos.botonAgregar.click(function() {
      var nombre = elementos.nombreUsuario.val();
      if(nombre == ""){
        swal("Debes ingresar un nombre de usuario", "para poder votar ingresa un nombre de usuario", "info");
        navigator.reload();
      }
      elementos.nombreUsuario.val(""); // limpiamos en la vista el campo nombre de usuario
      swal("Ya has votado", `${nombre}, Muchas gracias por votar`, "success");
      contexto.agregarVotos(); 
      contexto.reconstruirGrafico();
    });
      
    this.reconstruirGrafico();
  },

  //reconstruccion de los graficos de torta
  reconstruirGrafico: function(){
    var contexto = this;
    //obtiene las preguntas del local storage
    var preguntas = this.modelo.preguntas;
    preguntas.forEach(function(clave){
      var listaParaGrafico = [[clave.textoPregunta, 'Cantidad']];
      var respuestas = clave.cantidadPorRespuesta;
      respuestas.forEach(function(elemento) {
        listaParaGrafico.push([elemento.respuesta,elemento.votos]);
      });
      
      contexto.dibujarGrafico(clave.textoPregunta, listaParaGrafico);
    });
  },


  reconstruirLista: function() {
    var listaPreguntas = this.elementos.listaPreguntas;
    listaPreguntas.html('');
    var contexto = this;
    var preguntas = this.modelo.preguntas;
    preguntas.forEach(function(clave){
      //completar
      //agregar a listaPreguntas un elemento div con valor "clave.textoPregunta", texto "clave.textoPregunta", id "clave.id"
      var elemento = $('<div>').attr("id", clave.id);
      elemento.val(clave.textoPregunta);  elemento.text(clave.textoPregunta);
      
      listaPreguntas.append(elemento);
      var respuestas = [];
      respuestas.push(clave.cantidadPorRespuesta.map(function(e){
        return e.respuesta;
      }));
      contexto.mostrarRespuestas(listaPreguntas,respuestas, clave);
    });
  },

  //muestra respuestas
  mostrarRespuestas:function(listaPreguntas,respuestas, clave){
    respuestas[0].forEach (function(elemento) {
      listaPreguntas.append($('<input>', {
        type: 'radio',
        value: elemento,
        name: clave.id,
      }));
      listaPreguntas.append($("<label>", {

        for: elemento,
        text: elemento
      }));
    });
  },

  agregarVotos: function(){
    var contexto = this;
    $('#preguntas').find('div').each(function(){
        var nombrePregunta = $(this).val();
        var id = $(this).attr('id');
        var pregunta = contexto.modelo.encontrarPregunta(id);
        var respuestaSeleccionada = $('input[name=' + id + ']:checked').val();
        $('input[name=' + id + ']').prop('checked',false);
        contexto.controlador.agregarVoto(pregunta,respuestaSeleccionada);
      });
  },

  dibujarGrafico: function(nombre, respuestas){
    var seVotoAlgunaVez = false;
    for(var i=1;i<respuestas.length;++i){
      if(respuestas[i][1]>0){
        seVotoAlgunaVez = true;
      }
    }
    var contexto = this;
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      var data = google.visualization.arrayToDataTable(respuestas);

      var options = {
        title: nombre,
        is3D: true,
      };
      var ubicacionGraficos = contexto.elementos.graficosDeTorta;
      var id = (nombre.replace(/\W/g, '')).split(' ').join('')+'_grafico';
      if($('#'+id).length){$('#'+id).remove()}
      var div = document.createElement('div');
      ubicacionGraficos.append(div);
      div.id = id;
      div.style.width = '400';
      div.style.height = '300px';
      var chart = new google.visualization.PieChart(div);
      if(seVotoAlgunaVez){
        chart.draw(data, options);
      }
    }
  },
};

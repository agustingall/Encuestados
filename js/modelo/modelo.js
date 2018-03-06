/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  if(localStorage.preguntas == undefined){
    localStorage.setItem("preguntas", "[]");
  }
  else{
    this.preguntas = JSON.parse(localStorage.preguntas);
  }
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaBorrada = new Evento(this);
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    if (this.preguntas.length != 0){  // si el arreglo preguntas no esta vacio entonces
      return this.preguntas[this.preguntas.length-1]["id"];// se retornara el id del ultimo elemento
    }
      return 0; // sino se retornara 0
  },
  encontrarPregunta : function(id){
    // cada vez que haya que buscar una pregunta por el id, esta retorarnará la pregunta
    var pregunta;
    $.each(this.preguntas,function(k,v){
      if(v.id == id){ // se compara la el id dado con el id de las preguntas
        pregunta = v;
      }
    });
    return pregunta;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    this.preguntas.push(nuevaPregunta);  
    this.guardar();
    this.preguntaAgregada.notificar();
  },

  //se guardan las preguntas
  guardar: function(){
    // se guarda o se actualiza el en el LocalStorage el arreglo preguntas
    localStorage.setItem("preguntas",JSON.stringify(this.preguntas));
  },
  borrar : function(){
    // se limpia por completo el Local Storage
    localStorage.clear();
  },
  borrarPregunta : function(id){ // borra la pregunta con el id dado
    var pregunta = this.encontrarPregunta(id);
    this.preguntas.splice(this.preguntas.indexOf(pregunta),1);
    this.guardar();
    this.preguntaBorrada.notificar();
  },
  agregarVoto : function(pregunta,respuesta){

    $.each(pregunta.cantidadPorRespuesta,function(k,v){
      if(v.respuesta == respuesta){
        v.votos++;
      }
    });
    this.guardar();
  },
  editarPregunta : function(id,nuevaPregunta){
    // se busca la pregunta y se cambia por la nueva pregunta
    var pregunta_E = this.encontrarPregunta(id);
    var pregunta = this.preguntas[this.preguntas.indexOf(pregunta_E)];
    pregunta.textoPregunta = nuevaPregunta;
    this.guardar();
    this.preguntaAgregada.notificar();
  },
  borrarPreguntas : function(){
    // borra el arreglo preguntas y limpia el localStorage
    this.preguntas = [];
    this.borrar();
    this.preguntaBorrada.notificar();
  }
};

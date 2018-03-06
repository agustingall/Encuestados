/*
 * Controlador
 */
//var expect = chai.expect;
var Controlador = function(modelo) {
	this.modelo = modelo;
};

Controlador.prototype = {
  

  agregarPregunta: function(pregunta, respuestas) {
      this.modelo.agregarPregunta(pregunta, respuestas);
  },
  agregarVoto : function(pregunta,respuestaSeleccionada){
    if(respuestaSeleccionada == undefined){
      swal("Debes seleccionar todas las respuestas", "Selecciona todas las respuesta para votar", "info");
      navigator.reload();
    }
  	this.modelo.agregarVoto(pregunta,respuestaSeleccionada);
  },
  editarPregunta : function(id,nuevaPregunta){
    if(nuevaPregunta == ""){
      swal("El campo está vacio", "debes escribir la nueva pregunta", "error");
      navigator.reload();
    }
  	this.modelo.editarPregunta(id,nuevaPregunta);
  },
  borrarPregunta:function(id){
    this.modelo.borrarPregunta(id);
  },
  borrarTodo : function(){
    this.modelo.borrarPreguntas();
  }

};
  /*comprobarCadena : function(cadena){
  	if(expect(cadena).to.be.an("string")){
  		return true;
  	}
  },
  comprobarRespuestas : function(respuestas){
  	if(expect(respuestas).to.be.an("array")){
  		return true;
  	}
  },
  comprobarId : function(id){
  	if(expect(id).to.be.a("number")){
  		return true
  	}
  },*/

const Semaphore = require('semaphore')(5);

// Capacidad máxima de la cafetería
const filaDeEspera = [];

// Función para que los estudiantes entren a la cafetería
function entrarCafeteria(estudiante) {
  
    // Verificar si hay espacio en la cafetería
    if(verificarDisponibilidadCafeteria()){

      //Se toma el ultimo estudiante de la fila de espera
      const siguienteEstudiante = filaDeEspera.pop();
      //Si hay estudiantes en la lista de espera, permitimos que el primero en la lista entre
      if (siguienteEstudiante) {
          // Si hay estudiantes en la lista de espera, permitimos que el primero en la lista entre
          entrarCafeteria(siguienteEstudiante);
      }

      Semaphore.take(() => {        
        console.log(`${estudiante} ha entrado a la cafetería.`);
        // El estudiante permanece en la cafetería durante 30 segundos
        setTimeout(() => {
          console.log(`${estudiante} ha salido de la cafetería.`);
          liberarEspacioEnCafeteria(); //Funcion para liberar espacio en la cafetería
        }, 20000);

        
      });
    }
    else{
      console.log(`${estudiante} no puede entrar. La cafetería está llena, se agregará a la fila de espera.`);
      //En caso de que no haya espacio en la cafetería, el estudiante se agrega a la lista de espera
      filaDeEspera.push(estudiante);
    }
      
}


// Función para verificar la disponibilidad de la cafetería
function verificarDisponibilidadCafeteria() {
  if (Semaphore.available()) {
    console.log('Hay espacio en la cafetería');
    return true;
  } else {
    console.log('No hay espacio en la cafetería');
    return false; 
  }
}

//Funcion para liberar espacio en la cafetería
function liberarEspacioEnCafeteria() {
  Semaphore.leave(1);
  console.log('Se ha liberado un espacio en la cafetería.');
}

// Función para simular la llegada constante de estudiantes
async function llegadaEstudiantes() {
    let contadorEstudiantes = 1;
    
    while (true) {
    
      const estudiante = `Estudiante ${contadorEstudiantes}`;
      await entrarCafeteria(estudiante);
      contadorEstudiantes++;

      await new Promise(resolve => setTimeout(resolve, 3000));
    }
}

// llamada de funcion
llegadaEstudiantes();

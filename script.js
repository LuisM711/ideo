onload = (event) => {
  agregarRestriccion();
  agregarRestriccion();
  document.getElementById("funcion-objetivo").value = "40x+50y";
  document.getElementById("restriccion1").value = "125x+200y<=5000";
  document.getElementById("restriccion2").value = "150x+100y<=3000";
  document.getElementById("restriccion3").value = "67x+25y<=1000";
}
let letrasMayusculas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
agregarRestriccion = () => {
  var restricciones = document.getElementById("restricciones");
  var numRestricciones = restricciones.childElementCount;
  var nuevaRestriccion = document.createElement("div");
  nuevaRestriccion.innerHTML = `
      <label for="restriccion${numRestricciones}">
        Restricción ${numRestricciones}:
      </label>
      <input type="text" id="restriccion${numRestricciones}" name="restriccion${numRestricciones}">
    `;
  restricciones.appendChild(nuevaRestriccion);
}
calcularPuntos = (ecuacion) => {
  // Separar los coeficientes y el término constante
  const [a, b, c] = ecuacion.split(/x\+|y\=/).map(Number);

  // Calcular los puntos
  const punto1 = { x: 0, y: c / b };
  const punto2 = { x: c / a, y: 0 };

  // Devolver los puntos
  return [punto1, punto2];
}
convertirIgual = (restriccion = "") => {
  if (restriccion.includes("<=")) return restriccion.replace("<=", "=");
  else if (restriccion.includes(">=")) return restriccion.replace(">=", "=");
  else if (restriccion.includes("<=")) return restriccion.replace("<=", "=");
  else if (restriccion.includes("=")) return restriccion.replace("=", "=");
  else console.log("error inecuacion");
}
graficar = () => {
  var objetivo = document.getElementById("objetivo").value;
  var restriccionesInputs = document.querySelectorAll("#restricciones input");
  var restricciones = [];
  let arregloInecuaciones = [];
  for (var i = 0; i < restriccionesInputs.length; i++) {
    arregloInecuaciones.push(restriccionesInputs[i].value);
    var restriccion = convertirIgual(restriccionesInputs[i].value);
    if (restriccion) {
      restricciones.push(calcularPuntos(restriccion));
    }
  }
  arregloInecuaciones.push("x>=0");
  arregloInecuaciones.push("y>=0");
  var ggbApp = new GGBApplet({
    "appName": "classic",
    //"material_id": "mwH6n8f6",
    "width": 800,
    "height": 600,
    "showToolBar": true,
    "showMenuBar": true,
    "showAlgebraInput": true,
    "allowUpscale": true,
    "enableLabelDrags": true,
    "enableShiftDragZoom": true,
    "capturingThreshold": null,
    "borderColor": null,
    "preventFocus": false,
    "useBrowserForJS": false,
    "isUnbundled": false,
    "rounding": null,
    "errorDialogsActive": true,
    "synchronizationURL": null,
    "synchronizationInterval": null,
    "synchronizationTimeout": null,
    "enableUndoRedo": true,
    "enableRightClick": true,
    //"showAnimationButton":false,
    //"showFullscreenButton":false,
    //"showSuggestionButtons":false,
    appletOnLoad(api) {
      api.setRounding("5");
      api.evalCommand(codigoGeoGebra);
      //api.evalCommand("Punto = Vertex(regionFactible)");
      //api.evalCommand("Unique(Vertex(regionFactible))");
      let listaPuntosRegionFactible = [];
      let nombrePuntos = api.evalCommandGetLabels("Punto = Vertex(regionFactible)").split(",");

      //console.log(nombrePuntos);
      //console.log(api.getValueString(nombrePuntos[0]));
      //let valor = api.evalCommandCAS(nombrePuntos[0]);
      for (let i = 0; i < nombrePuntos.length; i++) {
        let valor = (`${api.getValueString(nombrePuntos[i])}`.split('='));
        //console.log(valor);
        listaPuntosRegionFactible.push({ "Nombre": nombrePuntos[i], x: valor[1].split(',')[0].replace(/[^0-9.]+/g, ""), y: valor[1].split(',')[1].replace(/[^0-9.]+/g, "") });
        //console.log(listaPuntosRegionFactible);
      }
      const pointsWithSameCoords = JSON.parse(encontrarCoincidencias(listaPuntosRegionFactible));
      //->console.log(pointsWithSameCoords);
      //console.log(listaPuntosRegionFactible);
      let xmax = 0;
      let ymax = 0;
      restricciones.forEach((value, index) => {
        //console.log(index,value);
        if (restricciones[index][0].x > xmax) xmax = restricciones[index][0].x;
        if (restricciones[index][1].x > xmax) xmax = restricciones[index][1].x;

        if (restricciones[index][0].y > ymax) ymax = restricciones[index][0].y;
        if (restricciones[index][1].y > ymax) ymax = restricciones[index][1].y;

      });
      api.setCoordSystem(-5, xmax + 5, -5, ymax + 5);
      let codigo = "";
      //alert(api.getValue("F.y"));
      api.deleteObject("Punto_{2}");
      let count = 0;
      for (count = 0; count < pointsWithSameCoords.length; count++) {
        //codigo+=`PuntoRF${i+1} = Intersect(x=${pointsWithSameCoords[i].x},y=${pointsWithSameCoords[i].y})`;
        codigo += `${letrasMayusculas[count]} = Intersect(x=${pointsWithSameCoords[count].x},y=${pointsWithSameCoords[count].y})`;

        codigo += "\n";
      }
      api.evalCommand(codigo);

      //api.setVisible("A",false);
      for (let i = 0; i < c; i++) {
        api.setVisible(`Punto${i+1}`,false);
        if(i%2==0)api.setVisible(`Seg${i+1}y${i+2}`,false);
      }
      api.setLabelVisible('regionFactible',false);
      api.setPointSize('A',8);
      let evaluacion = document.createElement("div");
      evaluacion.innerHTML = "<h2>Encontrando la solucion optima</h2>";
      evaluacion.innerHTML += "<p>";
      
      for(let i = 0;i < pointsWithSameCoords.length;i++)
      {
        evaluacion.innerHTML+=`
        ${letrasMayusculas[i]}(${pointsWithSameCoords[i].x},
          ${pointsWithSameCoords[i].y}) = aun no hago esto`;
        evaluacion.innerHTML+="<br>";
      }
      evaluacion.innerHTML+="</p>"
      document.getElementById("evaluacion").appendChild(evaluacion);
      //Color
      //api.setColor('A',255,0,0);
      //api.setLineStyle("A",3);
    }

  }, 'ggbApplet');
  let codigoGeoGebra = "";
  let c = 0;

  restricciones.forEach((value, index) => {

    // codigoGeoGebra += `${letrasMayusculas[c]} = (x=${restricciones[index][0].x}, y = ${restricciones[index][0].y})`;
    // codigoGeoGebra += "\n";
    // codigoGeoGebra += `${letrasMayusculas[c + 1]} = (x=${restricciones[index][1].x}, y = ${restricciones[index][1].y})`;
    // codigoGeoGebra += "\n";
    // codigoGeoGebra += `Seg${letrasMayusculas[c]}${letrasMayusculas[c + 1]} = Segment(${letrasMayusculas[c]},${letrasMayusculas[c + 1]})`;
    // codigoGeoGebra += "\n";
    codigoGeoGebra += `Punto${c + 1} = Intersect(x=${restricciones[index][0].x}, y = ${restricciones[index][0].y})`;
    codigoGeoGebra += "\n";
    codigoGeoGebra += `Punto${c + 2} = Intersect(x=${restricciones[index][1].x}, y = ${restricciones[index][1].y})`;
    codigoGeoGebra += "\n";
    codigoGeoGebra += `Seg${c + 1}y${c + 2} = Segment(Punto${c + 1},Punto${c + 2})`;
    codigoGeoGebra += "\n";

    //∧
    c += 2;
  });
  codigoGeoGebra += "regionFactible = ("
  for (let i = 0; i < arregloInecuaciones.length; i++) {
    codigoGeoGebra += arregloInecuaciones[i] + "∧";
  }
  codigoGeoGebra += "x>=0∧y>=0)";
  //codigoGeoGebra += "Vertex(regionFactible)";
  codigoGeoGebra += "\n";


  ggbApp.inject('ggbApplet');
  //ggbApp.evalCommand(codigoGeoGebra);
}
// function feasibleRegion(inequalities) {
//   let points = [];
//   for (let i = 0; i < inequalities.length; i++) {
//       for (let j = i + 1; j < inequalities.length; j++) {
//           let eq1 = inequalities[i];
//           let eq2 = inequalities[j];
//           if (eq1.includes('x') && eq1.includes('y') && eq2.includes('x') && eq2.includes('y')) {
//               let a1 = parseFloat(eq1.split('x')[0]);
//               let b1 = parseFloat(eq1.split('x')[1].split('y')[0]);
//               let c1 = parseFloat(eq1.split('y')[1].split('=')[1]);
//               let a2 = parseFloat(eq2.split('x')[0]);
//               let b2 = parseFloat(eq2.split('x')[1].split('y')[0]);
//               let c2 = parseFloat(eq2.split('y')[1].split('=')[1]);
//               let det = a1 * b2 - a2 * b1;
//               if (det != 0) {
//                   let x = (c1 * b2 - c2 * b1) / det;
//                   let y = (a1 * c2 - a2 * c1) / det;
//                   if (isFeasible(x, y, inequalities)) {
//                       points.push({x: x, y: y});
//                   }
//               }
//           }
//       }
//   }
//   return {points: points};
// }

// function isFeasible(x, y, inequalities) {
//   for (let i = 0; i < inequalities.length; i++) {
//       let eq = inequalities[i];
//       if (eq.includes('x') && eq.includes('y')) {
//           let a = parseFloat(eq.split('x')[0]);
//           let b = parseFloat(eq.split('x')[1].split('y')[0]);
//           let c = parseFloat(eq.split('y')[1].split('=')[1]);
//           if (eq.includes("<=")) {
//               if (a * x + b * y > c) {
//                   return false;
//               }
//           } else if (eq.includes(">=")) {
//               if (a * x + b * y < c) {
//                   return false;
//               }
//           } else if (eq.includes("=")) {
//               if (a * x + b * y != c) {
//                   return false;
//               }
//           }
//       } else if (eq.includes('x')) {
//           let a = parseFloat(eq.split('x')[0]);
//           let c = parseFloat(eq.split('=')[1]);
//           if (eq.includes("<=")) {
//               if (a * x > c) {
//                   return false;
//               }
//           } else if (eq.includes(">=")) {
//               if (a * x < c) {
//                   return false;
//               }
//           } else if (eq.includes("=")) {
//               if (a * x != c) {
//                   return false;
//               }
//           }
//       } else if (eq.includes('y')) {
//           let a = parseFloat(eq.split('y')[0]);
//           let c = parseFloat(eq.split('=')[1]);
//           if (eq.includes("<=")) {
//               if (a * y > c) {
//                   return false;
//               }
//           } else if (eq.includes(">=")) {
//               if (a * y < c) {
//                   return false;
//               }
//           } else if (eq.includes("=")) {
//               if (a * y != c) {
//                   return false;
//               }
//           }
//       }
//   }
//   return true;
// }
// encontrarCoincidencias = (datos) =>{
//   let resultados = [];
//   for (let i = 0; i < datos.length; i++) {
//     for (let j = i + 1; j < datos.length; j++) {
//       if (datos[i].x === datos[j].x && datos[i].y === datos[j].y) {
//         resultados.push(datos[i].Nombre);
//         resultados.push(datos[j].Nombre);
//       }
//     }
//   }
//   return resultados;
// }
// function encontrarCoincidenciasS(array) {
//   const coordenadas = {};
//   for (let i = 0; i < array.length; i++) {
//     const coordenada = array[i].x + ',' + array[i].y;
//     if (coordenada in coordenadas) {
//       coordenadas[coordenada].push(array[i].Nombre);
//     } else {
//       coordenadas[coordenada] = [array[i].Nombre];
//     }
//   }

//   const nombresCoincidentes = Object.values(coordenadas).filter(nombres => nombres.length > 1);
//   if (nombresCoincidentes.length === 0) {
//     return null; // retorna null si no se encuentran coincidencias
//   }

//   const nombres = nombresCoincidentes.flat();
//   return nombres.join(', '); // retorna una cadena con los nombres separados por comas
// }
function encontrarCoincidencias(array) {
  let puntosRepetidos = [];
  let puntosFinales = [];

  array.forEach((punto, index) => {
    const { Nombre, x, y } = punto;
    const indexDuplicado = puntosRepetidos.findIndex(p => p.x === x && p.y === y);

    if (indexDuplicado >= 0) {
      // El punto ya ha sido registrado antes
      puntosRepetidos[indexDuplicado].nombres.push(Nombre);
    } else {
      // El punto es único
      puntosRepetidos.push({ x, y, nombres: [Nombre] });
    }
  });

  puntosRepetidos.forEach(punto => {
    // Guardar solo el último nombre en puntosFinales
    puntosFinales.push({ Nombre: punto.nombres.pop(), x: punto.x, y: punto.y });
  });

  return JSON.stringify(puntosFinales);
}



onload = (event) => {
  agregarRestriccion();
  agregarRestriccion();
  document.getElementById("funcion-objetivo").value = "40x+50y";
  document.getElementById("restriccion1").value = "125x+200y<=5000";
  document.getElementById("restriccion2").value = "150x+100y<=3000";
  document.getElementById("restriccion3").value = "67x+25y<=1000";
}
let letrasMayusculas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
function agregarRestriccion() {
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
function calcularPuntos(ecuacion) {
  // Separar los coeficientes y el término constante
  const [a, b, c] = ecuacion.split(/x\+|y\=/).map(Number);

  // Calcular los puntos
  const punto1 = { x: 0, y: c / b };
  const punto2 = { x: c / a, y: 0 };

  // Devolver los puntos
  return [punto1, punto2];
}
convertirIgual = (restriccion="") =>{
  if(restriccion.includes("<="))return restriccion.replace("<=","=");
  else if(restriccion.includes(">="))return restriccion.replace(">=","=");
  else if(restriccion.includes("<="))return restriccion.replace("<=","=");
  else if(restriccion.includes("="))return restriccion.replace("=","=");
  else console.log("error inecuacion");
}
function graficar() {
  var objetivo = document.getElementById("objetivo").value;
  var restriccionesInputs = document.querySelectorAll("#restricciones input");
  var restricciones = [];
  for (var i = 0; i < restriccionesInputs.length; i++) {
    var restriccion = convertirIgual(restriccionesInputs[i].value);
    if (restriccion) {
      restricciones.push(calcularPuntos(restriccion));
    }
  } console.log(restricciones);

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
      api.evalCommand(codigoGeoGebra);
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

    }
  }, 'ggbApplet');



  // let codigoGeoGebra = `A = (x=${restricciones[0][0].x},y=${restricciones[0][0].y})`;
  // codigoGeoGebra += "\n";
  // codigoGeoGebra += `B = (x=${restricciones[0][1].x},y=${restricciones[0][1].y})`;
  // codigoGeoGebra += "\n";
  // codigoGeoGebra += `C = (x=${restricciones[1][0].x},y=${restricciones[1][0].y})`;
  // codigoGeoGebra += "\n";
  // codigoGeoGebra += `D = (x=${restricciones[1][1].x},y=${restricciones[1][1].y})`;
  // codigoGeoGebra += "\n";
  // codigoGeoGebra += `E = (x=${restricciones[2][0].x},y=${restricciones[2][0].y})`;
  // codigoGeoGebra += "\n";
  // codigoGeoGebra += `F = (x=${restricciones[2][1].x},y=${restricciones[2][1].y})`;
  // codigoGeoGebra += "\n";
  // codigoGeoGebra +="X=Segment(A,B)\nY=Segment(C,D)\nZ=Segment(E,F)";
  let codigoGeoGebra = "";
  let c = 0;

  restricciones.forEach((value, index) => {
    //console.log(index,value);

    codigoGeoGebra += `${letrasMayusculas[c]} = (x=${restricciones[index][0].x}, y = ${restricciones[index][0].y})`;
    codigoGeoGebra += "\n";
    codigoGeoGebra += `${letrasMayusculas[c + 1]} = (x=${restricciones[index][1].x}, y = ${restricciones[index][1].y})`;
    codigoGeoGebra += "\n";
    codigoGeoGebra += `Seg${letrasMayusculas[c]}${letrasMayusculas[c + 1]} = Segment(${letrasMayusculas[c]},${letrasMayusculas[c + 1]})`;
    codigoGeoGebra += "\n";
    c += 2;
  });









  ggbApp.inject('ggbApplet');
  //ggbApp.evalCommand(codigoGeoGebra);
}
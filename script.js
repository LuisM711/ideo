onload = (event) => {
  agregarRestriccion();
  agregarRestriccion();
  document.getElementById("funcion-objetivo").value = "40x+50y";
  document.getElementById("restriccion1").value = "125x+200y=5000";
  document.getElementById("restriccion2").value = "150x+100y=3000";
  document.getElementById("restriccion3").value = "67x+25y=1000";
}
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

function graficar() {
  var objetivo = document.getElementById("objetivo").value;
  var restriccionesInputs = document.querySelectorAll("#restricciones input");
  var restricciones = [];
  for (var i = 0; i < restriccionesInputs.length; i++) {
    var restriccion = restriccionesInputs[i].value;
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
      const maxX = Math.max(api.getXcoord("A"), api.getXcoord("B"));
      const maxY = Math.max(api.getYcoord("A"), api.getYcoord("B"));
    
      // Definir la caja de límites
      const boundingBox = {
        xmin: 0,
        xmax: maxX,
        ymin: 0,
        ymax: maxY
      };
    //  // Ajustar el tamaño del applet
    //  api.evalCommand(`ZoomOut(${boundingBox.ymax/4})`);
      api.setCoordSystem(boundingBox.xmin-5,boundingBox.xmax+5,boundingBox.ymin-5,boundingBox.ymax+5);
    
   
    
    }
  }, 'ggbApplet');

    
 
  // var codigoGeoGebra = `
  //   Objetivo(${objetivo});
  //   ${restriccionesString};
  //   x>0;
  //   y>0;
  //   RegionPlot(Intersection(${restriccionesString}, x>0, y>0));
  // `;
  let codigoGeoGebra = `A = (x=${restricciones[0][0].x},y=${restricciones[0][0].y})`;
  codigoGeoGebra += "\n";
  codigoGeoGebra += `B = (x=${restricciones[0][1].x},y=${restricciones[0][1].y})`;
  codigoGeoGebra += "\n";
  codigoGeoGebra += `C = (x=${restricciones[1][0].x},y=${restricciones[1][0].y})`;
  codigoGeoGebra += "\n";
  codigoGeoGebra += `D = (x=${restricciones[1][1].x},y=${restricciones[1][1].y})`;
  codigoGeoGebra += "\n";
  codigoGeoGebra += `E = (x=${restricciones[2][0].x},y=${restricciones[2][0].y})`;
  codigoGeoGebra += "\n";
  codigoGeoGebra += `F = (x=${restricciones[2][1].x},y=${restricciones[2][1].y})`;
  codigoGeoGebra += "\n";
  codigoGeoGebra +="X=Segment(A,B)\nY=Segment(C,D)\nZ=Segment(E,F)";
  
  // let codigoGeoGebra = "A = (x="+restricciones[0][0].x+",y="+restricciones[0][0].y+")\n";
  // codigoGeoGebra+="B = (x="+restricciones[0][1].x+",y="+restricciones[0][1].y+")\n";
  // codigoGeoGebra+="F=Segment(A,B)\n"
  

 






  ggbApp.inject('ggbApplet');
  //ggbApp.evalCommand(codigoGeoGebra);
}
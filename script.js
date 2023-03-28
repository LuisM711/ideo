function agregarRestriccion() {
    var restricciones = document.getElementById("restricciones");
    var numRestricciones = restricciones.childElementCount;
    var nuevaRestriccion = document.createElement("div");
    nuevaRestriccion.innerHTML = `
      <label for="restriccion${numRestricciones + 1}">
        Restricción ${numRestricciones + 1}:
      </label>
      <input type="text" id="restriccion${numRestricciones + 1}" name="restriccion${numRestricciones + 1}">
    `;
    restricciones.appendChild(nuevaRestriccion);
  }
  
  function graficar() {
    var objetivo = document.getElementById("objetivo").value;
    var restriccionesInputs = document.querySelectorAll("#restricciones input");
    var restricciones = [];
    for (var i = 0; i < restriccionesInputs.length; i++) {
      var restriccion = restriccionesInputs[i].value;
      if (restriccion) {
        restricciones.push(restriccion);
      }
    }
    
    var ggbApp = new GGBApplet({
      "appName": "graphing",
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
      appletOnLoad(api){
        api.evalCommand(codigoGeoGebra);
      }
    }, 'ggbApplet');
    
    var restriccionesString = restricciones.join(", ");
    
    var codigoGeoGebra = `
      Objetivo(${objetivo});
      ${restriccionesString};
      x>0;
      y>0;
      RegionPlot(Intersection(${restriccionesString}, x>0, y>0));
    `;
    
    ggbApp.inject('ggbApplet');
    //ggbApp.evalCommand(codigoGeoGebra);
  }
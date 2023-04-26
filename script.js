onload = (event) => {
  agregarRestriccion();
  agregarRestriccion();
  agregarRestriccion();
  document.getElementById("funcion-objetivo").value = "40x+50y";
  document.getElementById("restriccion1").value = "125x+200y<=5000";
  document.getElementById("restriccion2").value = "150x+100y<=3000";
  document.getElementById("restriccion3").value = "67x+25y<=1000";
}



let letrasMayusculas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
agregarRestriccion = () => {
  let restricciones = document.getElementById("restricciones");
  let numRestricciones = restricciones.childElementCount;
  numRestricciones++;
  let nuevaRestriccion = document.createElement("div");
  nuevaRestriccion.innerHTML = `
      <label for="restriccion${numRestricciones}">
        Restricción ${numRestricciones}:
      </label>
      <input type="text" id="restriccion${numRestricciones}" class="" name="restriccion${numRestricciones}">
    `;
  restricciones.appendChild(nuevaRestriccion);
}
quitarRestriccion = () => {

  let restricciones = document.getElementById("restricciones");
  let ultimo = restricciones.lastElementChild;
  //console.log(restricciones.childElementCount)
  if (restricciones.childElementCount >= 2)
    restricciones.removeChild(ultimo);

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
  document.getElementById("aviso").innerHTML = "";
  document.getElementById("todo").hidden = true;
  if (validar()) document.getElementById("todo").hidden = false;
  else {
    avisoError("Hubo un error en los datos"); return false;
  }
  if (!validarObjetivo()) {
    avisoError("Hubo un error en la función objetivo");
    document.getElementById("todo").hidden = true;
    return false;

  } else document.getElementById("todo").hidden = false;
  var objetivo = parseInt(document.getElementById("objetivo").value);
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
    "width": 600,
    "height": 600,
    "showToolBar": false,
    "showMenuBar": false,
    "showAlgebraInput": false,
    "allowUpscale": false,
    // "enableLabelDrags": true,
    // "enableShiftDragZoom": true,
    // "capturingThreshold": null,
    // "borderColor": null,
    // "preventFocus": false,
    // "useBrowserForJS": false,
    // "isUnbundled": false,
    // "rounding": null,
    // "errorDialogsActive": true,
    // "synchronizationURL": null,
    // "synchronizationInterval": null,
    // "synchronizationTimeout": null,
    // "enableUndoRedo": true,
    // "enableRightClick": true,
    // "showAnimationButton":false,
    // "showFullscreenButton":false,
    // "showSuggestionButtons":false,
    appletOnLoad(api) {
      api.setRounding("5");
      api.evalCommand(codigoGeoGebra);
      api.setGridVisible(1);
      //api.writePNGtoFile("SoluciÃ³n.png", 1, !1, 144);
      //api.evalCommand("Punto = Vertex(regionFactible)");
      //api.evalCommand("Unique(Vertex(regionFactible))");
      let flag = true;
      let listaPuntosRegionFactible = [];
      let nombrePuntos = api.evalCommandGetLabels("Punto = Vertex(regionFactible)").split(",");
      if (nombrePuntos.length === 1) {
        avisoError("No hay puntos para trazar una región factible");
        flag = false;
      }//console.log(nombrePuntos);
      //console.log(api.getValueString(nombrePuntos[0]));
      //let valor = api.evalCommandCAS(nombrePuntos[0]);
      for (let i = 0; i < nombrePuntos.length; i++) {
        let valor = (`${api.getValueString(nombrePuntos[i])}`.split('='));
        //console.log(valor);
        listaPuntosRegionFactible.push({ "Nombre": nombrePuntos[i], x: valor[1].split(',')[0].replace(/[^0-9.]+/g, ""), y: valor[1].split(',')[1].replace(/[^0-9.]+/g, "") });
        //console.log(listaPuntosRegionFactible);
      }
      const puntosConLasMismasCoordenadas = JSON.parse(encontrarCoincidencias(listaPuntosRegionFactible));
      let xmax = 0;
      let ymax = 0;
      restricciones.forEach((value, index) => {
        //console.log(index,value);
        if (restricciones[index][0].x > xmax && restricciones[index][0].x != Infinity) xmax = restricciones[index][0].x;
        if (restricciones[index][1].x > xmax && restricciones[index][1].x != Infinity) xmax = restricciones[index][1].x;

        if (restricciones[index][0].y > ymax && restricciones[index][0].y != Infinity) ymax = restricciones[index][0].y;
        if (restricciones[index][1].y > ymax && restricciones[index][1].y != Infinity) ymax = restricciones[index][1].y;

      });
      //console.log(xmax, ymax);
      api.setCoordSystem(-5, xmax + 5, -5, ymax + 5);
      let codigo = "";
      api.deleteObject("Punto_{2}");
      let count = 0;
      for (count = 0; count < puntosConLasMismasCoordenadas.length; count++) {
        //codigo+=`PuntoRF${i+1} = Intersect(x=${puntosConLasMismasCoordenadas[i].x},y=${puntosConLasMismasCoordenadas[i].y})`;
        codigo += `${letrasMayusculas[count]} = Intersect(x=${puntosConLasMismasCoordenadas[count].x},y=${puntosConLasMismasCoordenadas[count].y})`;

        codigo += "\n";
      }
      api.evalCommand(codigo);
      for (count = 0; count < puntosConLasMismasCoordenadas.length; count++) {
        api.setCaption(`${letrasMayusculas[count]}`, "Hola");
        api.setColor(`${letrasMayusculas[count]}`, 0, 0, 0);
        api.setLabelStyle(`${letrasMayusculas[count]}`, 1);
        api.setLayer(`${letrasMayusculas[count]}`, 9);
        api.setLabelVisible(`${letrasMayusculas[count]}`, !0);
        api.setColor(`${letrasMayusculas[count]}`, 128, 0, 128);
      }
      //api.setVisible("A",false);
      for (let i = 0; i < c; i++) {
        api.setVisible(`Punto${i + 1}`, false);
        // let x = api.getXcoord(`Punto${i + 1}`);
        // let y = api.getYcoord(`Punto${i + 1}`);

        // api.setCaption(`Punto${i + 1}`,`(${x},${y})`);
        if (i % 2 == 0) {
          api.setVisible(`Seg${i + 1}y${i + 2}`, true);
          api.setCaption(`Seg${i + 1}y${i + 2}`, `Restricción ${(i / 2) + 1}`);
          api.setLabelVisible(`Seg${i + 1}y${i + 2}`, true);
          api.setLabelStyle(`Seg${i + 1}y${i + 2}`, 3);
          api.setLayer(`Seg${i + 1}y${i + 2}`, 0);
          //api.setColor(`Seg${i + 1}y${i + 2}`, 0,255,0);
        }
      }
      api.setLabelVisible('regionFactible', false);
      api.setTextValue('regionFactible', "Region factible");
      //api.setPointSize('A',8);
      let funcion_objetivo = document.getElementById("funcion-objetivo").value;
      let coeficienteX = 0;
      let coeficienteY = 0;
      let signo = '';
      if (funcion_objetivo.includes('+')) {
        signo = '+';
        coeficienteX = funcion_objetivo.split('+')[0].replace(/[^0-9.]+/g, "");
        coeficienteY = funcion_objetivo.split('+')[1].replace(/[^0-9.]+/g, "");
      } else if (funcion_objetivo.includes('-')) {
        signo = '-';
        coeficienteX = funcion_objetivo.split('-')[0].replace(/[^0-9.]+/g, "");
        coeficienteY = funcion_objetivo.split('-')[1].replace(/[^0-9.]+/g, "");
      } else console.log("error en coeficiente F O");




      let evaluacion = document.createElement("div");
      evaluacion.innerHTML = "<h2>Encontrando la solucion optima</h2>";
      evaluacion.innerHTML += `<h2>Funcion objetivo: <u>${funcion_objetivo}</u></h2>`;
      evaluacion.innerHTML += "<p>";
      let valor = [];
      let can = 0;
      for (let i = 0; i < puntosConLasMismasCoordenadas.length; i++) {
        signo == '+' ? can = Number((coeficienteX * puntosConLasMismasCoordenadas[i].x) + (coeficienteY * puntosConLasMismasCoordenadas[i].y)).toFixed(2) : can = Number((coeficienteX * puntosConLasMismasCoordenadas[i].x) - (coeficienteY * puntosConLasMismasCoordenadas[i].y)).toFixed(2);
        valor.push({ "letra": String.fromCharCode(64 + i + 1), "x": puntosConLasMismasCoordenadas[i].x, "y": puntosConLasMismasCoordenadas[i].y, "index": i + 1, "cantidad": can });
        evaluacion.innerHTML += `
        ${letrasMayusculas[i]}(${puntosConLasMismasCoordenadas[i].x},
          ${puntosConLasMismasCoordenadas[i].y}) = ${coeficienteX}(${puntosConLasMismasCoordenadas[i].x})${signo}${coeficienteY}(${puntosConLasMismasCoordenadas[i].y}) = ${valor[i].cantidad}`;
        evaluacion.innerHTML += "<br>";
      }
      evaluacion.innerHTML += "</p>"
      let maximo = Math.max(...(valor.map(valor => parseFloat(valor.cantidad))));
      const registro_mayor_cantidad = valor.reduce((max, obj) => {
        const cantidad = parseFloat(obj.cantidad);
        return cantidad > max.cantidad ? { ...obj } : { ...max };
      });
      const registro_menor_cantidad = valor.reduce((min, obj) => {
        const cantidad = parseFloat(obj.cantidad);
        return cantidad < min.cantidad ? { ...obj } : { ...min };
      });
      //console.log(valor);






      // Obtener el elemento contenedor
      const contenedor = document.getElementById('tabla');
      contenedor.innerHTML = "";
      // Crear el elemento tabla
      const tabla = document.createElement('table');
      tabla.classList.add('table', 'table-striped');
      tabla.style.border = "1px solid";
      // Crear el elemento cabecera
      const cabecera = document.createElement('thead');
      const filaCabecera = document.createElement('tr');

      // Crear las celdas de la cabecera
      const celdaPunto = document.createElement('th');
      celdaPunto.textContent = 'Punto';

      const celdaCoordenadas = document.createElement('th');
      celdaCoordenadas.textContent = 'Coordenadas(X,Y)';

      const celdaEvaluacion = document.createElement('th');
      celdaEvaluacion.textContent = `Evaluación con la función objetivo z = ${funcion_objetivo}`;

      // Agregar las celdas a la fila de la cabecera
      filaCabecera.appendChild(celdaPunto);
      filaCabecera.appendChild(celdaCoordenadas);
      filaCabecera.appendChild(celdaEvaluacion);

      // Agregar la fila de la cabecera al elemento cabecera
      cabecera.appendChild(filaCabecera);

      // Agregar la cabecera a la tabla
      tabla.appendChild(cabecera);

      // Agregar la tabla al contenedor
      contenedor.appendChild(tabla);
      // Obtener el elemento cuerpo de la tabla
      const cuerpo = document.createElement('tbody');

      // Recorrer los datos y crear las filas y celdas correspondientes
      valor.forEach((dato, indice) => {
        const fila = document.createElement('tr');

        const celdaPunto = document.createElement('td');
        celdaPunto.textContent = dato.letra;

        const celdaCoordenadas = document.createElement('td');
        celdaCoordenadas.textContent = `${dato.x}, ${dato.y}`;

        const celdaEvaluacion = document.createElement('td');
        celdaEvaluacion.innerHTML = `${coeficienteX}(${Number(valor[indice].x)}) ${signo == '+' ? '+' : '-'}${coeficienteY}(${valor[indice].y}) = <strong> ${(signo == '+' ? coeficienteX * valor[indice].x + coeficienteY * valor[indice].y : coeficienteX * valor[indice].x - coeficienteY * valor[indice].y).toFixed(2)}</strong>`;

        // Agregar las celdas a la fila
        fila.appendChild(celdaPunto);
        fila.appendChild(celdaCoordenadas);
        fila.appendChild(celdaEvaluacion);

        // Agregar la fila al cuerpo de la tabla
        cuerpo.appendChild(fila);
      });

      // Obtener la tabla y agregar el cuerpo

      tabla.appendChild(cuerpo);
      /*
      <div class="alert alert-success" role="alert">
  <h4 class="alert-heading">Well done!</h4>
  <p>Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.</p>
  <hr>
  <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
</div>
      
      */
      let alerta = document.createElement("div");
      alerta.classList.add("alert", "alert-success");
      let header4 = document.createElement("h4");
      header4.textContent = "Solución óptima";
      alerta.appendChild(header4);
      let parr = document.createElement("p");
      let contexto = document.createElement("p");
      let arreglo = [];
      //console.log(registro_mayor_cantidad, registro_menor_cantidad, signo);
      if (objetivo == 1) {
        arreglo.push(valor[registro_mayor_cantidad.index - 1].x)
        arreglo.push(valor[registro_mayor_cantidad.index - 1].y);
        if (signo == '+')
          parr.innerHTML = `La solución óptima es Z = <strong> ${(coeficienteX * arreglo[0] + coeficienteY * arreglo[1]).toFixed(2)}</strong>`;
        else
          parr.innerHTML = `La solución óptima es Z = <strong> ${(coeficienteX * arreglo[0] - coeficienteY * arreglo[1]).toFixed(2)}</strong>`;

      } else {
        arreglo.push(valor[registro_menor_cantidad.index - 1].x)
        arreglo.push(valor[registro_menor_cantidad.index - 1].y);
        if (signo == '-')
          parr.textContent = `La solución óptima es Z = <strong>${(coeficienteX * arreglo[0] - coeficienteY * arreglo[1]).toFixed(2)}</strong>`;
        else
          parr.textContent = `La solución óptima es Z = <strong>${(coeficienteX * arreglo[0] + coeficienteY * arreglo[1]).toFixed(2)}</strong>`;
      }
      alerta.appendChild(parr);
      alerta.appendChild(document.createElement("hr"));
      contexto.innerHTML = `Se obtiene con los valores <u>X = ${arreglo[0]}</u> y <u>Y = ${arreglo[1]}</u>`;
      alerta.appendChild(contexto);
      contenedor.appendChild(alerta);













      if (objetivo === 1) {
        api.setColor(letrasMayusculas[registro_mayor_cantidad.index - 1], 255, 0, 0);
        api.setPointSize(letrasMayusculas[registro_mayor_cantidad.index - 1], 9);
        api.setLineThickness(letrasMayusculas[registro_mayor_cantidad.index - 1], 10);
        marcarFila(registro_mayor_cantidad.index - 1);
        evaluacion.innerHTML += `<h3>Solución óptima: x = ${puntosConLasMismasCoordenadas[registro_mayor_cantidad.index - 1].x}, y = ${puntosConLasMismasCoordenadas[registro_mayor_cantidad.index - 1].y} = ${registro_mayor_cantidad.cantidad}</h3>`;

      }
      else if (objetivo === 2) {
        api.setColor(letrasMayusculas[registro_menor_cantidad.index - 1], 255, 0, 0);
        api.setPointSize(letrasMayusculas[registro_menor_cantidad.index - 1], 9);
        api.setLineThickness(letrasMayusculas[registro_menor_cantidad.index - 1], 10);
        marcarFila(registro_menor_cantidad.index - 1);
        evaluacion.innerHTML += `<h3>Solución óptima: x = ${puntosConLasMismasCoordenadas[registro_menor_cantidad.index - 1].x}, y = ${puntosConLasMismasCoordenadas[registro_menor_cantidad.index - 1].y} = ${registro_menor_cantidad.cantidad}</h3>`;

      }
      else {

      }
      document.getElementById("evaluacion").innerHTML = "";
      if (flag)
        document.getElementById("tabla").hidden = false;
      else document.getElementById("tabla").hidden = true;

      //Color
      //api.setColor('A',255,0,0);
      //api.setLineStyle("A",3);
    }

  }, 'ggbApplet');
  let codigoGeoGebra = "";
  let c = 0;

  restricciones.forEach((value, index) => {


    codigoGeoGebra += `Punto${c + 1} = Intersect(x=${restricciones[index][0].x}, y = ${restricciones[index][0].y})`;
    codigoGeoGebra += "\n";
    codigoGeoGebra += `Punto${c + 2} = Intersect(x=${restricciones[index][1].x}, y = ${restricciones[index][1].y})`;
    codigoGeoGebra += "\n";
    codigoGeoGebra += `Seg${c + 1}y${c + 2} = Segment(Punto${c + 1},Punto${c + 2})`;
    codigoGeoGebra += "\n";


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
avisoError = (mensaje = "") => {
  let aviso = document.createElement("div");
  aviso.role = "alert";
  aviso.classList.add("alert");
  aviso.classList.add("alert-danger");

  aviso.innerHTML = mensaje;
  let DOMaviso = document.getElementById("aviso");
  DOMaviso.innerHTML = '';
  DOMaviso.appendChild(aviso);
}
validar = () => {
  let totalRestricciones = document.getElementById("restricciones").childElementCount;
  for (let i = 1; i < totalRestricciones; i++) {
    if (document.getElementById(`restriccion${i}`).value == "") return false;
    if (!reconocerInecuacion(document.getElementById(`restriccion${i}`).value)) return false;
  }
  return true;
}
validarObjetivo = () => {
  let re = /^\d*\.?\d+x\s*[+-]\s*\d*\.?\d+y$/i;
  return re.test(document.getElementById("funcion-objetivo").value);
}
reconocerInecuacion = (str) => {
  //var re = /^(-?\d*\.?\d+|\d*[a-z]|\d+)\s*[+]\s*(-?\d*\.?\d+|\d*[a-z]|\d+)\s*([<>]?=)\s*(-?\d*\.?\d+)$/;
  let re = /^\d*(?:\.\d+)?x\s*[+-]\s*\d*(?:\.\d+)?y\s*(?:>=|<=)\s*\d*(?:\.\d+)?$/i;
  return re.test(str);
}
limpiar = () => {
  let totalRestricciones = document.getElementById("restricciones").childElementCount;
  for (let i = 1; i < totalRestricciones; i++) {
    document.getElementById(`restriccion${i}`).value = "";
  }
  document.getElementById("funcion-objetivo").value = "";
  document.getElementById("objetivo").value = "1";
  document.getElementById("todo").hidden = true;
}
marcarFila = (index) => {
  const filas = document.querySelectorAll('tbody tr');
  filas[index].classList.add('marcada');
}

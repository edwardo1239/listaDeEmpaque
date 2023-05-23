const hojaContenedores = SpreadsheetApp.openById(
  "198pggmyEHTb7Mmb9YYXuJomzYnvdNN1yyGZkFsAvXG0"
).getSheetByName("contenedores");

function doGet() {
  return HtmlService.createTemplateFromFile("ListaDeEmpaque")
    .evaluate()
    .setTitle("Lista de empaque")
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0");
}

function obtenerDatosHtml(nombre) {
  return HtmlService.createHtmlOutputFromFile(nombre).getContent();
}

function cargarContenedores() {
  let nContenedor = hojaContenedores
    .getRange(2, 2, hojaContenedores.getLastRow() - 1, 3)
    .getValues();
  //let clienteContenedor = hojaContenedores.getRange(2,3,hojaContenedores.getLastRow()-1,1).getValues();
  return nContenedor;
}

function abrirListaEmpaque(nContenedor) {
  let listaEmpaque = SpreadsheetApp.openById(nContenedor);
  let numeroCajas = listaEmpaque.getRange("C2:C").getValues();
  let pallet = listaEmpaque.getRange("I2:I").getValues();
  let total = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
  };

  for (let i = 1; i <= 20; i++) {
    for (let j = 0; j < numeroCajas.length; j++) {
      if (pallet[j] == i) {
        total[i] = parseInt(numeroCajas[j]) + parseInt(total[i]);
      }
    }
  }
  return total;
}

function obtenerLote() {
  const baseDatosLote = SpreadsheetApp.openById(
    "1XyD6drg_JcmNxB6KtFt8RJLDPJ-xXKSjHJDPRKsXK6M"
  );
  const loteVaciando = baseDatosLote
    .getSheetByName("vaciando")
    .getRange(2, 1, 1, 3)
    .getValues();

  return loteVaciando;
}

function sumCaja(loteActual, operacion) {
  const fileListaEmpaque = SpreadsheetApp.openById(loteActual.idContenedor);
  const listaEmpaque = fileListaEmpaque.getSheetByName("contenedor");
  const datosGenerales = fileListaEmpaque.getSheetByName("datosGeneral");
  const datosListaEmpaque = listaEmpaque.getRange("A2:I").getValues();

  const date = new Date();
  const fecha =
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    "  " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();
  //const nCajas = listaEmpaque.getRange(2,3,listaEmpaque,getLastRow(),1).getValues();
  let x = 0;

  switch (operacion) {
    case "suma":
      //buscar el lote y sumar una caja o crear el lote en caso de que no exista aun
      for (let i = 0; i < datosListaEmpaque.length; i++) {
        if (
          loteActual.lote == datosListaEmpaque[i][1] &&
          loteActual.calidad == datosListaEmpaque[i][4] &&
          loteActual.caja == datosListaEmpaque[i][5] &&
          
          loteActual.calibre == datosListaEmpaque[i][7] &&
          loteActual.pallet == datosListaEmpaque[i][8]
        ) {
          //se suma la caja si existe el lote
          let nCajas = listaEmpaque.getRange(i + 2, 3).getValue();
          let nKilos = listaEmpaque.getRange(i + 2, 7).getValue();
          nCajas += parseInt(loteActual.noCajas);
          nKilos += parseInt(loteActual.peso) * parseInt(loteActual.noCajas);
          listaEmpaque.getRange(i + 2, 3).setValue(nCajas);
          listaEmpaque.getRange(i + 2, 7).setValue(nKilos);
          x = 1;
          break;
        }
      }
      // si no esta el lote en la lista de empaque ingresa la nueva fila
      if (x == 0) {
        //se ingresa la fecha de inicio la primera vez que se agrega un dato.
        if (datosGenerales.getRange("A2").getValue() == "") {
          datosGenerales.getRange("A2").setValue(fecha);
        }
        
        // se guardan los datos en una nueva fila
        let k;
        k = loteActual.noCajas * loteActual.peso;
        listaEmpaque.appendRow([
          loteActual.enf,
          loteActual.lote,
          loteActual.noCajas,
          fecha,
          loteActual.calidad,
          loteActual.caja,
          k,
          loteActual.calibre,
          loteActual.pallet,
          loteActual.nombrePredio,
        ]);
      }

      let objTabla = abrirListaEmpaque(loteActual.idContenedor);

      return objTabla;

    case "resta":
      //buscar el lote y sumar una caja o crear el lote en caso de que no exista aun
      for (let i = 0; i < datosListaEmpaque.length; i++) {
        if (
          loteActual.lote == datosListaEmpaque[i][1] &&
          loteActual.calidad == datosListaEmpaque[i][4] &&
          loteActual.caja == datosListaEmpaque[i][5] &&
          loteActual.calibre == datosListaEmpaque[i][7] &&
          loteActual.pallet == datosListaEmpaque[i][8]
        ) {
          //se suma la caja si existe el lote
          let nCajas = listaEmpaque.getRange(i + 2, 3).getValue();
          let nKilos = listaEmpaque.getRange(i + 2, 7).getValue();
          nCajas -= parseInt(loteActual.noCajas);
          nKilos -= parseInt(loteActual.noCajas) * loteActual.peso;
          listaEmpaque.getRange(i + 2, 3).setValue(nCajas);
          listaEmpaque.getRange(i + 2, 7).setValue(nKilos);
          x = 1;
          break;
        }
      }
      let objTabla1 = abrirListaEmpaque(loteActual.idContenedor);
      return objTabla1;
  }
}

function terminarContenedor(loteActual) {
  const borrarCont = hojaContenedores.getRange("D2:D").getValues();
  const contenedor = SpreadsheetApp.openById(loteActual.idContenedor);
  const totalContenedor = contenedor.getSheetByName("datosGeneral");
  const numContenedor = contenedor.getName();
  const loteListaEmp = contenedor
    .getSheetByName("contenedor")
    .getRange(2, 2, contenedor.getLastRow() - 1, 1)
    .getValues();
  const cajaList = contenedor
    .getSheetByName("contenedor")
    .getRange(2, 3, contenedor.getLastRow() - 1, 1)
    .getValues();
  const nombrePredio = contenedor
    .getSheetByName("contenedor")
    .getRange(2, 10, contenedor.getLastRow() - 1, 1)
    .getValues();
  const arrCalibre = contenedor
    .getSheetByName("contenedor")
    .getRange(2, 8, contenedor.getLastRow() - 1, 1)
    .getValues();
  const arrKilos = contenedor
    .getSheetByName("contenedor")
    .getRange(2, 7, contenedor.getLastRow() - 1, 1)
    .getValues();
  //se abre la hoja de la matriz
  const fileMatriz = SpreadsheetApp.openById("1XyD6drg_JcmNxB6KtFt8RJLDPJ-xXKSjHJDPRKsXK6M");
  const  matriz = fileMatriz.getSheetByName("BaseDatosIngresos");
  const nLoteMatriz = matriz.getRange(2,2,matriz.getLastRow()-1, 1).getValues();
 
  //objeto que contendra la informacion por lote
  let loteX = {};
  //objeto que guardara la informacion por calibre
  let calibre = {};

  let nombrePredioPlano = nombrePredio.flat();
  let arrCalibrePlano = arrCalibre.flat();
  
  
  //se elimina el dato del contenedor que se acabo de termianr
  // for(let i=0; i<borrarCont.length; i++){
  //   if(loteActual.idContenedor == borrarCont[i]){
  //     hojaContenedores.deleteRow(i+2);
  //     break;
  //   }
  // }
  //fecha enq ue se finalizo el contenedor
  const date = new Date();
  const fecha =
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    "  " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();

  totalContenedor.getRange("B2").setValue(fecha);


  //total de cajas
  let totalCajas = 0;
  for(x of cajaList){
    totalCajas += parseInt(x[0]);
  }
  totalContenedor.getRange(2, 3).setValue(totalCajas);

  //se suman los datos por calibre
let ii = 0;

for(x of arrCalibrePlano){
  if(calibre.hasOwnProperty(x)){
    calibre[x].cajas +=parseInt(cajaList[ii]);
    calibre[x].kilos +=parseInt(arrKilos[ii]);
  }
  else{
    calibre[x] = {cajas:0, kilos:0};
    calibre[x].cajas +=parseInt(cajaList[ii]);
    calibre[x].kilos +=parseInt(arrKilos[ii]);
  }

  ii++;
}

ii = 0;
for(n in calibre){
  totalContenedor.getRange(5+ii,1).setValue(n);
  totalContenedor.getRange(5+ii,2).setValue(calibre[n].cajas);
  totalContenedor.getRange(5+ii,3).setValue(calibre[n].kilos);
  ii++;
}


  // se suman los datos por lote
  for (let i = 0; i < loteListaEmp.length; i++) {
    if (!loteX.hasOwnProperty(loteListaEmp[i])) {
      loteX[loteListaEmp[i]] = {};
      loteX[loteListaEmp[i]]["Nombre predio"] = nombrePredioPlano[i];
      loteX[loteListaEmp[i]]["Numero de cajas"] = 0;
      loteX[loteListaEmp[i]]["Kilos"] = 0;

      loteX[loteListaEmp[i]]["Numero de cajas"] += parseInt(cajaList[i]);
      loteX[loteListaEmp[i]]["Kilos"] += parseInt(arrKilos[i]);
    } else {
      loteX[loteListaEmp[i]]["Numero de cajas"] += parseInt(cajaList[i]);
      loteX[loteListaEmp[i]]["Kilos"] += parseInt(arrKilos[i]);
    }
  }
  let i = 0;

  //se agrega el resumen de la cantidad de cajas y kilos por lote

  for (n in loteX) {
    totalContenedor.getRange(14 + i, 1).setValue(loteX[n]["Nombre predio"]);
    totalContenedor.getRange(14 + i, 2).setValue(n);
    totalContenedor.getRange(14 + i, 3).setValue(loteX[n]["Numero de cajas"]);
    totalContenedor.getRange(14 + i, 4).setValue(loteX[n]["Kilos"]);

      //agregar a la matriz
    for(let iLote=nLoteMatriz.length-1; iLote>=0; iLote--){
    
      if(nLoteMatriz[iLote][0] == n){
        let kilosExp = matriz.getRange(iLote+2,28).getValue();
        kilosExp += loteX[n]["Kilos"];
        matriz.getRange(iLote+2,28).setValue(kilosExp);

        let contenedoresLote = matriz.getRange(iLote+2,29).getValue()
        contenedoresLote += " " + numContenedor
        matriz.getRange(iLote+2,29).setValue(contenedoresLote);
   
       
      }
    }

    i++;
  }


  

  
  
}

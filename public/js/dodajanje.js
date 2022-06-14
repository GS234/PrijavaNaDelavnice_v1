var tabela;
var datoteka;
var encoding;

window.addEventListener('load', () => {
    //console.log("tole je odjemalec (dodajanje.js)");
    //let button_odpri = document.getElementById("odpriDat");
    tabela = document.getElementById("tabela_glavna");
    let datoteka_izbira = document.getElementById("datoteka_izbira");
    datoteka_izbira.addEventListener('input', ()=>{
        datoteka = datoteka_izbira.files[0]; //prvi element
        //console.log(datoteka_izbira.files[0]);
        console.log(datoteka.type);
        if(dodajPodatkeCSV(datoteka, tabela)){
            console.log("podatki uspesno dodani");
        }
        else{
            console.log("napaka pri dodajanju podatkov");
        }

    });

    let encoding_input = document.getElementById("file_encoding");
    encoding = encoding_input.value;
    encoding_input.addEventListener('change', ()=>{
        encoding = encoding_input.value;
    });
    
});

var dodajPodatkeCSV = (file, tab)=>{
    if(file.type && file.type != "text/csv"){
        console.log("nedovoljen tip datoteke");
        return 0;
    }
    tab.innerHTML = "";
    //console.log(tab);
    //console.log("neki");
    const reader = new FileReader();
    reader.readAsText(file, encoding);//'windows-1250'); //iso-8859-1
    reader.addEventListener('load', (event)=>{
        let vsebina = reader.result;
        vsebina = vsebina.replaceAll('\r', ''); //da se znebimo carriage returnov
        let vrstice = vsebina.split('\n');
        //console.log(vrstice);
        //console.log(reader.result);

        let tab_vsebina = "";
        let colMax = 0;
        for(let i = 0; i < vrstice.length; i++){ //vrstice
            tab_vsebina += "<tr id='row_"+i+"'> <td><button id='"+"btn_"+i+"' onclick='izbrisiVrstico("+i+")'>X</button></td> ";
            let polja = vrstice[i].split(',');
            if(colMax < polja.length) colMax = polja.length; //nastavimo polja
            for(let j = 0; j < polja.length; j++){
                tab_vsebina += "<td id='col_"+j+"'><input value='"+polja[j]+"'></td>";
            }
            tab_vsebina += "</tr>";
        }

        //stolpci
        let controlRow = "<tr>";
        for(let i = 0; i <= colMax; i++){
            if(i != 0) controlRow = controlRow +
                "<td id='col_"+(i-1)+"'>\
                    <button id='"+"btn_"+(i-1)+"' onclick='izbrisiStolpec("+(i-1)+")'>X</button>\
                    <button onclick='razdeliStolpec("+(i-1)+", \" \", 0)'><></button>\
                </td>";
            else controlRow = controlRow+ "<td></td>"
        }
        controlRow = controlRow + "</tr>";
        tab_vsebina = controlRow + tab_vsebina;
        tab.innerHTML = tab_vsebina;


    });
    return 1;
}

var izbrisiStolpec = (stolpecId)=>{
    //console.log("Stolpec za izbris: " + stolpecId);
    let elementiStolpca = tabela.querySelectorAll("td#col_"+stolpecId);
    for(let i = 0; i < elementiStolpca.length; i++) elementiStolpca[i].remove();
    //console.log(elementiStolpca);
};

var izbrisiVrstico = (vrsticaId)=>{
    //console.log("Vrstica za izbris: " + vrsticaId);
    let vrstica = tabela.querySelector("tr#row_"+vrsticaId);
    vrstica.remove();
};

//rabi se mal razmisleka...
var razdeliStolpec = (stolpecId, znak, opcije)=>{
    //opcije:
    /*
    0: na vse znake
    1: na prvi znak
    2: na zadnji znak
    */
    //console.log("razdeli: "+stolpecId+" "+znak+" "+opcije);
    let elementiStolpca = tabela.querySelectorAll("td#col_"+stolpecId);
    for(let i = 0; i < elementiStolpca.length; i++){
        let vrstica = tabela.querySelector("tr#row_"+i);
        console.log(vrstica);
        let element = document.createElement("td");
        //console.log(element);
        vrstica.appendChild(element);
        vrstica.insertBefore(element, elementiStolpca[i+1]);
    }
    //console.log(elementiStolpca);
};

var tab2JSON = ()=>{


};
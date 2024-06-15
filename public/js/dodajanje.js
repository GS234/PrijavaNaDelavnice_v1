var tabela;
var tabelaUndo; //bols bi blo narest dejanski sklad (ampak to zahteva pomnilnik)
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
        //vrstice
        for(let i = 0; i < vrstice.length; i++){
            tab_vsebina += "<tr id='row_"+i+"'> <td><button id='"+"btn_"+i+"' onclick='izbrisiVrstico("+i+")'>X</button></td> ";
            let polja = vrstice[i].split(','); ////DELIMITER!!
            if(colMax < polja.length) colMax = polja.length; //nastavimo polja
            for(let j = 0; j < polja.length; j++){
                tab_vsebina += "<td id='col_"+j+"'><input value='"+polja[j]+"'></td>";
            }
            tab_vsebina += "</tr>";
        }

        //stolpci
        let controlRow = "<tr>";
        for(let i = 0; i <= colMax; i++){
            if(i != 0) controlRow = controlRow + dodajKontrolnoCelico(i-1); //tole treba dodelat (ma ne bomo sam stringov lepil)
            else controlRow = controlRow+ "<td><button onclick='tabelaUndo1()'> <- </button></td>"
        }
        controlRow = controlRow + "</tr>";
        tab_vsebina = controlRow + tab_vsebina;
        tab.innerHTML = tab_vsebina;
        tab.hidden = false;
    });
    return 1;
}

var tabelaUndo1 = ()=>{
    tabPop();
};

var tabPush = ()=>{
    tabelaUndo = tabela.innerHTML;
};

var tabPop = ()=>{
    if(tabelaUndo) tabela.innerHTML = tabelaUndo;
}

var dodajKontrolnoCelico = (stolpecId)=>{ //to je treba spremenit enkrat, da se ne bo sam stringa lepil
    return  "\
        <td id='col_"+(stolpecId)+"'>\
            <button id='"+"btn_"+(stolpecId)+"' onclick='izbrisiStolpec("+(stolpecId)+")'>X</button>\
            <button onclick='razdeliStolpec("+(stolpecId)+", \" \", 0)'><></button>\
            <button onclick='normalizirajStolpec("+(stolpecId)+")'>Aa</button>\
            <input type='text' size='4' placeholder='Ime stolpca' value='"+ stolpecId +"'>\
        </td>";
        //<input type='text' size='4' placeholder='Ime stolpca' value='"+ stolpecId +"'>\ //tole rabmo, sam je treba dodelat....
};

var podatkovnaCelica = (stolpecId, podatki)=>{
    let vrni = document.createElement("td");
    vrni.id = "col_"+stolpecId;
    vrni.innerHTML = "<input value='"+podatki+"'>";
    return vrni;
};

var kontrolnaCelica = (stolpecId)=>{
    let vrni = document.createElement("td");
    vrni.id = "col_"+(stolpecId);
    vrni.innerHTML = 
                "<button id='"+"btn_"+(stolpecId)+"' onclick='izbrisiStolpec("+(stolpecId)+")'>X</button>\
                <button onclick='razdeliStolpec("+(stolpecId)+", \" \", 0)'><></button>\
                <button onclick='normalizirajStolpec("+(stolpecId)+")'>Aa</button>\
                <input type='text' size='4' placeholder='Ime stolpca' value='"+ stolpecId +"'>";
    return vrni;
};

var generirajStolpec = (tabela, podatki, kateri)=>{
    //generira stolpec iz podatkov (podatki: navadn array)
    let stolpecId = Math.floor(Math.random()*10000);
    //console.log(stolpecId);
    //console.log(podatki);
    //iteracija skozi vrstice:

    //console.log(tabela.rows);
    let vrsticeTab = tabela.rows;
    for(let i = 0; i < vrsticeTab.length; i++){
        let vrsticaa = vrsticeTab[i];

        let celiceTab = vrsticaa.cells;
        //console.log(celiceTab);

        //console.log(vrsticaa.id);
        
        if(i==0){
            //vrsticaa.innerHTML += dodajKontrolnoCelico(stolpecId);
            //celiceTab.push(kontrolnaCelica(stolpecId))//splice(1, 0, kontrolnaCelica(stolpecId));
            vrsticaa.insertBefore(kontrolnaCelica(stolpecId), (kateri != undefined)?celiceTab[kateri]:celiceTab[1]);
        }
        else{
            if(podatki[i-1] == undefined) continue;
            //console.log("-> " + podatki[i-1] + " <- ");
            //vrsticaa.innerHTML += "<td id='col_"+stolpecId+"'><input value='"+podatki[i-1]+"'></td>";
            //celiceTab.push(podatkovnaCelica(stolpecId, podatki[i-1])) //splice(1, 0, podatkovnaCelica(stolpecId, podatki[i-1]));
            vrsticaa.insertBefore(podatkovnaCelica(stolpecId, podatki[i-1]), (kateri != undefined)?celiceTab[kateri]:celiceTab[1]);
        }
        
       //console.log(celiceTab);
        //console.log(vrsticaa);
    }
};
//lahko se generiraj tabelo (podatki: json (stolpci: vrstice))
var capitalizeFirst = (niz)=>{
    return niz.charAt(0).toUpperCase() + niz.substring(1).toLowerCase();
};

var normalizirajStolpec = (stolpecId)=>{
    //funkcija nize normalizira tako, da jih spremeni v obliko z veliko zacetnico
    let elementiStolpca = tabela.querySelectorAll("td#col_"+stolpecId);
    for(let i = 0; i < elementiStolpca.length; i++){
        let inputFi = elementiStolpca[i].querySelector("input");
        
        if(inputFi){
            if(inputFi.value != ''){
                let besede = inputFi.value.split(' ');
                let normalnaVrednost = "";
                for(let b = 0; b < besede.length; b++){
                    if(b != 0) normalnaVrednost = normalnaVrednost + " ";
                    normalnaVrednost = normalnaVrednost + capitalizeFirst(besede[b]);
                }
                inputFi.value = normalnaVrednost;

            }
        }
        //console.log(inputFi);
    }
}

var dodajPrazno = ()=>{
    if(tabela.innerHTML == ""){
        console.log("[er] tabela nima podatkov");
        return;
    }
    tabPush();
    //na konec doda prazno vrstico
    let vrstice = tabela.rows;
    let najdaljsa = vrstice[0];

    let stolpci = najdaljsa.cells; //celice

    let novaVrstica = document.createElement("tr");
    let novId = vrstice[vrstice.length-1].id.split("_")[1];
    novId = parseInt(novId)+1; //dodamo +1

    novaVrstica.id = "row_"+novId;
    
    for(let i = 0; i< stolpci.length; i++){
        let novCell = document.createElement("td");
        if(i == 0){
            novCell.innerHTML = "<button onclick='izbrisiVrstico("+novId+")'>X</button>"; //"<button onclick='izbrisiVrstico(\"row_"+novId+"\")'>X</button>";
        }
        else{
            novCell.id = stolpci[i].id; //zto da majo celli enake id-je po stolpcih
            novCell.innerHTML = "<input value=''>";
        }
        novaVrstica.appendChild(novCell);
    }
    
    tabela.appendChild(novaVrstica);
    //console.log(novaVrstica);


};

//to je treba se mal pregledat
var izbrisiPrazne = ()=>{
    if(tabela.innerHTML == ""){
        console.log("[er] tabela nima podatkov");
        return;
    }
    tabPush();
    //izbrise prazne vrstice
    let vrstice = tabela.rows;
    for(let i = 0; i < vrstice.length; i++){
        let vrstica = vrstice[i];
        let celice = vrstica.querySelectorAll("td");
        if(i != 0){
            //console.log(celice);
            let prazna = 1;
            for(let j = 0; j < celice.length; j++){
                if(j == 0) continue; //prva vrstica ima not gumb za izbris
                let vrednost = celice[j].querySelector("input").value;
                //console.log(vrednost);
                if(vrednost != ''){
                    prazna = 0;
                    break;
                }
            }

            if(prazna == 1){
                //console.log(vrstica.id.split("_")[1]);
                izbrisiVrstico(vrstica.id.split("_")[1]);
            }
        }
    }
};

var prikaziDuplikate = ()=>{
    if(tabela.innerHTML == ""){
        console.log("[er] tabela nima podatkov");
        return;
    }
    //oznaci vrstice, ki vsebujejo iste podatke (odločitev na strani vpisovalca;
    //lahko se zgodi, da imata dve osebi isto ime in priimek)
    //v takem primeru je smiselno oznaciti eno izmed obeh npr. s stevilko
    let vrstice = tabela.rows;
    let unikati = [];

    for(let i = 1; i < vrstice.length; i++){
        let polja = vrstice[i].querySelectorAll("input");
        let vsebina = "";
        for(let j = 0; j < polja.length; j++){
            vsebina = vsebina + polja[j].value;
        }
        if(unikati.indexOf(vsebina) == -1){
            unikati.push(vsebina);
            vrstice[i].classList.remove("oznaka");
        }
        else{
            vrstice[i].classList.add("oznaka");
        }
    }
};



var izbrisiStolpec = (stolpecId)=>{
    tabPush();
    //console.log("Stolpec za izbris: " + stolpecId);
    let elementiStolpca = tabela.querySelectorAll("td#col_"+stolpecId);
    for(let i = 0; i < elementiStolpca.length; i++) elementiStolpca[i].remove();
    //console.log(elementiStolpca);
};

var izbrisiVrstico = (vrsticaId)=>{
    tabPush();
    //console.log("Vrstica za izbris: " + vrsticaId);
    let vrstica = tabela.querySelector("tr#row_"+vrsticaId);
    vrstica.remove();
};

//rabi se mal razmisleka...
var razdeliStolpec = (stolpecId, znak, opcije)=>{
    tabPush();
    let elementiStolpca = tabela.querySelectorAll("td#col_"+stolpecId);
    
    //pridobimo indeks stolpca (na katerem mestu, da vemo, kam dodat nove stolpce)
    let stolpci = tabela.rows[0].cells;
    let indeks = 1;
    //console.log(stolpci);
    
    for(let i = 0; i < stolpci.length; i++){
        if(stolpci[i].id === "col_"+stolpecId){
            indeks = i;
            break;
        }
    }
    
    //console.log(indeks);

    let prviDel = [];
    let drugiDel = [];

    for(let i = 1; i<  elementiStolpca.length; i++){
        let inputFi = elementiStolpca[i].querySelector("input"); //tole ne bo vredu  

        
        if(inputFi){
            let podatek = inputFi.value;
            if(podatek == undefined) continue;
            //console.log("[" + i + "] " + podatek);
            let split_index = podatek.indexOf(' ');
            let el_prviDel = podatek.substring(0, split_index).trim();
            let el_drugiDel = podatek.substring(split_index+1).trim();

            //console.log(el_prviDel + "  " + el_drugiDel);

            prviDel.push(el_prviDel);
            drugiDel.push(el_drugiDel);
        }
        else{
            //console.log("[" + i + "] -");
        }
    }
    
    //vrstni red je pomemben!
    generirajStolpec(tabela, drugiDel, indeks); //indeks doloci mesto, na katero se doda nov stolpec
    generirajStolpec(tabela, prviDel, indeks);
    

};

var tab2JSON = (povratniKlic)=>{
    if(tabela.innerHTML == ""){
        console.log("[er] tabela nima podatkov");
        return undefined;
    }
    let vrni = {};
    let vrstice = tabela.rows;
    let stolpci = vrstice[0].cells;

    for(let i = 1; i < stolpci.length; i++){
        let stolpec_i = stolpci[i].querySelector("input").value;//stolpci[i].id;
        //console.log(stolpec_i + " " + stolpci[i].querySelector("input").value); //to je morda zasilna resitev

        
        //vrni[stolpec_i] = {};
        vrni[stolpec_i] = [];
        for(let j = 1; j < vrstice.length; j++){
            let celica = vrstice[j].cells[i];
            if(celica != undefined && celica != null){
                let input_el = vrstice[j].cells[i].querySelector("input");
                if(input_el != undefined) vrni[stolpec_i].push(input_el.value); //vrni[stolpec_i][j] = input_el.value; //-> ne rabmo json-a
            }
        }
    }
    //console.log(vrni);
    povratniKlic(vrni);
    return vrni;
};

var dbReset = ()=>{
    //console.log(prompt("ali res zelite izbrisati vse podatke?"));
    if(confirm("Ali res želiš izbrisati vse podatke iz baze?")){
        if(prompt("za nadaljevanje vnesite niz POTRDI") === "POTRDI"){
            console.log("izbrisi");
            $.get("/query/resetDB/");
        }
        else{
            console.log("ni izbrisano");
            return;
        }
    }
    else{
        console.log("ni izbrisano");
    }
};

var dodajTabVbazo = ()=>{
    tab2JSON((data)=>{
        //preveri  veljavnost podatkov!!!!!!!!!!!
        if(data.ime && data.priimek && data.starost) dodajVbazo(data, "udelezenci", null, (tip, msg)=>{izpisiResponse(tip, msg)});
        else izpisiResponse(0, "Stolpci so neustrezni!");
    });
    //dodajVbazo(tab2JSON(), "udelezenci");
};

var dodajUdelezenca = ()=>{
    let inputm_ime = document.getElementById("inputm_ime"); //inputm_priimek
    let inputm_priimek = document.getElementById("inputm_priimek");
    let inputm_starost = document.getElementById("inputm_starost"); //inputm_priimek

    let ime = inputm_ime.value;
    let priimek = inputm_priimek.value;
    let starost = inputm_starost.value;

    let podatki_send =     
    {
        ime:[ime],
        priimek:[priimek],
        starost:[starost]
    }
    if(ime && priimek && starost) dodajVbazo(podatki_send, "udelezenci", 2, (tip, msg)=>izpisiResponse(tip, msg));
    else izpisiResponse(0, "Vnesi vse podatke!");
};

var dodajDelavnico = ()=>{
    let inputm_delavnicaID = document.getElementById("inputm_delavnicaID");
    let inputm_omejitev = document.getElementById("inputm_omejitev");
    //fajn bi blo met tudi starostno omejitev (treba dodat samo en dodaten atribut + primerjava + ...)

    let delavnicaID = inputm_delavnicaID.value;
    let stMest = inputm_omejitev.value;
    if(delavnicaID && stMest) dodajVbazo({naziv:[delavnicaID],st_mest:[stMest]}, "delavnice", 2, (tip, msg)=>izpisiResponse(tip, msg))
    else izpisiResponse(0, "Vnesi vse podatke!");
};

var izpisiResponse = (tip, msg)=>{
    if(tip){
        console.log("[ok] podatki so bili uspesno dodani ("+msg+")");
    }
    else{
        console.log("[er] " + msg);
    }
};

var dodajVbazo = (podatki_json, tabela, tip, povratniKlic)=>{    
    if(podatki_json == undefined || tabela == undefined){
        //console.log("[er] podatki niso definirani");
        povratniKlic(0, "podatki niso definirani");
        return;
    }

    if(podatki_json != undefined && podatki_json != null){
        $.ajax({
            url: '/query/dodajJSON',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    options:{table:tabela, type:tip}, //opcije
                    data: podatki_json //podatki
                }
            ),
            success: (response)=>{
                //console.log("[ok] " + response);
                povratniKlic(1, response);
            },
            error: (napaka)=>{
                //console.log("[er] Prislo je do napake: " + napaka);
                povratniKlic(0, napaka);
            }
        });
    }
    else{
        //console.log("[er] podatki niso ok");
        povratniKlic(0, "podatki niso ok");
    }
};


/*
zgradba poslanih podatkov na streznik:

{
    options: {table:<tabela>, type:<tip>}
    data: {<podatki>}
}

options: vsebuje opcije za nastavitev nacina vnosa in podatek o tabeli, v katero se dodaja (tip: 0->vse naenkrat, 1->vsakega posebi)
data: vsebuje kljuce, ki so enakih imen kot stolpci, pod kljuci pa so podatki o celicah
*/
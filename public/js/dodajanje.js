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
        for(let i = 0; i < vrstice.length; i++){
            tab_vsebina += "<tr id='"+i+"'>";
            let polja = vrstice[i].split(',');
            for(let j = 0; j < polja.length; j++){
                tab_vsebina += "<td id='"+j+"'><input value='"+polja[j]+"'></td>";
            }
            tab_vsebina += "</tr>";
        }
        tab.innerHTML = tab_vsebina;


    });


    return 1;

}
var delavnica_izbrana;
var seznamPrijavljenih;
var datum_vnos;
var datum_input; //datum_input.value => to je za izbrani datum
var datum_text;

let izberiDelavnico = (delavnica)=>{
    if(delavnica){
        if(delavnica_izbrana != undefined){
            delavnica_izbrana.innerHTML = delavnica;
            seznamPrijavljenih.innerHTML = "";
            //delavnica_izbrana.innerHTML = "";
            delavnica_izbrana.hidden = false;

            //naredi ajax request:
            $.get("/query/prijavljeni/"+delavnica+"/"+datum_input.value, (podatki)=>{
                //console.log("aaa");
                let pod;
                if(podatki){
                    pod = JSON.parse(podatki);
                    //console.log(pod);
                }
                //console.log(podatki + "-> raw");

                if(pod.length != 0){
                    //console.log("podatki!");
                    //akcija
                    for(let i = 0; i < pod.length; i++){
                        let pod_i = pod[i];
                        seznamPrijavljenih.innerHTML += "<li>"+pod_i.ime+" "+pod_i.priimek+" -> "+pod_i.naziv+" "+
                                                        "<button onclick=\"odjaviUdelezenca('"+ pod_i.ime +"', '"+ pod_i.priimek +"','"+ delavnica +"','"+datum_input.value+"')\">X</button>"+"</li>";
                    }
                }
            });

        }
        //console.log(delavnica);
    }
    else{
        console.log("napaka: delavnica ni izbrana.");
    }
};

var datum2Text = (datum)=>{
    let d = datum.split("-");
    return parseInt(d[2]) + ". " + parseInt(d[1]) + ". " + d[0];
}

var izberiUdelezenca = (ime, priimek, starost)=>{
    let prijavi_ime = document.getElementById("prijavi_ime");
    let prijavi_priimek = document.getElementById("prijavi_priimek");
    let prijavi_starost = document.getElementById("prijavi_starost");

    prijavi_ime.innerText = ime;
    prijavi_priimek.innerText = priimek;
    prijavi_starost.innerText = starost;

    document.getElementById("input_prijava").value = ime + " " + priimek;
};

var izberiDelavnicoPrijava = (delavnica)=>{
    let prijavaDel = document.getElementById("input_prijavaDel");
    let prijavi_del = document.getElementById("prijavi_del");
    //console.log(delavnica);
    prijavi_del.innerText = delavnica;
    prijavaDel.value = delavnica;
};

var prijaviUdelezenca = ()=>{
    let ime_el = document.getElementById("prijavi_ime");
    let priimek_el = document.getElementById("prijavi_priimek");
    let starost_el = document.getElementById("prijavi_starost");
    let delavnica_el = document.getElementById("prijavi_del");
    let input_override = document.getElementById("input_override");

    let ime = ime_el.innerText;
    let priimek = priimek_el.innerText;
    let starost = starost_el.innerText;
    let delavnica = delavnica_el.innerText;

    if(ime && priimek && starost && delavnica){
        console.log(ime + " " + priimek + " " + starost + " -> " + delavnica);
        ime_el.innerHTML = priimek_el.innerHTML = starost_el.innerHTML = delavnica_el = "";
        
        
        $.get("/query/prijavi/"+ime+"/"+priimek+"/"+delavnica+"/"+datum_input.value+"/"+input_override.checked+"/", (podatki)=>{
            console.log(podatki);
            izpisiStanje(2, podatki); //server response
            //update delavnice
            if(delavnica_izbrana.innerHTML == delavnica){
                izberiDelavnico(delavnica);
            }
        });
        //ce gre skoz, poglej, katera delavnica je izbrana in če sovpada, potem dodaj gor.
    }
    else{
        izpisiStanje(1, "[cli] vnesi vse podatke");
        console.log("[er] vnesi vse podatke");
    }
};

var odjaviUdelezenca = (ime, priimek, delavnica, datum)=>{
    var niz = "odjavi: " + ime + " " + priimek + " " + delavnica + " " + datum;
    //console.log(niz);
    izpisiStanje(0, niz);
    $.get("/query/odjavi/"+ime+"/"+priimek+"/"+delavnica+"/"+datum_input.value+"/", (podatki)=>{
        izberiDelavnico(delavnica); //lahko bi se ugotovil prej, ali gre za error al za ok, ampak ok
        izpisiStanje(2, podatki);
        console.log(podatki);
    });
};


var izpisiStanje = (tip, sporocilo)=>{
    var prijava_response = document.getElementById("prijava_response");
    if(tip == 0) prijava_response.innerHTML = "[ok] " + sporocilo;
    else if(tip == 2) prijava_response.innerHTML = "[server] " + sporocilo;
    else prijava_response.innerHTML = "[er] " + sporocilo;
}

var generirajPorocilo = ()=>{
    //console.log("gumb kliknjen");

    window.open("/query/porocilo/"+datum_input.value+"/", '_blank').focus();


};




window.addEventListener('load', ()=>{
    //console.log("javascript test (prijava.js)");
    delavnica_izbrana = document.getElementById("delavnica_izbrana");
    seznamPrijavljenih = document.getElementById("prijavljeni_seznam");
    datum_vnos = document.getElementById("datum_vnos");

    datum_input = datum_vnos.querySelector("input");
    datum_text = datum_vnos.querySelector("span");

    //onload: nastavimo datum
    let dons = new Date();
	let dons_format = dons.toISOString().split("T")[0];
    datum_input.value = dons_format;
    datum_text.innerHTML = datum2Text(dons_format);

    let ponastaviDatumGumb = document.getElementById("datum_reset");
    ponastaviDatumGumb.addEventListener('click', ()=>{
        datum_input.value = dons_format;
        datum_text.innerHTML = datum2Text(dons_format);
    });

    datum_input.addEventListener('blur',()=>{
        datum_input.hidden = true;
        datum_text.hidden = false;
        datum_text.innerHTML = datum2Text(datum_input.value);
    });

    datum_text.addEventListener('click',()=>{
        datum_input.hidden = false;
        datum_input.focus();
        //datum_input
        datum_text.hidden = true;
        //datum_input.value = datum_text.innerHTML;
    });
    
    let input_prijava = document.getElementById("input_prijava");
    let udelezenci_seznam = document.getElementById("udelezenci_seznam");
    let vsiUdelezenci = udelezenci_seznam.querySelectorAll("li");

    /*
    input_prijava.addEventListener('blur', ()=>{
        for(let i = 0; i < vsiUdelezenci.length; i++){
            vsiUdelezenci[i].hidden = false; //vse pokazemo
        }
    });
    */

    input_prijava.addEventListener('input', ()=>{
        let value = input_prijava.value;
        for(let i = 0; i< vsiUdelezenci.length; i++){
            let udelezenec_i = vsiUdelezenci[i];
            if((udelezenec_i.innerText.toUpperCase()).indexOf(value.toUpperCase()) != -1) udelezenec_i.hidden = false;
            else udelezenec_i.hidden = true;
        }
    });

    /*
    let input_override = document.getElementById("input_override");
    input_override.addEventListener("input", ()=>{
        console.log(input_override.checked);
    });
    */

});

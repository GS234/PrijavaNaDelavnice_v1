var delavnica_izbrana;
var seznamPrijavljenih;
var datum_vnos;
var datum_input;
var datum_text;

let izberiDelavnico = (delavnica)=>{
    if(delavnica){
        if(delavnica_izbrana != undefined){
            delavnica_izbrana.innerHTML = delavnica;
            seznamPrijavljenih.innerHTML = "";
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
                        seznamPrijavljenih.innerHTML += "<li>"+pod_i.ime+" "+pod_i.priimek+" -> "+pod_i.naziv+" "+"</li>"
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
});

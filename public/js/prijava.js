var delavnica_izbrana;
var seznamPrijavljenih;

let izberiDelavnico = (delavnica)=>{
    if(delavnica){
        if(delavnica_izbrana != undefined){
            delavnica_izbrana.innerHTML = delavnica;
            seznamPrijavljenih.innerHTML = "";
            delavnica_izbrana.hidden = false;

            //naredi ajax request:
            $.get("/query/prijavljeni/"+delavnica+"/", (podatki)=>{
                console.log("aaa");
                let pod;
                if(podatki){
                    pod = JSON.parse(podatki);
                    console.log(pod);
                }
                console.log(podatki + "-> raw");

                if(pod.length != 0){
                    console.log("podatki!");
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

window.addEventListener('load', ()=>{
    //console.log("javascript test (prijava.js)");
    delavnica_izbrana = document.getElementById("delavnica_izbrana");
    seznamPrijavljenih = document.getElementById("prijavljeni_seznam");
});

if(!process.env.PORT) process.env.PORT = 8080;

const sqlite3 = require("sqlite3").verbose();
const pb = new sqlite3.Database("baza.sqlite3");

const express = require("express");
const streznik = express();
const bodyParser = require('body-parser');
const { json } = require("body-parser");

streznik.set("view engine", "hbs");
streznik.use(express.static("public")); //aha kle nastavmo root za staticne datoteke (javascript na odjemalcu, ...)
streznik.use(bodyParser.json()); //za parsat body //urlencoded({extended:true})

streznik.get("/", (zahteva, odgovor)=>{
	odgovor.setHeader("Content-Type", "text/html");
	odgovor.render("index", {content: "<h1>Pozdravljeni!</h1>", podatki:["prvi", "drugi", "tretji"]});
	//odgovor.render("layout", {body:"<h1>DRUGI NASLOV</h1>"});
});

streznik.get("/prijava/dodaj", (zahteva, odgovor)=>{
	odgovor.setHeader("Content-Type", "text/html");
	odgovor.render("dodaj");
});

streznik.get("/prijava/", (zahteva, odgovor)=>{
	//tuki se bo izvedla poizvedba na bazo, izpis bo su na aplikacijo (metoda get)

	pb.all("select * from Delavnice", (napaka, vrstice)=>{
		if(napaka){
			odgovor.sendStatus(500);
			//odgovor.end(napaka);
			console.log(napaka);
		}
		else{
			odgovor.setHeader("Content-Type", "text/html");
			odgovor.render("prijava", {delavnice_seznam: vrstice});//["prva", "druga", "tretja"]});
		}
	});
});
//streznik.get("/prijava/dodaj");


//opravki z bazo:
streznik.get("/query/prijavljeni/:delavnica/:datum", (zahteva, odgovor)=>{ //"/query/prijavljeni/:delavnica/:datum"
	//console.log(zahteva.params.delavnica);
	//console.log(zahteva.params.datum);
	let d = zahteva.params.delavnica;
	let datum_format = zahteva.params.datum;
	
	//let datum = new Date();
	//let datum_format = datum.toISOString().split("T")[0]; //"2022-04-06";

	//datum_format = zahteva.params.datum;

	//console.log(d + " " + datum_format);


	naDelavnici(d, datum_format, (vrstice)=>{
		if(vrstice != false){
			odgovor.end(vrstice);
			//console.log(vrstice);
			return;
		}
		else {
			odgovor.end("napaka");
			//console.log("napaka");
		}
	});
	
	//odgovor.end(datum_format);
});

var naDelavnici = (delavnica, datum, povratniKlic)=>{
	pb.all(
		"select u.ime, u.priimek, d.naziv from Delavnice d, Prijava p, Udelezenci u where \
		p.ID_udelezenca = u.ID_udelezenca and \
		p.ID_delavnice = d.ID_delavnice and \
		d.naziv = '"+delavnica+"' and p.datum = '"+datum+"';", //pogoj
		(napaka, vrstice)=>{
			if(napaka){
				console.log(napaka);
				povratniKlic(false);
			}
			else{
				povratniKlic(JSON.stringify(vrstice));
			}
		}
	);
};

//dodajanje v bazo

streznik.post("/query/dodajJSON/", (zahteva, odgovor)=>{ //"/query/prijavljeni/:delavnica/:datum"
	//let json_data = JSON.parse(zahteva.body);
	//console.log(zahteva.body);
	//console.log(json_data);
	let json_data = zahteva.body;

	if(json_data.ime != undefined && json_data.priimek != undefined && json_data.starost != undefined){
		let dolzina = json_data.ime.length;
		if(dolzina == json_data.priimek.length && dolzina == json_data.starost.length){
			//dodaj v bazo:
			for(let i = 0; i < dolzina; i++){
				console.log(json_data.ime[i] + " " + json_data.priimek[i] + ", starost: " + json_data.starost[i]);

			}



			odgovor.end("[ok]");
		}
		else{
			odgovor.end("[er] dolzine se ne ujemajo (vsi stolpci morajo imeti enako stevilo podatkov)");
		}
	}
	else{
		odgovor.end("[er] prejeti podatki nimajo pravilno oznacenih stolpcev.");
	}


	
});


streznik.listen(process.env.PORT, ()=>{
	console.log("Streznik laufa");
});

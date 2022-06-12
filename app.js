if(!process.env.PORT) process.env.PORT = 8080;

const sqlite3 = require("sqlite3").verbose();
const pb = new sqlite3.Database("baza.sqlite3");

const express = require("express");
const streznik = express();

streznik.set("view engine", "hbs");
streznik.use(express.static("public")); //aha kle nastavmo root za staticne datoteke (javascript na odjemalcu, ...)

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
streznik.get("/query/prijavljeni/:delavnica", (zahteva, odgovor)=>{
	//console.log(zahteva.params.delavnica);
	let d = zahteva.params.delavnica;
	let datum = new Date();
	let datum_format = "2022-04-06";//datum.toISOString().split("T")[0];

	console.log(d + " " + datum_format);


	naDelavnici(d, datum_format, (vrstice)=>{
		if(vrstice != false){
			odgovor.end(vrstice);
			console.log(vrstice);
			return;
		}
		else {
			odgovor.end("napaka");
			console.log("napaka");
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


streznik.listen(process.env.PORT, ()=>{
	console.log("Streznik laufa");
	//aaa
});

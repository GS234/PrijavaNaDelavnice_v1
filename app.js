if (!process.env.PORT) process.env.PORT = 8080;

const sqlite3 = require("sqlite3").verbose();
const pb = new sqlite3.Database("baza.sqlite3");

const express = require("express");
const streznik = express();
const bodyParser = require('body-parser');
const { json } = require("body-parser");

streznik.set("view engine", "hbs");
streznik.use(express.static("public")); //aha kle nastavmo root za staticne datoteke (javascript na odjemalcu, ...)
streznik.use(bodyParser.json()); //za parsat body //urlencoded({extended:true})

streznik.get("/", (zahteva, odgovor) => {
	odgovor.setHeader("Content-Type", "text/html");
	odgovor.render("index", { content: "<h1>Pozdravljeni!</h1>", podatki: ["prvi", "drugi", "tretji"] });
	//odgovor.render("layout", {body:"<h1>DRUGI NASLOV</h1>"});
});

streznik.get("/prijava/dodaj", (zahteva, odgovor) => {
	odgovor.setHeader("Content-Type", "text/html");
	odgovor.render("dodaj");
});

streznik.get("/prijava/", (zahteva, odgovor) => {
	//tuki se bo izvedla poizvedba na bazo, izpis bo su na aplikacijo (metoda get)
	
	//odgovor.sendStatus(500);
	//odgovor.end(napaka);

	//odgovor.setHeader("Content-Type", "text/html");
	//odgovor.render("prijava", { delavnice_seznam: vrstice });//["prva", "druga", "tretja"]});
	getDelavnice((statusDel, delavnice)=>{
		if(statusDel){
			getUdelezenci((statusUdelez, udelezenci)=>{
				if(statusUdelez){
					odgovor.setHeader("Content-Type", "text/html");
					odgovor.render("prijava", { delavnice_seznam: delavnice, udelezenci_seznam: udelezenci });
				}
				else{
					odgovor.sendStatus(500);
					odgovor.end(udelezenci);
				}
			});
		}
		else{
			odgovor.sendStatus(500);
			odgovor.end(delavnice);
		}
	})


});
//streznik.get("/prijava/dodaj");

var getDelavnice = (povratniKlic)=>{
	pb.all("select * from Delavnice", (napaka, vrstice) => {
		if (napaka) {
			console.log(napaka);
			povratniKlic(0, "Napaka pri zajemu delavnic");
		}
		else {
			povratniKlic(1, vrstice);
		}
	});
}

var getUdelezenci = (povratniKlic)=>{
	pb.all("select * from Udelezenci", (napaka, vrstice) => {
		if (napaka) {
			console.log(napaka);
			povratniKlic(0, "Napaka pri zajemu udelezencev");
		}
		else {
			povratniKlic(1, vrstice);
		}
	});
}




//opravki z bazo:
streznik.get("/query/prijavljeni/:delavnica/:datum", (zahteva, odgovor) => { //"/query/prijavljeni/:delavnica/:datum"
	//console.log(zahteva.params.delavnica);
	//console.log(zahteva.params.datum);
	let d = zahteva.params.delavnica;
	let datum_format = zahteva.params.datum;

	//let datum = new Date();
	//let datum_format = datum.toISOString().split("T")[0]; //"2022-04-06";

	//datum_format = zahteva.params.datum;

	//console.log(d + " " + datum_format);


	naDelavnici(d, datum_format, (vrstice) => {
		if (vrstice != false) {
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

//tole je security issue, treba je mal dodelat
streznik.get("/query/resetDB/", (zahteva, odgovor) => {
	pb.run("DELETE FROM udelezenci;");
	pb.run("DELETE FROM prijava;");
	pb.run("DELETE FROM delavnice;");
	odgovor.end("[ok] podatki so izbrisani");
	console.log("podatki so izbrisani");
});

var naDelavnici = (delavnica, datum, povratniKlic) => {
	pb.all(
		"select u.ime, u.priimek, d.naziv from Delavnice d, Prijava p, Udelezenci u where \
		p.ID_udelezenca = u.ID_udelezenca and \
		p.ID_delavnice = d.ID_delavnice and \
		d.naziv = '"+ delavnica + "' and p.datum = '" + datum + "';", //pogoj
		(napaka, vrstice) => {
			if (napaka) {
				console.log(napaka);
				povratniKlic(false);
			}
			else {
				povratniKlic(JSON.stringify(vrstice));
			}
		}
	);
};

streznik.get("/query/prijavi/:ime/:priimek/:delavnica/:datum", (zahteva, odgovor)=>{
	//TODO
	//pri prijavi je treba:
		/*
		preveri, ali je otrok ze bil vpisan na delavnico (dodaj override button za primere, ko kljub
			temu, da je nekdo ze bil vpisan, aplikacija dovoli dvojni vpis (bratci/sestrice/, ... (ostale anomalije)))

		preveri, ali je na delavnici se dovolj prostora
			-> ce je dovolj, potem ga prijavi!
			-> drugace pa ga ne prijavi, vrni napako

	*/

	let ime = zahteva.params.ime;
	let priimek = zahteva.params.priimek;
	let delavnica = zahteva.params.delavnica;
	let datum = zahteva.params.datum;
	
	
	pb.all("SELECT ID_udelezenca FROM Udelezenci WHERE ime = '"+ime+"' AND priimek = '"+priimek+"';", (napaka, vrstice)=>{
		if(napaka){
			console.log(napaka);
			odgovor.end("[er] napaka1 (id udelezenca neznan)");
		}
		else{
			let id_udel = vrstice[0].ID_udelezenca;
			//console.log(id_udel);

			pb.all("SELECT ID_delavnice FROM Delavnice WHERE naziv = '"+delavnica+"'", (napaka, vrstice)=>{
				if(napaka){
					console.log(napaka);
					odgovor.end("[er] napaka2 (id delavnice neznan)");
				}
				else{
					let id_del = parseInt(vrstice[0].ID_delavnice);
					//console.log(id_udel + " " + id_del);
					veljavno(id_udel, id_del, datum, (koda)=>{
						if(koda == 0 || (koda == 2 && 0)){ //tuki dopusti tudi moznost prisilne prijave v primeru, ko je koda 2 in je override na 1 (za posebne primere)
							pb.run("INSERT INTO Prijava (ID_udelezenca, ID_delavnice, datum) VALUES ('"+id_udel+"','"+id_del+"','"+datum+"');", (napaka)=>{
								if(napaka){
									console.log(napaka);
									odgovor.end("[er] napaka pri vnosu");
								}
								else{
									console.log("[ok] vpisano");
									odgovor.end("-> [ok] pravilen vnos");
								}
							});
						}

						else{
							if(koda == 2){
								console.log("[er] udelezenec je ze bil na delavnici");
								odgovor.end("[er] udelezenec je ze bil na delavnici");
							}
							if(koda == 1){ //tuki neki ne dela (1)
								console.log("[er] udelezenec je ze bil danes vpisan na delavnico");
								odgovor.end("[er] udelezenec je ze bil danes vpisan na delavnico");
							}
							else{
								console.log("[er] neznana napaka (koda -1)");
								odgovor.end("[er] neznana napaka (koda -1)");
							}

						}
					});
				}
			});	
		}
	});

	//pb.run("INSERT INTO Prijava ('ID_udelezenca', 'ID_delavnice', 'datum') VALUES ('','','')");
	//odgovor.end("-> "+ime + " " + priimek + " " + delavnica + " " +datum);
	//moznih vec odgovorov:
		// - dvakratni vpis (isti dan) (1)
		// - prevec vpisanih (2)
		// - udelezenec je ze bil na delavnici (3)
		// - ... (4 ...)
});

var veljavno = (id_udel, id_del, datum, povratniKlic)=>{
	pb.all("SELECT count(*) AS aliJe FROM prijava WHERE ID_udelezenca = "+id_udel+" AND datum = '"+datum+"'", (napaka, vrstice)=>{
		if(napaka){
			console.log("[er] napaka pri preverjanju udelezenca");
			povratniKlic(-1); //ce je -1, potem je napaka nekje
		}
		else{
			let aliJe = vrstice[0].aliJe;

			if(aliJe == 1){ //to pomeni, da je bil udelezenec ze vpisan na delavnico.
				povratniKlic(1);
			}
			else{
				pb.all("SELECT count(*) AS aliNaDelavnici FROM prijava WHERE ID_udelezenca = "+id_udel+" AND ID_delavnice = "+id_del+"", (napaka, vrstice)=>{
					if(napaka){
						povratniKlic(-1);
					}
					else{
						let aliJeZeBilNaDelavnici = vrstice[0].aliNaDelavnici;
						if(aliJeZeBilNaDelavnici){
							povratniKlic(2); //to pomeni, da je udelezenec ze bil vpisan na delavnico
						}
						else{ //napisi se pogoj, da je count(*) manjsi od maksimalnega stevila ljudi na delavnici (delavnice.st_mest)
							//pb.all("SELECT count(*) AS steviloPrijavljenih FROM prijava WHERE ")

							povratniKlic(0); //to pomeni, da se udelezenec lahko vpise na delavnico
						}
					}
				});
			}
		}
	});
}

streznik.get("/query/odjavi/:ime/:priimek/:delavnica/:datum", (zahteva, odgovor)=>{
	//console.log(zahteva.params.ime + " " + zahteva.params.priimek + " " + zahteva.params.delavnica + " " + zahteva.params.datum);
	
	let ime = zahteva.params.ime;
	let priimek = zahteva.params.priimek;
	let delavnica = zahteva.params.delavnica;
	let datum = zahteva.params.datum;



	pb.all("SELECT ID_udelezenca AS ID_u FROM Udelezenci WHERE ime = '"+ime+"' AND priimek = '"+priimek+"';", (napaka, vrstice)=>{
		if(napaka){
			console.log(napaka);
			odgovor.end(napaka);
		}
		else{
			let ID_u = vrstice[0].ID_u;
			pb.all("SELECT ID_delavnice AS ID_d FROM Delavnice WHERE naziv = '"+delavnica+"';", (napaka, vrstice)=>{
				if(napaka){
					console.log(napaka);
					odgovor.end(napaka);
				}
				else{
					let ID_d = vrstice[0].ID_d;
					//ok, mamo id u, id d
					pb.run("DELETE FROM Prijava WHERE ID_udelezenca = '"+ID_u+"' AND ID_delavnice = '"+ID_d+"' AND datum = '"+datum+"';", (rezultat)=>{
						if(!rezultat){ //to je ok
							console.log(rezultat);
							odgovor.end(rezultat);
						}
						else{
							console.log("[er] " + rezultat);
							odgovor.end("[er] " + rezultat);
						}
					});
				}
			});
		}
	});
	//odgovor.end("[ok]");
});


streznik.post("/query/dodajJSON/", (zahteva, odgovor) => { //"/query/prijavljeni/:delavnica/:datum"
	let json_data = zahteva.body;
	let tabela = json_data.options.table;		//opcije vsebujejo podatek o tabeli
	let stolpcii = Object.keys(json_data.data); //dobi vse stolpce

	let stolpci = ""; //stolpci tabele
	let vrstice = ""; //vrstice tabele

	for (let i = 0; i < stolpcii.length; i++) {
		if (i != 0) stolpci = stolpci + ",";
		stolpci = stolpci + stolpcii[i];
	}

	let st_vrstic = json_data.data[stolpcii[0]].length;
	for (let i = 0; i < st_vrstic; i++) {
		if (i != 0) vrstice = vrstice + ",";
		vrstice = vrstice + "(";
		for (let j = 0; j < stolpcii.length; j++) {
			if (j != 0) vrstice = vrstice + ",";
			let celica = json_data.data[stolpcii[j]][i];
			vrstice = vrstice + "'" + celica + "'";
		}
		vrstice = vrstice + ")";
	}
	
	//console.log(vrstice);
	//console.log(stolpci);
	//odgovor.end("success");

	
	//query: ----------------------------------------
	pb.run(
		"INSERT INTO " + tabela + " (" + stolpci + ") VALUES " + vrstice + ";",
		(err) => {
			if (err) {
				odgovor.end("[server][er] napaka pri dodajanju v bazo");
				console.log(err);
				return;
			}
			else {
				odgovor.end("[server][ok] podatki zapisani v bazo");
				return;
			}
		}
	);
	//----------------------------------
});


streznik.listen(process.env.PORT, () => {
	console.log("Streznik laufa");
});

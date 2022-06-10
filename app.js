if(!process.env.PORT) process.env.PORT = 8080;

//const sqlite3 = require("sqlite3").verbose();
//const pb = new sqlite3.Database("Chinook.sl3");

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

	odgovor.setHeader("Content-Type", "text/html");
	odgovor.render("prijava");
});
//streznik.get("/prijava/dodaj");

streznik.listen(process.env.PORT, ()=>{
	console.log("Streznik laufa");
	//aaa
});

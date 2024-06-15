# PrijavaNaDelavnice_v1
Repozitorij vsebuje prvo verzijo programa za prijavo udeležencev na delavnice. V tej verziji je poudarek bolj na samem delovanju programa in ne toliko na uporabniškem vmesniku, kar bo v prihodnosti treba še popraviti.

## Zagon programa:
1. Premaknemo se v korenski imenik programa.
2. Pred prvim zagonom programa je potrebno v korenu programa dodati datoteko z imenom __baza.sqlite3__, ki vsebuje podatke podatkovne baze sqlite3. To je najlažje storiti tako, da se naredi kopija datoteke baza_empty.sqlite3 in se jo preimenuje v baza.sqlite3. S tem se naredi nova, prazna podatkovna baza, ki jo program potrebuje za delovanje.  
3. Nato naložimo potrebne knjižnice z ukazom ```npm install```.  
4. Nazadnje pa še zaženemo program z ukazom ```node app.js```. Aplikacija je potem dostopna na naslovu http://localhost:8080/prijava .  

*opomba: za delovanje je potrebno imeti naložen node.js in npm. Program uspešno deluje z verzijo node-a 21.7.3 in npm-ja 10.5.0.*

window.addEventListener('load', () => {
    //console.log("tole je odjemalec (dodajanje.js)");
    let button_odpri = document.getElementById("odpriDat");
    /*
    button_odpri.addEventListener('click', (event) => {
        console.log("gumb kliknjn");
    });
    */
    //button_odpri.addEventListener('click', importD());
});

function importD() { //zaenkrat nared da dela samo za csv
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _this => {
        let files = Array.from(input.files);
        console.log(files);
    };
    input.click();
}
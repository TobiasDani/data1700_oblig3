let redigerBilett = false;
let idBilett = 0;

function valider() {
    let film = $("#film").val();
    let antall = $("#antall").val();
    let fornavn = $("#fornavn").val();
    let etternavn = $("#etternavn").val();
    let telefon = $("#telefon").val();
    let epost = $("#epost").val();

    let isValid = true;

    const epostRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const tlfRegex = /^\d{3}[\s-]?\d{2}[\s-]?\d{3}$/;

    if (film == "velg") {
        $("#filmError").html("Må velge en film");
        isValid = false;
    } else {
        $("#filmError").html("");
    }

    if (antall == "") {
        $("#antallError").html("Må skrive noe inn i antall");
        isValid = false;
    } else if (Number(antall) >= 1) {
        $("#antallError").html("");
    } else {
        $("#antallError").html("Antallet må være gyldig");
        isValid = false;
    }

    if (fornavn == "") {
        $("#fornavnError").html("Må skrive noe inn i fornavnet");
        isValid = false;
    } else {
        $("#fornavnError").html("");
    }

    if (etternavn == "") {
        $("#etternavnError").html("Må skrive noe inn i etternavnet");
        isValid = false;
    } else {
        $("#etternavnError").html("");
    }

    if (telefon == "") {
        $("#telefonError").html("Må skrive noe inn i telefon nummer");
        isValid = false;
    } else if (!tlfRegex.test(telefon)) {
        $("#telefonError").html("Skriv inn et gyldig telefon nummer");
        isValid = false;
    } else {
        $("#telefonError").html("");
    }

    if (epost == "") {
        $("#epostError").html("Må skrive noe inn i epost");
        isValid = false;
    } else if (!epostRegex.test(epost)) {
        $("#epostError").html("Skriv inn en gyldig epost");
        isValid = false;
    } else {
        $("#epostError").html("");
    }

    return isValid;
}

$("#kjop").click(function leggTilBillett() {
    if (!valider()) {
        return;
    }

    let film = $("#film").val();
    let antall = $("#antall").val();
    let fornavn = $("#fornavn").val();
    let etternavn = $("#etternavn").val();
    let telefon = $("#telefon").val();
    let epost = $("#epost").val();

    $("#overskrift").html("Bestilling av kinobiletter");
    $("#kjop").html("Kjøp Bilett");
    $("#film").val("velg");
    $("#antall").val("");
    $("#fornavn").val("");
    $("#etternavn").val("");
    $("#telefon").val("");
    $("#epost").val("");

    if (redigerBilett == true) {
        redigerBilett = false;

        const url = "/rediger?id=" + idBilett + "&film=" + film + "&antall=" + antall + "&fornavn=" + fornavn + "&etternavn=" + etternavn + "&telefon=" + telefon + "&epost=" + epost;
        $.post(url, function () {

            $.get("/hent", function (data) {
                formater(data);
            });
        });
    } else {
        const url = "/leggtil?film=" + film + "&antall=" + antall + "&fornavn=" + fornavn + "&etternavn=" + etternavn + "&telefon=" + telefon + "&epost=" + epost;
        $.post(url, function () {

            $.get("/hent", function (data) {
                formater(data);
            });
        });
    }
});

$("#slett").click(function slettAlt() {
    $.ajax({
        url: "/slettalt",
        type: "DELETE",
        success: function () {

            $.get("/hent", function (data) {
                formater(data);
            });
        }
    });
});

function formater(data) {
    let table = "<table class=\"table\"><tr><th>Film</th><th>Antall</th><th>Fornavn</th><th>Etternavn</th><th>Telefon</th><th>Epost</th><th></th><th></th></tr>";

    data.forEach(function (b) {
        var row = "<tr>";
        row = row + "<td>" + b.film + "</td>";
        row = row + "<td>" + b.antall + "</td>";
        row = row + "<td>" + b.fornavn + "</td>";
        row = row + "<td>" + b.etternavn + "</td>";
        row = row + "<td>" + b.telefon + "</td>";
        row = row + "<td>" + b.epost + "</td>";
        row = row + "<td>" + "<button class=\"btn btn-primary\" onclick=\"redigerEnkel('" + b.id + "', '" + b.film + "', '" + b.antall + "', '" + b.fornavn + "', '" + b.etternavn + "', '" + b.telefon + "', '" + b.epost + "')\">Rediger</button>" + "</td>";
        row = row + "<td>" + "<button class=\"btn btn-primary\" onclick=\"slettEnkel(" + b.id + ")\">Slett</button>" + "</td>";
        row = row + "</tr>";

        table += row;
    });

    $("#billetter").html(table);
}

function redigerEnkel(id, film, antall, fornavn, etternavn, telefon, epost) {
    $("#overskrift").html("Redigering av Bilett: #" + id);
    $("#kjop").html("Rediger Bilett #" + id);

    $("#film").val(film);
    $("#antall").val(antall);
    $("#fornavn").val(fornavn);
    $("#etternavn").val(etternavn);
    $("#telefon").val(telefon);
    $("#epost").val(epost);

    idBilett = id;
    redigerBilett = true;
}

function slettEnkel(id) {
    $.ajax({
        url: "/slettenkel?id=" + id,
        type: "DELETE",
        success: function () {

            $.get("/hent", function (data) {
                formater(data);
            });
        }
    });
}

$(document).ready(function () {
    $.get("/hent", function (data) {
        formater(data);
    });
});

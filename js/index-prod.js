// VERSION FINALISÉE AVEC SPÉCIALISATION DÉFINIE DANS L'ENTÊTE

/* IMPORTANT: la position des titres dans le tableau (headers) est à respecter car repris dans les sorties analytics et standard */
/* par contre... aucune incidence sur l'emplacement des colonnes des fichiers csv import en entrée (en principe;) */
// MERGE
const ref_ID = "Student ID";
const headersProfile = ["id", "username", "name", "email"];

const headersTemplate = [
    ref_ID, //0
    "Email",
    "Name",
    "Username",
    "Grade",
    "Évaluation Hebdo 1: Évaluation (notée)", // 5
    "Évaluation Hebdo 2: Évaluation (notée)",
    "Évaluation Hebdo 3: Évaluation (notée)",
    "Évaluation Hebdo 4: Évaluation (notée)", // 8
    "Évaluation Hebdo (Avg)", // 9
    "Examen Final", // 10
    "Livrables 1: Carte Conceptuelle - (Semaine 1)", // 11
    "Livrables 2: Compte-rendu - (Semaine 2)", // 12
    "Livrables 3: Planification - (Semaine 3)", // 13
    "Livrables (Avg)", // 14
    "DFS - Diagnostic de Fonctionnement d'un Système", // SPE 1
    "MCB - Management de la Créativité et Brainstorming", // SPE 2
    "MEP - Management d'Équipe Projet", // SPE 3
    "IEF - Les outils informatiques & Évaluer financièrement les projets", // SPE 4
    "PMI - Certifications professionnelles PMI®", // SPE 5
    "AF - Analyse Fonctionnelle", // SPE 6
    "AS - Analyse Stratégique dans les Projets", // SPE 7
    "EIP - Évaluation d'Impact des Projets", // SPE 8
    "PAV - Planification Avancée", // SPE 9
    "MVP - Management Visuel de Projet", // SPE 10
    "GPAS - Gestion de projet agile avec Scrum", // SPE 11
    "MRP - Outils et Méthodologie de Résolution de Problème", // old "MRP - Méthode de Résolution de Problèmes", // SPE 12
    "TRIZ - Introduction aux principaux outils de TRIZ", // SPE 13
    "G2C - Gestion de crise", // SPE 14
    "PAE - Du Projet à l'Action Entrepreneuriale", // SPE 15
    "Pre MOOC", // 30
    "Cohort Name",
    "Enrollment Track",
    "Verification Status",
    "Certificate Eligible",
    "Certificate Delivered",
    "Certificate Type",
    "Enrollment Status" // 37
];

const cohortesOptions = [
    "Grade",
    "Évaluation Hebdo 1: Évaluation (notée)", // 5
    "Évaluation Hebdo 2: Évaluation (notée)",
    "Évaluation Hebdo 3: Évaluation (notée)",
    "Évaluation Hebdo 4: Évaluation (notée)", // 8
    "Évaluation Hebdo (Avg)", // 9
    "Examen Final", // 10
    "Livrables 1: Carte Conceptuelle - (Semaine 1)", // 11
    "Livrables 2: Compte-rendu - (Semaine 2)", // 12
    "Livrables 3: Planification - (Semaine 3)", // 13
    "Livrables (Avg)", // 14
    "DFS - Diagnostic de Fonctionnement d'un Système", // SPE 1
    "MCB - Management de la Créativité et Brainstorming", // SPE 2
    "MEP - Management d'Équipe Projet", // SPE 3
    "IEF - Les outils informatiques & Évaluer financièrement les projets", // SPE 4
    "PMI - Certifications professionnelles PMI®", // SPE 5
    "AF - Analyse Fonctionnelle", // SPE 6
    "AS - Analyse Stratégique dans les Projets", // SPE 7
    "EIP - Évaluation d'Impact des Projets", // SPE 8
    "PAV - Planification Avancée", // SPE 9
    "MVP - Management Visuel de Projet", // SPE 10
    "GPAS - Gestion de projet agile avec Scrum", // SPE 11
    "MRP - Outils et Méthodologie de Résolution de Problème", // old "MRP - Méthode de Résolution de Problèmes", // SPE 12
    "TRIZ - Introduction aux principaux outils de TRIZ", // SPE 13
    "G2C - Gestion de crise", // SPE 14
    "PAE - Du Projet à l'Action Entrepreneuriale", // SPE 15
    "Pre MOOC", // 30
];

const objTemplate = {};
headersTemplate.forEach((el) => {
    objTemplate[el] = "";
});

const headersByCategories = {
    required: [
				ref_ID,
        "Email",
        "Username",
        "Grade",
        "Cohort Name",
        "Enrollment Track",
        "Verification Status",
        "year_of_birth",
        "gender",
        "level_of_education",
        "Certificate Eligible",
        "Certificate Delivered",
        "Certificate Type",
        "Enrollment Status"
    ],
    tc: [
        "Pre MOOC",
        "Évaluation Hebdo 1: Évaluation (notée)",
        "Évaluation Hebdo 2: Évaluation (notée)",
        "Évaluation Hebdo 3: Évaluation (notée)",
        "Évaluation Hebdo 4: Évaluation (notée)",
        "Évaluation Hebdo (Avg)",
        "Examen Final"
    ],
    livrables: [
        "Livrables 1: Carte Conceptuelle - (Semaine 1)",
        "Livrables 2: Compte-rendu - (Semaine 2)",
        "Livrables 3: Planification - (Semaine 3)",
        "Livrables (Avg)"
    ],
    spe: [
        "DFS - Diagnostic de Fonctionnement d'un Système", // 1
        "MCB - Management de la Créativité et Brainstorming", // 2
        "MEP - Management d'Équipe Projet", // 3
        "IEF - Les outils informatiques & Évaluer financièrement les projets", // 4
        "PMI - Certifications professionnelles PMI®", // 5
        "AF - Analyse Fonctionnelle", // 6
        "AS - Analyse Stratégique dans les Projets", // 7
        "EIP - Évaluation d'Impact des Projets", // 8
        "PAV - Planification Avancée", // 9
        "MVP - Management Visuel de Projet", // 10
        "GPAS - Gestion de projet agile avec Scrum", // 11
        "MRP - Outils et Méthodologie de Résolution de Problème", // 12
        "TRIZ - Introduction aux principaux outils de TRIZ", // 13
        "G2C - Gestion de crise", // 15
        "PAE - Du Projet à l'Action Entrepreneuriale" // 15
    ]
};

const fileNamesTemplate = [
    "PA_12",
    "SPE-DFS",
    "SPE-PAE",
    "SPE-TRIZ",
    "SPE-PMI",
    "SPE-PAE",
    "SPE-IEF",
    "SPE-MVP",
    "SPE-GPAS",
    "SPE-MCB",
    "SPE-G2C",
    "SPE-AS",
    "SPE-EIP",
    "SPE-AF",
    "SPE-MRP",
    "SPE-MEP",
    "TC_12"
];

const patternMail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const regexTC = /_TC_\d{2}_/;
const regexPA = /_PA_\d{2}_/
const regexSPE = /_SPE-\w{2,4}_/;
const regexAll = /_(SPE-\w{2,4}|PA_\d{2}|TC_\d{2})_/

// const regexTC = /LearnGdP_MOOC-GdP_TC_grade_report_\d{2}_/;
// const regexPA = /LearnGdP_MOOC-GdP_PA_grade_report_\d{2}_/;
// const regexSPE = /LearnGdP_MOOC-GdP_SPE-\w{2,4}_grade_report_/;
// const regexAll = /LearnGdP_MOOC-GdP_(SPE-\w{2,4}|PA_\d{2}|TC_\d{2})_grade_report_/;
// const regexFilename = /LearnGdP_MOOC-GdP_/;

//Départ import fichier sur clic fileInput
document.getElementById('importSelect').onchange = function(e) {
    $('#header-div').slideUp(); // à revoir ****
    //    document.getElementById('collapse1').classList.add('in');
    if (this.value) {
        document.getElementById('drop-container').classList.remove('hidden');
        $('#infos').hide();
    } else {
        $('#infos').show();
        $('#message').html('<span style="color:red">Oups! Sélection obligatoire avant l\'importation d\'un fichier</span>');
    }
};

// voir pour dropzone https://www.html5rocks.com/en/tutorials/file/dndfiles/
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = [...evt.dataTransfer.files]; //evt.dataTransfer.files; // FileList object.
    files = files.sort((a, b) => a.size - b.size);
    console.log(files);

    // var file = files[0];
    var flag;
    for (var i = 0, lgi = files.length; i < lgi; i++) {
        if (!files[i] || files[i] === undefined)
            return;
        // console.log(files[i].type);
        if (files[i].type === "text/csv" || files[i].type === "text/tab-separated-values" || files[i].type === "application/vnd.ms-excel") {
            flag = true;
        } else {
            swal({ title: "Information", text: "Oups! Tous les fichiers sélectionnés doivent être au format CSV...", icon: "warning" });
            flag = false;
            return;
        }
    };
    if (flag)
        getDataFiles(files);
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    evt.target.style.border = "4px dashed green";
}

$(function() {
    // Setup the dnd listeners.
    var dropZone = document.getElementById('drop_zone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
});

// départ upload à partir du input files
fileInput.onchange = function(e) {
    $('#infos').hide();
    var files = [...fileInput.files];
    // var file = files[0];
    files = files.sort((a, b) => a.size - b.size)
    console.log(files);
    getDataFiles(files)
}

function getDataFiles(files) {
    var filesNames = [],
        dataFiles = [];
    for (var i = 0, lgi = files.length; i < lgi; i++) {
        dataFiles.push(setupReader(files[i]));
        filesNames.push(files[i].name);
    }
    tableForFiles(dataFiles, filesNames);
}

function removeExtraSpaces(string){ return string.replace(/\s{2,}/g, ' ');}

function setupReader(file) {
    var obj = {};
    var reader = new FileReader();
    reader.onprogress = function(event) {}
    reader.onloadend = function(event) {}
    reader.onload = function(event) {
        var delimiter = Papa.parse(reader.result).meta.delimiter;
        var data = d3.dsvFormat(delimiter).parseRows(reader.result, function(d) {
            if (d && d !== undefined && d[0].length !== 0) return d;
        }).sort((a, b) => a[0] - b[0]);
        // var data = Papa.parse(reader.result).data;
        var csv = d3.csvParse(Papa.unparse(data));
        obj[file.name] = csv;

        var flag;
        // console.log(("Student ID").trim() == ("﻿Student ID").trim());
        data[0].forEach(function(title, i) {
            var headersElement = headersTemplate[headersTemplate.indexOf(title.trim())];
            // console.log(title, title == title.trim(), headersElement, headersTemplate.indexOf(title.trim()));
            if (headersTemplate.indexOf(title.trim()) === -1) {
                var html = document.createElement("div");
                var p = document.createElement("p");
                title = (title && title !== (' ')) ?
                    title :
                    "au moins une colonne ou un entête vide";
                p.innerHTML = '<h4 Fichier concerné:<br><b>' + file.name + '</b><br><br>Entête concerné:<br><b>' + title + '</b></h4><hr>';
                p.innerHTML += '<h4 style="color:red"> <i class="fa fa-warning"></i><br>entêtes en cours au ' + new Date().toLocaleDateString() + '</h4><br><br>';
                p.innerHTML += JSON.stringify(headersTemplate.map(header => "[" + header + "]").join(", "));
                html.appendChild(p);
                prettyDefaultControl("Contrôle entête de colonnes", "Oups! Apparemment, un entête de colonne n'est pas conforme au modèle attendu... ", html, "warning");
                flag = false;
            } else {
                flag = true;
            }
        })
    }
    reader.readAsText(file);
    return obj;
}

function checkProfile(data) {
    console.time("import");
    var flag = true;
    data[0].slice(0, 4).forEach(el => {
        if (headersProfile.indexOf(el) === -1) flag = false;
    });
    if (!flag)
        swal({
            title: "Fichier profile_info",
            text: "Un des champs en entête des 4 premières colonnes ne correspond pas au champs attendus dans l'ordre suivant:\n[id] [username] [name] [email]",
            icon: "warning"
        }).then(value => {});
    return flag;
}

function tableForFiles(dataFiles, filesNames) {
    // *** check doublons avant de continuer
    var gradesImported = [];
    filesNames.map(name => {
        if (name.match(regexAll)) return name.match(regexAll);
    }).forEach(reg => {
        if (reg !== undefined) gradesImported.push(reg[1]);
    });
    var duplicates = find_duplicate_in_array(gradesImported);
    console.log(duplicates);
    var html = document.createElement("div"),
        p = document.createElement("p");
    p.innerHTML = duplicates.join();
    html.appendChild(p);
    if (duplicates.length > 0) {
        prettyDefault(
            "Information fichiers importés",
            "Oups ! Apparemment 1 ou plusieurs fichiers importés sont en doublons.\nVeuillez rafraichir la page de votre navigateur... ",
            html, "warning");
        document.getElementById('fileInputMappage').disabled = true;
    }
    // fin de check doublons***

    // voir https://developer.mozilla.org/fr/docs/Web/API/File/Using_files_from_web_applications
    var getDataMappage = function(result) {
        var delimiter = Papa.parse(result).meta.delimiter;
        var data = d3.dsvFormat(delimiter).parseRows(result, function(d) {
            if (d && d !== undefined && d[0].length !== 0) return d;
        }).sort((a, b) => a[0] - b[0]);
        var dataMappage = d3.csvParse(Papa.unparse(data));
        // console.log(dataMappage);
        if (data !== undefined && checkProfile(data)) {
            loadingForExport();
            setTimeout(() => launchDataMappage(dataFiles, dataMappage, filesNames), 500);
        }
    }

    var handlePaste = function(e) {
        var clipboardData,
            pastedData;
        // Stop data actually being pasted into div
        e.stopPropagation();
        e.preventDefault();
        // Get pasted data via clipboard API
        clipboardData = e.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('Text');
        document.getElementById('paste_zone').innerHTML = pastedData;
        getDataMappage(pastedData);
    }

    var handleFileSelectMappage = function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var files = evt.dataTransfer.files; // FileList object.
        var file = files[0];
        if (!file || file === undefined)
            return;

        if (file.type === "text/csv" || file.type === "text/tab-separated-values" || file.type === "application/vnd.ms-excel") {
            var reader = new FileReader();
            reader.onprogress = function(event) {}
            reader.onloadend = function(event) {}
            reader.onload = function(event) {
                // convert to array
                getDataMappage(reader.result);
            }
            reader.readAsText(file);
        } else {
            swal({ title: "Information", text: "Oups! Tous les fichiers sélectionnés doivent être au format CSV...", icon: "warning" });
            return;
        }
    }

    var handleDragOverPaste = function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        evt.target.style.border = "4px dashed green";
    }

    var pasteZone = document.getElementById('paste_zone');
    pasteZone.addEventListener('dragover', handleDragOverPaste, false);
    pasteZone.addEventListener('drop', handleFileSelectMappage, false);
    pasteZone.addEventListener('paste', handlePaste, false);

    document.getElementById('fileInputMappage').onchange = function(e) {
        var file = this.files[0];
        var reader = new FileReader();
        reader.onprogress = function(event) {}
        reader.onloadend = function(event) {}
        reader.onload = function(event) {
            getDataMappage(reader.result);
        }
        reader.readAsText(file);
    }

    var importSelect = document.getElementById("importSelect");
    importSelect.disabled = true;
    document.getElementById('drop-container').classList.add('hidden');

    $('#table-files').empty();
    var message = 'Fichiers sélectionnés pour traitement <i class="glyphicon glyphicon-check"></i><br>';
    var tableDiv = document.getElementById('table-files');
    d3.select(tableDiv).selectAll("input").data(filesNames).enter().append('label').attr('class', 'labelCheckbox').attr('for', function(d, i) {
        return 'a' + i;
    }).text(d => d + " ").append("input").attr("checked", true).attr("type", "checkbox").attr("id", function(d, i) {
        return 'a' + i;
    });

    $('#infos-div').slideUp();
    document.getElementById('table-div').classList.remove('hidden');
    document.getElementById('tableDiv-infos').innerHTML = message;
}

function launchDataMappage(dataFiles, dataMappage, filesNames) {
    // console.log(dataFiles, dataMappage, filesNames);
    console.timeEnd("import");
    console.time("traitement_import");
    var headersByFile = [];
    dataFiles.forEach(obj => {
        var newObj = {};
        for (var k in obj) {
            newObj["fichier"] = k;
            newObj["titres"] = obj[k].columns;
        }
        headersByFile.push(newObj);
        // headersByFile = [].concat([], uniqueHeadersAllFiles);
    })
    // console.log(headersByFile);

    var dataSelected = [],
        flag = [],
        flat = [],
        uniqueHeaders;

    if (dataFiles.length > 1) {
        dataSelected = dataFiles.map(obj => obj[Object.keys(obj)[0]]);
        flag = new Set([...new Set([].concat.apply([], dataSelected.map(obj => obj.columns)))].map(
            el => headersTemplate.indexOf(el) !== -1 ?
            'true' :
            'false'));
    } else {
        dataSelected = dataFiles[0][Object.keys(dataFiles[0])];
        flag = new Set('true');
    }
    // headersTemplate.splice(34, 1, "year_of_birth");
    // headersTemplate.splice(35, 1, "gender");
    // headersTemplate.splice(36, 1, "level_of_education");
    // console.log(headersTemplate);
    // concaténation "en vrac" de tous les fichiers
    var arrConcatened = [].concat(...dataSelected);
    // // tous les enregistrements regroupés par ID
    var nestedData = d3.nest()
        .key(function(d) {
            return d[ref_ID];
        })
        .entries(arrConcatened);
        // console.log(nestedData);
    // fusion des enregistrements par ID en éliminant les doublons
    // sur les champs "communs variables" le dernier enrigistrement ecrase tous les autres
    for (var i = 0, lgi = nestedData.length; i < lgi; i++) {
        var item = nestedData[i],
            key = item.key,
            values = item.values;
        obj = {};
        for (var j = 0, lgj = values.length; j < lgj; j++) {
            headersTemplate.forEach(key => {
                if (values[j][key] !== undefined) obj[key] = values[j][key];
            });
        }
        flat.push(obj);
    }
    if (flag.has('false')) {
        prettyDefaultReload("Information fichiers imports", 'Oups!\nUn des fichiers au moins ne correpond pas au jeu de données attendu', "warning")
    } else {
        // if (test) {
        uniqueHeaders = [...new Set([].concat.apply([], flat.map(obj => Object.keys(obj))))];
        document.getElementById('loader-div').style.marginTop = "0px";
        setTimeout(() => {
            // console.log(flat);
            typeWriter(flat, dataMappage, uniqueHeaders, headersByFile, dataFiles);
        }, 100);
        // } else {
        //     var html = document.createElement("div");
        //     var p = document.createElement("p");
        //     p.innerHTML = '<b>Rappel important concernant le contenu des fichiers importés et leur récapitulatif en tableaux finaux après traitement.</b> (05/10/2018)<br>';
        //     p.innerHTML += '<br>Pour pouvoir être traités correctement, les fichiers importés doivent réunir certaines conditions.';
        //     p.innerHTML += '<br>Ça concerne notamment le fichier qui contiendra le plus de participants et donc de lignes enregistrées.';
        //     p.innerHTML += '<br><span style="color:red">Un participant non présent sur ce fichier ne sera pas pris en compte dans les tableaux finaux.<span>';
        //     p.innerHTML += '<br>Par ailleurs si un fichier TC est importé, il doit contenir au moins tous les participants présents sur tous les autres fichiers importés.';
        //     p.innerHTML += '<br><br>Apparemment et à priori, le fichier "TC" importé ne remplit pas une de ces conditions...';
        //     html.appendChild(p);
        //     var title = 'Merge info',
        //         text = 'Fichier TC non conforme...',
        //         icon = 'warning';
        //     prettyDefaultControl(title, text, html, icon);
        // }
    }
}

/* typed.js */
// dernière étape création du tableau de visualisation et avant ré-export des données traitées en fichier csv
// ré-export et création du tableau se font dans l'ordre et dans la foulée...
function typeWriter(flat, dataMappage, uniqueHeaders, headersByFile, dataFiles) {
    var importSelect = document.getElementById("importSelect");
    var importSelected = importSelect.options[importSelect.selectedIndex].value;
    var jsonDataFromCSV = flat.map(function(obj, i) {
        // // Permet de filtrer critères supplémentaires username, email
        // var username;
        // if (obj["Username"] && obj["Username"] !== undefined) {
        //     username = (isNaN(obj["Username"])) ? obj["Username"] : (obj["Username"]).toString();
        // }
        // console.log(username, obj["Email"], patternMail.test(obj["Email"]));
        // var resultName = dataMappage.find(item => item.username === username);
        // var resultMail = dataMappage.find(item => item.email === obj["Email"]);
        // (resultName === undefined || resultMail === undefined) ? obj["Name"] = "": obj["Name"] = resultName.name;

        // console.log(Object.keys(obj));

        var resultId = dataMappage.find(item => item.id === obj["Student ID"]);
        (resultId === undefined) ? obj["Name"] = "Absent sur profile_info" : obj["Name"] = resultId.name;
        // } else {
        //     // console.log(resultId.year_of_birth, resultId.gender);
        //     obj["Name"] = resultId.name;
        //     obj["year_of_birth"] = (resultId.year_of_birth) ? resultId.year_of_birth : "";
        //     obj["gender"] = (resultId.gender) ? resultId.gender : "";
        //     obj["level_of_education"] = (resultId.level_of_education) ? resultId.level_of_education : "";
        // }
        return sortObjectKeys(obj, headersTemplate);
    });
    var dataFromCSV = d3.dsvFormat(',').parseRows(Papa.unparse(jsonDataFromCSV), function(d, i) {
        return d; // (d.length !== 39) ? d.slice(0, 4) : d;
    }).sort(function(a, b) {
        return a[0] - b[0];
    });

    // *** traque et filtre les id vide, undefined, retour à la ligne
    var checkWrongID = function(array) {
        var headers = array[0].map(header => header.trim());
        var testCsv = [];
        array.forEach((el, i) => {
            if (i !== 0 && el[0] !== undefined && el[0] !== "" && !el[0].match(/^(\r\n|\r|\n)$/)) {
                el[0] = el[0].trim();
                testCsv.push(el);
            }
        })
        testCsv.unshift(headers);
        return testCsv;
    }
    dataFromCSV = checkWrongID(dataFromCSV);

    // console.log(dataFromCSV);
    // exportGradeOriginal(dataFromCSV);

    // fin de traque ***

    // ***
    var headersData = [];
    headersByFile.forEach((obj, i) => {
        var key = obj.fichier;
        var row = [];
        row.push('<div class="header-column">' + key + '</div>');
        for (var j in obj.titres) {
            row.push(obj.titres[j]);
        }
        headersData.push(row);
    });
    headersData.sort((a, b) => b.length - a.length);
    var filesTable = createTable(headersData, [dataFiles.length + " fichiers importés", "Entêtes de colonnne"], "pvtTable");

    document.getElementById('mapmind-div').classList.add('hidden');
    document.getElementById('loaderInfo-div').classList.add('hidden');
    document.getElementById('dataTable-infos').innerHTML = menuColorHTML(dataFromCSV, importSelected, dataFiles);
    document.getElementById('gradesImported-btn').onclick = function(e) {
        var html = document.createElement("div"),
            p = document.createElement("p"),
            title = 'Fichiers importés',
            text = '';
        html.appendChild($.parseHTML(filesTable)[0]);
        console.log(headersByFile);
        exportCSVExtra(headersByFile, "fichiers importés");
        prettyDefault(title, text, html, "success", "sweetalert-table");
    }

    // ***
    //console.log(dataFromCSV);
    // dataFromCSV = dataFromCSV.map(row => removeZeroNotAttempTedEtc(row));
    // flat.forEach(obj => {
    //   if (obj["Student ID"] === "34" || obj["Student ID"] === "40" || obj["Student ID"] === "10") console.log(obj);
    // });
    // var headers = headersByCategories;
    // var titleH3 = ['<h3>Visualisation des champs des fichiers importés</h3>'];
    // var titleCommuns = ['<h4><b>Champs communs</b></h4>'];
    // var titleEditions = ['<h4><b>Champs éditions</b></h4>']

    // var required = uniqueHeaders.map(el => {
    //     if (headers.required.indexOf(el) !== -1)
    //         return '<span style="background: #fff2cc">' + el + '</span>, ';
    // });
    // var tc = uniqueHeaders.map(el => {
    //     if (headers.tc.indexOf(el) !== -1)
    //         return '<span style="background: #cfe2f3">' + el + '</span><br>';
    // });
    // var livrables = uniqueHeaders.map(el => {
    //     if (headers.livrables.indexOf(el) !== -1)
    //         return '<span style="background: #f4cccc">' + el + '</span><br>';
    // });
    // var spe = uniqueHeaders.map(el => {
    //     if (headers.spe.indexOf(el) !== -1)
    //         return '<span style="background: #d9ead3">' + el + '</span><br>';
    // });
    // var txt = titleH3.concat(titleCommuns, required, titleEditions, tc, livrables, spe);
    document.getElementById('output-titles').innerHTML = filesTable; //headersTxt.join("");
    var txt = ['<h3>Visualisation des entêtes de colonne par fichier importé</h3><br>',
        '<p>Le tableau de données <span style="color:red">"' + importSelected + '"</span> va s\'afficher, veuillez patienter...</p>',
        '<i class="fa fa-spinner fa-spin" style="font-size:18px"></i>'
    ];
    var typed = new Typed('.typedClass', {
        strings: [txt.join("")],
        typeSpeed: 0,
        backSpeed: 0,
        shuffle: true,
        showCursor: false,
        onComplete: function(e) {
            if (importSelected === "grade_report_global") {
                globalReport(dataFromCSV, importSelected);
            } else if (importSelected === "synthese_analytics") {
                syntheseAnalytics(dataFromCSV, importSelected);
                // syntheseAnalyticsTest(dataFromCSV, importSelected);
            } else if (importSelected === "final_standard") {
                tableauFinalStandard(dataFromCSV, importSelected, dataMappage);
            }
        }
    });
}

//traitement des points en virgules, suppression des 0 et autres enregistrements inutiles ici
// function pointToComma(row) {
//     var patternPoint = /^[0-9]+([.][0-9]+)?%?$/;
//     var newRow = [];
//     for (var j = 0, lgj = row.length; j < lgj; j++) {
//         if (row[j] === "0.0" || row[j] === "0" || row[j] === "" || row[j] === " " || row[j] === 0) {
//             row[j] = "";
//         } else if (patternPoint.test(row[j])) {
//             row[j] = parseFloat(row[j]).toLocaleString(); // row[j].replace(/\,/, ".");
//         } else {
//             row[j] = row[j];
//         }
//         newRow.push(row[j]);
//     }
//     return newRow;
// }

function pointToComma(row) {
    var regexTags = /(<([^>]+)>)/ig;
    var patternPoint = /^[0-9]+([.][0-9]+)?%?$/;
    var newRow = [];
    for (var j = 0, lgj = row.length; j < lgj; j++) {
        if (row[j] === "0.0" || row[j] === "0" || row[j] === " ") {
            row[j] = "";
        } else if (!isNaN(Number(row[j])) && patternPoint.test(row[j])) {
            row[j] = parseFloat(row[j]).toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2}); // row[j].replace(/\,/, ".");
        } else {
            row[j] = row[j].replace(regexTags, "");
        }
        newRow.push(row[j]);
    }
    return newRow;
}

function commaToPoint(row) {
    var regexTags = /(<([^>]+)>)/ig;
    var patternComma = /^[0-9]+([,][0-9]+)?%?$/;
    var patternPoint = /^[0-9]+([.][0-9]+)?%?$/;
    var newRow = [];
    for (var j = 0, lgj = row.length; j < lgj; j++) {
        if (isNaN(Number(row[j])) && patternComma.test(row[j]) && !patternPoint.test(row[j])) {
            row[j] = parseFloat(row[j].replace(/\,/, ".")).toLocaleString('en-US',
                {minimumFractionDigits: 2, maximumFractionDigits: 2});
        } else if (row[j] === "0" || row[j] === " ") {
            row[j] = "";
        } else if (row[j] === "Not Attempted" || row[j] === "Not Available") {
            row[j] = "";
        } else {
            row[j] = row[j].replace(regexTags, "");
        }
        newRow.push(row[j]);
    }
    return newRow;
}

// function commaToPoint(row) {
//     var regexTags = /(<([^>]+)>)/ig;
//     var patternComma = /^[0-9]+([,][0-9]+)?%?$/;
//     var patternPoint = /^[0-9]+([.][0-9]+)?%?$/;
//     var newRow = [];
//     for (var j = 0, lgj = row.length; j < lgj; j++) {
//         if (isNaN(Number(row[j])) && patternComma.test(row[j]) && !patternPoint.test(row[j])) {
//             row[j] = parseFloat(row[j].replace(/\,/, ".")).toLocaleString('fr-FR', {minimumFractionDigits: 2});
//         } else if (row[j] === "0" || row[j] === " ") {
//             row[j] = "";
//         } else {
//             row[j] = row[j].replace(regexTags, "");
//         }
//         newRow.push(row[j]);
//     }
//     return newRow;
// }

// function removeZeroNotAttempTedEtc(row) {
//     var notAttempted = "Not Attempted";
//     var notAvailable = "Not Available";
//     var newRow = [];
//     for (var j = 0, lgj = row.length; j < lgj; j++) {
//         if (row[j] === "0.0" || row[j] === "0" || row[j] === " " || row[j] === 0) {
//             row[j] = "";
//         } else if (row[j] === notAttempted || row[j] === notAvailable) {
//             row[j] = "";
//         } else {
//             row[j] = row[j];
//         }
//         newRow.push(row[j]);
//     }
//     return newRow;
// }

function number_test(n) {
    return ((n - Math.floor(n)) !== 0) ? true : false;
}

function exportFinalStandard(data, filename) {
    console.time("export-final");
    var dataComma = data.map(row => pointToComma(row));
    dataCommaToCSV = Papa.unparse(dataComma);
    var BOM = "\uFEFF"; // issue https://github.com/eligrey/FileSaver.js/issues/28
    var csvDataComma = BOM + dataCommaToCSV;
    var blob = new Blob([csvDataComma], { type: "text/csv;charset=utf-8" });
    saveAs(blob, filename + "_comma.csv");
    console.timeEnd("export-final");
}

// export du fichier csv avec fileSaver.js
function exportCSVGeneral(data, filename) {
    var headers = data[0];
    document.getElementById('exportCSVPoint-btn').onclick = function(e) {
        document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
        setTimeout(() => {
            var dataPoint = data; // .map(row => removeZeroNotAttempTedEtc(row));
            dataPoint = dataPoint.map(row => row.filter((el, i) => i !== 6));
            dataPointToCSV = Papa.unparse(dataPoint, {delimiter: ';'});
            var BOM = "\uFEFF"; // issue https://github.com/eligrey/FileSaver.js/issues/28
            var csvDataPoint = BOM + dataPointToCSV;
            var blob = new Blob([csvDataPoint], { type: "text/csv; charset=utf-8" });
            saveAs(blob, filename + "_point.csv");
            document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
        }, 500);
    }
    document.getElementById('exportCSVComma-btn').onclick = function(e) {
        document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
        setTimeout(() => {
            var dataComma = data.map(row => pointToComma(row));
            dataCommaToCSV = Papa.unparse(dataComma, {delimiter: ';'});
            var BOM = "\uFEFF"; // issue https://github.com/eligrey/FileSaver.js/issues/28
            var csvDataComma = BOM + dataCommaToCSV;
            var blob = new Blob([csvDataComma], { type: "text/csv;charset=utf-8" });
            saveAs(blob, filename + "_comma.csv");
            document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
        }, 500);
    }
}

function exportCSVExtra(data, filename) {
    var headers = data[0];
    // console.log(data);
    var dataComma = data.map(row => pointToComma(row));
    dataPointToCSV = Papa.unparse(data);
    var BOM = "\uFEFF"; // issue https://github.com/eligrey/FileSaver.js/issues/28
    var csvDataPoint = BOM + dataPointToCSV;
    var blob = new Blob([csvDataPoint], { type: "text/csv;charset=utf-8" });
    saveAs(blob, filename + ".csv");
}

function exportGradeOriginal(data) {
    // console.log(data);
    // var array = d3.dsvFormat(',').parseRows(Papa.unparse(data));
    var dataPointToCSV = Papa.unparse(data);
    var BOM = "\uFEFF"; // issue https://github.com/eligrey/FileSaver.js/issues/28
    var csvDataPoint = BOM + dataPointToCSV;
    var blob = new Blob([csvDataPoint], { type: "text/csv;charset=utf-8" });
    saveAs(blob, 'grade-report-regrouped.csv');
}

/**
 * HELPERS
 */
// la fonction ci-dessous est l'étape qui permet de concaténer les colonnes et merger les enregistrements dans le même temps, au fil de l'eau
// solution finalement abandonnée en passant par la méthode utlisant la concaténation globale et d3.js pour le merge par Student ID
// ******************************************** IMPORTANT *********************************************************************************
// la fonction ne fait que ces actions précisément mais ne traite pas les doublons ou autres anomalies des fichiers csv importées
// comme les erreurs d'encodage des fichiers importés ou encore 2 valeurs différentes enregistrées sur un même champ par exemple
// exemple d'un champ commun "Pre mooc" ayant une cellule vide dans un fichier et une autre valeur 0.85 dans un autre fichier à concaténer
// la fonction ne prendra que la valeur du dernier fichier traité et écrasera la valeur précédente
// ****************************************************************************************************************************************
// function merge(a, b) {
//     "use strict";
//     a = a || {};
//     for (var k in b) {
//         if (b.hasOwnProperty(k)) {
//             // headersTemp.push(k);
//             // a = Object.assign(a, b); // test
//             // console.log(b);
//             // a[k] = b[k];
//             $.extend(a, b);
//         }
//     }
//     return a;
// }

// function merge2(arr1, arr2) {
//     // arr1 = arr1 || [];
//     console.log(arr1.length, arr2.length);
//     var arr3 = [];
//     arr1.forEach((itm, i) => {
//         // console.log(i, 'itm: ', itm, 'arr2: ', arr2[i]);
//         // if ( itm["Student ID"] === arr2[i]["Student ID"]) arr3.push(Object.assign({}, itm, arr2[i]));
//         // arr3.push(_.merge(arr2[i], itm));
//         // console.log(i, Object.assign({}, itm, arr2[i]));
//         arr3.pop(Object.assign({}, itm, arr1[i]));
//     });
//     console.log(arr3);
//     return arr3;
// }
// function groupBy(array, property) {
//     return array.reduce(function(acc, item) {
//         var key = item[property];
//         acc[key] = acc[key] || [];
//         acc[key].push(item);
//         return acc;
//     }, {});
// }

// // abandonné mais permet classer le fichier TC en fin
// function compareObjects(a, b) {
//     if (a.name.match(regexTC)) {
//         return 1;
//     }
//     return 0;
// }

// https://www.w3resource.com/javascript-exercises/javascript-array-exercise-20.php
function find_duplicate_in_array(arra1) {
    const object = {};
    const result = [];
    arra1.forEach(item => {
        if (!object[item])
            object[item] = 0;
        object[item] += 1;
    })
    for (const prop in object) {
        if (object[prop] >= 2) {
            result.push(prop);
        }
    }
    return result;

}

// classe en fonction dans modèles ici headersTemplate
function sortObjectKeys(obj, keys) {
    return keys.reduce((acc, key) => {
        var index = keys.indexOf(key);
        acc[key] = obj[key];
        return acc;
    }, {});
}

function test_TC_length(files) {
    var lgFiles = files.map(el => el.length);
    var last = files[files.length - 1].length;
    var max = d3.max(lgFiles);
    return (max <= last) ? { "check": true, "max": max, "lgFiles": lgFiles } : { "check": false, "max": max, "lgFiles": lgFiles };
}
// non utilisé ici
function promiseUpdateItem(item) {
    return new Promise((resolve, reject) => {
        if (item) {
            resolve("ok");
        } else {
            reject("error");
        }
    });
}

document.getElementById('note-img').onclick = function(e) {
    var html = document.createElement("div");
    html.style.textAlign = "center";
    var img = document.createElement("IMG");
    img.src = "img/champs-gdp12.jpg";
    img.width = "980";
    html.appendChild(img);
    prettyDefault("INFO FICHIER", "Champs type requis par fichier importé", html, null, "sweetalert-img")
}

function loadingForExport() {
    $('#table-files').hide();
    $('#table-container').empty();
    document.getElementById('table-div').classList.add('hidden');
    $('#intro-div').slideUp();
    $('#loader-div').show();
}

// Remove null, 0, blank, false, undefined and NaN values from an array
// https://www.w3resource.com/javascript-exercises/javascript-array-exercise-24.php
function filter_array(test_array) {
    var index = -1,
        arr_length = test_array ? test_array.length : 0,
        resIndex = -1,
        result = [];
    while (++index < arr_length) {
        var value = test_array[index];

        if (value) {
            result[++resIndex] = value;
        }
    }
    return result;
}

function menuColorHTML(csv, importSelected, dataFiles) {
    var html = '<h4>' + importSelected + ' <span class="badge" style="font-size:16px">' + (csv.length - 1) + '</span> enregistrements';
    html += '<span type="button" id="gradesImported-btn" class="btn btn-primary btn-xs" style="margin-left:0.5em">' + dataFiles.length + ' fichiers </span></h4>';
    html += ' <span id="exportCSVPoint-btn" class="btn btn-default btn-xs" style="margin-left:3em" title="export csv (point en décimale)">';
    html += ' <i class="glyphicon glyphicon-export"></i> CSV (point)</span></span>';
    html += ' <span id="exportCSVComma-btn" class="btn btn-default btn-xs" style="margin-left:1em" title="export csv (virgule en décimale)">';
    html += ' <i class="glyphicon glyphicon-export"></i> CSV (virgule)</span></span>';
    html += '<button type="button" id="cohortes-btn" class="btn btn-default btn-xs" style="margin-left:1em"></button>';
    html += '<select id="selectCohortes-btn" class="btn btn-default btn-xs" style="margin-left:1px;max-width:80px; height:24px"></select>';
    html += '<span type="button" id="tcd-btn" class="btn btn-primary btn-xs" style="margin-left:4em">tableau croisé</span></h4>';
    html += '<span type="button" id="dataTable-btn" class="btn btn-primary btn-xs hidden" style="margin-left:2em">dataTable</span></h4>';
    html += '<span type="button" id="network-btn" class="btn btn-primary btn-xs" style="margin-left:2em">graphe</span></h4>';
    html += '<button type="button" id="fullScreen-btn" class="btn btn-default btn-xs" style="margin-left:1em" title="plein écran">';
    html += '<i class="glyphicon glyphicon-fullscreen"></i> f11</button>';
    html += '<span id="loaderToolbarTable-div" class="hidden" style="margin-left:1em;color:red; font-size:12px">';
    html += '<i class="fa fa-spinner fa-spin"></i> patientez...</span>';
    return html;
}

// For datatables
function toolbarHTML() {
    html = '<button type="button" id="duplicates-btn" class="btn btn-default btn-xs">doublons</button>';
    html += '<button type="button" id="absences-btn" class="btn btn-default btn-xs" style="margin-left:2px">absences</button>';
    html += '<span id="loaderToolbarTable-div" class="hidden" style="margin-left:0.5em;color:red">';
    html += '<i class="fa fa-spinner fa-spin"></i> patientez...</span>';
    return html;
}

function getDetailsCohortes(data, selected, cohortTitle) {
    // console.log(selected, cohortTitle);
    var patternPoint = /^[0-9]+([.][0-9]+)?%?$/;
    var testPoint = function(d) {
        return patternPoint.test(d) ? d.replace(/\./, ",") : d;
    }
    var nestedCohortes = d3.nest()
        .key(d => d[cohortTitle])
        .rollup(v => {
            var gradesFull = v.map(d => (isNaN(parseFloat(d[selected]))) ? 0 : Math.round(parseFloat(d[selected]) * 100) / 100);
            gradesFull.sort();
            var grades = filter_array(gradesFull);
            // if (grades.length >= 1) console.log(grades);
            var median = grades.length >= 1 ? parseFloat(d3.median(grades)) : 0,
                min = grades.length >= 1 ? parseFloat(d3.min(grades)) : 0,
                max = grades.length >= 1 ? parseFloat(d3.max(grades)) : 0,
                avg = grades.length >= 1 ? parseFloat(d3.mean(grades)) : 0,
                quartileFirst = grades.length > 1 ? parseFloat(d3.quantile(grades, 0.25)) : 0,
                quartileThird = grades.length > 1 ? parseFloat(d3.quantile(grades, 0.75)) : 0,
                decileFirst = grades.length > 1 ? parseFloat(d3.quantile(grades, 0.1)) : 0,
                decileLast = grades.length > 1 ? parseFloat(d3.quantile(grades, 0.9)) : 0,
                // rapportD9D1 = (decileFirst !== 0 && decileLast !== 0) ? (decileLast / decileFirst) : 0,
                variance = grades.length > 1 ? parseFloat(d3.variance(grades)) : 0,
                deviation = grades.length > 1 ? parseFloat(d3.deviation(grades)) : 0;
            return {
                gradesFull: gradesFull.length,
                grades: grades.length,
                min: min !== 0 ? min.toFixed(2) : "",
                max: max !== 0 ? max.toFixed(2) : "",
                avg: avg !== 0 ? avg.toFixed(2) : "",
                median: median !== 0 ? median.toFixed(2) : "",
                quartileFirst: quartileFirst !== 0 ? quartileFirst.toFixed(2) : "",
                quartileThird: quartileThird !== 0 ? quartileThird.toFixed(2) : "",
                decileFirst: decileFirst !== 0 ? decileFirst.toFixed(2) : "",
                decileLast: decileLast !== 0 ? decileLast.toFixed(2) : "",
                // rapportD9D1: rapportD9D1 !== 0 ? rapportD9D1.toFixed(2) : "",
                variance: variance !== 0 ? variance.toFixed(2) : "",
                deviation: deviation !== 0 ? deviation.toFixed(2) : ""
            };
        })
        .entries(data);
    // console.log(nestedCohortes);

    var cohortesHtml = [
        ["cohorte", "participants", "actifs", "min", "max", "moyenne", "médiane", "1er quartile", "3ème quartile", "1er décile",
            "9ème décile", "variance", "écart-type"
        ] // , "rapport (D9/D1)"
    ];

    nestedCohortes.forEach(obj => {
        var k = obj.key;
        var v = obj.value;
        var grades = v.grades;
        cohortesHtml.push([k, v.gradesFull, v.grades, v.min, v.max, v.avg, v.median, v.quartileFirst, v.quartileThird,
            v.decileFirst, v.decileLast, v.variance, v.deviation
        ]);
    })
    // console.log(cohortesHtml);
    return cohortesHtml;
}

/* SweetAlert */

function prettyDefault(title, text, html, icon, className) {
    swal({ title: title, text: text, content: html, icon: icon, className: className }).then(value => {
        // console.log(value);
    });
}

function prettyDefaultReload(title, text, icon) {
    swal({ title: title, text: text, icon: icon }).then(value => {
        setTimeout(() => window.location.href = window.location.href, 10);
    });
}

function prettyDefaultControl(title, text, html, icon) {
    swal({ title: title, text: text, content: html, icon: icon, className: "sweetalert-lg" }).then(value => {
        setTimeout(() => window.location.href = window.location.href, 10);
    });
}

// création simple de table html pour sweetALert pvtTable
function createTable(data, headers, className) {
    // console.log(data, headers);
    table = '<table class="' + className + ' tableForSweet" style="margin:5px auto">';
    table += '<thead><tr>';
    headers.forEach(header => {
        // console.log(header);
        table += '<th>' + header + '</th>';
    });
    table += '</tr></thead>';
    table += '<tbody>';
    data.forEach(row => {
        // console.log(row.length);
        table += '<tr>';
        row.forEach(cell => {
            table += '<td>' + cell + '</td>';
        })
        table += '</tr>';
    });
    table += '</tbody></table>';
    return table;
}

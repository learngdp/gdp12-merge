function globalReport(dataFromCSV, importSelected) {
    // déplacement de la colonne cohorte à la 5ème colonne
    var data = dataFromCSV.map(row => removeZeroNotAttempTedEtc(row));
    // var cohortes = [];
    data.forEach((el, i) => {
        let cohorte = el[31]
        // cohortes.push(cohorte);
        el.splice(31, 1);
        el.splice(4, 0, cohorte);
    });

    var select = $('#selectCohortes-btn');
    // suppression des options existantes
    select.find('option').remove();
    // implémentation liste options complète
    for (var i = 0, lgi = cohortesOptions.length; i < lgi; i++) {
        select.append('<option value="' + cohortesOptions[i] + '">' + cohortesOptions[i] + '</option>')
    }
    var cohortes = [...new Set(data.map(el => el[4]))];
    var cohortTitle = cohortes[0];

    cohortes = cohortes.slice(1, cohortes.length);
    setTimeout(() => {
        dataToTable(data, importSelected, cohortes, cohortTitle);
    }, 1000);
}

/* DATATABLES pour les sorties "anlalytics" et "final-standard" */
function dataToTable(csv, importSelected, cohortes, cohortTitle) {
    console.timeEnd("traitement_import");
    var headers = csv[0];

    csv = csv.map(el => el.map((el, i) =>
            (el === "0" || el === "0.0") ? "" : (i !== 0 && el !== undefined && number_test(el.valueOf()) && Number.isInteger(parseInt(el))) ? parseFloat(el).toFixed(2) : el
        ))
        .sort(function(a, b) {
            return a[0] - b[0];
        });

    var ids = csv.map(el => el[0]);
    var duplicates = [],
        header = ["Ligne", "Student ID"],
        duplicatesHtml = [header],
        absencesHtml = [header],
        flag;
    csv.forEach((el, i) => {
        var id = el[0];
        flag = ids.indexOf(id);
        var row = [i, id];
        if (flag !== i) {
            duplicatesHtml.push(row);
            duplicates.pus(el[0]);
        }
        if (el[2] === "Absent sur profile_info") absencesHtml.push(row);
    });
    // console.log(duplicatesHtml, absencesHtml[0], grades70Html, final70Html);

    (csv.length > 500) ? console.time("dataTable_1er_affichage"): console.time("dataTable_affichage_complet");

    document.getElementById('dataTable-container').classList.remove('hidden');
    document.getElementById('fullScreen-btn').onclick = function(e) {
        var htmlElement = document.documentElement;
        if (htmlElement.requestFullscreen) {
            htmlElement.requestFullscreen();
        } else if (htmlElement.mozRequestFullScreen) { /* Firefox */
            htmlElement.mozRequestFullScreen();
        } else if (htmlElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            htmlElement.webkitRequestFullscreen();
        } else if (htmlElement.msRequestFullscreen) { /* IE/Edge */
            htmlElement.msRequestFullscreen();
        }
    }

    var columns = headers.map(function(el) {
        return { "title": el }
    })
    // console.log(columns.length);

    var divheaders = headers.map((el, i) => {
        return '<a class="toggle-vis btn btn-default btn-xs" data-column="' + i + '">' + el + '</a>';
    });

    // *** voir chargement du reste des données en fin de fonction ***
    var dataset = (csv.length > 500) ? csv.slice(1, 500) : csv.slice(1, csv.length);
    // console.log(dataset);

    var datasetIds = dataset.map(el => el[0]);
    // console.log(datasetIds.length);
    $('#dataTable-tag').DataTable({
        // stateSave: true,
        lengthMenu: [
            [15, 25, 50, 100, 500, 1000, -1],
            [15, 25, 50, 100, 500, 1000]
        ],
        displayLength: 15,
        retrieve: true,
        responsive: true,
        deferRender: true,
        data: dataset,
        columns: columns,
        autoWidth: true,
        columnDefs: columns,
        dom: 'l<"toolbar">frtip',
        initComplete: function(settings) {
            // filtres sur entêtes de colonnes
            this.api().columns().every(function(index) {
                // // toolbar
                $("div.toolbar")
                    .html(toolbarHTML());
                if (csv.length > 500) document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
            });
        },
        "rowCallback": function(row, data, index) {
            var flag = (duplicates !== undefined) ? (duplicates.indexOf(data[0]) !== -1) : "";
            if (flag) $(row).addClass('duplicate');
            if (patternMail.test(data[3]) && data[3] !== "" && data[1] !== data[3]) $(row).addClass('selected');
            if (data[2] === "Absent sur profile_info") {
                $(row).find('td').eq(2).css({ "background": "rgba(255, 105, 180, 0.6)" }); // #FF69B4
                $(row).find('td').eq(0).css({ "background": "rgba(255, 105, 180, 0.6)" });
            }
        },
        "oSearch": { "bSmart": false, "bRegex": true },
        "language": {
            "decimal": ",",
            "thousands": " ",
            "lengthMenu": "Afficher _MENU_ lignes par page",
            "zeroRecords": "Aucun enregistrement trouvé !",
            "info": "Page _PAGE_ / _PAGES_",
            "infoEmpty": "Aucun enregistrement disponible",
            "infoFiltered": "(filtrée(s) sur _MAX_ lignes)",
            "search": "Recherche",
            "paginate": {
                "first": "1ère",
                "last": "Dernière",
                "next": "Suivant",
                "previous": "Précédent"
            }
        }
    });
    var table = $('#dataTable-tag').DataTable();
    // Ne marche que  pour les lignes "visibles"
    var indexes = table.rows().eq(0).filter(function(rowIdx) {
        return (duplicates.indexOf(table.cell(rowIdx, 0).data()) !== -1) ? true : false;
    });
    // Add a class to those rows using an index selector
    table.rows(indexes)
        .nodes()
        .to$()
        .addClass('duplicate');

    // extra data
    var buttonDuplicates = document.getElementById('duplicates-btn');
    buttonDuplicates.innerHTML = (duplicatesHtml.length - 1) + " doublons";
    if (duplicatesHtml.length > 1) buttonDuplicates.classList.toggle("btn-danger", "btn-default");

    var buttonAbsences = document.getElementById('absences-btn');
    buttonAbsences.innerHTML = (absencesHtml.length - 1) + " absences";
    if (absencesHtml.length > 1) buttonAbsences.classList.toggle("btn-danger", "btn-default");

    // console.log(cohortTitle, cohortes);
    var buttonCohortes = document.getElementById('cohortes-btn');
    buttonCohortes.innerHTML = cohortes.length + ' cohortes'; // <i id="cohortes-spin" class="fa fa-spinner fa-spin hidden"></i>';
    if (cohortes.length > 1) buttonCohortes.classList.toggle("btn-warning", "btn-default");

    // console.log(importSelected);
    if (importSelected !== "grade_report_global") {
        buttonCohortes.classList.add('hidden');
        document.getElementById('selectCohortes-btn').classList.add('hidden');
    }

    // launch extra data by click
    buttonDuplicates.onclick = function(e) {
        document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
        setTimeout(getExtraData("doublons", duplicatesHtml, this), 500);
    }

    buttonAbsences.onclick = function(e) {
        document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
        setTimeout(getExtraData("absences", absencesHtml, this), 500);
    }

    buttonCohortes.onclick = function(e) {
        var selected = document.getElementById('selectCohortes-btn').value;
        var cohortesHtml = getDetailsCohortes(d3.csvParse(Papa.unparse(csv)), selected, cohortTitle);
        document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
        setTimeout(() => {
            getExtraData("cohortes (détails)", cohortesHtml, this, selected);
        }, 100);
        e.stopPropagation();
    }

    // for extra data
    var getExtraData = function(extraTitle, extraDataHtml, button, selected) {
        var pointToComma = function(d) {
            return (isNaN(parseFloat(d))) ? d : parseFloat(d).toLocaleString("fr-FR");
        }
        var html = document.createElement("div"),
            p = document.createElement("p"),
            title = "Recherche " + extraTitle,
            text;
        if (extraDataHtml.length > 1 && extraDataHtml[0].length === 2) {
            document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
            // p.innerHTML = extraDataHtml.map(arr => arr.join(" | ")).join(", ");
            text = (extraDataHtml.length - 1) + ' ' + extraTitle;
            var extraTable = createTable(extraDataHtml.slice(1, extraDataHtml.length), extraDataHtml[0], "pvtTable");
            // console.log($.parseHTML(extraTable)[0])
            html.appendChild($.parseHTML(extraTable)[0]);
            prettyDefault(title, text, html, "success");
            exportCSVExtra(extraDataHtml, extraTitle);
        } else if (extraDataHtml.length > 1 && extraDataHtml[0].length >= 9) {
            document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
            // p.innerHTML = extraDataHtml.map(arr => arr.join(" | ")).join(", ");
            text = (extraDataHtml.length - 1) + ' ' + extraTitle + ' => ' + selected;
            var extraTable = createTable(extraDataHtml.slice(1, extraDataHtml.length), extraDataHtml[0], "pvtTable");
            // console.log($.parseHTML(extraTable)[0])
            html.appendChild($.parseHTML(extraTable)[0]);
            prettyDefault(title, text, html, "success", "sweetalert-lg");
            var extraDataExport = extraDataHtml.map(row => row.map(d => pointToComma(d)));
            exportCSVExtra(extraDataExport, extraTitle + '_' + selected);
        } else {
            document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
            p.innerHTML = "";
            html.appendChild(p);
            text = 0 + ' ' + extraTitle + ' trouvé (recherche par "Student ID")';
            prettyDefault(title, text, html, "success");
        }
    }

    // // Permet de surligner au passage de la sourisn non actif ici car énergivore
    // $('#dataTable-tag' + ' tbody')
    //     .on('mouseenter', 'td', function() {
    //         var colIdx = table.cell(this).index().column;
    //         $(table.cells().nodes()).removeClass('highlight');
    //         $(table.column(colIdx).nodes()).addClass('highlight');
    //     });

    document.getElementById('loaderInfo-div').classList.toggle('hidden');
    $('#loader-div').hide();
    (csv.length > 500) ? console.timeEnd("dataTable_1er_affichage"): console.timeEnd("dataTable_affichage_complet");

    if (csv.length > 500) {
        console.time("dataTable_affichage_complet");
        setTimeout(() => {
            table.columns().every(function(index) {
                var select = $('#select_' + index);
                var optionsFull = [...new Set(csv.map(el => el[index]))]; //.slice(501, csv.length).map(el => el[index]))];
                // suppression des options existantes
                select
                    .find('option')
                    .remove();
                // implémentation liste options complète
                for (var i = 0, lgi = optionsFull.length; i < lgi; i++) {
                    select.append('<option value="' + optionsFull[i] + '">' + optionsFull[i] + '</option>')
                }
            });
            table.clear().rows.add(csv.slice(1, csv.length)).draw();
            document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
            console.timeEnd("dataTable_affichage_complet");
        }, 50);
    }

    document.getElementById('tcd-btn').onclick = function(e) {
        $('.fa-spinner').toggleClass('hidden');
        setTimeout(() => {
            document.getElementById(this.id).classList.toggle('hidden');
            document.getElementById('dataTable-btn').classList.toggle('hidden');
            document.getElementById('dataTable-container').classList.toggle('hidden');
            document.getElementById('pivot-container').classList.toggle('hidden');
            pivotTable(csv, headers);
            $('.fa-spinner').toggleClass('hidden');
        }, 100);
    }

    document.getElementById('dataTable-btn').onclick = function(e) {
        console.log()
        $('.fa-spinner').toggleClass('hidden');
        setTimeout(() => {
            document.getElementById(this.id).classList.toggle('hidden');
            document.getElementById('tcd-btn').classList.toggle('hidden');
            document.getElementById('dataTable-container').classList.toggle('hidden');
            document.getElementById('pivot-container').classList.toggle('hidden');
            $('.fa-spinner').toggleClass('hidden');
        }, 100);
    }

    // ajoute les titres en haut pour afficher ou masquer les colonnes
    document.getElementById('toggleColumn').innerHTML = divheaders.join(' ');
    // permet d'afficher et masquer les colonnes en cliquant sur les titres ci-dessus
    $('a.toggle-vis').on('click', function(e) {
        e.preventDefault();
        // Get the column API object
        var column = table.column($(this).attr('data-column'));
        // Toggle the visibility
        column.visible(!column.visible());
        $(this).toggleClass("active");
    });
    exportCSVGeneral(csv, importSelected);
} // dataToTable

/* pivot table */
function pivotTable(data, rows) {
    dataPivot = d3.csvParse(Papa.unparse(data));
    dataPivot.sort(function(a, b) {
        return a[ref_ID] - b[ref_ID];
    });
    // console.log(dataPivot, rows);
    var sortAs = $.pivotUtilities.sortAs;
    var derivers = $.pivotUtilities.derivers;
    var renderers = $.extend($.pivotUtilities.renderers, $.pivotUtilities.export_renderers, $.pivotUtilities.plotly_renderers); //, $.pivotUtilities.c3_renderers
    $("#pivotTable").pivotUI(dataPivot, {
        renderers: renderers,
        rows: [rows[4]],
        cols: [rows[5]],
        // sorters: {
        //   [pivotQuestions[0]]: sortAs([nonconcerne, faible, modere, eleve]),
        //   [pivotQuestions[1]]: sortAs([nonconcerne, faible, modere, eleve]),
        // },
        // exclusions: {
        //     "karasek": ["détendu", "passif"]
        // },
        //hiddenAttributes: ["nonconcerne"],
        aggregatorName: "Nombre",
        // rendererName: "Horizontal Stacked Bar Chart",
        // rendererName: "Dégradé de couleurs",
        rendererOptions: {
            table: {
                clickCallback: function(e, value, filters, pivotData) {
                    e.preventDefault();
                    var filterValues = [];
                    for (var i in filters) {
                        if (filters.hasOwnProperty(i)) {
                            filterValues.push('<b>' + i + ': </b>' + filters[i]);
                        }
                    }
                    var contentCell = (!value) ?
                        "" :
                        value.toFixed(3);
                    var htmlContent = filterValues.join(', ') + '<br><b>Valeur case: </b>' + contentCell;
                    document.getElementById("textModalInput").innerHTML = htmlContent;
                    $(e.target).attr("data-toggle", "modal").attr("data-target", "#modalInput");
                }
            }
        } // fin rendererOptions
    }, false, "fr");
    $('#pivotTable .pvtUi tbody tr td').on('mouseover', function(e) {
        //console.log('enter ', 'td', e.target);
        if ($(e.target).context.classList && $(e.target).context.classList[0] === "pvtVal") {
            var rowClass = '.' + $(e.target).context.classList[1];
            var colClass = '.' + $(e.target).context.classList[2];
            $(rowClass).addClass('hightlight');
            $(colClass).addClass('hightlight');
        } else {
            e.preventDefault();
        }
    }).on("mouseout", 'td', function(e) {
        if ($(e.target).context.classList && $(e.target).context.classList[0] === "pvtVal") {
            var rowClass = '.' + $(e.target).context.classList[1];
            var colClass = '.' + $(e.target).context.classList[2];
            $(rowClass).removeClass('hightlight');
            $(colClass).removeClass('hightlight');
        } else {
            e.preventDefault();
        }
    });
    // voir pour ajouter fonction save restore https://pivottable.js.org/examples/save_restore.html
    // en ajoutant les boutons #save et #restore au préalable

    $('.pvtRenderer').addClass('form-control');
}

/**
 * PARTIE CALCUL FORMULES
 */

function syntheseAnalytics(dataFromCSV, importSelected) {
    // console.log(dataFromCSV);
    var data = dataFromCSV.map(row => removeZeroNotAttempTedEtc(row));
    var pass70 = 0.695;

    var headersAnalytics = [
        "ID", // 0
        "Mail", // 1
        "Nom (onglet profile) NOM Prénom", // 2
        "Username (onglet grade)", // 3
        "Cohorte", // 4
        "Grade = note globale (% sans virgule)", // 5
        "NB modules TC passés (<0%)", // 6
        "examen TC à plus de 70% (69,5%) 1 si oui", // 7
        "NB spé validées >=70 % (69,5%)", // 8
        "validation parcours classique (https://bit.ly/2GilrWR)", // 9
        "grade >=50% (1 si oui)", // 10
        "2 spé validées (1 si oui)", // 11
        "validation parcours avancé (https://bit.ly/2GilrWR)", // 12
        "grade >=70% (1 si oui)", // 13
        "3 livrables >5% (1 si oui)", // 14
        "3 livrables >1% (1 si oui)", // 15
        "attestation payée ou exonéré = verified", // 16
        "meilleure spécialisation sur les 15", // 17
        "deuxième meilleure spécialisation sur les 15", // 18
        "Certificat classique réussi (1 si oui)", // 19
        "Certificat avancé réussi (1 si oui)", // 20
        "Évaluation Hebdo 1: Évaluation (notée)", // 21
        "Évaluation Hebdo 2: Évaluation (notée)", // 22
        "Évaluation Hebdo 3: Évaluation (notée)", // 23
        "Évaluation Hebdo 4: Évaluation (notée)", // 24
        "Évaluation Hebdo (Avg)", // 25
        "Examen Final", // 26
        "Livrable 1 : Carte Conceptuelle - Semaine 1", // 27
        "Livrable 2 : Compte-rendu - Semaine 2", // 28
        "Livrable 3 : Planification - Semaine 3", // 29
        "Livrables (Avg)", // 30
        "DFS - Diagnostic de Fonctionnement d'un Système", // 31
        "MCB - Management de la Créativité et Brainstorming",
        "MEP - Management d'Équipe Projet",
        "IEF - Les outils informatiques & Évaluer financièrement les projets",
        "PMI - Certifications professionnelles PMI®",
        "AF - Analyse Fonctionnelle",
        "AS - Analyse Stratégique dans les Projets",
        "EIP - Évaluation d'Impact des Projets",
        "PAV - Planification Avancée",
        "MVP - Management Visuel de Projet",
        "GPAS - Gestion de projet agile avec Scrum",
        "MRP - Méthode de Résolution de Problèmes",
        "TRIZ - Introduction aux principaux outils de TRIZ",
        "G2C - Gestion de crise",
        "PAE - Du Projet à l'Action Entrepreneuriale", // 45
        // "Spécialisation (Avg)", // 46
        "Pre MOOC" // 47
    ];

    var headersSpe = [data[0].slice(15, 30)];
    // console.log(headersSpe);
    var dataSpec = data.slice(1, data.length);
    // .sort(function(a, b) {
    //     return a[0] - b[0];
    // });

    // Test pour vérifier le format décimal dans le jeu de données... à optimiser
    var patternPoint = /^[0-9]+([.][0-9]+)?%?$/;
    var patternComma = /^[0-9]+([,][0-9]+)?%?$/;
    var testComma = [].concat.apply([], dataSpec.map(function(el) {
        return el.filter(function(el) {
            return patternPoint.test(el) && el !== undefined && number_test(el.valueOf()) && Number.isInteger(parseInt(el));
        });
    }));

    var rangeNbTc = dataSpec.map((row) => row.slice(5, 9).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el)));
    var rangeLivrable = dataSpec.map((row) => row.slice(10, 13).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el)));
    var rangeSpe = dataSpec.map((row) => row.slice(15, 30).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el)));
    //    console.log(rangeNbTc);
    var rangeClassic = dataSpec.map((row) => row.slice(5, 9).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el))); // OK
    var examenFinal = dataSpec.map((row) => row.slice(14, 15).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el))); // OK
    var rangeDevoirs = dataSpec.map((row) => row.slice(10, 13).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el))); // OK
    var countNbTC, countTC, countGrade50, countGrade70, livrableSup5, livrableSup1, countSpe, classic2Modules, classic3devoirs;

    if (testComma.length > 0) {
        for (var i = 0, lgi = dataSpec.length; i < lgi; i++) {
            // console.log(dataSpec[i].length);
            countNbTC = rangeNbTc[i].filter((el) => el > 0).length;
            countTC = dataSpec[i].filter((el) => el[14] > pass70).length;
            countGrade50 = dataSpec[i].filter((el) => el[4] > 0.5).length;
            countGrade70 = dataSpec[i].filter((el) => el[4] > pass70).length;
            livrableSup70 = rangeLivrable[i].filter((el) => el > pass70).length;
            livrableSup5 = rangeLivrable[i].filter((el) => el > 0.05).length;
            livrableSup1 = rangeLivrable[i].filter((el) => el > 0.01).length;

            // nombre spécialisations réussies
            countSpe = rangeSpe[i].filter((el) => el > pass70).length;

            // remplacement des données initiales par les données traitées
            dataSpec[i].push(dataSpec[i][3]); // 3
            dataSpec[i].push(dataSpec[i][31]); // 4 (cohorte 31)

            // GRADE
            (isNaN(parseFloat(dataSpec[i][4]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][4]) * 100).toFixed(0)); // 5

            // NB SPE REUSSIES
            (countNbTC >= 1) ? dataSpec[i].push((Math.round(countSpe * 100) / 100).toFixed(0)): dataSpec[i].push("0.0"); // 6

            // Examen TC à plus de >= 70%
            console.log(dataSpec[i][4], livrableSup70, countNbTC);
            // (countTC >= 1) ? dataSpec[i].push("1"): dataSpec[i].push("0.0"); // 7
            (parseFloat(dataSpec[i][4]) > pass70 && livrableSup70 === 3 && countNbTC >= 2) ? dataSpec[i].push("1"): dataSpec[i].push("0.0"); // 7

            dataSpec[i].push(countSpe.toFixed(0)); //8

            // validation parcours classique
            // (countGrade50 >= 1 && countSpe >= 2) ? dataSpec[i].push("OUI"): dataSpec[i].push("NON"); // 9 À REVOIR
            ((d3.sum(rangeClassic[i]) + d3.sum(rangeDevoirs[i])) / 7 > pass70 && examenFinal[i][0] > pass70 && countSpe >= 2) ? dataSpec[i].push("OUI"): dataSpec[i].push("NON"); // 9

            (countGrade50 >= 1) ? dataSpec[i].push("1"): dataSpec[i].push("0.0"); // 10
            (countSpe >= 2) ? dataSpec[i].push("1"): dataSpec[i].push("0.0"); // 11

            // validation parcours avancé
            // (countGrade70 >= 1 && livrableSup5 === 3 && livrableSup1 === 3) ? dataSpec[i].push("OUI"): dataSpec[i].push("NON"); // 12
            ((d3.sum(rangeClassic[i]) + d3.sum(rangeDevoirs[i])) / 7 > pass70 && examenFinal[i][0] > pass70 && countSpe >= 2) ? dataSpec[i].push("OUI"): dataSpec[i].push("NON");

            (countGrade70 >= 1) ? dataSpec[i].push("1"): dataSpec[i].push("0.0"); // 13
            (livrableSup5 === 3) ? dataSpec[i].push("1"): dataSpec[i].push("0.0"); // 14
            (livrableSup1 === 3) ? dataSpec[i].push("1"): dataSpec[i].push("0.0"); // 15
            dataSpec[i].push(dataSpec[i][33]); // 16

            // 2 meilleures spécialisations
            var max1 = Math.max.apply(null, rangeSpe[i]);
            var cellHeader1 = (max1 > pass70 && rangeSpe[i].indexOf(max1) !== -1) ? headersSpe[0][
                rangeSpe[i].indexOf(max1)
            ] : "";
            if (rangeSpe[i].length > 1 && rangeSpe[i].indexOf(max1) !== -1) rangeSpe[i].splice(
                rangeSpe[i].indexOf(max1), 1, 0);
            dataSpec[i].push(cellHeader1); // 17
            var max2 = Math.max.apply(null, rangeSpe[i]);
            var cellHeader2 = (max2 > pass70 && rangeSpe[i].indexOf(max2) !== -1) ? headersSpe[0][
                rangeSpe[i].indexOf(max2)
            ] : "";
            if (cellHeader2 === cellHeader1) cellHeader2 = "";
            dataSpec[i].push(cellHeader2); // 18

            // réussite classique et avancée
            classic2Modules = ((d3.sum(rangeClassic[i]) / 4) > pass70 && examenFinal[i][0] > pass70 &&
                countSpe >= 2) ? dataSpec[i].push("1") : dataSpec[i].push("0.0"); // 19
            classic3devoirs = ((d3.sum(rangeClassic[i]) + d3.sum(rangeDevoirs[i])) / 7 > pass70 &&
                examenFinal[i][0] > pass70 && countSpe >= 2) ? dataSpec[i].push("1") : dataSpec[i].push("0.0"); // 20

            // Quiz 1 à 4 : note sur 100 (%) et note sur (/20)
            // console.log(dataSpec[i][0], dataSpec[i][5]);
            (isNaN(parseFloat(dataSpec[i][5]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][5]) * 100).toFixed(2)); // 21
            (isNaN(parseFloat(dataSpec[i][6]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][6]) * 100).toFixed(2)); // 22
            (isNaN(parseFloat(dataSpec[i][7]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][7]) * 100).toFixed(2)); // 23
            (isNaN(parseFloat(dataSpec[i][8]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][8]) * 100).toFixed(2)); // 24

            // Parcours Classique (Avg)
            (isNaN(parseFloat(dataSpec[i][9]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][9]) * 100).toFixed(2)); // 25
            // examen final
            (isNaN(parseFloat(dataSpec[i][10]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][10]) * 100).toFixed(2)); // 26

            // devoirs de 1 à 3
            (isNaN(parseFloat(dataSpec[i][11]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][11]) * 100).toFixed(2)); // 27
            (isNaN(parseFloat(dataSpec[i][12]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][12]) * 100).toFixed(2)); // 28
            (isNaN(parseFloat(dataSpec[i][13]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][13]) * 100).toFixed(2)); // 29

            // Parcours Avancé (Avg)
            (isNaN(parseFloat(dataSpec[i][14]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][14]) * 100).toFixed(2)); // 30

            // specialisations
            (isNaN(parseFloat(dataSpec[i][15]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][15]) * 100).toFixed(2)); // 31
            (isNaN(parseFloat(dataSpec[i][16]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][16]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][17]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][17]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][18]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][18]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][19]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][19]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][20]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][20]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][21]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][21]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][22]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][22]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][23]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][23]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][24]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][24]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][25]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][25]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][26]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][26]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][27]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][27]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][28]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][28]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][29]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][29]) * 100).toFixed(2)); // 45

            // Spécialisations (Avg)
            // (isNaN(parseFloat(dataSpec[i][30]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][30]) * 100).toFixed(2)); // 46

            // Preemooc
            (isNaN(parseFloat(dataSpec[i][30]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][30]) * 100).toFixed(2)); // 47

            dataSpec[i].splice(3, 35);
            //dataSpec[i].splice(2, 0, "");
        } // fin for dataSpec

        // suppression de la 1ère lignes de titres
        data.splice(0, 1);
        // ajout de la ligne de titres pour ce tableau
        data.unshift(headersAnalytics);

        var select = $('#selectCohortes-btn');
        // suppression des options existantes
        select.find('option').remove();

        var cohortes = [...new Set(data.map(el => el[4]))];
        var cohortTitle = cohortes[0];
        // console.log(cohortTitle, cohortes);
        cohortes = cohortes.slice(1, cohortes.length);
        setTimeout(() => {
            dataToTable(data, importSelected, cohortes, cohortTitle);
        }, 1000);
    } else {
        document.getElementById('exit').innerHTML =
            '<span style="color:red">Oups! Apparemment les nombres décimaux dans le jeu de données ne correspond pas au format attendu...</span>';
    }
}

function tableauFinalStandard(dataFromCSV, importSelected, dataMappage) {
    // console.time("final-standard");
    var data = dataFromCSV.map(row => removeZeroNotAttempTedEtc(row));
    var pass70 = 0.695;

    // IMPORTANT : BIEN CONSERVER L'ORDRE DANS "headersStandard" qui est ensuite repris dans l
    var headersStandard = [
        "Student ID", // 0
        "Email", // 1
        "Étudiant",
        "Mail d'inscription",
        "Cohorte", // cohorte 31
        "Grades",
        "Classique",
        "Avancé",
        "S1 (%)", "S1 (/20)",
        "S2 (%)", "S2 (/20)",
        "S3 (%)", "S3 (/20)",
        "S4 (%)", "S4 (/20)",
        "Examen Final (%)", " Examen Final (/20)",
        "Devoir 1 (%)", "Devoir 1 (/20)",
        "Devoir 2 (%)", "Devoir 2 (/20)",
        "Devoir 3 (%)", "Devoir 3 (/20)",
        "Diagnostic de Fonctionnement Système\n01 - DFS (%)",
        "Diagnostic de Fonctionnement Système\n01 - DFS (/20)",
        "Management Créativité & Brainstorming\n02 - MCB (%)",
        "Management Créativité & Brainstorming\n02 - MCB (/20)",
        "Management d'Équipe-Projet\n03 - MEP (%)",
        "Management d'Équipe-Projet\n03 - MEP (/20)",
        "Outils Informatiques & Évaluation Financière\n04 - IEF (%)",
        "Outils Informatiques & Évaluation Financière\n04 - IEF (/20)",
        "Certification professionnelle PMI®\n05 - PMI (%)",
        "Certification professionnelle PMI®\n05 - PMI (/20)",
        "Analyse Fonctionnelle\n06 - AF (%)",
        "Analyse Fonctionnelle\n06 - AF (/20)",
        "Analyse Stratégique\n07 - AS (%)",
        "Analyse Stratégique\n07 - AS (/20)",
        "Évaluation d'Impact des Projets\n08 - EIP (%)",
        "Évaluation d'Impact des Projets\n08 - EIP (/20)",
        "Planification Avancée\n09 - PAV (%)",
        "Planification Avancée\n09 - PAV (/20)",
        "Management Visuel de Projet\n10 - MVP (%)",
        "Management Visuel de Projet\n10 - MVP (/20)",
        "Gestion de Projet Agile avec Scrum\n11 - GPAS (%)",
        "Gestion de Projet Agile avec Scrum\n11 - GPAS (/20)",
        "Méthode de Résolution de Problèmes\n12 - MRP (%)",
        "Méthode de Résolution de Problèmes\n12 - MRP (/20)",
        "Résolution Créative de Problèmes : TRIZ\n13 - TRIZ (%)",
        "Résolution Créative de Problèmes : TRIZ\n13 - TRIZ (/20)",
        "Gestion De Crise\n14 - G2C (%)",
        "Gestion De Crise\n14 - G2C (/20)",
        "Action Entrepreneuriale\n15 - PAE (%)",
        "Action Entrepreneuriale\n15 - PAE (/20)",
        "Nombre\nmodules réussis",
        "Meilleur\nmodule réussi 1",
        "Meilleur\nmodule réussi 2",
        "Causes Échec\n(PC & PA) Modules",
        "Causes Échec\n(PC ) Moyenne Quiz",
        "Causes Échec\n(PC & PA) Examen final",
        "Causes Échec\n(PA) Moyenne Quiz & Devoirs",
        "Causes Échec\n(PA) Devoirs"
    ];

    var headersSpe = [data[0].slice(15, 30)];
    var dataSpec = data.slice(1, data.length).sort(function(a, b) {
        return a[0] - b[0];
    });
    // console.log(data[0], headersSpe, dataSpec);

    // Test pour vérifier le format décimal dans le jeu de données... à optimiser
    var patternPoint = /^[0-9]+([.][0-9]+)?%?$/;
    // var patternComma = /^[0-9]+([,][0-9]+)?%?$/;
    var testComma = [].concat.apply([], dataSpec.map(function(el) {
        // if (patternPoint.test(el)) console.log(el);
        return el.filter(function(el) {
            // return [], el.filter(function(el) { // à voir faute de frappe ou autres ?
            return patternPoint.test(el) && el !== undefined && number_test(el.valueOf()) && Number.isInteger(parseInt(el));
        });
    }));

    var rangeSpe = dataSpec.map((row) => row.slice(15, 30).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el)));
    var rangeClassic = dataSpec.map((row) => row.slice(5, 9).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el)));
    var examenFinal = dataSpec.map((row) => row.slice(14, 15).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el)));
    var rangeDevoirs = dataSpec.map((row) => row.slice(10, 13).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el)));

    // var countSpe, classic2Modules, classic3devoirs;
    console.log(testComma.length);
    // console.timeEnd("final-standard");
    // console.time("traitement-final");
    if (testComma.length > 0) {
        for (var i = 0, lgi = dataSpec.length; i < lgi; i++) {
            // nombre specialisations réussies
            var countSpe = rangeSpe[i].filter((el) => el > pass70).length;

            var cohorte = dataSpec[i][31];
            var grade = dataSpec[i][4];
            // cohorte
            dataSpec[i].push(grade);

            // réussite classique et avancée
            var classic2Modules = ((d3.sum(rangeClassic[i]) / 4) > pass70 && examenFinal[i][0] > pass70 && countSpe >= 2) ?
                dataSpec[i].push("OUI") : dataSpec[i].push("NON");
            var classic3devoirs = ((d3.sum(rangeClassic[i]) + d3.sum(rangeDevoirs[i])) / 7 > pass70 && examenFinal[i][0] >
                pass70 && countSpe >= 2) ? dataSpec[i].push("OUI") : dataSpec[i].push("NON");

            // Quiz 1 à 4 : note sur 100 (%) et note sur (/20)
            (isNaN(parseFloat(dataSpec[i][5]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][5]) * 100).toFixed(2)); // 100 (%)
            (isNaN(parseFloat(dataSpec[i][5]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][5]) * 100) / 5).toFixed(2)); // (/20)

            (isNaN(parseFloat(dataSpec[i][6]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][6]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][6]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][6]) * 100) / 5).toFixed(2));

            (isNaN(parseFloat(dataSpec[i][7]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][7]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][7]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][7]) * 100) / 5).toFixed(2));

            (isNaN(parseFloat(dataSpec[i][8]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][8]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][8]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][8]) * 100) / 5).toFixed(2));

            // examen final
            (isNaN(parseFloat(dataSpec[i][10]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][10]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][10]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][10]) * 100) / 5).toFixed(2));

            // devoirs de 1 à 3
            (isNaN(parseFloat(dataSpec[i][11]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][11]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][11]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][11]) * 100) / 5).toFixed(2));

            (isNaN(parseFloat(dataSpec[i][12]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][12]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][12]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][12]) * 100) / 5).toFixed(2));

            (isNaN(parseFloat(dataSpec[i][13]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][13]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][13]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][13]) * 100) / 5).toFixed(2));

            // specialisations
            (isNaN(parseFloat(dataSpec[i][15]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][15]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][15]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][15]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][16]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][16]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][16]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][16]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][17]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][17]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][17]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][17]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][18]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][18]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][18]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][18]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][19]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][19]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][19]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][19]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][20]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][20]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][20]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][20]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][21]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][21]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][21]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][21]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][22]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][22]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][22]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][22]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][23]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][23]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][23]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][23]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][24]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][24]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][24]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][24]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][25]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][25]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][25]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][25]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][26]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][26]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][26]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][26]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][27]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][27]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][27]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][27]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][28]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][28]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][28]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][28]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][29]))) ? dataSpec[i].push("0.0"): dataSpec[i].push(parseFloat((dataSpec[i][29]) * 100).toFixed(2));
            (isNaN(parseFloat(dataSpec[i][29]))) ? dataSpec[i].push("0.0"): dataSpec[i].push((parseFloat((dataSpec[i][29]) * 100) / 5).toFixed(2));

            // nombre spe réussi et 2 meilleures spécialisations
            (countSpe) ? dataSpec[i].push(countSpe.toFixed(0)): dataSpec[i].push("0.0");
            var patternSpe = /\d+\:\s{1}\[\w+\]/gi;
            var max1 = Math.max.apply(null, rangeSpe[i]);
            var cellHeader1 = (max1 > pass70 && rangeSpe[i].indexOf(max1) !== -1) ? headersSpe[0][rangeSpe[i].indexOf(max1)] : "";
            if (rangeSpe[i].length > 1 && rangeSpe[i].indexOf(max1) !== -1) rangeSpe[i].splice(rangeSpe[i].indexOf(max1), 1, 0);
            cellHeader1 = (cellHeader1.match(patternSpe)) ? dataSpec[i].push((cellHeader1.match(patternSpe)[0]).replace(/:/, " - ")) : dataSpec[i].push("");

            var max2 = Math.max.apply(null, rangeSpe[i]);
            var cellHeader2 = (max2 > pass70 && rangeSpe[i].indexOf(max2) !== -1) ? headersSpe[0][rangeSpe[i].indexOf(max2)] : "";
            if (cellHeader2 === cellHeader1) cellHeader2 = "";
            (cellHeader2.match(patternSpe)) ? dataSpec[i].push((cellHeader2.match(patternSpe)[0]).replace(/:/, " - ")): dataSpec[i].push("");

            // suppression des colonnes
            dataSpec[i].splice(3, 35);
            // // Ajout colonne vide pour mappage nom
            var checkEmail = dataMappage.find(item => {
                // console.log(item.id, dataSpec[i][0]);
                return item.id === dataSpec[i][0];
            });
            // console.log(checkEmail);
            (checkEmail && checkEmail !== undefined) ? checkEmail = checkEmail.email: checkEmail = "";
            // ajout colonnes vide pour mappage mail inscription
            dataSpec[i].splice(3, 0, checkEmail);
            // ajout colonnes vide pour mappage absence
            // console.log(cohorte);
            dataSpec[i].splice(4, 0, cohorte);

            // cause échec
            (countSpe && countSpe >= 2) ? dataSpec[i].push("0.0"): dataSpec[i].push("< 2");
            ((d3.sum(rangeClassic[i]) / 4) > pass70) ? dataSpec[i].push("0.0"): dataSpec[i].push("< 70%");
            (examenFinal[i][0] > pass70) ? dataSpec[i].push("0.0"): dataSpec[i].push("< 70%");
            ((d3.sum(rangeClassic[i]) + d3.sum(rangeDevoirs[i])) / 7 > pass70) ? dataSpec[i].push("0.0"): dataSpec[i].push("< 70%");
            (rangeDevoirs[i].filter(el => el !== 0).length === 3) ? dataSpec[i].push("0.0"): dataSpec[i].push("< 3");

        }
        // suppression de la 1ère lignes de titres
        data.splice(0, 1);
        data.unshift(headersStandard);

        var select = $('#selectCohortes-btn');
        // suppression des options existantes
        select.find('option').remove();

        var cohortes = [...new Set(data.map(el => el[4]))];
        var cohortTitle = cohortes[0];
        // console.log(cohortTitle, cohortes);
        cohortes = cohortes.slice(1, cohortes.length);
        console.log(cohortes);

        // console.timeEnd("traitement-final");

        // exportFinalStandard(data, importSelected)
        setTimeout(() => {
            dataToTable(data, importSelected, cohortes, cohortTitle);
        }, 1000);
    } else {
        document.getElementById('exit').innerHTML =
            '<span style="color:red">Oups! Apparemment les nombres décimaux dans le jeu de données ne correspond pas au format attendu...</span>';
    }
}

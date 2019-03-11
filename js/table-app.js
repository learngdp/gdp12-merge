function globalReport(dataFromCSV, importSelected) {
    // déplacement de la colonne cohorte à la 5ème colonne
    var data = dataFromCSV.map(row => commaToPoint(row));

    // lignes à décommenter pour calcul du nombre de spé réussies ajouté en fin du global-report
    var countSpe = data.slice(1, data.length).map((row) => row.slice(15, 30).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el)).filter((el) => el > 0.695).length);
    data[0].push('Spé validées');
    for (var i = 0, lgi = data.slice(1, data.length).length; i < lgi; i++) {
        data.slice(1, data.length)[i].push(countSpe[i]);
    }
    // console.log(data);

    // var cohortes = [];
    data.forEach((el, i) => {
        let cohorte = el[31];
        let spe = el[38]
        // cohortes.push(cohorte);
        el.splice(31, 1); // suppression de la colonne sur original
        el.splice(4, 0, cohorte); // replacement colonne
        el.splice(38, 1); // idem pour spe
        el.splice(6, 0, spe);
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
        header = ["Ligne", "Student ID", "Email"],
        duplicatesHtml = [header],
        absencesHtml = [header],
        flag;
    csv.forEach((el, i) => {
        var id = el[0],
        email = el[1],
        row = [i, id, email];
        flag = ids.indexOf(id);
        if (flag !== i) {
            console.log(row);
            duplicatesHtml.push(row);
            duplicates.push(el[0]);
        }
        if (el[2] === "Absent sur profile_info") absencesHtml.push(row);
    });
    // console.log(duplicatesHtml, absencesHtml);

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
        if (extraDataHtml.length > 1 && extraDataHtml[0].length === 3) {
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
            console.log(extraDataHtml.slice(1, extraDataHtml.length), extraDataHtml[0]);
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
            document.getElementById('loaderToolbarTable-div').classList.add('hidden');
            console.timeEnd("dataTable_affichage_complet");
        }, 50);
    }

    document.getElementById('tcd-btn').onclick = function(e) {
        document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
        setTimeout(() => {
            document.getElementById(this.id).classList.add('hidden');
            document.getElementById('dataTable-btn').classList.remove('hidden');
            document.getElementById('network-btn').classList.remove('hidden');
            document.getElementById('dataTable-container').classList.add('hidden');
            document.getElementById('network-container').classList.add('hidden');
            document.getElementById('pivot-container').classList.remove('hidden');
            pivotTable(csv, headers);
            document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
        }, 100);
    }

    document.getElementById('dataTable-btn').onclick = function(e) {
        console.log()
        document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
        setTimeout(() => {
            document.getElementById(this.id).classList.add('hidden');
            document.getElementById('tcd-btn').classList.remove('hidden');
            document.getElementById('network-btn').classList.remove('hidden');
            document.getElementById('network-container').classList.add('hidden');
            document.getElementById('pivot-container').classList.add('hidden');
            document.getElementById('dataTable-container').classList.remove('hidden');
            document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
        }, 100);
    }

    document.getElementById('network-btn').onclick = function(e) {
        document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
        setTimeout(() => {
            document.getElementById(this.id).classList.add('hidden');
            document.getElementById('dataTable-btn').classList.remove('hidden');
            document.getElementById('tcd-btn').classList.remove('hidden');
            document.getElementById('dataTable-container').classList.add('hidden');
            document.getElementById('pivot-container').classList.add('hidden');
            document.getElementById('network-container').classList.remove('hidden');
            networkData(csv, importSelected);
            document.getElementById('loaderToolbarTable-div').classList.toggle('hidden');
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
    }, true, "fr");
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
    var data = dataFromCSV.map(row => commaToPoint(row));
    var pass70 = 0.695;

    var headersAnalytics = [
        "ID", // 0
        "Mail", // 1
        "NOM Prénom (profile)", // 2
        "Username GTC", // 3
        "Cohorte", // 4
        "Grade TC", // 5
        "NB modules GTC passés", // 6
        "examen GTC à plus de 70% (69,5%) 1 si oui", // 7
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
        "MRP - Outils et Méthodologie de Résolution de Problème",
        "TRIZ - Introduction aux principaux outils de TRIZ",
        "G2C - Gestion de crise",
        "PAE - Du Projet à l'Action Entrepreneuriale", // 45
        // "Spécialisation (Avg)", // 46
        "Pre MOOC" // 47
    ];

    var headersReportSpe = [data[0].slice(15, 30)];
    // console.log(headersReportSpe);
    var dataReport = data.slice(1, data.length);
    // .sort(function(a, b) {
    //     return a[0] - b[0];
    // });

    // Test pour vérifier le format décimal dans le jeu de données... à optimiser
    // à postériori...  n'est plus utile car ce sont les données avec un point decimal qui sont finalement pris em compte pour les traitement des 2 tableaux
    var patternPoint = /^[0-9]+([.][0-9]+)?%?$/;
    var patternComma = /^[0-9]+([,][0-9]+)?%?$/;
    var testComma = [].concat.apply([], dataReport.map(function(el) {
        return el.filter(function(el) {
            return patternPoint.test(el) && el !== undefined && number_test(el.valueOf()) && Number.isInteger(parseInt(el));
        });
    }));

    // création de tableaux intermédiaires à partir du grade report reconstitué après regroupant traitement impor des grade-report initiaux (CSV)
    var modulesTC = dataReport.map((row) => row.slice(5, 9).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el))); // récupération des 4 modules TC (4 colonnes du grade report)
    var examenFinal = dataReport.map((row) => row.slice(10, 11).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el))); // idem  pour examen final (1 seule colonne en fait)
    var livrables = dataReport.map((row) => row.slice(11, 14).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el))); // idem pour les 3 livrables (3 colonnes idem)
    var rangeSpe = dataReport.map((row) => row.slice(15, 30).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el))); // idem pour les 15 SPE (15 colonnes idem)
    // console.log(modulesTC, examenFinal, livrables, rangeSpe);

    // variables utilisées dans le traitement dans la boucle for ci-dessous
    var countNbTC, countTC, countGrade50, countGrade70, livrableSup5, livrableSup1, countSpe, classic2Modules, classic3devoirs;

    if (testComma.length > 0) {
        for (var i = 0, lgi = dataReport.length; i < lgi; i++) {
            // console.log(dataReport[i].length);
            countNbTC = modulesTC[i].filter((el) => el > 0).length;
            countTC = dataReport[i].filter((el) => el[14] > pass70).length;
            countGrade50 = dataReport[i].filter((el) => el[4] > 0.5).length;
            countGrade70 = dataReport[i].filter((el) => el[4] > pass70).length;

            livrableSup70 = livrables[i].filter((el) => el > pass70).length;
            livrableSup5 = livrables[i].filter((el) => el > 0.05).length;
            livrableSup1 = livrables[i].filter((el) => el > 0.01).length;

            // nombre spécialisations réussies
            countSpe = rangeSpe[i].filter((el) => el > pass70).length;

            // remplacement des données initiales par les données traitées
            dataReport[i].push(dataReport[i][3]); // 3
            dataReport[i].push(dataReport[i][31]); // 4 (cohorte 31)

            // GRADE TC
            (isNaN(parseFloat(dataReport[i][4]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][4]) * 100).toFixed(0)); // 5

            // NB modules TC passés (<0%) *** OK
            // console.log(dataReport[i][4], livrableSup70, countNbTC, examenFinal);
            (countNbTC >= 1) ? dataReport[i].push((Math.round(countNbTC * 100) / 100).toFixed(0)): dataReport[i].push("0.0"); // 6

            // Examen TC à plus de >= 70%
            // (countTC >= 1) ? dataReport[i].push("1"): dataReport[i].push("0.0"); // 7
            (parseFloat(dataReport[i][10]) > 0.695) ?  dataReport[i].push(1) : dataReport[i].push("0.0"); // 7

            dataReport[i].push(countSpe.toFixed(0)); //8

            // validation parcours classique
            // (countGrade50 >= 1 && countSpe >= 2) ? dataReport[i].push("OUI"): dataReport[i].push("NON"); // 9 À REVOIR
            ((d3.sum(modulesTC[i]) / 4) > pass70 && examenFinal[i][0] > pass70 && countSpe >= 2) ? dataReport[i].push("OUI") : dataReport[i].push("NON"); // 9

            (countGrade50 >= 1) ? dataReport[i].push("1"): dataReport[i].push("0.0"); // 10
            (countSpe >= 2) ? dataReport[i].push("1"): dataReport[i].push("0.0"); // 11

            // validation parcours avancé
            // (countGrade70 >= 1 && livrableSup5 === 3 && livrableSup1 === 3) ? dataReport[i].push("OUI"): dataReport[i].push("NON");
            ((d3.sum(modulesTC[i]) + d3.sum(livrables[i])) / 7 > pass70 && examenFinal[i][0] > pass70 && countSpe >= 2) ? dataReport[i].push("OUI") : dataReport[i].push("NON"); // 12

            (countGrade70 >= 1) ? dataReport[i].push("1"): dataReport[i].push("0.0"); // 13
            (livrableSup5 === 3) ? dataReport[i].push("1"): dataReport[i].push("0.0"); // 14
            (livrableSup1 === 3) ? dataReport[i].push("1"): dataReport[i].push("0.0"); // 15
            dataReport[i].push(dataReport[i][33]); // 16

            // 2 meilleures spécialisations
            var max1 = Math.max.apply(null, rangeSpe[i]);
            var cellHeader1 = (max1 > pass70 && rangeSpe[i].indexOf(max1) !== -1) ? headersReportSpe[0][
                rangeSpe[i].indexOf(max1)
            ] : "";
            if (rangeSpe[i].length > 1 && rangeSpe[i].indexOf(max1) !== -1) rangeSpe[i].splice(
                rangeSpe[i].indexOf(max1), 1, 0);
            dataReport[i].push(cellHeader1); // 17
            var max2 = Math.max.apply(null, rangeSpe[i]);
            var cellHeader2 = (max2 > pass70 && rangeSpe[i].indexOf(max2) !== -1) ? headersReportSpe[0][
                rangeSpe[i].indexOf(max2)
            ] : "";
            if (cellHeader2 === cellHeader1) cellHeader2 = "";
            dataReport[i].push(cellHeader2); // 18

            // réussite classique et avancée
            classic2Modules = ((d3.sum(modulesTC[i]) / 4) > pass70 && examenFinal[i][0] > pass70 &&
                countSpe >= 2) ? dataReport[i].push("1") : dataReport[i].push("0.0"); // 19
            classic3devoirs = ((d3.sum(modulesTC[i]) + d3.sum(livrables[i])) / 7 > pass70 &&
                examenFinal[i][0] > pass70 && countSpe >= 2) ? dataReport[i].push("1") : dataReport[i].push("0.0"); // 20

            // Quiz 1 à 4 : note sur 100 (%) et note sur (/20)
            // console.log(dataReport[i][0], dataReport[i][5]);
            (isNaN(parseFloat(dataReport[i][5]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][5]) * 100).toFixed(2)); // 21
            (isNaN(parseFloat(dataReport[i][6]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][6]) * 100).toFixed(2)); // 22
            (isNaN(parseFloat(dataReport[i][7]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][7]) * 100).toFixed(2)); // 23
            (isNaN(parseFloat(dataReport[i][8]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][8]) * 100).toFixed(2)); // 24

            // Parcours Classique (Avg)
            (isNaN(parseFloat(dataReport[i][9]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][9]) * 100).toFixed(2)); // 25
            // examen final
            (isNaN(parseFloat(dataReport[i][10]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][10]) * 100).toFixed(2)); // 26

            // devoirs de 1 à 3
            (isNaN(parseFloat(dataReport[i][11]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][11]) * 100).toFixed(2)); // 27
            (isNaN(parseFloat(dataReport[i][12]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][12]) * 100).toFixed(2)); // 28
            (isNaN(parseFloat(dataReport[i][13]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][13]) * 100).toFixed(2)); // 29

            // Parcours Avancé (Avg)
            (isNaN(parseFloat(dataReport[i][14]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][14]) * 100).toFixed(2)); // 30

            // specialisations
            (isNaN(parseFloat(dataReport[i][15]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][15]) * 100).toFixed(2)); // 31
            (isNaN(parseFloat(dataReport[i][16]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][16]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][17]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][17]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][18]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][18]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][19]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][19]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][20]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][20]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][21]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][21]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][22]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][22]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][23]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][23]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][24]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][24]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][25]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][25]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][26]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][26]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][27]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][27]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][28]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][28]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][29]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][29]) * 100).toFixed(2)); // 45

            // Spécialisations (Avg)
            // (isNaN(parseFloat(dataReport[i][30]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][30]) * 100).toFixed(2)); // 46

            // Preemooc
            (isNaN(parseFloat(dataReport[i][30]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][30]) * 100).toFixed(2)); // 47

            dataReport[i].splice(3, 35);
            //dataReport[i].splice(2, 0, "");
        } // fin for dataReport

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
    var data = dataFromCSV.map(row => commaToPoint(row));
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

    var headersReportSpe = [data[0].slice(15, 30)];
    var dataReport = data.slice(1, data.length).sort(function(a, b) {
        return a[0] - b[0];
    });
    // console.log(data[0], headersReportSpe, dataReport);

    // Test pour vérifier le format décimal dans le jeu de données... à optimiser
    var patternPoint = /^[0-9]+([.][0-9]+)?%?$/;
    // var patternComma = /^[0-9]+([,][0-9]+)?%?$/;
    var testComma = [].concat.apply([], dataReport.map(function(el) {
        // if (patternPoint.test(el)) console.log(el);
        return el.filter(function(el) {
            // return [], el.filter(function(el) { // à voir faute de frappe ou autres ?
            return patternPoint.test(el) && el !== undefined && number_test(el.valueOf()) && Number.isInteger(parseInt(el));
        });
    }));

    // création (idem synthese-analytics) de tableaux intermédiaires à partir du grade report reconstitué après regroupant traitement impor des grade-report initiaux (CSV)
    var modulesTC = dataReport.map((row) => row.slice(5, 9).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el))); // récupérationpour les 4 modules TC (4 colonnes du grade report)
    var examenFinal = dataReport.map((row) => row.slice(10, 11).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el))); // idem  pour examen final (1 seule colonne en fait)
    var livrables = dataReport.map((row) => row.slice(11, 14).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el))); // idem pour les 3 livrables (3 colonnes idem)
    var rangeSpe = dataReport.map((row) => row.slice(15, 30).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el))); // idem pour les 15 SPE (15 colonnes idem)
    // console.log(modulesTC, examenFinal, livrables, rangeSpe);

    // var countSpe, classic2Modules, classic3devoirs;
    console.log(testComma.length);
    // console.timeEnd("final-standard");
    // console.time("traitement-final");
    if (testComma.length > 0) {
        for (var i = 0, lgi = dataReport.length; i < lgi; i++) {
            // nombre specialisations réussies
            var countSpe = rangeSpe[i].filter((el) => el > pass70).length;

            var cohorte = dataReport[i][31];
            var grade = dataReport[i][4];
            // cohorte
            dataReport[i].push(grade);

            // réussite classique et avancée
            var classic2Modules = ((d3.sum(modulesTC[i]) / 4) > pass70 && examenFinal[i][0] > pass70 && countSpe >= 2) ?
                dataReport[i].push("OUI") : dataReport[i].push("NON");
            var classic3devoirs = ((d3.sum(modulesTC[i]) + d3.sum(livrables[i])) / 7 > pass70 && examenFinal[i][0] >
                pass70 && countSpe >= 2) ? dataReport[i].push("OUI") : dataReport[i].push("NON");

            // Quiz 1 à 4 : note sur 100 (%) et note sur (/20)
            (isNaN(parseFloat(dataReport[i][5]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][5]) * 100).toFixed(2)); // 100 (%)
            (isNaN(parseFloat(dataReport[i][5]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][5]) * 100) / 5).toFixed(2)); // (/20)

            (isNaN(parseFloat(dataReport[i][6]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][6]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][6]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][6]) * 100) / 5).toFixed(2));

            (isNaN(parseFloat(dataReport[i][7]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][7]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][7]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][7]) * 100) / 5).toFixed(2));

            (isNaN(parseFloat(dataReport[i][8]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][8]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][8]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][8]) * 100) / 5).toFixed(2));

            // examen final
            (isNaN(parseFloat(dataReport[i][10]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][10]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][10]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][10]) * 100) / 5).toFixed(2));

            // devoirs de 1 à 3
            (isNaN(parseFloat(dataReport[i][11]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][11]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][11]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][11]) * 100) / 5).toFixed(2));

            (isNaN(parseFloat(dataReport[i][12]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][12]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][12]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][12]) * 100) / 5).toFixed(2));

            (isNaN(parseFloat(dataReport[i][13]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][13]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][13]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][13]) * 100) / 5).toFixed(2));

            // specialisations
            (isNaN(parseFloat(dataReport[i][15]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][15]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][15]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][15]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataReport[i][16]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][16]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][16]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][16]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataReport[i][17]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][17]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][17]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][17]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataReport[i][18]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][18]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][18]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][18]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataReport[i][19]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][19]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][19]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][19]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataReport[i][20]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][20]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][20]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][20]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataReport[i][21]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][21]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][21]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][21]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataReport[i][22]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][22]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][22]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][22]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataReport[i][23]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][23]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][23]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][23]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataReport[i][24]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][24]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][24]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][24]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataReport[i][25]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][25]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][25]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][25]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataReport[i][26]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][26]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][26]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][26]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataReport[i][27]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][27]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][27]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][27]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataReport[i][28]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][28]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][28]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][28]) * 100) / 5).toFixed(2));
            (isNaN(parseFloat(dataReport[i][29]))) ? dataReport[i].push("0.0"): dataReport[i].push(parseFloat((dataReport[i][29]) * 100).toFixed(2));
            (isNaN(parseFloat(dataReport[i][29]))) ? dataReport[i].push("0.0"): dataReport[i].push((parseFloat((dataReport[i][29]) * 100) / 5).toFixed(2));

            // nombre spe réussi et 2 meilleures spécialisations
            (countSpe) ? dataReport[i].push(countSpe.toFixed(0)): dataReport[i].push("0.0");
            var patternSpe = /\d+\:\s{1}\[\w+\]/gi;
            var max1 = Math.max.apply(null, rangeSpe[i]);
            var cellHeader1 = (max1 > pass70 && rangeSpe[i].indexOf(max1) !== -1) ? headersReportSpe[0][rangeSpe[i].indexOf(max1)] : "";
            if (rangeSpe[i].length > 1 && rangeSpe[i].indexOf(max1) !== -1) rangeSpe[i].splice(rangeSpe[i].indexOf(max1), 1, 0);
            cellHeader1 = (cellHeader1.match(patternSpe)) ? dataReport[i].push((cellHeader1.match(patternSpe)[0]).replace(/:/, " - ")) : dataReport[i].push("");

            var max2 = Math.max.apply(null, rangeSpe[i]);
            var cellHeader2 = (max2 > pass70 && rangeSpe[i].indexOf(max2) !== -1) ? headersReportSpe[0][rangeSpe[i].indexOf(max2)] : "";
            if (cellHeader2 === cellHeader1) cellHeader2 = "";
            (cellHeader2.match(patternSpe)) ? dataReport[i].push((cellHeader2.match(patternSpe)[0]).replace(/:/, " - ")): dataReport[i].push("");

            // suppression des colonnes
            dataReport[i].splice(3, 35);
            // // Ajout colonne vide pour mappage nom
            var checkEmail = dataMappage.find(item => {
                // console.log(item.id, dataReport[i][0]);
                return item.id === dataReport[i][0];
            });
            // console.log(checkEmail);
            (checkEmail && checkEmail !== undefined) ? checkEmail = checkEmail.email: checkEmail = "";
            // ajout colonnes vide pour mappage mail inscription
            dataReport[i].splice(3, 0, checkEmail);
            // ajout colonnes vide pour mappage absence
            // console.log(cohorte);
            dataReport[i].splice(4, 0, cohorte);

            // cause échec
            (countSpe && countSpe >= 2) ? dataReport[i].push("0.0"): dataReport[i].push("< 2");
            ((d3.sum(modulesTC[i]) / 4) > pass70) ? dataReport[i].push("0.0"): dataReport[i].push("< 70%");
            (examenFinal[i][0] > pass70) ? dataReport[i].push("0.0"): dataReport[i].push("< 70%");
            ((d3.sum(modulesTC[i]) + d3.sum(livrables[i])) / 7 > pass70) ? dataReport[i].push("0.0"): dataReport[i].push("< 70%");
            (livrables[i].filter(el => el !== 0).length === 3) ? dataReport[i].push("0.0"): dataReport[i].push("< 3");

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

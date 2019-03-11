function networkData(csv, importSelected) {
    var widthContainer = window.outerWidth * 0.99,
        heightContainer = (window.outerHeight * 0.90 < 480) ? 480 : window.outerHeight * 0.95;

    document.getElementById('network-container').style.width = widthContainer + 'px';
    document.getElementById('network-container').style.height = heightContainer + 'px';

    document.getElementById('network_div').style.width = (widthContainer * 0.98) + 'px';
    document.getElementById('network_div').style.height = (heightContainer * 0.98) + 'px';

    var key1 = importSelected === "grade_report_global" ? "Cohort Name" : "Cohorte";
    var key2;
    if (importSelected === "grade_report_global") {
        key2 = "Verification Status";
    } else if (importSelected === "final_standard") {
        key2 = "Classique";
    } else if (importSelected === "synthese_analytics") {
        key2 = "validation parcours classique (https://bit.ly/2GilrWR)";
    }

    var json = d3.csvParse(Papa.unparse(csv));
    json = json.filter(obj => obj[key1] !== ""); // sans cohortes vides
    // json = json.filter(obj => obj[key1] === ""); // avec cohortes vides

    var nestedData = d3.nest()
        .key(d => d[key1] !== "" ? d[key1] : "Accès libre")
        .key(d => d[key2])
        .rollup((v) => {
            return {
                array: v,
                size: v.length
            };
        })
        .entries(json);
    console.log(nestedData)
    // document.getElementById('diagramTitle').innerHTML = importSelected + ' > ' + key1 + ' > ' + key2;
    // Mise à l'échelle de la grosseur des bulles en fonction du nombre d'éléments par objet
    var totalValues = [].concat.apply([], nestedData.map(obj => obj.values.map(obj => obj.value.size)));
    var totalSize = totalValues.reduce((a, b) => a += b);
    var extent = d3.extent(totalValues);

    if (totalSize > 0 && extent[0] === 1 && extent[1] === 1) extent[1] = 2;
    var scaleSize = function(size) {
        var scaleLinear = d3.scaleLinear().domain(extent).range([2, 60]); // d3 V4
        return Math.round(scaleLinear(size));
    }
    console.log(d3.mean(totalValues), totalSize, extent, d3.quantile(totalValues, 0.01));

    var sizeLabel = function(meanValue) {
        return (meanValue < 20) ? 30 : (20 < meanValue < 30) ? 80 : (30 < meanValue < 60) ? 120 : 300;
    };

    var sizeLabel3 = function(meanValue) {
        return (meanValue < 20) ? 6 : (20 < meanValue < 30) ? 12 : (30 < meanValue < 60) ? 18 : 24;
    };

    var nodes = [],
        edges = [];
    var colorTest = importSelected === "grade_report_global" ? "ID Verified" : "OUI";
    var getSize1 = function(arr) {
        return arr.map(obj => obj.value.size).reduce((a, b) => a += b);
    }
    for (var i = 0, lgi = nestedData.length; i < lgi; i++) {
        var id1 = Math.random(0, 10000);
        var size1 = getSize1(nestedData[i].values);
        // console.log(size1, scaleSize(size1));
        nodes.push({
            id: id1,
            label: nestedData[i].key,
            shape: 'dot', // 'star',
            size: scaleSize(size1), // scaleSize(size1),
            // value: size1, //scaleSize(size1),
            color: '#FFFF00', //'#FB7E81', // '#CB0000', //
            font: {
                color: '#FFFF00', // '#FB7E81',
                size: sizeLabel(d3.mean(totalValues)),
                face: 'Tahoma',
                strokeWidth: 0.5,
                strokeColor: "rgba(48, 48, 48, 1)"
            }
        });
        // edges.push({ from: id1, to: "global-report" });
        for (var j = 0, lgj = nestedData[i].values.length; j < lgj; j++) {
            var id2 = Math.random(10000, 20000);
            var size2 = nestedData[i].values[j].value.size;
            var color = nestedData[i].values[j].key === colorTest ? '#56FF0D' : '#FF557F';
            // console.log(size2, scaleSize(size2));
            nodes.push({
                id: id2,
                label: nestedData[i].values[j].key,
                shape: 'dot',
                size: scaleSize(size2), // scaleSize(size2),
                // value: size2, // scaleSize(size2*2),
                color: color, //'#FF557F', // '#56FF0D', //'#FFFF00',
                font: {
                    color: '#FFFFFF', // '#FF557F', // '#56FF0D', // '#FFFF00',
                    size: sizeLabel(d3.mean(totalValues)),
                    face: 'Tahoma',
                    strokeWidth: 0.5,
                    strokeColor: "rgba(48, 48, 48, 1)"
                }
            });
            edges.push({ from: id2, to: id1 });
            for (var k = 0, lgk = nestedData[i].values[j].value.array.length; k < lgk; k++) {
                var id3 = Math.random(20000, 30000);
                // console.log(scaleSize(1));
                nodes.push({
                    id: id3,
                    label: importSelected !== "synthese_analytics" ? nestedData[i].values[j].value.array[k][ref_ID] : nestedData[i].values[j].value.array[k]["ID"],
                    shape: 'dot',
                    color: color, // '#56FF0D', //'#7BE141',
                    size: scaleSize(1), // scaleSize(1),
                    // value: 1, //scaleSize(1),
                    font: {
                        color: "#FFFFFF",
                        size: sizeLabel3(d3.mean(totalValues)),
                        face: 'Tahoma',
                        strokeWidth: 0.5,
                        strokeColor: "rgba(48, 48, 48, 1)"
                    }
                });
                // console.log(nestedData[i].values[j].values[k].key);
                edges.push({ from: id3, to: id2 });
            }
        }
    }
    // legend
    var network_div = document.getElementById('network_div');
    // console.log(network_div.offsetTop, network_div.offsetLeft, network_div.offsetWidth, network_div.offsetHeight);
    var x = network_div.offsetLeft;
    var y = network_div.offsetTop;
    //console.log(x, y, outerWidth)
    var step = 50;
    // var shadow = {
    //     enabled: true,
    //     color: 'rgba(0,0,0,0.5)',
    //     size: 4,
    //     x: 1,
    //     y: 1
    // }

    nodes.unshift({
        id: "global-report",
        label: ' ' + importSelected + ' > ' + key1 + ' > ' + key2 + ' ',
        labelHighlightBold: true,
        color: '#55ff77',
        font: {
            multi: 'html',
            size: sizeLabel(d3.mean(totalValues)) * 1.5,
            align: 'left'
        },
        borderWidth: 0.3,
        // shadow: shadow,
        shape: 'box',
        x: network_div.offsetLeft,
        y: network_div.offsetTop,
        // fixed: true,
        physics: false
    });

    // console.log(totalSize, scaleSize(totalSize), globalSize, scaleSize(globalSize));
    //nodes = allIds.concat(selectedRegions);
    // nodes.unshift({
    //     id: "global-report",
    //     label: 'global-report > ' + key1 + ' > ' + key2,
    //     shape: 'dot',
    //     size: globalSize / 8, // scaleSize(globalSize), // scaleSize(totalSize), //
    //     color: 'rgba(217, 138, 0, 1)'
    //     // value: scaleSize(totalSize),
    //     // borderWidth: 2,
    //     // borderWidthSelected: 4,
    //     // color: {
    //     //     // border: '#56FF0D',
    //     //     background: 'rgba(217, 138, 0, 1)'
    //     // },
    //     font: {
    //         size: 120,
    //         face: 'Tahoma',
    //         color: 'rgba(255, 168, 5, 1)',
    //         face: 'Tahoma',
    //         strokeWidth: 1,
    //         strokeColor: "rgba(48, 48, 48, 1)"
    //     }
    // });

    // console.log(nodes, edges);
    // // create a network
    drawNetwork(nodes, edges);
    // // sessionStorage.setItem('networkData', JSON.stringify([nodes, edges]));
}

function drawNetwork(nodes, edges) {
    // var networkData = JSON.parse(sessionStorage.getItem('networkData'));
    // if (!nodes) {
    //     nodes = networkData[0];
    //     edges = networkData[1];
    // }
    document.getElementById('network-container').classList.remove('hidden');
    var container = document.getElementById('network_div');
    var data = {
        nodes: nodes,
        edges: edges
    };

    var options = { // options barre upadating progress
        nodes: {
            shapeProperties: {
                interpolation: true // 'true' for intensive zooming
            }
            // scaling: {
            //     // customScalingFunction: function (min,max,total,value) {
            //     //   return value/total;
            //     // },
            //     label: {
            //         min: 5,
            //         max: 60
            //     }
            // }
        },
        edges: {
            width: 0.05,
            color: { inherit: 'from' },
            smooth: {
                type: 'continuous'
            }
        },
        layout: {
            improvedLayout: false,
            randomSeed: 2 //100 //34
        },
        physics: {
            stabilization: false,
            solver: 'forceAtlas2Based',
            barnesHut: {
                gravitationalConstant: -10000, //-80000,
                springConstant: 0.1, //0.001,
                springLength: 20
            }
        },
        interaction: {
            tooltipDelay: 20,
            hideEdgesOnDrag: true
        }
    };
    var network = new vis.Network(container, data, options);
}

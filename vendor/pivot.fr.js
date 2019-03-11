(function() {
  var callWithJQuery;

  callWithJQuery = function(pivotModule) {
    if (typeof exports === "object" && typeof module === "object") {
      return pivotModule(require("jquery"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery"], pivotModule);
    } else {
      return pivotModule(jQuery);
    }
  };

  callWithJQuery(function($) {
    var frFmt, frFmtInt, frFmtPct, nf, tpl;
    nf = $.pivotUtilities.numberFormat;
    tpl = $.pivotUtilities.aggregatorTemplates;
    frFmt = nf({
      thousandsSep: " ",
      decimalSep: ","
    });
    frFmtInt = nf({
      digitsAfterDecimal: 0,
      thousandsSep: " ",
      decimalSep: ","
    });
    frFmtPct = nf({
      digitsAfterDecimal: 2,
      scaler: 100,
      suffix: "%",
      thousandsSep: " ",
      decimalSep: ","
    });

    return $.pivotUtilities.locales.fr = {
      localeStrings: {
        renderError: "Une erreur est survenue en dessinant le tableau croisé.",
        computeError: "Une erreur est survenue en calculant le tableau croisé.",
        uiRenderError: "Une erreur est survenue en dessinant l'interface du tableau croisé dynamique.",
        selectAll: "Sélectionner tout",
        selectNone: "Sélectionner rien",
        tooMany: "(trop de valeurs à afficher)",
        filterResults: "Filtrer les valeurs",
        totals: "Totaux",
        vs: "sur",
        by: "par",
        apply: "Appliquer",
        cancel: "Annuler"
      },
      aggregators: {
        "Nombre": tpl.count(frFmtInt),
        "Nombre de valeurs uniques": tpl.countUnique(frFmtInt),
        "Liste de valeurs uniques": tpl.listUnique(", "),
        // "Somme": tpl.sum(frFmt),
        // "Somme en entiers": tpl.sum(frFmtInt),
        "Moyenne": tpl.average(frFmt),
        "Mediane": tpl.median(frFmt),
        "Variance": tpl["var"](1, frFmt),
        "Ecart type": tpl.stdev(1, frFmt),
        "Minimum": tpl.min(frFmt),
        "Maximum": tpl.max(frFmt),
        // "Premier": tpl.min(frFmt),
        // "Dernier": tpl.max(frFmt),
        // "Ratio de sommes": tpl.sumOverSum(frFmt),
        // "Borne supérieure 80%": tpl.sumOverSumBound80(true, frFmt),
        // "Borne inférieure 80%": tpl.sumOverSumBound80(false, frFmt),
        // "Somme en proportion du totale": tpl.fractionOf(tpl.sum(), "total", frFmtPct),
        // "Somme en proportion de la ligne": tpl.fractionOf(tpl.sum(), "row", frFmtPct),
        // "Somme en proportion de la colonne": tpl.fractionOf(tpl.sum(), "col", frFmtPct),
        "En % sur total général": tpl.fractionOf(tpl.count(), "total", frFmtPct),
        "En % sur total ligne": tpl.fractionOf(tpl.count(), "row", frFmtPct),
        "En % sur total colonne": tpl.fractionOf(tpl.count(), "col", frFmtPct)
      }
      // ,
      // renderers: {
      //   "Table": $.pivotUtilities.renderers["Table"],
      //   "Table avec barres": $.pivotUtilities.renderers["Table Barchart"],
      //   "Dégradé de couleurs": $.pivotUtilities.renderers["Heatmap"],
      //   "Dégradé de couleurs par ligne": $.pivotUtilities.renderers["Row Heatmap"],
      //   "Dégradé de couleurs par colonne": $.pivotUtilities.renderers["Col Heatmap"]
      // }
    };
  });

}).call(this);
//# sourceMappingURL=pivot.fr.js.map

/**
* export_renderers.js
*/

(function() {
  var callWithJQuery;

  callWithJQuery = function(pivotModule) {
    if (typeof exports === "object" && typeof module === "object") {
      return pivotModule(require("jquery"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery"], pivotModule);
    } else {
      return pivotModule(jQuery);
    }
  };

  callWithJQuery(function($) {
    return $.pivotUtilities.export_renderers = {
      "TSV Export": function(pivotData, opts) {
        var pattern = /^[0-9]+([.][0-9]+)?$/;// ajouté pour remplacement point par virgule
        var agg, colAttrs, colKey, colKeys, defaults, i, j, k, l, len, len1, len2, len3, len4, len5, m, n, r, result, row, rowAttr, rowAttrs, rowKey, rowKeys, text;
        defaults = {
          localeStrings: {}
        };
        opts = $.extend(true, {}, defaults, opts);
        rowKeys = pivotData.getRowKeys();
        if (rowKeys.length === 0) {
          rowKeys.push([]);
        }
        colKeys = pivotData.getColKeys();
        if (colKeys.length === 0) {
          colKeys.push([]);
        }
        rowAttrs = pivotData.rowAttrs;
        colAttrs = pivotData.colAttrs;
        result = [];
        row = [];
        for (i = 0, len = rowAttrs.length; i < len; i++) {
          rowAttr = rowAttrs[i];
          row.push(rowAttr);
        }
        if (colKeys.length === 1 && colKeys[0].length === 0) {
          row.push(pivotData.aggregatorName);
        } else {
          for (j = 0, len1 = colKeys.length; j < len1; j++) {
            colKey = colKeys[j];
            row.push(colKey.join("-"));
          }
        }
        result.push(row);
        for (k = 0, len2 = rowKeys.length; k < len2; k++) {
          rowKey = rowKeys[k];
          row = [];
          for (l = 0, len3 = rowKey.length; l < len3; l++) {
            r = rowKey[l];
            row.push(r);
          }
          for (m = 0, len4 = colKeys.length; m < len4; m++) {
            colKey = colKeys[m];
            agg = pivotData.getAggregator(rowKey, colKey);
            if (agg.value() != null) {
              // row.push(agg.value()); // ligne initiale
              if (pattern.test(agg.value()))  row.push(agg.value().toString().replace(/\./ , ","));
            } else {
              row.push("");
            }
          }
          result.push(row);
        }
        text = "";
        for (n = 0, len5 = result.length; n < len5; n++) {
          r = result[n];
          text += r.join("\t") + "\n";
        }
        text += "\nNote d'utilisation : pour exporter ces données - cliquez sur cette zone puis faites Ctrl A - puis Ctrl C." +
        " Ouvrez ensuite votre tableur puis faites Ctrl V - de préférence sur la 1ère cellule d'une feuille de calcul."+
        " Vous pourrez ensuite supprimer le contenu de cette note à partir d'une cellule sur votre tableur.";
        return textArea = $("<textarea>").text(text).css({
          width: ($(window).width() / 2) + "px",
          height: ($(window).height() / 2) + "px"
        });;
      }
    };
  });

}).call(this);

//# sourceMappingURL=export_renderers.js.map


/**
* Plotty renderers
*/
(function() {
  var callWithJQuery;

  callWithJQuery = function(pivotModule) {
    if (typeof exports === "object" && typeof module === "object") {
      return pivotModule(require("jquery"), require("plotly.js"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery", "plotly.js"], pivotModule);
    } else {
      return pivotModule(jQuery, Plotly);
    }
  };

  callWithJQuery(function($, Plotly) {
    var makePlotlyChart, makePlotlyScatterChart;
    makePlotlyChart = function(traceOptions, layoutOptions, transpose) {
      if (traceOptions == null) {
        traceOptions = {};
      }
      if (layoutOptions == null) {
        layoutOptions = {};
      }
      if (transpose == null) {
        transpose = false;
      }
      return function(pivotData, opts) {
        var colKeys, data, datumKeys, defaults, fullAggName, groupByTitle, hAxisTitle, layout, result, rowKeys, titleText, traceKeys;
        defaults = {
          localeStrings: {
            vs: "vs",
            by: "by"
          },
          plotly: {}
        };
        opts = $.extend(true, {}, defaults, opts);
        rowKeys = pivotData.getRowKeys();
        colKeys = pivotData.getColKeys();
        traceKeys = transpose ? colKeys : rowKeys;
        if (traceKeys.length === 0) {
          traceKeys.push([]);
        }
        datumKeys = transpose ? rowKeys : colKeys;
        if (datumKeys.length === 0) {
          datumKeys.push([]);
        }
        fullAggName = pivotData.aggregatorName;
        if (pivotData.valAttrs.length) {
          fullAggName += "(" + (pivotData.valAttrs.join(", ")) + ")";
        }
        data = traceKeys.map(function(traceKey) {
          var datumKey, i, labels, len, trace, val, values;
          values = [];
          labels = [];
          for (i = 0, len = datumKeys.length; i < len; i++) {
            datumKey = datumKeys[i];
            val = parseFloat(pivotData.getAggregator(transpose ? datumKey : traceKey, transpose ? traceKey : datumKey).value());
            values.push(isFinite(val) ? val : null);
            labels.push(datumKey.join('-') || ' ');
          }
          trace = {
            name: traceKey.join('-') || fullAggName
          };
          trace.x = transpose ? values : labels;
          trace.y = transpose ? labels : values;
          return $.extend(trace, traceOptions);
        });
        if (transpose) {
          hAxisTitle = pivotData.rowAttrs.join("-");
          groupByTitle = pivotData.colAttrs.join("-");
        } else {
          hAxisTitle = pivotData.colAttrs.join("-");
          groupByTitle = pivotData.rowAttrs.join("-");
        }
        titleText = fullAggName;
        if (hAxisTitle !== "") {
          titleText += " " + opts.localeStrings.vs + " " + hAxisTitle;
        }
        if (groupByTitle !== "") {
          titleText += " " + opts.localeStrings.by + " " + groupByTitle;
        }
        layout = {
          title: titleText,
          hovermode: 'closest',
          width: window.innerWidth / 1.4,
          height: window.innerHeight / 1.4 - 50,
          xaxis: {
            title: transpose ? fullAggName : null,
            automargin: true
          },
          yaxis: {
            title: transpose ? null : fullAggName,
            automargin: true
          }
        };
        result = $("<div>").appendTo($("body"));
        Plotly.newPlot(result[0], data, $.extend(layout, layoutOptions, opts.plotly));
        return result.detach();
      };
    };
    makePlotlyScatterChart = function() {
      return function(pivotData, opts) {
        var colKey, colKeys, data, defaults, i, j, layout, len, len1, renderArea, result, rowKey, rowKeys, v;
        defaults = {
          localeStrings: {
            vs: "vs",
            by: "by"
          },
          plotly: {}
        };
        opts = $.extend(true, {}, defaults, opts);
        rowKeys = pivotData.getRowKeys();
        if (rowKeys.length === 0) {
          rowKeys.push([]);
        }
        colKeys = pivotData.getColKeys();
        if (colKeys.length === 0) {
          colKeys.push([]);
        }
        data = {
          x: [],
          y: [],
          text: [],
          type: 'scatter',
          mode: 'markers'
        };
        for (i = 0, len = rowKeys.length; i < len; i++) {
          rowKey = rowKeys[i];
          for (j = 0, len1 = colKeys.length; j < len1; j++) {
            colKey = colKeys[j];
            v = pivotData.getAggregator(rowKey, colKey).value();
            if (v != null) {
              data.x.push(colKey.join('-'));
              data.y.push(rowKey.join('-'));
              data.text.push(v);
            }
          }
        }
        layout = {
          title: pivotData.rowAttrs.join("-") + ' vs ' + pivotData.colAttrs.join("-"),
          hovermode: 'closest',
          xaxis: {
            title: pivotData.colAttrs.join('-'),
            domain: [0.1, 1.0]
          },
          yaxis: {
            title: pivotData.rowAttrs.join('-')
          },
          width: window.innerWidth / 1.5,
          height: window.innerHeight / 1.4 - 50
        };
        renderArea = $("<div>", {
          style: "display:none;"
        }).appendTo($("body"));
        result = $("<div>").appendTo(renderArea);
        Plotly.plot(result[0], [data], $.extend(layout, opts.plotly));
        result.detach();
        renderArea.remove();
        return result;
      };
    };
    // https://github.com/nicolaskruchten/pivottable/wiki/Renderers
    return $.pivotUtilities.plotly_renderers = {
      "Horizontal Bar Chart": makePlotlyChart({
        type: 'bar',
        orientation: 'h'
      }, {
        barmode: 'group'
      }, true),
      "Horizontal Stacked Bar Chart": makePlotlyChart({
        type: 'bar',
        orientation: 'h'
      }, {
        barmode: 'relative'
      }, true),
      "Bar Chart": makePlotlyChart({
        type: 'bar'
      }, {
        barmode: 'group'
      }),
      "Stacked Bar Chart": makePlotlyChart({
        type: 'bar'
      }, {
        barmode: 'relative'
      }),
      "Line Chart": makePlotlyChart(),
      "Area Chart": makePlotlyChart({
        stackgroup: 1
      }),
      "Scatter Chart": makePlotlyScatterChart()
    };
  });

}).call(this);

//# sourceMappingURL=plotly_renderers.js.map

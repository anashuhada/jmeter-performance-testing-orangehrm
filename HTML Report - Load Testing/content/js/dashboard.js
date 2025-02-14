/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6833757587624829, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8852459016393442, 500, 1500, "-30"], "isController": false}, {"data": [0.4918032786885246, 500, 1500, "-32"], "isController": false}, {"data": [0.4948717948717949, 500, 1500, "-14"], "isController": false}, {"data": [0.8835978835978836, 500, 1500, "-17"], "isController": false}, {"data": [0.9083769633507853, 500, 1500, "-18"], "isController": false}, {"data": [0.8387096774193549, 500, 1500, "-19"], "isController": false}, {"data": [0.4918032786885246, 500, 1500, "Logout"], "isController": true}, {"data": [0.8232323232323232, 500, 1500, "-8-1"], "isController": false}, {"data": [0.4671717171717172, 500, 1500, "-8-0"], "isController": false}, {"data": [0.8770491803278688, 500, 1500, "-32-1"], "isController": false}, {"data": [0.4975, 500, 1500, "-1"], "isController": false}, {"data": [0.475, 500, 1500, "-4"], "isController": false}, {"data": [0.8440860215053764, 500, 1500, "Assertion"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [0.351010101010101, 500, 1500, "-8"], "isController": false}, {"data": [0.8645833333333334, 500, 1500, "-20"], "isController": false}, {"data": [0.8475935828877005, 500, 1500, "-21"], "isController": false}, {"data": [0.8375634517766497, 500, 1500, "Assertions"], "isController": false}, {"data": [0.8612565445026178, 500, 1500, "-22"], "isController": false}, {"data": [0.8387096774193549, 500, 1500, "-24"], "isController": false}, {"data": [0.8804347826086957, 500, 1500, "-26"], "isController": false}, {"data": [0.8907103825136612, 500, 1500, "-27"], "isController": false}, {"data": [0.7554347826086957, 500, 1500, "-28"], "isController": false}, {"data": [0.5434782608695652, 500, 1500, "-29"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "Navigate"], "isController": true}, {"data": [0.8961748633879781, 500, 1500, "-32-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4541, 0, 0.0, 632.2746091169349, 0, 3200, 485.0, 1185.0, 1310.8999999999996, 1770.2799999999988, 25.22133232618331, 482.8030384422592, 21.621113059301514], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["-30", 183, 0, 0.0, 450.8852459016393, 343, 883, 413.0, 583.1999999999999, 667.1999999999996, 798.9999999999997, 1.1052126175420798, 21.569994298416464, 0.8062439700233724], "isController": false}, {"data": ["-32", 183, 0, 0.0, 909.8360655737705, 697, 2052, 833.0, 1221.2, 1299.9999999999995, 1789.919999999999, 1.1028946464409048, 4.983042476887427, 1.8471331236778825], "isController": false}, {"data": ["-14", 195, 0, 0.0, 920.4871794871794, 389, 1675, 754.0, 1349.6000000000001, 1434.3999999999996, 1660.6, 1.1160586531747576, 111.9445227185901, 0.8130661672542667], "isController": false}, {"data": ["-17", 189, 0, 0.0, 463.35978835978835, 353, 990, 423.0, 596.0, 719.5, 908.0999999999995, 1.1309577237231847, 3.861160353648685, 0.8449049400861681], "isController": false}, {"data": ["-18", 191, 0, 0.0, 437.3664921465969, 330, 1131, 402.0, 558.8, 630.1999999999996, 1017.8399999999981, 1.1425426658930078, 1.6022375666233977, 0.9115794512056518], "isController": false}, {"data": ["-19", 186, 0, 0.0, 494.9516129032256, 354, 1185, 434.5, 672.2000000000002, 864.5500000000001, 1095.3899999999994, 1.119557955181567, 2.7682819751169214, 0.9282272499503422], "isController": false}, {"data": ["Logout", 183, 0, 0.0, 909.8360655737705, 697, 2052, 833.0, 1221.2, 1299.9999999999995, 1789.919999999999, 1.1028879996142906, 4.983012445533605, 1.847121991541512], "isController": true}, {"data": ["-8-1", 198, 0, 0.0, 509.9898989898992, 375, 1076, 455.0, 695.4, 845.8499999999997, 981.9499999999991, 1.131266961862591, 3.4523527888873016, 1.0859720932723895], "isController": false}, {"data": ["-8-0", 198, 0, 0.0, 944.6515151515152, 669, 2609, 816.5, 1368.3, 1612.249999999998, 2474.3599999999988, 1.1292281896418979, 2.2871281887864217, 1.2813202203135603], "isController": false}, {"data": ["-32-1", 183, 0, 0.0, 462.1038251366122, 343, 971, 419.0, 620.0, 678.5999999999999, 901.2799999999997, 1.1051992680319602, 2.78197726867817, 0.9249568092806543], "isController": false}, {"data": ["-1", 200, 0, 0.0, 1038.5950000000007, 883, 1870, 1007.0, 1217.3000000000002, 1288.6999999999998, 1499.5200000000004, 1.1182492689445405, 2.8239506977875437, 0.8620566141648635], "isController": false}, {"data": ["-4", 200, 0, 0.0, 1274.7099999999998, 1111, 1632, 1243.5, 1422.7, 1534.7999999999995, 1625.98, 1.1225297330063029, 112.57705991221816, 0.8122993478102251], "isController": false}, {"data": ["Assertion", 186, 0, 0.0, 488.62365591397855, 352, 1104, 425.5, 715.4000000000001, 775.4000000000001, 1016.1299999999995, 1.1200163787341406, 1.8397144033504147, 0.8575125399683264], "isController": false}, {"data": ["Login", 200, 0, 0.0, 2313.3049999999994, 1998, 3092, 2267.0, 2578.0, 2664.85, 3039.5000000000005, 1.1104633408289608, 114.17122563921046, 1.659622164848283], "isController": true}, {"data": ["-8", 198, 0, 0.0, 1455.1565656565658, 1065, 3200, 1302.0, 2034.1, 2453.4999999999995, 2961.409999999998, 1.1266002844950211, 5.719916874110953, 2.3598306365576103], "isController": false}, {"data": ["-20", 192, 0, 0.0, 463.02083333333326, 339, 974, 417.5, 607.5000000000001, 704.5, 866.1199999999992, 1.1481536851547316, 1.7255942592315743, 0.8700852145313202], "isController": false}, {"data": ["-21", 187, 0, 0.0, 510.7379679144387, 341, 1456, 414.0, 802.8000000000002, 913.5999999999999, 1255.360000000001, 1.1194655300399894, 19.36106888379708, 0.8166413583397188], "isController": false}, {"data": ["Assertions", 197, 0, 0.0, 485.91370558375615, 375, 1308, 442.0, 631.8000000000001, 675.2, 1026.740000000003, 1.1266928989751097, 3.4383938567355643, 0.9715525681592011], "isController": false}, {"data": ["-22", 191, 0, 0.0, 488.82198952879594, 359, 1274, 430.0, 701.0, 793.9999999999983, 1194.8799999999987, 1.1425426658930078, 1.691498712396289, 0.8825695788294621], "isController": false}, {"data": ["-24", 186, 0, 0.0, 487.4838709677419, 355, 1280, 422.5, 675.3, 769.0500000000002, 1229.5399999999997, 1.1198140867795712, 1.5550543275396, 0.8737611868524194], "isController": false}, {"data": ["-26", 184, 0, 0.0, 456.3913043478262, 349, 868, 413.0, 642.5, 695.5, 864.6, 1.1093091536091735, 1.7062128095062972, 0.8514814401726664], "isController": false}, {"data": ["-27", 183, 0, 0.0, 449.7267759562843, 338, 942, 413.0, 571.2, 644.4, 906.7199999999998, 1.1052126175420798, 25.11432184561448, 0.807323279220191], "isController": false}, {"data": ["-28", 184, 0, 0.0, 582.5706521739127, 339, 1116, 490.5, 897.0, 957.5, 1116.0, 1.109355970626183, 37.21217601078005, 0.8103498691683448], "isController": false}, {"data": ["-29", 184, 0, 0.0, 791.7173913043479, 356, 1348, 714.5, 1144.5, 1272.75, 1334.4, 1.1094763753889196, 135.54697981423809, 0.7952691987651046], "isController": false}, {"data": ["Debug Sampler", 180, 0, 0.0, 0.28888888888888903, 0, 3, 0.0, 1.0, 1.0, 1.3799999999999955, 1.0896675303290795, 0.8014069575271812, 0.0], "isController": false}, {"data": ["Navigate", 183, 0, 0.0, 9470.316939890707, 6725, 13700, 9302.0, 12382.6, 13021.399999999998, 13507.64, 1.0514703347467853, 355.94928796820597, 14.236657629695706], "isController": true}, {"data": ["-32-0", 183, 0, 0.0, 447.3333333333333, 334, 1213, 401.0, 604.8, 656.3999999999997, 1122.2799999999997, 1.10533945397439, 2.211758341009302, 0.9261535659277603], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4541, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

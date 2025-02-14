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

    var data = {"OkPercent": 99.95806248689453, "KoPercent": 0.04193751310547285};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.24342470827931098, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.21726190476190477, 500, 1500, "Login-17"], "isController": false}, {"data": [0.23778501628664495, 500, 1500, "Empl-23"], "isController": false}, {"data": [0.11052631578947368, 500, 1500, "Empl-24"], "isController": false}, {"data": [0.3220588235294118, 500, 1500, "Login-15"], "isController": false}, {"data": [0.20903010033444816, 500, 1500, "Empl-25"], "isController": false}, {"data": [0.21280276816608998, 500, 1500, "Empl-26"], "isController": false}, {"data": [0.2591549295774648, 500, 1500, "Login-10"], "isController": false}, {"data": [0.0, 500, 1500, "Dashboard"], "isController": true}, {"data": [0.04419889502762431, 500, 1500, "Login-3 - Token"], "isController": false}, {"data": [0.23487031700288186, 500, 1500, "Login-13"], "isController": false}, {"data": [0.10810810810810811, 500, 1500, "Login-1"], "isController": false}, {"data": [0.24927113702623907, 500, 1500, "Login-14"], "isController": false}, {"data": [0.08991825613079019, 500, 1500, "Login-2"], "isController": false}, {"data": [0.24293785310734464, 500, 1500, "Login-11"], "isController": false}, {"data": [0.25285714285714284, 500, 1500, "Login-12"], "isController": false}, {"data": [0.0896358543417367, 500, 1500, "Login-5"], "isController": false}, {"data": [0.56, 500, 1500, "Login-7"], "isController": false}, {"data": [0.9985714285714286, 500, 1500, "Login-8"], "isController": false}, {"data": [0.9957142857142857, 500, 1500, "Login-9"], "isController": false}, {"data": [0.04659498207885305, 500, 1500, "Logout"], "isController": true}, {"data": [0.07379518072289157, 500, 1500, "Login-19 - Side Bar Menu"], "isController": false}, {"data": [0.18825301204819278, 500, 1500, "Login-19 - Side Bar Menu-1"], "isController": false}, {"data": [0.2575301204819277, 500, 1500, "Login-19 - Side Bar Menu-0"], "isController": false}, {"data": [0.07547169811320754, 500, 1500, "Login-21"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [0.17907801418439717, 500, 1500, "Login-22"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.04659498207885305, 500, 1500, "Employee List-28"], "isController": false}, {"data": [0.1935483870967742, 500, 1500, "Employee List-28-1"], "isController": false}, {"data": [0.25985663082437277, 500, 1500, "Employee List-28-0"], "isController": false}, {"data": [0.2058011049723757, 500, 1500, "Login-3 - Token-1"], "isController": false}, {"data": [0.0, 500, 1500, "Employee List"], "isController": true}, {"data": [0.06906077348066299, 500, 1500, "Login-3 - Token-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9538, 4, 0.04193751310547285, 1993.1107150345988, 0, 12544, 1761.0, 3425.2000000000007, 5505.8499999999585, 9725.220000000001, 48.59681659771333, 836.369650848903, 32.49738260471651], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Login-17", 336, 0, 0.0, 1624.1249999999998, 364, 3024, 1696.5, 2319.2, 2496.5, 2842.7699999999995, 1.7957447263359858, 31.05726474942413, 1.0469332047095543], "isController": false}, {"data": ["Empl-23", 307, 0, 0.0, 1549.1498371335517, 357, 3391, 1659.0, 2256.6, 2441.2, 3091.8, 1.6491899093214146, 2.597796214585393, 1.0017540269510938], "isController": false}, {"data": ["Empl-24", 285, 0, 0.0, 2288.259649122807, 417, 4067, 2430.0, 3267.0, 3510.2, 3743.8199999999983, 1.6170121020589956, 16.9717731654714, 1.1164331603083102], "isController": false}, {"data": ["Login-15", 340, 0, 0.0, 1340.9470588235292, 349, 2837, 1417.5, 2039.9, 2294.2499999999995, 2684.659999999998, 1.8277702815303813, 2.5631622307398705, 1.1494961536187163], "isController": false}, {"data": ["Empl-25", 299, 0, 0.0, 1639.4615384615383, 375, 3479, 1765.0, 2322.0, 2561.0, 3272.0, 1.6098117758539001, 10.246797706152819, 0.9636861509750398], "isController": false}, {"data": ["Empl-26", 289, 0, 0.0, 1622.7681660899652, 376, 3364, 1751.0, 2330.0, 2430.5, 2894.000000000002, 1.560930292849967, 4.210243621925399, 0.9191806314341116], "isController": false}, {"data": ["Login-10", 355, 0, 0.0, 1509.6929577464778, 361, 3421, 1574.0, 2341.2000000000003, 2492.6, 3313.24, 1.9429271976969473, 2.9200829660699235, 1.1441260744250576], "isController": false}, {"data": ["Dashboard", 332, 0, 0.0, 24224.496987951807, 6075, 37095, 26869.0, 33485.7, 34402.6, 35789.93000000001, 1.7152658662092624, 376.33724622977326, 15.938686066629295], "isController": true}, {"data": ["Login-3 - Token", 362, 0, 0.0, 7250.560773480663, 1101, 12544, 8108.0, 10867.1, 11450.599999999999, 12096.79, 1.992492376790216, 10.117813593944366, 3.1914558301042484], "isController": false}, {"data": ["Login-13", 347, 0, 0.0, 1597.9884726224784, 361, 3299, 1708.0, 2387.2, 2535.7999999999997, 3049.9599999999996, 1.8749054442499296, 2.9273869248308806, 1.1187179945670969], "isController": false}, {"data": ["Login-1", 370, 4, 1.0810810810810811, 2108.6378378378386, 891, 3641, 2219.0, 2904.5, 3098.0, 3493.760000000001, 2.0893685024874777, 5.310590407186863, 1.0784886983516577], "isController": false}, {"data": ["Login-14", 343, 0, 0.0, 1503.620991253646, 361, 2869, 1628.0, 2252.4, 2385.0000000000005, 2712.76, 1.847771630510319, 2.7882658841694994, 1.106136728030103], "isController": false}, {"data": ["Login-2", 367, 0, 0.0, 2179.3678474114436, 1096, 3904, 2224.0, 2857.6, 3190.7999999999993, 3505.04, 2.0771664506489023, 208.31447820743932, 1.0994377111833058], "isController": false}, {"data": ["Login-11", 354, 0, 0.0, 1610.5536723163848, 361, 3450, 1695.5, 2431.0, 2674.25, 3245.7999999999993, 1.9298073463513559, 2.8048901399928043, 1.16466888676283], "isController": false}, {"data": ["Login-12", 350, 0, 0.0, 1551.282857142857, 374, 3394, 1662.5, 2286.6000000000004, 2434.35, 2981.4100000000017, 1.8973274787228276, 6.03105560863555, 1.0968924486366347], "isController": false}, {"data": ["Login-5", 357, 0, 0.0, 2128.9887955182076, 630, 4068, 2237.0, 2831.0, 2948.1, 3680.920000000001, 1.9576554197443534, 196.35829331141255, 1.04573976035172], "isController": false}, {"data": ["Login-7", 350, 0, 0.0, 553.451428571429, 269, 820, 565.0, 641.0, 705.0, 807.47, 1.9061415881971715, 52.48590646563227, 1.1038495720712136], "isController": false}, {"data": ["Login-8", 350, 0, 0.0, 304.07714285714275, 258, 506, 292.0, 351.60000000000014, 389.34999999999997, 468.49, 1.905664178413725, 51.5645928276245, 1.0979901027969705], "isController": false}, {"data": ["Login-9", 350, 0, 0.0, 310.6199999999997, 257, 862, 293.5, 369.60000000000014, 415.45, 543.5500000000009, 1.9061208262761478, 50.2367078706452, 1.0982532104520775], "isController": false}, {"data": ["Logout", 279, 0, 0.0, 3155.1290322580644, 726, 5577, 3354.0, 4296.0, 4585.0, 5207.399999999998, 1.5941763993326172, 7.204042838848193, 1.9787091831560122], "isController": true}, {"data": ["Login-19 - Side Bar Menu", 332, 0, 0.0, 3393.057228915664, 772, 6480, 3577.0, 5008.599999999999, 5291.299999999998, 5653.77, 1.763687168644617, 9.109513120079473, 2.199441908553883], "isController": false}, {"data": ["Login-19 - Side Bar Menu-1", 332, 0, 0.0, 1851.2921686746988, 401, 3436, 2014.5, 2886.2, 3028.8999999999987, 3310.34, 1.7671700262414103, 5.665643746240772, 1.1044812664008814], "isController": false}, {"data": ["Login-19 - Side Bar Menu-0", 332, 0, 0.0, 1541.5873493975892, 370, 3395, 1648.5, 2311.7, 2451.0499999999997, 2825.2700000000027, 1.7699492472384526, 3.467302919883141, 1.101032881338764], "isController": false}, {"data": ["Login-21", 318, 0, 0.0, 2190.584905660376, 438, 4349, 2255.0, 2873.3, 3048.4000000000005, 3908.7700000000004, 1.6945088322276396, 169.96354666227055, 0.913446167372712], "isController": false}, {"data": ["Login", 367, 4, 1.0899182561307903, 4283.72752043597, 2041, 6649, 4526.0, 5644.2, 6056.0, 6458.2, 2.060223649346567, 211.85225162411024, 2.153710200703395], "isController": true}, {"data": ["Login-22", 282, 0, 0.0, 1752.5744680851067, 351, 2922, 1902.0, 2357.1000000000004, 2516.8999999999996, 2770.3700000000026, 1.610407113202483, 27.851865209781227, 0.9420252546955932], "isController": false}, {"data": ["Debug Sampler", 270, 0, 0.0, 0.1777777777777779, 0, 2, 0.0, 1.0, 1.0, 1.0, 1.6628687565436964, 1.2302329844644946, 0.0], "isController": false}, {"data": ["Employee List-28", 279, 0, 0.0, 3155.1290322580644, 726, 5577, 3354.0, 4296.0, 4585.0, 5207.399999999998, 1.5941855083394758, 7.204084002219861, 1.9787204893549548], "isController": false}, {"data": ["Employee List-28-1", 279, 0, 0.0, 1702.4014336917558, 355, 3244, 1813.0, 2362.0, 2620.0, 3060.7999999999975, 1.597672780580545, 4.022937108813542, 0.9907443512389122], "isController": false}, {"data": ["Employee List-28-0", 279, 0, 0.0, 1452.387096774192, 367, 2869, 1565.0, 2069.0, 2223.0, 2690.5999999999995, 1.6060049619221404, 3.2135782880649075, 0.9974796443188293], "isController": false}, {"data": ["Login-3 - Token-1", 362, 0, 0.0, 1833.8093922651926, 392, 4010, 1847.5, 2900.1, 3154.3499999999995, 3782.2000000000003, 2.000331546665193, 6.106167890396199, 1.4260176065093662], "isController": false}, {"data": ["Employee List", 282, 0, 0.0, 11141.822695035473, 2707, 16771, 12140.5, 14269.400000000001, 14713.199999999999, 15967.030000000004, 1.588499712718137, 220.42983206509186, 5.733491150592026], "isController": true}, {"data": ["Login-3 - Token-0", 362, 0, 0.0, 5416.367403314916, 691, 9695, 6252.5, 8236.4, 8622.949999999999, 9383.15, 2.0025779041528597, 4.056002512903351, 1.7799912145192431], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 3,641 milliseconds, but should not have lasted longer than 3,500 milliseconds.", 1, 25.0, 0.010484378276368212], "isController": false}, {"data": ["The operation lasted too long: It took 3,525 milliseconds, but should not have lasted longer than 3,500 milliseconds.", 1, 25.0, 0.010484378276368212], "isController": false}, {"data": ["Tidy Parser errors: 4 (allowed 4) Tidy Parser warnings: 26 (allowed 25)", 1, 25.0, 0.010484378276368212], "isController": false}, {"data": ["The operation lasted too long: It took 3,543 milliseconds, but should not have lasted longer than 3,500 milliseconds.", 1, 25.0, 0.010484378276368212], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9538, 4, "The operation lasted too long: It took 3,641 milliseconds, but should not have lasted longer than 3,500 milliseconds.", 1, "The operation lasted too long: It took 3,525 milliseconds, but should not have lasted longer than 3,500 milliseconds.", 1, "Tidy Parser errors: 4 (allowed 4) Tidy Parser warnings: 26 (allowed 25)", 1, "The operation lasted too long: It took 3,543 milliseconds, but should not have lasted longer than 3,500 milliseconds.", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-1", 370, 4, "The operation lasted too long: It took 3,641 milliseconds, but should not have lasted longer than 3,500 milliseconds.", 1, "The operation lasted too long: It took 3,525 milliseconds, but should not have lasted longer than 3,500 milliseconds.", 1, "Tidy Parser errors: 4 (allowed 4) Tidy Parser warnings: 26 (allowed 25)", 1, "The operation lasted too long: It took 3,543 milliseconds, but should not have lasted longer than 3,500 milliseconds.", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

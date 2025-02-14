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

    var data = {"OkPercent": 94.15127222028582, "KoPercent": 5.848727779714186};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7957917542016807, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9664804469273743, 500, 1500, "Navigate-39"], "isController": false}, {"data": [0.9636871508379888, 500, 1500, "Navigate-37"], "isController": false}, {"data": [0.9748603351955307, 500, 1500, "Navigate-38"], "isController": false}, {"data": [0.47580645161290325, 500, 1500, "Login-3 - Token"], "isController": false}, {"data": [0.9491525423728814, 500, 1500, "Add A New Employee-52"], "isController": false}, {"data": [0.489247311827957, 500, 1500, "Login-1"], "isController": false}, {"data": [0.4972375690607735, 500, 1500, "Navigate-19 - Employee"], "isController": false}, {"data": [0.8192090395480226, 500, 1500, "Add A New Employee-53"], "isController": false}, {"data": [0.48118279569892475, 500, 1500, "Login-2"], "isController": false}, {"data": [0.48626373626373626, 500, 1500, "Login-5"], "isController": false}, {"data": [0.967032967032967, 500, 1500, "Login-6"], "isController": false}, {"data": [0.9662921348314607, 500, 1500, "Navigate-44 - Employee-0"], "isController": false}, {"data": [0.9697802197802198, 500, 1500, "Login-7"], "isController": false}, {"data": [0.9438202247191011, 500, 1500, "Navigate-44 - Employee-1"], "isController": false}, {"data": [0.9807692307692307, 500, 1500, "Login-8"], "isController": false}, {"data": [0.9725274725274725, 500, 1500, "Login-9"], "isController": false}, {"data": [0.9662921348314607, 500, 1500, "Navigate-42"], "isController": false}, {"data": [0.9776536312849162, 500, 1500, "Navigate-43"], "isController": false}, {"data": [0.9664804469273743, 500, 1500, "Navigate-40"], "isController": false}, {"data": [0.9608938547486033, 500, 1500, "Navigate-41"], "isController": false}, {"data": [0.8314606741573034, 500, 1500, "Navigate-46"], "isController": false}, {"data": [0.9548022598870056, 500, 1500, "Navigate-47"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "Navigate-33-1"], "isController": false}, {"data": [0.5, 500, 1500, "Navigate-28"], "isController": false}, {"data": [0.9834254143646409, 500, 1500, "Navigate-26"], "isController": false}, {"data": [0.5142045454545454, 500, 1500, "Update Employee"], "isController": true}, {"data": [0.48863636363636365, 500, 1500, "Add A New Employee-60"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "Add A New Employee-78-1"], "isController": false}, {"data": [0.9659090909090909, 500, 1500, "Add A New Employee-78-0"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [0.5255681818181818, 500, 1500, "Add A New Employee-63"], "isController": false}, {"data": [0.5227272727272727, 500, 1500, "Add A New Employee-64"], "isController": false}, {"data": [0.8664772727272727, 500, 1500, "Add A New Employee-61"], "isController": false}, {"data": [0.9659090909090909, 500, 1500, "Add A New Employee-62"], "isController": false}, {"data": [0.9180790960451978, 500, 1500, "Add A New Employee-56"], "isController": false}, {"data": [0.9661016949152542, 500, 1500, "Add A New Employee-54"], "isController": false}, {"data": [0.9668508287292817, 500, 1500, "Navigate-31"], "isController": false}, {"data": [0.9668508287292817, 500, 1500, "Navigate-32"], "isController": false}, {"data": [0.0, 500, 1500, "Navigate"], "isController": true}, {"data": [0.6712707182320442, 500, 1500, "Navigate-30"], "isController": false}, {"data": [0.7638888888888888, 500, 1500, "Navigate-35"], "isController": false}, {"data": [0.9720670391061452, 500, 1500, "Navigate-36"], "isController": false}, {"data": [0.49722222222222223, 500, 1500, "Navigate-33"], "isController": false}, {"data": [0.9751381215469613, 500, 1500, "Login-17"], "isController": false}, {"data": [0.9774011299435028, 500, 1500, "Add -51"], "isController": false}, {"data": [0.9807692307692307, 500, 1500, "Login-18"], "isController": false}, {"data": [0.0, 500, 1500, "Login-15"], "isController": false}, {"data": [0.9779005524861878, 500, 1500, "Login-16"], "isController": false}, {"data": [0.8813559322033898, 500, 1500, "Add -50"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "Add A New Employee-70"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "Login-10"], "isController": false}, {"data": [0.9744318181818182, 500, 1500, "Add A New Employee-71"], "isController": false}, {"data": [0.9395604395604396, 500, 1500, "Login-13"], "isController": false}, {"data": [0.9697802197802198, 500, 1500, "Login-14"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "Login-11"], "isController": false}, {"data": [0.9318181818181818, 500, 1500, "Add A New Employee-72"], "isController": false}, {"data": [0.989010989010989, 500, 1500, "Login-12"], "isController": false}, {"data": [0.9801136363636364, 500, 1500, "Add A New Employee-67"], "isController": false}, {"data": [0.5198863636363636, 500, 1500, "Add A New Employee-68"], "isController": false}, {"data": [0.5227272727272727, 500, 1500, "Add A New Employee-65"], "isController": false}, {"data": [0.9801136363636364, 500, 1500, "Add A New Employee-66"], "isController": false}, {"data": [0.9858757062146892, 500, 1500, "Add A New Employee-57 - EmployeeId"], "isController": false}, {"data": [0.5198863636363636, 500, 1500, "Add A New Employee-69"], "isController": false}, {"data": [0.5, 500, 1500, "Logout"], "isController": true}, {"data": [0.5497237569060773, 500, 1500, "Navigate-21"], "isController": false}, {"data": [0.9613259668508287, 500, 1500, "Navigate-24"], "isController": false}, {"data": [0.8895027624309392, 500, 1500, "Navigate-25"], "isController": false}, {"data": [0.9723756906077348, 500, 1500, "Navigate-22"], "isController": false}, {"data": [0.9834254143646409, 500, 1500, "Navigate-23"], "isController": false}, {"data": [0.975, 500, 1500, "Navigate-33-0"], "isController": false}, {"data": [0.4943820224719101, 500, 1500, "Navigate-44 - Employee"], "isController": false}, {"data": [0.0, 500, 1500, "Add A New Employee"], "isController": true}, {"data": [0.5, 500, 1500, "Add A New Employee-78"], "isController": false}, {"data": [0.9602272727272727, 500, 1500, "Add A New Employee-76"], "isController": false}, {"data": [0.5142045454545454, 500, 1500, "Add A New Employee-77"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.5112994350282486, 500, 1500, "Add A New Employee-59 - Add new employee"], "isController": false}, {"data": [0.9696132596685083, 500, 1500, "Navigate-28-1"], "isController": false}, {"data": [0.9719101123595506, 500, 1500, "Add -48"], "isController": false}, {"data": [0.9689265536723164, 500, 1500, "Add -49"], "isController": false}, {"data": [0.9861878453038674, 500, 1500, "Navigate-28-0"], "isController": false}, {"data": [0.9530386740331491, 500, 1500, "Navigate-19 - Employee-0"], "isController": false}, {"data": [0.9585635359116023, 500, 1500, "Navigate-19 - Employee-1"], "isController": false}, {"data": [0.9596774193548387, 500, 1500, "Login-3 - Token-1"], "isController": false}, {"data": [0.4946236559139785, 500, 1500, "Login-3 - Token-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14345, 839, 5.848727779714186, 497.60383408853124, 0, 5842, 414.0, 805.0, 977.0, 1261.539999999999, 22.74615638319464, 318.1328205397436, 14.835369279666729], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Navigate-39", 179, 0, 0.0, 417.3743016759777, 361, 1216, 400.0, 477.0, 527.0, 707.1999999999928, 0.29265820301323503, 0.5238696153547459, 0.15576046937716123], "isController": false}, {"data": ["Navigate-37", 179, 0, 0.0, 421.8659217877096, 354, 923, 403.0, 474.0, 510.0, 859.799999999999, 0.2926601169659484, 0.3989780500824844, 0.19005759549058174], "isController": false}, {"data": ["Navigate-38", 179, 0, 0.0, 411.0670391061451, 352, 667, 398.0, 468.0, 504.0, 603.799999999999, 0.29264480604515886, 0.4081023271801629, 0.15832541264552538], "isController": false}, {"data": ["Login-3 - Token", 186, 0, 0.0, 1205.9086021505375, 1088, 2252, 1166.0, 1308.9, 1467.3000000000006, 2116.2799999999993, 0.29609771861483575, 1.5035326144274408, 0.4738676600400209], "isController": false}, {"data": ["Add A New Employee-52", 177, 0, 0.0, 445.1073446327684, 381, 1541, 425.0, 499.40000000000003, 589.8999999999999, 1026.9799999999993, 0.2927076115555012, 0.9429762524412973, 0.18294225722218824], "isController": false}, {"data": ["Login-1", 186, 0, 0.0, 1058.677419354839, 905, 2596, 1014.0, 1168.0, 1256.6000000000001, 2488.1199999999994, 0.29597427251592456, 0.7461717403645257, 0.15565439653073598], "isController": false}, {"data": ["Navigate-19 - Employee", 181, 0, 0.0, 863.6685082872926, 738, 1651, 830.0, 972.6000000000001, 1076.0, 1407.460000000002, 0.2943773918163085, 1.5200943064810193, 0.3671093060052988], "isController": false}, {"data": ["Add A New Employee-53", 177, 0, 0.0, 594.3050847457627, 361, 3492, 418.0, 975.8000000000002, 1295.6999999999994, 3282.18, 0.2927240703530054, 29.362043768553665, 0.15636725242489644], "isController": false}, {"data": ["Login-2", 186, 0, 0.0, 1262.311827956989, 1040, 5842, 1160.0, 1252.1000000000001, 1401.4500000000005, 4548.309999999993, 0.29606425549390203, 29.69211232494803, 0.15670588523212395], "isController": false}, {"data": ["Login-5", 182, 0, 0.0, 731.7637362637362, 394, 3243, 656.0, 896.9000000000015, 1292.3999999999996, 2395.5699999999874, 0.2960764983585649, 29.698129128498014, 0.15815805136927247], "isController": false}, {"data": ["Login-6", 182, 0, 0.0, 444.55494505494505, 363, 2562, 409.0, 481.40000000000003, 533.5999999999999, 1625.759999999986, 0.296193586920612, 0.7338152887155126, 0.19553404761556026], "isController": false}, {"data": ["Navigate-44 - Employee-0", 178, 0, 0.0, 420.0, 349, 1752, 400.0, 470.1, 521.1999999999999, 975.4300000000078, 0.29193680388243143, 0.5718996372931225, 0.18274559696156112], "isController": false}, {"data": ["Login-7", 182, 0, 0.0, 426.89010989011, 361, 1131, 411.0, 486.0, 512.0999999999999, 698.5699999999935, 0.2961955150791184, 0.4199959842723437, 0.17875862140517107], "isController": false}, {"data": ["Navigate-44 - Employee-1", 178, 0, 0.0, 451.0224719101124, 385, 1009, 431.0, 515.0, 581.3999999999999, 898.4000000000011, 0.2919473379487255, 0.9356243306123186, 0.18360750550681568], "isController": false}, {"data": ["Login-8", 182, 0, 0.0, 423.08791208791183, 353, 2862, 401.0, 467.40000000000003, 486.0, 1079.9899999999732, 0.2962056383231506, 0.44517624744075074, 0.1744257811609959], "isController": false}, {"data": ["Login-9", 182, 0, 0.0, 416.6318681318681, 361, 964, 401.0, 467.1, 503.7, 724.1299999999964, 0.2961984073639481, 0.4113223977261076, 0.18107441700178858], "isController": false}, {"data": ["Navigate-42", 178, 0, 0.0, 415.84269662921344, 362, 766, 400.5, 472.29999999999995, 513.3, 723.3400000000004, 0.29187122248129893, 0.9140927836889899, 0.16474762362713943], "isController": false}, {"data": ["Navigate-43", 179, 0, 0.0, 411.212290502793, 361, 747, 402.0, 457.0, 484.0, 602.999999999998, 0.29269074361435465, 0.9166593894250343, 0.16521020489169624], "isController": false}, {"data": ["Navigate-40", 179, 0, 0.0, 416.10055865921805, 356, 923, 401.0, 482.0, 546.0, 745.3999999999975, 0.2926620309436961, 0.4081263478394512, 0.1583347315847731], "isController": false}, {"data": ["Navigate-41", 179, 0, 0.0, 415.67039106145234, 360, 1229, 398.0, 474.0, 539.0, 708.1999999999925, 0.2926687300629647, 0.5959124044739075, 0.1752011050083958], "isController": false}, {"data": ["Navigate-46", 178, 0, 0.0, 575.5168539325844, 368, 3568, 421.5, 851.1999999999998, 1321.35, 2914.6700000000064, 0.292031637854519, 29.292350457858028, 0.15742330478095165], "isController": false}, {"data": ["Navigate-47", 177, 0, 0.0, 444.18079096045204, 347, 2126, 398.0, 475.2000000000001, 560.4999999999993, 2109.62, 0.2926553429441127, 5.061451292519762, 0.1711919437729722], "isController": false}, {"data": ["Navigate-33-1", 180, 0, 0.0, 439.13888888888897, 389, 757, 427.0, 483.30000000000007, 512.95, 705.9699999999998, 0.29299068615163243, 1.0261032320128134, 0.1859804160142198], "isController": false}, {"data": ["Navigate-28", 181, 0, 0.0, 849.9281767955798, 752, 1130, 834.0, 934.6, 977.4000000000001, 1128.3600000000001, 0.2943668591706661, 1.5299329344675945, 0.3722705885019654], "isController": false}, {"data": ["Navigate-26", 181, 0, 0.0, 408.42541436464086, 353, 745, 398.0, 448.2000000000001, 477.9, 567.8800000000015, 0.2945632733303063, 0.7945153915413145, 0.17345864630681124], "isController": false}, {"data": ["Update Employee", 176, 82, 46.59090909090909, 415.5795454545455, 346, 585, 408.0, 457.3, 509.50000000000006, 582.6899999999999, 0.29581820626596744, 0.3045783146135875, 0.26696582018118864], "isController": true}, {"data": ["Add A New Employee-60", 176, 82, 46.59090909090909, 440.5511363636365, 356, 696, 437.5, 506.3, 542.1000000000001, 690.6099999999999, 0.29577644678376724, 0.8961489349947231, 0.18681982445835937], "isController": false}, {"data": ["Add A New Employee-78-1", 176, 0, 0.0, 414.09090909090924, 354, 577, 402.5, 462.6, 495.4000000000001, 565.4499999999998, 0.2958261617900172, 0.7441450109169939, 0.18835806395223753], "isController": false}, {"data": ["Add A New Employee-78-0", 176, 0, 0.0, 402.47159090909065, 350, 729, 386.0, 462.20000000000005, 521.9000000000001, 635.8299999999988, 0.2958346150031853, 0.5919581309975845, 0.1886523472627734], "isController": false}, {"data": ["Login", 181, 0, 0.0, 9328.23204419889, 8138, 17766, 8959.0, 10710.400000000001, 12120.5, 15159.220000000021, 0.29047607584474777, 70.94221484497244, 3.018016399962286], "isController": true}, {"data": ["Add A New Employee-63", 176, 82, 46.59090909090909, 403.88068181818187, 344, 792, 390.0, 448.6, 504.75, 725.7799999999991, 0.2958057766162172, 0.9883357090935065, 0.18221638465675605], "isController": false}, {"data": ["Add A New Employee-64", 176, 82, 46.59090909090909, 408.0909090909091, 342, 667, 398.5, 454.80000000000007, 488.50000000000006, 638.5099999999996, 0.2957819146165003, 0.3024927425243642, 0.18768982665667283], "isController": false}, {"data": ["Add A New Employee-61", 176, 0, 0.0, 512.068181818182, 367, 1386, 421.0, 765.4000000000001, 989.35, 1367.5199999999998, 0.29579533651761497, 29.67006582706729, 0.16436283835793253], "isController": false}, {"data": ["Add A New Employee-62", 176, 0, 0.0, 435.42613636363643, 349, 2719, 399.0, 466.0, 526.7500000000001, 2266.239999999994, 0.2957978221885341, 5.11580022554584, 0.17794087741029008], "isController": false}, {"data": ["Add A New Employee-56", 177, 0, 0.0, 481.3333333333334, 399, 1831, 446.0, 544.2, 636.1999999999999, 1704.6399999999999, 0.29285823014355017, 2.0958523461956555, 0.17073863612861273], "isController": false}, {"data": ["Add A New Employee-54", 177, 0, 0.0, 420.6779661016946, 355, 2542, 394.0, 470.0, 529.4999999999999, 1163.739999999998, 0.29290330054029906, 5.0657396997741175, 0.16990679738372816], "isController": false}, {"data": ["Navigate-31", 181, 0, 0.0, 419.8784530386741, 353, 2168, 396.0, 482.20000000000005, 522.7, 959.32000000001, 0.29463279963016253, 5.095651251416191, 0.17407504275024255], "isController": false}, {"data": ["Navigate-32", 181, 0, 0.0, 429.049723756906, 372, 1162, 414.0, 468.20000000000005, 524.8000000000001, 710.1800000000037, 0.29461985086701253, 0.5888025661429704, 0.18500055088621978], "isController": false}, {"data": ["Navigate", 178, 178, 100.0, 11304.820224719106, 9572, 14841, 11061.5, 12899.0, 13832.949999999999, 14699.590000000002, 0.2872000735748503, 117.68073593657476, 4.262004216839283], "isController": true}, {"data": ["Navigate-30", 181, 0, 0.0, 637.8011049723756, 367, 3296, 672.0, 804.4000000000001, 979.6, 1966.7800000000111, 0.29453834775377896, 29.543794640968333, 0.16050038871739128], "isController": false}, {"data": ["Navigate-35", 180, 0, 0.0, 573.7666666666667, 374, 3215, 453.0, 736.8, 924.599999999999, 1855.819999999996, 0.29301834946019506, 29.391323818240714, 0.15766905327399167], "isController": false}, {"data": ["Navigate-36", 179, 0, 0.0, 422.06145251396634, 354, 2406, 395.0, 454.0, 524.0, 1148.3999999999821, 0.292679736424729, 5.06187317586128, 0.17092039295116007], "isController": false}, {"data": ["Navigate-33", 180, 0, 0.0, 852.7444444444445, 751, 1965, 831.5, 939.8, 976.6999999999999, 1377.7499999999984, 0.2928033809030382, 1.597614801292239, 0.3722949237653864], "isController": false}, {"data": ["Login-17", 181, 0, 0.0, 406.4972375690609, 345, 1150, 393.0, 455.6, 501.1, 808.0600000000029, 0.2945565621831686, 0.43004107467171593, 0.17172877697592936], "isController": false}, {"data": ["Add -51", 177, 0, 0.0, 409.55367231638405, 361, 601, 399.0, 455.20000000000005, 495.99999999999994, 581.5, 0.29256827006200137, 0.7891343378039528, 0.1722838543431512], "isController": false}, {"data": ["Login-18", 182, 0, 0.0, 403.86263736263714, 352, 809, 392.0, 458.70000000000005, 489.0, 642.1699999999975, 0.29620081764445483, 0.43244162341646486, 0.17297664936658594], "isController": false}, {"data": ["Login-15", 181, 181, 100.0, 398.1436464088397, 343, 681, 384.0, 451.0, 495.9, 664.6000000000001, 0.294561835201604, 0.11420024274905936, 0.16799229663841478], "isController": false}, {"data": ["Login-16", 181, 0, 0.0, 401.04972375690625, 342, 759, 392.0, 451.20000000000005, 498.6000000000001, 598.2800000000013, 0.29455512411999624, 0.43003897515565853, 0.1720155900622634], "isController": false}, {"data": ["Add -50", 177, 0, 0.0, 487.9322033898303, 413, 933, 474.0, 549.6, 568.4, 883.0799999999999, 0.2926224426534408, 4.067409653337466, 0.2020352216367018], "isController": false}, {"data": ["Add A New Employee-70", 176, 0, 0.0, 412.38068181818164, 360, 627, 401.0, 472.3, 494.55000000000007, 621.6099999999999, 0.29579633078096956, 0.9263855789204778, 0.17216270814986118], "isController": false}, {"data": ["Login-10", 182, 0, 0.0, 431.16483516483515, 356, 1156, 408.5, 488.0, 542.0999999999999, 956.799999999997, 0.29619214081820633, 0.4385572442169298, 0.17673183402336337], "isController": false}, {"data": ["Add A New Employee-71", 176, 0, 0.0, 414.6477272727273, 355, 618, 402.0, 472.3, 512.4000000000001, 581.0399999999995, 0.29577346441475505, 0.9263139652130074, 0.17214939921015043], "isController": false}, {"data": ["Login-13", 182, 0, 0.0, 445.5109890109892, 349, 2329, 399.0, 560.0000000000002, 691.4, 1336.3199999999852, 0.2962201013007643, 5.123103509801305, 0.172698633277887], "isController": false}, {"data": ["Login-14", 182, 0, 0.0, 428.10439560439556, 351, 1646, 405.5, 476.9000000000001, 529.8999999999999, 1068.3199999999913, 0.2962090128916021, 0.9517348418699577, 0.17124583557795747], "isController": false}, {"data": ["Login-11", 182, 0, 0.0, 430.7582417582416, 356, 2361, 400.5, 473.80000000000024, 579.9499999999995, 1397.3699999999856, 0.29620371003284285, 0.43712806701039314, 0.17731726000989514], "isController": false}, {"data": ["Add A New Employee-72", 176, 0, 0.0, 477.869318181818, 397, 3186, 452.0, 514.1000000000001, 577.35, 1277.1699999999746, 0.2957436440321957, 2.122736500394885, 0.16086836887298145], "isController": false}, {"data": ["Login-12", 182, 0, 0.0, 404.43956043956047, 341, 1361, 387.0, 454.70000000000005, 481.54999999999995, 766.719999999991, 0.29621431594023634, 0.4153942946193158, 0.18629103463428925], "isController": false}, {"data": ["Add A New Employee-67", 176, 0, 0.0, 411.3749999999999, 356, 719, 397.0, 462.0, 494.90000000000003, 692.0499999999996, 0.2957933480109578, 0.412493067343406, 0.16522831549049596], "isController": false}, {"data": ["Add A New Employee-68", 176, 82, 46.59090909090909, 408.630681818182, 348, 667, 400.0, 456.6, 484.15, 596.929999999999, 0.2957988164685991, 0.29829685112916154, 0.19145581021984912], "isController": false}, {"data": ["Add A New Employee-65", 176, 82, 46.59090909090909, 415.6079545454548, 347, 858, 400.0, 463.3, 524.6500000000001, 854.92, 0.29579285088847096, 0.2781280645441849, 0.1648768100505705], "isController": false}, {"data": ["Add A New Employee-66", 176, 0, 0.0, 409.94318181818187, 358, 841, 398.0, 454.6, 479.6, 628.4799999999972, 0.2958032908116103, 0.41250693288962836, 0.16523386947679794], "isController": false}, {"data": ["Add A New Employee-57 - EmployeeId", 177, 0, 0.0, 407.050847457627, 354, 543, 398.0, 457.6, 482.19999999999993, 539.88, 0.2929173575875525, 0.4002919451036464, 0.17163126421145655], "isController": false}, {"data": ["Add A New Employee-69", 176, 82, 46.59090909090909, 411.5113636363636, 353, 741, 400.5, 470.6, 506.1000000000001, 588.5399999999979, 0.2957809204500576, 0.2668074409488518, 0.19606580390229147], "isController": false}, {"data": ["Logout", 176, 0, 0.0, 817.0170454545453, 711, 1172, 795.5, 903.1000000000001, 962.8000000000001, 1118.0999999999992, 0.2956333608809874, 1.3352154501605826, 0.37675931245086774], "isController": true}, {"data": ["Navigate-21", 181, 0, 0.0, 784.685082872928, 377, 2805, 697.0, 1230.4, 1356.6000000000001, 1930.0600000000072, 0.2944516204599953, 29.53516055849013, 0.1587278266542162], "isController": false}, {"data": ["Navigate-24", 181, 0, 0.0, 421.9171270718232, 352, 715, 407.0, 478.8, 538.8000000000001, 711.72, 0.29457621712057447, 1.8785893211849125, 0.17634298935050013], "isController": false}, {"data": ["Navigate-25", 181, 0, 0.0, 486.07182320441996, 403, 1041, 467.0, 555.0, 591.7, 1015.5800000000002, 0.2945345134241021, 4.083101969658877, 0.20335537206136733], "isController": false}, {"data": ["Navigate-22", 181, 0, 0.0, 422.8508287292818, 351, 2239, 395.0, 458.80000000000007, 505.1, 1277.960000000008, 0.29455416541901547, 5.0942912788777, 0.17230268074803737], "isController": false}, {"data": ["Navigate-23", 181, 0, 0.0, 407.93370165745836, 346, 755, 395.0, 451.20000000000005, 491.6000000000001, 753.36, 0.2945651908570871, 0.4639977078637514, 0.17892534054014467], "isController": false}, {"data": ["Navigate-33-0", 180, 0, 0.0, 413.4333333333332, 359, 1270, 398.5, 465.6, 511.5999999999997, 744.3099999999986, 0.29299450146985573, 0.5725410131261537, 0.18655509273275972], "isController": false}, {"data": ["Navigate-44 - Employee", 178, 0, 0.0, 871.2191011235952, 746, 2459, 834.0, 963.3999999999999, 1042.3999999999987, 1921.0100000000054, 0.29175066791234366, 1.5065290480405173, 0.3661128986985953], "isController": false}, {"data": ["Add A New Employee", 176, 84, 47.72727272727273, 12403.488636363638, 10776, 18308, 11949.5, 14182.1, 15664.85, 18013.859999999997, 0.29001077653680996, 123.21153155350204, 4.87459608584319], "isController": true}, {"data": ["Add A New Employee-78", 176, 0, 0.0, 817.0170454545453, 711, 1172, 795.5, 903.1000000000001, 962.8000000000001, 1118.0999999999992, 0.29563385746752646, 1.3352176929724808, 0.3767599453077364], "isController": false}, {"data": ["Add A New Employee-76", 176, 0, 0.0, 424.0568181818179, 357, 1560, 405.0, 489.90000000000003, 509.05000000000007, 869.3099999999909, 0.29576054151066417, 0.9262734927975586, 0.1764743074834139], "isController": false}, {"data": ["Add A New Employee-77", 176, 82, 46.59090909090909, 415.5795454545455, 346, 585, 408.0, 457.3, 509.50000000000006, 582.6899999999999, 0.2958187034736847, 0.30457882654519053, 0.26696626889415914], "isController": false}, {"data": ["Debug Sampler", 176, 0, 0.0, 0.35227272727272724, 0, 3, 0.0, 1.0, 1.0, 1.4599999999999795, 0.2960281765000723, 0.1817374241638045, 0.0], "isController": false}, {"data": ["Add A New Employee-59 - Add new employee", 177, 84, 47.45762711864407, 427.5141242937853, 363, 827, 415.0, 474.20000000000005, 504.59999999999997, 724.8199999999998, 0.2929163880927006, 0.29074272249647504, 0.20710588834341714], "isController": false}, {"data": ["Navigate-28-1", 181, 0, 0.0, 438.75138121546985, 377, 652, 428.0, 487.40000000000003, 513.9, 643.8000000000001, 0.2945546447687258, 0.9452514480574854, 0.18726081420355517], "isController": false}, {"data": ["Add -48", 178, 0, 0.0, 417.4550561797753, 356, 1188, 395.5, 460.4, 523.7499999999998, 837.2400000000035, 0.2920829121650892, 0.4600876341037977, 0.17741755016277877], "isController": false}, {"data": ["Add -49", 177, 0, 0.0, 429.4011299435028, 366, 1802, 404.0, 464.8000000000002, 518.1999999999998, 1076.599999999999, 0.29259051709174944, 1.8652936040456838, 0.17515428415746329], "isController": false}, {"data": ["Navigate-28-0", 181, 0, 0.0, 410.9668508287295, 360, 661, 400.0, 458.0, 477.70000000000005, 556.8600000000008, 0.29455991771851137, 0.585667961401259, 0.18525057325265754], "isController": false}, {"data": ["Navigate-19 - Employee-0", 181, 0, 0.0, 419.62430939226533, 353, 925, 401.0, 485.20000000000005, 544.3000000000001, 742.9600000000015, 0.2945685465890264, 0.5770551801343623, 0.18324234782930648], "isController": false}, {"data": ["Navigate-19 - Employee-1", 181, 0, 0.0, 443.88397790055257, 383, 900, 430.0, 496.8, 550.8, 757.3200000000012, 0.2945656702426831, 0.9440169857387901, 0.18410354390167688], "isController": false}, {"data": ["Login-3 - Token-1", 186, 0, 0.0, 444.2634408602149, 383, 764, 432.0, 489.6, 547.1500000000002, 744.8599999999999, 0.29643134904950724, 0.9048374563122346, 0.21132312969349634], "isController": false}, {"data": ["Login-3 - Token-0", 186, 0, 0.0, 761.2258064516128, 676, 1606, 726.5, 849.8000000000001, 909.9000000000001, 1563.37, 0.2962844968340568, 0.6000918422205408, 0.2629481352793597], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 181, 21.573301549463647, 1.2617636807249912], "isController": false}, {"data": ["422/Unprocessable Content", 82, 9.773539928486294, 0.5716277448588358], "isController": false}, {"data": ["500/Internal Server Error", 164, 19.547079856972587, 1.1432554897176717], "isController": false}, {"data": ["404/Not Found", 410, 48.86769964243147, 2.858138724294179], "isController": false}, {"data": ["Assertion failed", 2, 0.23837902264600716, 0.013942140118508192], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 14345, 839, "404/Not Found", 410, "400/Bad Request", 181, "500/Internal Server Error", 164, "422/Unprocessable Content", 82, "Assertion failed", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add A New Employee-60", 176, 82, "500/Internal Server Error", 82, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add A New Employee-63", 176, 82, "500/Internal Server Error", 82, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add A New Employee-64", 176, 82, "404/Not Found", 82, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-15", 181, 181, "400/Bad Request", 181, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add A New Employee-68", 176, 82, "404/Not Found", 82, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add A New Employee-65", 176, 82, "404/Not Found", 82, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add A New Employee-69", 176, 82, "404/Not Found", 82, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add A New Employee-77", 176, 82, "404/Not Found", 82, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Add A New Employee-59 - Add new employee", 177, 84, "422/Unprocessable Content", 82, "Assertion failed", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 89.20238741182854, "KoPercent": 10.797612588171459};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.47663609320773426, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6197183098591549, 500, 1500, "Employee-46"], "isController": false}, {"data": [0.072992700729927, 500, 1500, "Add A New Employee-57 - Add Details"], "isController": false}, {"data": [0.6730769230769231, 500, 1500, "Login-27"], "isController": false}, {"data": [0.45209580838323354, 500, 1500, "-1"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "-3"], "isController": false}, {"data": [0.678125, 500, 1500, "Login-20"], "isController": false}, {"data": [0.6582278481012658, 500, 1500, "Login-21"], "isController": false}, {"data": [0.6212121212121212, 500, 1500, "Add A New Employee-60"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [0.3096774193548387, 500, 1500, "View Dashboard-33 - PIM"], "isController": false}, {"data": [0.6012658227848101, 500, 1500, "Login-24"], "isController": false}, {"data": [0.6127819548872181, 500, 1500, "Add A New Employee-63"], "isController": false}, {"data": [0.6708860759493671, 500, 1500, "Login-25"], "isController": false}, {"data": [0.6491935483870968, 500, 1500, "Add A New Employee-64"], "isController": false}, {"data": [0.680379746835443, 500, 1500, "Login-22"], "isController": false}, {"data": [0.07894736842105263, 500, 1500, "Add A New Employee-61"], "isController": false}, {"data": [0.6891025641025641, 500, 1500, "Login-23"], "isController": false}, {"data": [0.08461538461538462, 500, 1500, "Add A New Employee-62"], "isController": false}, {"data": [0.6416666666666667, 500, 1500, "Add A New Employee-72-1"], "isController": false}, {"data": [0.07720588235294118, 500, 1500, "Add A New Employee-58"], "isController": false}, {"data": [0.30223880597014924, 500, 1500, "Add A New Employee-59"], "isController": false}, {"data": [0.3096774193548387, 500, 1500, "PIM Sidebar Menu"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "Login-17"], "isController": false}, {"data": [0.6188811188811189, 500, 1500, "Employee List-41"], "isController": false}, {"data": [0.64375, 500, 1500, "Login-18"], "isController": false}, {"data": [0.66875, 500, 1500, "Login-15"], "isController": false}, {"data": [0.65527950310559, 500, 1500, "Login-16"], "isController": false}, {"data": [0.7077922077922078, 500, 1500, "Employee List-40"], "isController": false}, {"data": [0.6761006289308176, 500, 1500, "Login-19"], "isController": false}, {"data": [0.36971830985915494, 500, 1500, "Employee Li-42"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "Add A New Employee-70"], "isController": false}, {"data": [0.6291666666666667, 500, 1500, "Add A New Employee-71"], "isController": false}, {"data": [0.33641975308641975, 500, 1500, "Login-13"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "Add A New Employee-74"], "isController": false}, {"data": [0.35833333333333334, 500, 1500, "Add A New Employee-72"], "isController": false}, {"data": [0.656934306569343, 500, 1500, "Add A New Employee-55 - EmployeeId"], "isController": false}, {"data": [0.6870967741935484, 500, 1500, "View Dashboard-33 - PIM-0"], "isController": false}, {"data": [0.08196721311475409, 500, 1500, "Add A New Employee-67"], "isController": false}, {"data": [0.6583333333333333, 500, 1500, "Add A New Employee-72-0"], "isController": false}, {"data": [0.6516129032258065, 500, 1500, "View Dashboard-33 - PIM-1"], "isController": false}, {"data": [0.075, 500, 1500, "Add A New Employee-68"], "isController": false}, {"data": [0.078125, 500, 1500, "Add A New Employee-65"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "Employee -35"], "isController": false}, {"data": [0.6375, 500, 1500, "Add A New Employee-69"], "isController": false}, {"data": [0.025, 500, 1500, "Logout"], "isController": true}, {"data": [0.6677631578947368, 500, 1500, "Employee List-38"], "isController": false}, {"data": [0.6946308724832215, 500, 1500, "Employee List-39"], "isController": false}, {"data": [0.6758620689655173, 500, 1500, "Employee List-36"], "isController": false}, {"data": [0.5570469798657718, 500, 1500, "Employee List-37"], "isController": false}, {"data": [0.6189024390243902, 500, 1500, "Login-7 - Token-1"], "isController": false}, {"data": [0.2804878048780488, 500, 1500, "Login-7 - Token-0"], "isController": false}, {"data": [0.6349693251533742, 500, 1500, "Login-10 - Dashboard"], "isController": false}, {"data": [0.15853658536585366, 500, 1500, "Login-7 - Token"], "isController": false}, {"data": [0.0, 500, 1500, "Add A New Employee"], "isController": true}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "Employee List"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7372, 796, 10.797612588171459, 852.6119099294655, 0, 4851, 753.0, 1447.6999999999998, 1671.0, 2518.0699999999806, 41.46931428249986, 691.8296101968133, 34.893643296112955], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Employee-46", 142, 0, 0.0, 759.6901408450706, 397, 1628, 704.0, 1160.400000000001, 1359.6999999999998, 1595.3199999999995, 0.8713527444543306, 6.163330939542233, 0.6552164191697604], "isController": false}, {"data": ["Add A New Employee-57 - Add Details", 137, 121, 88.32116788321167, 704.2700729927012, 367, 1384, 727.0, 989.6000000000001, 1070.9999999999998, 1335.7400000000007, 0.8550369163748932, 0.48519419908941686, 0.7499187188332803], "isController": false}, {"data": ["Login-27", 156, 0, 0.0, 744.8653846153848, 346, 1520, 741.5, 1178.4, 1260.45, 1455.020000000001, 0.9405636146583223, 18.35660531147126, 0.6861338087400065], "isController": false}, {"data": ["-1", 167, 0, 0.0, 1185.6646706586823, 898, 1774, 1122.0, 1501.6000000000004, 1612.1999999999998, 1758.36, 0.9954519172880791, 2.5322413538742152, 0.8498549665301646], "isController": false}, {"data": ["-3", 165, 0, 0.0, 1409.9151515151511, 1133, 2065, 1380.0, 1670.4, 1732.1, 1982.5000000000005, 0.9860400631065641, 98.8878546569477, 0.7135309441034804], "isController": false}, {"data": ["Login-20", 160, 0, 0.0, 635.1500000000003, 358, 1354, 601.0, 937.9000000000001, 1012.6999999999999, 1252.1299999999978, 0.9645178013816718, 1.3393987437155637, 0.7525876204140193], "isController": false}, {"data": ["Login-21", 158, 0, 0.0, 662.0126582278482, 373, 1464, 609.0, 1023.3, 1128.1999999999998, 1348.9499999999994, 0.9521054788246921, 1.5639076322100898, 0.7289557572251548], "isController": false}, {"data": ["Add A New Employee-60", 132, 0, 0.0, 823.7803030303031, 342, 1665, 890.5, 1183.6000000000001, 1245.1499999999999, 1582.4999999999968, 0.8396252218328001, 14.521252615877822, 0.6305388628802961], "isController": false}, {"data": ["Login", 156, 0, 0.0, 14950.512820512822, 8609, 21725, 15600.0, 19414.2, 20223.8, 21566.54, 0.885679247853931, 282.5098019960428, 12.753345381906595], "isController": true}, {"data": ["View Dashboard-33 - PIM", 155, 0, 0.0, 1365.4967741935484, 752, 2491, 1338.0, 2023.0, 2159.0, 2382.9199999999996, 0.9326169230861798, 4.817002838088676, 1.5765233338497824], "isController": false}, {"data": ["Login-24", 158, 0, 0.0, 846.2215189873415, 358, 1439, 869.5, 1191.1, 1300.6999999999998, 1400.6499999999999, 0.9525761759492603, 31.95316315203236, 0.6958271285254362], "isController": false}, {"data": ["Add A New Employee-63", 133, 0, 0.0, 685.9097744360905, 352, 1278, 646.0, 956.8000000000001, 1036.3999999999999, 1233.4599999999996, 0.8418947061914076, 1.1740484769934865, 0.6125112852662096], "isController": false}, {"data": ["Login-25", 158, 0, 0.0, 800.7848101265821, 356, 1451, 850.0, 1223.7, 1300.3999999999999, 1439.79, 0.9527255185721177, 21.64926119490171, 0.6959362186444766], "isController": false}, {"data": ["Add A New Employee-64", 124, 0, 0.0, 699.4919354838712, 362, 1365, 673.0, 995.5, 1070.25, 1360.0, 0.7950807584044525, 2.4900624923858192, 0.5970870148564686], "isController": false}, {"data": ["Login-22", 158, 0, 0.0, 644.0379746835443, 351, 1229, 613.0, 972.3, 1014.3499999999999, 1139.9099999999994, 0.952225978894333, 1.4646053874595455, 0.7309078314560018], "isController": false}, {"data": ["Add A New Employee-61", 133, 117, 87.96992481203007, 637.593984962406, 360, 1197, 609.0, 910.6, 941.5, 1139.5399999999995, 0.8420759387880438, 0.8280219663897734, 0.645598560477514], "isController": false}, {"data": ["Login-23", 156, 0, 0.0, 640.0256410256411, 343, 1491, 581.0, 940.7, 1273.4, 1467.0600000000004, 0.9405636146583223, 16.266974233983287, 0.6861338087400065], "isController": false}, {"data": ["Add A New Employee-62", 130, 114, 87.6923076923077, 665.2923076923078, 357, 1257, 663.0, 944.5, 977.2499999999998, 1193.4499999999996, 0.8269720101781171, 0.39120894958651403, 0.6041020594783716], "isController": false}, {"data": ["Add A New Employee-72-1", 120, 0, 0.0, 678.9999999999998, 366, 1402, 639.5, 991.5, 1158.3999999999996, 1380.5799999999992, 0.8470927072377012, 2.1317534686681583, 0.7271430563104877], "isController": false}, {"data": ["Add A New Employee-58", 136, 119, 87.5, 684.2426470588235, 352, 1645, 646.5, 1022.4999999999999, 1089.75, 1525.4899999999984, 0.8506858654790425, 0.7962107926077899, 0.7293966698150384], "isController": false}, {"data": ["Add A New Employee-59", 134, 0, 0.0, 1434.6417910447767, 758, 1846, 1431.5, 1720.0, 1778.5, 1842.5, 0.8445733013992185, 84.71376242830581, 0.6334299760494139], "isController": false}, {"data": ["PIM Sidebar Menu", 155, 0, 0.0, 1365.4967741935484, 752, 2491, 1338.0, 2023.0, 2159.0, 2382.9199999999996, 0.9326169230861798, 4.817002838088676, 1.5765233338497824], "isController": true}, {"data": ["Login-17", 161, 0, 0.0, 579.726708074534, 340, 1474, 532.0, 834.4000000000001, 900.3000000000001, 1281.7999999999986, 0.9681997498316175, 1.3577488679279321, 0.7724796832152651], "isController": false}, {"data": ["Employee List-41", 143, 0, 0.0, 737.9090909090911, 380, 1729, 690.0, 1158.4, 1219.8, 1617.2400000000007, 0.8771768400777805, 2.8273066722180307, 0.7426878128392926], "isController": false}, {"data": ["Login-18", 160, 0, 0.0, 665.2375000000001, 372, 1381, 625.5, 1008.7, 1086.8499999999997, 1300.4799999999982, 0.9631069831275695, 1.4510325936471056, 0.743962523099519], "isController": false}, {"data": ["Login-15", 160, 0, 0.0, 638.5125000000002, 363, 1291, 600.0, 946.2, 1015.6499999999999, 1239.1499999999987, 0.9623076136575508, 3.058897736772781, 0.7189114496562757], "isController": false}, {"data": ["Login-16", 161, 0, 0.0, 669.7888198757763, 373, 1634, 609.0, 1034.2000000000003, 1126.4, 1571.9999999999995, 0.9676469350835121, 2.391713274117548, 0.8022775858260759], "isController": false}, {"data": ["Employee List-40", 154, 0, 0.0, 639.9805194805198, 350, 1344, 577.5, 1007.0, 1083.5, 1337.3999999999999, 0.9295363183118655, 2.507206358571653, 0.7044142412207105], "isController": false}, {"data": ["Login-19", 159, 0, 0.0, 639.3962264150942, 348, 1217, 586.0, 950.0, 1012.0, 1211.0, 0.958397126014153, 1.4404034931013492, 0.7262853220576003], "isController": false}, {"data": ["Employee Li-42", 142, 0, 0.0, 1257.8450704225356, 377, 2164, 1409.5, 1717.8000000000002, 1863.6499999999999, 2098.639999999999, 0.8715452743219438, 87.418386133684, 0.6349343502384475], "isController": false}, {"data": ["Add A New Employee-70", 120, 0, 0.0, 861.525, 415, 1976, 837.5, 1296.7, 1403.6999999999998, 1940.0899999999986, 0.8486562942008486, 6.003131353871994, 0.6049991159830268], "isController": false}, {"data": ["Add A New Employee-71", 120, 0, 0.0, 701.4166666666669, 370, 1674, 682.0, 1023.7, 1070.6499999999999, 1580.5499999999965, 0.8487523340689187, 2.6581530618740454, 0.6373931102529282], "isController": false}, {"data": ["Login-13", 162, 0, 0.0, 1280.685185185185, 624, 2068, 1376.5, 1702.8000000000004, 1803.9499999999998, 2038.3900000000003, 0.9720622119815668, 97.50118929486487, 0.7081625099006336], "isController": false}, {"data": ["Add A New Employee-74", 120, 0, 0.0, 1392.4250000000002, 392, 2045, 1406.0, 1753.8000000000002, 1867.9999999999998, 2030.7199999999993, 0.8438225159974685, 84.63671682722733, 0.6106176605020743], "isController": false}, {"data": ["Add A New Employee-72", 120, 0, 0.0, 1308.3749999999998, 705, 2427, 1276.0, 1866.9, 2099.199999999999, 2396.759999999999, 0.8447729672650475, 3.816286628827877, 1.4511285638859555], "isController": false}, {"data": ["Add A New Employee-55 - EmployeeId", 137, 0, 0.0, 640.8613138686131, 356, 1257, 588.0, 973.0, 1042.3999999999999, 1242.1800000000003, 0.8551543335101901, 1.1689917312974, 0.6455413084017352], "isController": false}, {"data": ["View Dashboard-33 - PIM-0", 155, 0, 0.0, 648.7161290322582, 360, 1634, 623.0, 959.8, 1062.7999999999997, 1403.279999999999, 0.9348048971714613, 1.8312681872323744, 0.7887416319884205], "isController": false}, {"data": ["Add A New Employee-67", 122, 107, 87.70491803278688, 658.8114754098359, 352, 1258, 625.5, 960.6, 1041.1499999999999, 1223.0399999999995, 0.7823220858502302, 0.38216228494158233, 0.6417736347838354], "isController": false}, {"data": ["Add A New Employee-72-0", 120, 0, 0.0, 628.9666666666666, 339, 1412, 588.5, 873.4000000000001, 981.95, 1388.059999999999, 0.8481104805252632, 1.6970491939416639, 0.7288449442013979], "isController": false}, {"data": ["View Dashboard-33 - PIM-1", 155, 0, 0.0, 716.5032258064514, 380, 1467, 663.0, 1104.8, 1197.6, 1423.3199999999997, 0.9349909818611749, 2.9976322201662478, 0.7916378723375378], "isController": false}, {"data": ["Add A New Employee-68", 120, 106, 88.33333333333333, 665.8999999999996, 364, 1332, 646.5, 952.6000000000001, 1113.099999999999, 1314.5699999999993, 0.8489985354775262, 0.3882537736216155, 0.7098202599350517], "isController": false}, {"data": ["Add A New Employee-65", 128, 112, 87.5, 670.3749999999999, 362, 1262, 670.0, 916.2, 985.55, 1238.5099999999995, 0.8177450679750587, 0.40440548176684044, 0.6604249718900134], "isController": false}, {"data": ["Employee -35", 154, 0, 0.0, 1273.9285714285722, 364, 2096, 1410.5, 1797.0, 1849.0, 2063.5499999999993, 0.9289307644979552, 93.17466094404097, 0.6812763712284807], "isController": false}, {"data": ["Add A New Employee-69", 120, 0, 0.0, 712.1833333333334, 365, 1540, 650.0, 1058.4, 1208.5499999999995, 1504.5099999999986, 0.8486202848535422, 1.1834275066121664, 0.6174044064608291], "isController": false}, {"data": ["Logout", 120, 0, 0.0, 2700.8000000000006, 1259, 4150, 2742.0, 3597.6, 3882.3999999999996, 4125.219999999999, 0.8389965601141035, 87.94285745186258, 2.048331445591073], "isController": true}, {"data": ["Employee List-38", 152, 0, 0.0, 680.5723684210528, 358, 1335, 609.0, 1054.4, 1154.05, 1325.46, 0.9204311493278431, 5.590793701556255, 0.7065028157926608], "isController": false}, {"data": ["Employee List-39", 149, 0, 0.0, 663.2818791946308, 346, 1471, 582.0, 1047.0, 1132.5, 1428.5, 0.906850065427102, 1.4284659722010893, 0.7040486347798302], "isController": false}, {"data": ["Employee List-36", 145, 0, 0.0, 773.1310344827588, 346, 1650, 836.0, 1156.0, 1203.1, 1617.7999999999995, 0.8897616052526617, 15.388357450219372, 0.6534186788574233], "isController": false}, {"data": ["Employee List-37", 149, 0, 0.0, 985.7852348993289, 395, 2026, 972.0, 1579.0, 1655.5, 2008.5, 0.9064583637513992, 12.86074043846121, 0.7789876563488587], "isController": false}, {"data": ["Login-7 - Token-1", 164, 0, 0.0, 721.1341463414634, 368, 1479, 672.5, 1175.0, 1283.0, 1430.8999999999996, 0.9849258302804638, 3.005755097291454, 0.9454903234039999], "isController": false}, {"data": ["Login-7 - Token-0", 164, 0, 0.0, 1526.0853658536578, 665, 3688, 1375.5, 2668.5, 3050.0, 3611.9499999999994, 0.9829659198523153, 1.9908899587633808, 1.1154300831774973], "isController": false}, {"data": ["Login-10 - Dashboard", 163, 0, 0.0, 708.374233128834, 378, 1443, 673.0, 1061.2, 1107.7999999999997, 1423.7999999999995, 0.9795673076923076, 2.9894021841195912, 0.8446854811448317], "isController": false}, {"data": ["Login-7 - Token", 164, 0, 0.0, 2247.6402439024396, 1034, 4851, 2074.0, 3690.0, 4056.5, 4737.249999999999, 0.9801870722887966, 4.9765552625287635, 2.0532180598720977], "isController": false}, {"data": ["Add A New Employee", 120, 106, 88.33333333333333, 14243.125, 7994, 19184, 15544.0, 17700.6, 18566.0, 19181.48, 0.8094871898652204, 202.36764067580376, 11.29166118576382], "isController": true}, {"data": ["Debug Sampler", 117, 0, 0.0, 0.23931623931623935, 0, 4, 0.0, 1.0, 1.0, 3.4599999999999795, 0.8253735344328907, 0.7685726130303202, 0.0], "isController": false}, {"data": ["Employee List", 145, 0, 0.0, 5091.275862068965, 2238, 8077, 5279.0, 7307.0, 7463.5, 7942.2199999999975, 0.8788624489350612, 124.91481876681962, 4.068171882765811], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["422/Unprocessable Content", 120, 15.075376884422111, 1.6277807921866523], "isController": false}, {"data": ["500/Internal Server Error", 236, 29.64824120603015, 3.2013022246337495], "isController": false}, {"data": ["404/Not Found", 439, 55.15075376884422, 5.954964731416169], "isController": false}, {"data": ["Assertion failed", 1, 0.12562814070351758, 0.013564839934888768], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7372, 796, "404/Not Found", 439, "500/Internal Server Error", 236, "422/Unprocessable Content", 120, "Assertion failed", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Add A New Employee-57 - Add Details", 137, 121, "422/Unprocessable Content", 120, "Assertion failed", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add A New Employee-61", 133, 117, "500/Internal Server Error", 117, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Add A New Employee-62", 130, 114, "404/Not Found", 114, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Add A New Employee-58", 136, 119, "500/Internal Server Error", 119, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add A New Employee-67", 122, 107, "404/Not Found", 107, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add A New Employee-68", 120, 106, "404/Not Found", 106, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add A New Employee-65", 128, 112, "404/Not Found", 112, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

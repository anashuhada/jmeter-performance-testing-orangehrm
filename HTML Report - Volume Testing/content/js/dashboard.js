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

    var data = {"OkPercent": 86.70345689296127, "KoPercent": 13.296543107038733};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.04378720952563856, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0025, 500, 1500, "Employee-46"], "isController": false}, {"data": [0.0025, 500, 1500, "Add A New Employee-57 - Add Details"], "isController": false}, {"data": [0.015, 500, 1500, "Login-27"], "isController": false}, {"data": [0.09195402298850575, 500, 1500, "-1"], "isController": false}, {"data": [0.07936507936507936, 500, 1500, "-3"], "isController": false}, {"data": [0.04, 500, 1500, "Login-20"], "isController": false}, {"data": [0.015, 500, 1500, "Login-21"], "isController": false}, {"data": [0.05670103092783505, 500, 1500, "Add A New Employee-60"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [0.0, 500, 1500, "View Dashboard-33 - PIM"], "isController": false}, {"data": [0.005, 500, 1500, "Login-24"], "isController": false}, {"data": [0.05808080808080808, 500, 1500, "Add A New Employee-63"], "isController": false}, {"data": [0.005, 500, 1500, "Login-25"], "isController": false}, {"data": [0.11813186813186813, 500, 1500, "Add A New Employee-64"], "isController": false}, {"data": [0.0125, 500, 1500, "Login-22"], "isController": false}, {"data": [0.005050505050505051, 500, 1500, "Add A New Employee-61"], "isController": false}, {"data": [0.0075, 500, 1500, "Login-23"], "isController": false}, {"data": [0.005235602094240838, 500, 1500, "Add A New Employee-62"], "isController": false}, {"data": [0.22018348623853212, 500, 1500, "Add A New Employee-72-1"], "isController": false}, {"data": [0.0025, 500, 1500, "Add A New Employee-58"], "isController": false}, {"data": [0.0075, 500, 1500, "Add A New Employee-59"], "isController": false}, {"data": [0.0, 500, 1500, "PIM Sidebar Menu"], "isController": true}, {"data": [0.0875, 500, 1500, "Login-17"], "isController": false}, {"data": [0.005, 500, 1500, "Employee List-41"], "isController": false}, {"data": [0.0525, 500, 1500, "Login-18"], "isController": false}, {"data": [0.065, 500, 1500, "Login-15"], "isController": false}, {"data": [0.10396039603960396, 500, 1500, "Login-16"], "isController": false}, {"data": [0.005, 500, 1500, "Employee List-40"], "isController": false}, {"data": [0.0375, 500, 1500, "Login-19"], "isController": false}, {"data": [0.0, 500, 1500, "Employee Li-42"], "isController": false}, {"data": [0.14144736842105263, 500, 1500, "Add A New Employee-70"], "isController": false}, {"data": [0.17777777777777778, 500, 1500, "Add A New Employee-71"], "isController": false}, {"data": [0.01201923076923077, 500, 1500, "Login-13"], "isController": false}, {"data": [0.09195402298850575, 500, 1500, "Add A New Employee-74"], "isController": false}, {"data": [0.09174311926605505, 500, 1500, "Add A New Employee-72"], "isController": false}, {"data": [0.0175, 500, 1500, "Add A New Employee-55 - EmployeeId"], "isController": false}, {"data": [0.0025, 500, 1500, "View Dashboard-33 - PIM-0"], "isController": false}, {"data": [0.008571428571428572, 500, 1500, "Add A New Employee-67"], "isController": false}, {"data": [0.22477064220183487, 500, 1500, "Add A New Employee-72-0"], "isController": false}, {"data": [0.0, 500, 1500, "View Dashboard-33 - PIM-1"], "isController": false}, {"data": [0.009202453987730062, 500, 1500, "Add A New Employee-68"], "isController": false}, {"data": [0.008021390374331552, 500, 1500, "Add A New Employee-65"], "isController": false}, {"data": [0.0, 500, 1500, "Employee -35"], "isController": false}, {"data": [0.21138211382113822, 500, 1500, "Add A New Employee-69"], "isController": false}, {"data": [0.011494252873563218, 500, 1500, "Logout"], "isController": true}, {"data": [0.0025, 500, 1500, "Employee List-38"], "isController": false}, {"data": [0.0075, 500, 1500, "Employee List-39"], "isController": false}, {"data": [0.005, 500, 1500, "Employee List-36"], "isController": false}, {"data": [0.0025, 500, 1500, "Employee List-37"], "isController": false}, {"data": [0.10775862068965517, 500, 1500, "Login-7 - Token-1"], "isController": false}, {"data": [0.036637931034482756, 500, 1500, "Login-7 - Token-0"], "isController": false}, {"data": [0.08254716981132075, 500, 1500, "Login-10 - Dashboard"], "isController": false}, {"data": [0.02586206896551724, 500, 1500, "Login-7 - Token"], "isController": false}, {"data": [0.0, 500, 1500, "Add A New Employee"], "isController": true}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "Employee List"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9604, 1277, 13.296543107038733, 3755.8998334027447, 0, 30226, 3578.0, 5280.5, 8078.0, 14325.400000000038, 48.54476895237517, 730.8821149595882, 41.13136837336609], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Employee-46", 200, 0, 0.0, 4119.659999999999, 1270, 7694, 4222.0, 5153.1, 5489.799999999999, 6146.79, 1.674873547047198, 8.58747249543597, 1.2594263976819748], "isController": false}, {"data": ["Add A New Employee-57 - Add Details", 200, 199, 99.5, 3444.564999999999, 546, 5700, 3525.0, 4660.3, 4881.499999999999, 5587.200000000004, 1.755294406754373, 0.825751170013428, 1.5396537462370876], "isController": false}, {"data": ["Login-27", 200, 0, 0.0, 3364.494999999999, 423, 4732, 3468.0, 4358.2, 4464.25, 4719.84, 1.911808283865294, 2.791165414432241, 1.3946492070775143], "isController": false}, {"data": ["-1", 261, 0, 0.0, 2859.1954022988502, 931, 6881, 2715.0, 4550.8, 4885.999999999999, 6342.3399999999965, 1.3257883615084525, 3.428485210602243, 1.1040696242075747], "isController": false}, {"data": ["-3", 252, 0, 0.0, 3577.599206349206, 1086, 24974, 2961.0, 5877.700000000002, 9316.55, 17556.949999999997, 1.2875207561629838, 129.12361093370802, 0.9316922659343467], "isController": false}, {"data": ["Login-20", 200, 0, 0.0, 3211.5650000000005, 896, 5045, 3445.0, 4472.7, 4658.9, 5033.77, 2.2670853217560842, 3.148237624548, 1.7689464571124136], "isController": false}, {"data": ["Login-21", 200, 0, 0.0, 3365.255000000002, 956, 4993, 3548.5, 4457.1, 4690.299999999999, 4985.95, 2.1073705284231603, 3.1198962120014753, 1.6134555608239818], "isController": false}, {"data": ["Add A New Employee-60", 194, 0, 0.0, 3118.9999999999995, 394, 10400, 2905.5, 4631.5, 5520.0, 7352.400000000036, 1.9737913071789028, 34.13656645521325, 1.482271010957594], "isController": false}, {"data": ["Login", 200, 0, 0.0, 62739.554999999986, 27351, 83676, 70197.5, 78540.5, 80083.84999999999, 83536.11, 1.538591726992284, 380.5321913657117, 22.10837611740224], "isController": true}, {"data": ["View Dashboard-33 - PIM", 200, 0, 0.0, 7958.550000000003, 4649, 10366, 8050.0, 9522.2, 9879.25, 10184.81, 1.8151949973225874, 9.375553067225747, 3.068459512075585], "isController": false}, {"data": ["Login-24", 200, 0, 0.0, 3263.6750000000006, 964, 4958, 3365.5, 4181.0, 4367.4, 4774.110000000001, 1.9980818414322252, 2.9171214384191178, 1.4595363451086956], "isController": false}, {"data": ["Add A New Employee-63", 198, 0, 0.0, 2774.863636363637, 405, 4893, 2736.5, 4114.1, 4311.399999999998, 4832.61, 1.968621368490127, 2.7453040177772476, 1.432248944848774], "isController": false}, {"data": ["Login-25", 200, 0, 0.0, 3391.7099999999996, 820, 5148, 3517.5, 4346.3, 4446.549999999999, 4735.93, 1.9478748685184464, 2.84382121917488, 1.4228617203630838], "isController": false}, {"data": ["Add A New Employee-64", 182, 0, 0.0, 2593.0934065934066, 380, 5137, 2507.0, 4242.600000000001, 4464.0, 5063.959999999999, 1.9979800641110086, 6.257345767191411, 1.500436200489615], "isController": false}, {"data": ["Login-22", 200, 0, 0.0, 3348.4849999999997, 975, 5129, 3518.5, 4352.2, 4609.75, 4985.5700000000015, 2.0282124349704387, 2.992801747305013, 1.556811497936294], "isController": false}, {"data": ["Add A New Employee-61", 198, 192, 96.96969696969697, 2626.4797979797986, 381, 6478, 2600.0, 3724.8999999999996, 4073.749999999998, 4735.599999999984, 1.904157410345922, 0.8959547474106344, 1.4625475137762902], "isController": false}, {"data": ["Login-23", 200, 0, 0.0, 3549.4200000000005, 1084, 5124, 3653.5, 4478.5, 4655.05, 4956.82, 1.9106576483625664, 33.04467475830181, 1.3938098274676143], "isController": false}, {"data": ["Add A New Employee-62", 191, 185, 96.8586387434555, 2322.2565445026175, 376, 4787, 2119.0, 3924.8, 4127.399999999998, 4652.679999999998, 1.9742622357744586, 0.7280939906455114, 1.4450238061398522], "isController": false}, {"data": ["Add A New Employee-72-1", 109, 0, 0.0, 2394.201834862385, 385, 5356, 2571.0, 3984.0, 4186.5, 5341.200000000001, 1.6364892051767108, 4.120048071870403, 1.4047597767093056], "isController": false}, {"data": ["Add A New Employee-58", 200, 194, 97.0, 3185.080000000001, 603, 5711, 3375.5, 4483.3, 4722.85, 5621.930000000002, 1.8220578321155914, 0.8223459450102946, 1.564976859865532], "isController": false}, {"data": ["Add A New Employee-59", 200, 0, 0.0, 5928.105000000003, 1378, 30226, 4453.5, 11482.1, 15688.149999999996, 25994.500000000007, 1.8502243397011888, 185.56510621444102, 1.3876682547758916], "isController": false}, {"data": ["PIM Sidebar Menu", 200, 0, 0.0, 7958.550000000003, 4649, 10366, 8050.0, 9522.2, 9879.25, 10184.81, 1.8151785228077182, 9.375467975712912, 3.0684316630665625], "isController": true}, {"data": ["Login-17", 200, 0, 0.0, 2792.6899999999987, 503, 4767, 3170.0, 3970.7, 4178.75, 4673.7800000000025, 2.5091269492779986, 3.5186584952765685, 2.0019108569923096], "isController": false}, {"data": ["Employee List-41", 200, 0, 0.0, 4129.92, 1221, 6136, 4283.5, 5165.9, 5371.05, 6065.330000000003, 1.6344810114168498, 5.267370446948832, 1.3838818719711024], "isController": false}, {"data": ["Login-18", 200, 0, 0.0, 3408.2250000000004, 556, 5651, 3712.0, 4764.0, 4999.95, 5578.040000000002, 2.3572118897767718, 3.342452796831907, 1.8208541062631118], "isController": false}, {"data": ["Login-15", 200, 0, 0.0, 3178.870000000001, 410, 5100, 3392.0, 4498.4, 4730.85, 4996.95, 2.449119541524822, 7.785043073889936, 1.8296645012368051], "isController": false}, {"data": ["Login-16", 202, 0, 0.0, 3077.5, 517, 5036, 3543.5, 4620.200000000001, 4742.15, 5026.74, 1.0820655667452324, 2.6745194818673665, 0.8971422521159202], "isController": false}, {"data": ["Employee List-40", 200, 0, 0.0, 3614.3900000000012, 1424, 5324, 3660.0, 4453.3, 4628.0, 5281.300000000003, 1.8225559524677408, 4.915917520230371, 1.3811556827294598], "isController": false}, {"data": ["Login-19", 200, 0, 0.0, 3196.6249999999995, 584, 5401, 3527.0, 4307.0, 4570.85, 4949.560000000001, 2.191756802665176, 3.2940563665055724, 1.6609407020197038], "isController": false}, {"data": ["Employee Li-42", 200, 0, 0.0, 5416.4800000000005, 1687, 24239, 4516.0, 8777.500000000004, 12685.899999999992, 21680.840000000026, 1.6496069811367442, 165.45135147918197, 1.2017644608671985], "isController": false}, {"data": ["Add A New Employee-70", 152, 0, 0.0, 3095.723684210526, 398, 6265, 3283.0, 5096.100000000001, 5301.25, 6111.83, 1.8585769658731033, 9.918623732163164, 1.32496209481188], "isController": false}, {"data": ["Add A New Employee-71", 135, 0, 0.0, 2560.5555555555547, 363, 6050, 2620.0, 4134.2, 4710.999999999999, 5774.95999999999, 1.7201177325025803, 5.3871265313825925, 1.2917681018500822], "isController": false}, {"data": ["Login-13", 208, 0, 0.0, 3429.7403846153843, 690, 7575, 3740.0, 4776.8, 5096.599999999999, 6628.559999999995, 1.0970579858437326, 110.03833295479119, 0.7992238842181879], "isController": false}, {"data": ["Add A New Employee-74", 87, 0, 0.0, 5862.724137931035, 405, 16621, 4342.0, 12994.8, 14475.8, 16621.0, 1.3235965312642628, 132.74662325992696, 0.9577978805340027], "isController": false}, {"data": ["Add A New Employee-72", 109, 0, 0.0, 4673.128440366972, 748, 9218, 4951.0, 7460.0, 7810.0, 9163.800000000003, 1.5346492833610228, 6.934451710465182, 2.6361797748359757], "isController": false}, {"data": ["Add A New Employee-55 - EmployeeId", 200, 0, 0.0, 3342.6899999999987, 1118, 6780, 3483.5, 4245.9, 4489.799999999999, 5565.6300000000065, 1.7146776406035664, 2.3440681530778464, 1.2943806798696844], "isController": false}, {"data": ["View Dashboard-33 - PIM-0", 200, 0, 0.0, 3604.185, 1179, 5074, 3707.0, 4420.0, 4611.45, 5068.490000000001, 1.8805652979285574, 3.683998034809264, 1.5867269701272202], "isController": false}, {"data": ["Add A New Employee-67", 175, 169, 96.57142857142857, 2296.851428571429, 356, 5218, 2118.0, 3954.2000000000003, 4188.399999999999, 5096.4000000000015, 1.9968734666864452, 0.7515576504501523, 1.6408906554879787], "isController": false}, {"data": ["Add A New Employee-72-0", 109, 0, 0.0, 2278.3853211009177, 362, 5200, 2319.0, 3783.0, 4013.0, 5137.800000000004, 1.543537675064078, 3.0885827111389608, 1.326477689508192], "isController": false}, {"data": ["View Dashboard-33 - PIM-1", 200, 0, 0.0, 4354.200000000001, 1968, 6382, 4339.5, 5584.7, 5955.949999999999, 6225.39, 1.859894172021612, 5.962922428463821, 1.5747346163503297], "isController": false}, {"data": ["Add A New Employee-68", 163, 157, 96.31901840490798, 2268.8895705521463, 356, 4834, 2156.0, 3899.3999999999996, 4190.2, 4745.679999999998, 1.939298759086745, 0.7218575812601873, 1.6238048550879822], "isController": false}, {"data": ["Add A New Employee-65", 187, 181, 96.79144385026738, 2519.7967914438505, 383, 5085, 2383.0, 4019.4, 4615.0, 4994.360000000001, 1.9863399296814421, 0.7439023944956077, 1.607086012103927], "isController": false}, {"data": ["Employee -35", 200, 0, 0.0, 4257.265000000001, 2300, 7769, 4247.5, 5098.6, 5244.65, 7022.740000000002, 1.8473190781877802, 185.2721404077957, 1.3548209255068582], "isController": false}, {"data": ["Add A New Employee-69", 123, 0, 0.0, 2457.333333333334, 368, 4931, 2686.0, 3989.4, 4435.599999999999, 4889.240000000001, 1.643681847338037, 2.2921657011706222, 1.1958427502605837], "isController": false}, {"data": ["Logout", 87, 0, 0.0, 10685.609195402296, 1163, 25839, 11026.0, 18764.4, 20093.6, 25839.0, 1.2102663977185784, 126.8495116983724, 2.9547519475551227], "isController": true}, {"data": ["Employee List-38", 200, 0, 0.0, 3912.0049999999997, 1432, 5464, 3983.5, 4808.1, 5016.3, 5447.650000000001, 1.8071744826963043, 11.503036194316437, 1.3871476009758743], "isController": false}, {"data": ["Employee List-39", 200, 0, 0.0, 3553.25, 1139, 5160, 3640.0, 4316.0, 4517.55, 4952.220000000001, 1.8148161591230807, 2.858689906899931, 1.4089637172879388], "isController": false}, {"data": ["Employee List-36", 200, 0, 0.0, 3833.2400000000016, 1379, 22505, 3852.0, 4528.7, 4705.9, 5701.240000000005, 1.6267701292468866, 28.134862293908558, 1.1946593136656825], "isController": false}, {"data": ["Employee List-37", 200, 0, 0.0, 4560.24, 1338, 9060, 4821.5, 5700.7, 5916.15, 6896.360000000004, 1.790285908659613, 16.887405072887017, 1.5385269527543548], "isController": false}, {"data": ["Login-7 - Token-1", 232, 0, 0.0, 3159.314655172415, 400, 6438, 3379.0, 5444.4000000000015, 5720.7, 6117.409999999997, 1.1963758063933911, 3.6533858853438805, 1.148474040707718], "isController": false}, {"data": ["Login-7 - Token-0", 232, 0, 0.0, 7324.26724137931, 687, 14013, 8354.0, 10968.7, 11719.35, 13163.97, 1.1916869561644117, 2.4136315889501856, 1.3523907336708068], "isController": false}, {"data": ["Login-10 - Dashboard", 212, 0, 0.0, 3240.891509433962, 422, 5856, 3525.0, 4834.200000000001, 5452.049999999999, 5776.1, 1.1084329790182001, 3.3848339115135864, 0.9558069535869832], "isController": false}, {"data": ["Login-7 - Token", 232, 0, 0.0, 10484.125000000002, 1091, 18182, 11681.0, 16014.9, 16598.45, 17512.739999999998, 1.1884089151158441, 6.036049577653815, 2.4894967718946415], "isController": false}, {"data": ["Add A New Employee", 123, 122, 99.1869918699187, 58057.252032520264, 16654, 74698, 64114.0, 71474.8, 72130.6, 74467.84000000001, 0.9088289406601201, 222.73794589419902, 12.682988123803929], "isController": true}, {"data": ["Debug Sampler", 61, 0, 0.0, 0.45901639344262285, 0, 4, 0.0, 1.0, 1.0, 4.0, 0.9965040676969321, 0.9298194653183912, 0.0], "isController": false}, {"data": ["Employee List", 200, 0, 0.0, 23730.394999999993, 18064, 43167, 23798.5, 26147.2, 26735.549999999996, 29364.41000000001, 1.4137772593927826, 194.61750559988337, 6.544242392111123], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["422/Unprocessable Content", 194, 15.19185591229444, 2.0199916701374425], "isController": false}, {"data": ["500/Internal Server Error", 386, 30.227094753328114, 4.019158683881716], "isController": false}, {"data": ["404/Not Found", 692, 54.189506656225525, 7.205331112036651], "isController": false}, {"data": ["Assertion failed", 5, 0.39154267815191857, 0.05206164098292378], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9604, 1277, "404/Not Found", 692, "500/Internal Server Error", 386, "422/Unprocessable Content", 194, "Assertion failed", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Add A New Employee-57 - Add Details", 200, 199, "422/Unprocessable Content", 194, "Assertion failed", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add A New Employee-61", 198, 192, "500/Internal Server Error", 192, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Add A New Employee-62", 191, 185, "404/Not Found", 185, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Add A New Employee-58", 200, 194, "500/Internal Server Error", 194, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add A New Employee-67", 175, 169, "404/Not Found", 169, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add A New Employee-68", 163, 157, "404/Not Found", 157, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add A New Employee-65", 187, 181, "404/Not Found", 181, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

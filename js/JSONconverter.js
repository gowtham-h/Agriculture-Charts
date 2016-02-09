  var fs = require('fs')

  fs.readFile('../data/Production-Department_of_Agriculture_and_Cooperation_1.csv', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    } else {

      var rows = data.split('\r\n');
      var headers = rows[0].split(',');


      var plot1Array = [];
      var plot2Array = [];


      for (var i = 1, rowCount = rows.length - 1; i < rowCount; i++) {

        var plot1Obj = {};
        var plot2Obj = {};


        var cells = rows[i].split(',');

        //To remove quotes
        for (var k = 0; k < cells.length; k++) {
          if (cells[k].charAt(0) == "\"") {
            cells[k] = cells[k].replace("\"", "");
            cells[k + 1] = cells[k + 1].replace("\"", "");
            cells[k] = cells[k] + "," + cells[k + 1];

            //Shift all the cells by one cell
            for (var l = k + 1; l < cells.length - 1; l++) {
              cells[l] = cells[l + 1];
            }

          }
        }
        cells.length = headers.length;

        var plot1Check = false;
        var plot2Check = false;


        for (var j = 0, colCount = headers.length; j < colCount; j++) {

          if (headers[j] == "Particulars" || headers[j] == "Unit" || headers[j] == " 3-2013") {


            //Plot 2
            if (cells[0].indexOf("Agricultural Production Foodgrains ") != -1) {
              if (cells[0].indexOf("Rabi") != -1 || cells[0].indexOf("Kharif") != -1) {
                if (cells[0].indexOf("Volume") == -1 && cells[0].indexOf("Area") == -1 && cells[0].indexOf("Yield") == -1) {
                  if (cells[0].replace("Agricultural Production Foodgrains ", "") != "Kharif" && cells[0].replace("Agricultural Production Foodgrains ", "") != "Rabi" && cells[0].replace("Agricultural Production Foodgrains ", "") != "Production Foodgrains Coarse Cereals Rice Kharif") {
                    plot2Obj[headers[j] == " 3-2013" ? "Production" : headers[j]] = cells[j].replace("Agricultural Production Foodgrains ", "");
                    plot2Check = true;
                  }
                }
              }
            }

            //Plot 1
            if (cells[0].indexOf("Agricultural Production Oilseeds ") != -1) {
              if (cells[0].indexOf("Rabi") != -1 || cells[0].indexOf("Kharif") != -1) {
                if (cells[0].replace("Agricultural Production Oilseeds ", "") != "Kharif" && cells[0].replace("Agricultural Production Oilseeds ", "") != "Rabi") {
                  plot1Obj[headers[j] == " 3-2013" ? "Production" : headers[j]] = cells[j].replace("Agricultural Production Oilseeds ", "");
                  plot1Check = true;
                }
              }
            }

          }
        } // row Loop End

        if (plot1Check) plot1Array.push(plot1Obj);
        if (plot2Check) plot2Array.push(plot2Obj);


      } //Main for loop end

    }

    plot1Array.sort(oilseedSort);
    plot2Array.sort(oilseedSort);
    fs.writeFile('../data/json/oilseed.json', JSON.stringify(plot1Array));
    fs.writeFile('../data/json/foodgrain.json', JSON.stringify(plot2Array));

  });

  function oilseedSort(a, b) {
    return parseInt(b["Production"]) - parseInt(a["Production"]);
  }

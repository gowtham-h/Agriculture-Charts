  var fs = require('fs');
  var states = ["Andhra Pradesh", "Tamil Nadu", "Kerala", "Karnataka"];

  //Function to check if a state is southern
  var southCheck = function(state) {
    for (var i = 0; i < states.length; i++) {
      if (state == states[i])
        return true;
    }
    return false;
  }

  fs.readFile('../data/Production-Department_of_Agriculture_and_Cooperation_1.csv', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    } else {

      var rows = data.split('\r\n');
      var headers = rows[0].split(',');


      var plot1Array = [];
      var plot2Array = [];
      var plot3metaArray = [];
      var plot3Array = [];
      var plot4Array = [];
      var finalArray = [];


      for (var i = 1, rowCount = rows.length - 1; i < rowCount; i++) {

        var plot1Obj = {};
        var plot2Obj = {};
        var plot3metaObj = {};
        var plot3Obj = {};
        var plot4Obj = {};

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

          // Plot 1 & 2 Parsing
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

          }//End of plot 1 & 2

          // Parsing for plot 3
          if (cells[0].indexOf("Commercial") != -1) {
            for (var j = 3; j < headers.length; j++) {
              if (cells[j] == "NA") {
                cells[j] = 0;
              }
              cells[j] = parseFloat(cells[j]);
              plot3metaObj[headers[j].substring(3)] = cells[j];
            }
            plot3metaArray.push(plot3metaObj);
          }

          //Parsing for plot 4
          cells[0] = cells[0].replace("Agricultural Production Foodgrains Rice Yield ", "");
          if (southCheck(cells[0])) {

            plot4Obj["State"] = cells[0];
            for (var j = 3; j < headers.length; j++) {
              if (cells[j] == "NA") {
                cells[j] = 0;
              }
              cells[j] = parseFloat(cells[j]);
              plot4Obj[headers[j].substring(3)] = cells[j];
            }
            plot4Array.push(plot4Obj);

          }

        } // column Loop End

        if (plot1Check) plot1Array.push(plot1Obj);
        if (plot2Check) plot2Array.push(plot2Obj);

      } //Main for loop end

      // Creating aggregate values for plot 3
      var aggObj = {}
      for (k = 3; k < headers.length; k++) {
        aggObj[headers[k].substring(3)] = 0;
      }
      for (m = 0; m < plot3metaArray.length; m++) {
        for (j in plot3metaArray[m]) {
          aggObj[j] += plot3metaArray[m][j];
        }
      }

      var year = "Year";
      var sum = "Quantity";
      var tempObj = {};
      for (j in aggObj) {
        tempObj = {};
        tempObj[year] = j;
        tempObj[sum] = aggObj[j];
        plot3Array.push(tempObj);
      }

      //Creating final JSON for plot 4
      for (m in plot4Array[0]) {
        if (m != "State") {
          var finalObj = {};
          finalObj["Year"] = m;
          for (var j = 0; j < plot4Array.length; j++) {
            finalObj[plot4Array[j]["State"]] = plot4Array[j][m];
          }
          finalArray.push(finalObj);
        }
      }

    }

    plot1Array.sort(oilseedSort);
    plot2Array.sort(oilseedSort);

    fs.writeFile('../data/json/oilseed.json', JSON.stringify(plot1Array));
    fs.writeFile('../data/json/foodgrain.json', JSON.stringify(plot2Array));
    fs.writeFile('../data/json/commercial.json', JSON.stringify(plot3Array));
    fs.writeFile('../data/json/south.json', JSON.stringify(finalArray));


  });

  function oilseedSort(a, b) {
    return parseFloat(b["Production"]) - parseFloat(a["Production"]);
  }

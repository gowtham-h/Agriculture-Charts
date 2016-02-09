var fs = require('fs')

fs.readFile('../data/Production-Department_of_Agriculture_and_Cooperation_1.csv', 'utf8', function(err, data) {
  if (err) {
    console.log(err);
  } else {

    var rows = data.split('\r\n');
    var headers = rows[0].split(',');


    var plot3metaArray = [];
    var plot3Array = [];

    for (var i = 1, rowCount = rows.length - 1; i < rowCount; i++) {

      var plot3metaObj = {};
      var plot3Obj = {};

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


      var plot3Check = false;

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

    } //Main for loop end

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
    fs.writeFile('../data/json/commercial.json', JSON.stringify(plot3Array));

  }

});

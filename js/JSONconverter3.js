var fs = require('fs');
var states = ["Andhra Pradesh", "Tamil Nadu", "Kerala", "Karnataka"];

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

    var plot4Array = [];

    for (var i = 1; i < rows.length - 1; i++) {

      var cells = rows[i].split(',');
      var plot4Obj = {};


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

    } // Main for loop end

    var finalArray = [];

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

    fs.writeFile('../data/json/south.json', JSON.stringify(finalArray));
  }
});

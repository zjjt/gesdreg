(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var ExcelUtils, Workbook, Worksheet, Excel;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/netanelgilad_excel/lib/utils.js                                            //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var XLSX = Npm.require('xlsx');
var XLS = Npm.require('xlsjs');

ExcelUtils = function (fileType) {
  this.fileType = fileType;
};

ExcelUtils.prototype.sheet_to_json = function (worksheet, options) {
  
  // Ensure backwards compatibility - options could be undefined. 
  var opts = options ? options : {};
  
  if (this.fileType === 'xlsx') {
    return XLSX.utils.sheet_to_json(worksheet, opts);
  }
  else if (this.fileType === 'xls') {
    return XLS.utils.sheet_to_json(worksheet, opts);
  }
};

ExcelUtils.prototype.sheet_to_csv = function (worksheet, options) {
  
  // Ensure backwards compatibility - options could be undefined. 
  var opts = options ? options : {};
  
  if (this.fileType === 'xlsx') {
    return XLSX.utils.sheet_to_csv(worksheet, opts);
  }
  else if (this.fileType === 'xls') {
    return XLS.utils.sheet_to_csv(worksheet, opts);
  }
};

ExcelUtils.prototype.encode_cell = function (cellAddress, options) {
  if (this.fileType === 'xlsx') {
    return XLSX.utils.encode_cell(cellAddress);
  }
  else if (this.fileType === 'xls') {
    return XLS.utils.encode_cell(cellAddress);
  }
};

ExcelUtils.prototype.encode_range = function (range) {
  if (this.fileType === 'xlsx') {
    return XLSX.utils.encode_range(range);
  }
  else if (this.fileType === 'xls') {
    return XLS.utils.encode_range(range);
  }
};

/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/netanelgilad_excel/lib/workbook.js                                         //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var XLSX = Npm.require('xlsx');
var XLS = Npm.require('xlsjs');

Workbook = function (fileType) {
  this.fileType = fileType;

  this.SheetNames = [];
  this.Sheets = {};
};

Workbook.prototype.addSheet = function (sheetName, sheet) {
  this.SheetNames.push(sheetName);
  this.Sheets[sheetName] = sheet;
};

Workbook.prototype.writeToFile = function (filePath) {
  if (this.fileType === 'xlsx') {
    return XLSX.writeFile(this, filePath);
  }
  else if (this.fileType == 'xls') {
    return XLS.writeFile(this, filePath);
  }
};

Workbook.prototype.write = function (wopts) {
    if (this.fileType === 'xlsx') {
        return XLSX.write(this, wopts);
    }
    else if (this.fileType == 'xls') {
        return XLS.write(this, wopts);
    }
};
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/netanelgilad_excel/lib/worksheet.js                                        //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var XLSX = Npm.require('xlsx');
var XLS = Npm.require('xlsjs');

Worksheet = function (fileType) {
  this.fileType = fileType;
  this.range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
  this['!merges'] = [];
};

Worksheet.prototype.writeToCell = function (row, col, value) {
  var utils = new ExcelUtils(this.fileType);
  var cellAddress = utils.encode_cell({c: col, r: row});

  var cell = {
    v: value
  };

  if (typeof cell.v === 'number') cell.t = 'n';
  else if (typeof cell.v === 'boolean') cell.t = 'b';
  else if (cell.v instanceof Date) {
    cell.t = 'n';
    cell.z = XLSX.SSF._table[14];
    cell.v = datenum(cell.v);
  }
  else cell.t = 's';

  this[cellAddress] = cell;

  if (this.range.s.r > row) this.range.s.r = row;
  if (this.range.s.c > col) this.range.s.c = col;
  if (this.range.e.r < row) this.range.e.r = row;
  if (this.range.e.c < col) this.range.e.c = col;

  this['!ref'] = utils.encode_range(this.range);
};

Worksheet.prototype.writeObjectArray = function (row, col, objArray, objDefinitions) {
  if (objArray.length === 0)
    return;

  var self = this;

  if (_.isUndefined(objDefinitions)) {
    objDefinitions = {};
    for (var prop in objArray[0]) {
      if (objArray[0].hasOwnProperty(prop)) {
        objDefinitions[prop] = prop;
      }
    }
  }

  var currentHeaderCol = col;
  _.forEach(objDefinitions, function(definition) {
    var header = _.isObject(definition) ? definition.header : definition;
    self.writeToCell(row, currentHeaderCol, header);
    currentHeaderCol++;
  });

  var currentRow = row + 1;
  _.forEach(objArray, function(item) {
    var currentCol = col;
    _.forEach(objDefinitions, function(definition, field) {
      var itemData = _.isUndefined(definition.transform) ? item[field] : definition.transform.apply(item, [item[field]]);
      self.writeToCell(currentRow, currentCol, itemData);
      currentCol++;
    });
    currentRow++;
  });
};

Worksheet.prototype.mergeCells = function(startRow, startCol, endRow, endCol) {
  this['!merges'].push({s:{r:startRow, c:startCol}, e:{r:endRow, c:endCol}});
};

Worksheet.prototype.setColumnProperties = function(columns) {
  this['!cols'] = columns;
};

//////////////////////

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/netanelgilad_excel/excel.js                                                //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var XLSX = Npm.require('xlsx');
var XLS = Npm.require('xlsjs');

Excel = function (fileType) {
  if (fileType != 'xlsx' && fileType != 'xls') {
    throw new Meteor.Error(400, "File must be of type xlsx or xls");
  }

  this.fileType = fileType;
  this.utils = new ExcelUtils(this.fileType);
};

Excel.prototype.readFile = function (fileName, read_opts) {
  if (this.fileType === 'xlsx') {
    return XLSX.readFile(fileName, read_opts);
  }
  else if (this.fileType == 'xls') {
    return XLS.readFile(fileName, read_opts);
  }
};

Excel.prototype.read = function (file, read_opts) {
  if (this.fileType === 'xlsx') {
    return XLSX.read(file, read_opts);
  }
  else if (this.fileType == 'xls') {
    return XLS.read(file, read_opts);
  }
};

Excel.prototype.createWorkbook = function () {
  return new Workbook(this.fileType);
};

Excel.prototype.createWorksheet = function () {
  return new Worksheet(this.fileType);
};
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['netanelgilad:excel'] = {}, {
  Excel: Excel
});

})();

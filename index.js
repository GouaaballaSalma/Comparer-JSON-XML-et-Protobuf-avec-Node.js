const fs = require('fs');
const convert = require('xml-js');
const protobuf = require('protobufjs');

// Charger la définition Protobuf à partir du fichier .proto
const root = protobuf.loadSync('employee.proto');

// Récupérer le type "Employees" défini dans employee.proto
const EmployeeList = root.lookupType('Employees');

// Liste des employés
const employees = [];

employees.push({
  id: 1,
  name: 'SALMA',
  salary: 9000
});

employees.push({
  id: 2,
  name: 'SAAD',
  salary: 22000
});

employees.push({
  id: 3,
  name: 'JOUHAINA',
  salary: 23000
});

let jsonObject = {
  employee: employees
};

// Conversion JSON
console.time('JSON encode');
let jsonData = JSON.stringify(jsonObject);
console.timeEnd('JSON encode');

// Options pour la conversion JSON -> XML
const options = {
  compact: true,
  ignoreComment: true,
  spaces: 0
};

// Conversion de l'objet JSON en XML
let xmlData = "<root>\n" + convert.json2xml(jsonObject, options) + "\n</root>";
// Encodage en Protobuf : vérification du schéma
let errMsg = EmployeeList.verify(jsonObject);
if (errMsg) {
  throw Error(errMsg);
}
// Création d'un message Protobuf à partir de l'objet JS
let message = EmployeeList.create(jsonObject);

// Encodage en binaire Protobuf
let buffer = EmployeeList.encode(message).finish();


// Écriture des données dans les fichiers
fs.writeFileSync('data.json', jsonData);   // Fichier JSON
fs.writeFileSync('data.xml', xmlData);     // Fichier XML
fs.writeFileSync('data.proto', buffer);    // Fichier Protobuf binaire

// Récupération de la taille des fichiers (en octets)
const jsonFileSize = fs.statSync('data.json').size;
const xmlFileSize = fs.statSync('data.xml').size;
const protoFileSize = fs.statSync('data.proto').size;

// Affichage des tailles dans la console
console.log(`Taille de 'data.json' : ${jsonFileSize} octets`);
console.log(`Taille de 'data.xml'  : ${xmlFileSize} octets`);
console.log(`Taille de 'data.proto': ${protoFileSize} octets`);

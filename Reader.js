const fs = require('fs');
const { Http2ServerRequest } = require('http2');
const path = require('path');
const xlsx = require('xlsx');

class Reader {
    Read(filepath) {
        const ext = path.extname(filepath).toLowerCase();

        if (ext === '.csv') {
            return fs.promises.readFile(filepath, { encoding: 'utf-8' });
        } else if (ext === '.xlsx') {
            const workbook = xlsx.readFile(filepath); // Lê o arquivo Excel
            const sheetName = workbook.SheetNames[0]; // Pega a primeira planilha
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]); // Converte para JSON
            return Promise.resolve(data); // Retorna o JSON como uma Promise
        } else {
            return Promise.reject(new Error('Formato de arquivo não suportado'));
        }
    }
}

module.exports = Reader;

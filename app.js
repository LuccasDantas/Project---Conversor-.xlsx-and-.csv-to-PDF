const fs = require('fs');
const path = require('path');
const Reader = require("./Reader");
const Writer = require("./Writer");
const Processor = require("./Processor");
const Table = require("./Table");
const HtmlParser = require("./HtmlParser");
const PDFWriter = require("./PDFWriter");
const ExcelJS = require('exceljs'); // Importa a nova biblioteca

const leitor = new Reader();
const escritor = new Writer();

// Função para pegar o primeiro arquivo com extensão válida (.csv ou .xlsx)
function getFirstValidFile() {
    const files = fs.readdirSync(__dirname); // Lista arquivos da pasta atual
    const validExtensions = ['.csv', '.xlsx']; // Extensões suportadas

    // Filtra apenas os arquivos que têm uma extensão válida
    const foundFile = files.find(file => 
        validExtensions.includes(path.extname(file).toLowerCase())
    );

    if (!foundFile) throw new Error("Nenhum arquivo válido encontrado!");

    return foundFile; // Retorna o nome do arquivo encontrado
}

// Função para ler arquivos .xlsx usando exceljs
async function readExcelFile(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0]; // Pega a primeira planilha

    const data = [];
    worksheet.eachRow((row, rowNumber) => {
        data.push(row.values.slice(1)); // Adiciona a linha ao array, removendo o índice 0
    });

    return data; // Retorna os dados lidos
}

async function main() {
    try {
        const filename = getFirstValidFile(); // Pega o arquivo dinamicamente
        console.log(`Lendo o arquivo: ${filename}`);

        let dados;
        if (path.extname(filename).toLowerCase() === '.xlsx') {
            dados = await readExcelFile(filename); // Lê arquivo Excel
        } else {
            dados = await leitor.Read(filename); // Lê arquivo CSV
        }

        const dadosProcessados = Processor.Process(dados);

        const usuarios = new Table(dadosProcessados);
        const html = await HtmlParser.Parse(usuarios);

        const htmlFile = `${Date.now()}.html`;
        escritor.Write(htmlFile, html);

        const pdfFile = `${Date.now()}.pdf`;
        await PDFWriter.WritePDF(pdfFile, html);

        console.log(`Arquivos gerados: ${htmlFile}, ${pdfFile}`);
    } catch (error) {
        console.error("Erro ao executar:", error);
    }
}

main();
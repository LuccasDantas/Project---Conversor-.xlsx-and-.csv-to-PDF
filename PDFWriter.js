const puppeteer = require("puppeteer")

class PDFWriter{
    static async WritePDF(filename, html){
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Define o conteúdo HTML na página
        await page.setContent(html);

        // Salva a página como PDF
        await page.pdf({path: filename, format: 'A4'})

        // Fecha o navegador

        await browser.close()

    }
}

module.exports = PDFWriter



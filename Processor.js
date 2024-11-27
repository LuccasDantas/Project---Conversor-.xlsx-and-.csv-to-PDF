class Processor {
    static Process(data) {
        if (Array.isArray(data)) {
            return data.map(row => Object.values(row)); // Converte objetos para arrays
        } else {
            const rows = data.split('\n'); // Para arquivos CSV
            return rows.map(row => row.split(',')); 
        }
    }
}

module.exports = Processor;

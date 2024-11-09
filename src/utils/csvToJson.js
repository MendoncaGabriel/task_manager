export default function csvToJson(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map(header => header.trim().replace("\r", ""));

  return lines.slice(1).map(line => {
    const values = line.split(",");
    return headers.reduce((obj, header, index) => {
      let value = values[index].trim().replace("\r", "");
      
      // Converte os campos de data para número
      if (["completed_at", "created_at", "updated_at"].includes(header)) {
        value = value ? Number(value) : null; // Converte para número ou define como null
      }

      obj[header] = value;
      return obj;
    }, {});
  });
}

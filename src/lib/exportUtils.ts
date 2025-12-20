import { ExecutionHistory } from "@/data/mockLogs";

export function exportToCSV(data: ExecutionHistory[], filename: string = "historico") {
  const headers = ["ID", "Data/Hora", "Status", "Duração", "Registros Processados", "Erro"];
  
  const csvContent = [
    headers.join(","),
    ...data.map(row => [
      row.id,
      row.dataHora,
      row.status,
      row.duracao,
      row.registrosProcessados || "",
      row.erro || ""
    ].map(cell => `"${cell}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

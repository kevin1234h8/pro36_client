export function formatNumberToIDR(number: number | string): string {
  const parsedNumber = typeof number === "string" ? parseFloat(number) : number;
  const formattedNumber = parsedNumber.toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "decimal",
    useGrouping: true,
  });

  return formattedNumber;
}

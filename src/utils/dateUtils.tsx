export const getFormattedDate = (dateStr: any) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getIndonesianFormattedDate = (dateStr: any) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
};

export const getIndonesianFormattedDateUNION = (dateStr: any) => {
  const formattedDate = getFormattedDate(dateStr);
  const [year, month, day] = formattedDate.split("-");
  return `${day}-${month}-${year}`;
};

export const formatDateFromLongStringToDDMMYYYY = (inputDateStr: any) => {
  const date = new Date(inputDateStr);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}-${month}-${year}`;
};

export const formatDateToDDMMYYYY = (inputDateStr: any) => {
  const [day, month, year] = inputDateStr.split("-");
  return `${day}-${month}-${year}`;
};

export const formatDateToYYYYMMDD = (inputDateStr: any) => {
  const [day, month, year] = inputDateStr.split("-");
  return `${year}-${month}-${day}`;
};

export const convertToYYYYMMDD = (inputDateStr: any) => {
  const [day, month, year] = inputDateStr.split("-");
  return `${year}-${month}-${day}`;
};

export const convertToDDMMYYYY = (inputDateStr: any) => {
  const [year, month, day] = inputDateStr.split("-");
  return `${day}-${month}-${year}`;
};

export const formatShortStringToDDMMYYYY = (inputDateStr: any) => {
  const date = new Date(inputDateStr);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${day}-${month}-${year}`;
};

export const formatShortDateFromYYYYMMDDToDDMMYYYY = (dateString: any) => {
  const originalDate = new Date(dateString);

  const day = originalDate.getUTCDate();
  const month = originalDate.getUTCMonth() + 1;
  const year = originalDate.getUTCFullYear();

  const formattedDate = `${day < 10 ? "0" : ""}${day}-${
    month < 10 ? "0" : ""
  }${month}-${year}`;

  return formattedDate;
};

export const formatDateToOriginal = (dateString: any) => {
  const originalDate = new Date(dateString);

  const localDate = originalDate.toLocaleString();

  const day: any = localDate.split("-")[0];
  const month: any = localDate.split("-")[1];
  const year: any = localDate.split("-")[2].split(",")[0];

  const formattedDate = `${day < 10 ? "0" : ""}${day}-${
    month < 10 ? "0" : ""
  }${month}-${year}`;

  return formattedDate;
};

export const formatShortDateToDDMMYYYY = (dateString: any) => {
  const originalDate = new Date(dateString);
  const day = originalDate.getUTCDate();
  const month = originalDate.getUTCMonth() + 1;
  const year = originalDate.getUTCFullYear();

  const formattedDate = `${day < 10 ? "0" : ""}${day}-${
    month < 10 ? "0" : ""
  }${month}-${year}`;

  return formattedDate;
};

export const formatDateToISO = (dateString: any) => {
  const [year, month, day] = dateString.split("-").map(Number);

  const originalDate = new Date(Date.UTC(year, month - 1, day, 17, 0, 0));

  const isoString = originalDate.toISOString();

  return isoString;
};
export const formatShortStringDateToYYYYMMDD = (dateString: any) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};

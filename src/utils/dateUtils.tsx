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

export function convertToShortDateFormat(originalDateString: any) {
  const originalDate = new Date(originalDateString);

  // Add the specified number of days
  originalDate.setDate(originalDate.getDate());

  // Get the year, month, and day components
  const year = originalDate.getFullYear();
  const month = String(originalDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1 and pad with '0'
  const day = String(originalDate.getDate()).padStart(2, "0");

  // Create the new date string in the desired format
  const newDateString = `${year}-${month}-${day}`;

  return newDateString;
}

export function convertToShortDateFormatSwapMonthAndDays(
  originalDateString: any
) {
  const originalDate = new Date(originalDateString);

  // Add the specified number of days
  originalDate.setDate(originalDate.getDate());

  // Get the year, month, and day components
  const year = originalDate.getFullYear();
  const month = String(originalDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1 and pad with '0'
  const day = String(originalDate.getDate()).padStart(2, "0");

  // Create the new date string in the desired format
  const newDateString = `${year}-${day}-${month}`;

  return newDateString;
}

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

export const changeDateFormat = (inputDate: any) => {
  const parsedDate = new Date(inputDate);

  const year: any = parsedDate.getFullYear();
  const month: any = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day: any = String(parsedDate.getDate()).padStart(2, "0");

  const outputDate = `${day}-${month}-${year}`;

  return outputDate;
};

export function addDaysToDate(originalDateString: string) {
  // Parse the original date string as a Date object
  const originalDate = new Date(originalDateString);

  // Add the specified number of days
  originalDate.setDate(originalDate.getDate() + 1);

  // Get the year, month, and day components
  const year = originalDate.getFullYear();
  const month = String(originalDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1 and pad with '0'
  const day = String(originalDate.getDate()).padStart(2, "0");

  // Create the new date string in the desired format
  const newDateString = `${year}-${month}-${day}`;

  return newDateString;
}
export const convertDateToIndonesiaTimezone = (inputDate: any) => {
  const utcDate = new Date(inputDate);

  // Convert the UTC date to Indonesia timezone (Asia/Jakarta)
  const timeZone = "Asia/Jakarta";
  const convertedDate = utcDate.toLocaleString("en-US", { timeZone: timeZone });
  return convertedDate;
};

// Exa
export const incrementHourInISOString = (originalDate: any) => {
  const updatedDate = new Date(originalDate);

  // Increment the hour by one
  updatedDate.setUTCHours(updatedDate.getUTCHours() + 1);

  // Convert the updated date back to the ISO string format (with "Z" indicating UTC)
  const updatedISOString = updatedDate.toISOString();
  return updatedISOString;
};

export function changeDateFormatFromYYYYMMDDToDDMMYYYY(inputDate: string) {
  const parts = inputDate.split("-");
  if (parts.length === 3) {
    // Reorder the parts to "dd-mm-yyyy"
    const newDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return newDate;
  } else {
    // Handle invalid input or different formats
    return inputDate; // Return as is
  }
}

export const changeDateFormatAndIncrementHour = (originalDate: any) => {
  const updatedDate = new Date(originalDate);

  // Increment the hour by one
  updatedDate.setUTCHours(updatedDate.getHours() + 1);

  // Format the updated date in the desired format
  const year: any = updatedDate.getFullYear();
  const month: any = String(updatedDate.getMonth() + 1).padStart(2, "0");
  const day: any = String(updatedDate.getDate() + 1).padStart(2, "0");
  const outputDate = `${day}-${month}-${year}`;
  return outputDate;
};

export const changeDateFormatAndNotIncrementHourWithAddedDate = (
  originalDate: any
) => {
  const updatedDate = new Date(originalDate);
  updatedDate.setUTCHours(updatedDate.getHours() + 7);
  const year: any = updatedDate.getFullYear();
  const month: any = String(updatedDate.getMonth() + 1).padStart(2, "0");
  const day: any = String(updatedDate.getDate()).padStart(2, "0");
  const outputDate = `${day}-${month}-${year}`;
  console.log(outputDate);
  return outputDate;
};

export function formatDate(inputDateString: any) {
  // Parse the input date string as a Date object
  const originalDate = new Date(inputDateString);

  // Get the year, month, and day components
  const year = originalDate.getFullYear();
  const month = String(originalDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1 and pad with '0' if needed
  const day = String(originalDate.getDate()).padStart(2, "0");

  // Create the new date string in the desired format
  const newDateString = `${year}-${month}-${day}`;

  return newDateString;
}

export function reformatDate(inputDateString: any) {
  // Split the input date string into day, month, and year components
  const dateComponents = inputDateString.split("-");

  // Check if the input format is "DD-MM-YYYY" (day-month-year)
  if (dateComponents.length === 3) {
    const day = dateComponents[0];
    const month = dateComponents[1];
    const year = dateComponents[2];

    // Create the new date string in the desired format "YYYY-MM-DD"
    const newDateString = `${year}-${month}-${day}`;

    return newDateString;
  } else {
    // If the input format is not as expected, return an error or handle it accordingly
    return "Invalid date format";
  }
}

export const changeDateFormatAndNotIncrementHour = (originalDate: any) => {
  const updatedDate = new Date(originalDate);

  // Increment the hour by one
  updatedDate.setUTCHours(updatedDate.getUTCHours());

  // Format the updated date in the desired format
  const year: any = updatedDate.getFullYear();
  const month: any = String(updatedDate.getMonth() + 1).padStart(2, "0");
  const day: any = String(updatedDate.getDate()).padStart(2, "0");
  const outputDate = `${day}-${month}-${year}`;

  return outputDate;
};

export const changeDateFormatAndIncrementDayToYYYYMMDD = (
  originalDate: any
) => {
  // Parse the original date
  const parsedDate = new Date(originalDate);

  // Increment the day by one
  parsedDate.setDate(parsedDate.getDate() + 1);

  // Format the updated date in the desired format
  const year: any = parsedDate.getFullYear();
  const month: any = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day: any = String(parsedDate.getDate()).padStart(2, "0");
  const outputDate = `${year}-${month}-${day}`;

  return outputDate;
};

export function format(inputDate: any) {
  const parts = inputDate.split("-");
  if (parts.length !== 3) {
    // Check if the input date has three parts separated by '-'
    return "Invalid date format";
  }

  const year = parts[2];
  const month = parts[1];
  const day = parts[0];

  // Assuming the time is always "17:00:00.000Z" as per your example
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export const changeDateFormatAndNotIncrementDayPlus1ToYYYYMMDD = (
  originalDate: any
) => {
  // Parse the original date
  const parsedDate = new Date(originalDate);

  // Increment the day by one
  parsedDate.setDate(parsedDate.getDate());

  // Format the updated date in the desired format
  const year: any = parsedDate.getFullYear();
  const month: any = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day: any = String(parsedDate.getDate()).padStart(2, "0");
  const outputDate = `${year}-${month}-${day}`;

  return outputDate;
};

export const changeDateFormatAndNotIncrementDayToYYYYMMDD = (
  originalDate: any
) => {
  // Parse the original date
  const parsedDate = new Date(originalDate);

  // Increment the day by one
  parsedDate.setDate(parsedDate.getDate());

  // Format the updated date in the desired format
  const year: any = parsedDate.getFullYear();
  const month: any = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day: any = String(parsedDate.getDate()).padStart(2, "0");
  const outputDate = `${year}-${month}-${day}`;

  return outputDate;
};

export const changeDateFormatToDDMMYYYY = (inputDate: any) => {
  // Create a Date object from the original date string
  const dateObj = new Date(inputDate);

  // Set the date to the next day
  dateObj.setDate(dateObj.getDate());

  // Get the day, month, and year
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1; // Months are zero-based, so we add 1
  const year = dateObj.getFullYear();

  // Convert day and month to two-digit format if needed
  const dayFormatted = day < 10 ? `0${day}` : `${day}`;
  const monthFormatted = month < 10 ? `0${month}` : `${month}`;

  // Create the desired date format
  const outputDate = `${dayFormatted}-${monthFormatted}-${year}`;

  return outputDate;
};

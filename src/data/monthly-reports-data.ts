export interface MonthlyReportItem {
  id: string;
  year: number;
  month: string;
  imageSrc: string;
  altText: string;
}

export const AVAILABLE_YEARS = [2026];
export const AVAILABLE_MONTHS = ["August", "September"];
export const MONTH_ORDER = AVAILABLE_MONTHS;

export const generateMonthData = (
  month: string,
  year: number,
  count: number
): MonthlyReportItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${year}-${month.toLowerCase()}-${i + 1}`,
    year,
    month,
    imageSrc: `/images/monthly-reports/${month.toLowerCase()}-reports/${month}-${i + 1
      }.jpg`,
    altText: `${month} status report`,
  }));
};

export const GALLERY_DATA: MonthlyReportItem[] = [
  ...generateMonthData("June", 2026, 44),
  ...generateMonthData("July", 2026, 30),
  ...generateMonthData("August", 2026, 37),
];

export const LATEST_REPORT_YEAR = 2026;
export const LATEST_REPORT_MONTH = "August";

export const getLatestMonthlyReports = (): MonthlyReportItem[] => {
  return GALLERY_DATA.filter(
    (item) =>
      item.year === LATEST_REPORT_YEAR && item.month === LATEST_REPORT_MONTH
  );
};

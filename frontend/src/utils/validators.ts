const REPEATED_SEQUENCES_CPF = [
  "00000000000",
  "11111111111",
  "22222222222",
  "33333333333",
  "44444444444",
  "55555555555",
  "66666666666",
  "77777777777",
  "88888888888",
  "99999999999",
];

const REPEATED_SEQUENCES_CNPJ = [
  "00000000000000",
  "11111111111111",
  "22222222222222",
  "33333333333333",
  "44444444444444",
  "55555555555555",
  "66666666666666",
  "77777777777777",
  "88888888888888",
  "99999999999999",
];

export function validateCpf(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (REPEATED_SEQUENCES_CPF.includes(digits)) return false;
  const nums = digits.split("").map(Number);
  const sum1 = nums.slice(0, 9).reduce((acc, n, i) => acc + n * (10 - i), 0);
  const remainder1 = sum1 % 11;
  const d1 = remainder1 < 2 ? 0 : 11 - remainder1;
  if (nums[9] !== d1) return false;
  const sum2 = nums.slice(0, 10).reduce((acc, n, i) => acc + n * (11 - i), 0);
  const remainder2 = sum2 % 11;
  const d2 = remainder2 < 2 ? 0 : 11 - remainder2;
  return nums[10] === d2;
}

export function validateCnpj(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 14) return false;
  if (REPEATED_SEQUENCES_CNPJ.includes(digits)) return false;
  const nums = digits.split("").map(Number);
  const weight1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const sum1 = nums.slice(0, 12).reduce((acc, n, i) => acc + n * weight1[i], 0);
  const remainder1 = sum1 % 11;
  const d1 = remainder1 < 2 ? 0 : 11 - remainder1;
  if (nums[12] !== d1) return false;
  const weight2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const sum2 = nums.slice(0, 13).reduce((acc, n, i) => acc + n * weight2[i], 0);
  const remainder2 = sum2 % 11;
  const d2 = remainder2 < 2 ? 0 : 11 - remainder2;
  return nums[13] === d2;
}

export function validateCau(value: string): boolean {
  return /^[A-Z]\d{4,6}-\d$/.test(value.trim());
}

export function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validatePhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

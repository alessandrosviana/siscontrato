import { describe, it, expect } from "vitest";
import {
  validateCpf,
  validateCnpj,
  validateCau,
  validateEmail,
  validatePhone,
} from "./validators";

describe("validateCpf", () => {
  it("accepts a valid CPF with mask", () => {
    expect(validateCpf("529.982.247-25")).toBe(true);
  });

  it("accepts a valid CPF without mask", () => {
    expect(validateCpf("52998224725")).toBe(true);
  });

  it("rejects a CPF with wrong first check digit", () => {
    expect(validateCpf("529.982.247-35")).toBe(false);
  });

  it("rejects a CPF with wrong second check digit", () => {
    expect(validateCpf("529.982.247-26")).toBe(false);
  });

  it("rejects a repeated-sequence CPF", () => {
    expect(validateCpf("111.111.111-11")).toBe(false);
  });

  it("rejects all-zeros CPF", () => {
    expect(validateCpf("000.000.000-00")).toBe(false);
  });

  it("rejects all-nines CPF", () => {
    expect(validateCpf("999.999.999-99")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(validateCpf("")).toBe(false);
  });

  it("rejects CPF with fewer than 11 digits", () => {
    expect(validateCpf("529.982.247")).toBe(false);
  });

  it("rejects CPF with more than 11 digits", () => {
    expect(validateCpf("529.982.247-250")).toBe(false);
  });

  it("accepts another known valid CPF", () => {
    expect(validateCpf("123.456.789-09")).toBe(true);
  });
});

describe("validateCnpj", () => {
  it("accepts a valid CNPJ with mask", () => {
    expect(validateCnpj("11.222.333/0001-81")).toBe(true);
  });

  it("accepts a valid CNPJ without mask", () => {
    expect(validateCnpj("11222333000181")).toBe(true);
  });

  it("rejects a CNPJ with wrong first check digit", () => {
    expect(validateCnpj("11.222.333/0001-91")).toBe(false);
  });

  it("rejects a CNPJ with wrong second check digit", () => {
    expect(validateCnpj("11.222.333/0001-82")).toBe(false);
  });

  it("rejects a repeated-sequence CNPJ", () => {
    expect(validateCnpj("11.111.111/1111-11")).toBe(false);
  });

  it("rejects all-zeros CNPJ", () => {
    expect(validateCnpj("00.000.000/0000-00")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(validateCnpj("")).toBe(false);
  });

  it("rejects CNPJ with fewer than 14 digits", () => {
    expect(validateCnpj("11.222.333/0001")).toBe(false);
  });

  it("rejects CNPJ with more than 14 digits", () => {
    expect(validateCnpj("11.222.333/0001-810")).toBe(false);
  });

  it("accepts another known valid CNPJ", () => {
    expect(validateCnpj("45.997.418/0001-53")).toBe(true);
  });
});

describe("validateCau", () => {
  it("accepts A12345-8 (5 digits)", () => {
    expect(validateCau("A12345-8")).toBe(true);
  });

  it("accepts B123456-0 (6 digits)", () => {
    expect(validateCau("B123456-0")).toBe(true);
  });

  it("accepts minimum 4-digit format", () => {
    expect(validateCau("C1234-5")).toBe(true);
  });

  it("rejects value without leading letter", () => {
    expect(validateCau("12345-8")).toBe(false);
  });

  it("rejects value without hyphen and check digit", () => {
    expect(validateCau("A1234")).toBe(false);
  });

  it("rejects value with lowercase letter", () => {
    expect(validateCau("a12345-8")).toBe(false);
  });

  it("rejects value with too few digits (3 digits)", () => {
    expect(validateCau("A123-8")).toBe(false);
  });

  it("rejects value with too many digits (7 digits)", () => {
    expect(validateCau("A1234567-8")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(validateCau("")).toBe(false);
  });

  it("accepts value with leading/trailing whitespace by trimming", () => {
    expect(validateCau("  A12345-8  ")).toBe(true);
  });
});

describe("validateEmail", () => {
  it("accepts a standard email", () => {
    expect(validateEmail("user@domain.com")).toBe(true);
  });

  it("accepts email with subdomain", () => {
    expect(validateEmail("user@mail.domain.com")).toBe(true);
  });

  it("accepts email with dots in local part", () => {
    expect(validateEmail("first.last@domain.com")).toBe(true);
  });

  it("accepts email with plus in local part", () => {
    expect(validateEmail("user+tag@domain.com")).toBe(true);
  });

  it("rejects email with only local part and @", () => {
    expect(validateEmail("user@")).toBe(false);
  });

  it("rejects email without @", () => {
    expect(validateEmail("user.domain.com")).toBe(false);
  });

  it("rejects email without domain TLD", () => {
    expect(validateEmail("user@domain")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(validateEmail("")).toBe(false);
  });

  it("rejects email with spaces", () => {
    expect(validateEmail("user @domain.com")).toBe(false);
  });

  it("rejects plain text with no @ symbol", () => {
    expect(validateEmail("notanemail")).toBe(false);
  });
});

describe("validatePhone", () => {
  it("accepts a mobile phone with mask (11 digits)", () => {
    expect(validatePhone("(11) 99999-9999")).toBe(true);
  });

  it("accepts a landline phone with mask (10 digits)", () => {
    expect(validatePhone("(11) 3333-4444")).toBe(true);
  });

  it("accepts a mobile phone without mask", () => {
    expect(validatePhone("11999999999")).toBe(true);
  });

  it("accepts a landline phone without mask", () => {
    expect(validatePhone("1133334444")).toBe(true);
  });

  it("rejects phone with fewer than 10 digits", () => {
    expect(validatePhone("(11) 9999")).toBe(false);
  });

  it("rejects phone with more than 11 digits", () => {
    expect(validatePhone("119999999999")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(validatePhone("")).toBe(false);
  });

  it("rejects phone with only non-numeric characters", () => {
    expect(validatePhone("()   -")).toBe(false);
  });
});

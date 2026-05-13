import { describe, it, expect } from "vitest"
import { listClausulas, findClausulaBySlug } from "./clausulas-service"

describe("listClausulas", () => {
  it("returns all 20 clausulas when no filters are applied", () => {
    const result = listClausulas({})
    expect(result).toHaveLength(20)
  })

  it("returns only mandatory clausulas when obrigatoria is true", () => {
    const result = listClausulas({ obrigatoria: true })
    expect(result).toHaveLength(10)
    expect(result.every((c) => c.obrigatoria === true)).toBe(true)
  })

  it("returns only optional clausulas when obrigatoria is false", () => {
    const result = listClausulas({ obrigatoria: false })
    expect(result).toHaveLength(10)
    expect(result.every((c) => c.obrigatoria === false)).toBe(true)
  })

  it("returns only clausulas matching the given categoria", () => {
    const result = listClausulas({ categoria: "honorarios" })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((c) => c.categoria === "honorarios")).toBe(true)
  })

  it("applies AND filter when both obrigatoria and categoria are provided", () => {
    const result = listClausulas({ obrigatoria: true, categoria: "juridico" })
    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe("foro")
  })

  it("returns empty array when no clausulas match the combined filters", () => {
    const result = listClausulas({ obrigatoria: false, categoria: "juridico" })
    expect(result).toHaveLength(0)
  })
})

describe("findClausulaBySlug", () => {
  it("returns the clausula object when the slug exists", () => {
    const result = findClausulaBySlug("foro")
    expect(result).toBeDefined()
    expect(result?.slug).toBe("foro")
  })

  it("returns undefined when the slug does not exist", () => {
    const result = findClausulaBySlug("nao-existe")
    expect(result).toBeUndefined()
  })
})

describe("clausulas data integrity", () => {
  it("has unique slugs across all clausulas", () => {
    const all = listClausulas({})
    const slugSet = new Set(all.map((c) => c.slug))
    expect(slugSet.size).toBe(all.length)
  })

  it("every clausula has at least one template variable in texto", () => {
    const all = listClausulas({})
    const VARIABLE_PATTERN = /\{\{[^}]+\}\}/
    expect(all.every((c) => VARIABLE_PATTERN.test(c.texto))).toBe(true)
  })

  it("every clausula has all required fields", () => {
    const all = listClausulas({})
    for (const clausula of all) {
      expect(clausula.id).toBeTruthy()
      expect(clausula.slug).toBeTruthy()
      expect(clausula.titulo).toBeTruthy()
      expect(clausula.categoria).toBeTruthy()
      expect(clausula.texto).toBeTruthy()
      expect(typeof clausula.obrigatoria).toBe("boolean")
      expect(clausula.versao).toBeTruthy()
    }
  })
})

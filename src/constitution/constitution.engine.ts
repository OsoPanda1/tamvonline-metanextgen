import { TAMVConstitution } from "./constitution.types";
import { TAMV_CONSTITUTIONAL_RULES } from "./constitutional.rules";
import crypto from "crypto";

export class ConstitutionEngine {
  static generate(): TAMVConstitution {
    const base = {
      id: "tamv-constitution",
      version: "1.0.0",
      createdAt: Date.now(),
      createdBy: "machine" as const,

      principles: [
        "La máquina puede decir no",
        "La legitimidad precede a la eficiencia",
        "Toda acción debe ser defendible",
        "Lo irreversible es excepción, no regla",
      ],

      rules: TAMV_CONSTITUTIONAL_RULES,
    };

    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(base))
      .digest("hex");

    return {
      ...base,
      hash,
    };
  }
}

import Ajv from "ajv";

import type { JsonSchemaProperty } from "@/hooks/use-dynamic-config-form";

type DurationProperty = JsonSchemaProperty & {
  anyOf?: DurationProperty[];
  oneOf?: DurationProperty[];
};
type DurationValue = string | number;

export function getDurationOptions(property: DurationProperty) {
  const candidates = collectValues(property);
  if (!candidates?.length) return null;

  // Validate the complete property, not just a union branch or enum: bounds,
  // multiples and intersecting constraints still apply to every slider stop.
  const validate = new Ajv({ strict: false, validateFormats: false }).compile(
    property,
  );
  const values = [...new Set(candidates)].filter((value) => validate(value));
  if (!values.length) return null;
  const numericRange =
    property.type === "integer" &&
    !property.enum &&
    values.every(
      (value, index) =>
        typeof value === "number" && value === Number(values[0]) + index,
    );
  const start = numericRange ? Number(values[0]) : 0;
  return { values, start, end: start + values.length - 1 };
}

function collectValues(property: DurationProperty): DurationValue[] | null {
  if (property.const !== undefined) {
    return isDuration(property.const) ? [property.const] : null;
  }
  if (property.enum) {
    return property.enum.every(isDuration) ? [...property.enum] : null;
  }
  const branches = property.anyOf ?? property.oneOf;
  if (branches) {
    const values = branches.map(collectValues);
    return values.some((value) => value === null)
      ? null
      : (values.flat() as DurationValue[]);
  }
  const { minimum, maximum } = property;
  const types = Array.isArray(property.type) ? property.type : [property.type];
  if (
    !types.includes("integer") ||
    minimum === undefined ||
    maximum === undefined ||
    !Number.isFinite(minimum) ||
    !Number.isFinite(maximum)
  )
    return null;
  const start = Math.ceil(minimum);
  const end = Math.floor(maximum);
  if (end < start || end - start > 1000) return null;
  const values: DurationValue[] = Array.from(
    { length: end - start + 1 },
    (_, index) => start + index,
  );
  if (types.includes("string")) values.unshift("auto");
  return values;
}

function isDuration(value: unknown): value is DurationValue {
  return (
    (typeof value === "number" && Number.isFinite(value)) ||
    (typeof value === "string" &&
      (value === "auto" ||
        (value.trim() !== "" && Number.isFinite(Number(value)))))
  );
}

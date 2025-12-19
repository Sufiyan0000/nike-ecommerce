import qs from "query-string";

export function parseQuery(searchParams: Record<string, string | string[]>) {
  return qs.parse(qs.stringify(searchParams), {
    arrayFormat: "comma",
  });
}

export function toggleMultiValue(
  query: any,
  key: string,
  value: string
) {
  const raw = query[key];

  const current = Array.isArray(raw)
    ? raw
    : typeof raw === "string"
    ? [raw]
    : [];

  const updated = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];

  return {
    ...query,
    [key]: updated.length ? updated : undefined,
    page: undefined,
  };
}


export function setSingleValue(query: any, key: string, value: string) {
  return {
    ...query,
    [key]: value,
    page: undefined,
  };
}

export function stringifyQuery(query: any) {
  return qs.stringify(query, {
    arrayFormat: "comma",
    skipNull: true,
    skipEmptyString: true,
  });
}

import qs from "query-string";

export function parseQuery(
  searchParams:
    | URLSearchParams
    | Record<string, string | string[] | undefined>
) {
  const query: Record<string, string | string[]> = {};

  // ✅ Case 1: URLSearchParams (from useSearchParams)
  if (searchParams instanceof URLSearchParams) {
    for (const [key, value] of searchParams.entries()) {
      if (query[key]) {
        query[key] = Array.isArray(query[key])
          ? [...query[key], value]
          : [query[key] as string, value];
      } else {
        query[key] = value;
      }
    }
    return query;
  }

  // ✅ Case 2: Plain object
  for (const key in searchParams) {
    const value = searchParams[key];
    if (value === undefined || value === "") continue;

    if (Array.isArray(value)) {
      query[key] = value;
    } else {
      query[key] = value;
    }
  }

  return query;
}



type QueryValue = string | string[] | undefined;

export function toggleMultiValue(
  query: Record<string,QueryValue>,
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
    arrayFormat: "none",
    skipNull: true,
    skipEmptyString: true,
  });
}

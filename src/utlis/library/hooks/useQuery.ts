import qs from "qs";
import { useMemo, useState } from "react";

interface IQuery {
  [key: string]: any;
}
interface IUseQueryOptions {
  default: "url" | "state" | "overrideState" | "overrideUrl";
}

type SetValue = ((prevValue: IQuery) => IQuery) | IQuery;

function useQuery(
  defaultParam: IQuery = {},
  options: IUseQueryOptions = { default: "url" }
): [IQuery, (value: SetValue) => void] {
  function currentQuery(): IQuery {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const searchParams = urlSearchParams.toString();
    const query = qs.parse(searchParams);
    // return query as IQuery;
    let value: IQuery;
    switch (options.default) {
      case "url":
        value = query;
        break;
      case "state":
        value = defaultParam;
        break;
      case "overrideState":
        value = {
          ...defaultParam,
          ...query,
        };
        break;
      case "overrideUrl":
        value = {
          ...query,
          ...defaultParam,
        };
        break;
      default:
        break;
    }

    const defaultValue = queryPushState(value);
    if (defaultValue) {
      return defaultValue;
    }
    return {};
  }

  function setQueryParams(value: SetValue) {
    let newValue: IQuery;
    if (typeof value === "object") {
      newValue = value;
    } else if (typeof value === "function") {
      newValue = value(query);
    }

    const currentQueryParams = queryPushState(newValue);
    if (currentQueryParams) {
      console.log({ currentQueryParams });
      setQuery(newValue);
    }
  }


  const defaultState = useMemo(() => currentQuery(), []);
  const [query, setQuery] = useState(defaultState);

  return [query, setQueryParams];
}

export default useQuery;

  function queryPushState(value) {
    if (typeof value === "object") {
      const queryString = qs.stringify(value, { encode: false });
      if (queryString) {
        if (window.history.pushState) {
          let newurl =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?" +
            queryString;
          window.history.replaceState({ path: newurl }, "", newurl);

          return value;
        }
      }
    }
  }
import { Ref } from "vue";
import { useQuery } from "vue-query";
import { autoComplete, nearby, reverse } from "./locationiq";

export function useAutoComplete(searchString: Ref<string>) {
  return useQuery(
    ["search", searchString],
    () => autoComplete(searchString.value),
    {
      staleTime: 5 * 60 * 1000,
      select: (locations) => locations?.data,
    }
  );
}

export function useNearby(
  lat: Ref<string>,
  lon: Ref<string>,
  radius?: Ref<number | undefined>,
  tags?: Ref<string[] | undefined>,
  limit?: Ref<number | undefined>
) {
  return useQuery(
    ["nearby", lat, lon, radius, tags, limit],
    () =>
      nearby(lat.value, lon.value, radius?.value, tags?.value, limit?.value),
    {
      staleTime: 5 * 60 * 1000,
      select: (locations) => locations?.data,
    }
  );
}

export function useReverse(lat: Ref<string>, lon: Ref<string>) {
  return useQuery(["reverse", lat, lon], () => reverse(lat.value, lon.value), {
    staleTime: 5 * 60 * 1000,
    select: (locations) => locations?.data,
  });
}

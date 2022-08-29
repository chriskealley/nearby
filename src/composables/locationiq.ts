import axios from "axios";

const accessToken = import.meta.env.VITE_LOCATIONIQ_TOKEN;
interface LatLon {
  lat: string;
  lon: string;
}

export function autoComplete(searchString: string) {
  if (searchString != "") {
    return axios.get(
      `https://api.locationiq.com/v1/autocomplete?key=${accessToken}&q=${searchString}&tag=place:*&dedupe=1&format=json`
    );
  }
  return;
}

export function nearby(
  lat: string,
  lon: string,
  radius: number = 5000,
  tags: string[] = [],
  limit: number = 10
) {
  if (lat && lon) {
    let tagParam = "";
    if (tags.length > 0) {
      tagParam = "&tag=";
      tags.forEach((tag) => {
        tagParam += "place:" + tag + ",";
      });
      tagParam = tagParam.substring(0, tagParam.length - 1);
    }
    return axios.get(
      `https://us1.locationiq.com/v1/nearby?key=${accessToken}&lat=${lat}&lon=${lon}${tagParam}&radius=${radius}&limit=${limit}&format=json&statecode=1`
    );
  }
  return;
}

export function reverse(lat: string, lon: string) {
  if (lat && lon) {
    return axios.get(
      `https://us1.locationiq.com/v1/reverse?key=${accessToken}&lat=${lat}&lon=${lon}&format=json&statecode=1`
    );
  }
  return;
}

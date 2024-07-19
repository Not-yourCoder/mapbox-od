import { useQuery } from "react-query";

export const useSearch = (query: string) => {
  return useQuery("search-place", async () => {
    const response = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/suggest?q=${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    console.log(response.json());
    return response.json();
  });
};

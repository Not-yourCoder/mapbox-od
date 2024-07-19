import React from 'react';
import { GoSearch } from "react-icons/go";

type Props = {
    style?: React.CSSProperties;
}
interface Context {
    country: {
        id: string;
        name: string;
        country_code: string;
        country_code_alpha_3: string;
    };
    region: {
        id: string;
        name: string;
        region_code: string;
        region_code_full: string;
    };
    district: {
        id: string;
        name: string;
    };
}

interface SearchResult {
    name: string;
    mapbox_id: string;
    feature_type: string;
    place_formatted: string;
    context: Context;
    language: string;
    maki: string;
    metadata: Record<string, unknown>;
}


const Search = ({ style }: Props) => {
    const [search, setSearch] = React.useState<string>("")
    const [searchData, setData] = React.useState<SearchResult[]>([])
    const [selected, setSelected] = React.useState<string>("")
    // const { data, isLoading, isError } = useSearch(search)
    console.log("selected ", selected);
    const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setSearch(e.target.value);
    }
    const handleSearchClick = async () => {
        const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${search}&access_token=pk.eyJ1IjoibXJwaG90b24iLCJhIjoiY2x5b2k2dmYzMGRjaTJvcGxtZW1zcjhxMSJ9.S9dL6ZYqB1u8RUEbTGQ1IQ&session_token=0a8f53a6-a41b-4541-890c-72b91d20e998`;
        if (search.trim() !== "") {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data.suggestions);
                setData(data.suggestions)
                setSearch("")
            } catch (error) {
                console.error('Error fetching data:', error);

            }
        }
    }

    return (
        <div style={{ position: "relative" }}>
            <div style={{ display: "flex", width: "456px", margin: "0 auto", alignItems: "center", border: "1px solid", borderRadius: "5px", ...style }}>
                <input type="text" name="search" id="search" style={{ padding: "8px 12px", flex: 1, border: "none", outline: "none", borderRadius: "5px" }} onChange={handleSearch} />
                <GoSearch style={{ padding: "8px 12px", color: "white", background: "red" }} onClick={handleSearchClick} />
            </div>
            {searchData && searchData.map((item) => (
                <div style={{ background: "#333", padding: "10px" }} key={item.mapbox_id} onClick={() => setSelected(item.mapbox_id)}>
                    <div>{item.name}</div>
                    <div>{item.place_formatted}</div>
                </div>
            ))}
        </div>
    )
}

export default Search;

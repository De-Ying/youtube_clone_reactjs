import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  memo,
} from "react";
import { useParams } from "react-router-dom";

import { fetchDataFromApi } from "../../utils/api";
import { AppContext } from "../../context/contextApi";

import { LeftNav } from "../";
import SearchResultVideoCard from "./SearchResultVideoCard";

const SearchResult = () => {
  const [result, setResult] = useState();
  const { searchQuery } = useParams();
  const { setLoading } = useContext(AppContext);

  const fetchSearchResults = useCallback(() => {
    setLoading(true);
    fetchDataFromApi(`search/?q=${searchQuery}`).then(({ contents }) => {
      // console.log(contents);
      setResult(contents);
      setLoading(false);
    });
  }, [searchQuery]);

  useEffect(() => {
    document.getElementById("root").classList.remove("custom-h");
    fetchSearchResults();
  }, [searchQuery, fetchSearchResults]);

  return (
    <div className="flex flex-row h-[calc(100%-56px)]">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-black">
        <div className="grid grid-cols-1 gap-2 p-5">
          {result?.map((item, idx) => {
            if (item?.type !== "video") return false;
            let video = item.video;
            return <SearchResultVideoCard key={idx} video={video} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(SearchResult);

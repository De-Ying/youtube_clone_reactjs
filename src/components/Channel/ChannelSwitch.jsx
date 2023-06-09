import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  memo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";

import { BsFillCheckCircleFill } from "react-icons/bs";
import { IoMdMusicalNote, IoIosArrowForward } from "react-icons/io";

import ChannelDetails from "./ChannelDetails";
import ChannelVideos from "./ChannelVideos";
import ChannelPlaylists from "./ChannelPlaylists";
import ChannelCommunity from "./ChannelCommunity";
import ChannelChannels from "./ChannelChannels";
import ChannelAbout from "./ChannelAbout";

import { LeftNav } from "../";
import { tabNameToIndex, indexToTabName } from "../../utils/constants";

import { AbbreviateNumber } from "../../shared/";

import { fetchDataFromApi } from "../../utils/api";
import { AppContext } from "../../context/contextApi";

const ChannelSwitch = () => {
  let { page, id } = useParams();
  const navigate = useNavigate();
  const { setLoading } = useContext(AppContext);

  const [channelDetails, setChannelDetails] = useState();
  const [channelVideos, setChannelVideos] = useState([]);
  const [channelCommunity, setChannelCommunity] = useState([]);

  const [data, setData] = useState({ subscriptions: [], channels: [] });

  const fetchChannelDetail = useCallback(() => {
    setLoading(true);
    fetchDataFromApi(`channel/details/?id=${id}`).then((res) => {
      setChannelDetails(res);
      setLoading(false);
    });
  }, [id]);

  const fetchChannelVideo = useCallback(() => {
    setLoading(true);
    fetchDataFromApi(`channel/videos/?id=${id}`).then(({ contents }) => {
      setChannelVideos(contents);
      setLoading(false);
    });
  }, [id]);

  const fetchChannelCommunity = useCallback(() => {
    setLoading(true);
    fetchDataFromApi(`channel/community/?id=${id}`).then(({ contents }) => {
      setChannelCommunity(contents);
      setLoading(false);
    });
  }, [id]);

  const fetchData = useCallback(async () => {
    try {
      const options = {
        headers: {
          "X-RapidAPI-Key":
            process.env.REACT_APP_YOUTUBE_API_KEY || "YOUR_API_KEY",
          "X-RapidAPI-Host": "youtube138.p.rapidapi.com",
        },
      };

      const apiUrl1 = `https://youtube138.p.rapidapi.com/channel/channels/?id=${id}`;

      const response1 = await fetch(apiUrl1, options);
      const responseData1 = await response1.json();

      const apiUrls = [];
      const responseData1Length = responseData1.collections.length;

      for (let i = 0; i < responseData1Length; i++) {
        const dataIU = responseData1.collections[i].filter;
        const urlFake = `https://youtube138.p.rapidapi.com/channel/channels/?id=${id}&filter=${dataIU}`;
        apiUrls.push(urlFake);
      }

      const responseData2 = [];
      const responseData3 = [];

      for (let i = 0; i < apiUrls.length; i++) {
        const apiUrl = apiUrls[i];
        const response = await fetch(apiUrl, options);

        const responseData = await response.json();

        if (i === 0) {
          responseData2.push(responseData);
        } else if (i === 1) {
          responseData3.push(responseData);
        }
      }

      setData({ subscriptions: responseData2, channels: responseData3 });
    } catch (error) {
      console.error("Error:", error);
    }
  }, [id]);

  useEffect(() => {
    document.getElementById("root").classList.remove("custom-h");
    fetchChannelDetail();
    fetchChannelVideo();
    fetchChannelCommunity();
    fetchData();
  }, [
    id,
    fetchChannelDetail,
    fetchChannelVideo,
    fetchChannelCommunity,
    fetchData,
  ]);

  const [selectedTab, setSelectedTab] = useState(indexToTabName[page]);

  const handleChange = (event, newValue) => {
    navigate(`/channel/${id}/${tabNameToIndex[newValue]}`);
    setSelectedTab(newValue);
  };

  const handleClick = () => {
    navigate(`/channel/${id}/${tabNameToIndex[5]}`);
    setSelectedTab(5);
  };

  return (
    <div className="flex flex-row h-[calc(100%-56px)]">
      <LeftNav />
      <div className="grow w-[calc(100%-240px)] h-full overflow-y-auto bg-black">
        <div className="w-full">
          <div>
            <img
              src={channelDetails?.banner?.desktop[0]?.url}
              alt=""
              className="w-full"
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex w-10/12 m-auto justify-between">
              <div className="flex">
                <div>
                  <img
                    src={channelDetails?.avatar[0]?.url}
                    alt=""
                    className="rounded-full w-20"
                  />
                </div>
                <div className="text-white ml-7 flex flex-col justify-center leading-loose">
                  <div className="flex items-center text-3xl">
                    <span className="mr-1">{channelDetails?.title}</span>
                    {channelDetails?.badges[0]?.type === "VERIFIED_CHANNEL" && (
                      <BsFillCheckCircleFill className="text-white/[0.5] text-[12px] ml-1" />
                    )}
                    {channelDetails?.badges[0]?.type ===
                      "OFFICIAL_ARTIST_CHANNEL" && (
                      <IoMdMusicalNote className="text-white/[0.5] text-[12px] ml-1" />
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-4 text-white/[0.8]">
                      {channelDetails?.username}
                    </span>
                    <span className="mr-4 flex text-white/[0.7]">
                      <AbbreviateNumber type="subscribers">
                        {channelDetails?.stats?.subscribers}
                      </AbbreviateNumber>
                    </span>
                    <span className="mr-4 flex text-white/[0.7]">
                      <AbbreviateNumber type="videos">
                        {channelDetails?.stats?.videos}
                      </AbbreviateNumber>
                    </span>
                  </div>
                  <button className="flex items-center" onClick={handleClick}>
                    <span className="mr-2 text-white/[0.7]">
                      Learn more about this channel
                    </span>
                    <IoIosArrowForward />
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <button className="rounded-full bg-white p-2">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "rgb(255 255 255 / 0.2)",
              position: "sticky",
              top: 0,
              zIndex: 1,
              background: "#000",
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              aria-label="basic tabs example"
              style={{ width: "83%", margin: "auto" }}
            >
              <Tab
                label="Home"
                style={{ color: "rgb(255,255,255, 0.8)", marginRight: "24px" }}
              />
              <Tab label="Video" style={{ color: "rgb(255,255,255, 0.8)" }} />
              <Tab
                label="Playlist"
                style={{ color: "rgb(255,255,255, 0.8)", margin: "0 24px" }}
              />
              <Tab
                label="Community"
                style={{ color: "rgb(255,255,255, 0.8)", margin: "0 24px" }}
              />
              <Tab
                label="Channel"
                style={{ color: "rgb(255,255,255, 0.8)", margin: "0 24px" }}
              />
              <Tab
                label="About"
                style={{ color: "rgb(255,255,255, 0.8)", margin: "0 24px" }}
              />
            </Tabs>
          </Box>

          {selectedTab === 0 && <ChannelDetails />}
          {selectedTab === 1 && <ChannelVideos videos={channelVideos} />}
          {selectedTab === 2 && <ChannelPlaylists id={id} />}
          {selectedTab === 3 && (
            <ChannelCommunity communities={channelCommunity} />
          )}
          {selectedTab === 4 && <ChannelChannels data={data} />}
          {selectedTab === 5 && <ChannelAbout details={channelDetails} />}
        </div>
      </div>
    </div>
  );
};

export default memo(ChannelSwitch);

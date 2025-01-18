import { useEffect, useState } from "react";
import { MONGO_READ_URL } from "../const/config";

export const MongoDoc = () => {
  const [chatBotData, setchatBotData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      await fetch(MONGO_READ_URL || null)
        .then((response) => {
          if (!response.ok) {
            // Handle HTTP errors
            // setLoading(false);
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data?.foundResult?.departments) {
            console.log(data);
            setchatBotData(data.foundResult);
          } else {
            // Handle invalid data structure
            throw new Error("Received data has an invalid structure");
          }
          setLoading(false);
        })
        .catch((error) => {
          // Handle different error scenarios
          if (error.message.startsWith("HTTP error")) {
            setError(
              "Failed to fetch data from server. Please try again later."
            );
          } else if (
            error.message === "Received data has an invalid structure"
          ) {
            setError("Received data is not in the expected format.");
          } else if (error.message === "Failed to fetch") {
            setError("Network error. Please check your internet connection.");
          } else {
            setError("An unexpected error occurred. Please try again later.");
          }
          setLoading(false);
        });
    };

    getData();
  }, []);
  // console.log(chatBotData);
  const chatBotObject = {
    chatBotData: chatBotData,
    loading: loading,
    error: error,
  };
  // console.log(chatBotObject);

  return chatBotObject;
};

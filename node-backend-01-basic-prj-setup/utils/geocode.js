const axios = require("axios");
const HttpError = require("../models/http-error");

const API_KEY =
  "pk.eyJ1IjoiZ3JhbmQ3MTkiLCJhIjoiY2t3NWR3bTg5MXdiZzJucm9hNXBobXZyMCJ9.wSh5pk-UM5pmP8_bq9UfHg";

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${API_KEY}`
  );

  const data = response.data;
  

  if (!data) {
    const error = new HttpError(
      "could not find location for the specified address.",
      422
    );

    throw error;
  }

  const coordinates = {
      lng: data.features[0].center[0],
      lat: data.features[0].center[1]
  }

  return coordinates;
}

module.exports = getCoordsForAddress;


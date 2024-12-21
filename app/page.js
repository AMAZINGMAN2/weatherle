
"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const CAPITALS = ["kabul", "algiers", "buenos aires", "canberra", "vienna", "baku", "nassau", "manama", "dhaka", "bridgetown", "minsk", "brussels", "belmopan", "sarajevo", "brasilia", "sofia", "ouagadougou", "bujumbura", "ottawa", "praia", "george town", "bangui", "santiago", "beijing", "brazzaville", "san jose", "yamoussoukro", "zagreb", "havana", "nicosia", "prague", "kinshasa", "copenhagen", "djibouti", "roseau", "santo domingo", "dili", "quito", "cairo", "san salvador", "malabo", "asmara", "tallinn", "addis ababa", "stanley", "torshavn", "suva", "helsinki", "paris", "cayenne", "papeete", "libreville", "banjul", "berlin", "accra", "athens", "nuuk", "guatemala", "st. peter port", "bissau", "georgetown", "budapest", "reykjavik", "new delhi", "jakarta", "tehran", "baghdad", "dublin", "rome", "kingston", "amman", "astana", "nairobi", "tarawa", "kuwait", "bishkek", "vientiane", "riga", "beirut", "maseru", "monrovia", "tripoli", "vaduz", "vilnius", "luxembourg", "antananarivo", "kuala lumpur", "male", "bamako", "valletta", "mexico", "palikir", "maputo", "yangon", "windhoek", "kathmandu", "amsterdam", "willemstad", "noumea", "wellington", "managua", "niamey", "abuja", "kingston", "pyongyang", "saipan", "oslo", "masqat", "islamabad", "panama", "asuncion", "lima", "manila", "warsaw", "lisbon", "san juan", "doha", "seoul", "bucuresti", "moskva", "kigali", "basseterre", "castries", "saint-pierre", "kingstown", "apia", "san marino", "sao tome", "riyadh", "dakar", "bratislava", "ljubljana", "honiara", "mogadishu", "madrid", "khartoum", "paramaribo", "mbabane", "stockholm", "bern", "damascus", "dushanbe", "bangkok", "lome", "tunis", "ankara", "ashgabat", "funafuti", "kampala", "kiev", "abu dhabi", "london", "dodoma", "washington dc", "charlotte amalie", "montevideo", "tashkent", "port-vila", "caracas", "hanoi", "belgrade", "lusaka"];

  const [errorMessage, setErrorMessage] = useState("");
  const [guess, setGuess] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [gameState, setGameState] = useState("playing");
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // New state for the popup
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the popup
    const hasSeenPopup = localStorage.getItem("hasSeenPopup");
    if (!hasSeenPopup) {
      setShowPopup(true); // Show the popup if it's their first visit
      localStorage.setItem("hasSeenPopup", "true"); // Mark as seen
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('https://weatherleworker.hashimownemail.workers.dev/');
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const handleGuess = async (e) => {
    e.preventDefault();
    if (!guess || attempts.length >= 6 || gameState !== "playing") return;

    if (!CAPITALS.includes(guess.toLowerCase())) {
      setErrorMessage("Not a valid capital city. Please try again.");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    try {
      const response = await fetch("https://weatherleworker.hashimownemail.workers.dev/", {
        method: "POST",
        body: JSON.stringify({ guess }),
      });
      const result = await response.json();

      const newAttempt = {
        city: guess,
        distance: result.distance,
        direction: result.direction,
        correct: result.correct,
      };

      const newAttempts = [...attempts, newAttempt];
      setAttempts(newAttempts);
      setGuess("");
      setSuggestions([]);

      if (result.correct) {
        setGameState("won");
      } else if (newAttempts.length >= 6) {
        setGameState("lost");
      }
    } catch (error) {
      console.error("Failed to submit guess:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setGuess(value);

    if (value.length > 0) {
      const filteredSuggestions = CAPITALS.filter((capital) =>
        capital.startsWith(value)
      ).slice(0, 10);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setGuess(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {showPopup && (
        <div className="fixed inset-0 bg-black/[.5] flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 py-[4vh] px-[4vh] rounded-lg shadow-lg max-w-lg text-center">
            <h2 className="text-4xl font-bold mb-4 text-neutral-800 dark:text-white">Welcome to WeatherLe!</h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-6">
              Guess the capital city based on the weather forcast! Enter a capital city's name into the input box. 
              If your guess is incorrect, you'll see how far and in which direction the correct city is located. 
              You have 6 attempts to find the correct answer. Good luck!
            </p>
            <button
              onClick={handleClosePopup}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-4xl">
        <h1 className="text-7xl pb-4 font-bold">
          <span className="inline-block text-7xl bg-gradient-to-r from-blue-500 to-pink-500 text-transparent bg-clip-text">Weather</span>
          <span className="inline-block text-7xl bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">Le</span>
        </h1>

        {isLoading ? (
          <p>Loading weather data...</p>
        ) : weatherData && weatherData.hourlyData && weatherData.hourlyData.length > 0 ? (
          <>
            <div className="w-full bg-black/[.05] text-neutral-600 dark:bg-white/[.06] p-6 rounded-lg">
              <h2 className="text-lg mb-4 text-neutral-800 dark:text-white">24-Hour Temperature Forecast</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer>
                  <LineChart
                    data={weatherData.hourlyData.map((hour, i) => ({
                      time: i,
                      temp: hour.temp_c,
                    })).slice(0, 24)}
                  >
                    <XAxis dataKey="time" label={{ value: 'Hours', position: 'bottom', offset: -8 }} />
                    <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'left', offset: -8 }} />
                    <Tooltip formatter={(value) => `${value}°C`} labelFormatter={(label) => `Hour : ${label}`} />
                    <Line type="monotone" dataKey="temp" stroke="#8884d8" dot={false} name="Temperature" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <form onSubmit={handleGuess} className="w-full">
              <input
                type="text"
                value={guess}
                onChange={handleInputChange}
                placeholder="Enter a capital city"
                className="w-full p-4 border rounded dark:bg-[#262626] dark:border-white/[.145] mb-2"
                disabled={gameState !== "playing"}
              />

              {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-neutral-700 border border-gray-600 rounded shadow-md max-h-40 max-w-xs overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-neutral-600 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
              {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
              <button
                type="submit"
                className="w-full rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#cccccc] text-sm sm:text-base h-12 px-5"
                disabled={gameState !== "playing"}
              >
                Make a Guess
              </button>
            </form>

            <div className="w-full space-y-2">
              {attempts.map((attempt, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    attempt.correct ? "bg-green-500 text-white" : "bg-black/[.05] dark:bg-white/[.06]"
                  }`}
                >
                  <p className="font-bold">{attempt.city}</p>
                  <p className="text-sm">
                    {attempt.distance}Km {attempt.direction}
                  </p>
                </div>
              ))}
            </div>

            {gameState !== "playing" && (
              <div className="w-full p-4 text-center bg-black/[.05] dark:bg-white/[.06] rounded-lg">
                <p className="text-xl font-bold mb-2">
                  {gameState === "won" ? "Congratulations!" : "Game Over!"}
                </p>
                <p>The correct city was: {weatherData.city}</p>
              </div>
            )}
          </>
        ) : (
          <p>No weather data available!</p>
        )}
      </main>
    </div>
  );
}

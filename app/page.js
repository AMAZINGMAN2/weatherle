"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const CAPITALS = [
"kabul", "algiers", "buenos aires", "canberra", "vienna", "baku", "nassau", "manama", "dhaka", "bridgetown", "minsk", "brussels", "belmopan", "sarajevo", "brasilia", "sofia", "ouagadougou", "bujumbura", "ottawa", "praia", "george town", "bangui", "santiago", "beijing", "brazzaville", "san jose", "yamoussoukro", "zagreb", "havana", "nicosia", "prague", "kinshasa", "copenhagen", "djibouti", "roseau", "santo domingo", "dili", "quito", "cairo", "san salvador", "malabo", "asmara", "tallinn", "addis ababa", "stanley", "torshavn", "suva", "helsinki", "paris", "cayenne", "papeete", "libreville", "banjul", "berlin", "accra", "athens", "nuuk", "guatemala", "st. peter port", "bissau", "georgetown", "budapest", "reykjavik", "new delhi", "jakarta", "tehran", "baghdad", "dublin", "rome", "kingston", "amman", "astana", "nairobi", "tarawa", "kuwait", "bishkek", "vientiane", "riga", "beirut", "maseru", "monrovia", "tripoli", "vaduz", "vilnius", "luxembourg", "antananarivo", "kuala lumpur", "male", "bamako", "valletta", "mexico", "palikir", "maputo", "yangon", "windhoek", "kathmandu", "amsterdam", "willemstad", "noumea", "wellington", "managua", "niamey", "abuja", "kingston", "pyongyang", "saipan", "oslo", "masqat", "islamabad", "panama", "asuncion", "lima", "manila", "warsaw", "lisbon", "san juan", "doha", "seoul", "bucuresti", "moskva", "kigali", "basseterre", "castries", "saint-pierre", "kingstown", "apia", "san marino", "sao tome", "riyadh", "dakar", "bratislava", "ljubljana", "honiara", "mogadishu", "madrid", "khartoum", "paramaribo", "mbabane", "stockholm", "bern", "damascus", "dushanbe", "bangkok", "lome", "tunis", "ankara", "ashgabat", "funafuti", "kampala", "kiev", "abu dhabi", "london", "dodoma", "washington dc", "charlotte amalie", "montevideo", "tashkent", "port-vila", "caracas", "hanoi", "belgrade", "lusaka"
  ]
  const [errorMessage, setErrorMessage] = useState("");
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [gameState, setGameState] = useState("playing");
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

    if (result.correct) {
      setGameState("won");
    } else if (newAttempts.length >= 6) {
      setGameState("lost");
    }
  } catch (error) {
    console.error("Failed to submit guess:", error);
  }
};

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-4xl">
        <h1 className="text-6xl font-bold">Weatherle</h1>

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
                      temp: hour.temp_c
                    })).slice(0, 24)}
                  >
                    <XAxis dataKey="time" label={{ value: 'Hours', position: 'bottom', offset: -8 }} />
                    <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'left', offset: -8 }} />
                    <Tooltip formatter={(value) => `${value}°C`} labelFormatter={(label) => `Hour : ${label}`} />
                    <Line 
                      type="monotone" 
                      dataKey="temp" 
                      stroke="#8884d8" 
                      dot={false}
                      name="Temperature"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          <form onSubmit={handleGuess} className="w-full">
          <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter a capital city"
          className="w-full p-4 border rounded dark:bg-[#262626] dark:border-white/[.145] mb-2"
          disabled={gameState !== "playing"}
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
          )}
          <button
          type="submit"
          className="w-full rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-12 px-5"
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
                    attempt.correct
                      ? "bg-green-500 text-white"
                      : "bg-black/[.05] dark:bg-white/[.06]"
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
          <p>No weather data available.</p>
        )}
      </main>
    </div>
  );
}

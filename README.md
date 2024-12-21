# Weatherle

### Play the daily Weatherle in https://weatherle.pages.dev/

### Overview
Weatherle is a weather-based guessing game where you try to guess the capital city based on its weather data. The game retrieves weather data for various cities, and you have to guess which city the data corresponds to. Each time you make a guess, it provides information about the distance and direction from the actual city. You have a total of 6 attempts to guess the correct city.

### Features
- **Weather Data**: Fetches real-time weather data for various cities.
- **Guessing Game**: Guess the capital city based on the temperature data.
- **Interactive UI**: Displays temperature data over 24 hours and shows the result of each guess.

### Tech Stack
- **Frontend**: 
  - Next.js (React Framework)
  - Tailwind CSS (Utility-first CSS framework)
  - Recharts (For rendering temperature chart)
  
- **Backend**:
  - https://www.weatherapi.com

### Requirements
- Node.js v18.17.1 or later (For deployment on cloudflare)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AMAZINGMAN2/weatherle.git
   cd weatherle
   ```

2. **Install dependencies:**
   ```bash
   npm i
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   This will start the Next.js development server on `http://localhost:3000`.


### Deployment

This project is deployed using Cloudflare Pages. A Demo can be played in [https://weatherle.pages.dev/](https://weatherle.pages.dev/).
### Contributing

Feel free to fork the repository and submit issues or pull requests. Contributions are always welcome!

### License

This project is open-source and available under the MIT License.

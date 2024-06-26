<template>
  <div id="app">
    <h1>Baby Feeding Calculator</h1>
    <form @submit.prevent="calculateFeed">
      <div>
        <label for="latestFeedTime">Latest Feed Time:</label>
        <input type="datetime-local" v-model="latestFeedTime" required />
      </div>
      <div>
        <label for="babyWeight">Baby Weight (g):</label>
        <input type="number" v-model="babyWeight" step="1" required />
      </div>
      <div>
        <label for="amountFedSoFar">Amount Fed Since Midnight (ml):</label>
        <input type="number" v-model="amountFedSinceMidnight" step="0.01" required />
      </div>
      <button type="submit">Calculate</button>
    </form>
    <div v-if="feedAmount !== null">
      <h2>Feed Amount Needed for the Rest of the Day: {{ feedAmount }} ml</h2>
    </div>
    <div v-if="amountLeftToFeed !== null">
      <h2>Feed Amount Needed Up to Now: {{ amountLeftToFeed }} ml</h2>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const latestFeedTime = ref(null);
const babyWeight = ref(null);
const amountFedSinceMidnight = ref(null);
const feedAmount = ref(null);
const amountLeftToFeed = ref(null);

const calculateFeed = () => {
  const babyWeightInGrams = parseFloat(babyWeight.value);
  const amountFedSinceMidnightValue = parseFloat(amountFedSinceMidnight.value);

  // Convert baby weight to kilograms
  const babyWeightInKg = babyWeightInGrams / 1000;

  // Assuming the baby needs 120 calories per kg of body weight per day
  const dailyCalorieRequirement = 120 * babyWeightInKg;

  // Convert daily calorie requirement to ounces (20 calories per ounce)
  const dailyFeedRequirementInOunces = dailyCalorieRequirement / 20;

  // Convert ounces to milliliters
  const dailyFeedRequirementInMl = dailyFeedRequirementInOunces * 29.5735;

  // Calculate the time elapsed since midnight in hours
  const currentTime = new Date();
  const midnight = new Date(currentTime);
  midnight.setHours(0, 0, 0, 0);
  const timeElapsedSinceMidnightInHours = (currentTime - midnight) / (1000 * 60 * 60);

  // Calculate the portion of the daily requirement that should have been fed up to now
  const hourlyFeedRequirement = dailyFeedRequirementInMl / 24;
  const feedRequirementUpToNow = hourlyFeedRequirement * timeElapsedSinceMidnightInHours;

  // Calculate the amount left to feed up to now and round to the nearest ml
  amountLeftToFeed.value = Math.round(feedRequirementUpToNow - amountFedSinceMidnightValue);

  // Calculate the feed amount needed for the rest of the day and round to the nearest ml
  feedAmount.value = Math.round(dailyFeedRequirementInMl - amountFedSinceMidnightValue);
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}

form {
  margin-bottom: 20px;
}

form div {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  padding: 5px;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #369c77;
}
</style>

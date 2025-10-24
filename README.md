# Seesaw Simulation Game

A simple interactive physics-based web game built using **HTML**, **CSS**, and **JavaScript**.
Click on the seesaw to drop colored balls of random weights and observe how the seesaw tilts based on the torque generated on each side.
All game data is automatically saved in the browser using **localStorage**.

---

## Features

* **Realistic torque simulation** – each ball affects the seesaw angle depending on its distance and weight.
* **Randomized appearance** – every ball has a random size, weight, and color.
* **Persistent game state** – automatically saves and restores progress using localStorage.
* **Reset function** – easily clear the seesaw and start again.
* **Live statistics** – dynamically displays left weight, right weight, net weight, and current seesaw angle.

---

## How It Works

1. Click anywhere on the seesaw to add a new ball.

2. The clicked side determines whether torque is applied to the left or right.

3. Each ball is assigned:

   * A random **weight** between 1 and 10
   * A **size** proportional to its weight
   * A random **color**

4. Torque is calculated as:

   ```
   torque = weight × distance_from_center × scale_factor
   ```

5. The seesaw tilts up to ±30° depending on the torque difference between both sides.

---

## Project Structure

```
├── index.html      # Game layout and user interface
├── style.css       # Styling and animation
└── script.js       # Game logic and torque calculations
```

---

## Technologies Used

* **HTML5**
* **CSS3** (Flexbox, transitions, and shadows)
* **JavaScript (ES6)** – DOM manipulation, event handling, and localStorage API

---

## Running the Game

1. Clone or download the repository.
2. Open the `index.html` file in any modern web browser.
3. Click on the seesaw to start playing.

---

## Resetting the Game

Press the **Reset** button to:

* Remove all existing balls
* Reset torque and angle values
* Clear saved data from localStorage

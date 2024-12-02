const express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './BD4_Assignment_Latest/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function getAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

async function getRestaurantBYId(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [id]);
  return { restaurants: response };
}

async function getRestaurantBYCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

async function getRestaurantBYFilterData(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

async function getAllRestaurantsByOrder() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}

async function getAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

async function getDishesBYId(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]);
  return { dishes: response };
}

async function getDishesBYFilterData(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

async function getDishesBySortedOrder() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let results = await getAllRestaurants();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'not found restaurants' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.get('/restaurants/details', async (req, res) => {
  try {
    let id = parseFloat(req.query.id);
    let results = await getRestaurantBYId(id);
    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: `not found restaurants for ${id}` });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.get('/restaurants/cuisine', async (req, res) => {
  try {
    let cuisine = req.query.cuisine;
    let results = await getRestaurantBYCuisine(cuisine);
    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: `not found restaurants for ${cuisine}` });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.get('/restaurants/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;
    let results = await getRestaurantBYFilterData(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'not found restaurants for Filter' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await getAllRestaurantsByOrder();
    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'not found restaurants for sorting' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.get('/dishes', async (req, res) => {
  try {
    let results = await getAllDishes();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'not found dishes' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.get('/dishes/details', async (req, res) => {
  try {
    let id = parseFloat(req.query.id);
    let results = await getDishesBYId(id);
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: `not found dishes for ${id}` });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.get('/dishes/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let results = await getDishesBYFilterData(isVeg);
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'not found dishes for Filter' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await getDishesBySortedOrder();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'dishes in not found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

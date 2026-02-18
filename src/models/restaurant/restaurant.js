const restaurants = {
  "rest_001": {
    id: "rest_001",
    name: "Hip Sip",
    rating: { score: 4.5, count: 50 },
    distanceMiles: 0.3,
    deliveryTimeMinutes: "20–30",
    deliveryFee: 1.49,
    discount: { type: "percentage", value: 20, description: "20% off $15+" },
    priceRange: "$$",
    isOpen: true,
    images: [
      "images/hip-sip1.jpg",
      "images/hip-sip2.jpg",
      "images/hip-sip3.jpg",
    ],
    tags: ["Cafe", "Desserts", "Drinks"],
  },
  "rest_002": {
    id: "rest_002",
    name: "Burger Kingdom",
    rating: { score: 4.2, count: 120 },
    distanceMiles: 1.1,
    deliveryTimeMinutes: "25–35",
    deliveryFee: 0,
    discount: null,
    priceRange: "$",
    isOpen: true,
    images: [
      "images/burger-kingdom1.jpg",
      "images/burger-kingdom2.jpg",
      "images/burger-kingdom3.jpg",
    ],
    tags: ["Burgers", "Fast Food"],
  },
  "rest_003": {
    id: "rest_003",
    name: "Green Bowl",
    rating: { score: 4.8, count: 230 },
    distanceMiles: 2.0,
    deliveryTimeMinutes: "30–40",
    deliveryFee: 2.99,
    discount: { type: "flat", value: 5, description: "$5 off $25+" },
    priceRange: "$$$",
    isOpen: false,
    images: [
      "images/green-bowl1.jpg",
      "images/green-bowl2.jpg",
      "images/green-bowl3.jpg",
    ],
    tags: ["Healthy", "Salads", "Vegan"],
  },
  "rest_004": {
    id: "rest_004",
    name: "Golden Wok",
    rating: { score: 4.4, count: 180 },
    distanceMiles: 1.6,
    deliveryTimeMinutes: "25–40",
    deliveryFee: 1.99,
    discount: null,
    priceRange: "$$",
    isOpen: true,
    images: [
      "images/golden-wok1.jpg",
      "images/golden-wok2.jpg",
      "images/golden-wok3.jpg",
    ],
    tags: ["Chinese", "Asian"],
  },
  "rest_005": {
    id: "rest_005",
    name: "Slice Haven",
    rating: { score: 4.6, count: 310 },
    distanceMiles: 0.9,
    deliveryTimeMinutes: "20–30",
    deliveryFee: 0.99,
    discount: {
      type: "percentage",
      value: 15,
      description: "15% off orders $20+",
    },
    priceRange: "$",
    isOpen: true,
    images: [
      "images/slice-haven1.jpg",
      "images/slice-haven2.jpg",
      "images/slice-haven3.jpg",
    ],
    tags: ["Pizza", "Italian"],
  },
  "rest_006": {
    id: "rest_006",
    name: "Taco Fiesta",
    rating: { score: 4.3, count: 140 },
    distanceMiles: 1.3,
    deliveryTimeMinutes: "20–35",
    deliveryFee: 1.49,
    discount: null,
    priceRange: "$",
    isOpen: true,
    images: [
      "images/taco-fiesta1.jpg",
      "images/taco-fiesta2.jpg",
      "images/taco-fiesta3.jpg",
    ],
    tags: ["Mexican", "Tacos"],
  },
  "rest_007": {
    id: "rest_007",
    name: "Seoul Street",
    rating: { score: 4.7, count: 95 },
    distanceMiles: 2.5,
    deliveryTimeMinutes: "30–45",
    deliveryFee: 2.49,
    discount: { type: "flat", value: 4, description: "$4 off $30+" },
    priceRange: "$$",
    isOpen: true,
    images: [
      "images/seoul-street1.jpg",
      "images/seoul-street2.jpg",
      "images/seoul-street3.jpg",
    ],
    tags: ["Korean", "BBQ"],
  },
  "rest_008": {
    id: "rest_008",
    name: "Pho Corner",
    rating: { score: 4.9, count: 420 },
    distanceMiles: 1.8,
    deliveryTimeMinutes: "25–40",
    deliveryFee: 1.99,
    discount: null,
    priceRange: "$$",
    isOpen: true,
    images: [
      "images/pho-corner1.jpg",
      "images/pho-corner2.jpg",
      "images/pho-corner3.jpg",
    ],
    tags: ["Vietnamese", "Noodles"],
  },
  "rest_009": {
    id: "rest_009",
    name: "Curry Leaf",
    rating: { score: 4.1, count: 60 },
    distanceMiles: 3.0,
    deliveryTimeMinutes: "35–50",
    deliveryFee: 3.49,
    discount: null,
    priceRange: "$$",
    isOpen: true,
    images: [
      "images/curry-leaf1.jpg",
      "images/curry-leaf2.jpg",
      "images/curry-leaf3.jpg",
    ],
    tags: ["Indian", "Curry"],
  },
  "rest_010": {
    id: "rest_010",
    name: "Sushi Go",
    rating: { score: 4.6, count: 275 },
    distanceMiles: 2.2,
    deliveryTimeMinutes: "30–45",
    deliveryFee: 2.99,
    discount: { type: "percentage", value: 10, description: "10% off $25+" },
    priceRange: "$$$",
    isOpen: true,
    images: [
      "images/sushi-go1.jpg",
      "images/sushi-go2.jpg",
      "images/sushi-go3.jpg",
    ],
    tags: ["Japanese", "Sushi"],
  },
  "rest_011": {
    id: "rest_011",
    name: "Morning Brew",
    rating: { score: 4.4, count: 88 },
    distanceMiles: 0.5,
    deliveryTimeMinutes: "15–25",
    deliveryFee: 0,
    discount: null,
    priceRange: "$",
    isOpen: true,
    images: [
      "images/morning-brew1.jpg",
      "images/morning-brew2.jpg",
      "images/morning-brew3.jpg",
    ],
    tags: ["Coffee", "Breakfast"],
  },
  "rest_012": {
    id: "rest_012",
    name: "Fire Grill",
    rating: { score: 4.0, count: 70 },
    distanceMiles: 3.4,
    deliveryTimeMinutes: "35–50",
    deliveryFee: 3.99,
    discount: null,
    priceRange: "$$",
    isOpen: false,
    images: [
      "images/fire-grill1.jpg",
      "images/fire-grill2.jpg",
      "images/fire-grill3.jpg",
    ],
    tags: ["American", "Grill"],
  },
  "rest_013": {
    id: "rest_013",
    name: "Sweet Cravings",
    rating: { score: 4.8, count: 155 },
    distanceMiles: 1.0,
    deliveryTimeMinutes: "20–30",
    deliveryFee: 1.29,
    discount: { type: "flat", value: 3, description: "$3 off desserts" },
    priceRange: "$",
    isOpen: true,
    images: [
      "images/sweet-cravings1.jpg",
      "images/sweet-cravings2.jpg",
      "images/sweet-cravings3.jpg",
    ],
    tags: ["Desserts", "Bakery"],
  },
  "rest_014": {
    id: "rest_014",
    name: "Mediterraneo",
    rating: { score: 4.5, count: 110 },
    distanceMiles: 2.7,
    deliveryTimeMinutes: "30–45",
    deliveryFee: 2.49,
    discount: null,
    priceRange: "$$",
    isOpen: true,
    images: [
      "images/mediterraneo1.jpg",
      "images/mediterraneo2.jpg",
      "images/mediterraneo3.jpg",
    ],
    tags: ["Mediterranean", "Healthy"],
  },
  "rest_015": {
    id: "rest_015",
    name: "Wing Stopper",
    rating: { score: 4.1, count: 205 },
    distanceMiles: 1.4,
    deliveryTimeMinutes: "25–35",
    deliveryFee: 0.99,
    discount: { type: "percentage", value: 10, description: "10% off wings" },
    priceRange: "$",
    isOpen: true,
    images: [
      "images/wing-stopper1.jpg",
      "images/wing-stopper2.jpg",
      "images/wing-stopper3.jpg",
    ],
    tags: ["Wings", "Fast Food", "Chicken"],
  },
};

const getAllRestaurant = () => {
    return restaurants;
}

const getTopRestaurant = () => {
    const topRestaurantArray = [];

    Object.values(restaurants).forEach((res) => {
        if (res.rating.score >= 4.5) {
            topRestaurantArray.push(res);
        }
    })

    return topRestaurantArray;
}

const getNearRestaurant = () => {
    const nearRestaurantArray = [];
    Object.values(restaurants).forEach((res) => {
        if(res.distanceMiles <= 2.0) {
            nearRestaurantArray.push(res);
        }
    })

    return nearRestaurantArray;
}

const getDealRestaurant = () => {
    const dealRestaurantArray = [];
    Object.values(restaurants).forEach((res) => {
        if (res.discount) {
            dealRestaurantArray.push(res);
        }
    })

    return dealRestaurantArray;
}

const getRestaurantById = (resId) => {
  return restaurants[resId] || null;
}

export {getAllRestaurant, getDealRestaurant, getNearRestaurant, getTopRestaurant, getRestaurantById};




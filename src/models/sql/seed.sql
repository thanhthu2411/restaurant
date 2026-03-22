-- This file creates tables and inserts all initial data

BEGIN;

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS cart_dish CASCADE;
DROP TABLE IF EXISTS order_dish CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS dishes CASCADE;
DROP TABLE IF EXISTS restaurant_category CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS deals CASCADE;
DROP TABLE IF EXISTS order_status CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS order_status CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(100),
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) DEFAULT 3 ON DELETE SET DEFAULT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE deals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    expiration_date TIMESTAMP,
    amount DECIMAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NULL REFERENCES users(id) ON DELETE SET NULL,
    deal_id INTEGER NULL REFERENCES deals(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    open_hour TIME DEFAULT '08:00:00',
    close_hour TIME DEFAULT '22:00:00',
    delivery_fee DECIMAL(10,2) DEFAULT 3.99,
    delivery_minutes INTEGER DEFAULT 15,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurant_category (
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (restaurant_id, category_id)
);


CREATE TABLE dishes (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id INTEGER NULL REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE order_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) CHECK (status IN ('confirmed', 'preparing', 'delivered', 'shipped')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NULL REFERENCES users(id) ON DELETE SET NULL,
    restaurant_id INTEGER NULL REFERENCES restaurants(id) ON DELETE SET NULL,
    status_id INTEGER NOT NULL REFERENCES order_status(id),
    subtotal DECIMAL(10,2),
    total DECIMAL(10,2),
    delivery_fee DECIMAL(10,2) DEFAULT 3.99,
    delivery_minutes INTEGER DEFAULT 15,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_dish (
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    dish_id INTEGER REFERENCES dishes(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    order_price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_id, dish_id));


CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE cart
ADD CONSTRAINT unique_user_cart UNIQUE (user_id);

CREATE TABLE cart_dish (
    cart_id INTEGER REFERENCES cart(id) ON DELETE CASCADE,
    dish_id INTEGER REFERENCES dishes(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 CHECK(quantity>=0),
    PRIMARY KEY (cart_id, dish_id));

CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id INTEGER NULL REFERENCES users(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating < 6 AND rating > 0),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS contact_form (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- insert data into tables
INSERT INTO roles (role_name, role_description) VALUES
    ('admin', 'Administrator with full system access'),
    ('owner', 'Restaurant owner with control over their restaurnt'),
    ('user', 'Standard user with basic access');

INSERT INTO categories (category_name, slug) VALUES
    ('burgers', 'burgers'),
    ('bbq', 'bbq'),
    ('seafood', 'seafood'),
    ('noodles', 'noodles'),
    ('ramen', 'ramen'),
    ('sushi', 'sushi'),
    ('thai', 'thai'),
    ('korean', 'korean'),
    ('indian', 'indian'),
    ('mediterranean', 'mediterranean'),
    ('italian', 'italian'),
    ('sandwiches', 'sandwiches'),
    ('salads', 'salads'),
    ('dessert', 'dessert'),
    ('bakery', 'bakery'),
    ('coffee', 'coffee'),
    ('breakfast', 'breakfast'),
    ('brunch', 'brunch'),
    ('healthy', 'healthy'),
    ('vegetarian', 'vegetarian'),
    ('gluten free', 'gluten-free'),
    ('family meals', 'family-meals'),
    ('late night', 'late-night'),
    ('wings', 'wings'),
    ('tacos', 'tacos'),
    ('bubble tea', 'bubble-tea'),
    ('smoothies', 'smoothies');

INSERT INTO deals (name, code, description, expiration_date, amount) VALUES
    ('$5 off', '5OFF', '$5 OFF for Total Order', '2026-12-31', 5.00),
    ('$15 off', '15OFF', '$15 OFF for Total Order', '2026-12-01', 15.00),
    ('$10 off', '10OFF', '$10 OFF for Total Order', '2026-12-01', 10.00);

INSERT INTO users (role_id, name, email, password, address) VALUES
    (2, 'Bubble Home Owner', 'bubblehome.owner@example.com', '$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O', '123 Boba St'),
    (2, 'Cake Paradise Owner', 'cakeparadise.owner@example.com', '$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O', '456 Sweet Ave'),
    (2, 'Chicken House Owner', 'chickenhouse.owner@example.com', '$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O', '789 Fried Rd'),
    (2, 'Curry Puff Owner', 'currypuff.owner@example.com', '$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O', '321 Thai Ln'),
    (2, 'Hot Grill Owner', 'hotgrill.owner@example.com', '$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O', '654 Grill St'),
    (2, 'Ice Cream Dream Owner', 'icecream.owner@example.com', '$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O', '987 Cold Way'),
    (2, 'Pasta Palace Owner', 'pastapalace.owner@example.com', '$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O', '159 Noodle Blvd'),
    (2, 'Pho Haven Owner', 'phohaven.owner@example.com', '$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O', '753 Soup St'),
    (2, 'Pizza Town Owner', 'pizzatown.owner@example.com', '$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O', '852 Slice Ave'),
    (2, 'Salad Station Owner', 'saladstation.owner@example.com', '$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O', '147 Green Rd'),
    (2, 'Steak House Owner', 'steakhouse.owner@example.com', '$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O', '369 Beef Blvd'),
    (2, 'Sushi World Owner', 'sushiworld.owner@example.com', '$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O', '258 Fish St'),
    (2, 'Taco Fiesta Owner', 'tacofiesta.owner@example.com', '$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O', '741 Mexico Way'),
    (2, 'Fire Chili Owner', 'firechili.owner@example.com', '$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O', '852 Spice Rd'),
    (2, 'Vegan Delight Owner', 'vegandelight.owner@example.com', '$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O', '963 Plant Ave'),
    (2, 'Smooth Sip Owner', 'smoothsip.owner@example.com', '$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O', '123 Tea Lane');

INSERT INTO restaurants (owner_id, deal_id, name, slug, address, open_hour, close_hour, delivery_fee, delivery_minutes) VALUES
    (1, 1, 'Bubble Home', 'bubble-home', '123 Boba St, Rexburg, ID', '10:00:00', '22:00:00', 2.99, 15),
    (2, 2, 'Cake Paradise', 'cake-paradise', '456 Sweet Ave, Rexburg, ID', '09:00:00', '21:00:00', 3.49, 20),
    (3, NULL, 'Chicken House', 'chicken-house', '789 Fried Rd, Rexburg, ID', '11:00:00', '23:00:00', 3.99, 25),
    (4, 3, 'Curry Puff Corner', 'curry-puff-corner', '321 Thai Ln, Rexburg, ID', '10:30:00', '21:30:00', 2.99, 15),
    (5, NULL, 'Hot Grill', 'hot-grill', '654 Grill St, Rexburg, ID', '11:00:00', '23:00:00', 3.99, 20),
    (6, 1, 'Ice Cream Dream', 'ice-cream-dream', '987 Cold Way, Rexburg, ID', '12:00:00', '22:00:00', 2.49, 10),
    (7, NULL, 'Pasta Palace', 'pasta-palace', '159 Noodle Blvd, Rexburg, ID', '11:00:00', '22:00:00', 3.49, 20),
    (8, 2, 'Pho Haven', 'pho-haven', '753 Soup St, Rexburg, ID', '10:00:00', '21:00:00', 2.99, 15),
    (9, 3, 'Pizza Town', 'pizza-town', '852 Slice Ave, Rexburg, ID', '11:00:00', '23:00:00', 3.99, 20),
    (10, NULL, 'Salad Station', 'salad-station', '147 Green Rd, Rexburg, ID', '09:00:00', '20:00:00', 2.49, 10),
    (11, 1, 'Steak House', 'steak-house', '369 Beef Blvd, Rexburg, ID', '12:00:00', '22:00:00', 4.99, 25),
    (12, 2, 'Sushi World', 'sushi-world', '258 Fish St, Rexburg, ID', '11:00:00', '22:00:00', 3.99, 20),
    (13, 3, 'Taco Fiesta', 'taco-fiesta', '741 Mexico Way, Rexburg, ID', '11:00:00', '22:00:00', 2.99, 15),
    (14, NULL, 'Fire Chili', 'fire-chili', '852 Spice Rd, Rexburg, ID', '11:00:00', '22:00:00', 3.49, 20),
    (15, NULL, 'Vegan Delight', 'vegan-delight', '963 Plant Ave, Rexburg, ID', '10:00:00', '21:00:00', 2.99, 15),
    (16, NULL, 'Smooth Sip', 'smooth-sip','123 Tea Lane, Rexburg, ID','09:00:00', '21:00:00', 2.49, 15);

INSERT INTO restaurant_category (restaurant_id, category_id) VALUES
    -- Bubble Home (bubble tea)
    (1, 26),
    -- Cake Paradise (dessert, bakery)
    (2, 14),
    (2, 15),
    -- Chicken House (wings / chicken)
    (3, 24),
    -- Curry Puff Corner (thai)
    (4, 7),
    -- Hot Grill (bbq)
    (5, 2),
    -- Ice Cream Dream (dessert)
    (6, 14),
    -- Pasta Palace (italian)
    (7, 11),
    -- Pho Haven (noodles)
    (8, 4),
    -- Pizza Town (pizza -> closest: italian)
    (9, 11),
    -- Salad Station (healthy)
    (10, 19),
    -- Steak House (bbq)
    (11, 2),
    -- Sushi World
    (12, 6),
    -- Taco Fiesta
    (13, 25),
    -- Fire Chili (thai)
    (14, 7),
    -- Vegan Delight
    (15, 20),
    -- Smooth Sip (smoothies)
    (16, 27);

INSERT INTO dishes (restaurant_id, category_id, name, slug, description, price) VALUES

    -- Bubble Home (Bubble Tea)
    (1, 26, 'Classic Milk Tea', 'classic-milk-tea', 'Creamy milk tea with chewy tapioca pearls', 4.50),
    (1, 26, 'Brown Sugar Boba', 'brown-sugar-boba', 'Sweet brown sugar milk with boba pearls', 5.00),
    (1, 26, 'Taro Milk Tea', 'taro-milk-tea', 'Sweet taro-flavored milk tea', 4.75),
    (1, 27, 'Mango Smoothie', 'mango-smoothie', 'Fresh mango blended smoothie', 5.25),
    (1, 27, 'Strawberry Smoothie', 'strawberry-smoothie', 'Sweet strawberry smoothie', 5.25),
    (1, 16, 'Iced Coffee', 'iced-coffee', 'Cold brewed iced coffee', 3.75),

    -- Cake Paradise (Dessert & Bakery)
    (2, 14, 'Chocolate Cake Slice', 'chocolate-cake-slice', 'Rich chocolate cake slice', 4.25),
    (2, 14, 'Cheesecake', 'cheesecake', 'Creamy New York style cheesecake', 4.75),
    (2, 15, 'Blueberry Muffin', 'blueberry-muffin', 'Fresh baked muffin with blueberries', 2.75),
    (2, 14, 'Red Velvet Cupcake', 'red-velvet-cupcake', 'Moist red velvet cupcake', 3.25),
    (2, 14, 'Carrot Cake Slice', 'carrot-cake-slice', 'Classic carrot cake with frosting', 4.00),
    (2, 15, 'Cinnamon Roll', 'cinnamon-roll', 'Warm and sweet cinnamon roll', 3.50),

    -- Chicken House (Wings & Chicken)
    (3, 24, 'Buffalo Wings (6 pcs)', 'buffalo-wings-6', 'Spicy buffalo wings with dipping sauce', 6.99),
    (3, 24, 'BBQ Wings (6 pcs)', 'bbq-wings-6', 'Sweet BBQ glazed wings', 6.99),
    (3, 24, 'Chicken Tenders', 'chicken-tenders', 'Crispy chicken tenders with fries', 7.50),
    (3, 1, 'Fried Chicken Combo', 'fried-chicken-combo', 'Fried chicken with fries and drink', 9.99),
    (3, 24, 'Chicken Sandwich', 'chicken-sandwich', 'Crispy chicken sandwich with pickles', 6.75),
    (3, 23, 'Late Night Nuggets', 'late-night-nuggets', 'Chicken nuggets for late cravings', 5.50),

    -- Curry Puff Corner (Thai) /i'm here
    (4, 7, 'Chicken Curry Puff', 'chicken-curry-puff', 'Flaky pastry filled with chicken curry', 3.50),
    (4, 7, 'Beef Curry Puff', 'beef-curry-puff', 'Savory beef-filled pastry', 3.75),
    (4, 7, 'Thai Fried Rice', 'thai-fried-rice', 'Fried rice with Thai seasoning', 7.25),
    (4, 7, 'Pad Thai', 'pad-thai', 'Stir-fried noodles with peanuts', 8.50),
    (4, 7, 'Thai Tea', 'thai-tea', 'Sweet and creamy Thai iced tea', 3.25),
    (4, 7, 'Spring Rolls', 'spring-rolls', 'Crispy vegetable spring rolls', 4.00),

    -- Hot Grill (BBQ)
    (5, 2, 'BBQ Ribs', 'bbq-ribs', 'Slow cooked BBQ ribs', 12.99),
    (5, 2, 'Grilled Chicken Plate', 'grilled-chicken-plate', 'Grilled chicken with sides', 9.99),
    (5, 2, 'BBQ Burger', 'bbq-burger', 'Burger with BBQ sauce and bacon', 8.75),
    (5, 2, 'Grilled Steak', 'grilled-steak', 'Juicy grilled steak', 14.50),
    (5, 2, 'Corn on the Cob', 'corn-on-cob', 'Buttery grilled corn', 2.50),
    (5, 2, 'BBQ Fries', 'bbq-fries', 'Fries topped with BBQ seasoning', 3.50),

    -- Ice Cream Dream (Dessert)
    (6, 14, 'Vanilla Ice Cream', 'vanilla-ice-cream', 'Classic vanilla scoop', 2.50),
    (6, 14, 'Chocolate Ice Cream', 'chocolate-ice-cream', 'Rich chocolate scoop', 2.50),
    (6, 14, 'Strawberry Ice Cream', 'strawberry-ice-cream', 'Sweet strawberry scoop', 2.50),
    (6, 14, 'Ice Cream Sundae', 'ice-cream-sundae', 'Sundae with toppings', 4.75),
    (6, 14, 'Milkshake', 'milkshake', 'Thick and creamy milkshake', 4.25),
    (6, 14, 'Ice Cream Cone', 'ice-cream-cone', 'Classic cone with scoop', 2.25),

    -- Pasta Palace (Italian)
    (7, 11, 'Spaghetti Bolognese', 'spaghetti-bolognese', 'Pasta with meat sauce', 9.50),
    (7, 11, 'Fettuccine Alfredo', 'fettuccine-alfredo', 'Creamy Alfredo pasta', 9.75),
    (7, 11, 'Chicken Parmesan', 'chicken-parmesan', 'Breaded chicken with cheese', 11.00),
    (7, 11, 'Garlic Bread', 'garlic-bread', 'Toasted garlic bread', 3.00),
    (7, 11, 'Penne Marinara', 'penne-marinara', 'Pasta with marinara sauce', 8.50),
    (7, 11, 'Meatball Pasta', 'meatball-pasta', 'Pasta with homemade meatballs', 10.25),

    -- Pho Haven (Noodles)
    (8, 4, 'Beef Pho', 'beef-pho', 'Vietnamese noodle soup with beef', 9.50),
    (8, 4, 'Chicken Pho', 'chicken-pho', 'Vietnamese noodle soup with chicken', 9.00),
    (8, 4, 'Spring Rolls', 'pho-spring-rolls', 'Fresh vegetable spring rolls', 4.50),
    (8, 4, 'Banh Mi Sandwich', 'banh-mi', 'Vietnamese sandwich with pork', 6.75),
    (8, 4, 'Vietnamese Coffee', 'viet-coffee', 'Strong iced coffee with condensed milk', 3.75),
    (8, 4, 'Rice Bowl', 'rice-bowl', 'Rice bowl with choice of protein', 7.50),

    -- Pizza Town (Pizza)
    (9, 11, 'Margherita Pizza', 'margherita-pizza', 'Classic pizza with cheese and basil', 9.50),
    (9, 11, 'Pepperoni Pizza', 'pepperoni-pizza', 'Pizza topped with pepperoni', 10.50),
    (9, 11, 'BBQ Chicken Pizza', 'bbq-chicken-pizza', 'Pizza with BBQ chicken topping', 11.00),
    (9, 11, 'Cheese Pizza', 'cheese-pizza', 'Classic cheese pizza', 8.50),
    (9, 11, 'Garlic Knots', 'garlic-knots', 'Soft garlic knots with dipping sauce', 4.00),
    (9, 23, 'Late Night Pizza Slice', 'late-night-slice', 'Single slice for late cravings', 3.00),

    -- Salad Station (Healthy)
    (10, 19, 'Caesar Salad', 'caesar-salad', 'Fresh romaine with Caesar dressing', 6.75),
    (10, 19, 'Greek Salad', 'greek-salad', 'Salad with feta and olives', 7.00),
    (10, 19, 'Chicken Salad', 'chicken-salad', 'Salad with grilled chicken', 7.50),
    (10, 19, 'Avocado Salad', 'avocado-salad', 'Healthy salad with avocado', 7.25),
    (10, 19, 'Quinoa Bowl', 'quinoa-bowl', 'Quinoa with veggies and dressing', 8.00),
    (10, 19, 'Smoothie Bowl', 'smoothie-bowl', 'Fruit and granola smoothie bowl', 6.50),

    -- Steak House (BBQ)
    (11, 2, 'Ribeye Steak', 'ribeye-steak', 'Juicy ribeye steak', 15.99),
    (11, 2, 'Grilled Sirloin', 'sirloin-steak', 'Grilled sirloin steak', 13.99),
    (11, 2, 'Steak Fries', 'steak-fries', 'Fries with seasoning', 3.50),
    (11, 2, 'BBQ Ribs', 'steak-bbq-ribs', 'Slow cooked BBQ ribs', 12.99),
    (11, 2, 'Mashed Potatoes', 'mashed-potatoes', 'Creamy mashed potatoes', 3.00),
    (11, 2, 'Grilled Veggies', 'grilled-veggies', 'Seasoned grilled vegetables', 3.75),

    -- Sushi World
    (12, 6, 'California Roll', 'california-roll', 'Sushi roll with crab and avocado', 6.50),
    (12, 6, 'Spicy Tuna Roll', 'spicy-tuna-roll', 'Tuna roll with spicy mayo', 7.25),
    (12, 6, 'Salmon Nigiri', 'salmon-nigiri', 'Rice topped with salmon', 5.75),
    (12, 6, 'Shrimp Tempura', 'shrimp-tempura', 'Crispy tempura shrimp', 7.50),
    (12, 6, 'Miso Soup', 'miso-soup', 'Traditional Japanese soup', 3.00),
    (12, 6, 'Edamame', 'edamame', 'Steamed soybeans with salt', 3.50),

    -- Taco Fiesta
    (13, 25, 'Beef Tacos (3)', 'beef-tacos', 'Three soft beef tacos', 7.50),
    (13, 25, 'Chicken Tacos (3)', 'chicken-tacos', 'Three soft chicken tacos', 7.25),
    (13, 25, 'Burrito', 'burrito', 'Large burrito with rice and beans', 8.50),
    (13, 25, 'Quesadilla', 'quesadilla', 'Cheesy folded tortilla', 6.75),
    (13, 25, 'Churros', 'churros', 'Sweet fried dough with cinnamon', 3.50),
    (13, 25, 'Mexican Rice', 'mexican-rice', 'Seasoned Mexican rice', 2.50),

    -- Fire Chili (Thai)
    (14, 7, 'Thai Basil Chicken', 'thai-basil-chicken', 'Stir-fried chicken with basil', 8.75),
    (14, 7, 'Green Curry', 'green-curry', 'Spicy coconut curry with rice', 9.00),
    (14, 7, 'Pad See Ew', 'pad-see-ew', 'Stir-fried noodles with soy sauce', 8.50),
    (14, 7, 'Spring Rolls', 'thai-spring-rolls', 'Crispy vegetable rolls', 4.00),
    (14, 7, 'Thai Tea', 'thai-tea-fire', 'Sweet Thai iced tea', 3.25),
    (14, 7, 'Fried Rice', 'thai-fried-rice-fire', 'Thai style fried rice', 7.50),

    -- Vegan Delight
    (15, 20, 'Vegan Burger', 'vegan-burger', 'Plant-based burger with veggies', 7.50),
    (15, 19, 'Quinoa Salad', 'quinoa-salad', 'Healthy quinoa with veggies', 7.00),
    (15, 20, 'Vegan Wrap', 'vegan-wrap', 'Plant-based wrap', 6.75),
    (15, 19, 'Smoothie Bowl', 'smoothie-bowl-vegan', 'Fruit bowl with granola', 6.50),
    (15, 20, 'Tofu Stir Fry', 'tofu-stir-fry', 'Stir-fried tofu and veggies', 7.75),
    (15, 19, 'Green Smoothie', 'green-smoothie', 'Healthy spinach smoothie', 4.50),

    -- Smooth Sip (Drinks)
    (16, 27, 'Mango Smoothie', 'mango-smoothie-smooth', 'Fresh mango smoothie', 5.25),
    (16, 27, 'Strawberry Smoothie', 'strawberry-smoothie-smooth', 'Sweet strawberry smoothie', 5.25),
    (16, 26, 'Classic Boba Tea', 'classic-boba', 'Milk tea with tapioca pearls', 4.75),
    (16, 26, 'Matcha Latte', 'matcha-latte', 'Creamy green tea latte', 4.50),
    (16, 16, 'Iced Coffee', 'iced-coffee-smooth', 'Cold brewed iced coffee', 3.75),
    (16, 27, 'Peach Smoothie', 'peach-smoothie', 'Sweet peach blended smoothie', 5.00);

INSERT INTO order_status (status) VALUES
    ('confirmed'),
    ('preparing'),
    ('shipped'),
    ('delivered');

INSERT INTO cart (user_id)
SELECT generate_series(1, 16);

DO $$
DECLARE
    user_role_id INTEGER;
BEGIN
    SELECT id INTO user_role_id FROM roles WHERE role_name = 'user';
    IF user_role_id IS NOT NULL THEN
        EXECUTE format(
            'ALTER TABLE users ALTER COLUMN role_id SET DEFAULT %s',
            user_role_id
        );
    END IF;
END $$;

COMMIT;
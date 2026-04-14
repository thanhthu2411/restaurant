--
-- PostgreSQL database dump
--

\restrict pXiPm36y4zCvAlI9jkH5XyDab9ReK7veXhCL98wH3gsoVVzZLx1Q7og4vWapHbr

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg12+2)
-- Dumped by pg_dump version 18.0

-- Started on 2026-04-13 20:56:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 19866)
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- TOC entry 2 (class 3079 OID 19867)
-- Name: http; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;


--
-- TOC entry 3609 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION http; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION http IS 'HTTP client for PostgreSQL, allows web page retrieval inside the database.';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 244 (class 1259 OID 155367)
-- Name: cart; Type: TABLE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE TABLE public.cart (
    id integer NOT NULL,
    user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cart OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 245 (class 1259 OID 155382)
-- Name: cart_dish; Type: TABLE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE TABLE public.cart_dish (
    cart_id integer NOT NULL,
    dish_id integer NOT NULL,
    quantity integer DEFAULT 1,
    CONSTRAINT cart_dish_quantity_check CHECK ((quantity >= 0))
);


ALTER TABLE public.cart_dish OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 243 (class 1259 OID 155366)
-- Name: cart_id_seq; Type: SEQUENCE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE SEQUENCE public.cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_id_seq OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 3610 (class 0 OID 0)
-- Dependencies: 243
-- Name: cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER SEQUENCE public.cart_id_seq OWNED BY public.cart.id;


--
-- TOC entry 228 (class 1259 OID 155184)
-- Name: categories; Type: TABLE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    category_name character varying(100),
    slug character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 227 (class 1259 OID 155183)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 3611 (class 0 OID 0)
-- Dependencies: 227
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 249 (class 1259 OID 155424)
-- Name: contact_form; Type: TABLE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE TABLE public.contact_form (
    id integer NOT NULL,
    subject character varying(255) NOT NULL,
    message text NOT NULL,
    user_id integer,
    status character varying(20) DEFAULT 'unread'::character varying,
    reply_message text,
    replied_at timestamp without time zone,
    submitted timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contact_form_status_check CHECK (((status)::text = ANY ((ARRAY['unread'::character varying, 'read'::character varying, 'replied'::character varying])::text[])))
);


ALTER TABLE public.contact_form OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 248 (class 1259 OID 155423)
-- Name: contact_form_id_seq; Type: SEQUENCE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE SEQUENCE public.contact_form_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_form_id_seq OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 3612 (class 0 OID 0)
-- Dependencies: 248
-- Name: contact_form_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER SEQUENCE public.contact_form_id_seq OWNED BY public.contact_form.id;


--
-- TOC entry 232 (class 1259 OID 155219)
-- Name: deals; Type: TABLE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE TABLE public.deals (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(20) NOT NULL,
    description text,
    expiration_date timestamp without time zone,
    amount numeric DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.deals OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 231 (class 1259 OID 155218)
-- Name: deals_id_seq; Type: SEQUENCE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE SEQUENCE public.deals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.deals_id_seq OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 3613 (class 0 OID 0)
-- Dependencies: 231
-- Name: deals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER SEQUENCE public.deals_id_seq OWNED BY public.deals.id;


--
-- TOC entry 237 (class 1259 OID 155282)
-- Name: dishes; Type: TABLE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE TABLE public.dishes (
    id integer NOT NULL,
    restaurant_id integer,
    category_id integer,
    name character varying(200) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT dishes_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.dishes OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 236 (class 1259 OID 155281)
-- Name: dishes_id_seq; Type: SEQUENCE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE SEQUENCE public.dishes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dishes_id_seq OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 3614 (class 0 OID 0)
-- Dependencies: 236
-- Name: dishes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER SEQUENCE public.dishes_id_seq OWNED BY public.dishes.id;


--
-- TOC entry 242 (class 1259 OID 155346)
-- Name: order_dish; Type: TABLE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE TABLE public.order_dish (
    order_id integer NOT NULL,
    dish_id integer NOT NULL,
    quantity integer NOT NULL,
    order_price numeric(10,2) NOT NULL,
    CONSTRAINT order_dish_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.order_dish OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 239 (class 1259 OID 155309)
-- Name: order_status; Type: TABLE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE TABLE public.order_status (
    id integer NOT NULL,
    status character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT order_status_status_check CHECK (((status)::text = ANY ((ARRAY['confirmed'::character varying, 'preparing'::character varying, 'delivered'::character varying, 'shipped'::character varying])::text[])))
);


ALTER TABLE public.order_status OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 238 (class 1259 OID 155308)
-- Name: order_status_id_seq; Type: SEQUENCE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE SEQUENCE public.order_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_status_id_seq OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 3615 (class 0 OID 0)
-- Dependencies: 238
-- Name: order_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER SEQUENCE public.order_status_id_seq OWNED BY public.order_status.id;


--
-- TOC entry 241 (class 1259 OID 155319)
-- Name: orders; Type: TABLE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    restaurant_id integer,
    status_id integer NOT NULL,
    subtotal numeric(10,2),
    total numeric(10,2),
    delivery_fee numeric(10,2) DEFAULT 3.99,
    delivery_minutes integer DEFAULT 15,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.orders OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 240 (class 1259 OID 155318)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 3616 (class 0 OID 0)
-- Dependencies: 240
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 235 (class 1259 OID 155264)
-- Name: restaurant_category; Type: TABLE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE TABLE public.restaurant_category (
    restaurant_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.restaurant_category OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 234 (class 1259 OID 155235)
-- Name: restaurants; Type: TABLE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE TABLE public.restaurants (
    id integer NOT NULL,
    owner_id integer,
    deal_id integer,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    address text NOT NULL,
    open_hour time without time zone DEFAULT '08:00:00'::time without time zone,
    close_hour time without time zone DEFAULT '22:00:00'::time without time zone,
    delivery_fee numeric(10,2) DEFAULT 3.99,
    delivery_minutes integer DEFAULT 15,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.restaurants OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 233 (class 1259 OID 155234)
-- Name: restaurants_id_seq; Type: SEQUENCE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE SEQUENCE public.restaurants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.restaurants_id_seq OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 3617 (class 0 OID 0)
-- Dependencies: 233
-- Name: restaurants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER SEQUENCE public.restaurants_id_seq OWNED BY public.restaurants.id;


--
-- TOC entry 247 (class 1259 OID 155402)
-- Name: review; Type: TABLE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE TABLE public.review (
    id integer NOT NULL,
    restaurant_id integer,
    user_id integer,
    rating integer,
    content text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT review_rating_check CHECK (((rating < 6) AND (rating > 0)))
);


ALTER TABLE public.review OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 246 (class 1259 OID 155401)
-- Name: review_id_seq; Type: SEQUENCE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE SEQUENCE public.review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.review_id_seq OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 3618 (class 0 OID 0)
-- Dependencies: 246
-- Name: review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER SEQUENCE public.review_id_seq OWNED BY public.review.id;


--
-- TOC entry 226 (class 1259 OID 155170)
-- Name: roles; Type: TABLE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    role_name character varying(50) NOT NULL,
    role_description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 225 (class 1259 OID 155169)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 3619 (class 0 OID 0)
-- Dependencies: 225
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 224 (class 1259 OID 74938)
-- Name: session; Type: TABLE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 230 (class 1259 OID 155196)
-- Name: users; Type: TABLE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE TABLE public.users (
    id integer NOT NULL,
    role_id integer DEFAULT 3,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 229 (class 1259 OID 155195)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO don24015_cse340_restaurant;

--
-- TOC entry 3620 (class 0 OID 0)
-- Dependencies: 229
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3352 (class 2604 OID 155370)
-- Name: cart id; Type: DEFAULT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public.cart_id_seq'::regclass);


--
-- TOC entry 3328 (class 2604 OID 155187)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 3357 (class 2604 OID 155427)
-- Name: contact_form id; Type: DEFAULT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.contact_form ALTER COLUMN id SET DEFAULT nextval('public.contact_form_id_seq'::regclass);


--
-- TOC entry 3334 (class 2604 OID 155222)
-- Name: deals id; Type: DEFAULT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.deals ALTER COLUMN id SET DEFAULT nextval('public.deals_id_seq'::regclass);


--
-- TOC entry 3343 (class 2604 OID 155285)
-- Name: dishes id; Type: DEFAULT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.dishes ALTER COLUMN id SET DEFAULT nextval('public.dishes_id_seq'::regclass);


--
-- TOC entry 3345 (class 2604 OID 155312)
-- Name: order_status id; Type: DEFAULT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.order_status ALTER COLUMN id SET DEFAULT nextval('public.order_status_id_seq'::regclass);


--
-- TOC entry 3347 (class 2604 OID 155322)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 3337 (class 2604 OID 155238)
-- Name: restaurants id; Type: DEFAULT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.restaurants ALTER COLUMN id SET DEFAULT nextval('public.restaurants_id_seq'::regclass);


--
-- TOC entry 3355 (class 2604 OID 155405)
-- Name: review id; Type: DEFAULT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.review ALTER COLUMN id SET DEFAULT nextval('public.review_id_seq'::regclass);


--
-- TOC entry 3326 (class 2604 OID 155173)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 3330 (class 2604 OID 155199)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3596 (class 0 OID 155367)
-- Dependencies: 244
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: don24015_cse340_restaurant
--

COPY public.cart (id, user_id, created_at) FROM stdin;
1	1	2026-04-01 12:18:54.294167
2	2	2026-04-01 12:18:54.294167
3	3	2026-04-01 12:18:54.294167
4	4	2026-04-01 12:18:54.294167
5	5	2026-04-01 12:18:54.294167
6	6	2026-04-01 12:18:54.294167
7	7	2026-04-01 12:18:54.294167
8	8	2026-04-01 12:18:54.294167
9	9	2026-04-01 12:18:54.294167
10	10	2026-04-01 12:18:54.294167
11	11	2026-04-01 12:18:54.294167
12	12	2026-04-01 12:18:54.294167
13	13	2026-04-01 12:18:54.294167
14	14	2026-04-01 12:18:54.294167
15	15	2026-04-01 12:18:54.294167
16	16	2026-04-01 12:18:54.294167
20	17	2026-04-11 20:45:51.483923
\.


--
-- TOC entry 3597 (class 0 OID 155382)
-- Dependencies: 245
-- Data for Name: cart_dish; Type: TABLE DATA; Schema: public; Owner: don24015_cse340_restaurant
--

COPY public.cart_dish (cart_id, dish_id, quantity) FROM stdin;
20	57	2
20	1	1
\.


--
-- TOC entry 3580 (class 0 OID 155184)
-- Dependencies: 228
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: don24015_cse340_restaurant
--

COPY public.categories (id, category_name, slug, created_at) FROM stdin;
1	burgers	burgers	2026-04-01 12:18:54.294167
2	bbq	bbq	2026-04-01 12:18:54.294167
3	seafood	seafood	2026-04-01 12:18:54.294167
4	noodles	noodles	2026-04-01 12:18:54.294167
5	ramen	ramen	2026-04-01 12:18:54.294167
6	sushi	sushi	2026-04-01 12:18:54.294167
7	thai	thai	2026-04-01 12:18:54.294167
8	korean	korean	2026-04-01 12:18:54.294167
9	indian	indian	2026-04-01 12:18:54.294167
10	mediterranean	mediterranean	2026-04-01 12:18:54.294167
11	italian	italian	2026-04-01 12:18:54.294167
12	sandwiches	sandwiches	2026-04-01 12:18:54.294167
13	salads	salads	2026-04-01 12:18:54.294167
14	dessert	dessert	2026-04-01 12:18:54.294167
15	bakery	bakery	2026-04-01 12:18:54.294167
16	coffee	coffee	2026-04-01 12:18:54.294167
17	breakfast	breakfast	2026-04-01 12:18:54.294167
18	brunch	brunch	2026-04-01 12:18:54.294167
19	healthy	healthy	2026-04-01 12:18:54.294167
20	vegetarian	vegetarian	2026-04-01 12:18:54.294167
21	gluten free	gluten-free	2026-04-01 12:18:54.294167
22	family meals	family-meals	2026-04-01 12:18:54.294167
23	late night	late-night	2026-04-01 12:18:54.294167
24	wings	wings	2026-04-01 12:18:54.294167
25	tacos	tacos	2026-04-01 12:18:54.294167
26	bubble tea	bubble-tea	2026-04-01 12:18:54.294167
27	smoothies	smoothies	2026-04-01 12:18:54.294167
\.


--
-- TOC entry 3601 (class 0 OID 155424)
-- Dependencies: 249
-- Data for Name: contact_form; Type: TABLE DATA; Schema: public; Owner: don24015_cse340_restaurant
--

COPY public.contact_form (id, subject, message, user_id, status, reply_message, replied_at, submitted) FROM stdin;
1	hello world	hello, admin!	17	unread	\N	\N	2026-04-12 00:37:58.712135
2	test	hi. this is a test.	17	unread	\N	\N	2026-04-12 00:38:15.485573
\.


--
-- TOC entry 3584 (class 0 OID 155219)
-- Dependencies: 232
-- Data for Name: deals; Type: TABLE DATA; Schema: public; Owner: don24015_cse340_restaurant
--

COPY public.deals (id, name, code, description, expiration_date, amount, created_at) FROM stdin;
1	$5 off	5OFF	$5 OFF for Total Order	2026-12-31 00:00:00	5.00	2026-04-01 12:18:54.294167
2	$15 off	15OFF	$15 OFF for Total Order	2026-12-01 00:00:00	15.00	2026-04-01 12:18:54.294167
3	$10 off	10OFF	$10 OFF for Total Order	2026-12-01 00:00:00	10.00	2026-04-01 12:18:54.294167
\.


--
-- TOC entry 3589 (class 0 OID 155282)
-- Dependencies: 237
-- Data for Name: dishes; Type: TABLE DATA; Schema: public; Owner: don24015_cse340_restaurant
--

COPY public.dishes (id, restaurant_id, category_id, name, slug, description, price, created_at) FROM stdin;
1	1	26	Classic Milk Tea	classic-milk-tea	Creamy milk tea with chewy tapioca pearls	4.50	2026-04-01 12:18:54.294167
2	1	26	Brown Sugar Boba	brown-sugar-boba	Sweet brown sugar milk with boba pearls	5.00	2026-04-01 12:18:54.294167
3	1	26	Taro Milk Tea	taro-milk-tea	Sweet taro-flavored milk tea	4.75	2026-04-01 12:18:54.294167
4	1	27	Mango Smoothie	mango-smoothie	Fresh mango blended smoothie	5.25	2026-04-01 12:18:54.294167
5	1	27	Strawberry Smoothie	strawberry-smoothie	Sweet strawberry smoothie	5.25	2026-04-01 12:18:54.294167
6	1	16	Iced Coffee	iced-coffee	Cold brewed iced coffee	3.75	2026-04-01 12:18:54.294167
7	2	14	Chocolate Cake Slice	chocolate-cake-slice	Rich chocolate cake slice	4.25	2026-04-01 12:18:54.294167
8	2	14	Cheesecake	cheesecake	Creamy New York style cheesecake	4.75	2026-04-01 12:18:54.294167
9	2	15	Blueberry Muffin	blueberry-muffin	Fresh baked muffin with blueberries	2.75	2026-04-01 12:18:54.294167
10	2	14	Red Velvet Cupcake	red-velvet-cupcake	Moist red velvet cupcake	3.25	2026-04-01 12:18:54.294167
11	2	14	Carrot Cake Slice	carrot-cake-slice	Classic carrot cake with frosting	4.00	2026-04-01 12:18:54.294167
12	2	15	Cinnamon Roll	cinnamon-roll	Warm and sweet cinnamon roll	3.50	2026-04-01 12:18:54.294167
13	3	24	Buffalo Wings (6 pcs)	buffalo-wings-6	Spicy buffalo wings with dipping sauce	6.99	2026-04-01 12:18:54.294167
14	3	24	BBQ Wings (6 pcs)	bbq-wings-6	Sweet BBQ glazed wings	6.99	2026-04-01 12:18:54.294167
15	3	24	Chicken Tenders	chicken-tenders	Crispy chicken tenders with fries	7.50	2026-04-01 12:18:54.294167
16	3	1	Fried Chicken Combo	fried-chicken-combo	Fried chicken with fries and drink	9.99	2026-04-01 12:18:54.294167
17	3	24	Chicken Sandwich	chicken-sandwich	Crispy chicken sandwich with pickles	6.75	2026-04-01 12:18:54.294167
18	3	23	Late Night Nuggets	late-night-nuggets	Chicken nuggets for late cravings	5.50	2026-04-01 12:18:54.294167
19	4	7	Chicken Curry Puff	chicken-curry-puff	Flaky pastry filled with chicken curry	3.50	2026-04-01 12:18:54.294167
20	4	7	Beef Curry Puff	beef-curry-puff	Savory beef-filled pastry	3.75	2026-04-01 12:18:54.294167
21	4	7	Thai Fried Rice	thai-fried-rice	Fried rice with Thai seasoning	7.25	2026-04-01 12:18:54.294167
22	4	7	Pad Thai	pad-thai	Stir-fried noodles with peanuts	8.50	2026-04-01 12:18:54.294167
23	4	7	Thai Tea	thai-tea	Sweet and creamy Thai iced tea	3.25	2026-04-01 12:18:54.294167
24	4	7	Spring Rolls	spring-rolls	Crispy vegetable spring rolls	4.00	2026-04-01 12:18:54.294167
25	5	2	BBQ Ribs	bbq-ribs	Slow cooked BBQ ribs	12.99	2026-04-01 12:18:54.294167
26	5	2	Grilled Chicken Plate	grilled-chicken-plate	Grilled chicken with sides	9.99	2026-04-01 12:18:54.294167
27	5	2	BBQ Burger	bbq-burger	Burger with BBQ sauce and bacon	8.75	2026-04-01 12:18:54.294167
28	5	2	Grilled Steak	grilled-steak	Juicy grilled steak	14.50	2026-04-01 12:18:54.294167
29	5	2	Corn on the Cob	corn-on-cob	Buttery grilled corn	2.50	2026-04-01 12:18:54.294167
30	5	2	BBQ Fries	bbq-fries	Fries topped with BBQ seasoning	3.50	2026-04-01 12:18:54.294167
31	6	14	Vanilla Ice Cream	vanilla-ice-cream	Classic vanilla scoop	2.50	2026-04-01 12:18:54.294167
32	6	14	Chocolate Ice Cream	chocolate-ice-cream	Rich chocolate scoop	2.50	2026-04-01 12:18:54.294167
33	6	14	Strawberry Ice Cream	strawberry-ice-cream	Sweet strawberry scoop	2.50	2026-04-01 12:18:54.294167
34	6	14	Ice Cream Sundae	ice-cream-sundae	Sundae with toppings	4.75	2026-04-01 12:18:54.294167
35	6	14	Milkshake	milkshake	Thick and creamy milkshake	4.25	2026-04-01 12:18:54.294167
36	6	14	Ice Cream Cone	ice-cream-cone	Classic cone with scoop	2.25	2026-04-01 12:18:54.294167
37	7	11	Spaghetti Bolognese	spaghetti-bolognese	Pasta with meat sauce	9.50	2026-04-01 12:18:54.294167
38	7	11	Fettuccine Alfredo	fettuccine-alfredo	Creamy Alfredo pasta	9.75	2026-04-01 12:18:54.294167
39	7	11	Chicken Parmesan	chicken-parmesan	Breaded chicken with cheese	11.00	2026-04-01 12:18:54.294167
40	7	11	Garlic Bread	garlic-bread	Toasted garlic bread	3.00	2026-04-01 12:18:54.294167
41	7	11	Penne Marinara	penne-marinara	Pasta with marinara sauce	8.50	2026-04-01 12:18:54.294167
42	7	11	Meatball Pasta	meatball-pasta	Pasta with homemade meatballs	10.25	2026-04-01 12:18:54.294167
43	8	4	Beef Pho	beef-pho	Vietnamese noodle soup with beef	9.50	2026-04-01 12:18:54.294167
44	8	4	Chicken Pho	chicken-pho	Vietnamese noodle soup with chicken	9.00	2026-04-01 12:18:54.294167
45	8	4	Spring Rolls	pho-spring-rolls	Fresh vegetable spring rolls	4.50	2026-04-01 12:18:54.294167
46	8	4	Banh Mi Sandwich	banh-mi	Vietnamese sandwich with pork	6.75	2026-04-01 12:18:54.294167
47	8	4	Vietnamese Coffee	viet-coffee	Strong iced coffee with condensed milk	3.75	2026-04-01 12:18:54.294167
48	8	4	Rice Bowl	rice-bowl	Rice bowl with choice of protein	7.50	2026-04-01 12:18:54.294167
49	9	11	Margherita Pizza	margherita-pizza	Classic pizza with cheese and basil	9.50	2026-04-01 12:18:54.294167
50	9	11	Pepperoni Pizza	pepperoni-pizza	Pizza topped with pepperoni	10.50	2026-04-01 12:18:54.294167
51	9	11	BBQ Chicken Pizza	bbq-chicken-pizza	Pizza with BBQ chicken topping	11.00	2026-04-01 12:18:54.294167
52	9	11	Cheese Pizza	cheese-pizza	Classic cheese pizza	8.50	2026-04-01 12:18:54.294167
53	9	11	Garlic Knots	garlic-knots	Soft garlic knots with dipping sauce	4.00	2026-04-01 12:18:54.294167
54	9	23	Late Night Pizza Slice	late-night-slice	Single slice for late cravings	3.00	2026-04-01 12:18:54.294167
55	10	19	Caesar Salad	caesar-salad	Fresh romaine with Caesar dressing	6.75	2026-04-01 12:18:54.294167
56	10	19	Greek Salad	greek-salad	Salad with feta and olives	7.00	2026-04-01 12:18:54.294167
57	10	19	Chicken Salad	chicken-salad	Salad with grilled chicken	7.50	2026-04-01 12:18:54.294167
58	10	19	Avocado Salad	avocado-salad	Healthy salad with avocado	7.25	2026-04-01 12:18:54.294167
59	10	19	Quinoa Bowl	quinoa-bowl	Quinoa with veggies and dressing	8.00	2026-04-01 12:18:54.294167
60	10	19	Smoothie Bowl	smoothie-bowl	Fruit and granola smoothie bowl	6.50	2026-04-01 12:18:54.294167
61	11	2	Ribeye Steak	ribeye-steak	Juicy ribeye steak	15.99	2026-04-01 12:18:54.294167
62	11	2	Grilled Sirloin	sirloin-steak	Grilled sirloin steak	13.99	2026-04-01 12:18:54.294167
63	11	2	Steak Fries	steak-fries	Fries with seasoning	3.50	2026-04-01 12:18:54.294167
64	11	2	BBQ Ribs	steak-bbq-ribs	Slow cooked BBQ ribs	12.99	2026-04-01 12:18:54.294167
65	11	2	Mashed Potatoes	mashed-potatoes	Creamy mashed potatoes	3.00	2026-04-01 12:18:54.294167
66	11	2	Grilled Veggies	grilled-veggies	Seasoned grilled vegetables	3.75	2026-04-01 12:18:54.294167
67	12	6	California Roll	california-roll	Sushi roll with crab and avocado	6.50	2026-04-01 12:18:54.294167
68	12	6	Spicy Tuna Roll	spicy-tuna-roll	Tuna roll with spicy mayo	7.25	2026-04-01 12:18:54.294167
69	12	6	Salmon Nigiri	salmon-nigiri	Rice topped with salmon	5.75	2026-04-01 12:18:54.294167
70	12	6	Shrimp Tempura	shrimp-tempura	Crispy tempura shrimp	7.50	2026-04-01 12:18:54.294167
71	12	6	Miso Soup	miso-soup	Traditional Japanese soup	3.00	2026-04-01 12:18:54.294167
72	12	6	Edamame	edamame	Steamed soybeans with salt	3.50	2026-04-01 12:18:54.294167
73	13	25	Beef Tacos (3)	beef-tacos	Three soft beef tacos	7.50	2026-04-01 12:18:54.294167
74	13	25	Chicken Tacos (3)	chicken-tacos	Three soft chicken tacos	7.25	2026-04-01 12:18:54.294167
75	13	25	Burrito	burrito	Large burrito with rice and beans	8.50	2026-04-01 12:18:54.294167
76	13	25	Quesadilla	quesadilla	Cheesy folded tortilla	6.75	2026-04-01 12:18:54.294167
77	13	25	Churros	churros	Sweet fried dough with cinnamon	3.50	2026-04-01 12:18:54.294167
78	13	25	Mexican Rice	mexican-rice	Seasoned Mexican rice	2.50	2026-04-01 12:18:54.294167
79	14	7	Thai Basil Chicken	thai-basil-chicken	Stir-fried chicken with basil	8.75	2026-04-01 12:18:54.294167
80	14	7	Green Curry	green-curry	Spicy coconut curry with rice	9.00	2026-04-01 12:18:54.294167
81	14	7	Pad See Ew	pad-see-ew	Stir-fried noodles with soy sauce	8.50	2026-04-01 12:18:54.294167
82	14	7	Spring Rolls	thai-spring-rolls	Crispy vegetable rolls	4.00	2026-04-01 12:18:54.294167
83	14	7	Thai Tea	thai-tea-fire	Sweet Thai iced tea	3.25	2026-04-01 12:18:54.294167
84	14	7	Fried Rice	thai-fried-rice-fire	Thai style fried rice	7.50	2026-04-01 12:18:54.294167
85	15	20	Vegan Burger	vegan-burger	Plant-based burger with veggies	7.50	2026-04-01 12:18:54.294167
86	15	19	Quinoa Salad	quinoa-salad	Healthy quinoa with veggies	7.00	2026-04-01 12:18:54.294167
87	15	20	Vegan Wrap	vegan-wrap	Plant-based wrap	6.75	2026-04-01 12:18:54.294167
88	15	19	Smoothie Bowl	smoothie-bowl-vegan	Fruit bowl with granola	6.50	2026-04-01 12:18:54.294167
89	15	20	Tofu Stir Fry	tofu-stir-fry	Stir-fried tofu and veggies	7.75	2026-04-01 12:18:54.294167
90	15	19	Green Smoothie	green-smoothie	Healthy spinach smoothie	4.50	2026-04-01 12:18:54.294167
91	16	27	Mango Smoothie	mango-smoothie-smooth	Fresh mango smoothie	5.25	2026-04-01 12:18:54.294167
92	16	27	Strawberry Smoothie	strawberry-smoothie-smooth	Sweet strawberry smoothie	5.25	2026-04-01 12:18:54.294167
93	16	26	Classic Boba Tea	classic-boba	Milk tea with tapioca pearls	4.75	2026-04-01 12:18:54.294167
94	16	26	Matcha Latte	matcha-latte	Creamy green tea latte	4.50	2026-04-01 12:18:54.294167
95	16	16	Iced Coffee	iced-coffee-smooth	Cold brewed iced coffee	3.75	2026-04-01 12:18:54.294167
96	16	27	Peach Smoothie	peach-smoothie	Sweet peach blended smoothie	5.00	2026-04-01 12:18:54.294167
\.


--
-- TOC entry 3594 (class 0 OID 155346)
-- Dependencies: 242
-- Data for Name: order_dish; Type: TABLE DATA; Schema: public; Owner: don24015_cse340_restaurant
--

COPY public.order_dish (order_id, dish_id, quantity, order_price) FROM stdin;
\.


--
-- TOC entry 3591 (class 0 OID 155309)
-- Dependencies: 239
-- Data for Name: order_status; Type: TABLE DATA; Schema: public; Owner: don24015_cse340_restaurant
--

COPY public.order_status (id, status, created_at) FROM stdin;
1	confirmed	2026-04-01 12:18:54.294167
2	preparing	2026-04-01 12:18:54.294167
3	shipped	2026-04-01 12:18:54.294167
4	delivered	2026-04-01 12:18:54.294167
\.


--
-- TOC entry 3593 (class 0 OID 155319)
-- Dependencies: 241
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: don24015_cse340_restaurant
--

COPY public.orders (id, user_id, restaurant_id, status_id, subtotal, total, delivery_fee, delivery_minutes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3587 (class 0 OID 155264)
-- Dependencies: 235
-- Data for Name: restaurant_category; Type: TABLE DATA; Schema: public; Owner: don24015_cse340_restaurant
--

COPY public.restaurant_category (restaurant_id, category_id) FROM stdin;
1	26
2	14
2	15
3	24
4	7
5	2
6	14
7	11
8	4
9	11
10	19
11	2
12	6
13	25
14	7
15	20
16	27
\.


--
-- TOC entry 3586 (class 0 OID 155235)
-- Dependencies: 234
-- Data for Name: restaurants; Type: TABLE DATA; Schema: public; Owner: don24015_cse340_restaurant
--

COPY public.restaurants (id, owner_id, deal_id, name, slug, address, open_hour, close_hour, delivery_fee, delivery_minutes, created_at) FROM stdin;
1	1	1	Bubble Home	bubble-home	123 Boba St, Rexburg, ID	10:00:00	22:00:00	2.99	15	2026-04-01 12:18:54.294167
2	2	2	Cake Paradise	cake-paradise	456 Sweet Ave, Rexburg, ID	09:00:00	21:00:00	3.49	20	2026-04-01 12:18:54.294167
3	3	\N	Chicken House	chicken-house	789 Fried Rd, Rexburg, ID	11:00:00	23:00:00	3.99	25	2026-04-01 12:18:54.294167
4	4	3	Curry Puff Corner	curry-puff-corner	321 Thai Ln, Rexburg, ID	10:30:00	21:30:00	2.99	15	2026-04-01 12:18:54.294167
5	5	\N	Hot Grill	hot-grill	654 Grill St, Rexburg, ID	11:00:00	23:00:00	3.99	20	2026-04-01 12:18:54.294167
6	6	1	Ice Cream Dream	ice-cream-dream	987 Cold Way, Rexburg, ID	12:00:00	22:00:00	2.49	10	2026-04-01 12:18:54.294167
7	7	\N	Pasta Palace	pasta-palace	159 Noodle Blvd, Rexburg, ID	11:00:00	22:00:00	3.49	20	2026-04-01 12:18:54.294167
8	8	2	Pho Haven	pho-haven	753 Soup St, Rexburg, ID	10:00:00	21:00:00	2.99	15	2026-04-01 12:18:54.294167
9	9	3	Pizza Town	pizza-town	852 Slice Ave, Rexburg, ID	11:00:00	23:00:00	3.99	20	2026-04-01 12:18:54.294167
10	10	\N	Salad Station	salad-station	147 Green Rd, Rexburg, ID	09:00:00	20:00:00	2.49	10	2026-04-01 12:18:54.294167
11	11	1	Steak House	steak-house	369 Beef Blvd, Rexburg, ID	12:00:00	22:00:00	4.99	25	2026-04-01 12:18:54.294167
12	12	2	Sushi World	sushi-world	258 Fish St, Rexburg, ID	11:00:00	22:00:00	3.99	20	2026-04-01 12:18:54.294167
13	13	3	Taco Fiesta	taco-fiesta	741 Mexico Way, Rexburg, ID	11:00:00	22:00:00	2.99	15	2026-04-01 12:18:54.294167
14	14	\N	Fire Chili	fire-chili	852 Spice Rd, Rexburg, ID	11:00:00	22:00:00	3.49	20	2026-04-01 12:18:54.294167
15	15	\N	Vegan Delight	vegan-delight	963 Plant Ave, Rexburg, ID	10:00:00	21:00:00	2.99	15	2026-04-01 12:18:54.294167
16	16	\N	Smooth Sip	smooth-sip	123 Tea Lane, Rexburg, ID	09:00:00	21:00:00	2.49	15	2026-04-01 12:18:54.294167
\.


--
-- TOC entry 3599 (class 0 OID 155402)
-- Dependencies: 247
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: don24015_cse340_restaurant
--

COPY public.review (id, restaurant_id, user_id, rating, content, created_at) FROM stdin;
1	10	17	5	the smoothie is so fresh. so good	2026-04-11 23:42:44.293628
\.


--
-- TOC entry 3578 (class 0 OID 155170)
-- Dependencies: 226
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: don24015_cse340_restaurant
--

COPY public.roles (id, role_name, role_description, created_at) FROM stdin;
1	admin	Administrator with full system access	2026-04-01 12:18:54.294167
2	owner	Restaurant owner with control over their restaurnt	2026-04-01 12:18:54.294167
3	user	Standard user with basic access	2026-04-01 12:18:54.294167
\.


--
-- TOC entry 3576 (class 0 OID 74938)
-- Dependencies: 224
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: don24015_cse340_restaurant
--

COPY public.session (sid, sess, expire) FROM stdin;
g1lL_D3YCwDs7uTd3I-opkHtLgdAiDg8	{"cookie":{"originalMaxAge":86400000,"expires":"2026-04-13T06:29:15.109Z","secure":true,"httpOnly":true,"path":"/"},"flash":{"success":[],"error":[],"warning":[],"info":[]}}	2026-04-13 00:29:16
blLGrGwL7F1enwZfhH1yuZtrp6TgiE0A	{"cookie":{"originalMaxAge":86400000,"expires":"2026-04-13T06:29:25.091Z","secure":true,"httpOnly":true,"path":"/"},"flash":{"success":[],"error":[],"warning":[],"info":[]}}	2026-04-13 00:29:26
tek3A9in7aY-d-hShG4OPfXPeyAiFqUr	{"cookie":{"originalMaxAge":86400000,"expires":"2026-04-13T07:05:24.434Z","secure":false,"httpOnly":true,"path":"/"},"flash":{"success":[],"error":[],"warning":[],"info":[]},"user":{"id":1,"name":"Bubble Home Owner","email":"bubblehome.owner@example.com","address":"123 Boba St","created_at":"2026-04-01T18:18:54.294Z","roleName":"owner"}}	2026-04-13 01:05:27
TlymJYNasIhJ5nLSjEo7ZjYuzaC2Zicy	{"cookie":{"originalMaxAge":86400000,"expires":"2026-04-13T07:07:17.425Z","secure":false,"httpOnly":true,"path":"/"},"flash":{"success":[],"error":[],"warning":[],"info":[]},"user":{"id":1,"name":"Bubble Home Owner","email":"bubblehome.owner@example.com","address":"123 Boba St","created_at":"2026-04-01T18:18:54.294Z","roleName":"owner"}}	2026-04-13 01:07:38
sm-xk96NB6UKRFkxi7U7-kXA0nS5B81o	{"cookie":{"originalMaxAge":86400000,"expires":"2026-04-13T06:27:26.901Z","secure":true,"httpOnly":true,"path":"/"},"flash":{"success":[],"error":[],"warning":[],"info":[]}}	2026-04-13 00:27:27
8Zc7xNkUdGMlgT6j3xOFoGnKkGVkbbgV	{"cookie":{"originalMaxAge":86400000,"expires":"2026-04-13T06:27:32.082Z","secure":true,"httpOnly":true,"path":"/"},"flash":{"success":[],"error":[],"warning":[],"info":[]}}	2026-04-13 00:27:33
\.


--
-- TOC entry 3582 (class 0 OID 155196)
-- Dependencies: 230
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: don24015_cse340_restaurant
--

COPY public.users (id, role_id, name, email, password, address, created_at, updated_at) FROM stdin;
1	2	Bubble Home Owner	bubblehome.owner@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	123 Boba St	2026-04-01 12:18:54.294167	2026-04-01 12:18:54.294167
2	2	Cake Paradise Owner	cakeparadise.owner@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	456 Sweet Ave	2026-04-01 12:18:54.294167	2026-04-01 12:18:54.294167
3	2	Chicken House Owner	chickenhouse.owner@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	789 Fried Rd	2026-04-01 12:18:54.294167	2026-04-01 12:18:54.294167
4	2	Curry Puff Owner	currypuff.owner@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	321 Thai Ln	2026-04-01 12:18:54.294167	2026-04-01 12:18:54.294167
5	2	Hot Grill Owner	hotgrill.owner@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	654 Grill St	2026-04-01 12:18:54.294167	2026-04-01 12:18:54.294167
6	2	Ice Cream Dream Owner	icecream.owner@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	987 Cold Way	2026-04-01 12:18:54.294167	2026-04-01 12:18:54.294167
7	2	Pasta Palace Owner	pastapalace.owner@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	159 Noodle Blvd	2026-04-01 12:18:54.294167	2026-04-01 12:18:54.294167
8	2	Pho Haven Owner	phohaven.owner@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	753 Soup St	2026-04-01 12:18:54.294167	2026-04-01 12:18:54.294167
9	2	Pizza Town Owner	pizzatown.owner@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	852 Slice Ave	2026-04-01 12:18:54.294167	2026-04-01 12:18:54.294167
10	2	Salad Station Owner	saladstation.owner@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	147 Green Rd	2026-04-01 12:18:54.294167	2026-04-01 12:18:54.294167
11	2	Steak House Owner	steakhouse.owner@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	369 Beef Blvd	2026-04-01 12:18:54.294167	2026-04-01 12:18:54.294167
12	2	Sushi World Owner	sushiworld.owner@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	258 Fish St	2026-04-01 12:18:54.294167	2026-04-01 12:18:54.294167
13	2	Taco Fiesta Owner	tacofiesta.owner@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	741 Mexico Way	2026-04-01 12:18:54.294167	2026-04-01 12:18:54.294167
14	2	Fire Chili Owner	firechili.owner@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	852 Spice Rd	2026-04-01 12:18:54.294167	2026-04-01 12:18:54.294167
15	2	Vegan Delight Owner	vegandelight.owner@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	963 Plant Ave	2026-04-01 12:18:54.294167	2026-04-01 12:18:54.294167
16	2	Smooth Sip Owner	smoothsip.owner@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	123 Tea Lane	2026-04-01 12:18:54.294167	2026-04-01 12:18:54.294167
17	3	user1	user1@example.com	$2b$10$cbid4GaRvUHWtrCMvM.XxOUZxUtQOXXIHxmj2/w1OyhN0.uGdEbki	510 S Center St	2026-04-11 20:45:51.374001	2026-04-11 23:43:41.463072
18	1	admin	admin@example.com	$2b$10$4WpvudzY58ei0vL2wFViDe.HGmITlEzktlhtaIqj56DZtMRdBHs1O	\N	2026-04-12 00:36:46.616467	2026-04-12 00:36:46.616467
\.


--
-- TOC entry 3621 (class 0 OID 0)
-- Dependencies: 243
-- Name: cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: don24015_cse340_restaurant
--

SELECT pg_catalog.setval('public.cart_id_seq', 20, true);


--
-- TOC entry 3622 (class 0 OID 0)
-- Dependencies: 227
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: don24015_cse340_restaurant
--

SELECT pg_catalog.setval('public.categories_id_seq', 27, true);


--
-- TOC entry 3623 (class 0 OID 0)
-- Dependencies: 248
-- Name: contact_form_id_seq; Type: SEQUENCE SET; Schema: public; Owner: don24015_cse340_restaurant
--

SELECT pg_catalog.setval('public.contact_form_id_seq', 2, true);


--
-- TOC entry 3624 (class 0 OID 0)
-- Dependencies: 231
-- Name: deals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: don24015_cse340_restaurant
--

SELECT pg_catalog.setval('public.deals_id_seq', 3, true);


--
-- TOC entry 3625 (class 0 OID 0)
-- Dependencies: 236
-- Name: dishes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: don24015_cse340_restaurant
--

SELECT pg_catalog.setval('public.dishes_id_seq', 96, true);


--
-- TOC entry 3626 (class 0 OID 0)
-- Dependencies: 238
-- Name: order_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: don24015_cse340_restaurant
--

SELECT pg_catalog.setval('public.order_status_id_seq', 4, true);


--
-- TOC entry 3627 (class 0 OID 0)
-- Dependencies: 240
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: don24015_cse340_restaurant
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- TOC entry 3628 (class 0 OID 0)
-- Dependencies: 233
-- Name: restaurants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: don24015_cse340_restaurant
--

SELECT pg_catalog.setval('public.restaurants_id_seq', 16, true);


--
-- TOC entry 3629 (class 0 OID 0)
-- Dependencies: 246
-- Name: review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: don24015_cse340_restaurant
--

SELECT pg_catalog.setval('public.review_id_seq', 1, true);


--
-- TOC entry 3630 (class 0 OID 0)
-- Dependencies: 225
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: don24015_cse340_restaurant
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- TOC entry 3631 (class 0 OID 0)
-- Dependencies: 229
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: don24015_cse340_restaurant
--

SELECT pg_catalog.setval('public.users_id_seq', 18, true);


--
-- TOC entry 3406 (class 2606 OID 155390)
-- Name: cart_dish cart_dish_pkey; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.cart_dish
    ADD CONSTRAINT cart_dish_pkey PRIMARY KEY (cart_id, dish_id);


--
-- TOC entry 3402 (class 2606 OID 155374)
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- TOC entry 3374 (class 2606 OID 155192)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3376 (class 2606 OID 155194)
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- TOC entry 3410 (class 2606 OID 155437)
-- Name: contact_form contact_form_pkey; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.contact_form
    ADD CONSTRAINT contact_form_pkey PRIMARY KEY (id);


--
-- TOC entry 3382 (class 2606 OID 155233)
-- Name: deals deals_code_key; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.deals
    ADD CONSTRAINT deals_code_key UNIQUE (code);


--
-- TOC entry 3384 (class 2606 OID 155231)
-- Name: deals deals_pkey; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.deals
    ADD CONSTRAINT deals_pkey PRIMARY KEY (id);


--
-- TOC entry 3392 (class 2606 OID 155295)
-- Name: dishes dishes_pkey; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.dishes
    ADD CONSTRAINT dishes_pkey PRIMARY KEY (id);


--
-- TOC entry 3394 (class 2606 OID 155297)
-- Name: dishes dishes_slug_key; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.dishes
    ADD CONSTRAINT dishes_slug_key UNIQUE (slug);


--
-- TOC entry 3400 (class 2606 OID 155355)
-- Name: order_dish order_dish_pkey; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.order_dish
    ADD CONSTRAINT order_dish_pkey PRIMARY KEY (order_id, dish_id);


--
-- TOC entry 3396 (class 2606 OID 155317)
-- Name: order_status order_status_pkey; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.order_status
    ADD CONSTRAINT order_status_pkey PRIMARY KEY (id);


--
-- TOC entry 3398 (class 2606 OID 155330)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3390 (class 2606 OID 155270)
-- Name: restaurant_category restaurant_category_pkey; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.restaurant_category
    ADD CONSTRAINT restaurant_category_pkey PRIMARY KEY (restaurant_id, category_id);


--
-- TOC entry 3386 (class 2606 OID 155251)
-- Name: restaurants restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_pkey PRIMARY KEY (id);


--
-- TOC entry 3388 (class 2606 OID 155253)
-- Name: restaurants restaurants_slug_key; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_slug_key UNIQUE (slug);


--
-- TOC entry 3408 (class 2606 OID 155412)
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (id);


--
-- TOC entry 3370 (class 2606 OID 155180)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3372 (class 2606 OID 155182)
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- TOC entry 3368 (class 2606 OID 74947)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 3404 (class 2606 OID 155381)
-- Name: cart unique_user_cart; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT unique_user_cart UNIQUE (user_id);


--
-- TOC entry 3378 (class 2606 OID 155212)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3380 (class 2606 OID 155210)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3366 (class 1259 OID 74948)
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: don24015_cse340_restaurant
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- TOC entry 3424 (class 2606 OID 155391)
-- Name: cart_dish cart_dish_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.cart_dish
    ADD CONSTRAINT cart_dish_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON DELETE CASCADE;


--
-- TOC entry 3425 (class 2606 OID 155396)
-- Name: cart_dish cart_dish_dish_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.cart_dish
    ADD CONSTRAINT cart_dish_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.dishes(id) ON DELETE CASCADE;


--
-- TOC entry 3423 (class 2606 OID 155375)
-- Name: cart cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3428 (class 2606 OID 155438)
-- Name: contact_form contact_form_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.contact_form
    ADD CONSTRAINT contact_form_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3416 (class 2606 OID 155303)
-- Name: dishes dishes_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.dishes
    ADD CONSTRAINT dishes_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- TOC entry 3417 (class 2606 OID 155298)
-- Name: dishes dishes_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.dishes
    ADD CONSTRAINT dishes_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE;


--
-- TOC entry 3411 (class 2606 OID 155213)
-- Name: users fk_user_role; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET DEFAULT;


--
-- TOC entry 3421 (class 2606 OID 155361)
-- Name: order_dish order_dish_dish_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.order_dish
    ADD CONSTRAINT order_dish_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.dishes(id) ON DELETE CASCADE;


--
-- TOC entry 3422 (class 2606 OID 155356)
-- Name: order_dish order_dish_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.order_dish
    ADD CONSTRAINT order_dish_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 3418 (class 2606 OID 155336)
-- Name: orders orders_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE SET NULL;


--
-- TOC entry 3419 (class 2606 OID 155341)
-- Name: orders orders_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.order_status(id);


--
-- TOC entry 3420 (class 2606 OID 155331)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3414 (class 2606 OID 155276)
-- Name: restaurant_category restaurant_category_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.restaurant_category
    ADD CONSTRAINT restaurant_category_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- TOC entry 3415 (class 2606 OID 155271)
-- Name: restaurant_category restaurant_category_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.restaurant_category
    ADD CONSTRAINT restaurant_category_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE;


--
-- TOC entry 3412 (class 2606 OID 155259)
-- Name: restaurants restaurants_deal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_deal_id_fkey FOREIGN KEY (deal_id) REFERENCES public.deals(id) ON DELETE SET NULL;


--
-- TOC entry 3413 (class 2606 OID 155254)
-- Name: restaurants restaurants_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3426 (class 2606 OID 155413)
-- Name: review review_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE;


--
-- TOC entry 3427 (class 2606 OID 155418)
-- Name: review review_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: don24015_cse340_restaurant
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3607 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO PUBLIC;


--
-- TOC entry 3608 (class 0 OID 0)
-- Dependencies: 7
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO don24015_cse340_restaurant;


-- Completed on 2026-04-13 20:56:48

--
-- PostgreSQL database dump complete
--

\unrestrict pXiPm36y4zCvAlI9jkH5XyDab9ReK7veXhCL98wH3gsoVVzZLx1Q7og4vWapHbr


import { getCartbyUser } from "../models/cart/cart.js";

//handle loading css file and js file
const setHeadAssetsFunctionality = (res) => {
  res.locals.styles = [
    { content: '<link rel="stylesheet" href="/css/global.css">', priority: 0 },
    { content: '<link rel="stylesheet" href="/css/header.css">', priority: 0 },
    { content: '<link rel="stylesheet" href="/css/sidebar.css">', priority: 0 },
    { content: '<link rel="stylesheet" href="/css/cart.css">', priority: 0 },
    { content: '<link rel="stylesheet" href="/css/error.css">', priority: 0 },
  ];

  res.locals.scripts = [
    {
      content: '<script src="/js/base.js" type="module"></script>',
      priority: 0,
    },
  ];

  res.addStyle = (css, priority = 0) => {
    res.locals.styles.push({ content: css, priority });
  };

  res.addScript = (js, priority = 0) => {
    res.locals.scripts.push({ content: js, priority });
  };

  res.locals.renderStyles = () => {
    return res.locals.styles
      .sort((a, b) => b.priority - a.priority)
      .map((item) => item.content)
      .join("\n");
  };

  res.locals.renderScripts = () => {
    return res.locals.scripts
      .sort((a, b) => b.priority - a.priority)
      .map((item) => item.content)
      .join("\n");
  };
};

const addLocalVariables = async (req, res, next) => {
  try {
    res.locals.currentYear = new Date().getFullYear();

    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";

    res.locals.queryParams = { ...req.query };

    res.locals.isLoggedIn = false;
    if (req.session && req.session.user) {
      res.locals.isLoggedIn = true;
      res.locals.user = req.session.user;
    }

    res.locals.cart = {};
    res.locals.cartNumber = 0;
    setHeadAssetsFunctionality(res);


    if (req.session && req.session.user) {
      const userId = req.session.user.id;
      try {
        const cart = await getCartbyUser(userId);
        let cartNumber = 0;
        if (cart) {
          res.locals.cart = cart;
          Object.values(cart).forEach((rest) => {
            rest.dishes.forEach((dish) => {
              cartNumber += dish.quantity;
            });
          });
          res.locals.cartNumber = cartNumber;
        }
      } catch (error) {
        console.log("Error", error);
      }
    }


    next();
  } catch (err) {
    next(err);
  }
};

// const setAuth = (req, res, next) => {
//   res.locals.isLoggedIn = false;

//   if (req.session?.user) {
//     res.locals.isLoggedIn = true;
//     res.locals.user = req.session.user;
//   }

//   next();
// };

// const setGlobals = (req, res, next) => {
//   res.locals.currentYear = new Date().getFullYear();
//   res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
//   res.locals.queryParams = { ...req.query };

//   setHeadAssetsFunctionality(res);

//   next();
// };

// const setCart = async (req, res, next) => {
//   if (!req.session?.user) return next();

//   try {
//     const cart = await getCartbyUser(req.session.user.id);

//     let cartNumber = 0;

//     if (cart) {
//       res.locals.cart = cart;
//       Object.values(cart).forEach((rest) => {
//         rest.dishes.forEach((dish) => {
//           cartNumber += dish.quantity;
//         });
//       });
//     }

//     res.locals.cartNumber = cartNumber;
//   } catch (err) {
//     console.log("Cart error:", err);
//     // ❗ don’t crash the app
//   }

//   next();
// };

export { addLocalVariables };

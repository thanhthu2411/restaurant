import { getCartbyUser } from "../models/order&cart/cart.js";
import { isResOpen } from "../models/order&cart/order.js";

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
        { content: '<script src="/js/base.js" type="module"></script>', priority: 0 }
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
            .map(item => item.content)
            .join('\n');
    };

    res.locals.renderScripts = () => {
        return res.locals.scripts
            .sort((a, b) => b.priority - a.priority)
            .map(item => item.content)
            .join('\n');
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
    if (req.session && req.session.user) {
      const userId = req.session.user.id;
      const cart = await getCartbyUser(userId);
      res.locals.cart = cart;
    }

    // res.locals.isResOpen = false;
    // const resSlug = req.params.resSlug;
    // if (resSlug) {
    //   res.locals.isResOpen = await isResOpen(resSlug);
    // }
    // res.locals.resContainerClass = res.locals.isResOpen ? 'res-open' : 'res-closed';

    setHeadAssetsFunctionality(res);

    next();
  } catch (err) {
    next(err);
  }
};

export { addLocalVariables };

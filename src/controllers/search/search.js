import { Router } from "express";
import { getDishByCategory } from "../../models/dish/dish.js";
import { query } from "express-validator";


const router = Router();

const renderSearchPage = (req, res) => {
    res.render('searchresult', {
        title: "Search Result"
    })
}

const fetchSearchResults = async (req, res, next) => {
    try {
        const searchQuery = req.query.q
        const dishes = await getDishByCategory(searchQuery)

        res.json({
            success: true,
            data: dishes,
            query: searchQuery
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {message: 'Search failed'}
        })
    }
}

router.get('/', renderSearchPage);
router.get('/results', fetchSearchResults);

export default router;
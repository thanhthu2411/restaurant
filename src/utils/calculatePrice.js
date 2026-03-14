export const calculatePrice = (order, deal = null) => {
    const deliveryFee = order.deliveryFee;
    let subtotal = order.dishes.reduce((acc, dish) => {
        return acc + parseFloat(dish.price) * dish.quantity;
    }, 0);
    subtotal = subtotal.toFixed(2);
    const tax = (subtotal * 0.1).toFixed(2);
    const total = (parseFloat(deliveryFee) + parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

    return {
        deliveryFee: deliveryFee,
        subtotal: subtotal,
        tax: tax,
        total: total
    }
};

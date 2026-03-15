export const getMessage = (order) => {
  const status = order.orderStatus;
  let message, submessage;

  if (status === "confirmed") {
    message = "Confirming your order";
    submessage = `We sent your order to ${order.restaurantName} for final confirmation.`;
  } else if (status === "preparing") {
    message = "Preparing your order";
    submessage = `${order.restaurantName} is preparing your order.`;
  } else if (status === "shipped") {
    message = "Picking up your order";
    submessage = "Your shipper is heading to your location.";
  } else if (status === "delivered") {
    message = "Order Complete";
    submessage = "Your order has arrived!";
  } else {
    message = "Checking your order status...";
    submessage = "";
  }

  return {message, submessage};
};

export const getMessage = (order) => {
  const status = order.orderStatus;
  let message, submessage, arrivalTime;

  if (status === "confirmed") {
    message = "Confirming your order";
    submessage = `We sent your order to ${order.restaurantName} for final confirmation.`;
    arrivalTime = order.deliveryMinutes + 15;
  } else if (status === "preparing") {
    message = "Preparing your order";
    submessage = `${order.restaurantName} is preparing your order.`;
    arrivalTime = order.deliveryMinutes + 15;
  } else if (status === "shipped") {
    message = "Picking up your order";
    submessage = "Your shipper is heading to your location.";
    arrivalTime = order.deliveryMinutes;
  } else if (status === "delivered") {
    message = "Order Complete";
    submessage = "Your order has arrived!";
    arrivalTime = 0;
  } else {
    message = "Checking your order status...";
    submessage = "";
    arrivalTime = 0;
  }

  return { message, submessage, arrivalTime };
};

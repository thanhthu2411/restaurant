let pollingInterval;

const updateStatusBar = (orderStatus) => {
    const statuses = ['confirmed', 'preparing', 'shipped', 'delivered'];

    statuses.forEach((status, index) => {
        const span = document.getElementById(`status-${status}`);
        const line = index < statuses.length - 1 ? document.getElementById(`line-${status}`) : null;

        if (statuses.indexOf(orderStatus) > statuses.indexOf(status)) {
            span.classList.add('checked');
            if (line) line.classList.add('line-active');
        } else if (orderStatus === status) {
            span.classList.add('status-active');
            if (line) line.classList.add('line-active');
        } else {
            span.classList.remove('status-active', 'checked');
            if (line) line.classList.remove('line-active');
        }
    });
}


export const checkOrderStatus = async () => {
  let data = {};
  const orderId = window.location.pathname.split("/").filter(Boolean).pop();
  const response = await fetch(`/order/${orderId}/status`);
  if (response.ok) {
    data = await response.json();
  } else throw new Error("response not ok");
  console.log(orderId);
  console.log(data.orderStatus);

  updateStatusBar(data.orderStatus);
  document.querySelector(".message").textContent = data.message;
  document.querySelector(".submessage").textContent = data.submessage;

  if (data.orderStatus === "delivered") {
            clearInterval(pollingInterval); 
        }
};

pollingInterval = setInterval(checkOrderStatus, 60000);
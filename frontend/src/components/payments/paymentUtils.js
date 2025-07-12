export async function handlePayment(fees, student, onSuccessCallback) {
  const amountInPaise = parseInt(fees) * 100;

  try {
    const res = await fetch('http://localhost:8080/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amountInPaise }),
    });

    const orderData = await res.json();

    const options = {
      key: "rzp_test_l3WNLIY1GCzUyR",
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Hostel Management System",
      description: "Room + Food Payment",
      order_id: orderData.id,
      handler: async function (response) {
        alert("✅ Payment Successful!\nPayment ID: " + response.razorpay_payment_id);

        try {
          const verifyRes = await fetch("http://localhost:8080/api/payment/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              email: student.email,
            }),
          });

          const message = await verifyRes.text();
          alert(message);

          // 🔄 Call UI update callback instead of reloading the page
          if (onSuccessCallback) {
            onSuccessCallback();
          }

        } catch (err) {
          console.error("Verification failed:", err);
          alert("❌ Payment verification failed.");
        }
      },
      prefill: {
        name: student.name,
        email: student.email,
        contact: student.contact,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    alert("❌ Failed to initiate payment. Please try again.");
  }
}

const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51Q294rK9CZvo11CFlHBpdet7U0FcuOXIUlFaVmm8JFQEnu5yokVF5WayIlBW3b9ZTlSNgnBELm8WGCFnb4X81AeC00T2zQE1cR"
);

const app = express();

app.use(cors());
app.use(express.json()); // Add this middleware to parse JSON requests

app.get("/", (req, res) => {
  res.send("Server Is Running");
});

app.post("/payment", async (req, res) => {
  try {
    // Create product
    const product = await stripe.products.create({
      name: "Membership",
    });

    // Create price for product
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 349 * 100, // in cents (for 100 INR)
      currency: "usd",
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://blogger-stricks.netlify.app/checkout",
      cancel_url: "https://blogger-stricks.netlify.app/checkout",
      customer_email: "DishantSangani@gmail.com",
    });

    // Return the session URL to the client
    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating payment: ", error);
    res.status(500).json({ error: "Payment creation failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

const express = require('express');
const { PrismaClient } = require('@prisma/client'); // Import PrismaClient
const router = express.Router();

const prisma = new PrismaClient(); // Initialize PrismaClient

// Check if the user is logged in
function checkAuth(req, res, next) {
  if (!req.session || !req.session.customer_id) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }
  next();
}

// Get all products route
router.get('/all', async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await prisma.product.findMany();
    
    // Send the list of products as JSON
    res.status(200).json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ error: 'An error occurred while retrieving products' });
  }
});

// Get product by ID route
router.get('/:id', async (req, res) => {
  const productId = req.params.id;

  if (!/^\d+$/.test(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { product_id: Number(productId) },
    });

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the product' });
  }
});


// Purchase route
router.post('/purchase', checkAuth, async (req, res) => {
  const {
    street, city, province, country, postal_code,
    credit_card, credit_expire, credit_cvv, cart,
    invoice_amt, invoice_tax, invoice_total,
  } = req.body;

  if (
    !street || !city || !province || !country || !postal_code ||
    !credit_card || !credit_expire || !credit_cvv ||
    !invoice_amt || !invoice_tax || !invoice_total
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  console.log('Request body:', req.body); // Log to debug

  const customer_id = req.session.customer_id;

  try {
    const purchase = await prisma.purchase.create({
      data: {
        customer_id,
        street,
        city,
        province,
        country,
        postal_code,
        credit_card,
        credit_expire,
        credit_cvv,
        invoice_amt: parseFloat(invoice_amt),
        invoice_tax: parseFloat(invoice_tax),
        invoice_total: parseFloat(invoice_total),
        order_date: new Date(),
      },
    });

    const cartItems = cart.split(',').reduce((acc, productId) => {
      acc[productId] = (acc[productId] || 0) + 1;
      return acc;
    }, {});

    const purchaseItems = Object.entries(cartItems).map(([product_id, quantity]) => ({
      purchase_id: purchase.purchase_id,
      product_id: Number(product_id),
      quantity,
    }));

    await prisma.purchaseItem.createMany({
      data: purchaseItems,
    });

    res.status(201).json({ message: 'Purchase successful', purchase });
  } catch (error) {
    console.error('Error completing purchase:', error.message, error.stack);
    res.status(500).json({ error: 'An error occurred during purchase' });
  }
});


module.exports = router;
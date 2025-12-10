# Quick Reference Guide

## Pages & Routes

| Feature | URL | Description |
|---------|-----|-------------|
| Sales Management | `/sales-management` | Create, view, edit, delete sales |
| Customer Management | `/customers` | Add, view, edit, delete customers |
| Customer Details | `/customers/:id` | View customer profile and sales history |

## Quick Actions

### Add Customer
1. Go to Customers page
2. Click "Add Customer" button
3. Fill form (ID auto-generates)
4. Save

### Create Sale
1. Go to Sales Management
2. Click "New Sale"
3. Select customer
4. Add items
5. Create

### View Customer Sales
1. Go to Customers
2. Click eye icon
3. See purchase history
4. Click item to view details

## Database Fields

### Customer
- **customer_id** - Auto-generated (CUS0001)
- **name** - Required
- **contact_number** - Required
- **email** - Optional
- **address** - Optional
- **vehicle_number** - Optional
- **loyalty_points** - Auto-calculated
- **total_purchases** - Auto-calculated

### Sale
- **sale_number** - Auto-generated (S00001)
- **customer_id** - Optional (can be guest)
- **customer_name** - Required
- **vehicle_number** - Required
- **sale_date** - Required
- **items[]** - Multiple items with pump, fuel, qty, price
- **payment_method** - Cash/Card/UPI/Credit
- **subtotal** - Auto-calculated
- **tax** - Auto-calculated (10%)
- **final_total** - Auto-calculated

## Statistics

### Sales Dashboard Cards
- **Total Sales** - Number of transactions
- **Total Revenue** - Sum of all final totals
- **Today's Sales** - Transactions from today
- **Avg Sale Value** - Revenue ÷ Total sales

### Customer Dashboard Cards
- **Total Customers** - Count of all customers
- **Total Purchases** - Sum of all purchases
- **Avg Purchase** - Total ÷ Customers
- **Total Points** - Sum of all loyalty points

### Customer Detail Cards
- **Total Purchases** - This customer's total
- **Total Sales** - This customer's transactions
- **Loyalty Points** - This customer's points

## Fuel Prices

| Fuel Type | Price/Liter |
|-----------|-------------|
| Petrol 95 | $1.45 |
| Petrol 98 | $1.65 |
| Diesel | $1.35 |
| Diesel Premium | $1.55 |

## Payment Methods

- Cash
- Card
- UPI
- Credit

## Auto-Calculations

- **Sale Item Total** = Quantity × Price
- **Subtotal** = Sum of all item totals
- **Tax** = Subtotal × 10%
- **Final Total** = Subtotal + Tax
- **Loyalty Points** = Floor(Final Total)
- **Customer Total Purchases** = Sum of all their sales

## Colors Used

| Metric | Color |
|--------|-------|
| Sales Count | Blue |
| Revenue | Green |
| Today/Time | Amber |
| Average/Other | Cyan |

## File Locations

| Component | File |
|-----------|------|
| Supabase Setup | `src/lib/supabase.ts` |
| Customer Store | `src/stores/customersSupabase.ts` |
| Sales Store | `src/stores/salesSupabase.ts` |
| Sales Page | `src/pages/SalesManagementPageNew.vue` |
| Customers Page | `src/pages/CustomerManagementPageNew.vue` |
| Detail Page | `src/pages/CustomerDetailPageNew.vue` |

## Commands

```bash
# Install
npm install

# Start
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## Environment Variables

```
VITE_NEXT_PUBLIC_SUPABASE_URL=https://cnrqevubxlzbmjngztvz.supabase.co
VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

## Tips

1. **Auto-fill:** Select customer → vehicle number auto-fills
2. **Auto-calculate:** Select fuel type → price auto-fills
3. **Auto-generate:** Customer ID and Sale numbers are automatic
4. **Search:** Works across multiple fields in real-time
5. **Mobile:** All pages work perfectly on phones
6. **Responsive:** Tables collapse on small screens
7. **Safe Delete:** All deletes require confirmation
8. **Toast Alerts:** Feedback for all actions
9. **Loading States:** Spinners show during operations
10. **Empty States:** Helpful messages when no data exists

## Common Tasks

**Add a new customer:**
```
Customers → Add Customer → Fill info → Save
```

**Track a sale:**
```
Sales → New Sale → Select Customer → Add Items → Create
```

**View customer history:**
```
Customers → Click Eye Icon → See Purchase History
```

**See sale details:**
```
Customer Details → Purchase History → Click Eye Icon
```

**Edit information:**
```
Click Pencil Icon → Modify → Update
```

**Remove record:**
```
Click Trash Icon → Confirm Delete
```

## Keyboard Shortcuts

- Tab: Navigate between fields
- Enter: Submit form
- Escape: Close modal

## Best Practices

1. Always link sales to customers (builds relationship data)
2. Complete customer information for better tracking
3. Check statistics for business insights
4. Review customer details for purchase patterns
5. Use search to find records quickly
6. Delete with caution (no undo available)
7. Monitor today's sales for daily metrics
8. Track loyalty points for customer rewards

---

**That's it! Your petrol pump management system is ready to use. Start by adding customers, then create sales. Enjoy!** 🎉

const sampleProducts = [
    {
        id: 1,
        name: "Classic White T-Shirt",
        category: "Clothing",
        price: 39.90,
        stock: 50
    },
    {
        id: 2,
        name: "Leather Handbag",
        category: "Accessories",
        price: 129.90,
        stock: 25
    },
    {
        id: 3,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 89.90,
        stock: 15
    },
    {
        id: 4,
        name: "Running Shoes",
        category: "Footwear",
        price: 159.90,
        stock: 30
    },
    {
        id: 5,
        name: "Stainless Steel Bottle",
        category: "Lifestyle",
        price: 29.90,
        stock: 8
    },
    {
        id: 6,
        name: "Casual Denim Jacket",
        category: "Clothing",
        price: 119.90,
        stock: 20
    }
];

const sampleOrders = [
    { id: "ORD001", customer: "Aisyah Rahman", date: "2026-01-12", items: "Classic White T-Shirt", total: 59.90, status: "Delivered" },
    { id: "ORD002", customer: "Daniel Lee", date: "2026-01-25", items: "Wireless Headphones", total: 89.90, status: "Delivered" },
    { id: "ORD003", customer: "Nur Amirah", date: "2026-02-08", items: "Leather Handbag", total: 129.90, status: "Delivered" },
    { id: "ORD004", customer: "Adam Hakim", date: "2026-02-19", items: "Running Shoes", total: 159.90, status: "Shipped" },
    { id: "ORD005", customer: "Sofia Tan", date: "2026-03-05", items: "Stainless Steel Bottle", total: 29.90, status: "Delivered" },
    { id: "ORD006", customer: "Farah Nadia", date: "2026-03-21", items: "Casual Denim Jacket", total: 119.90, status: "Delivered" },
    { id: "ORD007", customer: "Aisyah Rahman", date: "2026-04-10", items: "Running Shoes", total: 159.90, status: "Delivered" },
    { id: "ORD008", customer: "Daniel Lee", date: "2026-04-22", items: "Wireless Headphones", total: 89.90, status: "Processing" },
    { id: "ORD009", customer: "Nur Amirah", date: "2026-05-03", items: "Leather Handbag", total: 129.90, status: "Delivered" },
    { id: "ORD010", customer: "Adam Hakim", date: "2026-05-17", items: "Classic White T-Shirt", total: 59.90, status: "Delivered" },
    { id: "ORD011", customer: "Sofia Tan", date: "2026-06-09", items: "Running Shoes", total: 159.90, status: "Delivered" },
    { id: "ORD012", customer: "Farah Nadia", date: "2026-06-24", items: "Leather Handbag", total: 129.90, status: "Pending" },
    { id: "ORD013", customer: "Aisyah Rahman", date: "2026-07-06", items: "Wireless Headphones", total: 89.90, status: "Delivered" },
    { id: "ORD014", customer: "Daniel Lee", date: "2026-07-19", items: "Casual Denim Jacket", total: 119.90, status: "Delivered" },
    { id: "ORD015", customer: "Nur Amirah", date: "2026-08-11", items: "Stainless Steel Bottle", total: 29.90, status: "Delivered" },
    { id: "ORD016", customer: "Adam Hakim", date: "2026-08-25", items: "Running Shoes", total: 159.90, status: "Cancelled" },
    { id: "ORD017", customer: "Sofia Tan", date: "2026-09-07", items: "Leather Handbag", total: 129.90, status: "Delivered" },
    { id: "ORD018", customer: "Farah Nadia", date: "2026-09-20", items: "Wireless Headphones", total: 89.90, status: "Shipped" },
    { id: "ORD019", customer: "Aisyah Rahman", date: "2026-10-04", items: "Running Shoes", total: 159.90, status: "Delivered" },
    { id: "ORD020", customer: "Daniel Lee", date: "2026-10-18", items: "Classic White T-Shirt", total: 59.90, status: "Processing" },
    { id: "ORD021", customer: "Nur Amirah", date: "2026-11-10", items: "Leather Handbag", total: 129.90, status: "Pending" },
    { id: "ORD022", customer: "Adam Hakim", date: "2026-11-12", items: "Stainless Steel Bottle", total: 29.90, status: "Shipped" },
    { id: "ORD023", customer: "Sofia Tan", date: "2026-11-14", items: "Casual Denim Jacket", total: 119.90, status: "Delivered" },
    { id: "ORD024", customer: "Farah Nadia", date: "2026-12-03", items: "Wireless Headphones", total: 89.90, status: "Pending" },
    { id: "ORD025", customer: "Aisyah Rahman", date: "2026-12-15", items: "Running Shoes", total: 159.90, status: "Processing" }
];

const sampleCustomers = [
    {
        id: 1,
        name: "Aisyah Rahman",
        email: "aisyah@email.com",
        phone: "012-3456789",
        address: "Kuching, Sarawak",
        date: "2026-11-01"
    },
    {
        id: 2,
        name: "Daniel Lee",
        email: "daniel@email.com",
        phone: "013-4567890",
        address: "Shah Alam, Selangor",
        date: "2026-11-03"
    },
    {
        id: 3,
        name: "Nur Amirah",
        email: "nuramirah@email.com",
        phone: "014-5678901",
        address: "Kuala Lumpur",
        date: "2026-11-05"
    },
    {
        id: 4,
        name: "Adam Hakim",
        email: "adam@email.com",
        phone: "016-6789012",
        address: "Petaling Jaya, Selangor",
        date: "2026-11-10"
    },
    {
        id: 5,
        name: "Sofia Tan",
        email: "sofia@email.com",
        phone: "017-7890123",
        address: "Johor Bahru, Johor",
        date: "2026-11-14"
    }
];
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const errorMessage = document.getElementById("errorMessage");

        const correctUsername = "admin";
        const correctPassword = "admin123";

        if (
            username === correctUsername &&
            password === correctPassword
        ) {

            window.location.href = "dashboard.html";

        } else {

            errorMessage.classList.remove("d-none");

        }

    });

}

function addRecentActivity(message, type) {

    let activities = JSON.parse(
        localStorage.getItem("shopEaseActivities")
    ) || [];

    const newActivity = {
        message: message,
        type: type,
        date: new Date().toLocaleString()
    };

    activities.unshift(newActivity);

    activities = activities.slice(0, 5);

    localStorage.setItem(
        "shopEaseActivities",
        JSON.stringify(activities)
    );

}

const recentActivitiesList = document.getElementById(
    "recentActivitiesList"
);

if (recentActivitiesList) {

    function displayRecentActivities() {

        const activities = JSON.parse(
            localStorage.getItem("shopEaseActivities")
        ) || [];

        recentActivitiesList.innerHTML = "";

        if (activities.length === 0) {

            recentActivitiesList.innerHTML = `
                <p class="text-muted mb-0">
                    No recent activities yet.
                </p>
            `;

            return;
        }

        activities.forEach(function(activity) {

            const activityItem = document.createElement("div");

            activityItem.className =
                "d-flex align-items-start gap-3 py-3 border-bottom";

            let activityIcon = "📌";

            if (activity.type === "product") {
                activityIcon = "📦";
            } else if (activity.type === "order") {
                activityIcon = "🛒";
            } else if (activity.type === "customer") {
                activityIcon = "👤";
            }

            const icon = document.createElement("span");
            icon.textContent = activityIcon;
            icon.style.fontSize = "22px";

            const details = document.createElement("div");

            const message = document.createElement("p");
            message.className = "mb-1 fw-semibold";
            message.textContent = activity.message;

            const date = document.createElement("small");
            date.className = "text-muted";
            date.textContent = activity.date;

            details.appendChild(message);
            details.appendChild(date);

            activityItem.appendChild(icon);
            activityItem.appendChild(details);

            recentActivitiesList.appendChild(activityItem);

        });

    }

    displayRecentActivities();

}

const dashboardSummary = document.getElementById("dashboardRevenue");

if (dashboardSummary) {

    const dashboardSummaryOrders =
        JSON.parse(localStorage.getItem("shopEaseOrders")) || sampleOrders;

    const dashboardSummaryCustomers =
        JSON.parse(localStorage.getItem("shopEaseCustomers")) || sampleCustomers;

    const dashboardSummaryProducts =
        JSON.parse(localStorage.getItem("shopEaseProducts")) || sampleProducts;

    const validDashboardOrders = dashboardSummaryOrders.filter(
        order => order.status !== "Cancelled"
    );

    const dashboardRevenue = validDashboardOrders.reduce(
        (total, order) => total + Number(order.total || 0), 0
    );

    document.getElementById("dashboardRevenue").textContent =
        "RM " + dashboardRevenue.toFixed(2);

    document.getElementById("dashboardOrders").textContent =
        dashboardSummaryOrders.length;

    document.getElementById("dashboardCustomers").textContent =
        dashboardSummaryCustomers.length;

    document.getElementById("dashboardProducts").textContent =
        dashboardSummaryProducts.length;
}

const salesCanvas = document.getElementById("salesChart");

if (salesCanvas) {

    let dashboardOrders = JSON.parse(localStorage.getItem("shopEaseOrders")) || [];

sampleOrders.forEach(function(sampleOrder) {
    const existingIndex = dashboardOrders.findIndex(function(order) {
        return order.id === sampleOrder.id;
    });

    if (existingIndex === -1) {
        dashboardOrders.push(sampleOrder);
    }
});

    localStorage.setItem("shopEaseOrders", JSON.stringify(dashboardOrders));

    const monthNames = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    const monthlySales = new Array(12).fill(0);

    dashboardOrders.forEach(function(order) {
        const orderDate = new Date(order.date + "T00:00:00");

        if (
            orderDate.getFullYear() === 2026 &&
            order.status !== "Cancelled"
        ) {
            const month = orderDate.getMonth();
            monthlySales[month] += Number(order.total) || 0;
        }
    });

    new Chart(salesCanvas, {
        type: "bar",
        data: {
            labels: monthNames,
            datasets: [{
                label: "Monthly Sales (RM)",
                data: monthlySales,
                backgroundColor: "#3B82F6",
                borderColor: "#1E3A8A",
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

const productTableBody = document.getElementById("productTableBody");

if (productTableBody) {

    let products = JSON.parse(
        localStorage.getItem("shopEaseProducts")
    ) || sampleProducts;

function saveProducts() {

    localStorage.setItem(
        "shopEaseProducts",
        JSON.stringify(products)
    );

    displayNotifications();

}
let currentProductFilter = "all";

    function displayProducts(productList) {

        productTableBody.innerHTML = "";

        productList.forEach(function(product) {

            let status = "";
            
            if (product.stock === 0) {
                status = '<span class="stock-out">Out of Stock</span>';
            } 
            else if (product.stock <= 10) {
                status = '<span class="stock-low">Low Stock</span>';
            } 
            else {
                status = '<span class="stock-available">Available</span>';
            }


            const row = document.createElement("tr");

            row.innerHTML = `
                <td>#${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>RM ${Number(product.price).toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>${status}</td>

                <td>
                    <button
                        class="action-btn edit-btn"
                        onclick="editProduct(${product.id})">
                        Edit
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteProduct(${product.id})">
                        Delete
                    </button>
                </td>
            `;

            productTableBody.appendChild(row);

        });

        document.getElementById("emptyMessage")
            .classList.toggle("d-none", productList.length !== 0);

    }

    function updateProductStatistics() {

        const totalProducts = products.length;

        const totalStock = products.reduce(
            (total, product) => total + Number(product.stock), 0
        );

        const lowStock = products.filter(
            product => product.stock <= 10
        ).length;


        document.getElementById("totalProducts").textContent = totalProducts;

        document.getElementById("totalStock").textContent = totalStock;

        document.getElementById("lowStock").textContent = lowStock;

    }

function refreshProductPage() {

    let filteredProducts = products;

    if (currentProductFilter === "low-stock") {

        filteredProducts = products.filter(
            product => Number(product.stock) <= 10
        );

    }

    displayProducts(filteredProducts);

    updateProductStatistics();

}

const lowStockCard = document.querySelector(".product-filter-card");

if (lowStockCard) {

    function showLowStockProducts() {

    if (currentProductFilter === "low-stock") {
        currentProductFilter = "all";
    } else {
        currentProductFilter = "low-stock";
    }

    document.getElementById("productSearch").value = "";

    refreshProductPage();

    lowStockCard.classList.toggle(
        "active",
        currentProductFilter === "low-stock"
    );

}

    lowStockCard.addEventListener("click", showLowStockProducts);

    lowStockCard.addEventListener("keydown", function(event) {

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showLowStockProducts();
        }

    });

}
const allProductsCard = document.querySelector(".product-all-filter-card");

if (allProductsCard) {

    function showAllProducts() {

        currentProductFilter = "all";

        document.getElementById("productSearch").value = "";

        refreshProductPage();

        lowStockCard.classList.remove("active");

    }

    allProductsCard.addEventListener("click", showAllProducts);

    allProductsCard.addEventListener("keydown", function(event) {

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showAllProducts();
        }

    });

}
document.getElementById("productSearch")
    .addEventListener("input", function() {

        const searchValue = this.value.toLowerCase().trim();

        let filteredProducts = products.filter(function(product) {

            const matchesSearch =
                product.name.toLowerCase().includes(searchValue) ||
                product.category.toLowerCase().includes(searchValue);

            const matchesStock =
                currentProductFilter === "all" ||
                Number(product.stock) <= 10;

            return matchesSearch && matchesStock;

        });

        displayProducts(filteredProducts);

    });

    document.getElementById("addProductBtn")
        .addEventListener("click", function() {

            document.getElementById("productForm").reset();

            document.getElementById("productId").value = "";

            document.getElementById("modalTitle").textContent =
                "Add New Product";

        });

    document.getElementById("productForm")
        .addEventListener("submit", function(event) {

            event.preventDefault();

            const id = document.getElementById("productId").value;

            const name = document.getElementById("productName").value.trim();

            const category = document.getElementById("productCategory").value;

            const price = Number(document.getElementById("productPrice").value);

            const stock = Number(document.getElementById("productStock").value);


            if (!name || !category || price <= 0 || stock < 0 ||
                !Number.isInteger(stock)) {

                alert("Please enter valid product information.");

                return;

            }


            
if (id) {

    const product = products.find(
        item => item.id === Number(id)
    );

    if (product) {

        product.name = name;
        product.category = category;
        product.price = price;
        product.stock = stock;

        addRecentActivity(
            "Updated product: " + name,
            "product"
        );

    }

} else {

    const newProduct = {

        id: products.length > 0
            ? Math.max(...products.map(item => item.id)) + 1
            : 1,

        name: name,
        category: category,
        price: price,
        stock: stock

    };

    products.push(newProduct);

    addRecentActivity(
        "Added new product: " + name,
        "product"
    );

}


            saveProducts();

            refreshProductPage();

            bootstrap.Modal.getOrCreateInstance(
                document.getElementById("productModal")
            ).hide();

            document.getElementById("productForm").reset();

            document.getElementById("productSearch").value = "";

            alert("Product saved successfully!");

        });

    window.editProduct = function(id) {

        const product = products.find(
            item => item.id === id
        );

        if (!product) return;


        document.getElementById("productId").value = product.id;

        document.getElementById("productName").value = product.name;

        document.getElementById("productCategory").value = product.category;

        document.getElementById("productPrice").value = product.price;

        document.getElementById("productStock").value = product.stock;


        document.getElementById("modalTitle").textContent =
            "Edit Product";


        bootstrap.Modal.getOrCreateInstance(
            document.getElementById("productModal")
        ).show();

    };

    window.deleteProduct = function(id) {

        const confirmation = confirm(
            "Are you sure you want to delete this product?"
        );

        
if (confirmation) {

    const deletedProduct = products.find(
        product => product.id === id
    );

    products = products.filter(
        product => product.id !== id
    );

    if (deletedProduct) {
        addRecentActivity(
            "Deleted product: " + deletedProduct.name,
            "product"
        );
    }

    saveProducts();

    refreshProductPage();

    
    alert("Product deleted successfully!");

    }

};

refreshProductPage();

}

const orderTableBody = document.getElementById("orderTableBody");

if (orderTableBody) {

    let orders = JSON.parse(
        localStorage.getItem("shopEaseOrders")
    ) || sampleOrders;

    sampleOrders.forEach(function(sampleOrder) {

        const existingOrder = orders.find(
            order => order.id === sampleOrder.id
        );

        if (!existingOrder) {
            orders.push(sampleOrder);
        }

    });

    let currentOrderStatus = "All";

    function saveOrders() {
        localStorage.setItem("shopEaseOrders", JSON.stringify(orders));
    }

    function updateOrderStatistics() {

        document.getElementById("totalOrders").textContent =
            orders.length;

        document.getElementById("pendingOrders").textContent =
            orders.filter(order => order.status === "Pending").length;

        document.getElementById("processingOrders").textContent =
            orders.filter(order => order.status === "Processing").length;

        document.getElementById("shippedOrders").textContent =
            orders.filter(order => order.status === "Shipped").length;

        document.getElementById("completedOrders").textContent =
            orders.filter(order => order.status === "Delivered").length;

        document.getElementById("cancelledOrders").textContent =
            orders.filter(order => order.status === "Cancelled").length;

    }

    function getFilteredOrders() {

        const searchValue = document.getElementById("orderSearch")
            .value.toLowerCase().trim();

        return orders.filter(function(order) {

            const matchesStatus =
                currentOrderStatus === "All" ||
                order.status === currentOrderStatus;

            const matchesSearch =
                String(order.id).toLowerCase().includes(searchValue) ||
                order.customer.toLowerCase().includes(searchValue);

            return matchesStatus && matchesSearch;

        });

    }

    function displayOrders(orderList = getFilteredOrders()) {

        orderTableBody.innerHTML = "";

        document.getElementById("noOrdersMessage")
            .classList.toggle("d-none", orderList.length !== 0);

        orderList.forEach(function(order) {

            const row = document.createElement("tr");

            const statusClass = "status-" + order.status.toLowerCase();

            row.innerHTML = `
                <td><strong>${order.id}</strong></td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>RM ${Number(order.total).toFixed(2)}</td>

                <td>
                    <select class="form-select order-status-select ${statusClass}"
                        onchange="updateOrderStatus('${order.id}', this.value)">

                        <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="Processing" ${order.status === "Processing" ? "selected" : ""}>Processing</option>
                        <option value="Shipped" ${order.status === "Shipped" ? "selected" : ""}>Shipped</option>
                        <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
                        <option value="Cancelled" ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>

                    </select>
                </td>

                <td>
                    <button class="order-action-btn"
                        onclick="viewOrder('${order.id}')">
                        View
                    </button>
                </td>
            `;

            orderTableBody.appendChild(row);

        });

        updateOrderStatistics();

    }

    const orderFilterCards = document.querySelectorAll(".order-filter-card");

    function selectOrderFilter(status) {

        currentOrderStatus = status;

        orderFilterCards.forEach(function(card) {

            card.classList.toggle(
                "active",
                card.dataset.status === status
            );

        });

        document.getElementById("orderSearch").value = "";

        displayOrders();

    }

    orderFilterCards.forEach(function(card) {

        card.addEventListener("click", function() {
            selectOrderFilter(card.dataset.status);
        });

        card.addEventListener("keydown", function(event) {

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectOrderFilter(card.dataset.status);
            }

        });

    });

    window.updateOrderStatus = function(orderId, newStatus) {

        const order = orders.find(
            item => String(item.id) === String(orderId)
        );

        
if (order) {

    const previousStatus = order.status;

    order.status = newStatus;

    addRecentActivity(
        "Order " + order.id + " status changed from " +
        previousStatus + " to " + newStatus,
        "order"
    );

    saveOrders();

    displayOrders();

    alert("Order status updated successfully!");

}


    };

    window.viewOrder = function(orderId) {

        const order = orders.find(
            item => String(item.id) === String(orderId)
        );

        if (order) {

            document.getElementById("orderDetailsContent").innerHTML = `
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Customer:</strong> ${order.customer}</p>
                <p><strong>Order Date:</strong> ${order.date}</p>
                <p><strong>Items:</strong> ${order.items}</p>
                <p><strong>Total:</strong> RM ${Number(order.total).toFixed(2)}</p>
                <p><strong>Status:</strong> ${order.status}</p>
            `;

            bootstrap.Modal.getOrCreateInstance(
                document.getElementById("orderDetailsModal")
            ).show();

        }

    };

    document.getElementById("orderSearch")
        .addEventListener("input", function() {

            displayOrders();

        });

    saveOrders();

    selectOrderFilter("All");

}

const customerTableBody = document.getElementById("customerTableBody");

if (customerTableBody) {

    let customers = JSON.parse(
        localStorage.getItem("shopEaseCustomers")
    ) || sampleCustomers;

    function saveCustomers() {
        localStorage.setItem(
            "shopEaseCustomers",
            JSON.stringify(customers)
        );
    }

    function displayCustomers(customerList = customers) {

        customerTableBody.innerHTML = "";

        document.getElementById("noCustomersMessage")
            .classList.toggle("d-none", customerList.length !== 0);

        customerList.forEach(customer => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>#${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>
                    <button class="order-action-btn"
                        onclick="viewCustomer(${customer.id})">
                        View
                    </button>

                    <button class="action-btn edit-btn"
                        onclick="editCustomer(${customer.id})">
                        Edit
                    </button>

                    <button class="action-btn delete-btn"
                        onclick="deleteCustomer(${customer.id})">
                        Delete
                    </button>
                </td>
            `;

            customerTableBody.appendChild(row);

        });

        updateCustomerStatistics();
    }

    function updateCustomerStatistics() {

        document.getElementById("totalCustomers").textContent =
            customers.length;

        document.getElementById("newCustomers").textContent =
            customers.filter(customer => customer.date >= "2026-11-01").length;
    }

    document.getElementById("customerForm")
        .addEventListener("submit", function(event) {

            event.preventDefault();

            const id = document.getElementById("customerId").value;

            const name = document.getElementById("customerName").value.trim();
            const email = document.getElementById("customerEmail").value.trim();
            const phone = document.getElementById("customerPhone").value.trim();
            const address = document.getElementById("customerAddress").value.trim();

            if (!name || !email || !phone || !address) {
                alert("Please complete all customer information.");
                return;
            }

            if (id) {

                const customer = customers.find(
                    item => item.id === Number(id)
                );

                if (customer) {
                    customer.name = name;
                    customer.email = email;
                    customer.phone = phone;
                    customer.address = address;
                }

            
} else {

    const newCustomer = {
        id: customers.length > 0
            ? Math.max(...customers.map(item => item.id)) + 1
            : 1,
        name: name,
        email: email,
        phone: phone,
        address: address,
        date: new Date().toISOString().slice(0, 10)
    };

    customers.push(newCustomer);
    addRecentActivity(
        "New customer registered: " + name,
        "customer"
    );
}


            saveCustomers();
            displayCustomers();

            bootstrap.Modal.getOrCreateInstance(
                document.getElementById("customerModal")
            ).hide();

            document.getElementById("customerForm").reset();

            alert("Customer saved successfully!");
        });

    window.editCustomer = function(id) {

        const customer = customers.find(item => item.id === id);

        if (!customer) return;

        document.getElementById("customerId").value = customer.id;
        document.getElementById("customerName").value = customer.name;
        document.getElementById("customerEmail").value = customer.email;
        document.getElementById("customerPhone").value = customer.phone;
        document.getElementById("customerAddress").value = customer.address;

        document.getElementById("customerModalTitle").textContent =
            "Edit Customer";

        bootstrap.Modal.getOrCreateInstance(
            document.getElementById("customerModal")
        ).show();
    };

    document.getElementById("addCustomerBtn")
        .addEventListener("click", function() {

            document.getElementById("customerForm").reset();
            document.getElementById("customerId").value = "";

            document.getElementById("customerModalTitle").textContent =
                "Add New Customer";
        });

    window.deleteCustomer = function(id) {

        const confirmation = confirm(
            "Are you sure you want to delete this customer?"
        );

        if (confirmation) {

            customers = customers.filter(
                customer => customer.id !== id
            );

            saveCustomers();
            displayCustomers();

            alert("Customer deleted successfully!");
        }
    };

    window.viewCustomer = function(id) {

        const customer = customers.find(item => item.id === id);

        if (!customer) return;

        document.getElementById("customerDetailsContent").innerHTML = `
            <p><strong>Customer ID:</strong> ${customer.id}</p>
            <p><strong>Name:</strong> ${customer.name}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Phone:</strong> ${customer.phone}</p>
            <p><strong>Address:</strong> ${customer.address}</p>
            <p><strong>Registration Date:</strong> ${customer.date}</p>
        `;

        bootstrap.Modal.getOrCreateInstance(
            document.getElementById("customerDetailsModal")
        ).show();
    };

    document.getElementById("customerSearch")
        .addEventListener("input", function() {

            const searchValue = this.value.toLowerCase();

            const filteredCustomers = customers.filter(customer =>
                customer.name.toLowerCase().includes(searchValue) ||
                customer.email.toLowerCase().includes(searchValue) ||
                customer.phone.toLowerCase().includes(searchValue)
            );

            displayCustomers(filteredCustomers);
        });

    if (!localStorage.getItem("shopEaseCustomers")) {
        saveCustomers();
    }

    displayCustomers();
}

const salesReportCanvas = document.getElementById("salesReportChart");

if (salesReportCanvas) {

let reportOrders = JSON.parse(
    localStorage.getItem("shopEaseOrders")
) || [];

const reportCustomers = JSON.parse(
    localStorage.getItem("shopEaseCustomers")
) || sampleCustomers;

sampleOrders.forEach(function(sampleOrder) {

    const existingOrder = reportOrders.find(function(order) {
        return order.id === sampleOrder.id;
    });

    if (!existingOrder) {
        reportOrders.push(sampleOrder);
    }

});

localStorage.setItem(
    "shopEaseOrders",
    JSON.stringify(reportOrders)
);

    const validOrders = reportOrders.filter(
        order => order.status !== "Cancelled"
    );

    const totalRevenue = validOrders.reduce(
        (total, order) => total + Number(order.total), 0
    );

    const averageOrderValue = validOrders.length > 0
        ? totalRevenue / validOrders.length
        : 0;

    document.getElementById("reportRevenue").textContent =
        "RM " + totalRevenue.toFixed(2);

    document.getElementById("reportOrders").textContent =
        reportOrders.length;

    document.getElementById("reportCustomers").textContent =
        reportCustomers.length;

    document.getElementById("reportAverage").textContent =
        "RM " + averageOrderValue.toFixed(2);
    const monthLabels = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    const monthlySales = Array(12).fill(0);

    validOrders.forEach(order => {

        const orderDate = new Date(order.date + "T00:00:00");

        if (orderDate.getFullYear() === 2026) {

            const monthIndex = orderDate.getMonth();

            monthlySales[monthIndex] += Number(order.total);
        }

    });

    new Chart(salesReportCanvas, {

        type: "bar",

        data: {

            labels: monthLabels,

            datasets: [{

                label: "Monthly Sales (RM)",

                data: monthlySales,

                backgroundColor: "#3B82F6",
borderColor: "#1E3A8A",
borderWidth: 2,

                borderRadius: 6

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            scales: {

                y: {
                    beginAtZero: true
                }

            }

        }

    });

    const orderStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    ];

    const statusCounts = orderStatuses.map(status =>
        reportOrders.filter(order => order.status === status).length
    );

    const orderStatusCanvas = document.getElementById("orderStatusChart");

    if (orderStatusCanvas) {

        new Chart(orderStatusCanvas, {

            type: "doughnut",

            data: {

                labels: orderStatuses,

                datasets: [{

                    data: statusCounts,

                    backgroundColor: [
    "#F59E0B",  // Pending -
    "#3B82F6",  // Processing -
    "#8B5CF6",  // Shipped -
    "#16A34A",  // Delivered -
    "#EF4444"   // Cancelled -
],

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        });

    }

}

/* =====================================
   Ashton&Lilo MOBILE MENU FUNCTIONALITY
===================================== */

(function () {
    const menuButton = document.getElementById("mobileMenuBtn");
    const menuOverlay = document.getElementById("mobileMenuOverlay");
    const sidebar = document.querySelector(".sidebar");

    if (!menuButton || !menuOverlay || !sidebar) {
        return;
    }

    function openMenu() {
        document.body.classList.add("mobile-menu-open");
        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute("aria-label", "Close navigation menu");
    }

    function closeMenu() {
        document.body.classList.remove("mobile-menu-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
    }

    menuButton.addEventListener("click", function () {
        const isOpen = document.body.classList.contains("mobile-menu-open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    menuOverlay.addEventListener("click", closeMenu);

    sidebar.querySelectorAll(".menu-link").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 576) {
            closeMenu();
        }
    });
})();

(function () {
    const profileButton = document.getElementById("adminProfileBtn");
    const dropdown = document.getElementById("adminDropdown");

    if (!profileButton || !dropdown) {
        return;
    }

    profileButton.addEventListener("click", function () {
        const isOpen = dropdown.classList.toggle("show");

        profileButton.setAttribute("aria-expanded", isOpen);
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".admin-account-menu")) {
            dropdown.classList.remove("show");
            profileButton.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            dropdown.classList.remove("show");
            profileButton.setAttribute("aria-expanded", "false");
        }
    });
})();

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg"
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M3 3l18 18"/>
        <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83"/>
        <path d="M9.88 5.09A10.94 10.94 0 0 1 12 4.9c6.5 0 10 7.1 10 7.1a15.8 15.8 0 0 1-4.1 4.8"/>
        <path d="M6.6 6.6C3.7 8.3 2 12 2 12s3.5 7.1 10 7.1c1.2 0 2.3-.2 3.3-.6"/>
    </svg>
`;

        } else {

            passwordInput.type = "password";

            togglePassword.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg"
                    width="20" height="20" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
            `;

        }

    });

}

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

function applyTheme(theme) {

    document.documentElement.setAttribute("data-theme", theme);

    if (!themeToggle || !themeIcon || !themeText) {
        return;
    }

    if (theme === "dark") {

        themeIcon.textContent = "☀";
        themeText.textContent = "Light Mode";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to light mode"
        );

    } else {

        themeIcon.textContent = "☾";
        themeText.textContent = "Dark Mode";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );

    }
}

const savedTheme = localStorage.getItem("shopEaseTheme") || "light";

applyTheme(savedTheme);

if (themeToggle) {

    themeToggle.addEventListener("click", function() {

        const currentTheme =
            document.documentElement.getAttribute("data-theme");

        const newTheme =
            currentTheme === "dark" ? "light" : "dark";

        localStorage.setItem("shopEaseTheme", newTheme);

        applyTheme(newTheme);

    });

}

const notificationBtn = document.getElementById("notificationBtn");
const messageBtn = document.getElementById("messageBtn");

const notificationPanel = document.getElementById("notificationPanel");
const messagePanel = document.getElementById("messagePanel");

if (notificationBtn && notificationPanel) {
    notificationBtn.addEventListener("click", function(event) {
        event.stopPropagation();

        notificationPanel.classList.toggle("show");

        if (messagePanel) {
            messagePanel.classList.remove("show");
        }
    });
}

if (messageBtn && messagePanel) {
    messageBtn.addEventListener("click", function(event) {
        event.stopPropagation();

        messagePanel.classList.toggle("show");

        if (notificationPanel) {
            notificationPanel.classList.remove("show");
        }
    });
}


document.addEventListener("click", function(event) {
    if (
        notificationPanel &&
        !notificationPanel.contains(event.target) &&
        notificationBtn &&
        !notificationBtn.contains(event.target)
    ) {
        notificationPanel.classList.remove("show");
    }

    if (
        messagePanel &&
        !messagePanel.contains(event.target) &&
        messageBtn &&
        !messageBtn.contains(event.target)
    ) {
        messagePanel.classList.remove("show");
    }
});

function displayNotifications() {
    const notificationList = document.getElementById("notificationList");
    const notificationCount = document.getElementById("notificationCount");

    const notificationBadge = notificationBtn
        ? notificationBtn.querySelector(".header-notification-badge")
        : null;

    if (!notificationList || !notificationCount) {
        return;
    }

    const savedProducts = localStorage.getItem("shopEaseProducts");

    const products = savedProducts
        ? JSON.parse(savedProducts)
        : (typeof sampleProducts !== "undefined" ? sampleProducts : []);

    const lowStockProducts = products.filter(function(product) {
        return Number(product.stock) <= 10;
    });

    notificationList.innerHTML = "";

    notificationCount.textContent =
        lowStockProducts.length +
        (lowStockProducts.length === 1 ? " alert" : " alerts");

    if (notificationBadge) {
        notificationBadge.textContent = lowStockProducts.length;
        notificationBadge.style.display =
            lowStockProducts.length > 0 ? "flex" : "none";
    }

    if (lowStockProducts.length === 0) {
        notificationList.innerHTML =
            '<p class="text-muted p-3 mb-0">No low-stock alerts.</p>';
        return;
    }

    lowStockProducts.forEach(function(product) {
        const item = document.createElement("div");
        item.className = "header-popup-item";

        const title = document.createElement("strong");
        title.textContent = "Low Stock Alert: " + product.name;

        const description = document.createElement("p");

        description.textContent = Number(product.stock) === 0
            ? "This product is out of stock."
            : "Only " + product.stock + " units remaining.";

        const meta = document.createElement("small");
        meta.textContent = "Inventory update";

        item.appendChild(title);
        item.appendChild(description);
        item.appendChild(meta);

        notificationList.appendChild(item);
    });
}

displayNotifications();

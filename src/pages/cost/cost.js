var items = document.getElementsByClassName("expense-item");

var total = 0;

for (var i = 0; i < items.length; i++) {
    var priceText = items[i].getElementsByClassName("ei-price")[0].innerText;

    priceText = priceText.replace(",", "");
    priceText = priceText.replace("đ", "");
    priceText = priceText.trim();

    var price = parseInt(priceText);

    total = total + price;
}

console.log(total); // Cần chạy trên trình duyệt

function deleteSelected() {
    var checkboxes = document.getElementsByClassName("ei-checkbox"); //Trả về 1 list
    var expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    for (var i = checkboxes.length - 1; i >= 0; i--) {
        if (checkboxes[i].checked) {
            var item = checkboxes[i].closest(".expense-item");
            var id = item.getAttribute("data-id");
            // Xóa khỏi localStorage (So sánh id của mục trong expenses với id trên)
            expenses = expenses.filter(exp => exp.id != id);

            // Xóa trên giao diện
            item.remove();
        }
    }

    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Nên duyệt ngược để tránh lỗi đẩy phần tử
//----

var list = document.getElementsByClassName("expense-list")[0];


// Lấy dữ liệu từ localStorage
var data = localStorage.getItem("expenses");

if (data) {
    var expenses = JSON.parse(data);

    for (var i = 0; i < expenses.length; i++) {
        var item = expenses[i];

        var div = document.createElement("div");
        div.className = "expense-item";

        div.setAttribute("data-id", item.id);

        div.innerHTML =
            "<p class='ei-name'><strong>" + item.name + "</strong></p>" +
            "<p class='ei-date'>" + item.date + "</p>" +
            "<p class='ei-price'>" + item.price + " đ</p>" +
            "<p class='ei-type'>" + item.type + "</p>" +
            "<input type='checkbox' class='ei-checkbox' />";

        list.appendChild(div);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const timeFilter = document.getElementById("time-filt");
    const typeFilter = document.getElementById("type-filt");
    const moneyFilter = document.getElementById("money-filt");

    const expenseItems = document.querySelectorAll(".expense-item");

    // Khi Filter được thay đổi
    timeFilter.addEventListener("change", filterExpenses);
    typeFilter.addEventListener("change", filterExpenses);
    moneyFilter.addEventListener("change", filterExpenses);

    function filterExpenses() {

        const timeValue = timeFilter.value;
        const typeValue = typeFilter.value;
        const moneyValue = moneyFilter.value;

        expenseItems.forEach(item => {

            const date = item.querySelector(".ei-date").innerText;
            const type = item.querySelector(".ei-type").innerText;
            const priceText = item.querySelector(".ei-price").innerText;

            // Lấy số tiền
            const price = parseInt(priceText.replace(/[^\d]/g, ""));

            let show = true;

            // FILTER THEO LOẠI
            if (typeValue !== "all-type") {
                if (!type.includes(getTypeName(typeValue))) {
                    show = false;
                }
            }

            // FILTER THEO TIỀN
            if (!filterByMoney(price, moneyValue)) {
                show = false;
            }

            // FILTER THEO THỜI GIAN
            if (!filterByTime(date, timeValue)) {
                show = false;
            }

            item.style.display = show ? "grid" : "none";
            // item phải có kiểu hiển thị đồng nhất với trong css

        });
    }

    function getTypeName(value) {
        const map = {
            "room-expense": "Tiền trọ",
            "shopping-expense": "Mua sắm",
            "travel": "Đi lại",
            "eating": "Ăn uống",
            "other": "Khác"
        };

        return map[value];
    }

    function filterByMoney(price, value) {

        switch (value) {
            case "no-range":
                return true;

            case "range-1":
                return price < 200000;

            case "range-2":
                return price >= 200000 && price <= 500000;

            case "range-3":
                return price > 500000 && price <= 1000000;

            case "range-4":
                return price > 1000000 && price <= 5000000;

            case "range-5":
                return price > 5000000;

            default:
                return true;
        }
    }

    function filterByTime(dateString, value) {
        if (value === "all-time") return true;

        const today = new Date();
        const itemDate = new Date(dateString.split("-").reverse().join("-"));

        switch (value) {

            case "this-month":
                return itemDate.getMonth() === today.getMonth() &&
                    itemDate.getFullYear() === today.getFullYear();

            case "previous-month":
                return itemDate.getMonth() === today.getMonth() - 1;

            case "two-previous-month":
                return (today - itemDate) / (1000 * 60 * 60 * 24 * 30) <= 2;

            case "five-previous-month":
                return (today - itemDate) / (1000 * 60 * 60 * 24 * 30) <= 5;

            case "last-year":
                return itemDate.getFullYear() === today.getFullYear() - 1;

            default:
                return true;
        }
    }

});

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

    for (var i = checkboxes.length - 1; i >= 0; i--) {
        if (checkboxes[i].checked) {
            checkboxes[i].parentElement.remove(); // Leo lên phần tử cha rồi xóa
        }
    }
}

// Nên duyệt ngược để tránh lỗi đẩy phần tử

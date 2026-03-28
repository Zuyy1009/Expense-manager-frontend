// Lấy tất cả các giao dịch
var items = document.getElementsByClassName("rt-item");

var totalExpense = 0;

// Duyệt từng giao dịch
for (var i = 0; i < items.length; i++) {
  var priceText = items[i].getElementsByClassName("ei-price")[0].innerText;
  // Lấy phần tử con ở trong items[i] có lớp là "rt-item"

  // Xóa dấu phẩy và chữ "đ"
  priceText = priceText.replace(",", "");
  priceText = priceText.replace("đ", "");
  priceText = priceText.trim();

  var price = parseInt(priceText);

  totalExpense = totalExpense + price;
}

// Vì bạn chưa có thu nhập → tạm cho = 12000000
var totalIncome = 12000000;

// Tính số dư
var balance = totalIncome - totalExpense;

// Hiển thị ra màn hình
var summary = document.getElementsByClassName("summary")[0]; 
// Chỉ lấy 1 phần tử có lớp "summary" (trả về 1 phần tử)

summary.innerHTML =
  "<h3>Tóm tắt:</h3>" + "<hr class='summary-line'/>" +
  "<p>Tổng thu nhập: " + totalIncome + " đ</p>" + "<hr class='summary-line'/>" +
  "<p>Tổng chi phí: " + totalExpense + " đ</p>" + "<hr class='summary-line'/>" +
  "<p>Số dư: " + balance + " đ</p>";

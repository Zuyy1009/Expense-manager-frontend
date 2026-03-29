var form = document.getElementsByClassName("el-form")[0];

form.onsubmit = function (event) {
    event.preventDefault();

    var inputs = document.getElementsByClassName("el-text-input");

    var name = inputs[0].value;
    var date = inputs[1].value;
    var price = inputs[2].value;
    var type = inputs[3].value;

    // Tạo object
    var newItem = {
        name: name,
        date: date,
        price: price,
        type: type
    };

    // Lấy dữ liệu cũ
    var data = localStorage.getItem("expenses");

    var list = [];

    if (data) {
        list = JSON.parse(data);
    }

    // Thêm item mới
    list.push(newItem);

    // Lưu lại
    localStorage.setItem("expenses", JSON.stringify(list));

    alert("Đã lưu!");

    // (tuỳ chọn) chuyển sang trang danh sách
    window.location.href = "cost.html";
};

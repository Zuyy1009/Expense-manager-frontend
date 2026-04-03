// Tìm và gắn thẻ <form> (có class là register-section) từ file HTML vào một biến trong JavaScript tên là form
const form = document.querySelector('.register-section');
// Tìm và gắn thẻ <a> (có class là register-button) vào biến registerBtn
const registerBtn = document.querySelector('.register-button');

registerBtn.addEventListener('click', function (e) {
    // 1. Ngăn chặn chuyển trang ngay lập tức của thẻ <a>
    e.preventDefault();

    // 2. Lấy giá trị từ các trường input
    const inputs = document.querySelectorAll('input');
    const ho = inputs[0].value.trim();
    const ten = inputs[1].value.trim();
    const ngaySinh = inputs[2].value;
    const email = inputs[3].value.trim();
    const matKhau = inputs[4].value;

    // 3. Kiểm tra dữ liệu (Validation) cơ bản
    if (!ho || !ten || !ngaySinh || !email || !matKhau) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    if (matKhau.length < 6) {
        alert("Mật khẩu phải có ít nhất 6 ký tự!");
        return;
    }

    // 4. Giả lập gửi dữ liệu hoặc xử lý Logic
    console.log("Đang đăng ký cho:", { ho, ten, email, ngaySinh });

    // Nếu mọi thứ ổn, bạn có thể chuyển hướng người dùng
    alert("Đăng ký thành công!");
    window.location.href = "../dashboard/dashboard.html";
});

// Tìm và gắn thẻ <form> (có class là register-section) từ file HTML vào một biến trong JavaScript tên là form
let form = document.querySelector('.register-section');
// Tìm và gắn thẻ <a> (có class là register-button) vào biến registerBtn
let registerBtn = document.querySelector('.register-button');

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

    // 3.0. Kiểm tra dữ liệu (Validation) cơ bản
    if (!ho || !ten || !ngaySinh || !email || !matKhau) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    if (matKhau.length < 6) {
        alert("Mật khẩu phải có ít nhất 6 ký tự!");
        return;
    }

    // 3.1. Lấy danh sách tài khoản cũ (nếu chưa có thì tạo mảng trống)
    const accsList = JSON.parse(localStorage.getItem("userAccounts")) || [];

    // 3.2. Kiểm tra xem email đã tồn tại chưa
    const existedEmail = accsList.find(user => user.email === email);
    if (existedEmail) {
        alert("Email này đã được đăng ký!");
        return;
    }

    // 3.3. Tạo đối tượng người dùng mới
    const newUser = {
        ho: ho,
        ten: ten,
        ngaySinh: ngaySinh,
        email: email,
        matKhau: matKhau // Lưu ý: Thực tế không bao giờ lưu mật khẩu trần như thế này!
    }

    // Thêm vào mảng và lưu lại
    accsList.push(newUser);
    localStorage.setItem("userAccounts", JSON.stringify(accsList));

    localStorage.setItem("currentUser", JSON.stringify(newUser));

    // 4. Giả lập gửi dữ liệu hoặc xử lý Logic
    console.log("Đang đăng ký cho:", { ho, ten, email, ngaySinh });

    // Nếu mọi thứ ổn, bạn có thể chuyển hướng người dùng
    alert("Đăng ký thành công!");
    window.location.href = "../dashboard/dashboard.html";
});

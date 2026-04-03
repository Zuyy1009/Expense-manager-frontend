let form = document.querySelector(".login-section");

let loginButton = document.querySelector(".login-button");

loginButton.addEventListener('click', function (e) {
    e.preventDefault();

    const inputs = document.querySelectorAll("input");
    const email = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    if (!email || !password) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    const accsList = JSON.parse(localStorage.getItem("userAccounts")) || [];

    let user = accsList.find(u => u.email === email);

    // Tìm user có email tương ứng trước (user là 1 object), sau đó thì kiểm tra mật khẩu.
    if (user && user.password === password) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("Đăng nhập thành công!");
        window.location.href = "../dashboard/dashboard.html";
    } else {
        alert("Email hoặc mật khẩu không đúng!");
        return;
    }
});

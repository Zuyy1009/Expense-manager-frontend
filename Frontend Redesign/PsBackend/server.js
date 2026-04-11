const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

app.use(cors());

app.get('/api/data', (req, res) => {
    res.json({income: 12000000, expense: 1500000});
});
// Chữ data có thể đổi thành từ khác 
// Phần liên kết có thể đổi, nhưng chữ data ở jsx cần giữ nguyên (.then)
// Sau này có thể đặt nhiều app.get vào 1 file server này

app.listen(PORT, () => console.log(`Backend is run at ${PORT}`));

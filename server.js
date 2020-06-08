const express = require('express');
const path = require('path');

const PORT = 8080;

const app = express();

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=> {
    const datas = path.join(__dirname,'index.html');
    console.log(datas)
    res.sendFile(datas);
});

app.listen(PORT,()=> {
    console.log('server is ready in port' + PORT);
});
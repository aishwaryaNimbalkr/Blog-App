const express = require('express');
const path = require('path');
const cors= require('cors')
require('./config/dbConnect').connect()
require('dotenv').config()
const blogRoutes = require('./Routes/blogRoutes')
const userRoutes = require('./Routes/userRoutes')
const adminRoutes = require('./Routes/adminRoutes')
const app = express();
//app.use(cors())
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/uploads', express.static('uploads'));

app.use(express.json())
const port = process.env.port || 5000

app.use('/api/user',userRoutes)
app.use('/api/blog',blogRoutes)
app.use('/api/admin',adminRoutes)
app.listen(port,()=>{
    console.log(`we are listening to port ${port}`)
})

const { User } = require("./models")
const express = require('express')
const jwt = require('jsonwebtoken');
const app = express()
const port = 3000
app.use(express.json());

const SECRET = "aaaaaaaa"

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/api/user', async (req, res) => {
  const user = await User.find()
  res.send(user)
})
app.post('/api/register', async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  })
  res.send(user)
});
app.post('/api/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username
  })
  if (!user) {
    res.send("用戶不存在")
  }
  const isPassword = require("bcryptjs").compareSync(
    req.body.password,
    user.password
  )
  if (!isPassword) {
    return res.status(422).send("秘密錯誤")
  }
  const token = jwt.sign({
    id: String(user._id)
  }, SECRET)
  res.send({
    user,
    token
  })
});

const auth = async (req, res, next) => {
  const raw = String(req.headers.authorization).split(" ").pop()
  const { id } = jwt.verify(raw, SECRET)
  req.user = await User.findById(id)
  next()
}

app.get('/api/profile', auth, async (req, res) => {
  res.send(req.user)
});




app.listen(port, () => console.log(`Example app listening on port port!`))
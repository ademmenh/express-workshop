import express from "express"
import {body, validationResult} from 'express-validator'

const app = express()

// json parser middleware
app.use(express.json())

// validator middleware
const validator = (req, res, next) => {
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()){
        res.status(422).json({status: "Unprocessable Content", ...errors})
        return
    }
    next();
}

let users = [
    {id: 0, username: 'user0', email: "user0@gmail.com"},
    {id: 1, username: 'user1', email: "user1@gmail.com"},
    {id: 2, username: 'user2', email: "user2@gmail.com"},
]

app.get('/users', (req, res)=> {
    res.status(200).json(users)
})

app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id)
    console.log(id)

    const user = users.find((user) => {
        if (user.id === id) {
            return user
        }
    })

    res.status(200).json(user)

})

const createUserValidator = [
    body('id')
        .isInt()
        .withMessage('Invalid id type'),

    body('username')
        .isString()
        .isLength({min: 3, max: 20})
        .withMessage('Invalid username length'),

    body('email')
        .isEmail()
        .withMessage('Invalid email'),

]

app.post('/users', createUserValidator, validator, (req, res) => {
    const user = req.body
    console.log(user)

    users.push(user)
    console.log(users)

    res.status(201).json(user)
})

const updateUserValidator = [
    body('id')
        .isInt()
        .withMessage('Invalid id type'),

    body('username')
        .isString()
        .isLength({min: 3, max: 20})
        .withMessage('Invalid username lenght'),

    body('email')
        .isLength({min: 10, max: 80 })
        .withMessage('Invalid email length')
        .isEmail()
        .withMessage('Invalid Email'),
    
    body('recovery_email')
        .optional()
        .isEmail()
        .withMessage('Invalid email')
]

app.put('/users', updateUserValidator, validator, (req, res) => {
    const user = req.body
    const id = user.id
    console.log(user)

    const result = users.filter(user => user.id !== id);
    result.push(user)
    console.log(users)
    users = result
    console.log(users)

    res.status(200).json(user)
})

app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id)
    console.log(id)

    const result = users.filter(user => user.id !== id);
    users = result

    res.status(200).json(result)
})


app.listen(8000, ()=>{
    console.log('the server run on the port 8000')
})

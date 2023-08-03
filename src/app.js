import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult, body } from 'express-validator';

const app = new express();
const port = 3000

app.use(express.json());

const prisma = new PrismaClient()

app.get('/', (req, res) => {
  res.send('Hello World!')
});

/**
 * Find all contacts
 */
app.get('/contacts', async (req, res) => {
    console.log("contacts");
    const contacts = await prisma.contact.findMany();
  res.json(contacts);
}
);

/**
 * Create a contact
 */

app.post('/contacts', [
    body('name').isLength({ min: 1 }).withMessage("Name is required"),
    body('email').isEmail().withMessage("Email is required"),
    body('message').isLength({ min: 1 }).withMessage("Message is required"),
], async (req, res) => {
    console.log("POST a contact");
    console.log(req.body);
    const { name, email, message } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }
    // i want to add the contact to the database
    const contact = await prisma.contact.create({
        data: {
            name,
            email,
            message
        }
    });
    console.log("contact created");
    res.json(contact);
}
);


/**
 * Find a contact by id
 */
 app.get('/contacts/:id', async (req, res) => {
    console.log("contacts");
    const { id } = req.params;
    const contact = await prisma.contact.findUnique({
        where: {
            id: parseInt(id)
        }
    });
  res.json(contact);
}
);

/**
 * Delete a contact by id
 */
app.delete('/contacts/:id', async (req, res) => {
    console.log("contact delete");
    const { id } = req.params;
    try {
        const contact = await prisma.contact.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json(contact);
    } catch (error) {
        res.status(404).json({error: "contact not found"});
    }
}
);





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
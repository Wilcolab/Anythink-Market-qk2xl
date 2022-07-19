require("dotenv").config();
const mongoose = require("mongoose");
const { randUser, randProduct, randPhrase } = require("@ngneat/falso");
require("../models/User");
require("../models/Item");
require("../models/Comment");

const User = mongoose.model("User");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");

const connectedToDatabase = () => {
    const connection = process.env.MONGODB_URI || "mongodb://localhost:27017";
    mongoose.connect(connection);
    mongoose.set("debug", true);
};

async function main() {
    connectedToDatabase();
    for (let i = 0; i < 10; i++) {
        const userDTO = randUser();
        const user = new User();
        user.username = userDTO.firstName;
        user.email = userDTO.email;
        await user.save();

        const itemDTO = randProduct();
        const item = new Item({
            slug: itemDTO.id,
            title: itemDTO.title,
            description: itemDTO.description,
            seller: user,
        });
        await item.save();

        const comment = new Comment({
            body: randPhrase(),
            seller: user,
            item: item,
        });
        await comment.save();
    }
}

main()
    .then(() => {
        console.log("Finished DB seeding");
        process.exit(0);
    })
    .catch((err) => {
        console.log(`Error while running DB seed: ${err.message}`);
        process.exit(1);
    });

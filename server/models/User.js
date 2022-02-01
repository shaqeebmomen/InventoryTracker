const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        lowercase: true,
        unique: true,
        validate: [(val) => {
            return validator.isEmail(val);
        }, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [10, 'Minimum length is 10 characters']
    },
    guest: {
        type: Boolean,
        default: true
    }

});

// Statics
userSchema.statics.login = async function (email, password) {
    // find user with same email in db
    try {
        const user = await this.findOne({ email });
        if (user) {
            // user exists and we can compare password

            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                // passwords have matched
                return user;
            }
        }
        // password didnt match
        throw Error('incorrect credentials');

    } catch (err) {
        // email didnt exist
        throw Error('incorrect credentials');
    }

}

// userSchema.statics.sessionVerify = async function (id) {
//     // find user with same email in db
//     try {
//         const user = await this.findOne({ _id: id })
//         if (user) {
//             // User exists
//             return user
//         }
//     } catch (error) {
//         throw Error('user does not exist')
//     }
// }




// Hooks

// Hashing password before saving user
userSchema.pre('save', async function (next) {
    // Hashing password and generating salt
    const salt = await bcrypt.genSalt();
    // add salt to password and hash
    this.password = await bcrypt.hash(this.password, salt);

    next();
});


// Exports

const User = mongoose.model('user', userSchema);

module.exports = User;
const crypto = require("crypto");
const mongoose = require('mongoose');
const validator = require('validator'); // Custom validator
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
  name: {
      type: String,
      required: [true, "You can not do without name"],
      unique: false,
      trim: true
  },
  email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'A user with this email already exist'], //Validator
      validate: [validator.isEmail, "Please provide an email address..."]
  },
  userPicture: [String],
  role: {
    type: String,
    enum: ['user', 'ticketer', 'event-planner', 'admin', 'ceo'],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // THIS ONLY WORKS ON CREATE AND SAVE !!!
      validator: function(el) {
        return el === this.password;
      },
      message: "This password is not the same with the other password !"
    }
  },
  passwordChangedAt: {
    type: Date,
    // default: Date.now() - 1000000000000,
  }, 
  passwordResetToken: String,
  passwordResetExpires: Date,
  creatAt: {
    type: Date,
    default: Date.now(),
    // select: false; // to hide the -createdAt
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

// DOCUMENT MIDDLEWARE runs before .save() and .create()
userSchema.pre("save", async function(next) {
  // Only run this function only if passowrd was actually modified
  if(!this.isModified("password")) return next();

  // Hash this password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete confirmPassword field
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Query Middleware
userSchema.pre(/^find/, function(next) { // this function returns only active users
  // this points to the current query
  this.find({ active: { $ne: false } });
  // this.find({ active: true });
  next();
});

// INSTANCE METHOD => Instance method is available on all the user's document
userSchema.methods.correctPassword = async function(inputPassword, userPassword) {
  // inputPassword is from "req.body", userPassword is from Model
  return await bcrypt.compare(inputPassword, userPassword);
}


// Check if User changed password
userSchema.methods.changedPasswordAfter = async function(JWTTimestamp){
  if(this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); 

    console.log(JWTTimestamp , changedTimeStamp)
    console.log(JWTTimestamp < changedTimeStamp)

    return JWTTimestamp < changedTimeStamp;

  }

  // False means NOT changed
  return false;
}

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() * 10 * 60 * 1000;

    return resetToken;
}

const User = mongoose.model("User", userSchema);




module.exports = User;

// const newUser = new User({
//   name: "MErcy",
//   email: "Aphomer@gmail.com",

// })



// newUser.save().then(doc => {
//   console.log(doc)
// }).catch(err => {
//   console.log("BIG ERROR:", err.message.split("-")[0]);
// });



// const userSchema = new Schema({
//     name: { type: String, required: true },
//     age: { type: Number, min: 0 },
//     email: { type: String, unique: true, required: true },
//     password: { type: String, required: true },
//     isActive: { type: Boolean, default: true },
//     createdAt: { type: Date, default: Date.now },
//     profilePicture: { type: Buffer },
//     friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
//     meta: { type: Map, of: String }
//   });

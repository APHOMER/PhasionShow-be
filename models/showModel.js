const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  showName: {
      type: String,
      required: [true, "You can not do without name"],
      unique: false,
      trim: true
  },

  showLocation: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'A user with this email already exist'], //Validator
  },
  address: {
    type: String,
    required: true,
  },
  priceDiscount: Number,
  description: {
    type: String,
    trim: true
  },
  locationImages: [String],
  creatAt: {
    type: Date,
    default: Date.now()
  },
  showDate: [Date],


  
  // email: { type: String, unique: true, required: true },

})

const User = mongoose.model("User", userSchema);

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

module.exports = Show;
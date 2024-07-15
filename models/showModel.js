const mongoose = require('mongoose');
// const slugify = require('slugify');
// const validator = require('validator'); // Custom validator

const showSchema = new mongoose.Schema({
  showName: {
      type: String,
      // required: [true, "You can not do without name"],
      required: false,
      unique: false,
      trim: true,
      maxlength: [40, "A show name must not have more than 40 characters"],
      minlength: [5, "A show name should have more that 4 characters"],
      // validate: [validator.isAlpha, "Show name must only involve characters"]   // Custom validator
  },
  // slug: String,

  ticketType: {
    type: String,
    // required: [true, "Specify the type of ticked you are willing to purchase"],
    enum: {
      values: ['Early Bird', 'Regular', 'VIP', 'VVIP'],
      message: "You can only pick between 'Early Bird', 'Regular', 'VIP', and 'VVIP' "
    }
  },

  // address: {
  //   type: String,
  //   // required: true,
  // },
  price: {
    type: Number,
    // required: [true, "There must be a price"]
  },

  priceDiscount:{
    type: Number,
    // CUSTOM VALIDATOR       // Custom validator
    // type: Number,
    validate: {
      validator: function(val) {
        // This only points to current doc on NEW document creation.
        return val < this.price;
      },
      message: "Discount price ({VALUE}) should be lower than regular price"
    }
  },
   
  description: {
    type: String,
    trim: true
  },
  locationImages: [String],
  creatAt: {
    type: Date,
    default: Date.now()
  },
  
  showLocation: {
    // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
  },
  showLocations: [
    {
    // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    }
  ],
  showOwner : [ // The owner is the person that created the show
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    }
  ],
  showDate: [Date],


  
  // email: { type: String, unique: true, required: true },

},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
);

// DOCUMENT MIDDLEWARE runs before .save() and .create()
// showSchema.pre("save", function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// Virtual Populate --> To let the show know that it has review
showSchema.virtual("reviews", {
  ref: "Review", //The name of the model I referenced.
  foreignField: "show", // The name of the field in reviewModel.
  localField: "_id" // the Id is stored here in this Model.
});


showSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'showOwner',
    select: '-__v -creatAt'
  });

  next();
})

const Show = mongoose.model("Show", showSchema);


module.exports = Show;









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
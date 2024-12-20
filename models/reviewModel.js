const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    show: {
            type: mongoose.Schema.ObjectId,
            ref: 'Show',
            require: [true, "Review must belong to a show."]
        },
    reviewer:
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user.']
        } 
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);


reviewSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'show', //show
      select: 'showName' //to remove __v from showing
    }).populate({
        path: 'reviewer',
        select: 'name userPicture'
    });
  
    next();

    // this.populate({
    //       path: 'reviewer',
    //       select: 'name userPicture'
    //   });
    
      next();
  })


const Review = mongoose.model("Review", reviewSchema);


module.exports = Review;



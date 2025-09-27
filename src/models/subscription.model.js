import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "The name of sunscription is required"],
        trim: true,
        minLength: 5,
        maxLength: 30,
    },

    price: {
        type: Number,
        required: [true, "The price is requierd"],
        min: [0, "The price must be greater than 0"],
    },

    currency: {
        type: String,
        required: true,
        enum: ['USD', 'SYP', 'EUR'],
        default: 'USD',
    },

    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: true,
    },

    category: {
        type: String,
        enum: ['sports', 'news', 'movies', 'lifestyle'],
        required: true,
    },

    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },

    status: {
        type: String,
        enum: ['active', 'cancelled', 'expierd'],
        default: 'active',
    },

    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value < new Date(),
            message: "Start Date Must be in the past",
        },
    },

    renwalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                value < this.startDate;
            },
            message: "Start Date Must be in the past",
        },
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }
}, { timestamps: true });



// This function will be running before saving the subscription ,
// Auto calculate the renwal date if missing
subscriptionSchema.pre('save', function (next) {
    if (!this.renwalDate) {
        const renwalPeriod = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        // for example : 
        // start : 1 jan
        // monthly 
        // renewal date = 31 jan
        this.renwalDate = new Date(this.startDate);
        this.renwalDate.setDate(this.renwalDate.getDate() + renwalPeriod[this.frequency]);
    }

    // Auto update status if renwal date is passed
    if (this.renwalDate < new Date()) {
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription; 
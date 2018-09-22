const mongoose = require('mongoose')
mongoose.promise = global.Promise // Using built in ES6 Promises
const slug = require('slugs')

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a store name!'
    },
    slug: String,
    description: {
        type: String,
        trim: true,
        required: 'Please enter a store description!'
    },
    tags: [String],
    created: { // Sorted date created. Will default to the current date time
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: 'You must supply coordinates'
        }],
        address: {
            type: String,
            required: 'You must supply an address'
        }
    },
    photo: String
})

// check for duplicate slugs using a pre-hook
storeSchema.pre('save', async function(next){
    if (!this.isModified('name')) {
        return next()
    }
    this.slug = slug(this.name)

    //find stores with same slug using Regex
    const slugRegex = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
    const storesWithSlug = await this.constructor.find({ slug: slugRegex });
    if(storesWithSlug.length){
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }
    next()
})

// Attah methods to our model
storeSchema.statics.getTagsList = function(){
    return this.aggregate([
        {$unwind: '$tags'},
        {$group: {_id: '$tags', count: {$sum: 1}}} // group results by tag names, then havea count that increase by 1 for each tag that matches
    ])
}

module.exports = mongoose.model('Store', storeSchema)
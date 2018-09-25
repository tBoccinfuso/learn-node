const mongoose = require("mongoose");
const Store = mongoose.model("Store");
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next({message: 'That filetype is not allowed!'}, false);
    }
  }
}


/*******************
 *  MIDDLEWARE
 *******************/
// Make sure file is valid type
exports.upload = multer(multerOptions).single('photo')
//resize images
exports.resize = async (req, res, next) => {
  if(!req.file){
    return next();
  }

  const ext = req.file.mimetype.split('/')[1]; // get the mimetype extension
  req.body.photo = `${uuid.v4()}.${ext}`; // set the uploaded photo to have a uniquie name with the extension

  // resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  // go to next middleware
  next();
}


/*******************
 *  CONTROLLERS
 *******************/
// GET /
exports.homepage = (req, res) => {
  res.render("index", {
    title: req.name
  });
};

// GET /add
exports.addStore = (req, res) => {
  res.render("editStore", {
    title: "Add Store"
  });
};

// POST /add with async/await    
exports.createStore = async (req, res) => {
  const store = await (new Store(req.body).save());
  await store.save()
  req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`)
  res.redirect(`/store/${store.slug}`)
};

// GEt all stores
exports.getStores = async (req, res) => {
  const stores = await Store.find()
  res.render('stores', data = {
    title: 'Stores',
    stores
  })
}

// Edit store
exports.editStore = async (req, res) => {
  //get the store by searching for it's id
  const store = await Store.findOne({ _id: req.params.id })
  res.render('editStore', data = {
    title: `Edit ${store.name}`,
    store
  })
}

exports.updateStore = async (req, res) => {
  // Set the type to Point when updating
  req.body.location.type = 'Point';

  // findOneAndUpdate will find and pass back the new data 
  //takes 3 params: Query, Data, Options
  const store = await Store.findOneAndUpdate(
      { _id: req.params.id },
        req.body,
      { new: true, runValidators: true}
      ).exec()
      
  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`)
  res.redirect(`/stores/${store._id}/edit`)
}


// find store by it's slug
exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug })
  if (!store) return next();

  res.render('store',{
    title: store.name,
    store
  })
}

// find stores by tag
exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true } // Set equal to requested param (tag) OR set to everything
  const tagsPromise =  Store.getTagsList() // use our method to get the list of tags
  const storePromise = Store.find({ tags: tagQuery }) // query our stores by tags   
  const [tags, stores] = await Promise.all([tagsPromise, storePromise]) // allows us to have multiple queries AND await for the the one that takes the longest to return. Must take in an array of promises

  res.render('tag', {
    title: 'Tags',
    tags,
    tag,
    stores
  })
}
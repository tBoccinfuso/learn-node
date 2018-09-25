const express = require('express');
const router = express.Router();
const storeController = require('../controllers/StoreController');
const userController = require('../controllers/UserController');
const { catchErrors } = require('../handlers/errorHandlers');


// GET /
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));


// Get /add
router.get('/add', storeController.addStore);

// POST /add
router.post('/add', 
  storeController.upload, 
  catchErrors(storeController.resize), 
  catchErrors(storeController.createStore)
);

// EDIT STORE
router.post('/add/:id',
  storeController.upload, 
  catchErrors(storeController.resize), 
  catchErrors(storeController.updateStore)
);

// GET Store by id - EDIT
router.get('/stores/:id/edit', catchErrors(storeController.editStore))

router.get('/store/:slug',
  catchErrors(storeController.getStoreBySlug)
)

router.get('/tags', catchErrors(storeController.getStoresByTag))
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag))

router.get('/login', userController.loginForm)
router.get('/register', userController.registerForm)
router.post('/register', // Validate, Register User, log them in
userController.validateRegister,
 userController.registerForm
) 



module.exports = router;

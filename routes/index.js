const express = require('express');
const passport = require('passport');
const router = express.Router();
const userModel = require('./users');
const passportLocal = require('passport-local');
const multer = require('multer');
const carModel = require('./car');

passport.use(new passportLocal(userModel.authenticate()));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads/')
  },
  filename: function (req, file, cb) {
    var randomname = Date.now();
    randomname += file.originalname;
    cb(null, randomname);
  }
})
 
var upload = multer({ storage: storage });


// routes

router.get('/',redirectToProfile, function(req,res){
  res.render('index', {isLoggedInVal : false, loginMsg:req.flash('error')});
})

router.post('/reg', function(req,res){  
   var newUser = new userModel({
     name:req.body.name,
     username:req.body.username,
     email:req.body.email
   });
   userModel.register(newUser, req.body.password)
     .then(function(createdUser){
        passport.authenticate('local')(req,res, function(){
          res.redirect('/profile');
        })
     })
});

router.post('/login', passport.authenticate('local', {
  successRedirect:'/profile',
  failureRedirect: '/', 
  failureFlash: true
}),function(req,res){
  
});

router.get('/profile',isLoggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user})
    .then(function(foundData){
        carModel.find({sellerid : foundData._id})
          .then(function(foundCar){
            res.render('profile', {foundData : foundData, isLoggedInVal:true, foundCar});
    })
  })
});

router.post('/uploadprfl', upload.single('image') ,function(req,res){
     userModel.findOne({username: req.session.passport.user}).populate('car')
       .then(function(foundUser){
           // If we want to delete last image from folder
        //  if(foundUser.prflImage !== '../images/uploads/defprfl.jpg'){
        //    console.log('we Have to delte this from files!')
        //    foundUser.prflImage = '';
        //    foundUser.save();
        //    console.log(foundUser);
        //  }
          foundUser.prflImage = `../images/uploads/${req.file.filename}`;
          foundUser.save();
          res.redirect('/profile');
       })     
});

// Add new car
  
router.post('/addcar',upload.single('carimg') ,function(req,res){
   userModel.findOne({username:req.session.passport.user}).populate('allcar')
     .then(function(loggedInUser){
         carModel.create({
            carname: req.body.carname,
            carprice:req.body.carprice,
            contact:req.body.contact,
            sellerid : loggedInUser,
            carimg: `../images/uploads/${req.file.filename}`
         }).then(function(addedCar){
           loggedInUser.allcar.push(addedCar);
           loggedInUser.save();
          //  console.log(loggedInUser);
           res.redirect('/profile');
         })
         .catch((error) => {
            console.log("error : "+ error);
         })
     })
});

router.get('/allsell/:pageno',isLoggedIn, function(req,res){

   var perPage = 3 , page = Math.max(0, req.params.pageno);
   carModel.find()
    .limit(perPage)
    .skip(perPage * page)
    .then(function(cars) {
        carModel.count().then(function(count) {
          res.render('allsell', {
              cars: cars,
              page: page,
              pages: count / perPage,
              isLoggedInVal: true
          })
        })
    })  
})

router.get('/logOut', function(req,res){
  req.logOut();
  req.flash('error', 'Succesfully logout!')
  res.redirect('/');
})

// check for username exits or not

router.get('/checkusername/:username', function(req,res){
   let usernameValid = false;
   userModel.find({username:req.params.username})
     .then(function(data){
       if(data.length !== 0) usernameValid = true;
       res.json({usernameValid});
     })
})

router.get('/removecar/:id', function(req,res){
   carModel.findOneAndDelete({_id:req.params.id})
   .then(function(removeCar){
     console.log(removeCar);
      userModel.findOne({_id:removeCar.sellerid})
      .then(function(foundUser){
        foundUser.allcar.splice(r => r == removeCar._id);
        foundUser.save();
        res.redirect('/profile');
      })    
   })
})

router.get('*', function(req,res){
  res.render('error')
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  else {
    req.flash('error','You need to logged in first')
    res.redirect('/')};
}

function redirectToProfile(req,res, next){
  if(req.isAuthenticated()) res.redirect('/profile');
  else {

    next()};
}

module.exports = router;


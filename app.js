// Import dependencies
var expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();

// Configure middleware
mongoose.connect("mongodb://localhost/MeBlog", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(expressSanitizer());

// Configure database
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "First Blog",
//     image: "https://images.pexels.com/photos/1317844/pexels-photo-1317844.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
//     body: "This is my first blog post test"
// }, function(err, newBlog){
//     if(err){
//         console.log(err);
//     } else{
//         console.log("Blog added!");
//         console.log(newBlog);
//     }
// });

// RESTful Routes
app.get("/", function(req, res){
    res.render("index");
});

// INDEX Route
app.get("/blogs", function(req, res){
    res.render("blogs");
});



// CONTACT Route
app.get("/contact", function(req, res) {
    res.render("contact");
});

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("MeBlog server has started...");
});
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
    res.render("app");
});

// INDEX Route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else{
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW BLOG Route
app.get("/blogs/new", function(req, res) {
    res.render("newBlog");
});

// CREATE BLOG Route
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.create(req.body.blog, function(err, createdBlog) {
        if(err){
            res.render("newBlog");
        } else{
            res.redirect("/blogs");
        }
    });
});

// SHOW BLOG Route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("showBlog", {blog: foundBlog});
        }
    });
});

// EDIT BLOG Route 
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("editBlog", {blog:foundBlog});
        }
    });
});

// UPDATE BLOG Route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect(/blogs/ + req.params.id);
        }
    });
});

// DELETE BLOG Route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    })
})

// ABOUT Route
app.get("/about", function(req, res){
    res.render("about");
});

// PORTFOLIO Route
app.get("/portfolio", function(req, res) {
    res.render("portfolio");
});

// CONTACT Route
app.get("/contact", function(req, res) {
    res.render("contact");
});

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("MeBlog server has started...");
});
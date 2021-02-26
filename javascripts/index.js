let blogs = [
    {title: "My First Blog",content: "omg"},
    {title: "My Second Blog",content: "yass"},
    {title: "My Third Blog",content: "omg no"},
    {title: "My Last Blog",content: "wtf"},
];

const baseUrl = "http://localhost:3000"


function main() { 
    return document.getElementById("main");
}

function titleInput() {
    return document.getElementById("title");
}

function contentInput() {
    return document.getElementById("content");
}

function authorInput() {
    return document.getElementById("author");
}

function form() {
    return document.getElementById("form");
}

function formLink() {
    return document.getElementById("form-link")
}

function blogsLink() {
    return document.getElementById("blogs-link")
}

function fetchFunction() {
  
}

function getBlogs() {
    fetch(baseUrl + '/blogs')
    .then(function(resp) {
        return resp.json();
    })
    .then(function(data) {
        blogs = data

        renderBlogs();
    })
}

function resetFormInputs() {
    titleInput().value = "";
    contentInput().value = "";
}

function resetMain() {
    main().innerHTML = "";
}

function formTemplate() {
    return `
    <h3>Create Post</h3>
      <form id="form">
        <div class="input-field">
          <label for="title">Title</label>
          <input type="text" name="title" id="title" />
        </div>
        <div class="input-field">
          <label for="content">Content</label><br />
          <textarea name="content" id="content" cols="30" rows="10"></textarea>
        </div>
        <div class="input-field">
        <label for="author">Author</label>
        <input type="text" name="author" id="author" />
      </div>
        <input type="submit" value="Create Blog" />
        </form>
        `;
}

function editFormTemplate(blog) {
    return `
    <h3>Edit Post</h3>
      <form id="form" data-id="${blog.id}">
        <div class="input-field">
          <label for="title">Title</label>
          <input type="text" name="title" id="title" value="${blog.title}" />
        </div>
        <div class="input-field">
          <label for="content">Content</label><br />
          <textarea name="content" id="content" cols="30" rows="10">${blog.content}</textarea>
        </div>
        <input type="submit" value="Edit Blog" />
        </form>
        `;
}

function blogsTemplate() {
    return `
    <h3>List Of Blogs</h3>
    <div id="blogs"></div>
    `;
}

function renderBlog(blog) {
    let div = document.createElement("div");
    let h4 = document.createElement("h4");
    let byAuthor = document.createElement("p");
    let p = document.createElement("p");
    let deleteLink = document.createElement("a");
    let editLink = document.createElement("a");
    let blogsDiv = document.getElementById("blogs");

    editLink.dataset.id = blog.id
    editLink.setAttribute("href", "#")
    editLink.innerText = "Edit"

    deleteLink.dataset.id = blog.id
    deleteLink.setAttribute("href", "#")
    deleteLink.innerText = "Delete"

    editLink.addEventListener("click", editBlog);
    deleteLink.addEventListener("click", deleteBlog)

    h4.innerText = `Title: ${blog.title}`;
    p.innerText = `Content: ${blog.content}`;
    byAuthor.innerText = `By: ${blog.author.name}`;

    div.appendChild(h4);
    div.appendChild(p);
    div.appendChild(byAuthor);
    div.appendChild(editLink);
    div.appendChild(deleteLink);

    blogsDiv.appendChild(div);
}

function deleteBlog(e) {
    e.preventDefault();

    let id = e.target.dataset.id;

    fetch(baseUrl + "/blogs/" + id, {
        method: "DELETE"
    })
    .then(function(resp) {
        return resp.json();
    })
    .then(function(data) {

        blogs = blogs.filter(function(blog){
            return blog.id !== data.id;
        })

    renderBlogs(); 
    })
}

function editBlog(e) {
    e.preventDefault();

    const id = e.target.dataset.id;

    const blog = blogs.find(function(blog) {
        return blog.id == id;
    })


    renderEditForm(blog)
}

function renderForm() {
    resetMain();
    main().innerHTML = formTemplate();
    form().addEventListener("submit", submitForm);
}

function renderEditForm(blog) {
    resetMain();
    main().innerHTML = editFormTemplate(blog);
    form().addEventListener("submit", submitEditForm);
}

function submitEditForm(e) {
    e.preventDefault();

    let strongParams = {
        blog: {
            title: titleInput().value,
            content: contentInput().value
        }
    }

    const id = e.target.dataset.id;

    fetch(baseUrl + "/blogs/" + id, {
        method: "PATCH",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(strongParams)
      })
      .then(function(resp) {
          return resp.json();
      })
      .then(function(blog) {
        //   selects the blog out of the array
          let b = blogs.find(function(b) {
              return b.id == blog.id;
          })
        // gets the index if the blog selected
          let idx = blogs.indexOf(b);

        //   updates the index value with the newly updated blog
          blogs[idx] = blog;

        //   renders the array of blogs to page
        renderBlogs();
      })
    
}

function renderBlogs() {
    resetMain();
    main().innerHTML = blogsTemplate();

    blogs.forEach(function (blog) {
        renderBlog(blog);
    });

}

function submitForm(e) {
    e.preventDefault();
    alert("Hey you submitted a post");

    let strongParams = {
        blog: {
          title: titleInput().value,
          content: contentInput().value,
          author_attributes: authorInput().value,
        }
      }
    
      // send data to the backend via a post request
      fetch(baseUrl + '/blogs', {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(strongParams),
        method: "POST"
      })
        .then( function(resp) {
          return resp.json();
        })
        .then( function(blog) {
          blogs.push(blog)
          renderBlogs();
        })
    
}

function formLinkEvent() {
    formLink().addEventListener("click", function(e) {
        e.preventDefault();

        renderForm();
    });
}

function blogsLinkEvent() {
    blogsLink().addEventListener("click", function(e) {
        e.preventDefault();

        renderBlogs();
    });
}

document.addEventListener("DOMContentLoaded", function() {
    getBlogs();
    formLinkEvent();
    blogsLinkEvent();
    //renderBlogs();
})
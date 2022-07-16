var apikey = "4631b1f1ac9f4a38b7ecd81311bd6eb4";
class newsClass {
  constructor(author, content, description, date, time, title, url, urlImage) {
    this.author = (author)? author : "Anonymous";
    this.content = content;
    this.description = description ? description : title;
    this.date = date;
    this.time = time;
    this.title = title;
    this.url = url;
    this.urlImage = urlImage;
  }
  addtemplate() {
    return `
    <div class="task m-2" style="width: 18rem" id="display">
        <a href=${this.url} target=_blank ><img src=${this.urlImage} class="card-img-top" alt="${this.author}" /></a>
        <div class="card-body">
          <a href = "${this.url}" target=_blank ><h5 id="title" class="card-title">${this.title}</h5></a>
          <p id="content" class="card-text my-2">
            ${this.description}
          </p>
        </div>
        <ul class="list-group list-group-flush">
          <li id="date" class="list-group-item">${this.date}</li>
          <li id="time" class="list-group-item">${this.time}</li>
          <li id="author" class="list-group-item">By ${this.author}</li>
        </ul>
      </div>`;
  }
}
home();
document.getElementById('home').addEventListener('click',home);
function home(){
  let priorData;
  if (JSON.parse(localStorage.getItem("home")) !== null) {
    priorData = JSON.parse(localStorage.getItem("home"));
    console.log(priorData);
  } else {
    priorData = { homeName: "India", homeSource: "in" };
  }
  fetchData('country', priorData.homeSource, apikey , priorData.homeName);
}
let all = document.getElementById("navbarNav").getElementsByTagName("a");
Array.from(all).forEach((element)=>{
    element.addEventListener('click',(event)=>{
        event.preventDefault();
        let source = event.target.id;
        let option = 'sources';
        fetchData(option,source,apikey,element.innerText);
    })
})
let allc = document.getElementById("country").getElementsByTagName("a");
Array.from(allc).forEach((element) => {
  element.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.clear();
    let source = event.target.id;
    let option = "country";
    let data = {homeName:element.innerText , homeSource: source};
    localStorage.setItem('home',JSON.stringify(data));
    fetchData(option, source, apikey,element.innerText);
  });
});

function fetchxData(option, source, apikey,name) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://newsapi.org/v2/top-headlines?${option}=${source}&apiKey=${apikey}`,
    true
  );
  xhr.onload = function () {
    if (this.status === 200) {
      let json = JSON.parse(this.responseText);
      let articles = json.articles;
      createTask(articles,option,name);
    } else {
      console.log("some error occured", this.status);
    }
  };
  xhr.send();
}
async function fetchData(option, source, apikey,name) {
    let response = await fetch(`https://newsapi.org/v2/top-headlines?${option}=${source}&apiKey=${apikey}`);
    if(response.status == 200)
    {
      let data = await response.json();
      createTask(data.articles, option, name);
    }
    else{
      console.log("some error occured", this.status);
    }
    
}

function createTask(articles,option,name) {
    let Sources;
    if(option=='sources')
    {
      if(name=='Home')
      {
        name="ISN News"
      }
        Sources= 'By ' + name ;
    }
    else{
        Sources = "At " + name;

    }

  let finalData = `<div id="main" class="container my-2">
      <h4>
        Top News
        <span class="badge bg-secondary">Published ${Sources}.</span>
      </h4>
      <hr />
    </div>`;
  articles.forEach((article) => {
    let task = new newsClass(
      article.author,
      article.content,
      article.description,
      article.publishedAt.substring(0, 10),
      article.publishedAt.substring(12, 19),
      article.title,
      article.url,
      article.urlToImage
    );
    finalData += task.addtemplate();
  });
  let main = document.getElementById('parent');
  main.innerHTML = finalData;
}

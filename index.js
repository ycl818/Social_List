const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')
const searchBar = document.querySelector('#searchBar')
const searchInput = document.querySelector('#searchInput')
const filterOfGender = document.querySelector('.filterOfGender')
const card = document.querySelector('.card')
const mar = document.querySelector('.mar')

const peoplePerPage = 12
const people = []
let filterPeopleByName = []
let filteredGenderPeople = []
let imglink =[]


function renderSocialList(data){
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
            <div class="card mx-auto mb-5 bg-light px-0" id="${item.id}"  style="width: 17rem" >
              <img src="${item.avatar}" class="card-img-top"   alt="...">

              <div class=" card-bodycard-title d-flex flex-column justify-content-center align-items-center">
              
                <h5 class="mt-3">${item.name}  ${genderIcon(item.gender)} </i></i></h5>
                <button type="button" class=" btninfo mt-3" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${item.id}">Info</button>
                <div class="likeMe">
                  <i class="fa fa-heart btn-add-favorite " data-id="${item.id}"></i>
                </div>
                
              </div>
            </div>    
    `
  })
  dataPanel.innerHTML = rawHTML
}

function genderIcon(gender) {
  if (gender === 'male')
    return `<i class="fa fa-mars" style="font-size:30px;color:blue"></i>`
  return `<i class="fa fa-venus " style="font-size:30px;color:red"></i>`
}

//計算頁數
function renderPaginator(amount) {
  const totalPage = Math.ceil(amount / peoplePerPage)
  let rawHTML = ''

  for (let page = 1; page <= totalPage; page++) {
    rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML
}

// 塞選渲染資料
function renderPeoplebyPage(page) {
  if (filterPeopleByName.length > 0) data = filterPeopleByName
  else if (filteredGenderPeople.length > 0) data = filteredGenderPeople
  else data = people
  const startindex = (page - 1) * peoplePerPage
  return data.slice(startindex, startindex + peoplePerPage)
}

function renderPeopleModal(id){
  const personName = document.querySelector('#personName')
  const personInfo = document.querySelector('#personInfo')

  let url = INDEX_URL + id
  axios.get(url).then((response)=>{
    personName.innerText = response.data.name
    personImage.innerHTML = `<img src=${response.data.avatar} class="modalImg" alt="person-modal">`
    personInfo.innerHTML = `
     <i class="fa fa-user-o" ></i> gender: ${response.data.gender} <br>
    <i class="fa fa-birthday-cake" aria-hidden="true"></i> birthday: ${response.data.birthday} <br>
    <i class="fa fa-id-card-o" aria-hidden="true"></i>  age: ${response.data.age}<br>
    <i class="fa fa-globe" aria-hidden="true"></i>  region: ${response.data.region}<br>
    <i class="fa fa-envelope-o" aria-hidden="true"></i>  email: ${response.data.email}
     `
  })
}



function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoritePerson')) || []
  const loved = people.find(person => person.id === id)
  if (list.some((person) => person.id === id)){
    return alert("Already in your favorite list!!")
  }
  list.push(loved)
  localStorage.setItem('favoritePerson', JSON.stringify(list))
  //console.log("addd")
}

function changeStyleOnCard(id) {
  let obj = document.getElementById(`${id}`)
  obj.style.border = "solid 5px #f92525"
  obj.style.color ="purple"
  obj.insertAdjacentHTML('afterbegin',"<div class='selectedTag'> Liked!</div>")
}

function changeStyleOnHeart(id) {
  addIdOnHeart()
  let obj = document.getElementById(`${id}`)
  obj.style.color = "red"
}

function addIdOnHeart() {
  const list1 = document.getElementsByClassName("btn-add-favorite")
  for (let i = 0; i < list1.length; i++) {
    list1[i].setAttribute("id","heart" + i)
  }
}



dataPanel.addEventListener('click', function(e){
  console.log(e.target)
  if (e.target.matches('button')) {
    renderPeopleModal(Number(e.target.dataset.id))
  } else if (e.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(e.target.dataset.id))
    addIdOnHeart()
    console.log(e.target.dataset.id)
    changeStyleOnCard(e.target.dataset.id)
    changeStyleOnHeart(e.target.id)
  }

  
})

paginator.addEventListener('click', function onPaginatorClicked(e) {
  if (e.target.tagName !=='A') return
  const page = Number(e.target.dataset.page)
  renderSocialList(renderPeoplebyPage(page))
})

// search by Name 
searchBar.addEventListener('submit', function(e) {
  e.preventDefault()
  const keywords = searchInput.value.trim().toLowerCase()
 
  filterPeopleByName = people.filter(function(person) {
    return person.name.toLowerCase().includes(keywords)
  })

  if (filterPeopleByName.length === 0) {
    return alert("Sorry Unmatched typed name: " + keywords)
  }

  renderPaginator(filterPeopleByName.length)
  renderSocialList(renderPeoplebyPage(1))
})


filterOfGender.addEventListener('click', function(e){
  console.log(e.target.id)
  if (e.target.id === 'male') {
    filteredGenderPeople = people.filter(person => person.gender === 'male')
  } else if (e.target.id === 'female') {
    filteredGenderPeople = people.filter(person => person.gender === 'female')
  } else {
    filteredGenderPeople = people.filter(person => person.gender === 'allgenders')
  }

  renderPaginator(filteredGenderPeople.length)
  renderSocialList(renderPeoplebyPage(1))

})

axios.get(INDEX_URL).then(res=>{
  people.push(...res.data.results)
 
  renderPaginator(people.length)
  renderSocialList(renderPeoplebyPage(1))
})


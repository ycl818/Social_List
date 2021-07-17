const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')
const searchBar = document.querySelector('#searchBar')
const searchInput = document.querySelector('#searchInput')

const peoplePerPage = 12
const people = JSON.parse(localStorage.getItem('favoritePerson')) || []
let filterPeopleByName = []
let filteredGenderPeople = []

function renderSocialList(data){
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
            <div class="card mx-auto mb-5 bg-light px-0 " id="${item.id}"  style="width: 17rem" >
              <img src="${item.avatar}" class="img-fluid"   alt="...">

              <div class=" card-bodycard-title d-flex flex-column justify-content-center align-items-center">
              
                <h5 class="mt-3">${item.name}  ${genderIcon(item.gender)} </i></i></h5>
                <button type="button" class=" btninfo mt-3 mb-3" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${item.id}">Info</button>
                <div class="likeMe">
                  <i class="fa fa-heart-broken btn-add-favorite " data-id="${item.id}"></i>
                </div>

              </div>
            </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function genderIcon(gender) {
  if (gender === 'male')
    return `<i class="fa fa-mars man" style="font-size:15px;color:blue"></i>`
  return `<i class="fa fa-venus woman" style="font-size:15px;color:red"></i>`
}

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

function renderPeoplebyPage(page) {
  const data = people
  const startindex = (page - 1) * peoplePerPage
  return data.slice(startindex, startindex + peoplePerPage)
}

function renderPeopleModal(id){
  const personName = document.querySelector('#personName')
  const personInfo = document.querySelector('#personInfo')

  let url = INDEX_URL + id
  axios.get(url).then((response) => {
    personName.innerText = response.data.name
    personImage.innerHTML = `<img src=${response.data.avatar} alt="person-modal">`
    personInfo.innerHTML = `
     <i class="fa fa-user-o" ></i> gender: ${response.data.gender} <br>
    <i class="fa fa-birthday-cake" aria-hidden="true"></i> birthday: ${response.data.birthday} <br>
    <i class="fa fa-id-card-o" aria-hidden="true"></i>  age: ${response.data.age}<br>
    <i class="fa fa-globe" aria-hidden="true"></i>  region: ${response.data.region}<br>
    <i class="fa fa-envelope-o" aria-hidden="true"></i>  email: ${response.data.email}
     `
  })
}


function removeFromFavorite(id) {
  
  const lovedIndex = people.findIndex(person => person.id === id)
  people.splice(lovedIndex, 1)
  localStorage.setItem('favoritePerson', JSON.stringify(people))
  renderSocialList(people)
}

dataPanel.addEventListener('click', function(e){
   console.log(e.target)
  if (e.target.matches('button')) {
    renderPeopleModal(Number(e.target.dataset.id))
  } 

  if (e.target.matches('.fa-heart-broken')) {
    const broken = e.target.dataset.id
    removeFromFavorite(Number(broken))
  }

  
})





renderSocialList(renderPeoplebyPage(1))
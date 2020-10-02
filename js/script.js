let searchInput, searchBtn, usersList, statistics, totalAges = 0, avgAges = 0, male = 0, female = 0, termSearched = '', userArray = [], usersFiltered = []

window.addEventListener('load', () => {
  searchInput = document.querySelector('#searchInput')
  searchBtn = document.querySelector('#searchBtn')
  usersList = document.querySelector('#usersList')
  statistics = document.querySelector('#searchStatistics')

  searchInput.focus()
  fetchUsers()
})

const fetchUsers = async () => {
  const promiseOfUsers = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo')
  const jsonOfUsers = await promiseOfUsers.json()
  const usersListFull = jsonOfUsers.results

  usersListFull.forEach(user => {
    userArray.push(
      {
        name: `${user.name.first} ${user.name.last}`,
        picture: `${user.picture.thumbnail}`,
        age: `${user.dob.age}`,
        gender: `${user.gender}`
      }
    )
  });
  searchInput.addEventListener('keyup', searchedTerm)
  searchBtn.addEventListener('click', searchedTerm)

  render()
}

const searchedTerm = (e) => {
  usersFiltered = []

  searchInput.value.trim() !== '' ? searchBtn.disabled = false : searchBtn.disabled = true

  if (e.key === 'Enter' || e.type === 'click') {
    termSearched = searchInput.value

    if (termSearched.length === 0) {
      render()
    }
    else {
      userArray.forEach(user => {
        let name = user.name.toLowerCase()
        if (name.includes(termSearched.toLowerCase())) {
          usersFiltered.push(user)
        }
      })
      render()
    }
  }
}

const render = () => {
  if (usersFiltered.length === 0) {
    usersList.innerHTML = '<div><h2>Nenhum usuário filtrado</h2></div>'
    statistics.innerHTML = '<div><h2>Nada a ser exibido</h2></div>'
  }
  else {
    renderList();
    renderStatistics();
  }
}

const renderList = () => {
  let usersHTML = "<ul>"
  let header = `
  <div class='header'>
  <h2>${usersFiltered.length} usuário(s) encontrado(s)</h2>
  </div>
  `
  usersFiltered.forEach(user => {
    let userHTML =
      `
      <li class='user'>
        <div class='picture'><img src='${user.picture}'/></div>
        <div class='name'><span>${user.name},</span></div>
        <div class='age'><span>${user.age} Anos</span></div>
      </li>
    `
    usersHTML += userHTML
  })
  usersList.innerHTML = header
  usersList.innerHTML += usersHTML
}

const renderStatistics = () => {
  const genderCount = () => {
    statistics.innerHTML = ''
    male = usersFiltered.filter(user => user.gender === 'male').length
    female = usersFiltered.filter(user => user.gender === 'female').length
    const genderHTML =
      `
      <div class='header'>
      <h2>Estatísticas</h2>
      </div>
      <p>Sexo Masculino: <strong>${male}</strong></p>
      <p>Sexo Feminino: <strong>${female}</strong></p>
      `
    statistics.innerHTML += genderHTML
  }

  const sumTotalAges = () => {
    totalAges = 0
    usersFiltered.map(user => {
      totalAges += +(user.age)
    })
    const agesHTML = `<p>Soma das idades: <strong>${totalAges}</strong></p>`
    statistics.innerHTML += agesHTML
  }

  const averageAges = () => {
    avgAges = (totalAges / (female + male)).toFixed(2).replace('.', ',')
    const avgAgesHTML = `<p>Média das idades: <strong>${avgAges}</strong></p>`
    statistics.innerHTML += avgAgesHTML
  }

  genderCount()
  sumTotalAges()
  averageAges()
}
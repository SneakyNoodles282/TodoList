const input = document.querySelector("#inputVal")
const addButton = document.querySelector("#addButton")
const lists = document.querySelector("#all-lists")

renderLists()

function createList(){
    axios.post('/api/list/new', {
        listName: input.value
    })
}

function renderLists(){
    axios.get('/api/lists')
        .then(function (response) {
            response.data.forEach(list => {
                $("#all-lists").append(`<p>${list.name}</p>`)
            })

            

    })
}

addButton.addEventListener("click", createList);
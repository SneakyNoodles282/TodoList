const input = $("#inputVal")
const addButton = $("#addButton")
const lists = $("#all-lists")
renderLists()

async function createList(){
    await axios.post('/api/list/new', {
        listName: input.val()
    })
    renderLists()
    input.val("")
}

async function renderLists(){

    const response = await axios.get('/api/lists')
    $("#all-lists").empty()
    response.data.forEach(list => {
        $("#all-lists").append(`
        <div>
            <button data-id="${list._id}" class="ui negative small basic icon button delete-button">
                <i class="trash alternate outline icon"></i>
            </button>
            <a href="/list/${list.name}">${list.name}</a>
        </div>
        `)
    })
    $(".delete-button").click(deleteList)
}


async function deleteList(event){
    const id = event.currentTarget.dataset.id
    await axios.delete(`/api/list/${id}`)
    renderLists()
}

addButton.click(createList);
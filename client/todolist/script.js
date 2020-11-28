const input = document.querySelector("#inputVal")
const addButton = document.querySelector("#addButton")
const checkList = document.querySelector("#checkList")
const clear = document.querySelector("#clear")

let transfer = []
let classTodos = []

class Todo {
  constructor(obj) {
    this.id = obj.id || Math.random(),
    this.text = obj.text;
    this.checked = obj.checked;
  }
}

axios.get('/api/list-items')
  .then(function (response) {
    // handle success
    transfer = response.data

    if(!transfer) {
      transfer = []
    }
    for (const item of transfer) {
      const newItem = new Todo(item)
      console.log(item)
      classTodos.push(newItem)
      
    }
    renderList()
  })


function renderList() {
  checkList.innerHTML = ''
  for (const element of classTodos) {
    const newItem = document.createElement('div')
    newItem.setAttribute('id', `list-item-${element.id}`)
    newItem.classList.add('item', 'ui', 'grid', 'todo-item')
    
    const text = document.createElement('div');
    text.appendChild(document.createTextNode(element.text));
    text.classList.add('four', 'wide', 'column', 'grey')

    if (element.checked) {
      text.classList.add("strikethrough")
    }
    
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('two', 'wide', 'column', 'delete-button-wrapper')

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('ui', 'negative', 'small', 'basic', 'button', 'icon')
    deleteButton.innerHTML = '<i class="trash alternate outline icon" />'
    deleteButton.addEventListener('click', async function(event) {
      newItem.remove();

      await axios.delete(`/api/list-items/${element.id}`)

      classTodos = classTodos.filter(x => x.id !== element.id)
    })

    const checkButton = document.createElement('button')
    checkButton.classList.add('ui', 'positive', 'small', 'basic', 'button', 'icon')

    const iconName = element.checked ? 'check square outline' : 'square outline'

    checkButton.innerHTML = `<i class="${iconName} icon" />`
    checkButton.addEventListener('click', async function(event) {
      
      let response = await axios.post(`/api/list-items/update/${element.id}`)
      classTodos = response.data
      renderList()
    })
    
    buttonContainer.appendChild(checkButton)
    buttonContainer.appendChild(deleteButton)
    newItem.appendChild(text)
    newItem.appendChild(buttonContainer)
    checkList.appendChild(newItem)
  }
}
renderList()

async function saveList() {
}

async function clearList(){
  
  await axios.delete('/api/list-items')
  
  classTodos = []
  renderList()
}


async function inputVal(){
  if (input.value === "") {
    return
  }
  
  const newItem = new Todo({
    text: input.value,
    id: Math.random(),
    checked: false
  })

  await axios.post('/api/list-items/new', {
    text: newItem.text,
    id: newItem.id,
    checked: newItem.checked
  })

  classTodos.push(newItem)
  input.value = null;
  renderList()
}

addButton.addEventListener('click', inputVal)
clear.addEventListener('click', clearList)
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector("#addButton").click();
    }
});
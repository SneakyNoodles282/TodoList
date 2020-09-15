const input = document.querySelector("#inputVal")
const addButton = document.querySelector("#addButton")
const checkList = document.querySelector("#checkList")
const clear = document.querySelector("#clear")



class Todo {
  constructor(obj) {
    this.id = obj.id || Math.random(),
    this.text = obj.text;
    this.checked = obj.checked;
  }
}

let classTodos = []

const quick = localStorage.getItem('savedList')
let transfer = JSON.parse(quick)

for (const item of transfer) {
  const newItem = new Todo(item)
  classTodos.push(newItem)
}

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
    deleteButton.addEventListener('click', function(event) {
      newItem.remove();
      
      classTodos = classTodos.filter(x => x.id !== element.id)

      saveList()
    })

    const checkButton = document.createElement('button')
    checkButton.classList.add('ui', 'positive', 'small', 'basic', 'button', 'icon')

    const iconName = element.checked ? 'check square outline' : 'square outline'

    checkButton.innerHTML = `<i class="${iconName} icon" />`
    checkButton.addEventListener('click', function(event) {
      element.checked = !element.checked;
      console.log(element)
      
      newItem.remove();
      
      classTodos = classTodos.filter(x => x.id !== element.id)
      
      if (element.checked) {
        classTodos.push(element)
      } else {
        classTodos.unshift(element)
      }

      renderList()
      saveList()      
    })
    
    buttonContainer.appendChild(checkButton)
    buttonContainer.appendChild(deleteButton)
    newItem.appendChild(text)
    newItem.appendChild(buttonContainer)
    checkList.appendChild(newItem)
  }
}
renderList()

function saveList() {
  localStorage.setItem('savedList', JSON.stringify(classTodos));
}

function clearList(){
  classTodos = []
  renderList()
  saveList()
}

function inputVal(){
  if (input.value === "") {
    return
  }
  
  const newItem = new Todo({
    text: input.value,
    checked: false
  })
  classTodos.push(newItem)
  input.value = null;
  renderList()
  saveList()
}

addButton.addEventListener('click', inputVal)
clear.addEventListener('click', clearList)
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector("#addButton").click();
    }
});
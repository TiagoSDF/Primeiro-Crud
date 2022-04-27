let id

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dbfunc')) ?? []
  },
  set(transaction) {
    localStorage.setItem('dbfunc', JSON.stringify(transaction))
  }
}

const Utils = {
  formatSalary(value) {
    value = value * 100
    return Math.round(value)
  },
  formatCurrency(value) {
    let salary = Utils.formatSalary(value)
    const signal = Number(salary) < 0 ? '-' : ''
    salary = String(salary).replace(/\D/g, '')
    salary = Number(salary) / 100

    salary = salary.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    return signal + salary
  }
}

const Modal = {
  modal: document.querySelector('.modal-container'),

  openModal(edit = false, index = 0) {
    Modal.modal.classList.add('active')
    //fechar modal
    Modal.modal.onclick = e => {
      if (e.target.className.indexOf('modal-container') != -1) {
        Modal.modal.classList.remove('active')
      }
    }

    if (edit) {
      Form.Nome.value = Transaction.all[index].nome
      Form.Funcao.value = Transaction.all[index].funcao
      Form.Salario.value = Transaction.all[index].salario
      id = index
    } else {
      Form.Nome.value = ''
      Form.Funcao.value = ''
      Form.Salario.value = ''
    }
  }
}

const Transaction = {
  all: Storage.get(),

  editItem(index) {
    Modal.openModal(true, index)
  },

  deleteItem(index) {
    Transaction.all.splice(index, 1)
    App.reaload()
  }
}

const DOM = {
  tbody: document.querySelector('tbody'),

  insertItem(transaction, index) {
    let tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    DOM.tbody.appendChild(tr)
  },

  innerHTMLTransaction(transaction, index) {
    const wage = Utils.formatCurrency(transaction.salario)
    const html = `
    <td>${transaction.nome}</td>
    <td>${transaction.funcao}</td>
    <td>${wage}</td>
    <td class='acao'>
      <button onClick="Transaction.editItem(${index})"><i class='bx bx-edit'></i></button>
    </td>
    <td class='acao'>
      <button onClick="Transaction.deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
    return html
  },

  clearTransaction() {
    DOM.tbody.innerHTML = ''
  }
}

const Form = {
  Nome: document.querySelector('#m-nome'),
  Funcao: document.querySelector('#m-funcao'),
  Salario: document.querySelector('#m-salario'),

  validadeField() {
    if (
      Form.Nome.value.trim() === '' ||
      Form.Funcao.value.trim() === '' ||
      Form.Salario.value.trim() === ''
    ) {
      throw new Error('Por favor preencha todos os campos')
    }
  },

  submit(event) {
    event.preventDefault()

    try {
      if (id != undefined) {
        Transaction.all[id].nome = Form.Nome.value
        Transaction.all[id].funcao = Form.Funcao.value
        Transaction.all[id].salario = Form.Salario.value
      } else {
        Transaction.all.push({
          nome: Form.Nome.value,
          funcao: Form.Funcao.value,
          salario: Form.Salario.value
        })
      }
      Form.validadeField()
      Storage.set()
      Modal.modal.classList.remove('active')
      App.reaload()
      id = undefined
    } catch (error) {
      alert(error.message)
    }
  }
}

const App = {
  init() {
    Transaction.all.forEach((transaction, index) => {
      DOM.insertItem(transaction, index)
    })

    Storage.set(Transaction.all)
  },
  reaload() {
    DOM.clearTransaction()
    App.init()
  }
}

App.init()

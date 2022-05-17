const transactionUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []


const removeTransaction = ID => {
    transactions = transactions
        .filter(transaction => transaction.id !== ID)
    updateLocalStorage()
    init()
}

const addTransactionIntoDOM = ({
    amount,
    name,
    id
}) => {

    const operator = amount < 0 ? '-' : '+' // se for true armazena uma string com sinal "-" se for false armazena com "+"
    const CSSclass = amount < 0 ? 'minus' : 'plus' // se for true armazena uma string com sinal "MINUS" se for false armazena com "PLUS"
    const amountWithoutOperator = Math.abs(amount)
    const li = document.createElement('li')

    li.classList.add(CSSclass)
    li.innerHTML = ` 
     ${name}
      <span>${operator} R$ ${amountWithoutOperator}</span>
     <button class="delete-btn" 
     onClick="removeTransaction(${id})">x</button>
    `
    transactionUl.append(li) //acrescenta sempre ao ultimo item da lista 
}

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
        .filter(value => value < 0)
        .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2) // valor total das despesas

const getIncome = transactionsAmounts => transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2) // valor total das receitas

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2) // valor da soma total de despesas e receitas 

const updateBalanceValues = () => {

    const transactionsAmounts = transactions.map(({
        amount
    }) => amount)
    const total = getTotal(transactionsAmounts)
    const income = getIncome(transactionsAmounts)
    const expense = getExpenses(transactionsAmounts)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`

}

// quando for carregada insere um novo item a lista 
const init = () => {
    transactionUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}

init();

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000) //gerar ID aleatorios até 1000
const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    })
}

const cleanInputs = () => { // limpa os campos de input
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
    event.preventDefault() //impede que o form seja enviado e a pagina  recarregada

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''
    
    if (isSomeInputEmpty) {
        alert('preencha ambos os campos "nome e valor" ')
        return
    } //if verifica se os valores foram inseridos, mostra alert 

    addToTransactionsArray(transactionName, transactionAmount)
    init() // atualiza as transações na tela
    updateLocalStorage() // atualiza o localstorage
    cleanInputs() // limpa os campos do input
}

form.addEventListener('submit', handleFormSubmit)
// classList ka kaafi use kiya h uski properties kaafi useful h like add, remmove, contains,etc. to check that out 

class UI{
    constructor(){

        // due to constructor these will be added everytime to our instance whenever we intentiate the class
        // these are properties not variables

        this.budgetFeedback = document.querySelector(".budget-feedback");
        this.expenseFeedback = document.querySelector(".expense-feedback");
        this.budgetForm = document.getElementById("budget-form");
        this.budgetInput = document.getElementById("budget-input");
        this.budgetAmount = document.getElementById("budget-amount");
        this.expenseAmount = document.getElementById("expense-amount");
        this.balance = document.getElementById("balance");
        this.balanceAmount = document.getElementById("balance-amount");
        this.expenseForm = document.getElementById("expense-form");
        this.expenseInput = document.getElementById("expense-input");
        this.amountInput = document.getElementById("amount-input");
        this.expenseList = document.getElementById("expense-list");
        this.itemList = [];
        this.itemID = 0;

    }

// submit budget method
    submitBudgetForm(){
        
        // console.log("niche ui.submitBudgetForm call karne se yeh chalega"); and preventDefault se submit hone par page refresh nhi hoga
        const value = this.budgetInput.value
        if(value === '' || value < 0){
            this.budgetFeedback.classList.add('showItem')          // yeh showItem vaali class ko add karega and vo apna kaam karegi
            this.budgetFeedback.innerHTML = `<p>Entered value is not correct</p>`

            const self = this       // agar simply this karenge to since hum abhi class UI ke andar sumbitBudgetForm mein h to this yahan budgetFeedback ko point nhi karega tabhi pehle usko self mein store karvaa rahe h 
            setTimeout(() => {
                self.budgetFeedback.classList.remove("showItem")
            }, 3500)
        }
        else{
            this.budgetAmount.textContent = value
            this.budgetInput.value = "";
            this.showBalance()           // yahan this directly UI class ko refer kar rahi h bcz yeh statement kissi function ke andar nhi h 
        }
    }

// show balance
    showBalance(){
        const expense = this.totalExpense()
        const total = parseInt(this.budgetAmount.textContent) - expense
        this.balanceAmount.textContent = total
        if(total < 0){
            this.balance.classList.remove("showGreen" , "showBlack")      // iska mtlb ki agar balance < 0 to yeh 2 class red and black vaali remove kar ke (if and only if present h to) green vaali class jo only css mein define h usko add kar do
            this.balance.classList.add("showRed")
        }
        else if(total > 0){
            this.balance.classList.remove("showRed" , "showBlack")
            this.balance.classList.add("showGreen")
        }
        else if(total === 0){
            this.balance.classList.remove("showGreen" , "showRed")
            this.balance.classList.add("showBlack")
        }
    }
    
// submit expense form
    submitExpenseForm(){
        const expenseValue = this.expenseInput.value        // kya expense h uske liye sentence
        const amountValue = this.amountInput.value       // us expense ki amount kitni h        

        if(expenseValue === "" || amountValue === "" || amountValue < 0){
            this.expenseFeedback.classList.add("showItem")
            this.expenseFeedback.innerHTML = `<p>values are not appropriate</p>`
            const self = this
            setTimeout(() => {
                self.expenseFeedback.classList.remove("showItem")
            }, 4000)
        }
        else{
            const amount = parseInt(amountValue)
            this.expenseInput.value = ""
            this.amountInput.value = ""

            const expense = {
                id: this.itemID,
                title: expenseValue,
                amount: amount              // converted amountValue to int and stored it in amount
            }
            this.itemID++ 
            this.itemList.push(expense)

    // add expense        
            this.addExpense(expense)
    // show balance
            this.showBalance()
        }        
    }

// add expense
    addExpense(expense){
        const div = document.createElement('div')
        div.classList.add('expense')
        div.innerHTML = `
        <div class="expense-item d-flex justify-content-between align-items-baseline">
        <h6 class="expense-title mb-0 text-uppercase list-item">-> ${expense.title}</h6>
        <h5 class="expense-amount mb-0 list-item">Rs ${expense.amount}</h5>
        <div class="expense-icons list-item">
         <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
          <i class="fas fa-edit"></i>
         </a>
         <a href="#" class="delete-icon" data-id="${expense.id}">
          <i class="fas fa-trash"></i>
         </a>
        </div>
       </div>
        `;
        this.expenseList.appendChild(div)
    }

// total  expense
    totalExpense(){
        let total = 0
        if(this.itemList.length > 0){      // itemList is an empty array jisme hum expenses push kar rahe the and ab ispe reduce method apply kar rahe h
            total = this.itemList.reduce(function(acc, curr) {
                // console.log(`Total is ${acc} and the current value is ${curr.amount}`);
                acc += curr.amount
                return acc
            }, 0)
        }
        this.expenseAmount.textContent = total
        return total
    }    

// edit expense
    editExpense(element){
        const id = parseInt(element.dataset.id)
        const parent = element.parentElement.parentElement.parentElement
    
    // remove from dom
        this.expenseList.removeChild(parent)     // isse yeh hoga ki jp expense icon ke saath jo value dikh rahi and balance update ho kar aa raha h vo remove ho jaayega and balance bhi update ho jaayega

    // 
        const expense = this.itemList.filter(function(item){        // yeh expense array mein vo expense aayega jispe humne click kiya edit karne ke liye
            return item.id === id              
        })

    // show value
        this.expenseInput.value = expense[0].title       // in 2 lines se eh hoga ki expense array ki jo 0th item ya one and only item at a time jo hogi vo title mein aa jaayegi and amount mein bhi aa jaayegi as well taaki hum edit kar paaye
        this.amountInput.value = expense[0].amount

    // remove from list
        const tempList = this.itemList.filter(function(item){      // 2 list use ki ek actual itemList and dusri tempList. itemList mein saare vo expenses jispe click hua h and tempList mein baaki remaining expenses jinke saath kuch nhi karna to isliye yeh tempList nayi itemList ban jaayegi and hence vahan display karenge
            return item.id !== id
        })
        this.itemList = tempList
        this.showBalance()
    }

// delete expense
    deleteExpense(element){
        const id = parseInt(element.dataset.id)
        const parent = element.parentElement.parentElement.parentElement
    
    // remove from dom
        this.expenseList.removeChild(parent)     // isse yeh hoga ki jp expense icon ke saath jo value dikh rahi and balance update ho kar aa raha h vo remove ho jaayega and balance bhi update ho jaayega

    // remove from list
        const tempList = this.itemList.filter(function(item){      // 2 list use ki ek actual itemList and dusri tempList. itemList mein saare vo expenses jispe click hua h and tempList mein baaki remaining expenses jinke saath kuch nhi karna to isliye yeh tempList nayi itemList ban jaayegi and hence vahan display karenge
            return item.id !== id
        })
        this.itemList = tempList
        this.showBalance()
    }

}

function eventListeners(){
    const budgetForm = document.getElementById('budget-form')
    const expenseForm = document.getElementById('expense-form')
    const expenseList = document.getElementById('expense-list')


// new instance of UI class
    const ui = new UI()

// budget form submit
    budgetForm.addEventListener('submit', event => {
        event.preventDefault()
        ui.submitBudgetForm()
    })    

// expense form submit
    expenseForm.addEventListener('submit', event => {
        event.preventDefault()
        ui.submitExpenseForm()
    })

// expense list click
    expenseList.addEventListener('click', event => {
        if(event.target.parentElement.classList.contains('edit-icon')){         // iska mtlb jab hum edit pe click karenge to hume console mein hume (fa-edit / fa-trash) milega but hume chahiye (edit-icon / delete-icon) vaali class jo ki uski parent h to uske liye contains se hum check kring ki kya uska parentElement kya (edit-icon / delete-icon) h
            ui.editExpense(event.target.parentElement)
        }
        else if(event.target.parentElement.classList.contains('delete-icon')){
            ui.deleteExpense(event.target.parentElement)            
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    eventListeners()
})
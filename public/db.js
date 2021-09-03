let db;

const request = window.indexedDB.open("BudgetDB", 1);

request.onupgradeneeded = function (event) {
  const db = request.result;
  db.createObjectStore("BudgetStore", { autoIncrement: true });
};

request.onerror = function (event) {
    console.log('Error! Something went wrong.');
  };

request.onsuccess = function (event) {
  db = request.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};

function saveRecord(record) {
    const transaction = db.transaction(["BudgetStore"], "readwrite");
    const budgetStore = transaction.objectStore("BudgetStore");
    budgetStore.add(record);
  }
  
  // checks the indexeddb database and pulls whatever is in there out and puts it in mongodb - if you add something offline and then go back online, it will put it in mongo once you're online
  function checkDatabase() {

  }

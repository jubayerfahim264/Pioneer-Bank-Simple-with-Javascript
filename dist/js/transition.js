const depositeBtn = document.getElementById("depositeBtn");
const withdrawBtn = document.getElementById("withdrawBtn");

depositeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  //handler deposite
  const addDeposite = document.getElementById("addDeposite").value;
  const depositeNumber = parseFloat(addDeposite);

  updateNumberInput("depositeAmount", depositeNumber);

  document.getElementById("addDeposite").value = "";
  //handle balance
  updateNumberInput("balanceAmount", depositeNumber);
});

withdrawBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const addWithdraw = document.getElementById("addWithdraw").value;
  const addWithdrawNumber = parseFloat(addWithdraw);

  const withdrawAmount = document.getElementById("withdrawAmount").innerHTML;
  const withdrawAmountNumber = parseFloat(withdrawAmount);

  const totalWithdraw = addWithdrawNumber + withdrawAmountNumber;
  document.getElementById("withdrawAmount").innerHTML = totalWithdraw;
  document.getElementById("addWithdraw").value = "";
});

const updateNumberInput = (id, depositeNumber) => {
  const Amount = document.getElementById(id).innerText;
  const AmountNumber = parseFloat(Amount);
  const total = AmountNumber + depositeNumber;
  document.getElementById(id).innerText = total;
};

const depositeBtn = document.getElementById("depositeBtn");
const withdrawBtn = document.getElementById("withdrawBtn");

depositeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  //handler deposite
  const addDeposite = document.getElementById("addDeposite").value;
  const depositeNumber = parseFloat(addDeposite);

  const depositeAmount = document.getElementById("depositeAmount").innerText;
  const depositeAmountNumber = parseFloat(depositeAmount);

  const totalDeposite = depositeNumber + depositeAmountNumber;

  document.getElementById("depositeAmount").innerText = totalDeposite;
  document.getElementById("addDeposite").value = "";
  //handle balance
  updateNumberInput("balanceAmount", depositeNumber);
});

const updateNumberInput = (id, depositeNumber) => {
  const balanceAmount = document.getElementById(id).innerText;
  const balanceAmountNumber = parseFloat(balanceAmount);
  const totalBalance = balanceAmountNumber + depositeNumber;
  document.getElementById(id).innerText = totalBalance;
};

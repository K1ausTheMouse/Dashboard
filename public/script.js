// refreshing every 2 min
setInterval(function () {
  location.reload();
}, 120000);
// 120000 milliseconds = 2 min

// fetch data from Flask
fetch("/api/data")
  .then(res => res.json())
  .then(data => {

    let html = "";

    let totalIncome = 0;
    let totalExpense = 0;

    const monthOrder = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    // stores each month's income and expenses
    let monthlyData = {};

    // go through API data
    for (let i = 0; i < data.length; i++) {

      const month = data[i].month;
      const type = data[i].type;
      const amount = Number(data[i].amount);

      // table
      html += `
        <tr>
          <td>${month}</td>
          <td>${type}</td>
          <td>£${amount.toLocaleString()}</td>
        </tr>
      `;

      // total cards
      if (type === "income") {
        totalIncome += amount;
      }

      if (type === "expense") {
        totalExpense += amount;
      }

      // create month if it does not exist yet
      if (!monthlyData[month]) {
        monthlyData[month] = {
          income: 0,
          expense: 0
        };
      }

      // put amount into correct type
      if (type === "income") {
        monthlyData[month].income += amount;
      }

      if (type === "expense") {
        monthlyData[month].expense += amount;
      }
    }


    // update table
    document.getElementById("output").innerHTML = html;


    // update cards
    document.getElementById("total-sales").textContent =
      "£" + totalIncome.toLocaleString();

    document.getElementById("total-customers").textContent =
      "£" + totalExpense.toLocaleString();


    // sort months properly
    let labels = Object.keys(monthlyData).sort(
      (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
    );

    let incomeData = [];
    let expenseData = [];

    for (let i = 0; i < labels.length; i++) {
      incomeData.push(monthlyData[labels[i]].income);
      expenseData.push(monthlyData[labels[i]].expense);
    }


    // month-to-month balance change
    let percentageChange = 0;

    if (labels.length >= 2) {

      const lastMonth = labels[labels.length - 1];
      const previousMonth = labels[labels.length - 2];

      const lastBalance =
        monthlyData[lastMonth].income -
        monthlyData[lastMonth].expense;

      const previousBalance =
        monthlyData[previousMonth].income -
        monthlyData[previousMonth].expense;

      if (previousBalance !== 0) {
        percentageChange =
          ((lastBalance - previousBalance) /
            Math.abs(previousBalance)) * 100;
      }
    }


    let arrow = "";
    let color = "";

    if (percentageChange > 0) {
      arrow = "↑";
      color = "green";
    } else if (percentageChange < 0) {
      arrow = "↓";
      color = "red";
    } else {
      arrow = "→";
      color = "gray";
    }


    const percentageElement =
      document.getElementById("percentage-change");

    percentageElement.textContent =
      `${arrow} ${percentageChange.toFixed(1)}%`;

    percentageElement.style.color = color;


    // chart
    const ctx = document.getElementById("saleschart");

    new Chart(ctx, {
      type: "bar",

      data: {
        labels: labels,

        datasets: [
          {
            label: "Income",
            data: incomeData
          },
          {
            label: "Expenses",
            data: expenseData
          }
        ]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  });
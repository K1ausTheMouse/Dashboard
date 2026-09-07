// refreshing every 2 min
setInterval(function(){
 location.reload();
}, 120000); // 120000 milliseconds = 2 min

// python fetching
fetch("/api/data")
 .then(res => res.json())
 .then(data => {
   // setup veriables
   let html = "";
   let totalSales = 0;
   let totalCustomer = 0;
   let labels= [];
   let salesData= [];
   // loop through the data
   for (let i = 0; i < data.length; i++) {
     html += `
<tr>
<td>${data[i].Month}</td>
<td>${Number(data[i].Sales).toLocaleString()}</td>
<td>${Number(data[i].Customers).toLocaleString()}</td>
</tr>
     `;
     // Calculating for cards
     totalSales+=Number(data[i].Sales);
     totalCustomer+= Number(data[i].Customers);
     // collecting data for chart
     labels.push(data[i].Month);
     salesData.push(Number(data[i].Sales));
 }
 //update page
 document.getElementById("output").innerHTML = html;
 document.getElementById("total-sales").textContent = "$" + totalSales.toLocaleString();
 // % change : month to month change
 let lastMonth = Number(data[data.length -1].Sales);
 let prevMonth = Number(data[data.length -2].Sales);
 let percentageChange = 0;
 if (prevMonth !== 0){
   percentageChange = ((lastMonth - prevMonth) / prevMonth) * 100;
 }
 let arrow = "";
 let color = "";
 if (percentageChange > 0){
   arrow = "↑";
   color = "green";
 }else if (percentageChange < 0){
   arrow = "↓";
   color = "red";
 }else{
   arrow = "→";
   color = "gray";
 }
   const percentageElement = document.getElementById("percentage-change");
   percentageElement.textContent = `${arrow} ${percentageChange.toFixed(1)}%`;
   percentageElement.style.color =color;
   document.getElementById("total-customers").textContent =
   totalCustomer.toLocaleString();
   // chart
   const ctx = document.getElementById("saleschart");
   new Chart(ctx, {
     type: "bar",
     data: {
       labels: labels,
       datasets: [{
         label: "sales",
         data: salesData
        }]
     },
     options: {
       responsive: true,
       maintainAspectRatio: false
     }
   });
 });
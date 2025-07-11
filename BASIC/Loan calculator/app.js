document.getElementById("calculate-button").addEventListener("click", function () {
    // Get values from input fields
    let loanAmount = parseFloat(document.getElementById("loan-amount").value);
    let interestRate = parseFloat(document.getElementById("interest-rate").value);
    let loanTerm = parseInt(document.getElementById("loan-term").value);

    // Validate inputs
    if (isNaN(loanAmount) || loanAmount <= 0 || isNaN(interestRate) || interestRate < 0 || isNaN(loanTerm) || loanTerm <= 0) {
        alert("Please enter valid values.");
        return;
    }

    // Convert annual interest rate to monthly and to decimal
    let monthlyRate = (interestRate / 100) / 12;

    // Calculate Monthly Payment using Loan Formula
    let monthlyPayment;
    if (monthlyRate === 0) {
        monthlyPayment = loanAmount / loanTerm; // Simple division if no interest
    } else {
        monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanTerm));
    }

    // Display result
    document.getElementById("monthly-payment").textContent = `₹${monthlyPayment.toFixed(2)}`;
});

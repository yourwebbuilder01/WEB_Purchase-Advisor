let currentUsage = null;
let currentAnalysis = null;

function nextSection(nextId) {
    const currentCard = document.querySelector('.card.active');
    const nextCard = document.getElementById(nextId);
    
    if (currentCard) {
        currentCard.classList.remove('active');
    }
    
    setTimeout(() => {
        nextCard.classList.add('active');
    }, 300);
}

function prevSection(prevId) {
    const currentCard = document.querySelector('.card.active');
    const prevCard = document.getElementById(prevId);
    
    if (currentCard) {
        currentCard.classList.remove('active');
    }
    
    setTimeout(() => {
        prevCard.classList.add('active');
    }, 300);
}

function selectUsage(value, element) {
    currentUsage = value;
    
    // Remove selected class from all options
    document.querySelectorAll('.usage-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    element.classList.add('selected');
}

function calculateScore(price, savings, income, usage, monthlySpending) {
    // Can you afford it safely?
    const emergencyFund = income * 3;
    const remainingSavings = savings - price;
    const safetyScore = Math.min(1.0, remainingSavings / emergencyFund);
    
    // Is it good value for money?
    let valueScore;
    if (usage > 0) {
        const costPerUse = price / (usage * 12);
        valueScore = Math.min(1.0, 1.0 / (costPerUse + 0.1));
    } else {
        valueScore = 0.1;
    }
    
    // Is it within your means?
    const incomeRatio = price / income;
    let affordabilityScore;
    if (incomeRatio <= 0.03) affordabilityScore = 1.0;
    else if (incomeRatio <= 0.07) affordabilityScore = 0.7;
    else if (incomeRatio <= 0.15) affordabilityScore = 0.4;
    else affordabilityScore = 0.1;
    
    // Monthly spending impact
    const spendingRatio = income > 0 ? monthlySpending / income : 1;
    let spendingScore;
    if (spendingRatio <= 0.6) spendingScore = 1.0;
    else if (spendingRatio <= 0.8) spendingScore = 0.7;
    else if (spendingRatio <= 1.0) spendingScore = 0.4;
    else spendingScore = 0.1;
    
    return (safetyScore * 0.3) + (valueScore * 0.3) + (affordabilityScore * 0.2) + (spendingScore * 0.2);
}

function getUsageDescription(usage) {
    if (usage >= 90) return "Multiple times daily";
    if (usage >= 30) return "Daily";
    if (usage >= 15) return "Several times weekly";
    if (usage >= 4) return "Weekly";
    if (usage >= 1) return "Occasionally";
    return "Rarely";
}

async function analyzePurchase() {
    // Get input values
    const item = document.getElementById('item').value;
    const price = parseFloat(document.getElementById('price').value);
    const savings = parseFloat(document.getElementById('savings').value);
    const income = parseFloat(document.getElementById('income').value);
    const monthlySpending = parseFloat(document.getElementById('monthly-spending').value);
    
    // Validate inputs
    if (!item || !price || !savings || !income || !monthlySpending || !currentUsage) {
        alert('Please fill in all fields before analyzing.');
        return;
    }
    
    // Move to analysis section
    nextSection('analysis');
    
    // Store current analysis data
    currentAnalysis = {
        item,
        price,
        savings,
        income,
        monthlySpending,
        usage: currentUsage
    };
    
    // Simulate analysis progress
    await simulateProgress();
    
    // Calculate results
    const score = calculateScore(price, savings, income, currentUsage, monthlySpending);
    const remainingSavings = savings - price;
    const emergencyMonths = income > 0 ? remainingSavings / income : 0;
    const costPerUse = currentUsage > 0 ? price / (currentUsage * 12) : price;
    const spendingRatio = income > 0 ? monthlySpending / income : 0;
    
    // Display results
    displayResults(score, item, price, currentUsage, remainingSavings, emergencyMonths, costPerUse, spendingRatio);
    
    // Move to results section
    nextSection('results');
}

async function simulateProgress() {
    const progress1 = document.getElementById('progress-1');
    const progress2 = document.getElementById('progress-2');
    const progress3 = document.getElementById('progress-3');
    
    // Reset progress bars
    progress1.style.width = '0%';
    progress2.style.width = '0%';
    progress3.style.width = '0%';
    
    // Animate progress bars sequentially
    await animateProgress(progress1, 1500);
    await animateProgress(progress2, 1200);
    await animateProgress(progress3, 1000);
}

function animateProgress(element, duration) {
    return new Promise(resolve => {
        element.style.width = '100%';
        setTimeout(resolve, duration);
    });
}

function displayResults(score, item, price, usage, remainingSavings, emergencyMonths, costPerUse, spendingRatio) {
    // Update score circle
    const scoreCircle = document.getElementById('score-circle');
    const scoreValue = document.getElementById('score-value');
    scoreCircle.style.setProperty('--score-percent', `${score * 100}%`);
    scoreValue.textContent = `${Math.round(score * 100)}%`;
    
    // Update result title and description
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    
    if (score >= 0.8) {
        resultTitle.innerHTML = '✅ EXCELLENT BUY';
        resultDescription.textContent = 'This is a great purchase! Good value and fits your budget well.';
    } else if (score >= 0.6) {
        resultTitle.innerHTML = '✅ GOOD BUY';
        resultDescription.textContent = 'This is a reasonable purchase. You\'ll get good use from it.';
    } else if (score >= 0.4) {
        resultTitle.innerHTML = '⚠️ THINK ABOUT IT';
        resultDescription.textContent = 'Consider waiting or alternatives. Sleep on it for a few days.';
    } else {
        resultTitle.innerHTML = '❌ RECONSIDER';
        resultDescription.textContent = 'Not the best use of money now. Your money could work better elsewhere.';
    }
    
    // Update result details
    document.getElementById('result-item').textContent = item;
    document.getElementById('result-cost').textContent = `$${price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('result-usage').textContent = getUsageDescription(usage);
    
    // Update financial impact
    document.getElementById('remaining-savings').textContent = `$${remainingSavings.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('emergency-months').textContent = `${emergencyMonths.toFixed(1)} months`;
    document.getElementById('cost-per-use').textContent = `$${costPerUse.toFixed(2)}`;
    document.getElementById('spending-ratio').textContent = `${Math.round(spendingRatio * 100)}% of income`;
    
    // Generate insights
    generateInsights(costPerUse, emergencyMonths, spendingRatio);
}

function generateInsights(costPerUse, emergencyMonths, spendingRatio) {
    const insightList = document.getElementById('insight-list');
    insightList.innerHTML = '';
    
    const insights = [];
    
    // Cost per use insights
    if (costPerUse < 1) {
        insights.push({ text: '💡 Great value! Cost per use is very low', type: 'good' });
    } else if (costPerUse < 5) {
        insights.push({ text: '💡 Good value for money', type: 'good' });
    } else {
        insights.push({ text: '💡 Consider if you\'ll really use it enough', type: 'warning' });
    }
    
    // Emergency fund insights
    if (emergencyMonths >= 3) {
        insights.push({ text: '💡 Healthy emergency fund remaining', type: 'good' });
    } else if (emergencyMonths >= 1) {
        insights.push({ text: '💡 Emergency fund is getting low', type: 'warning' });
    } else {
        insights.push({ text: '💡 Warning: Emergency fund depleted', type: 'warning' });
    }
    
    // Spending ratio insights
    if (spendingRatio <= 0.6) {
        insights.push({ text: '💡 Healthy spending habits', type: 'good' });
    } else if (spendingRatio <= 0.8) {
        insights.push({ text: '💡 Manageable spending level', type: 'good' });
    } else if (spendingRatio <= 1.0) {
        insights.push({ text: '💡 Consider reducing monthly expenses', type: 'warning' });
    } else {
        insights.push({ text: '💡 Spending exceeds income - review budget', type: 'warning' });
    }
    
    // Add insights to the list
    insights.forEach(insight => {
        const insightElement = document.createElement('div');
        insightElement.className = `insight-item ${insight.type}`;
        insightElement.textContent = insight.text;
        insightList.appendChild(insightElement);
    });
}

function saveToHistory() {
    if (!currentAnalysis) return;
    
    // Get existing history or initialize empty array
    const history = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
    
    // Add current analysis to history
    history.push({
        ...currentAnalysis,
        timestamp: new Date().toISOString(),
        score: calculateScore(
            currentAnalysis.price,
            currentAnalysis.savings,
            currentAnalysis.income,
            currentAnalysis.usage,
            currentAnalysis.monthlySpending
        )
    });
    
    // Save back to localStorage
    localStorage.setItem('purchaseHistory', JSON.stringify(history));
    
    alert('Purchase analysis saved to history!');
}

function restartAnalysis() {
    // Reset form
    document.getElementById('item').value = '';
    document.getElementById('price').value = '';
    document.getElementById('savings').value = '';
    document.getElementById('income').value = '';
    document.getElementById('monthly-spending').value = '';
    
    // Reset usage selection
    currentUsage = null;
    document.querySelectorAll('.usage-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Go back to first section
    nextSection('purchase-info');
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Add any initialization code here
});

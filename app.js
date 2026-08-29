const demoUser = { email: 'mia@daymark.app', password: 'daymark123', name: 'Harish', initials: 'H' };
const categoryColors = { Food: '#ff6f61', Transport: '#497cff', Shopping: '#f0a52b', Bills: '#00b881', Health: '#d65ac6', Other: '#7388a8' };
const starterExpenses = [
  { id: 1, description: 'Weekly groceries', amount: 84.2, category: 'Food', date: '2026-08-28' },
  { id: 2, description: 'Electricity bill', amount: 62, category: 'Bills', date: '2026-08-26' },
  { id: 3, description: 'Metro card top-up', amount: 25, category: 'Transport', date: '2026-08-24' },
  { id: 4, description: 'New running shoes', amount: 96.5, category: 'Shopping', date: '2026-08-21' },
  { id: 5, description: 'Lunch with Sam', amount: 31.75, category: 'Food', date: '2026-08-19' },
  { id: 6, description: 'Pharmacy', amount: 18.4, category: 'Health', date: '2026-08-16' }
];
const savedExpensesByMonth = JSON.parse(localStorage.getItem('daymark-expenses-by-month'));
const savedExpenses = JSON.parse(localStorage.getItem('daymark-expenses'));
let expenses = savedExpensesByMonth ? Object.values(savedExpensesByMonth).flat() : (savedExpenses || starterExpenses);
let salaries = JSON.parse(localStorage.getItem('daymark-salaries')) || { '2026-08': 2500 };
let selectedMonth = '2026-08';
const $ = (id) => document.getElementById(id);
const money = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const monthName = (value, format = 'long') => new Date(`${value}-02T12:00:00`).toLocaleDateString('en-US', { month: format, year: 'numeric' });
const monthExpenses = () => expenses.filter((expense) => expense.date.startsWith(selectedMonth));
function render() {
  const visible = monthExpenses();
  const total = visible.reduce((sum, expense) => sum + expense.amount, 0);
  const salary = Number(salaries[selectedMonth] || 0);
  const byCategory = visible.reduce((groups, expense) => ({ ...groups, [expense.category]: (groups[expense.category] || 0) + expense.amount }), {});
  const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const days = new Set(visible.map((expense) => expense.date)).size;
  const top = categories[0];
  const monthText = monthName(selectedMonth);
  $('monthLabel').textContent = monthText;
  $('chartMonth').textContent = monthName(selectedMonth, 'short').split(' ')[0].toUpperCase();
  $('transactionNote').textContent = monthText;
  $('totalSpent').textContent = money(total);
  $('chartCenterAmount').textContent = money(total);
  $('salaryAmount').textContent = money(salary);
  $('salaryInput').value = salary || '';
  $('remainingBalance').textContent = money(salary - total);
  $('remainingBalance').classList.toggle('negative', salary - total < 0);
  $('dailyAverage').textContent = money(days ? total / days : 0);
  $('daysTracked').textContent = `${days} day${days === 1 ? '' : 's'} tracked`;
  $('topCategory').textContent = top ? top[0] : '—';
  $('topCategoryAmount').textContent = top ? `${money(top[1])} this month` : 'No expenses yet';
  $('transactionCount').textContent = visible.length;
  $('chartTotal').textContent = money(total);
  renderChart(categories, total);
  renderTransactions(visible);
}
function renderChart(categories, total) {
  const chart = $('pieChart');
  if (!total) chart.style.background = '#e8eceb';
  else {
    let start = 0;
    const segments = categories.map(([category, amount]) => { const end = start + (amount / total) * 100; const segment = `${categoryColors[category]} ${start}% ${end}%`; start = end; return segment; });
    chart.style.background = `conic-gradient(${segments.join(', ')})`;
  }
  $('legend').innerHTML = categories.length ? categories.map(([category, amount]) => `<div class="legend-item"><span><i style="background:${categoryColors[category]}"></i>${category}</span><strong>${Math.round((amount / total) * 100)}%</strong></div>`).join('') : '<p class="empty-copy">No expenses recorded for this month.</p>';
}
function renderTransactions(visible) {
  $('transactionList').innerHTML = visible.length ? [...visible].sort((a, b) => b.date.localeCompare(a.date)).map((expense) => `<div class="transaction"><span class="category-dot" style="background:${categoryColors[expense.category]}">${expense.category.slice(0, 1)}</span><div class="transaction-info"><strong>${expense.description}</strong><span>${expense.category} · ${new Date(`${expense.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div><strong class="transaction-amount">−${money(expense.amount)}</strong><button class="delete-button" data-id="${expense.id}" aria-label="Delete ${expense.description}" title="Delete expense">×</button></div>`).join('') : '<p class="empty-copy">Nothing logged for this month yet. Add your first expense above.</p>';
  document.querySelectorAll('.delete-button').forEach((button) => button.addEventListener('click', () => { expenses = expenses.filter((expense) => expense.id !== Number(button.dataset.id)); persist(); render(); }));
}
function persist() {
  const expensesByMonth = expenses.reduce((months, expense) => {
    const month = expense.date.slice(0, 7);
    months[month] = months[month] || [];
    months[month].push(expense);
    return months;
  }, {});
  localStorage.setItem('daymark-expenses-by-month', JSON.stringify(expensesByMonth));
}
function persistSalaries() { localStorage.setItem('daymark-salaries', JSON.stringify(salaries)); }
function showDashboard() { $('loginView').classList.add('hidden'); $('dashboard').classList.remove('hidden'); render(); }
$('loginForm').addEventListener('submit', (event) => { event.preventDefault(); if ($('emailInput').value.trim().toLowerCase() === demoUser.email && $('passwordInput').value === demoUser.password) showDashboard(); else alert('Please use the demo email and password shown below.'); });
$('logoutBtn').addEventListener('click', () => { $('dashboard').classList.add('hidden'); $('loginView').classList.remove('hidden'); });
$('monthInput').addEventListener('change', (event) => { selectedMonth = event.target.value || selectedMonth; render(); });
$('salaryForm').addEventListener('submit', (event) => { event.preventDefault(); salaries[selectedMonth] = Number($('salaryInput').value); persistSalaries(); render(); });
$('expenseForm').addEventListener('submit', (event) => { event.preventDefault(); const date = $('dateInput').value; expenses.push({ id: Date.now(), description: $('descriptionInput').value.trim(), amount: Number($('amountInput').value), category: $('categoryInput').value, date }); selectedMonth = date.slice(0, 7); $('monthInput').value = selectedMonth; persist(); event.target.reset(); $('dateInput').value = date; render(); });
$('dateInput').value = '2026-08-29';
$('userName').textContent = demoUser.name;
$('userAvatar').textContent = demoUser.initials;
persist();
const savedProfilePhoto = localStorage.getItem('daymark-profile-photo');
if (savedProfilePhoto) $('userAvatar').style.backgroundImage = `url(${savedProfilePhoto})`;
$('profilePhotoInput').addEventListener('change', (event) => {
  const [file] = event.target.files;
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    $('userAvatar').style.backgroundImage = `url(${reader.result})`;
    $('userAvatar').textContent = '';
    localStorage.setItem('daymark-profile-photo', reader.result);
  });
  reader.readAsDataURL(file);
});

// This separate JavaScript file will handle all dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize sidebar navigation
  initializeSidebar();
  
  // Initialize tab functionality
  initializeTabs();
  
  // Initialize other components
  initializeCalendar();
  initializeCharts();
  initializeModals();
  initializeFormHandlers();
  
  // Show the dashboard page by default
  showPage('dashboard-page');
});

// Function to initialize sidebar navigation
function initializeSidebar() {
  const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
  
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the target page from data-page attribute
      const targetPage = this.getAttribute('data-page');
      
      // Update active link
      sidebarLinks.forEach(item => item.classList.remove('active'));
      this.classList.add('active');
      
      // Show the target page
      showPage(targetPage);
      
      // Update page title
      document.getElementById('page-title').textContent = this.textContent.trim();
    });
  });
}

// Function to show a specific page and hide others
function showPage(pageId) {
  const pageContents = document.querySelectorAll('.page-content');
  
  pageContents.forEach(page => {
    if (page.id === pageId) {
      page.style.display = 'block';
    } else {
      page.style.display = 'none';
    }
  });
}

// Function to initialize tab functionality
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabContainer = this.closest('.tab-container');
      const targetTab = this.getAttribute('data-tab');
      
      // Update active tab button
      tabContainer.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      
      // Show target tab content
      tabContainer.querySelectorAll('.tab-pane').forEach(pane => {
        if (pane.id === targetTab) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });
}

// Function to initialize calendar
function initializeCalendar() {
  const calendarMonth = document.getElementById('calendar-month');
  const calendarDays = document.getElementById('calendar-days');
  const prevMonthBtn = document.getElementById('prev-month-btn');
  const nextMonthBtn = document.getElementById('next-month-btn');
  
  if (!calendarMonth || !calendarDays) return;
  
  let currentDate = moment();
  
  function renderCalendar() {
    calendarMonth.textContent = currentDate.format('MMMM YYYY');
    
    // Clear previous days
    calendarDays.innerHTML = '';
    
    const firstDay = moment(currentDate).startOf('month');
    const lastDay = moment(currentDate).endOf('month');
    
    // Add empty cells for days before the first day of month
    const firstDayOfWeek = firstDay.day(); // 0 = Sunday, 6 = Saturday
    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day';
      calendarDays.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let i = 1; i <= lastDay.date(); i++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      
      const dayNumber = document.createElement('div');
      dayNumber.className = 'calendar-day-number';
      dayNumber.textContent = i;
      dayElement.appendChild(dayNumber);
      
      // Example events (hardcoded for May 2025)
      if (currentDate.month() === 4 && currentDate.year() === 2025) { // May is month 4 (0-indexed)
        if (i === 10) {
          const event = document.createElement('div');
          event.className = 'calendar-event';
          event.textContent = 'Client Meeting - TechGiant';
          dayElement.appendChild(event);
        } else if (i >= 15 && i <= 20) {
          const event = document.createElement('div');
          event.className = 'calendar-event';
          event.style.backgroundColor = '#f9c74f';
          event.textContent = "Sarah's Vacation";
          dayElement.appendChild(event);
        } else if (i === 25) {
          const event = document.createElement('div');
          event.className = 'calendar-event';
          event.style.backgroundColor = '#e63946';
          event.textContent = 'Project Deadline';
          dayElement.appendChild(event);
        }
      }
      
      calendarDays.appendChild(dayElement);
    }
  }
  
  // Initial calendar render
  renderCalendar();
  
  // Month navigation
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', function() {
      currentDate = moment(currentDate).subtract(1, 'month');
      renderCalendar();
    });
  }
  
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', function() {
      currentDate = moment(currentDate).add(1, 'month');
      renderCalendar();
    });
  }
}

// Function to initialize charts
function initializeCharts() {
  // Dashboard Chart
  const revenueExpensesElement = document.getElementById('revenueExpensesChart');
  if (revenueExpensesElement) {
    const ctx = revenueExpensesElement.getContext('2d');
    const revenueExpensesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Revenue',
            data: [18500, 22000, 19800, 24500, 24500, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: '#4361ee',
            borderColor: '#4361ee',
            borderWidth: 1
          },
          {
            label: 'Expenses',
            data: [14200, 16500, 15800, 17200, 16200, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: '#e63946',
            borderColor: '#e63946',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Revenue vs Expenses (2025)'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }
  
  // Finance Chart
  const financeElement = document.getElementById('financeChart');
  if (financeElement) {
    const financeCtx = financeElement.getContext('2d');
    const financeChart = new Chart(financeCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Revenue',
            data: [18500, 22000, 19800, 24500, 24500, 25200, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(67, 97, 238, 0.2)',
            borderColor: '#4361ee',
            borderWidth: 2,
            fill: true,
            tension: 0.3
          },
          {
            label: 'Expenses',
            data: [14200, 16500, 15800, 17200, 16200, 17300, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(230, 57, 70, 0.2)',
            borderColor: '#e63946',
            borderWidth: 2,
            fill: true,
            tension: 0.3
          },
          {
            label: 'Cash Flow',
            data: [4300, 5500, 4000, 7300, 8300, 7900, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(42, 157, 143, 0.2)',
            borderColor: '#2a9d8f',
            borderWidth: 2,
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Financial Overview (2025)'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }
}

// Function to initialize modals
function initializeModals() {
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modals = document.querySelectorAll('.modal');
  
  if (!modalBackdrop) return;
  
  // Generic function to open a modal
  window.openModal = function(modalId) {
    modalBackdrop.style.display = 'flex';
    document.getElementById(modalId).style.display = 'block';
  };
  
  // Generic function to close all modals
  window.closeAllModals = function() {
    modalBackdrop.style.display = 'none';
    modals.forEach(modal => {
      modal.style.display = 'none';
    });
  };
  
  // Close modal when clicking on backdrop
  modalBackdrop.addEventListener('click', function(e) {
    if (e.target === modalBackdrop) {
      closeAllModals();
    }
  });
  
  // Close buttons
  document.querySelectorAll('.modal-close, [id^="cancel-"][id$="-btn"]').forEach(button => {
    button.addEventListener('click', closeAllModals);
  });
  
  // Modal open buttons
  const modalButtons = {
    'add-event-btn': 'event-modal',
    'add-contact-btn': 'contact-modal',
    'create-invoice-btn': 'invoice-modal',
    'add-project-btn': 'project-modal',
    'add-task-btn': 'task-modal',
    'add-expense-btn': 'expense-modal',
    'generate-report-btn': 'report-modal'
  };
  
  // Set up modal open buttons
  for (const buttonId in modalButtons) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', function() {
        openModal(modalButtons[buttonId]);
      });
    }
  }
  
  // View Invoice
  document.querySelectorAll('.view-invoice-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      openModal('view-invoice-modal');
    });
  });
}

// Function to initialize form handlers
function initializeFormHandlers() {
  // Task Checkboxes
  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const taskTitle = this.parentElement.querySelector('.task-title');
      if (this.checked) {
        taskTitle.classList.add('completed');
      } else {
        taskTitle.classList.remove('completed');
      }
    });
  });
  
  // Invoice PDF Download
  const downloadInvoiceBtn = document.getElementById('download-invoice-btn');
  if (downloadInvoiceBtn && window.jspdf) {
    downloadInvoiceBtn.addEventListener('click', function() {
      // Using jsPDF to generate a PDF
      window.jspdf.jsPDF = window.jspdf.jsPDF;
      const { jsPDF } = window.jspdf;
      
      const doc = new jsPDF();
      doc.text('Invoice', 105, 20, { align: 'center' });
      doc.text('Your Business Name', 20, 30);
      doc.text('Invoice #: INV-1043', 20, 40);
      doc.text('Date: May 5, 2025', 20, 50);
      doc.text('Due Date: Jun 4, 2025', 20, 60);
      
      doc.text('Bill To:', 20, 80);
      doc.text('Acme Corp', 20, 90);
      doc.text('456 Client Blvd., Suite 789', 20, 100);
      doc.text('Client City, ST 98765', 20, 110);
      
      doc.text('Amount Due: $8,500.00', 150, 50, { align: 'right' });
      
      doc.save('invoice-1043.pdf');
    });
  }
  
  // User dropdown
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userDropdown = document.getElementById('user-dropdown');
  
  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function() {
      userDropdown.style.display = 'none';
    });
    
    // Prevent closing when clicking inside dropdown
    userDropdown.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  
  // Form submission handlers (prevent actual submission for demo)
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      closeAllModals();
      
      // Show a success message or update the relevant UI
      alert('Form submitted successfully!');
    });
  });
  
  // Save buttons for modals
  document.querySelectorAll('[id^="save-"][id$="-btn"]').forEach(button => {
    button.addEventListener('click', function() {
      const formId = this.id.replace('save-', '').replace('-btn', '-form');
      const form = document.getElementById(formId);
      
      if (form) {
        // Trigger form submission
        const submitEvent = new Event('submit', {
          'bubbles': true,
          'cancelable': true
        });
        form.dispatchEvent(submitEvent);
      } else {
        closeAllModals();
      }
    });
  });
  
  // Custom Report Options
  const reportTypeSelect = document.getElementById('report-type');
  const customReportOptions = document.getElementById('custom-report-options');
  
  if (reportTypeSelect && customReportOptions) {
    reportTypeSelect.addEventListener('change', function() {
      customReportOptions.style.display = this.value === 'custom' ? 'block' : 'none';
    });
  }
}

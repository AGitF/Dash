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
  const pageTitle = document.getElementById('page-title');
  
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
      pageTitle.textContent = this.textContent.trim();
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

  // Fix for the "all" tabs - populate them with content from other tabs
  populateAllTabs();
}

// Function to populate "all" tabs with combined content from other tabs
function populateAllTabs() {
  // For all invoices tab
  const allInvoicesTab = document.getElementById('all-invoices-tab');
  if (allInvoicesTab) {
    const unpaidTab = document.getElementById('unpaid-tab');
    const paidTab = document.getElementById('paid-tab');
    
    if (unpaidTab && paidTab) {
      allInvoicesTab.innerHTML = '<div class="table-responsive"><table><thead><tr><th>Invoice #</th><th>Client</th><th>Issue Date</th><th>Due/Paid Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody id="all-invoices-table"></tbody></table></div>';
      
      const allInvoicesTable = document.getElementById('all-invoices-table');
      const unpaidRows = unpaidTab.querySelectorAll('tbody tr');
      const paidRows = paidTab.querySelectorAll('tbody tr');
      
      unpaidRows.forEach(row => {
        allInvoicesTable.appendChild(row.cloneNode(true));
      });
      
      paidRows.forEach(row => {
        allInvoicesTable.appendChild(row.cloneNode(true));
      });
      
      // Add event listeners to the cloned buttons
      initializeInvoiceButtons(allInvoicesTable);
    }
  }
  
  // For all projects tab
  const allProjectsTab = document.getElementById('all-projects-tab');
  if (allProjectsTab) {
    const activeProjectsTab = document.getElementById('active-projects-tab');
    const completedProjectsTab = document.getElementById('completed-projects-tab');
    
    if (activeProjectsTab && completedProjectsTab) {
      const activeProjects = activeProjectsTab.querySelectorAll('.project-card');
      const completedProjects = completedProjectsTab.querySelectorAll('.project-card');
      
      activeProjects.forEach(project => {
        allProjectsTab.appendChild(project.cloneNode(true));
      });
      
      completedProjects.forEach(project => {
        allProjectsTab.appendChild(project.cloneNode(true));
      });
    }
  }
}

// Initialize invoice buttons
function initializeInvoiceButtons(container) {
  if (!container) return;
  
  // View buttons
  container.querySelectorAll('.view-invoice-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const invoiceId = row.querySelector('td:first-child').textContent;
      const clientName = row.querySelector('td:nth-child(2)').textContent;
      const issueDate = row.querySelector('td:nth-child(3)').textContent;
      const dueDate = row.querySelector('td:nth-child(4)').textContent;
      const amount = row.querySelector('td:nth-child(5)').textContent;
      const status = row.querySelector('.badge').textContent;
      
      viewInvoice(invoiceId, clientName, issueDate, dueDate, amount, status);
    });
  });
  
  // Mark Paid buttons
  container.querySelectorAll('.btn-success').forEach(btn => {
    if (btn.textContent.trim() === 'Mark Paid') {
      btn.addEventListener('click', function() {
        const row = this.closest('tr');
        const invoiceId = row.querySelector('td:first-child').textContent;
        const amount = row.querySelector('td:nth-child(5)').textContent;
        
        openMarkPaidModal(invoiceId, amount);
      });
    }
  });
}

// Function to initialize calendar
function initializeCalendar() {
  const calendarMonth = document.getElementById('calendar-month');
  const calendarDays = document.getElementById('calendar-days');
  const prevMonthBtn = document.getElementById('prev-month-btn');
  const nextMonthBtn = document.getElementById('next-month-btn');
  const calendarDaysHeader = document.getElementById('calendar-days-header');
  
  if (!calendarMonth || !calendarDays || !calendarDaysHeader) return;
  
  // Update the calendar header to start with Monday
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  calendarDaysHeader.innerHTML = '';
  
  // Create the headers
  daysOfWeek.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-day-header';
    dayHeader.textContent = day;
    calendarDaysHeader.appendChild(dayHeader);
  });
  
  let currentDate = moment();
  
  function renderCalendar() {
    calendarMonth.textContent = currentDate.format('MMMM YYYY');
    
    // Clear previous days
    calendarDays.innerHTML = '';
    
    // Get the first day of the month and adjust for Monday start
    // moment.js: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const firstDay = moment(currentDate).startOf('month');
    const lastDay = moment(currentDate).endOf('month');
    
    // Calculate first day of week (if Sunday (0), change to 7 to make Monday first)
    let firstDayOfWeek = firstDay.day();
    if (firstDayOfWeek === 0) firstDayOfWeek = 7;
    
    // Adjust for Monday start (subtract 1)
    firstDayOfWeek = firstDayOfWeek - 1;
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day';
      calendarDays.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let i = 1; i <= lastDay.date(); i++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      dayElement.setAttribute('data-date', moment(currentDate).date(i).format('YYYY-MM-DD'));
      
      const dayNumber = document.createElement('div');
      dayNumber.className = 'calendar-day-number';
      dayNumber.textContent = i;
      dayElement.appendChild(dayNumber);
      
      // Example events (hardcoded for May 2025)
      if (currentDate.month() === 4 && currentDate.year() === 2025) { // May is month 4 (0-indexed)
        if (i === 10) {
          const event = document.createElement('div');
          event.className = 'calendar-event';
          event.setAttribute('data-event-id', 'event-1');
          event.textContent = 'Client Meeting - TechGiant';
          event.addEventListener('click', function(e) {
            e.stopPropagation();
            openEventDetails('event-1', 'Client Meeting - TechGiant', '2025-05-10', 'Meeting with TechGiant about the new project implementation.');
          });
          dayElement.appendChild(event);
        } else if (i >= 15 && i <= 20) {
          const event = document.createElement('div');
          event.className = 'calendar-event';
          event.setAttribute('data-event-id', 'event-2');
          event.style.backgroundColor = '#f9c74f';
          event.textContent = "Sarah's Vacation";
          event.addEventListener('click', function(e) {
            e.stopPropagation();
            openEventDetails('event-2', "Sarah's Vacation", '2025-05-15', 'Sarah is on vacation until May 20.');
          });
          dayElement.appendChild(event);
        } else if (i === 25) {
          const event = document.createElement('div');
          event.className = 'calendar-event';
          event.setAttribute('data-event-id', 'event-3');
          event.style.backgroundColor = '#e63946';
          event.textContent = 'Project Deadline';
          event.addEventListener('click', function(e) {
            e.stopPropagation();
            openEventDetails('event-3', 'Project Deadline', '2025-05-25', 'Website Redesign project is due today.');
          });
          dayElement.appendChild(event);
        }
      }
      
      // Add project deadlines from projects section
      const projects = getProjectDeadlines();
      const currentDateString = moment(currentDate).date(i).format('YYYY-MM-DD');
      
      projects.forEach(project => {
        if (project.deadline === currentDateString) {
          const event = document.createElement('div');
          event.className = 'calendar-event';
          event.style.backgroundColor = '#e63946';
          event.textContent = `Deadline: ${project.title}`;
          event.addEventListener('click', function(e) {
            e.stopPropagation();
            openEventDetails(`project-${project.id}`, `Deadline: ${project.title}`, project.deadline, project.description || 'Project deadline');
          });
          dayElement.appendChild(event);
        }
      });
      
      // Make day clickable to add event
      dayElement.addEventListener('click', function() {
        const date = this.getAttribute('data-date');
        document.getElementById('event-start-date').value = date;
        document.getElementById('event-end-date').value = date;
        openModal('event-modal');
      });
      
      calendarDays.appendChild(dayElement);
    }
    
    // Ensure the grid aligns properly by adjusting CSS
    const style = document.createElement('style');
    style.textContent = '#calendar-days, #calendar-days-header { grid-template-columns: repeat(7, 1fr); }';
    document.head.appendChild(style);
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

// Function to open event details modal
function openEventDetails(eventId, title, date, description) {
  // Create event details modal if it doesn't exist
  let eventDetailsModal = document.getElementById('event-details-modal');
  
  if (!eventDetailsModal) {
    eventDetailsModal = document.createElement('div');
    eventDetailsModal.id = 'event-details-modal';
    eventDetailsModal.className = 'modal';
    eventDetailsModal.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title" id="event-details-title">Event Details</h3>
        <button class="modal-close" id="close-event-details-modal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Date</label>
          <div id="event-details-date" class="form-control-static"></div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <div id="event-details-description" class="form-control-static"></div>
        </div>
        <div class="form-group">
          <label>Notes</label>
          <textarea id="event-details-notes" class="form-control" rows="3" placeholder="Add notes about this event..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="close-event-details-btn">Close</button>
        <button class="btn btn-primary" id="save-event-notes-btn">Save Notes</button>
      </div>
    `;
    
    document.getElementById('modal-backdrop').appendChild(eventDetailsModal);
    
    // Add event listeners for the new modal
    document.getElementById('close-event-details-modal').addEventListener('click', closeAllModals);
    document.getElementById('close-event-details-btn').addEventListener('click', closeAllModals);
    document.getElementById('save-event-notes-btn').addEventListener('click', function() {
      const eventId = eventDetailsModal.getAttribute('data-event-id');
      const notes = document.getElementById('event-details-notes').value;
      
      // In a real app, we would save this to a database
      // For now, just show a confirmation and close
      alert('Notes saved successfully!');
      closeAllModals();
    });
  }
  
  // Set modal content
  document.getElementById('event-details-title').textContent = title;
  document.getElementById('event-details-date').textContent = moment(date).format('dddd, MMMM D, YYYY');
  document.getElementById('event-details-description').textContent = description;
  
  // Load any existing notes (this would come from a database in a real app)
  document.getElementById('event-details-notes').value = '';
  
  // Store the event ID for reference
  eventDetailsModal.setAttribute('data-event-id', eventId);
  
  // Open the modal
  openModal('event-details-modal');
}

// Get project deadlines from the projects section
function getProjectDeadlines() {
  // First check if we have projects in session storage
  const storedProjects = sessionStorage.getItem('project-deadlines');
  if (storedProjects) {
    return JSON.parse(storedProjects);
  }
  
  // Otherwise return hardcoded project deadlines
  return [
    {
      id: 1,
      title: 'Website Redesign',
      deadline: '2025-06-15',
      description: 'Complete redesign of Acme Corp\'s corporate website'
    },
    {
      id: 2,
      title: 'CRM Implementation',
      deadline: '2025-07-20',
      description: 'Migration and setup of TechGiant\'s CRM system'
    },
    {
      id: 3,
      title: 'Content Creation',
      deadline: '2025-05-25',
      description: 'Marketing content for Global Solutions'
    }
  ];
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
    // First, ensure all other modals are closed to prevent overlap
    closeAllModals();
    
    // Display the backdrop
    modalBackdrop.style.display = 'flex';
    
    // Show specific modal
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
      
      // Special handling for specific modals
      if (modalId === 'invoice-modal') {
        initializeInvoiceModal();
      } else if (modalId === 'expense-modal') {
        initializeExpenseModal();
      } else if (modalId === 'project-modal') {
        initializeProjectModal();
      }
    }
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
  
  // Create expense modal if it doesn't exist
  createExpenseModal();
  
  // Create mark paid modal if it doesn't exist
  createMarkPaidModal();
  
  // Create view invoice modal if it doesn't exist
  createViewInvoiceModal();
  
  // View Invoice
  document.querySelectorAll('.view-invoice-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const invoiceId = row.querySelector('td:first-child').textContent;
      const clientName = row.querySelector('td:nth-child(2)').textContent;
      const issueDate = row.querySelector('td:nth-child(3)').textContent;
      const dueDate = row.querySelector('td:nth-child(4)').textContent;
      const amount = row.querySelector('td:nth-child(5)').textContent;
      const status = row.querySelector('.badge').textContent;
      
      viewInvoice(invoiceId, clientName, issueDate, dueDate, amount, status);
    });
  });
  
  // Mark Paid buttons
  document.querySelectorAll('.btn-success').forEach(btn => {
    if (btn.textContent.trim() === 'Mark Paid') {
      btn.addEventListener('click', function() {
        const row = this.closest('tr');
        const invoiceId = row.querySelector('td:first-child').textContent;
        const amount = row.querySelector('td:nth-child(5)').textContent;
        
        openMarkPaidModal(invoiceId, amount);
      });
    }
  });
}

// Function to create the expense modal
function createExpenseModal() {
  let expenseModal = document.getElementById('expense-modal');
  
  if (!expenseModal) {
    expenseModal = document.createElement('div');
    expenseModal.id = 'expense-modal';
    expenseModal.className = 'modal';
    expenseModal.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Add Expense</h3>
        <button class="modal-close" id="close-expense-modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="expense-form">
form-group">
            <label for="paid-notes">Notes</label>
            <textarea id="paid-notes" class="form-control" rows="2"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="cancel-mark-paid-btn">Cancel</button>
        <button class="btn btn-primary" id="confirm-mark-paid-btn">Confirm Payment</button>
      </div>
    `;
    
    document.getElementById('modal-backdrop').appendChild(markPaidModal);
    
    // Add event listeners
    document.getElementById('confirm-mark-paid-btn').addEventListener('click', confirmMarkPaid);
    document.getElementById('close-mark-paid-modal').addEventListener('click', closeAllModals);
    document.getElementById('cancel-mark-paid-btn').addEventListener('click', closeAllModals);
  }
}

// Function to create view invoice modal
function createViewInvoiceModal() {
  let viewInvoiceModal = document.getElementById('view-invoice-modal');
  
  if (!viewInvoiceModal) {
    viewInvoiceModal = document.createElement('div');
    viewInvoiceModal.id = 'view-invoice-modal';
    viewInvoiceModal.className = 'modal';
    viewInvoiceModal.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Invoice</h3>
        <button class="modal-close" id="close-view-invoice-modal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="invoice-preview">
          <div class="invoice-header">
            <div class="invoice-logo">Your Business Name</div>
            <div class="invoice-details">
              <div class="invoice-id">INV-1043</div>
              <div class="invoice-date">Date: May 5, 2025</div>
              <div class="invoice-date">Due: Jun 4, 2025</div>
            </div>
          </div>
          <div class="invoice-addresses">
            <div class="invoice-address">
              <h4>From</h4>
              <p>
                Your Business Name<br>
                123 Business Street<br>
                Suite 101<br>
                Anytown, ST 12345<br>
                contact@yourbusiness.com<br>
                +1 (555) 123-4567
              </p>
            </div>
            <div class="invoice-address">
              <h4>Bill To</h4>
              <p>
                Acme Corp<br>
                456 Client Blvd.<br>
                Suite 789<br>
                Client City, ST 98765<br>
                billing@acmecorp.com<br>
                +1 (555) 987-6543
              </p>
            </div>
          </div>
          <div class="invoice-items">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Website Redesign - Initial Payment</td>
                  <td>1</td>
                  <td>8,500.00</td>
                  <td>8,500.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="invoice-total">
            <div class="invoice-total-row">
              <span class="invoice-total-label">Subtotal</span>
              <span class="invoice-total-value">8,500.00</span>
            </div>
            <div class="invoice-total-row">
              <span class="invoice-total-label">Discount</span>
              <span class="invoice-total-value">0.00</span>
            </div>
            <div class="invoice-total-row">
              <span class="invoice-total-label">Tax (0%)</span>
              <span class="invoice-total-value">0.00</span>
            </div>
            <div class="invoice-total-row">
              <span class="invoice-total-label">Total</span>
              <span class="invoice-total-value invoice-total-amount">8,500.00</span>
            </div>
          </div>
          <div class="invoice-notes">
            <strong>Notes:</strong><br>
            Thank you for your business!
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="close-view-invoice-btn">Close</button>
        <button class="btn btn-primary" id="download-invoice-btn">Download PDF</button>
      </div>
    `;
    
    document.getElementById('modal-backdrop').appendChild(viewInvoiceModal);
    
    // Add event listeners
    document.getElementById('close-view-invoice-modal').addEventListener('click', closeAllModals);
    document.getElementById('close-view-invoice-btn').addEventListener('click', closeAllModals);
    
    // PDF Download
    const downloadInvoiceBtn = document.getElementById('download-invoice-btn');
    if (downloadInvoiceBtn && window.jspdf) {
      downloadInvoiceBtn.addEventListener('click', generateInvoicePDF);
    }
  }
}

// Function to add a new expense
function addNewExpense() {
  const expenseDate = document.getElementById('expense-date').value;
  const expenseCategory = document.getElementById('expense-category').value;
  const expenseVendor = document.getElementById('expense-vendor').value;
  const expenseDescription = document.getElementById('expense-description').value;
  const expenseAmount = document.getElementById('expense-amount').value;
  const expenseStatus = document.getElementById('expense-status').value;
  
  // Validate form
  if (!expenseDate || !expenseCategory || !expenseVendor || !expenseDescription || !expenseAmount) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Get the expenses table
  const expensesTable = document.getElementById('expenses-table');
  if (!expensesTable) return;
  
  // Create a new row
  const newRow = document.createElement('tr');
  
  // Determine badge class based on status
  let badgeClass = 'badge-success';
  if (expenseStatus === 'pending') badgeClass = 'badge-warning';
  
  // Format the amount
  const formattedAmount = 'form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="invoice-amount">Invoice Amount</label>
                <input type="text" id="invoice-amount" class="form-control" readonly>
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="paid-amount">Amount Paid</label>
                <input type="number" id="paid-amount" class="form-control" step="0.01" min="0.01" required>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="expense-date">Date</label>
                <input type="date" id="expense-date" class="form-control" required value="${moment().format('YYYY-MM-DD')}">
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="expense-category">Category</label>
                <select id="expense-category" class="form-control" required>
                  <option value="">Select category</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Software">Software</option>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Travel">Travel</option>
                  <option value="Meals">Meals</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="expense-vendor">Vendor</label>
                <input type="text" id="expense-vendor" class="form-control" required>
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="expense-amount">Amount</label>
                <input type="number" id="expense-amount" class="form-control" step="0.01" min="0.01" required>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="expense-description">Description</label>
            <textarea id="expense-description" class="form-control" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label for="expense-status">Status</label>
            <select id="expense-status" class="form-control">
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div class="form-group">
            <label for="expense-receipt">Attach Receipt</label>
            <div class="file-input-container">
              <button type="button" class="btn btn-secondary">Choose File</button>
              <input type="file" id="expense-receipt" class="file-input">
            </div>
            <small class="form-text text-muted">Maximum file size: 5MB</small>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="cancel-expense-btn">Cancel</button>
        <button class="btn btn-primary" id="save-expense-btn">Save Expense</button>
      </div>
    `;
    
    document.getElementById('modal-backdrop').appendChild(expenseModal);
    
    // Add event listeners
    document.getElementById('save-expense-btn').addEventListener('click', addNewExpense);
    document.getElementById('close-expense-modal').addEventListener('click', closeAllModals);
    document.getElementById('cancel-expense-btn').addEventListener('click', closeAllModals);
  }
}

// Function to create the mark paid modal
function createMarkPaidModal() {
  let markPaidModal = document.getElementById('mark-paid-modal');
  
  if (!markPaidModal) {
    markPaidModal = document.createElement('div');
    markPaidModal.id = 'mark-paid-modal';
    markPaidModal.className = 'modal';
    markPaidModal.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Mark Invoice as Paid</h3>
        <button class="modal-close" id="close-mark-paid-modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="mark-paid-form">
          <div class="form-group">
            <label for="paid-invoice-id">Invoice #</label>
            <input type="text" id="paid-invoice-id" class="form-control" readonly>
          </div>
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="paid-date">Payment Date</label>
                <input type="date" id="paid-date" class="form-control" required value="${moment().format('YYYY-MM-DD')}">
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="paid-method">Payment Method</label>
                <select id="paid-method" class="form-control" required>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <div class=" + parseFloat(expenseAmount).toFixed(2);
  
  // Add the HTML for the new row
  newRow.innerHTML = `
    <td>${moment(expenseDate).format('MMM D, YYYY')}</td>
    <td>${expenseCategory}</td>
    <td>${expenseVendor}</td>
    <td>${expenseDescription}</td>
    <td>${formattedAmount}</td>
    <td><span class="badge ${badgeClass}">${expenseStatus === 'paid' ? 'Paid' : 'Pending'}</span></td>
    <td>
      <div class="table-actions">
        <button class="btn btn-secondary btn-sm">Edit</button>
      </div>
    </td>
  `;
  
  // Add the new row to the table - prepend to show newest first
  expensesTable.insertBefore(newRow, expensesTable.firstChild);
  
  // Close modal
  closeAllModals();
  
  // Show success message
  alert('Expense added successfully!');
}

// Function to open Mark Paid modal
function openMarkPaidModal(invoiceId, amount) {
  const modal = document.getElementById('mark-paid-modal');
  if (!modal) return;
  
  // Populate the form
  document.getElementById('paid-invoice-id').value = invoiceId;
  document.getElementById('invoice-amount').value = amount;
  document.getElementById('paid-amount').value = amount.replace('form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="invoice-amount">Invoice Amount</label>
                <input type="text" id="invoice-amount" class="form-control" readonly>
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="paid-amount">Amount Paid</label>
                <input type="number" id="paid-amount" class="form-control" step="0.01" min="0.01" required>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="expense-date">Date</label>
                <input type="date" id="expense-date" class="form-control" required value="${moment().format('YYYY-MM-DD')}">
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="expense-category">Category</label>
                <select id="expense-category" class="form-control" required>
                  <option value="">Select category</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Software">Software</option>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Travel">Travel</option>
                  <option value="Meals">Meals</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="expense-vendor">Vendor</label>
                <input type="text" id="expense-vendor" class="form-control" required>
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="expense-amount">Amount</label>
                <input type="number" id="expense-amount" class="form-control" step="0.01" min="0.01" required>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="expense-description">Description</label>
            <textarea id="expense-description" class="form-control" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label for="expense-status">Status</label>
            <select id="expense-status" class="form-control">
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div class="form-group">
            <label for="expense-receipt">Attach Receipt</label>
            <div class="file-input-container">
              <button type="button" class="btn btn-secondary">Choose File</button>
              <input type="file" id="expense-receipt" class="file-input">
            </div>
            <small class="form-text text-muted">Maximum file size: 5MB</small>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="cancel-expense-btn">Cancel</button>
        <button class="btn btn-primary" id="save-expense-btn">Save Expense</button>
      </div>
    `;
    
    document.getElementById('modal-backdrop').appendChild(expenseModal);
    
    // Add event listeners
    document.getElementById('save-expense-btn').addEventListener('click', addNewExpense);
    document.getElementById('close-expense-modal').addEventListener('click', closeAllModals);
    document.getElementById('cancel-expense-btn').addEventListener('click', closeAllModals);
  }
}

// Function to create the mark paid modal
function createMarkPaidModal() {
  let markPaidModal = document.getElementById('mark-paid-modal');
  
  if (!markPaidModal) {
    markPaidModal = document.createElement('div');
    markPaidModal.id = 'mark-paid-modal';
    markPaidModal.className = 'modal';
    markPaidModal.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Mark Invoice as Paid</h3>
        <button class="modal-close" id="close-mark-paid-modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="mark-paid-form">
          <div class="form-group">
            <label for="paid-invoice-id">Invoice #</label>
            <input type="text" id="paid-invoice-id" class="form-control" readonly>
          </div>
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="paid-date">Payment Date</label>
                <input type="date" id="paid-date" class="form-control" required value="${moment().format('YYYY-MM-DD')}">
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="paid-method">Payment Method</label>
                <select id="paid-method" class="form-control" required>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <div class=", '').replace(',', '');
  
  // Open the modal
  openModal('mark-paid-modal');
}

// Function to confirm marking invoice as paid
function confirmMarkPaid() {
  const invoiceId = document.getElementById('paid-invoice-id').value;
  const paidAmount = document.getElementById('paid-amount').value;
  const paidDate = document.getElementById('paid-date').value;
  const paidMethod = document.getElementById('paid-method').value;
  
  // Validate form
  if (!paidAmount || !paidDate || !paidMethod) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Find invoice in tables
  const tables = ['unpaid-tab', 'all-invoices-tab'];
  let invoiceFound = false;
  
  tables.forEach(tableId => {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const rowInvoiceId = row.querySelector('td:first-child').textContent;
      if (rowInvoiceId === invoiceId) {
        invoiceFound = true;
        
        // Update the row to show paid status
        row.querySelector('.badge').className = 'badge badge-success';
        row.querySelector('.badge').textContent = 'Paid';
        
        // Update the date column to paid date
        const dateCol = row.querySelector('td:nth-child(4)');
        dateCol.textContent = moment(paidDate).format('MMM D, YYYY');
        
        // Update the actions column
        const actionsCol = row.querySelector('td:last-child');
        actionsCol.innerHTML = `
          <div class="table-actions">
            <button class="btn btn-secondary btn-sm view-invoice-btn">View</button>
          </div>
        `;
        
        // Add event listener to the new view button
        const viewBtn = actionsCol.querySelector('.view-invoice-btn');
        viewBtn.addEventListener('click', function() {
          const clientName = row.querySelector('td:nth-child(2)').textContent;
          const issueDate = row.querySelector('td:nth-child(3)').textContent;
          const dueDate = moment(paidDate).format('MMM D, YYYY');
          const amount = row.querySelector('td:nth-child(5)').textContent;
          
          viewInvoice(invoiceId, clientName, issueDate, dueDate, amount, 'Paid');
        });
        
        // If this is in the unpaid tab, we should move it to the paid tab
        if (tableId === 'unpaid-tab') {
          const paidTab = document.getElementById('paid-tab');
          if (paidTab) {
            const paidTable = paidTab.querySelector('tbody');
            if (paidTable) {
              // Clone the row and update the date column header
              const clonedRow = row.cloneNode(true);
              const dateHeader = clonedRow.querySelector('td:nth-child(4)');
              dateHeader.textContent = moment(paidDate).format('MMM D, YYYY');
              
              // Add event listener to the cloned view button
              const clonedViewBtn = clonedRow.querySelector('.view-invoice-btn');
              clonedViewBtn.addEventListener('click', function() {
                const clientName = clonedRow.querySelector('td:nth-child(2)').textContent;
                const issueDate = clonedRow.querySelector('td:nth-child(3)').textContent;
                const dueDate = moment(paidDate).format('MMM D, YYYY');
                const amount = clonedRow.querySelector('td:nth-child(5)').textContent;
                
                viewInvoice(invoiceId, clientName, issueDate, dueDate, amount, 'Paid');
              });
              
              // Add to paid table
              paidTable.appendChild(clonedRow);
              
              // Remove from unpaid table
              row.remove();
            }
          }
        }
      }
    });
  });
  
  if (!invoiceFound) {
    alert('Invoice not found.');
    return;
  }
  
  // Close modal
  closeAllModals();
  
  // Show success message
  alert('Invoice marked as paid successfully!');
}

// Function to view invoice details
function viewInvoice(invoiceId, clientName, issueDate, dueDate, amount, status) {
  const modal = document.getElementById('view-invoice-modal');
  if (!modal) return;
  
  // Update invoice details
  modal.querySelector('.invoice-id').textContent = invoiceId;
  modal.querySelector('.invoice-date:nth-of-type(2)').textContent = `Date: ${issueDate}`;
  modal.querySelector('.invoice-date:nth-of-type(3)').textContent = `Due: ${dueDate}`;
  
  // Update client info in the "Bill To" section
  const billToAddress = modal.querySelector('.invoice-address:nth-of-type(2) p');
  
  // Determine client address based on name
  let clientAddress = '';
  if (clientName.includes('Acme')) {
    clientAddress = `Acme Corp<br>
      456 Client Blvd.<br>
      Suite 789<br>
      Client City, ST 98765<br>
      billing@acmecorp.com<br>
      +1 (555) 987-6543`;
  } else if (clientName.includes('TechGiant')) {
    clientAddress = `TechGiant Inc<br>
      789 Tech Park<br>
      Building A<br>
      Silicon Valley, CA 94025<br>
      ap@techgiant.com<br>
      +1 (555) 456-7890`;
  } else if (clientName.includes('Global')) {
    clientAddress = `Global Solutions Ltd<br>
      123 International Plaza<br>
      15th Floor<br>
      New York, NY 10001<br>
      finance@globalsolutions.com<br>
      +1 (555) 123-4567`;
  } else {
    clientAddress = `${clientName}<br>
      Client Address Line 1<br>
      Client Address Line 2<br>
      City, State ZIP<br>
      email@client.com<br>
      +1 (555) 000-0000`;
  }
  
  billToAddress.innerHTML = clientAddress;
  
  // Set the invoice amount
  const amountValue = parseFloat(amount.replace('form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="invoice-amount">Invoice Amount</label>
                <input type="text" id="invoice-amount" class="form-control" readonly>
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="paid-amount">Amount Paid</label>
                <input type="number" id="paid-amount" class="form-control" step="0.01" min="0.01" required>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="expense-date">Date</label>
                <input type="date" id="expense-date" class="form-control" required value="${moment().format('YYYY-MM-DD')}">
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="expense-category">Category</label>
                <select id="expense-category" class="form-control" required>
                  <option value="">Select category</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Software">Software</option>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Travel">Travel</option>
                  <option value="Meals">Meals</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="expense-vendor">Vendor</label>
                <input type="text" id="expense-vendor" class="form-control" required>
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="expense-amount">Amount</label>
                <input type="number" id="expense-amount" class="form-control" step="0.01" min="0.01" required>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="expense-description">Description</label>
            <textarea id="expense-description" class="form-control" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label for="expense-status">Status</label>
            <select id="expense-status" class="form-control">
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div class="form-group">
            <label for="expense-receipt">Attach Receipt</label>
            <div class="file-input-container">
              <button type="button" class="btn btn-secondary">Choose File</button>
              <input type="file" id="expense-receipt" class="file-input">
            </div>
            <small class="form-text text-muted">Maximum file size: 5MB</small>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="cancel-expense-btn">Cancel</button>
        <button class="btn btn-primary" id="save-expense-btn">Save Expense</button>
      </div>
    `;
    
    document.getElementById('modal-backdrop').appendChild(expenseModal);
    
    // Add event listeners
    document.getElementById('save-expense-btn').addEventListener('click', addNewExpense);
    document.getElementById('close-expense-modal').addEventListener('click', closeAllModals);
    document.getElementById('cancel-expense-btn').addEventListener('click', closeAllModals);
  }
}

// Function to create the mark paid modal
function createMarkPaidModal() {
  let markPaidModal = document.getElementById('mark-paid-modal');
  
  if (!markPaidModal) {
    markPaidModal = document.createElement('div');
    markPaidModal.id = 'mark-paid-modal';
    markPaidModal.className = 'modal';
    markPaidModal.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Mark Invoice as Paid</h3>
        <button class="modal-close" id="close-mark-paid-modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="mark-paid-form">
          <div class="form-group">
            <label for="paid-invoice-id">Invoice #</label>
            <input type="text" id="paid-invoice-id" class="form-control" readonly>
          </div>
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="paid-date">Payment Date</label>
                <input type="date" id="paid-date" class="form-control" required value="${moment().format('YYYY-MM-DD')}">
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="paid-method">Payment Method</label>
                <select id="paid-method" class="form-control" required>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <div class=", '').replace(',', ''));
  const invoiceItems = modal.querySelector('.invoice-items tbody');
  invoiceItems.innerHTML = '';
  
  // Determine the item based on the client
  let itemDescription = 'Professional Services';
  if (clientName.includes('Acme')) {
    itemDescription = 'Website Redesign - Initial Payment';
  } else if (clientName.includes('TechGiant')) {
    itemDescription = 'CRM Implementation - Milestone 1';
  } else if (clientName.includes('Global')) {
    itemDescription = 'Marketing Content Creation';
  }
  
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${itemDescription}</td>
    <td>1</td>
    <td>${amountValue.toFixed(2)}</td>
    <td>${amountValue.toFixed(2)}</td>
  `;
  
  invoiceItems.appendChild(row);
  
  // Update totals
  const totalRows = modal.querySelectorAll('.invoice-total-row');
  if (totalRows.length >= 4) {
    totalRows[0].querySelector('.invoice-total-value').textContent = amountValue.toFixed(2);
    totalRows[3].querySelector('.invoice-total-value').textContent = amountValue.toFixed(2);
  }
  
  // Open the modal
  openModal('view-invoice-modal');
}

// Function to generate invoice PDF
function generateInvoicePDF() {
  const { jsPDF } = window.jspdf;
  
  if (!jsPDF) {
    alert('PDF generation library not loaded. Please try again later.');
    return;
  }
  
  try {
    const doc = new jsPDF();
    const modal = document.getElementById('view-invoice-modal');
    const invoiceId = modal.querySelector('.invoice-id').textContent;
    
    // Basic information
    doc.setFontSize(18);
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Your Business Name', 20, 30);
    doc.text('123 Business Street, Suite 101', 20, 35);
    doc.text('Anytown, ST 12345', 20, 40);
    doc.text('contact@yourbusiness.com', 20, 45);
    doc.text('+1 (555) 123-4567', 20, 50);
    
    // Invoice details
    doc.setFontSize(14);
    doc.text(`Invoice #: ${invoiceId}`, 140, 30, { align: 'right' });
    
    const issueDate = modal.querySelector('.invoice-date:nth-of-type(2)').textContent.replace('Date: ', '');
    const dueDate = modal.querySelector('.invoice-date:nth-of-type(3)').textContent.replace('Due: ', '');
    
    doc.setFontSize(12);
    doc.text(`Date: ${issueDate}`, 140, 40, { align: 'right' });
    doc.text(`Due Date: ${dueDate}`, 140, 45, { align: 'right' });
    
    // Client info
    doc.setFontSize(14);
    doc.text('Bill To:', 20, 70);
    
    const clientInfo = modal.querySelector('.invoice-address:nth-of-type(2) p').innerHTML;
    const clientLines = clientInfo.split('<br>');
    
    doc.setFontSize(12);
    let yPos = 80;
    clientLines.forEach(line => {
      doc.text(line.trim(), 20, yPos);
      yPos += 5;
    });
    
    // Items
    doc.setFontSize(14);
    doc.text('Invoice Items', 20, 120);
    
    doc.setFontSize(12);
    doc.text('Description', 20, 130);
    doc.text('Qty', 120, 130);
    doc.text('Price', 140, 130);
    doc.text('Amount', 170, 130);
    
    // Draw a line
    doc.line(20, 133, 190, 133);
    
    // Item details
    const items = modal.querySelectorAll('.invoice-items tbody tr');
    let itemY = 140;
    
    items.forEach(item => {
      const description = item.querySelector('td:nth-child(1)').textContent;
      const quantity = item.querySelector('td:nth-child(2)').textContent;
      const unitPrice = item.querySelector('td:nth-child(3)').textContent;
      const amount = item.querySelector('td:nth-child(4)').textContent;
      
      doc.text(description, 20, itemY);
      doc.text(quantity, 120, itemY);
      doc.text(unitPrice, 140, itemY);
      doc.text(amount, 170, itemY);
      
      itemY += 10;
    });
    
    // Totals
    const totalRows = modal.querySelectorAll('.invoice-total-row');
    let totalY = itemY + 10;
    
    totalRows.forEach(row => {
      const label = row.querySelector('.invoice-total-label').textContent;
      const value = row.querySelector('.invoice-total-value').textContent;
      
      doc.text(label, 140, totalY);
      doc.text(value, 170, totalY);
      
      totalY += 10;
    });
    
    // Draw a line for total
    doc.line(140, totalY - 15, 190, totalY - 15);
    
    // Notes
    const notes = modal.querySelector('.invoice-notes').textContent;
    doc.setFontSize(11);
    doc.text(notes, 20, totalY + 10);
    
    // Save the PDF
    doc.save(`${invoiceId}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('There was an error generating the PDF. Please try again.');
  }
}

// Initialize invoice modal
function initializeInvoiceModal() {
  // Set current date as default
  const today = moment().format('YYYY-MM-DD');
  const dueDate = moment().add(30, 'days').format('YYYY-MM-DD');
  
  const issueDateInput = document.getElementById('invoice-date');
  const dueDateInput = document.getElementById('invoice-due-date');
  
  if (issueDateInput && !issueDateInput.value) {
    issueDateInput.value = today;
  }
  
  if (dueDateInput && !dueDateInput.value) {
    dueDateInput.value = dueDate;
  }
  
  // Check if invoice items already exist
  const itemsBody = document.getElementById('invoice-items-body');
  
  // If not, create the invoice items table
  if (!itemsBody) {
    const modalBody = document.querySelector('#invoice-modal .modal-body');
    
    // Create invoice items section
    const itemsSection = document.createElement('div');
    itemsSection.className = 'invoice-items-section';
    itemsSection.innerHTML = `
      <h4>Invoice Items</h4>
      <div class="table-responsive">
        <table class="invoice-items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="invoice-items-body">
            <tr class="invoice-item">
              <td><input type="text" class="form-control item-description" placeholder="Description"></td>
              <td><input type="number" class="form-control item-quantity" value="1" min="1"></td>
              <td><input type="number" class="form-control item-rate" value="0.00" step="0.01"></td>
              <td><span class="item-amount">$0.00</span></td>
              <td><button type="button" class="btn btn-danger btn-sm remove-item">&times;</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button type="button" class="btn btn-secondary" id="add-invoice-item">Add Item</button>
      
      <div class="invoice-summary">
        <div class="form-row">
          <div class="form-col">
            <div class="form-group">
              <label for="invoice-vat-option">VAT Option</label>
              <select id="invoice-vat-option" class="form-control">
                <option value="no">No VAT</option>
                <option value="yes">Apply VAT</option>
              </select>
            </div>
          </div>
          <div class="form-col">
            <div class="form-group">
              <label for="invoice-tax">VAT Rate (%)</label>
              <input type="number" id="invoice-tax" class="form-control" value="0" min="0" max="100" step="0.01" disabled>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <div class="form-group">
              <label for="invoice-subtotal">Subtotal</label>
              <input type="text" id="invoice-subtotal" class="form-control" value="0.00" readonly>
            </div>
          </div>
          <div class="form-col">
            <div class="form-group">
              <label for="invoice-tax-amount">VAT Amount</label>
              <input type="text" id="invoice-tax-amount" class="form-control" value="0.00" readonly>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="invoice-total">Total</label>
          <input type="text" id="invoice-total" class="form-control" value="0.00" readonly>
        </div>
      </div>
    `;
    
    modalBody.querySelector('form').appendChild(itemsSection);
    
    // Set up invoice item events
    setupInvoiceItemHandlers();
  }
}

// Initialize expense modal
function initializeExpenseModal() {
  // Nothing special needs to be done here, as the modal is created dynamically
}

// Initialize project modal
function initializeProjectModal() {
  // Check if the modal exists
  let projectModal = document.getElementById('project-modal');
  
  if (!projectModal) {
    projectModal = document.createElement('div');
    projectModal.id = 'project-modal';
    projectModal.className = 'modal';
    projectModal.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Add Project</h3>
        <button class="modal-close" id="close-project-modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="project-form">
          <div class="form-group">
            <label for="project-title">Project Title</label>
            <input type="text" id="project-title" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="project-client">Client</label>
            <select id="project-client" class="form-control" required>
              <option value="">Select a client</option>
              <option value="acme">Acme Corp</option>
              <option value="techgiant">TechGiant Inc</option>
              <option value="globalsolutions">Global Solutions Ltd</option>
              <option value="new_customer">+ Add New Customer</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="project-deadline">Deadline</label>
                <input type="date" id="project-deadline" class="form-control" required>
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="project-status">Status</label>
                <select id="project-status" class="form-control" required>
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="project-description">Description</label>
            <textarea id="project-description" class="form-control" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label for="project-budget">Budget</label>
            <input type="number" id="project-budget" class="form-control" step="0.01" min="0">
          </div>
          <div class="form-group">
            <label>Assign Team Members</label>
            <div>
              <div style="margin-bottom: 8px;">
                <input type="checkbox" id="assign-jd" checked>
                <label for="assign-jd">John Doe (JD)</label>
              </div>
              <div style="margin-bottom: 8px;">
                <input type="checkbox" id="assign-as">
                <label for="assign-as">Amanda Smith (AS)</label>
              </div>
              <div style="margin-bottom: 8px;">
                <input type="checkbox" id="assign-mk">
                <label for="assign-mk">Mike Kelly (MK)</label>
              </div>
              <div style="margin-bottom: 8px;">
                <input type="checkbox" id="assign-rw">
                <label for="assign-rw">Rachel Williams (RW)</label>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="cancel-project-btn">Cancel</button>
        <button class="btn btn-primary" id="save-project-btn">Save Project</button>
      </div>
    `;
    
    document.getElementById('modal-backdrop').appendChild(projectModal);
    
    // Add event listeners
    document.getElementById('close-project-modal').addEventListener('click', closeAllModals);
    document.getElementById('cancel-project-btn').addEventListener('click', closeAllModals);
    document.getElementById('save-project-btn').addEventListener('click', addNewProject);
    
    // Client selection
    document.getElementById('project-client').addEventListener('change', function() {
      if (this.value === 'new_customer') {
        // Save current state before switching
        sessionStorage.setItem('projectFormState', true);
        
        // Open the add contact modal
        openModal('contact-modal');
        
        // Reset the select back to empty
        this.value = '';
      }
    });
    
    // Set default deadline to two weeks from now
    document.getElementById('project-deadline').value = moment().add(2, 'weeks').format('YYYY-MM-DD');
  }
}form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="invoice-amount">Invoice Amount</label>
                <input type="text" id="invoice-amount" class="form-control" readonly>
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="paid-amount">Amount Paid</label>
                <input type="number" id="paid-amount" class="form-control" step="0.01" min="0.01" required>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="expense-date">Date</label>
                <input type="date" id="expense-date" class="form-control" required value="${moment().format('YYYY-MM-DD')}">
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="expense-category">Category</label>
                <select id="expense-category" class="form-control" required>
                  <option value="">Select category</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Software">Software</option>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Travel">Travel</option>
                  <option value="Meals">Meals</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="expense-vendor">Vendor</label>
                <input type="text" id="expense-vendor" class="form-control" required>
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="expense-amount">Amount</label>
                <input type="number" id="expense-amount" class="form-control" step="0.01" min="0.01" required>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="expense-description">Description</label>
            <textarea id="expense-description" class="form-control" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label for="expense-status">Status</label>
            <select id="expense-status" class="form-control">
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div class="form-group">
            <label for="expense-receipt">Attach Receipt</label>
            <div class="file-input-container">
              <button type="button" class="btn btn-secondary">Choose File</button>
              <input type="file" id="expense-receipt" class="file-input">
            </div>
            <small class="form-text text-muted">Maximum file size: 5MB</small>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="cancel-expense-btn">Cancel</button>
        <button class="btn btn-primary" id="save-expense-btn">Save Expense</button>
      </div>
    `;
    
    document.getElementById('modal-backdrop').appendChild(expenseModal);
    
    // Add event listeners
    document.getElementById('save-expense-btn').addEventListener('click', addNewExpense);
    document.getElementById('close-expense-modal').addEventListener('click', closeAllModals);
    document.getElementById('cancel-expense-btn').addEventListener('click', closeAllModals);
  }
}

// Function to create the mark paid modal
function createMarkPaidModal() {
  let markPaidModal = document.getElementById('mark-paid-modal');
  
  if (!markPaidModal) {
    markPaidModal = document.createElement('div');
    markPaidModal.id = 'mark-paid-modal';
    markPaidModal.className = 'modal';
    markPaidModal.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Mark Invoice as Paid</h3>
        <button class="modal-close" id="close-mark-paid-modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="mark-paid-form">
          <div class="form-group">
            <label for="paid-invoice-id">Invoice #</label>
            <input type="text" id="paid-invoice-id" class="form-control" readonly>
          </div>
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="paid-date">Payment Date</label>
                <input type="date" id="paid-date" class="form-control" required value="${moment().format('YYYY-MM-DD')}">
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="paid-method">Payment Method</label>
                <select id="paid-method" class="form-control" required>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <div class="
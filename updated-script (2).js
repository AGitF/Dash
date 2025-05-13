// Fix for any remaining # links
function fixHashtagLinks() {
  // Find any remaining # links that might not have been fixed
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.setAttribute('href', 'javascript:void(0);');
    
    // Add event listener to prevent default
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  });
  
  // Fix buttons in tables
  document.querySelectorAll('.table-actions button').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Table action button clicked:', this.textContent.trim());
      
      // Handle specific button actions based on text
      const btnText = this.textContent.trim();
      if (btnText === 'View' || btnText === 'Edit' || btnText === 'Delete' ||
          btnText === 'Mark Paid' || btnText === 'Send Reminder' ||
          btnText === 'Complete' || btnText === 'Pay') {
        console.log('Action:', btnText);
      }
      
      return false;
    });
  });
}

// Call this after DOM is loaded to catch any missed links
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit to ensure all other handlers are set up
  setTimeout(fixHashtagLinks, 100);
});// Small Business Dashboard - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing dashboard...');
  
  // Prevent all # links from changing the URL
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Prevented default link behavior');
    });
  });
  
  // Prevent all button default behaviors
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Prevented default button behavior');
    });
  });
  
  // Prevent all form submissions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Prevented default form submission');
    });
  });
  
  // Initialize all components
  initializeSidebar();
  initializeTabs();
  initializeCalendar();
  initializeCharts();
  initializeModals();
  initializeFormHandlers();
  
  // Show the dashboard page by default
  showPage('dashboard-page');
  
  console.log('Dashboard initialization complete');
});

// Function to initialize sidebar navigation
function initializeSidebar() {
  const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
  const pageTitle = document.getElementById('page-title');
  
  sidebarLinks.forEach(link => {
    // Remove any existing event listeners to avoid duplication
    const clonedLink = link.cloneNode(true);
    link.parentNode.replaceChild(clonedLink, link);
    
    clonedLink.addEventListener('click', function(e) {
      // Explicitly prevent default behavior
      e.preventDefault();
      e.stopPropagation();
      
      const targetPage = this.getAttribute('data-page');
      console.log('Sidebar link clicked for page:', targetPage);
      
      // Update active link
      sidebarLinks.forEach(item => item.classList.remove('active'));
      this.classList.add('active');
      
      // Show the target page
      showPage(targetPage);
      
      // Update page title
      if (pageTitle) {
        pageTitle.textContent = this.textContent.trim();
      }
      
      // Prevent URL from changing
      return false;
    });
  });
}

// Function to show a specific page and hide others
function showPage(pageId) {
  console.log('Showing page:', pageId);
  
  const pageContents = document.querySelectorAll('.page-content');
  
  pageContents.forEach(page => {
    if (page.id === pageId) {
      page.style.display = 'block';
    } else {
      page.style.display = 'none';
    }
  });
  
  // Update sidebar active state
  const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
  sidebarLinks.forEach(link => {
    if (link.getAttribute('data-page') === pageId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Function to initialize tab functionality
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  
  tabButtons.forEach(button => {
    // Remove any existing event listeners to avoid duplication
    const clonedButton = button.cloneNode(true);
    button.parentNode.replaceChild(clonedButton, button);
    
    clonedButton.addEventListener('click', function(e) {
      // Explicitly prevent default behavior
      e.preventDefault();
      e.stopPropagation();
      
      const tabContainer = this.closest('.tab-container');
      const targetTab = this.getAttribute('data-tab');
      console.log('Tab button clicked:', targetTab);
      
      // Update active tab button
      tabContainer.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      
      // Show target tab content
      tabContainer.querySelectorAll('.tab-pane').forEach(pane => {
        if (pane.id === targetTab) {
          pane.classList.add('active');
          pane.style.display = 'block';
        } else {
          pane.classList.remove('active');
          pane.style.display = 'none';
        }
      });
      
      // Prevent URL from changing
      return false;
    });
  });

  // For all invoices tab - populate with content from other tabs
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
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
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
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const row = this.closest('tr');
        const invoiceId = row.querySelector('td:first-child').textContent;
        const amount = row.querySelector('td:nth-child(5)').textContent;
        
        openMarkPaidModal(invoiceId, amount);
      });
    }
  });
}

// Function to initialize charts
function initializeCharts() {
  // Revenue vs Expenses Chart
  const revenueExpensesChart = document.getElementById('revenueExpensesChart');
  if (revenueExpensesChart && window.Chart) {
    new Chart(revenueExpensesChart, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Revenue',
            data: [15000, 17200, 19800, 21500, 24500, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: '#4361ee',
            borderWidth: 0
          },
          {
            label: 'Expenses',
            data: [12400, 13800, 15200, 14900, 16200, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: '#e63946',
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': $' + context.raw.toLocaleString();
              }
            }
          }
        }
      }
    });
  }
  
  // Finance Chart
  const financeChart = document.getElementById('financeChart');
  if (financeChart && window.Chart) {
    new Chart(financeChart, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'Revenue',
            data: [15000, 17200, 19800, 21500, 24500],
            borderColor: '#4361ee',
            backgroundColor: 'rgba(67, 97, 238, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Expenses',
            data: [12400, 13800, 15200, 14900, 16200],
            borderColor: '#e63946',
            backgroundColor: 'rgba(230, 57, 70, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Profit',
            data: [2600, 3400, 4600, 6600, 8300],
            borderColor: '#2a9d8f',
            backgroundColor: 'rgba(42, 157, 143, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': $' + context.raw.toLocaleString();
              }
            }
          }
        }
      }
    });
  }
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
      dayElement.addEventListener('click', function(e) {
        e.preventDefault();
        const date = this.getAttribute('data-date');
        openEventModal(date);
      });
      
      calendarDays.appendChild(dayElement);
    }
  }
  
  // Initial calendar render
  renderCalendar();
  
  // Month navigation
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', function(e) {
      e.preventDefault();
      currentDate = moment(currentDate).subtract(1, 'month');
      renderCalendar();
    });
  }
  
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', function(e) {
      e.preventDefault();
      currentDate = moment(currentDate).add(1, 'month');
      renderCalendar();
    });
  }
  
  // Add Event button
  const addEventBtn = document.getElementById('add-event-btn');
  if (addEventBtn) {
    addEventBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openEventModal();
    });
  }
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

// Initialize modals
function initializeModals() {
  createModalBackdrop();
  
  // Button click handlers for modals
  document.getElementById('add-contact-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    openContactModal();
  });
  
  document.getElementById('create-invoice-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    openInvoiceModal();
  });
  
  document.getElementById('add-expense-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    openExpenseModal();
  });
  
  document.getElementById('add-project-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    openProjectModal();
  });
  
  // Close on backdrop click
  document.getElementById('modal-backdrop')?.addEventListener('click', function(e) {
    if (e.target === this) {
      closeAllModals();
    }
  });
}

// Create modal backdrop if it doesn't exist
function createModalBackdrop() {
  if (!document.getElementById('modal-backdrop')) {
    const backdrop = document.createElement('div');
    backdrop.id = 'modal-backdrop';
    backdrop.className = 'modal-backdrop';
    document.body.appendChild(backdrop);
  }
}

// Function to open a modal by ID
function openModal(modalId) {
  const backdrop = document.getElementById('modal-backdrop');
  const modal = document.getElementById(modalId);
  
  if (backdrop && modal) {
    backdrop.style.display = 'flex';
    modal.style.display = 'block';
  }
}

// Function to close all modals
function closeAllModals() {
  const backdrop = document.getElementById('modal-backdrop');
  const modals = document.querySelectorAll('.modal');
  
  if (backdrop) {
    backdrop.style.display = 'none';
  }
  
  modals.forEach(modal => {
    modal.style.display = 'none';
  });
}

// Open Contact Modal
function openContactModal() {
  let contactModal = document.getElementById('contact-modal');
  
  if (!contactModal) {
    contactModal = document.createElement('div');
    contactModal.id = 'contact-modal';
    contactModal.className = 'modal';
    contactModal.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Add Contact</h3>
        <button class="modal-close" id="close-contact-modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="contact-form">
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="contact-first-name">First Name</label>
                <input type="text" id="contact-first-name" class="form-control" required>
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="contact-last-name">Last Name</label>
                <input type="text" id="contact-last-name" class="form-control" required>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="contact-company">Company</label>
            <input type="text" id="contact-company" class="form-control">
          </div>
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="contact-email">Email</label>
                <input type="email" id="contact-email" class="form-control" required>
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="contact-phone">Phone</label>
                <input type="tel" id="contact-phone" class="form-control">
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="contact-status">Status</label>
            <select id="contact-status" class="form-control">
              <option value="lead">Lead</option>
              <option value="prospect">Prospect</option>
              <option value="customer">Customer</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div class="form-group">
            <label for="contact-notes">Notes</label>
            <textarea id="contact-notes" class="form-control" rows="3"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="cancel-contact-btn">Cancel</button>
        <button class="btn btn-primary" id="save-contact-btn">Save Contact</button>
      </div>
    `;
    
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.appendChild(contactModal);
      
      // Close button
      document.getElementById('close-contact-modal')?.addEventListener('click', function() {
        closeAllModals();
      });
      
      // Cancel button
      document.getElementById('cancel-contact-btn')?.addEventListener('click', function() {
        closeAllModals();
      });
      
      // Save button
      document.getElementById('save-contact-btn')?.addEventListener('click', function() {
        addNewContact();
      });
    }
  }
  
  openModal('contact-modal');
}

// Open Invoice Modal
function openInvoiceModal() {
  let invoiceModal = document.getElementById('invoice-modal');
  
  if (!invoiceModal) {
    invoiceModal = document.createElement('div');
    invoiceModal.id = 'invoice-modal';
    invoiceModal.className = 'modal';
    invoiceModal.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Create Invoice</h3>
        <button class="modal-close" id="close-invoice-modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="invoice-form">
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="invoice-number">Invoice #</label>
                <input type="text" id="invoice-number" class="form-control" value="INV-1044" required>
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="invoice-client">Client</label>
                <select id="invoice-client" class="form-control" required>
                  <option value="">Select a client</option>
                  <option value="acme">Acme Corp</option>
                  <option value="techgiant">TechGiant Inc</option>
                  <option value="globalsolutions">Global Solutions Ltd</option>
                  <option value="new_customer">+ Add New Customer</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="invoice-date">Issue Date</label>
                <input type="date" id="invoice-date" class="form-control" required>
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="invoice-due-date">Due Date</label>
                <input type="date" id="invoice-due-date" class="form-control" required>
              </div>
            </div>
          </div>
          <div class="invoice-items-section">
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
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="cancel-invoice-btn">Cancel</button>
        <button class="btn btn-primary" id="save-invoice-btn">Create Invoice</button>
      </div>
    `;
    
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.appendChild(invoiceModal);
      
      // Close button
      document.getElementById('close-invoice-modal')?.addEventListener('click', function() {
        closeAllModals();
      });
      
      // Cancel button
      document.getElementById('cancel-invoice-btn')?.addEventListener('click', function() {
        closeAllModals();
      });
      
      // Save button
      document.getElementById('save-invoice-btn')?.addEventListener('click', function() {
        if (createInvoicePreview()) {
          closeAllModals();
          openModal('view-invoice-modal');
        }
      });
      
      // Add item button
      document.getElementById('add-invoice-item')?.addEventListener('click', function() {
        addInvoiceItem();
      });
      
      // Client selection
      document.getElementById('invoice-client')?.addEventListener('change', function() {
        if (this.value === 'new_customer') {
          // Save current state
          sessionStorage.setItem('invoiceFormState', true);
          
          // Open the add contact modal
          openContactModal();
          
          // Reset the select
          this.value = '';
        }
      });
      
      // Initialize invoice calculation
      initializeInvoiceItems();
      
      // Set default dates
      const today = moment().format('YYYY-MM-DD');
      const dueDate = moment().add(30, 'days').format('YYYY-MM-DD');
      
      document.getElementById('invoice-date').value = today;
      document.getElementById('invoice-due-date').value = dueDate;
    }
  }
  
  openModal('invoice-modal');
}

// Initialize invoice items
function initializeInvoiceItems() {
  // Add event listeners to initial row
  const initialRow = document.querySelector('.invoice-item');
  if (initialRow) {
    addInvoiceItemEvents(initialRow);
  }
  
  // VAT Option change
  const vatOptionSelect = document.getElementById('invoice-vat-option');
  const vatRateInput = document.getElementById('invoice-tax');
  
  if (vatOptionSelect && vatRateInput) {
    vatOptionSelect.addEventListener('change', function() {
      vatRateInput.disabled = (this.value === 'no');
      if (this.value === 'yes') {
        vatRateInput.value = '20.00'; // Default VAT rate
      } else {
        vatRateInput.value = '0';
      }
      updateInvoiceTotals();
    });
  }
}

// Add a new invoice item row
function addInvoiceItem() {
  const itemsBody = document.getElementById('invoice-items-body');
  if (!itemsBody) return;
  
  const newItem = document.createElement('tr');
  newItem.className = 'invoice-item';
  newItem.innerHTML = `
    <td><input type="text" class="form-control item-description" placeholder="Description"></td>
    <td><input type="number" class="form-control item-quantity" value="1" min="1"></td>
    <td><input type="number" class="form-control item-rate" value="0.00" step="0.01"></td>
    <td><span class="item-amount">$0.00</span></td>
    <td><button type="button" class="btn btn-danger btn-sm remove-item">&times;</button></td>
  `;
  
  itemsBody.appendChild(newItem);
  
  // Add event listeners to new row
  addInvoiceItemEvents(newItem);
}

// Add events to invoice item row
function addInvoiceItemEvents(itemRow) {
  // Calculate amount when quantity or rate changes
  const quantityInput = itemRow.querySelector('.item-quantity');
  const rateInput = itemRow.querySelector('.item-rate');
  const amountSpan = itemRow.querySelector('.item-amount');
  
  function updateRowAmount() {
    const quantity = parseFloat(quantityInput.value) || 0;
    const rate = parseFloat(rateInput.value) || 0;
    const amount = quantity * rate;
    amountSpan.textContent = `${amount.toFixed(2)}`;
    
    // Update invoice totals
    updateInvoiceTotals();
  }
  
  quantityInput.addEventListener('input', updateRowAmount);
  rateInput.addEventListener('input', updateRowAmount);
  
  // Remove item button
  const removeBtn = itemRow.querySelector('.remove-item');
  if (removeBtn) {
    removeBtn.addEventListener('click', function() {
      // Don't remove if it's the only row
      const allRows = document.querySelectorAll('.invoice-item');
      if (allRows.length > 1) {
        itemRow.remove();
        updateInvoiceTotals();
      } else {
        // Clear values instead of removing
        quantityInput.value = 1;
        rateInput.value = 0;
        itemRow.querySelector('.item-description').value = '';
        updateRowAmount();
      }
    });
  }
}

// Update invoice totals
function updateInvoiceTotals() {
  const items = document.querySelectorAll('.invoice-item');
  const subtotalElem = document.getElementById('invoice-subtotal');
  const vatOptionElem = document.getElementById('invoice-vat-option');
  const taxRateElem = document.getElementById('invoice-tax');
  const taxAmountElem = document.getElementById('invoice-tax-amount');
  const totalElem = document.getElementById('invoice-total');
  
  if (!subtotalElem || !totalElem) return;
  
  let subtotal = 0;
  
  items.forEach(item => {
    const quantity = parseFloat(item.querySelector('.item-quantity')?.value) || 0;
    const rate = parseFloat(item.querySelector('.item-rate')?.value) || 0;
    subtotal += quantity * rate;
  });
  
  // Determine if VAT should be applied
  const applyVAT = vatOptionElem ? vatOptionElem.value === 'yes' : false;
  const taxRate = applyVAT && taxRateElem ? (parseFloat(taxRateElem.value) || 0) : 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  
  subtotalElem.value = subtotal.toFixed(2);
  
  if (taxAmountElem) {
    taxAmountElem.value = taxAmount.toFixed(2);
  }
  
  totalElem.value = total.toFixed(2);
  
  return { subtotal, taxRate, taxAmount, total };
}

// Open Expense Modal
function openExpenseModal() {
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
    
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.appendChild(expenseModal);
      
      // Close button
      document.getElementById('close-expense-modal')?.addEventListener('click', function() {
        closeAllModals();
      });
      
      // Cancel button
      document.getElementById('cancel-expense-btn')?.addEventListener('click', function() {
        closeAllModals();
      });
      
      // Save button
      document.getElementById('save-expense-btn')?.addEventListener('click', function() {
        addNewExpense();
      });
    }
  }
  
  openModal('expense-modal');
}

// Add a new expense
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
  const formattedAmount = ' + parseFloat(expenseAmount).toFixed(2);
  
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

// Open Project Modal
function openProjectModal() {
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
                <input type="date" id="project-deadline" class="form-control" required value="${moment().add(2, 'weeks').format('YYYY-MM-DD')}">
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
    
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.appendChild(projectModal);
      
      // Close button
      document.getElementById('close-project-modal')?.addEventListener('click', function() {
        closeAllModals();
      });
      
      // Cancel button
      document.getElementById('cancel-project-btn')?.addEventListener('click', function() {
        closeAllModals();
      });
      
      // Save button
      document.getElementById('save-project-btn')?.addEventListener('click', function() {
        addNewProject();
      });
      
      // Client selection
      document.getElementById('project-client')?.addEventListener('change', function() {
        if (this.value === 'new_customer') {
          // Save current state
          sessionStorage.setItem('projectFormState', true);
          
          // Open the add contact modal
          openContactModal();
          
          // Reset the select
          this.value = '';
        }
      });
    }
  }
  
  openModal('project-modal');
}

// Open Event Modal
function openEventModal(defaultDate) {
  let eventModal = document.getElementById('event-modal');
  
  if (!eventModal) {
    eventModal = document.createElement('div');
    eventModal.id = 'event-modal';
    eventModal.className = 'modal';
    eventModal.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Add Event</h3>
        <button class="modal-close" id="close-event-modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="event-form">
          <div class="form-group">
            <label for="event-title">Event Title</label>
            <input type="text" id="event-title" class="form-control" required>
          </div>
          <div class="form-row">
            <div class="form-col">
              <div class="form-group">
                <label for="event-start-date">Start Date</label>
                <input type="date" id="event-start-date" class="form-control" required value="${defaultDate || moment().format('YYYY-MM-DD')}">
              </div>
            </div>
            <div class="form-col">
              <div class="form-group">
                <label for="event-end-date">End Date</label>
                <input type="date" id="event-end-date" class="form-control" value="${defaultDate || moment().format('YYYY-MM-DD')}">
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="event-type">Event Type</label>
            <select id="event-type" class="form-control">
              <option value="meeting">Meeting</option>
              <option value="deadline">Deadline</option>
              <option value="reminder">Reminder</option>
              <option value="time_off">Time Off</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label for="event-description">Description</label>
            <textarea id="event-description" class="form-control" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Notify Team Members</label>
            <div>
              <div style="margin-bottom: 8px;">
                <input type="checkbox" id="notify-jd" checked>
                <label for="notify-jd">John Doe</label>
              </div>
              <div style="margin-bottom: 8px;">
                <input type="checkbox" id="notify-as">
                <label for="notify-as">Amanda Smith</label>
              </div>
              <div style="margin-bottom: 8px;">
                <input type="checkbox" id="notify-mk">
                <label for="notify-mk">Mike Kelly</label>
              </div>
              <div style="margin-bottom: 8px;">
                <input type="checkbox" id="notify-rw">
                <label for="notify-rw">Rachel Williams</label>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="cancel-event-btn">Cancel</button>
        <button class="btn btn-primary" id="save-event-btn">Save Event</button>
      </div>
    `;
    
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.appendChild(eventModal);
      
      // Close button
      document.getElementById('close-event-modal')?.addEventListener('click', function() {
        closeAllModals();
      });
      
      // Cancel button
      document.getElementById('cancel-event-btn')?.addEventListener('click', function() {
        closeAllModals();
      });
      
      // Save button
      document.getElementById('save-event-btn')?.addEventListener('click', function() {
        addNewEvent();
      });
    }
  } else {
    // Update date if provided
    if (defaultDate) {
      document.getElementById('event-start-date').value = defaultDate;
      document.getElementById('event-end-date').value = defaultDate;
    }
  }
  
  openModal('event-modal');
}

// Function to open event details modal
function openEventDetails(eventId, title, date, description) {
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
    
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.appendChild(eventDetailsModal);
      
      // Close buttons
      document.getElementById('close-event-details-modal')?.addEventListener('click', function() {
        closeAllModals();
      });
      
      document.getElementById('close-event-details-btn')?.addEventListener('click', function() {
        closeAllModals();
      });
      
      // Save notes button
      document.getElementById('save-event-notes-btn')?.addEventListener('click', function() {
        const notes = document.getElementById('event-details-notes').value;
        // In a real app, this would save to a database
        alert('Notes saved successfully!');
        closeAllModals();
      });
    }
  }
  
  // Set modal content
  const titleElement = document.getElementById('event-details-title');
  if (titleElement) titleElement.textContent = title;
  
  const dateElement = document.getElementById('event-details-date');
  if (dateElement) dateElement.textContent = moment(date).format('dddd, MMMM D, YYYY');
  
  const descriptionElement = document.getElementById('event-details-description');
  if (descriptionElement) descriptionElement.textContent = description;
  
  // Store the event ID for reference
  eventDetailsModal.setAttribute('data-event-id', eventId);
  
  // Open the modal
  openModal('event-details-modal');
}

// Add a new event
function addNewEvent() {
  const eventTitle = document.getElementById('event-title').value;
  const eventStartDate = document.getElementById('event-start-date').value;
  const eventEndDate = document.getElementById('event-end-date').value;
  const eventType = document.getElementById('event-type').value;
  const eventDescription = document.getElementById('event-description').value;
  
  // Validate form
  if (!eventTitle || !eventStartDate) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Get the events table
  const eventsTable = document.getElementById('events-table');
  if (!eventsTable) return;
  
  // Determine badge class based on type
  let badgeClass = 'badge-primary';
  if (eventType === 'deadline') badgeClass = 'badge-danger';
  else if (eventType === 'time_off') badgeClass = 'badge-warning';
  else if (eventType === 'reminder') badgeClass = 'badge-secondary';
  
  // Format the date range
  let dateDisplay = moment(eventStartDate).format('MMM D, YYYY');
  if (eventEndDate && eventEndDate !== eventStartDate) {
    dateDisplay = `${moment(eventStartDate).format('MMM D')}-${moment(eventEndDate).format('D, YYYY')}`;
  }
  
  // Create a new row
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${dateDisplay}</td>
    <td>${eventTitle}</td>
    <td><span class="badge ${badgeClass}">${eventType.charAt(0).toUpperCase() + eventType.slice(1).replace('_', ' ')}</span></td>
    <td>
      <div class="table-actions">
        <button class="btn btn-secondary btn-sm event-edit-btn">Edit</button>
        <button class="btn btn-danger btn-sm event-delete-btn">Delete</button>
      </div>
    </td>
  `;
  
  // Add event listeners
  newRow.querySelector('.event-edit-btn').addEventListener('click', function(e) {
    e.preventDefault();
    // For demo, just show the event details
    openEventDetails('new-event', eventTitle, eventStartDate, eventDescription);
  });
  
  newRow.querySelector('.event-delete-btn').addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this event?')) {
      newRow.remove();
    }
  });
  
  // Add the new row to the table
  eventsTable.insertBefore(newRow, eventsTable.firstChild);
  
  // Add to calendar
  if (moment(eventStartDate).month() === moment().month() && 
      moment(eventStartDate).year() === moment().year()) {
    
    // Update the calendar view
    initializeCalendar();
  }
  
  // Close modal
  closeAllModals();
  
  // Show success message
  alert('Event added successfully!');
}

// Open mark paid modal
function openMarkPaidModal(invoiceId, amount) {
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
          <div class="form-row">
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
          <div class="form-group">
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
    
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.appendChild(markPaidModal);
      
      // Close/cancel buttons
      document.getElementById('close-mark-paid-modal')?.addEventListener('click', function() {
        closeAllModals();
      });
      
      document.getElementById('cancel-mark-paid-btn')?.addEventListener('click', function() {
        closeAllModals();
      });
      
      // Confirm button
      document.getElementById('confirm-mark-paid-btn')?.addEventListener('click', function() {
        confirmMarkPaid();
      });
    }
  }
  
  // Populate the form
  const invoiceIdInput = document.getElementById('paid-invoice-id');
  const invoiceAmountInput = document.getElementById('invoice-amount');
  const paidAmountInput = document.getElementById('paid-amount');
  
  if (invoiceIdInput) invoiceIdInput.value = invoiceId;
  if (invoiceAmountInput) invoiceAmountInput.value = amount;
  if (paidAmountInput) paidAmountInput.value = amount.replace(', '').replace(',', '');
  
  openModal('mark-paid-modal');
}

// Confirm marking invoice as paid
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
        const statusBadge = row.querySelector('.badge');
        if (statusBadge) {
          statusBadge.className = 'badge badge-success';
          statusBadge.textContent = 'Paid';
        }
        
        // Update the date column to paid date
        const dateCol = row.querySelector('td:nth-child(4)');
        if (dateCol) dateCol.textContent = moment(paidDate).format('MMM D, YYYY');
        
        // Update the actions column
        const actionsCol = row.querySelector('td:last-child');
        if (actionsCol) {
          actionsCol.innerHTML = `
            <div class="table-actions">
              <button class="btn btn-secondary btn-sm view-invoice-btn">View</button>
            </div>
          `;
          
          // Add event listener to the new view button
          const viewBtn = actionsCol.querySelector('.view-invoice-btn');
          if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
              e.preventDefault();
              
              const clientName = row.querySelector('td:nth-child(2)').textContent;
              const issueDate = row.querySelector('td:nth-child(3)').textContent;
              const dueDate = moment(paidDate).format('MMM D, YYYY');
              const amount = row.querySelector('td:nth-child(5)').textContent;
              
              viewInvoice(invoiceId, clientName, issueDate, dueDate, amount, 'Paid');
            });
          }
        }
        
        // If this is in the unpaid tab, we should move it to the paid tab
        if (tableId === 'unpaid-tab') {
          const paidTab = document.getElementById('paid-tab');
          if (paidTab) {
            const paidTable = paidTab.querySelector('tbody');
            if (paidTable) {
              // Clone the row and update the date column header
              const clonedRow = row.cloneNode(true);
              const dateHeader = clonedRow.querySelector('td:nth-child(4)');
              if (dateHeader) dateHeader.textContent = moment(paidDate).format('MMM D, YYYY');
              
              // Add event listener to the cloned view button
              const clonedViewBtn = clonedRow.querySelector('.view-invoice-btn');
              if (clonedViewBtn) {
                clonedViewBtn.addEventListener('click', function(e) {
                  e.preventDefault();
                  
                  const clientName = clonedRow.querySelector('td:nth-child(2)').textContent;
                  const issueDate = clonedRow.querySelector('td:nth-child(3)').textContent;
                  const dueDate = moment(paidDate).format('MMM D, YYYY');
                  const amount = clonedRow.querySelector('td:nth-child(5)').textContent;
                  
                  viewInvoice(invoiceId, clientName, issueDate, dueDate, amount, 'Paid');
                });
              }
              
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
  
  // Update recent activities
  addActivity(`Payment received for Invoice ${invoiceId}`, 'Completed');
  
  // Show success message
  alert('Invoice marked as paid successfully!');
}

// Function to view invoice details
function viewInvoice(invoiceId, clientName, issueDate, dueDate, amount, status) {
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
              <div class="invoice-id"></div>
              <div class="invoice-date issue-date"></div>
              <div class="invoice-date due-date"></div>
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
              <p class="client-address">
                
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
                <!-- Invoice items will be populated here -->
              </tbody>
            </table>
          </div>
          <div class="invoice-total">
            <div class="invoice-total-row">
              <span class="invoice-total-label">Subtotal</span>
              <span class="invoice-total-value subtotal">0.00</span>
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
              <span class="invoice-total-value invoice-total-amount total">0.00</span>
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
    
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.appendChild(viewInvoiceModal);
      
      // Close buttons
      document.getElementById('close-view-invoice-modal')?.addEventListener('click', function() {
        closeAllModals();
      });
      
      document.getElementById('close-view-invoice-btn')?.addEventListener('click', function() {
        closeAllModals();
      });
      
      // Download PDF button
      document.getElementById('download-invoice-btn')?.addEventListener('click', function() {
        generateInvoicePDF();
      });
    }
  }
  
  // Update invoice details
  const invoiceIdEl = viewInvoiceModal.querySelector('.invoice-id');
  const issueDateEl = viewInvoiceModal.querySelector('.issue-date');
  const dueDateEl = viewInvoiceModal.querySelector('.due-date');
  
  if (invoiceIdEl) invoiceIdEl.textContent = invoiceId;
  if (issueDateEl) issueDateEl.textContent = `Date: ${issueDate}`;
  if (dueDateEl) dueDateEl.textContent = status === 'Paid' ? `Paid: ${dueDate}` : `Due: ${dueDate}`;
  
  // Update client info
  const clientAddressEl = viewInvoiceModal.querySelector('.client-address');
  
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
  
  if (clientAddressEl) clientAddressEl.innerHTML = clientAddress;
  
  // Set the invoice amount
  const amountValue = parseFloat(amount.replace(', '').replace(',', ''));
  const invoiceItemsTable = viewInvoiceModal.querySelector('.invoice-items tbody');
  if (invoiceItemsTable) invoiceItemsTable.innerHTML = '';
  
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
  
  if (invoiceItemsTable) invoiceItemsTable.appendChild(row);
  
  // Update totals
  const subtotalEl = viewInvoiceModal.querySelector('.subtotal');
  const totalEl = viewInvoiceModal.querySelector('.total');
  
  if (subtotalEl) subtotalEl.textContent = amountValue.toFixed(2);
  if (totalEl) totalEl.textContent = amountValue.toFixed(2);
  
  // Open the modal
  openModal('view-invoice-modal');
}

// Function to generate PDF of the invoice
function generateInvoicePDF() {
  // Check if jsPDF library is available
  if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
    alert('PDF functionality requires the jsPDF library. In a real application, this would be properly included.');
    return;
  }
  
  const { jsPDF } = window.jspdf;
  
  // Create a new PDF
  const doc = new jsPDF();
  
  // Get invoice elements
  const invoiceModal = document.getElementById('view-invoice-modal');
  if (!invoiceModal) return;
  
  const invoiceId = invoiceModal.querySelector('.invoice-id').textContent;
  const issueDate = invoiceModal.querySelector('.issue-date').textContent;
  const dueDate = invoiceModal.querySelector('.due-date').textContent;
  const total = invoiceModal.querySelector('.total').textContent;
  
  // Add content to PDF
  doc.setFontSize(20);
  doc.text('INVOICE', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Your Business Name', 20, 40);
  doc.text(invoiceId, 190, 40, { align: 'right' });
  
  doc.setFontSize(10);
  doc.text('123 Business Street', 20, 50);
  doc.text('Suite 101', 20, 57);
  doc.text('Anytown, ST 12345', 20, 64);
  doc.text('contact@yourbusiness.com', 20, 71);
  doc.text('+1 (555) 123-4567', 20, 78);
  
  doc.text(issueDate, 190, 50, { align: 'right' });
  doc.text(dueDate, 190, 57, { align: 'right' });
  
  // Client info
  const clientAddress = invoiceModal.querySelector('.client-address').innerHTML.split('<br>');
  
  doc.setFontSize(12);
  doc.text('Bill To:', 20, 100);
  
  doc.setFontSize(10);
  let yPos = 110;
  clientAddress.forEach(line => {
    if (line.trim()) {
      doc.text(line.trim(), 20, yPos);
      yPos += 7;
    }
  });
  
  // Items table header
  yPos = 150;
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Description', 20, yPos);
  doc.text('Quantity', 100, yPos);
  doc.text('Rate', 130, yPos);
  doc.text('Amount', 170, yPos);
  doc.setFont(undefined, 'normal');
  
  // Items table content
  yPos += 10;
  const items = invoiceModal.querySelectorAll('.invoice-items tbody tr');
  items.forEach(item => {
    const description = item.querySelector('td:nth-child(1)').textContent;
    const quantity = item.querySelector('td:nth-child(2)').textContent;
    const rate = item.querySelector('td:nth-child(3)').textContent;
    const amount = item.querySelector('td:nth-child(4)').textContent;
    
    doc.text(description, 20, yPos);
    doc.text(quantity, 100, yPos);
    doc.text(rate, 130, yPos);
    doc.text(amount, 170, yPos);
    
    yPos += 10;
  });
  
  // Totals
  yPos = 200;
  doc.text('Total:', 130, yPos);
  doc.setFont(undefined, 'bold');
  doc.text(' + total, 170, yPos);
  doc.setFont(undefined, 'normal');
  
  // Notes
  yPos = 220;
  doc.text('Notes:', 20, yPos);
  doc.text('Thank you for your business!', 20, yPos + 10);
  
  // Save PDF
  doc.save(`Invoice-${invoiceId}.pdf`);
}

// Function to create invoice preview
function createInvoicePreview() {
  // Get form inputs
  const invoiceNumber = document.getElementById('invoice-number')?.value;
  const clientSelect = document.getElementById('invoice-client');
  
  // Validate client is selected
  if (!clientSelect || !clientSelect.value) {
    alert('Please select a client for this invoice');
    return false;
  }
  
  const clientName = clientSelect.options[clientSelect.selectedIndex].text;
  const issueDate = document.getElementById('invoice-date')?.value;
  const dueDate = document.getElementById('invoice-due-date')?.value;
  
  // Validate we have items
  const invoiceItems = document.querySelectorAll('.invoice-item');
  if (invoiceItems.length === 0) {
    alert('Please add at least one item to the invoice');
    return false;
  }
  
  // Validate all items have descriptions
  let valid = true;
  invoiceItems.forEach(item => {
    const description = item.querySelector('.item-description')?.value || '';
    if (description.trim() === '') {
      valid = false;
    }
  });
  
  if (!valid) {
    alert('Please provide a description for all invoice items');
    return false;
  }
  
  // Create the invoice visualization
  viewInvoice(
    invoiceNumber,
    clientName,
    moment(issueDate).format('MMM D, YYYY'),
    moment(dueDate).format('MMM D, YYYY'),
    ' + document.getElementById('invoice-total').value,
    'Pending'
  );
  
  // Add to invoices table
  addNewInvoice(invoiceNumber, clientName, issueDate, dueDate, document.getElementById('invoice-total').value);
  
  return true;
}

// Add a new invoice to the table
function addNewInvoice(invoiceId, clientName, issueDate, dueDate, total) {
  const unpaidTab = document.getElementById('unpaid-tab');
  if (!unpaidTab) return;
  
  const unpaidTable = unpaidTab.querySelector('tbody');
  if (!unpaidTable) return;
  
  // Format dates
  const formattedIssueDate = moment(issueDate).format('MMM D, YYYY');
  const formattedDueDate = moment(dueDate).format('MMM D, YYYY');
  
  // Format total
  const formattedTotal = ' + parseFloat(total).toFixed(2);
  
  // Create new row
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${invoiceId}</td>
    <td>${clientName}</td>
    <td>${formattedIssueDate}</td>
    <td>${formattedDueDate}</td>
    <td>${formattedTotal}</td>
    <td><span class="badge badge-warning">Pending</span></td>
    <td>
      <div class="table-actions">
        <button class="btn btn-secondary btn-sm view-invoice-btn">View</button>
        <button class="btn btn-success btn-sm">Mark Paid</button>
      </div>
    </td>
  `;
  
  // Add event listeners
  const viewBtn = newRow.querySelector('.view-invoice-btn');
  if (viewBtn) {
    viewBtn.addEventListener('click', function(e) {
      e.preventDefault();
      viewInvoice(invoiceId, clientName, formattedIssueDate, formattedDueDate, formattedTotal, 'Pending');
    });
  }
  
  const markPaidBtn = newRow.querySelector('.btn-success');
  if (markPaidBtn) {
    markPaidBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openMarkPaidModal(invoiceId, formattedTotal);
    });
  }
  
  // Add to unpaid table
  unpaidTable.insertBefore(newRow, unpaidTable.firstChild);
  
  // Add to all invoices tab
  const allInvoicesTable = document.getElementById('all-invoices-table');
  if (allInvoicesTable) {
    const clonedRow = newRow.cloneNode(true);
    
    // Add event listeners to cloned row
    const clonedViewBtn = clonedRow.querySelector('.view-invoice-btn');
    if (clonedViewBtn) {
      clonedViewBtn.addEventListener('click', function(e) {
        e.preventDefault();
        viewInvoice(invoiceId, clientName, formattedIssueDate, formattedDueDate, formattedTotal, 'Pending');
      });
    }
    
    const clonedMarkPaidBtn = clonedRow.querySelector('.btn-success');
    if (clonedMarkPaidBtn) {
      clonedMarkPaidBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openMarkPaidModal(invoiceId, formattedTotal);
      });
    }
    
    allInvoicesTable.insertBefore(clonedRow, allInvoicesTable.firstChild);
  }
  
  // Add to recent activities
  addActivity(`Invoice ${invoiceId} created for ${clientName}`, 'New');
}

// Function to add a new contact
function addNewContact() {
  const firstName = document.getElementById('contact-first-name')?.value;
  const lastName = document.getElementById('contact-last-name')?.value;
  const company = document.getElementById('contact-company')?.value;
  const email = document.getElementById('contact-email')?.value;
  const phone = document.getElementById('contact-phone')?.value;
  const status = document.getElementById('contact-status')?.value;
  
  if (!firstName || !lastName || !email) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Get the contacts table
  const contactsTable = document.getElementById('contacts-table');
  if (!contactsTable) return;
  
  // Create a new row
  const newRow = document.createElement('tr');
  
  // Determine badge class based on status
  let badgeClass = 'badge-success';
  if (status === 'lead') badgeClass = 'badge-warning';
  else if (status === 'prospect') badgeClass = 'badge-primary';
  else if (status === 'inactive') badgeClass = 'badge-secondary';
  
  // Add the HTML for the new row
  newRow.innerHTML = `
    <td>${firstName} ${lastName}</td>
    <td>${company}</td>
    <td>${email}</td>
    <td>${phone || ''}</td>
    <td><span class="badge ${badgeClass}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
    <td>
      <div class="table-actions">
        <button class="btn btn-secondary btn-sm">Edit</button>
        <button class="btn btn-danger btn-sm">Delete</button>
      </div>
    </td>
  `;
  
  // Add the new row to the table
  contactsTable.appendChild(newRow);
  
  // Add to activities
  addActivity(`New contact added: ${firstName} ${lastName}`, 'New');
  
  // If we were in the process of creating an invoice, go back to it
  if (sessionStorage.getItem('invoiceFormState')) {
    sessionStorage.removeItem('invoiceFormState');
    
    // In a real app, we would add the new contact to the dropdown
    const invoiceClient = document.getElementById('invoice-client');
    if (invoiceClient) {
      const newOption = document.createElement('option');
      newOption.value = `new-${Date.now()}`; // A temporary unique ID
      newOption.text = `${firstName} ${lastName} (${company})`;
      
      // Add the new option right before the "Add New Customer" option
      const addNewOption = invoiceClient.querySelector('option[value="new_customer"]');
      if (addNewOption) {
        invoiceClient.insertBefore(newOption, addNewOption);
      } else {
        invoiceClient.appendChild(newOption);
      }
      
      // Select the new option
      invoiceClient.value = newOption.value;
    }
    
    openInvoiceModal();
  }
  
  // If we were in the process of creating a project, go back to it
  if (sessionStorage.getItem('projectFormState')) {
    sessionStorage.removeItem('projectFormState');
    
    // Add the new contact to the dropdown
    const projectClient = document.getElementById('project-client');
    if (projectClient) {
      const newOption = document.createElement('option');
      newOption.value = `new-${Date.now()}`; // A temporary unique ID
      newOption.text = `${firstName} ${lastName} (${company})`;
      
      // Add the new option right before the "Add New Customer" option
      const addNewOption = projectClient.querySelector('option[value="new_customer"]');
      if (addNewOption) {
        projectClient.insertBefore(newOption, addNewOption);
      } else {
        projectClient.appendChild(newOption);
      }
      
      // Select the new option
      projectClient.value = newOption.value;
    }
    
    openProjectModal();
  } else {
    // Close modal
    closeAllModals();
    
    // Show success message
    alert('Contact added successfully!');
  }
}

// Function to add a new project
function addNewProject() {
  const projectTitle = document.getElementById('project-title')?.value;
  const projectClient = document.getElementById('project-client')?.value;
  const projectDeadline = document.getElementById('project-deadline')?.value;
  const projectDescription = document.getElementById('project-description')?.value;
  const projectStatus = document.getElementById('project-status')?.value;
  const projectBudget = document.getElementById('project-budget')?.value;
  
  if (!projectTitle || !projectClient || !projectDeadline) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Get the client name
  const clientSelect = document.getElementById('project-client');
  if (!clientSelect) return;
  
  const clientName = clientSelect.options[clientSelect.selectedIndex].text;
  
  // Get the active projects tab
  const activeProjectsTab = document.getElementById('active-projects-tab');
  if (!activeProjectsTab) return;
  
  // Create a new project card
  const newProject = document.createElement('div');
  newProject.className = 'project-card';
  
  // Determine status color
  let statusColor = 'status-green';
  let statusBadge = 'badge-success';
  let statusText = 'On Track';
  
  if (projectStatus === 'on_hold') {
    statusColor = 'status-yellow';
    statusBadge = 'badge-warning';
    statusText = 'On Hold';
  } else if (projectStatus === 'new') {
    statusColor = 'status-green';
    statusBadge = 'badge-success';
    statusText = 'New';
  } else if (projectStatus === 'completed') {
    statusColor = 'status-green';
    statusBadge = 'badge-success';
    statusText = 'Completed';
  } else if (projectStatus === 'in_progress') {
    statusColor = 'status-green';
    statusBadge = 'badge-success';
    statusText = 'In Progress';
  }
  
  // Get team members
  const teamMembers = [];
  if (document.getElementById('assign-jd')?.checked) teamMembers.push('JD');
  if (document.getElementById('assign-as')?.checked) teamMembers.push('AS');
  if (document.getElementById('assign-mk')?.checked) teamMembers.push('MK');
  if (document.getElementById('assign-rw')?.checked) teamMembers.push('RW');
  
  // Create team member HTML
  let teamMembersHTML = '';
  teamMembers.forEach(member => {
    teamMembersHTML += `<div class="project-assignee">${member}</div>`;
  });
  
  // If no team members selected, add the default
  if (teamMembers.length === 0) {
    teamMembersHTML = '<div class="project-assignee">JD</div>';
  }
  
  // Add the HTML for the new project card
  newProject.innerHTML = `
    <div class="project-status ${statusColor}"></div>
    <div class="project-content">
      <div class="project-header">
        <span class="project-title">${projectTitle}</span>
        <span class="project-date">Due: ${moment(projectDeadline).format('MMM D, YYYY')}</span>
      </div>
      <div class="project-description">
        ${projectDescription || 'No description provided.'}
      </div>
      <div class="project-footer">
        <div class="project-assignees">
          ${teamMembersHTML}
        </div>
        <span class="badge ${statusBadge}">${statusText}</span>
      </div>
    </div>
  `;
  
  // If the project is completed, add it to the completed tab instead
  if (projectStatus === 'completed') {
    const completedProjectsTab = document.getElementById('completed-projects-tab');
    if (completedProjectsTab) {
      completedProjectsTab.prepend(newProject);
    } else {
      // If no completed tab, add to active tab anyway
      activeProjectsTab.prepend(newProject);
    }
  } else {
    // Add the new project card to the active projects tab
    activeProjectsTab.prepend(newProject);
  }
  
  // Also add to all projects tab
  const allProjectsTab = document.getElementById('all-projects-tab');
  if (allProjectsTab) {
    const clonedProject = newProject.cloneNode(true);
    allProjectsTab.prepend(clonedProject);
  }
  
  // Add to activities
  addActivity(`New project created: ${projectTitle}`, 'New');
  
  // In a real app, this would be saved to a database
  // For our demo, we'll add it to our projects array so the calendar can use it
  const projectId = 'new-' + Date.now();
  
  // Get existing projects
  let existingProjects = [];
  try {
    const storedProjects = sessionStorage.getItem('project-deadlines');
    if (storedProjects) {
      existingProjects = JSON.parse(storedProjects);
    } else {
      existingProjects = getProjectDeadlines();
    }
  } catch (e) {
    existingProjects = getProjectDeadlines();
  }
  
  // Add new project to array
  existingProjects.push({
    id: projectId,
    title: projectTitle,
    deadline: projectDeadline,
    description: projectDescription
  });
  
  // Save projects to session storage
  sessionStorage.setItem('project-deadlines', JSON.stringify(existingProjects));
  
  // Refresh the calendar to show the new project deadline
  initializeCalendar();
  
  // Close modal
  closeAllModals();
  
  // Show success message
  alert('Project added successfully!');
}

// Function to add activity to recent activities
function addActivity(activityText, status) {
  const activitiesTable = document.getElementById('activities-table');
  if (!activitiesTable) return;
  
  // Determine badge class based on status
  let badgeClass = 'badge-primary';
  if (status === 'Completed') badgeClass = 'badge-success';
  else if (status === 'Updated') badgeClass = 'badge-warning';
  else if (status === 'New') badgeClass = 'badge-primary';
  
  // Create new row
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${moment().format('MMM D, YYYY')}</td>
    <td>${activityText}</td>
    <td><span class="badge ${badgeClass}">${status}</span></td>
  `;
  
  // Add to table - prepend to show newest first
  activitiesTable.insertBefore(newRow, activitiesTable.firstChild);
  
  // Limit to top 10 activities
  const allRows = activitiesTable.querySelectorAll('tr');
  if (allRows.length > 10) {
    activitiesTable.removeChild(allRows[allRows.length - 1]);
  }
}

// Function to initialize form handlers
function initializeFormHandlers() {
  // Connect add buttons to modal openers
  document.getElementById('add-expense-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    openExpenseModal();
  });
  
  document.getElementById('add-contact-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    openContactModal();
  });
  
  document.getElementById('create-invoice-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    openInvoiceModal();
  });
  
  document.getElementById('add-project-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    openProjectModal();
  });
  
  document.getElementById('add-event-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    openEventModal();
  });
  
  document.getElementById('generate-report-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Report generation would be implemented in a real application.');
  });
  
  // Initialize invoice buttons in existing tables
  const unpaidTable = document.getElementById('unpaid-tab');
  if (unpaidTable) {
    initializeInvoiceButtons(unpaidTable);
  }
  
  const paidTable = document.getElementById('paid-tab');
  if (paidTable) {
    initializeInvoiceButtons(paidTable);
  }
  
  // Task Checkboxes
  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const taskTitle = this.closest('.task-item').querySelector('.task-title');
      if (this.checked) {
        taskTitle.classList.add('completed');
      } else {
        taskTitle.classList.remove('completed');
      }
    });
  });
  
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
      
      // Show success message
      alert('Settings saved successfully!');
    });
  });
  
  // Report buttons
  document.querySelectorAll('.report-actions .btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (this.textContent.trim() === 'Export') {
        alert('Report export functionality would be implemented in a real application.');
      } else if (this.textContent.trim() === 'View') {
        alert('Report view functionality would be implemented in a real application.');
      }
    });
  });
}

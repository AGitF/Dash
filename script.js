// Complete fixed script.js file
// Prevent default behavior on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing dashboard...');
  
  // Prevent all # links from changing the URL
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Prevented default link behavior');
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
  
  // Add a debug panel to help with troubleshooting
  addDebugPanel();
  
  console.log('Dashboard initialization complete');
});

// Add a debug panel to help troubleshoot navigation issues
function addDebugPanel() {
  const debugPanel = document.createElement('div');
  debugPanel.style.position = 'fixed';
  debugPanel.style.bottom = '10px';
  debugPanel.style.right = '10px';
  debugPanel.style.zIndex = '9999';
  debugPanel.style.background = 'rgba(0,0,0,0.7)';
  debugPanel.style.padding = '10px';
  debugPanel.style.borderRadius = '5px';
  debugPanel.style.color = 'white';
  
  debugPanel.innerHTML = `
    <div style="margin-bottom:10px;font-weight:bold;">Debug Panel</div>
    <button id="debug-dashboard" style="margin:5px;padding:5px;">Dashboard</button>
    <button id="debug-calendar" style="margin:5px;padding:5px;">Calendar</button>
    <button id="debug-crm" style="margin:5px;padding:5px;">CRM</button>
    <button id="debug-finance" style="margin:5px;padding:5px;">Finance</button>
    <button id="debug-projects" style="margin:5px;padding:5px;">Projects</button>
  `;
  
  document.body.appendChild(debugPanel);
  
  // Add event listeners to debug buttons
  document.getElementById('debug-dashboard').addEventListener('click', function() {
    showPage('dashboard-page');
  });
  
  document.getElementById('debug-calendar').addEventListener('click', function() {
    showPage('calendar-page');
  });
  
  document.getElementById('debug-crm').addEventListener('click', function() {
    showPage('crm-page');
  });
  
  document.getElementById('debug-finance').addEventListener('click', function() {
    showPage('finance-page');
  });
  
  document.getElementById('debug-projects').addEventListener('click', function() {
    showPage('projects-page');
  });
}

// Function to initialize sidebar navigation
function initializeSidebar() {
  const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
  const pageTitle = document.getElementById('page-title');
  
  sidebarLinks.forEach(link => {
    // Remove any existing event listeners
    const newLink = link.cloneNode(true);
    link.parentNode.replaceChild(newLink, link);
    
    // Add new click event listener
    newLink.addEventListener('click', function(e) {
      e.preventDefault();
      
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
      console.log('Page displayed:', page.id);
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
    // Remove any existing event listeners
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // Add new click event listener
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      
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
      dayElement.addEventListener('click', function(e) {
        e.preventDefault();
        const date = this.getAttribute('data-date');
        const eventStartDate = document.getElementById('event-start-date');
        const eventEndDate = document.getElementById('event-end-date');
        
        if (eventStartDate) eventStartDate.value = date;
        if (eventEndDate) eventEndDate.value = date;
        
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
    
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.appendChild(eventDetailsModal);
    } else {
      console.error('Modal backdrop not found');
      return;
    }
    
    // Add event listeners for the new modal
    const closeModalBtn = document.getElementById('close-event-details-modal');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeAllModals();
      });
    }
    
    const closeEventBtn = document.getElementById('close-event-details-btn');
    if (closeEventBtn) {
      closeEventBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeAllModals();
      });
    }
    
    const saveNotesBtn = document.getElementById('save-event-notes-btn');
    if (saveNotesBtn) {
      saveNotesBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const eventId = eventDetailsModal.getAttribute('data-event-id');
        const notes = document.getElementById('event-details-notes').value;
        
        // In a real app, we would save this to a database
        // For now, just show a confirmation and close
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
  
  // Load any existing notes (this would come from a database in a real app)
  const notesElement = document.getElementById('event-details-notes');
  if (notesElement) notesElement.value = '';
  
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
    
      // Add event listeners
      const saveBtn = document.getElementById('save-expense-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
          e.preventDefault();
          addNewExpense();
        });
      }
      
      const closeBtn = document.getElementById('close-expense-modal');
      if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          closeAllModals();
        });
      }
      
      const cancelBtn = document.getElementById('cancel-expense-btn');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
          e.preventDefault();
          closeAllModals();
        });
      }
    }
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
      
      // Add event listeners
      const confirmBtn = document.getElementById('confirm-mark-paid-btn');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', function(e) {
          e.preventDefault();
          confirmMarkPaid();
        });
      }
      
      const closeBtn = document.getElementById('close-mark-paid-modal');
      if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          closeAllModals();
        });
      }
      
      const cancelBtn = document.getElementById('cancel-mark-paid-btn');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
          e.preventDefault();
          closeAllModals();
        });
      }
    }
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
    
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.appendChild(viewInvoiceModal);
      
      // Add event listeners
      const closeViewBtn = document.getElementById('close-view-invoice-btn');
      if (closeViewBtn) {
        closeViewBtn.addEventListener('click', function(e) {
          e.preventDefault();
          closeAllModals();
        });
      }
      
      const closeModalBtn = document.getElementById('close-view-invoice-modal');
      if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function(e) {
          e.preventDefault();
          closeAllModals();
        });
      }
      
      // PDF Download
      const downloadInvoiceBtn = document.getElementById('download-invoice-btn');
      if (downloadInvoiceBtn && window.jspdf) {
        downloadInvoiceBtn.addEventListener('click', function(e) {
          e.preventDefault();
          generateInvoicePDF();
        });
      }
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
  const formattedAmount = '$' + parseFloat(expenseAmount).toFixed(2);
  
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
  if (!modal) {
    createMarkPaidModal();
    modal = document.getElementById('mark-paid-modal');
    if (!modal) return;
  }
  
  // Populate the form
  const invoiceIdInput = document.getElementById('paid-invoice-id');
  const invoiceAmountInput = document.getElementById('invoice-amount');
  const paidAmountInput = document.getElementById('paid-amount');
  
  if (invoiceIdInput) invoiceIdInput.value = invoiceId;
  if (invoiceAmountInput) invoiceAmountInput.value = amount;
  if (paidAmountInput) paidAmountInput.value = amount.replace('$', '').replace(',', '');
  
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
              e.preventDefault(); // Prevent default button behavior
              
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
                  e.preventDefault(); // Prevent default button behavior
                  
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
  
  // Show success message
  alert('Invoice marked as paid successfully!');
}

// Function to view invoice details
function viewInvoice(invoiceId, clientName, issueDate, dueDate, amount, status) {
  const modal = document.getElementById('view-invoice-modal');
  if (!modal) {
    createViewInvoiceModal();
    modal = document.getElementById('view-invoice-modal');
    if (!modal) return;
  }
  
  // Update invoice details
  const invoiceIdEl = modal.querySelector('.invoice-id');
  const issueDateEl = modal.querySelector('.invoice-date:nth-of-type(2)');
  const dueDateEl = modal.querySelector('.invoice-date:nth-of-type(3)');
  
  if (invoiceIdEl) invoiceIdEl.textContent = invoiceId;
  if (issueDateEl) issueDateEl.textContent = `Date: ${issueDate}`;
  if (dueDateEl) dueDateEl.textContent = `Due: ${dueDate}`;
  
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
  
  if (billToAddress) billToAddress.innerHTML = clientAddress;
  
  // Set the invoice amount
  const amountValue = parseFloat(amount.replace('$', '').replace(',', ''));
  const invoiceItems = modal.querySelector('.invoice-items tbody');
  if (invoiceItems) invoiceItems.innerHTML = '';
  
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
  
  if (invoiceItems) invoiceItems.appendChild(row);
  
  // Update totals
  const totalRows = modal.querySelectorAll('.invoice-total-row');
  if (totalRows.length >= 4) {
    totalRows[0].querySelector('.invoice-total-value').textContent = amountValue.toFixed(2);
    totalRows[3].querySelector('.invoice-total-value').textContent = amountValue.toFixed(2);
  }
  
  // Open the modal
  openModal('view-invoice-modal');
}
// Complete fixed script.js file - Part 3

// Initialize invoice modal (continued)
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
    if (!modalBody) return;
    
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
    
    const form = modalBody.querySelector('form');
    if (form) {
      form.appendChild(itemsSection);
      
      // Setup invoice item handlers
      setupInvoiceItemHandlers();
    }
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
    
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.appendChild(projectModal);
      
      // Add event listeners
      const closeBtn = document.getElementById('close-project-modal');
      if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          closeAllModals();
        });
      }
      
      const cancelBtn = document.getElementById('cancel-project-btn');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
          e.preventDefault();
          closeAllModals();
        });
      }
      
      const saveBtn = document.getElementById('save-project-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
          e.preventDefault();
          addNewProject();
        });
      }
      
      // Client selection
      const projectClient = document.getElementById('project-client');
      if (projectClient) {
        projectClient.addEventListener('change', function(e) {
          if (this.value === 'new_customer') {
            // Save current state before switching
            sessionStorage.setItem('projectFormState', true);
            
            // Open the add contact modal
            openModal('contact-modal');
            
            // Reset the select back to empty
            this.value = '';
          }
        });
        
        // Check if we're returning from adding a new customer
        if (sessionStorage.getItem('projectFormState')) {
          sessionStorage.removeItem('projectFormState');
          openModal('project-modal');
        }
      }
      
      // Set default deadline to two weeks from now
      const deadlineInput = document.getElementById('project-deadline');
      if (deadlineInput) {
        deadlineInput.value = moment().add(2, 'weeks').format('YYYY-MM-DD');
      }
    }
  }
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
      
      // Handle invoice form submission
      if (this.id === 'invoice-form') {
        if (createInvoicePreview()) {
          closeAllModals();
          openModal('view-invoice-modal');
        }
      } else if (this.id === 'contact-form') {
        addNewContact();
        closeAllModals();
      } else if (this.id === 'project-form') {
        addNewProject();
        closeAllModals();
      } else {
        // Generic handler for other forms
        closeAllModals();
        alert('Form submitted successfully!');
      }
    });
  });
  
  // Save buttons for modals
  document.querySelectorAll('[id^="save-"][id$="-btn"]').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
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
  
  // Invoice item calculation
  setupInvoiceItemHandlers();
  
  // Apply CSS fix for topbar positioning
  fixTopBarIssue();
}

// Fix the top bar positioning issue
function fixTopBarIssue() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .page-content {
      padding-top: 80px;
      position: relative;
    }
    .top-bar {
      position: fixed;
      top: 0;
      left: 250px;
      right: 0;
      z-index: 900;
    }
    @media (max-width: 768px) {
      .top-bar {
        left: 0;
      }
    }
  `;
  document.head.appendChild(styleElement);
}

function setupInvoiceItemHandlers() {
  // Add item button
  const addInvoiceItemBtn = document.getElementById('add-invoice-item');
  if (addInvoiceItemBtn) {
    // Remove any existing event listeners
    const newBtn = addInvoiceItemBtn.cloneNode(true);
    addInvoiceItemBtn.parentNode.replaceChild(newBtn, addInvoiceItemBtn);
    
    // Add new event listener
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
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
      updateInvoiceTotals();
    });
  }
  
  // Add events to existing items
  document.querySelectorAll('.invoice-item').forEach(item => {
    addInvoiceItemEvents(item);
  });
  
  // Update totals initially
  updateInvoiceTotals();
  
  // Tax rate change
  const invoiceTax = document.getElementById('invoice-tax');
  if (invoiceTax) {
    invoiceTax.addEventListener('input', updateInvoiceTotals);
  }
  
  // VAT Option change
  const vatOptionSelect = document.getElementById('invoice-vat-option');
  const vatRateInput = document.getElementById('invoice-tax');
  
  if (vatOptionSelect && vatRateInput) {
    vatOptionSelect.addEventListener('change', function() {
      vatRateInput.disabled = (this.value === 'no');
      if (this.value === 'yes') {
        vatRateInput.value = '20.00'; // Default UK VAT rate
      } else {
        vatRateInput.value = '0';
      }
      updateInvoiceTotals();
    });
  }
}

function addInvoiceItemEvents(itemRow) {
  // Calculate amount when quantity or rate changes
  const quantityInput = itemRow.querySelector('.item-quantity');
  const rateInput = itemRow.querySelector('.item-rate');
  const amountSpan = itemRow.querySelector('.item-amount');
  
  if (!quantityInput || !rateInput || !amountSpan) return;
  
  function updateRowAmount() {
    const quantity = parseFloat(quantityInput.value) || 0;
    const rate = parseFloat(rateInput.value) || 0;
    const amount = quantity * rate;
    amountSpan.textContent = `$${amount.toFixed(2)}`;
    
    // Update invoice totals
    updateInvoiceTotals();
  }
  
  quantityInput.addEventListener('input', updateRowAmount);
  rateInput.addEventListener('input', updateRowAmount);
  
  // Remove item button
  const removeBtn = itemRow.querySelector('.remove-item');
  if (removeBtn) {
    removeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      itemRow.remove();
      updateInvoiceTotals();
    });
  }
}

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
  
  subtotalElem.value = `${subtotal.toFixed(2)}`;
  
  if (taxAmountElem) {
    taxAmountElem.value = `${taxAmount.toFixed(2)}`;
  }
  
  totalElem.value = `${total.toFixed(2)}`;
  
  return { subtotal, taxRate, taxAmount, total };
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
  
  // Create or update view invoice modal
  const viewInvoiceModal = document.getElementById('view-invoice-modal');
  if (!viewInvoiceModal) {
    createViewInvoiceModal();
  }
  
  // Get the view invoice modal again after possible creation
  const modal = document.getElementById('view-invoice-modal');
  if (!modal) return false;
  
  // Update invoice header
  const invoiceIdEl = modal.querySelector('.invoice-id');
  const issueDateEl = modal.querySelector('.invoice-date:nth-of-type(2)');
  const dueDateEl = modal.querySelector('.invoice-date:nth-of-type(3)');
  
  if (invoiceIdEl) invoiceIdEl.textContent = invoiceNumber;
  if (issueDateEl) issueDateEl.textContent = `Date: ${moment(issueDate).format('MMM D, YYYY')}`;
  if (dueDateEl) dueDateEl.textContent = `Due: ${moment(dueDate).format('MMM D, YYYY')}`;
  
  // Update client info
  const billToAddress = modal.querySelector('.invoice-address:nth-of-type(2) p');
  if (billToAddress) {
    // In a real app, this would be populated from the CRM system
    let clientAddress = '';
    
    switch (clientSelect.value) {
      case 'acme':
        clientAddress = `Acme Corp<br>
          456 Client Blvd.<br>
          Suite 789<br>
          Client City, ST 98765<br>
          billing@acmecorp.com<br>
          +1 (555) 987-6543`;
        break;
      case 'techgiant':
        clientAddress = `TechGiant Inc<br>
          789 Tech Park<br>
          Building A<br>
          Silicon Valley, CA 94025<br>
          ap@techgiant.com<br>
          +1 (555) 456-7890`;
        break;
      case 'globalsolutions':
        clientAddress = `Global Solutions Ltd<br>
          123 International Plaza<br>
          15th Floor<br>
          New York, NY 10001<br>
          finance@globalsolutions.com<br>
          +1 (555) 123-4567`;
        break;
      default:
        clientAddress = `${clientName}<br>
          Client Address Line 1<br>
          Client Address Line 2<br>
          City, State ZIP<br>
          email@client.com<br>
          +1 (555) 000-0000`;
    }
    
    billToAddress.innerHTML = clientAddress;
  }
  
  // Update invoice items
  const invoiceItemsTable = modal.querySelector('.invoice-items table tbody');
  if (invoiceItemsTable) {
    invoiceItemsTable.innerHTML = '';
    
    invoiceItems.forEach(item => {
      const description = item.querySelector('.item-description')?.value || 'Item Description';
      const quantity = parseFloat(item.querySelector('.item-quantity')?.value) || 0;
      const rate = parseFloat(item.querySelector('.item-rate')?.value) || 0;
      const amount = quantity * rate;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${description}</td>
        <td>${quantity}</td>
        <td>${rate.toFixed(2)}</td>
        <td>${amount.toFixed(2)}</td>
      `;
      
      invoiceItemsTable.appendChild(row);
    });
  }
  
  // Get the values from the form
  const vatOptionElem = document.getElementById('invoice-vat-option');
  const applyVAT = vatOptionElem ? vatOptionElem.value === 'yes' : false;
  
  // Update totals
  const { subtotal, taxRate, taxAmount, total } = updateInvoiceTotals();
  
  const totalsRows = modal.querySelectorAll('.invoice-total-row');
  if (totalsRows.length >= 4) {
    // Subtotal
    const subtotalValue = totalsRows[0].querySelector('.invoice-total-value');
    if (subtotalValue) subtotalValue.textContent = `${subtotal.toFixed(2)}`;
    
    // Tax
    const taxLabel = totalsRows[2].querySelector('.invoice-total-label');
    const taxValue = totalsRows[2].querySelector('.invoice-total-value');
    
    if (taxLabel) taxLabel.textContent = applyVAT ? `VAT (${taxRate}%)` : `Tax (${taxRate}%)`;
    if (taxValue) taxValue.textContent = `${taxAmount.toFixed(2)}`;
    
    // Total
    const totalValue = totalsRows[3].querySelector('.invoice-total-value');
    if (totalValue) totalValue.textContent = `${total.toFixed(2)}`;
  }
  
  return true;
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
    <td>${phone}</td>
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
  
  // If we were in the process of creating an invoice, go back to it
  if (sessionStorage.getItem('invoiceFormState')) {
    sessionStorage.removeItem('invoiceFormState');
    openModal('invoice-modal');
    
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
  }
  
  // If we were in the process of creating a project, go back to it
  if (sessionStorage.getItem('projectFormState')) {
    sessionStorage.removeItem('projectFormState');
    openModal('project-modal');
    
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

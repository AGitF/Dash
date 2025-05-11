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
  // In a real app, this would come from a database
  // For now, returning hardcoded project deadlines
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
  
  // View Invoice
  document.querySelectorAll('.view-invoice-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      openModal('view-invoice-modal');
    });
  });
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
  
  // Set up VAT handling
  const vatOptionSelect = document.getElementById('invoice-vat-option');
  const vatRateInput = document.getElementById('invoice-tax');
  
  if (vatOptionSelect && vatRateInput) {
    vatOptionSelect.addEventListener('change', function() {
      vatRateInput.disabled = (this.value === 'no');
      updateInvoiceTotals();
    });
  }
  
  // Initialize item calculator
  setupInvoiceItemHandlers();
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
  
  // Invoice client selection
  const invoiceClientSelect = document.getElementById('invoice-client');
  if (invoiceClientSelect) {
    invoiceClientSelect.addEventListener('change', function() {
      if (this.value === 'new_customer') {
        // Save current state before switching
        sessionStorage.setItem('invoiceFormState', true);
        
        // Open the add contact modal
        openModal('contact-modal');
        
        // Reset the select back to empty
        this.value = '';
      }
    });
    
    // Check if we're returning from adding a new customer
    if (sessionStorage.getItem('invoiceFormState')) {
      sessionStorage.removeItem('invoiceFormState');
      // This would load the newly added contact in a real app
    }
  }
  
  // Invoice item calculation
  setupInvoiceItemHandlers();
}

function setupInvoiceItemHandlers() {
  // Add item button
  const addInvoiceItemBtn = document.getElementById('add-invoice-item');
  if (addInvoiceItemBtn) {
    addInvoiceItemBtn.addEventListener('click', function() {
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
    removeBtn.addEventListener('click', function() {
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
  const invoiceNumber = document.getElementById('invoice-number').value;
  const clientSelect = document.getElementById('invoice-client');
  
  // Validate client is selected
  if (!clientSelect.value) {
    alert('Please select a client for this invoice');
    return false;
  }
  
  const clientName = clientSelect.options[clientSelect.selectedIndex].text;
  const issueDate = document.getElementById('invoice-date').value;
  const dueDate = document.getElementById('invoice-due-date').value;
  
  // Validate we have items
  const invoiceItems = document.querySelectorAll('.invoice-item');
  if (invoiceItems.length === 0) {
    alert('Please add at least one item to the invoice');
    return false;
  }
  
  // Validate all items have descriptions
  let valid = true;
  invoiceItems.forEach(item => {
    const description = item.querySelector('.item-description').value || '';
    if (description.trim() === '') {
      valid = false;
    }
  });
  
  if (!valid) {
    alert('Please provide a description for all invoice items');
    return false;
  }
  
  // Update invoice preview
  const invoicePreview = document.querySelector('.invoice-preview');
  if (!invoicePreview) return false;
  
  // Update invoice header
  document.querySelector('.invoice-id').textContent = invoiceNumber;
  document.querySelector('.invoice-date:nth-of-type(2)').textContent = `Date: ${moment(issueDate).format('MMM D, YYYY')}`;
  document.querySelector('.invoice-date:nth-of-type(3)').textContent = `Due: ${moment(dueDate).format('MMM D, YYYY')}`;
  
  // Update client info
  const billToAddress = document.querySelector('.invoice-address:nth-of-type(2) p');
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
  const invoiceItemsTable = invoicePreview.querySelector('.invoice-items table tbody');
  if (invoiceItemsTable) {
    invoiceItemsTable.innerHTML = '';
    
    invoiceItems.forEach(item => {
      const description = item.querySelector('.item-description').value || 'Item Description';
      const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
      const rate = parseFloat(item.querySelector('.item-rate').value) || 0;
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
  
  const totalsRows = invoicePreview.querySelectorAll('.invoice-total-row');
  if (totalsRows.length >= 4) {
    // Subtotal
    totalsRows[0].querySelector('.invoice-total-value').textContent = `${subtotal.toFixed(2)}`;
    
    // Tax
    const taxLabel = applyVAT ? `VAT (${taxRate}%)` : `Tax (${taxRate}%)`;
    totalsRows[2].querySelector('.invoice-total-label').textContent = taxLabel;
    totalsRows[2].querySelector('.invoice-total-value').textContent = `${taxAmount.toFixed(2)}`;
    
    // Total
    totalsRows[3].querySelector('.invoice-total-value').textContent = `${total.toFixed(2)}`;
  }
  
  return true;
}

// Function to add a new contact
function addNewContact() {
  const firstName = document.getElementById('contact-first-name').value;
  const lastName = document.getElementById('contact-last-name').value;
  const company = document.getElementById('contact-company').value;
  const email = document.getElementById('contact-email').value;
  const phone = document.getElementById('contact-phone').value;
  const status = document.getElementById('contact-status').value;
  
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
    openModal('invoice-modal');
    
    // In a real app, we would add the new contact to the dropdown
    const invoiceClient = document.getElementById('invoice-client');
    if (invoiceClient) {
      const newOption = document.createElement('option');
      newOption.value = `new-${Date.now()}`; // A temporary unique ID
      newOption.text = `${firstName} ${lastName} (${company})`;
      
      // Add the new option right before the "Add New Customer" option
      const addNewOption = invoiceClient.querySelector('option[value="new_customer"]');
      invoiceClient.insertBefore(newOption, addNewOption);
      
      // Select the new option
      invoiceClient.value = newOption.value;
    }
  }
}

// Function to add a new project
function addNewProject() {
  const projectTitle = document.getElementById('project-title').value;
  const projectClient = document.getElementById('project-client').value;
  const projectDeadline = document.getElementById('project-deadline').value;
  const projectDescription = document.getElementById('project-description').value;
  
  if (!projectTitle || !projectClient || !projectDeadline) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Get the client name
  const clientSelect = document.getElementById('project-client');
  const clientName = clientSelect.options[clientSelect.selectedIndex].text;
  
  // Get the active projects tab
  const activeProjectsTab = document.getElementById('active-projects-tab');
  if (!activeProjectsTab) return;
  
  // Create a new project card
  const newProject = document.createElement('div');
  newProject.className = 'project-card';
  
  // Add the HTML for the new project card
  newProject.innerHTML = `
    <div class="project-status status-green"></div>
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
          <div class="project-assignee">JD</div>
        </div>
        <span class="badge badge-success">New</span>
      </div>
    </div>
  `;
  
  // Add the new project card to the active projects tab
  activeProjectsTab.prepend(newProject);
  
  // In a real app, this would be saved to a database
  // For our demo, we'll add it to our projects array so the calendar can use it
  const projectId = 'new-' + Date.now();
  window.projectDeadlines = window.projectDeadlines || getProjectDeadlines();
  window.projectDeadlines.push({
    id: projectId,
    title: projectTitle,
    deadline: projectDeadline,
    description: projectDescription
  });
  
  // Refresh the calendar to show the new project deadline
  initializeCalendar();
}

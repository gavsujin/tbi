
// Global variables
let currentUser = null;
let currentModal = null;
let currentStep = 1;
let selectedService = null;
let selectedMentor = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let eventData = {};
let currentPaymentMethod = null;
let selectedEWallet = null;
let isProcessing = false;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateScrollProgress();
    initializeEvents();
    generateEventData();
    
    // Add scroll event listener
    window.addEventListener('scroll', updateScrollProgress);
    
    // Initialize payment system if elements exist
    setTimeout(() => {
        const requiredElements = [
            'cardNumber', 'expiryDate', 'cvv', 'cardholderName',
            'cardBtn', 'ewalletBtn', 'cardContainer', 'ewalletContainer'
        ];
        
        let allElementsExist = true;
        requiredElements.forEach(id => {
            if (!document.getElementById(id)) {
                allElementsExist = false;
            }
        });
        
        if (allElementsExist) {
            initializeCardValidation();
            resetPaymentForm();
        }
    }, 500);
});

// Scroll progress indicator
function updateScrollProgress() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    document.getElementById('scrollProgress').style.width = progress + '%';
}

// Authentication functions
function openAuthModal(type) {
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (type === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
    
    modal.style.display = 'block';
    currentModal = modal;
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = 'none';
    currentModal = null;
}

function switchToSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

function switchToLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Simulate login
    currentUser = {
        email: formData.get('email') || event.target.querySelector('input[type="email"]').value,
        name: 'User'
    };
    
    closeAuthModal();
    showSuccessMessage('Login successful', 'Welcome back!');
    updateHeader();
}

function handleSignup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Simulate signup
    currentUser = {
        email: formData.get('email') || event.target.querySelector('input[type="email"]').value,
        name: formData.get('fullName') || event.target.querySelector('input[type="text"]').value
    };
    
    closeAuthModal();
    showSuccessMessage('Account created successfully', `Welcome, ${currentUser.name}!`);
    updateHeader();
}

function updateHeader() {
    console.log('Header updated for user:', currentUser);
}

function logout() {
    currentUser = null;
    updateHeader();
    showSuccessMessage('Logged out', 'You have been logged out successfully.');
}

// Enhanced modal management - Fixed to prevent unwanted closing
function closeModal(modalId) {
    // Only prevent closing if actually processing a payment
    if (isProcessing && modalId && modalId.includes('Modal')) {
        showError('Please wait for the payment to complete before closing.');
        return false;
    }
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        currentModal = null;
        
        // Reset modal content
        resetModalContent(modalId);
    }
    return true;
}

function resetModalContent(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const forms = modal.querySelectorAll('form');
    forms.forEach(form => form.reset());
    
    // Reset to first step/view based on modal type
    if (modalId === 'consultationModal') {
        resetConsultationModal();
    } else if (modalId === 'trainingModal') {
        resetTrainingModal();
    } else if (modalId === 'facilityModal') {
        resetFacilityModal();
    } else {
        // Generic reset for other modals
        const steps = modal.querySelectorAll('[id$="Form"], [id$="Payment"], [id$="Programs"], [id$="Services"]');
        steps.forEach((step, index) => {
            if (step) {
                step.style.display = index === 0 ? 'block' : 'none';
            }
        });
    }
    
    currentStep = 1;
    selectedService = null;
    selectedMentor = null;
    
    // Reset payment form if it exists
    if (modalId === 'retainerModal') {
        resetPaymentForm();
    }
}

// Back navigation functions
function goBackToConsultationServices() {
    resetConsultationModal();
}

function goBackToMentorSelection() {
    document.getElementById('mentorshipPayment').style.display = 'none';
    document.getElementById('mentorshipSelection').style.display = 'block';
}

function goBackToFeasibilityAnalysis() {
    document.getElementById('feasibilityResults').style.display = 'none';
    document.getElementById('feasibilityAnalysis').style.display = 'block';
}

function goBackToTrainingPrograms() {
    resetTrainingModal();
}

function goBackToTrainingRegistration() {
    document.getElementById('trainingPayment').style.display = 'none';
    document.getElementById('trainingRegistration').style.display = 'block';
}

function goBackToFacilityServices() {
    resetFacilityModal();
}

function goBackToFacilityBooking() {
    document.getElementById('facilityPayment').style.display = 'none';
    document.getElementById('facilityBooking').style.display = 'block';
}

function goBackToIncubationForm() {
    document.getElementById('incubationPayment').style.display = 'none';
    document.getElementById('incubationForm').style.display = 'block';
}

function goBackToRetainerForm() {
    document.getElementById('retainerPayment').style.display = 'none';
    document.getElementById('retainerForm').style.display = 'block';
    resetPaymentForm();
}

function goBackToIPSupportForm() {
    document.getElementById('ipSupportPayment').style.display = 'none';
    document.getElementById('ipSupportForm').style.display = 'block';
}

function resetConsultationModal() {
    const modal = document.getElementById('consultationModal');
    const content = modal.querySelector('.modal-content');
    
    content.innerHTML = `
        <span class="close" onclick="closeModal('consultationModal')">&times;</span>
        <div id="consultationServices">
            <h2>Consultation Services</h2>
            <div class="consultation-grid">
                <div class="consultation-option" onclick="selectConsultation('market-validation')">
                    <h3>Market Validation</h3>
                    <p>Validate your business idea with market research and analysis.</p>
                    <button class="option-btn">Get Quote</button>
                </div>
                <div class="consultation-option" onclick="selectConsultation('business-model')">
                    <h3>Business Model Development</h3>
                    <p>Develop and refine your business model for success.</p>
                    <button class="option-btn">Start Planning</button>
                </div>
                <div class="consultation-option" onclick="selectConsultation('mentorship')">
                    <h3>Mentorship & Coaching</h3>
                    <p>Get paired with experienced mentors for ongoing guidance.</p>
                    <button class="option-btn">Find Mentor</button>
                </div>
                <div class="consultation-option" onclick="selectConsultation('business-plan')">
                    <h3>Business Plan Writing</h3>
                    <p>Professional business plan development and review.</p>
                    <button class="option-btn">Write Plan</button>
                </div>
                <div class="consultation-option" onclick="selectConsultation('feasibility')">
                    <h3>Feasibility Study</h3>
                    <p>Comprehensive feasibility analysis for your business idea.</p>
                    <button class="option-btn">Analyze Now</button>
                </div>
                <div class="consultation-option" onclick="selectConsultation('product-development')">
                    <h3>Product Development & Sensory Evaluation</h3>
                    <p>Product development support and sensory testing services.</p>
                    <button class="option-btn">Develop Product</button>
                </div>
            </div>
        </div>
    `;
}

function resetTrainingModal() {
    const modal = document.getElementById('trainingModal');
    const content = modal.querySelector('.modal-content');
    
    content.innerHTML = `
        <span class="close" onclick="closeModal('trainingModal')">&times;</span>
        <div id="trainingPrograms">
            <h2>Business Training Programs</h2>
            <div class="training-options">
                <div class="training-option" onclick="selectTraining('face-to-face')">
                    <h3>Face-to-Face Entrepreneurial Training</h3>
                    <p>Interactive in-person training sessions with hands-on activities.</p>
                    <span class="price">$200 per participant</span>
                    <button class="option-btn">Register Now</button>
                </div>
                <div class="training-option" onclick="selectTraining('online')">
                    <h3>Online Entrepreneurial Training</h3>
                    <p>Flexible online training with live sessions and recorded materials.</p>
                    <span class="price">$150 per participant</span>
                    <button class="option-btn">Join Online</button>
                </div>
                <div class="training-option" onclick="selectTraining('ip-support')">
                    <h3>Intellectual Property Support</h3>
                    <p>Legal guidance and support for patents, trademarks, and IP protection.</p>
                    <span class="price">$500 consultation fee</span>
                    <button class="option-btn">Protect Your IP</button>
                </div>
            </div>
        </div>
    `;
}

function resetFacilityModal() {
    const modal = document.getElementById('facilityModal');
    const content = modal.querySelector('.modal-content');
    
    content.innerHTML = `
        <span class="close" onclick="closeModal('facilityModal')">&times;</span>
        <div id="facilityServices">
            <h2>Facility Services</h2>
            <div class="facility-grid">
                <div class="facility-option" onclick="selectFacility('hot-desk')">
                    <h3>Hot Desk</h3>
                    <p>Flexible workspace with shared amenities.</p>
                    <span class="price">$25 per person/day</span>
                    <button class="option-btn">Book Now</button>
                </div>
                <div class="facility-option" onclick="selectFacility('dedicated-desk')">
                    <h3>Dedicated Desk</h3>
                    <p>Your own permanent desk in a shared workspace.</p>
                    <span class="price">$150 per person/month</span>
                    <button class="option-btn">Reserve Desk</button>
                </div>
                <div class="facility-option" onclick="selectFacility('meeting-room')">
                    <h3>Meeting Room</h3>
                    <p>Private meeting rooms for presentations and conferences.</p>
                    <span class="price">$50 per hour (up to 10 people)</span>
                    <button class="option-btn">Book Room</button>
                </div>
                <div class="facility-option" onclick="selectFacility('event-space')">
                    <h3>Event Space Rental</h3>
                    <p>Large event space for workshops, seminars, and conferences.</p>
                    <span class="price">$200 per day (up to 100 people)</span>
                    <button class="option-btn">Reserve Space</button>
                </div>
            </div>
        </div>
    `;
}

// Service modal functions
function openIncubationModal() {
    const modal = document.getElementById('incubationModal');
    modal.style.display = 'block';
    currentModal = modal;
}

function openRetainerModal() {
    const modal = document.getElementById('retainerModal');
    modal.style.display = 'block';
    currentModal = modal;
    
    // Initialize payment form after modal opens
    setTimeout(() => {
        if (document.getElementById('cardNumber')) {
            initializeCardValidation();
            resetPaymentForm();
        }
    }, 100);
}

function openTrainingModal() {
    const modal = document.getElementById('trainingModal');
    modal.style.display = 'block';
    currentModal = modal;
}

function openConsultationModal() {
    const modal = document.getElementById('consultationModal');
    modal.style.display = 'block';
    currentModal = modal;
}

function openFacilityModal() {
    const modal = document.getElementById('facilityModal');
    modal.style.display = 'block';
    currentModal = modal;
}

function openNetworkingModal() {
    const modal = document.getElementById('networkingModal');
    modal.style.display = 'block';
    currentModal = modal;
    initCalendar();
}

// Form submission functions
function submitIncubationForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Hide form and show payment
    document.getElementById('incubationForm').style.display = 'none';
    document.getElementById('incubationPayment').style.display = 'block';
}

function submitRetainerForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Hide form and show payment
    document.getElementById('retainerForm').style.display = 'none';
    document.getElementById('retainerPayment').style.display = 'block';

    
    // Initialize payment form
    setTimeout(() => {
        if (document.getElementById('cardNumber')) {
            initializeCardValidation();
            resetPaymentForm();
        }
    }, 100);
}

// Training program selection
function selectTraining(type) {
    selectedService = type;
    const modal = document.getElementById('trainingModal');
    const content = modal.querySelector('.modal-content');
    
    let formHTML = '';
    let price = '';
    let title = '';
    
    switch(type) {
        case 'face-to-face':
            title = 'Face-to-Face Entrepreneurial Training Registration';
            price = '$200 per participant';
            formHTML = createTrainingForm(title, price, true);
            break;
        case 'online':
            title = 'Online Entrepreneurial Training Registration';
            price = '$150 per participant';
            formHTML = createTrainingForm(title, price, true);
            break;
        case 'ip-support':
            title = 'Intellectual Property Support Application';
            price = '$500 consultation fee';
            formHTML = createIPSupportForm(title, price);
            break;
    }
    
    content.innerHTML = `
        <span class="close" onclick="closeModal('trainingModal')">&times;</span>
        ${formHTML}
    `;
}

function createTrainingForm(title, price, hasParticipants) {
    return `
        <div id="trainingRegistration">
            <h2>${title}</h2>
            <form onsubmit="submitTrainingForm(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" required name="fullName">
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" required name="email">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Mobile Number *</label>
                        <input type="tel" required name="mobile">
                    </div>
                    <div class="form-group">
                        <label>Number of Participants *</label>
                        <input type="number" required name="participants" min="1" max="50" onchange="updateTrainingPrice()">
                    </div>
                </div>
                ${hasParticipants ? `
                <div class="payment-info">
                    <h3 id="trainingPrice">${price}</h3>
                    <p>Total cost will be calculated based on number of participants.</p>
                </div>
                ` : `
                <div class="payment-info">
                    <h3>${price}</h3>
                    <p>Fixed consultation fee for IP support services.</p>
                </div>
                `}
                <div class="form-buttons">
                    <button type="button" onclick="goBackToTrainingPrograms()" class="back-btn">← Back</button>
                    <button type="submit" class="submit-btn">Continue to Payment</button>
                </div>
            </form>
        </div>
        <div id="trainingPayment" style="display: none;">
            <h2>Payment Information</h2>
            <div class="payment-info">
                <h3 id="finalTrainingPrice">${price}</h3>
            </div>
            <form onsubmit="processPayment(event, 'training')">
                <div class="form-group">
                    <label>Payment Method *</label>
                    <select required name="paymentMethod">
                        <option value="">Select Payment Method</option>
                        <option value="credit">Credit Card</option>
                        <option value="debit">Debit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank">Bank Transfer</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Card Number *</label>
                    <input type="text" required name="cardNumber" placeholder="1234 5678 9012 3456">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Expiry Date *</label>
                        <input type="text" required name="expiry" placeholder="MM/YY">
                    </div>
                    <div class="form-group">
                        <label>CVV *</label>
                        <input type="text" required name="cvv" placeholder="123">
                    </div>
                </div>
                <div class="form-buttons">
                    <button type="button" onclick="goBackToTrainingRegistration()" class="back-btn">← Back</button>
                    <button type="submit" class="submit-btn">Process Payment</button>
                </div>
            </form>
        </div>
    `;
}

function createIPSupportForm(title, price) {
    return `
        <div id="ipSupportForm">
            <h2>${title}</h2>
            <form onsubmit="submitIPSupportForm(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" required name="fullName">
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" required name="email">
                    </div>
                </div>
                <div class="form-group">
                    <label>Mobile Number *</label>
                    <input type="tel" required name="mobile">
                </div>
                <div class="form-group">
                    <label>Upload Patent/Trademark Documents</label>
                    <div class="file-upload">
                        <input type="file" name="documents" accept=".pdf,.doc,.docx" onchange="handleFileUpload(this)">
                        <div class="file-upload-label">
                            Click to upload documents or drag and drop
                        </div>
                    </div>
                </div>
                <div class="payment-info">
                    <h3>${price}</h3>
                    <p>Comprehensive IP consultation and document review.</p>
                </div>
                <div class="form-buttons">
                    <button type="button" onclick="goBackToTrainingPrograms()" class="back-btn">← Back</button>
                    <button type="submit" class="submit-btn">Continue to Payment</button>
                </div>
            </form>
        </div>
        <div id="ipSupportPayment" style="display: none;">
            <h2>Payment Information</h2>
            <div class="payment-info">
                <h3>${price}</h3>
            </div>
            <form onsubmit="processPayment(event, 'ip-support')">
                <div class="form-group">
                    <label>Payment Method *</label>
                    <select required name="paymentMethod">
                        <option value="">Select Payment Method</option>
                        <option value="credit">Credit Card</option>
                        <option value="debit">Debit Card</option>
                        <option value="paypal">PayPal</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Card Number *</label>
                    <input type="text" required name="cardNumber" placeholder="1234 5678 9012 3456">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Expiry Date *</label>
                        <input type="text" required name="expiry" placeholder="MM/YY">
                    </div>
                    <div class="form-group">
                        <label>CVV *</label>
                        <input type="text" required name="cvv" placeholder="123">
                    </div>
                </div>
                <div class="form-buttons">
                    <button type="button" onclick="goBackToIPSupportForm()" class="back-btn">← Back</button>
                    <button type="submit" class="submit-btn">Process Payment</button>
                </div>
            </form>
        </div>
    `;
}

function updateTrainingPrice() {
    const participants = document.querySelector('input[name="participants"]').value;
    const basePrice = selectedService === 'face-to-face' ? 200 : 150;
    const totalPrice = participants * basePrice;
    
    document.getElementById('trainingPrice').textContent = `$${totalPrice} (${participants} × $${basePrice})`;
    const finalPriceElement = document.getElementById('finalTrainingPrice');
    if (finalPriceElement) {
        finalPriceElement.textContent = `$${totalPrice}`;
    }
}

function submitTrainingForm(event) {
    event.preventDefault();
    document.getElementById('trainingRegistration').style.display = 'none';
    document.getElementById('trainingPayment').style.display = 'block';
}

function submitIPSupportForm(event) {
    event.preventDefault();
    document.getElementById('ipSupportForm').style.display = 'none';
    document.getElementById('ipSupportPayment').style.display = 'block';
}

// Consultation service selection
function selectConsultation(type) {
    selectedService = type;
    const modal = document.getElementById('consultationModal');
    const content = modal.querySelector('.modal-content');
    
    let formHTML = '';
    
    switch(type) {
        case 'market-validation':
            formHTML = createConsultationForm('Market Validation Quote Request', true, false);
            break;
        case 'business-model':
            formHTML = createConsultationForm('Business Model Development', false, true);
            break;
        case 'mentorship':
            formHTML = createMentorshipForm();
            break;
        case 'business-plan':
            formHTML = createConsultationForm('Business Plan Writing Service', false, true);
            break;
        case 'feasibility':
            formHTML = createFeasibilityForm();
            break;
        case 'product-development':
            formHTML = createConsultationForm('Product Development & Sensory Evaluation', false, true);
            break;
    }
    
    content.innerHTML = `
        <span class="close" onclick="closeModal('consultationModal')">&times;</span>
        ${formHTML}
    `;
}

function createConsultationForm(title, isQuote, hasUpload) {
    const submitText = isQuote ? 'Request Quote' : 'Submit Application';
    const successMessage = isQuote ? "We'll contact you via email/phone" : 'Submitted Successfully';
    
    return `
        <div id="consultationForm">
            <h2>${title}</h2>
            <form onsubmit="submitConsultationForm(event, '${successMessage}')">
                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" required name="fullName">
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" required name="email">
                    </div>
                </div>
                <div class="form-group">
                    <label>Mobile Number *</label>
                    <input type="tel" required name="mobile">
                </div>
                ${hasUpload ? `
                <div class="form-group">
                    <label>Upload Supporting Documents</label>
                    <div class="file-upload">
                        <input type="file" name="documents" accept=".pdf,.doc,.docx" onchange="handleFileUpload(this)">
                        <div class="file-upload-label">
                            Click to upload documents or drag and drop. (Word/Pdf/Ppt)
                        </div>
                    </div>
                </div>
                ` : ''}
                <div class="form-buttons">
                    <button type="button" onclick="goBackToConsultationServices()" class="back-btn">← Back</button>
                    <button type="submit" class="submit-btn">${submitText}</button>
                </div>
            </form>
        </div>
    `;
}

function createMentorshipForm() {
    return `
        <div id="mentorshipSelection">
            <h2>Available Mentors</h2>
            <div class="mentor-grid">
                ${generateMentors()}
            </div>
            <div class="form-buttons">
                <button type="button" onclick="goBackToConsultationServices()" class="back-btn">← Back</button>
                <button onclick="proceedToMentorPayment()" class="submit-btn" disabled id="selectMentorBtn">Select Mentor</button>
            </div>
        </div>
        <div id="mentorshipPayment" style="display: none;">
            <h2>Mentorship Payment</h2>
            <div id="selectedMentorInfo"></div>
            <form onsubmit="processPayment(event, 'mentorship')">
                <div class="form-group">
                    <label>Frequency *</label>
                    <select required name="frequency" onchange="updateMentorshipPrice()">
                        <option value="">Select Frequency</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                <div class="payment-info">
                    <h3 id="mentorshipPrice">Select frequency to see price</h3>
                </div>
                <div class="form-group">
                    <label>Payment Method *</label>
                    <select required name="paymentMethod">
                        <option value="">Select Payment Method</option>
                        <option value="credit">Credit Card</option>
                        <option value="debit">Debit Card</option>
                        <option value="paypal">PayPal</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Card Number *</label>
                    <input type="text" required name="cardNumber" placeholder="1234 5678 9012 3456">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Expiry Date *</label>
                        <input type="text" required name="expiry" placeholder="MM/YY">
                    </div>
                    <div class="form-group">
                        <label>CVV *</label>
                        <input type="text" required name="cvv" placeholder="123">
                    </div>
                </div>
                <div class="form-buttons">
                    <button type="button" onclick="goBackToMentorSelection()" class="back-btn">← Back</button>
                    <button type="submit" class="submit-btn">Process Payment</button>
                </div>
            </form>
        </div>
    `;
}

function createFeasibilityForm() {
    return `
        <div id="feasibilityAnalysis">
            <h2>Feasibility Study</h2>
            <form onsubmit="return false;">
                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" required name="fullName">
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" required name="email">
                    </div>
                </div>
                <div class="form-group">
                    <label>Mobile Number *</label>
                    <input type="tel" required name="mobile">
                </div>
                <div class="form-group">
                    <label>Upload Business Concept Documents</label>
                    <div class="file-upload">
                        <input type="file" name="documents" accept=".pdf,.doc,.docx" onchange="handleFileUpload(this)" required>
                        <div class="file-upload-label">
                            Click to upload your business concept documents.
                            (Word/Pdf/Ppt)
                        </div>
                    </div>
                </div>
                <div class="form-buttons">
                    <button type="button" onclick="goBackToConsultationServices()" class="back-btn">← Back</button>
                    <button onclick="analyzeFeasibility()" class="submit-btn" disabled id="analyzeBtn">Analyze</button>
                </div>
            </form>
        </div>
        <div id="feasibilityResults" style="display: none;">
            <h2>Feasibility Analysis Results</h2>
            <div class="payment-info">
                <h3 id="feasibilityPercentage">Feasibility Score: 78%</h3>
                <p>Based on market analysis, financial projections, and risk assessment.</p>
            </div>
            <div style="margin: 2rem 0;">
                <h4>Key Findings:</h4>
                <ul style="text-align: left; margin-left: 2rem;">
                    <li>Strong market demand identified</li>
                    <li>Competitive landscape is moderate</li>
                    <li>Financial projections show positive ROI</li>
                    <li>Implementation timeline is realistic</li>
                </ul>
            </div>
            <div class="form-buttons">
                <button type="button" onclick="goBackToFeasibilityAnalysis()" class="back-btn">← Back</button>
                <button onclick="closeModal('consultationModal')" class="submit-btn">Done</button>
            </div>
        </div>
    `;
}

function generateMentors() {
    const mentors = [
        { name: 'Dr. Sarah Johnson', expertise: 'Technology & Innovation', rating: 4.9, price: 150 },
        { name: 'Mark Rodriguez', expertise: 'Business Strategy', rating: 4.8, price: 120 },
        { name: 'Lisa Chen', expertise: 'Marketing & Sales', rating: 4.9, price: 140 },
        { name: 'David Wilson', expertise: 'Financial Planning', rating: 4.7, price: 130 },
        { name: 'Prof. Maria Santos', expertise: 'Operations Management', rating: 4.8, price: 160 },
        { name: 'James Taylor', expertise: 'Legal & Compliance', rating: 4.6, price: 180 }
    ];
    
    return mentors.map((mentor, index) => `
        <div class="mentor-card" onclick="selectMentorCard(${index})">
            <div class="mentor-avatar">${mentor.name.split(' ').map(n => n[0]).join('')}</div>
            <h4>${mentor.name}</h4>
            <p>${mentor.expertise}</p>
            <div class="mentor-rating">${'★'.repeat(Math.floor(mentor.rating))} ${mentor.rating}</div>
            <div class="mentor-price">$${mentor.price}/session</div>
        </div>
    `).join('');
}

function selectMentorCard(index) {
    const mentors = [
        { name: 'Dr. Sarah Johnson', expertise: 'Technology & Innovation', rating: 4.9, price: 150 },
        { name: 'Mark Rodriguez', expertise: 'Business Strategy', rating: 4.8, price: 120 },
        { name: 'Lisa Chen', expertise: 'Marketing & Sales', rating: 4.9, price: 140 },
        { name: 'David Wilson', expertise: 'Financial Planning', rating: 4.7, price: 130 },
        { name: 'Prof. Maria Santos', expertise: 'Operations Management', rating: 4.8, price: 160 },
        { name: 'James Taylor', expertise: 'Legal & Compliance', rating: 4.6, price: 180 }
    ];
    
    // Remove previous selection
    document.querySelectorAll('.mentor-card').forEach(card => card.classList.remove('selected'));
    
    // Select current mentor
    document.querySelectorAll('.mentor-card')[index].classList.add('selected');
    selectedMentor = mentors[index];
    
    // Enable select button
    document.getElementById('selectMentorBtn').disabled = false;
}

function proceedToMentorPayment() {
    if (!selectedMentor) return;
    
    document.getElementById('mentorshipSelection').style.display = 'none';
    document.getElementById('mentorshipPayment').style.display = 'block';
    
    // Update selected mentor info
    document.getElementById('selectedMentorInfo').innerHTML = `
        <div class="payment-info">
            <h3>${selectedMentor.name}</h3>
            <p>${selectedMentor.expertise} • Rating: ${selectedMentor.rating}/5</p>
        </div>
    `;
}

function updateMentorshipPrice() {
    if (!selectedMentor) return;
    
    const frequency = document.querySelector('select[name="frequency"]').value;
    const basePrice = selectedMentor.price;
    let totalPrice = basePrice;
    let description = '';
    
    switch(frequency) {
        case 'weekly':
            totalPrice = basePrice;
            description = 'per session (weekly)';
            break;
        case 'monthly':
            totalPrice = basePrice * 4 * 0.9; // 10% discount for monthly
            description = 'per month (4 sessions)';
            break;
        case 'yearly':
            totalPrice = basePrice * 48 * 0.8; // 20% discount for yearly
            description = 'per year (48 sessions)';
            break;
    }
    
    document.getElementById('mentorshipPrice').textContent = `$${Math.round(totalPrice)} ${description}`;
}

function submitConsultationForm(event, successMessage) {
    event.preventDefault();
    closeModal('consultationModal');
    showSuccessMessage('Success', successMessage);
}

function analyzeFeasibility() {
    document.getElementById('feasibilityAnalysis').style.display = 'none';
    document.getElementById('feasibilityResults').style.display = 'block';
    
    // Simulate analysis with random percentage
    const percentage = Math.floor(Math.random() * 30) + 60; // 60-90%
    document.getElementById('feasibilityPercentage').textContent = `Feasibility Score: ${percentage}%`;
}

// Facility service selection
function selectFacility(type) {
    selectedService = type;
    const modal = document.getElementById('facilityModal');
    const content = modal.querySelector('.modal-content');
    
    let title = '';
    let basePrice = 0;
    let unit = '';
    let maxPeople = 1;
    
    switch(type) {
        case 'hot-desk':
            title = 'Hot Desk Booking';
            basePrice = 25;
            unit = 'per person/day';
            maxPeople = 10;
            break;
        case 'dedicated-desk':
            title = 'Dedicated Desk Reservation';
            basePrice = 150;
            unit = 'per person/month';
            maxPeople = 5;
            break;
        case 'meeting-room':
            title = 'Meeting Room Booking';
            basePrice = 50;
            unit = 'per hour (up to 10 people)';
            maxPeople = 10;
            break;
        case 'event-space':
            title = 'Event Space Rental';
            basePrice = 200;
            unit = 'per day (up to 100 people)';
            maxPeople = 100;
            break;
    }
    
    content.innerHTML = `
        <span class="close" onclick="closeModal('facilityModal')">&times;</span>
        <div id="facilityBooking">
            <h2>${title}</h2>
            <form onsubmit="submitFacilityForm(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" required name="fullName">
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" required name="email">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Mobile Number *</label>
                        <input type="tel" required name="mobile">
                    </div>
                    <div class="form-group">
                        <label>Number of People *</label>
                        <input type="number" required name="people" min="1" max="${maxPeople}" value="1" onchange="updateFacilityPrice('${type}', ${basePrice})">
                    </div>
                </div>
                <div class="payment-info">
                    <h3 id="facilityPrice">$${basePrice} ${unit}</h3>
                    <p>Total cost will be calculated based on number of people.</p>
                </div>
                <div class="form-buttons">
                    <button type="button" onclick="goBackToFacilityServices()" class="back-btn">← Back</button>
                    <button type="submit" class="submit-btn">Continue to Payment</button>
                </div>
            </form>
        </div>
        <div id="facilityPayment" style="display: none;">
            <h2>Payment Information</h2>
            <div class="payment-info">
                <h3 id="finalFacilityPrice">$${basePrice} ${unit}</h3>
            </div>
            <form onsubmit="processPayment(event, 'facility')">
                <div class="form-group">
                    <label>Payment Method *</label>
                    <select required name="paymentMethod">
                        <option value="">Select Payment Method</option>
                        <option value="credit">Credit Card</option>
                        <option value="debit">Debit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank">Bank Transfer</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Card Number *</label>
                    <input type="text" required name="cardNumber" placeholder="1234 5678 9012 3456">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Expiry Date *</label>
                        <input type="text" required name="expiry" placeholder="MM/YY">
                    </div>
                    <div class="form-group">
                        <label>CVV *</label>
                        <input type="text" required name="cvv" placeholder="123">
                    </div>
                </div>
                <div class="form-buttons">
                    <button type="button" onclick="goBackToFacilityBooking()" class="back-btn">← Back</button>
                    <button type="submit" class="submit-btn">Process Payment</button>
                </div>
            </form>
        </div>
    `;
}

function updateFacilityPrice(type, basePrice) {
    const peopleInput = document.querySelector('input[name="people"]');
    if (!peopleInput) return;
    
    const people = peopleInput.value;
    let totalPrice = basePrice;
    let unit = '';
    
    switch(type) {
        case 'hot-desk':
            totalPrice = people * basePrice;
            unit = `(${people} × $${basePrice}/day)`;
            break;
        case 'dedicated-desk':
            totalPrice = people * basePrice;
            unit = `(${people} × $${basePrice}/month)`;
            break;
        case 'meeting-room':
            totalPrice = basePrice; // Fixed price regardless of people (up to 10)
            unit = 'per hour';
            break;
        case 'event-space':
            totalPrice = basePrice; // Fixed price regardless of people (up to 100)
            unit = 'per day';
            break;
    }
    
    const facilityPriceElement = document.getElementById('facilityPrice');
    const finalFacilityPriceElement = document.getElementById('finalFacilityPrice');
    
    if (facilityPriceElement) {
        facilityPriceElement.textContent = `$${totalPrice} ${unit}`;
    }
    if (finalFacilityPriceElement) {
        finalFacilityPriceElement.textContent = `$${totalPrice} ${unit}`;
    }
}

function submitFacilityForm(event) {
    event.preventDefault();
    document.getElementById('facilityBooking').style.display = 'none';
    document.getElementById('facilityPayment').style.display = 'block';
}

// Enhanced payment processing
function processPayment(event, serviceType) {
    event.preventDefault();
    isProcessing = true;
    
    // Simulate payment processing
    setTimeout(() => {
        isProcessing = false;
        if (currentModal) {
            currentModal.style.display = 'none';
        }
        showSuccessMessage('Payment Successful!', 'Your payment has been processed successfully.');
    }, 1000);
}

// Calendar functions
function initCalendar() {
    updateCalendar();
}

function updateCalendar() {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentMonthElement = document.getElementById('currentMonth');
    if (currentMonthElement) {
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
    
    const calendar = document.getElementById('calendar');
    if (!calendar) return;
    
    calendar.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-header-day';
        dayElement.textContent = day;
        calendar.appendChild(dayElement);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendar.appendChild(emptyDay);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Check if this day has events
        const monthKey = `${currentYear}-${currentMonth}`;
        if (eventData[monthKey] && eventData[monthKey].includes(day)) {
            dayElement.classList.add('has-event');
            dayElement.onclick = () => showEventDetails(day);
        }
        
        calendar.appendChild(dayElement);
    }
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar();
}

function generateEventData() {
    // Generate random events for each month
    const currentDate = new Date();
    
    for (let year = currentDate.getFullYear(); year <= currentDate.getFullYear() + 1; year++) {
        for (let month = 0; month < 12; month++) {
            const monthKey = `${year}-${month}`;
            eventData[monthKey] = [];
            
            // Generate 6 random event days per month
            for (let i = 0; i < 6; i++) {
                const randomDay = Math.floor(Math.random() * 28) + 1; // Safe for all months
                if (!eventData[monthKey].includes(randomDay)) {
                    eventData[monthKey].push(randomDay);
                }
            }
        }
    }
}

function showEventDetails(day) {
    const events = [
        {
            title: 'Startup Pitch Night',
            time: '6:00 PM - 9:00 PM',
            description: 'Present your startup idea to investors and mentors.'
        },
        {
            title: 'Entrepreneurship Workshop',
            time: '2:00 PM - 5:00 PM',
            description: 'Learn the fundamentals of starting a business.'
        },
        {
            title: 'Networking Mixer',
            time: '7:00 PM - 10:00 PM',
            description: 'Connect with fellow entrepreneurs and industry professionals.'
        },
        {
            title: 'Tech Innovation Seminar',
            time: '10:00 AM - 12:00 PM',
            description: 'Explore the latest trends in technology and innovation.'
        },
        {
            title: 'Business Model Canvas Workshop',
            time: '1:00 PM - 4:00 PM',
            description: 'Design and validate your business model.'
        },
        {
            title: 'Investor Meetup',
            time: '5:00 PM - 8:00 PM',
            description: 'Meet potential investors for your startup.'
        }
    ];
    
    // Randomly select 1-3 events for this day
    const numEvents = Math.floor(Math.random() * 3) + 1;
    const selectedEvents = [];
    for (let i = 0; i < numEvents; i++) {
        const event = events[Math.floor(Math.random() * events.length)];
        if (!selectedEvents.find(e => e.title === event.title)) {
            selectedEvents.push(event);
        }
    }
    
    const eventDetails = document.getElementById('eventDetails');
    const eventInfo = document.getElementById('eventInfo');
    
    if (eventInfo) {
        eventInfo.innerHTML = selectedEvents.map(event => `
            <div class="event-item">
                <h4>${event.title}</h4>
                <p class="event-time">${event.time}</p>
                <p>${event.description}</p>
            </div>
        `).join('');
    }
    
    if (eventDetails) {
        eventDetails.style.display = 'block';
    }
    
    // Update selected day
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    // In a real implementation, we'd properly reference the clicked element
}

// Utility functions
function handleFileUpload(input) {
    const label = input.nextElementSibling;
    const fileUpload = input.parentElement;
    
    if (input.files.length > 0) {
        label.textContent = `Selected: ${input.files[0].name}`;
        fileUpload.classList.add('has-file');
        
        // Enable analyze button if it exists
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.disabled = false;
        }
    } else {
        label.textContent = 'Click to upload documents or drag and drop';
        fileUpload.classList.remove('has-file');
    }
}

function initializeEvents() {
    // Close modals when clicking outside (but not during processing)
    window.onclick = function(event) {
        if (event.target.classList.contains('modal') && !isProcessing) {
            const modalId = event.target.id;
            closeModal(modalId);
        }
    };
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Payment method selection
function selectPaymentMethod(method, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    if (isProcessing) return;
    
    currentPaymentMethod = method;
    
    // Hide payment method selection
    const paymentMethods = document.getElementById('paymentMethods');
    if (paymentMethods) {
        paymentMethods.style.display = 'none';
    }
    
    // Update button states
    const cardBtn = document.getElementById('cardBtn');
    const ewalletBtn = document.getElementById('ewalletBtn');
    
    if (cardBtn) cardBtn.classList.remove('active');
    if (ewalletBtn) ewalletBtn.classList.remove('active');
    
    if (method === 'card') {
        if (cardBtn) cardBtn.classList.add('active');
        showCardContainer();
    } else if (method === 'ewallet') {
        if (ewalletBtn) ewalletBtn.classList.add('active');
        showEWalletContainer();
    }
    
    hideMessages();
}

// Show card payment container
function showCardContainer() {
    hideAllContainers();
    const cardContainer = document.getElementById('cardContainer');
    if (cardContainer) {
        cardContainer.classList.add('active');
        focusFirstInput('cardContainer');
    }
}

// Show e-wallet selection container
function showEWalletContainer() {
    hideAllContainers();
    const ewalletContainer = document.getElementById('ewalletContainer');
    if (ewalletContainer) {
        ewalletContainer.classList.add('active');
    }
}

// Hide all form containers
function hideAllContainers() {
    const containers = ['cardContainer', 'ewalletContainer', 'gcashContainer', 'mayaContainer', 'paypalContainer'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.classList.remove('active');
        }
    });
}

// E-wallet selection
function selectEWallet(wallet, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    if (isProcessing) return;
    
    selectedEWallet = wallet;
    
    // Show specific e-wallet container
    hideAllContainers();
    
    const containerMap = {
        'gcash': 'gcashContainer',
        'maya': 'mayaContainer',
        'paypal': 'paypalContainer'
    };
    
    const containerId = containerMap[wallet];
    if (containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.add('active');
        }
    }
}

// Navigation functions
function goBackToSelection() {
    hideAllContainers();
    const paymentMethods = document.getElementById('paymentMethods');
    if (paymentMethods) {
        paymentMethods.style.display = 'flex';
    }
    
    // Reset button states
    const cardBtn = document.getElementById('cardBtn');
    const ewalletBtn = document.getElementById('ewalletBtn');
    
    if (cardBtn) cardBtn.classList.remove('active');
    if (ewalletBtn) ewalletBtn.classList.remove('active');
    
    currentPaymentMethod = null;
    selectedEWallet = null;
    hideMessages();
}

function goBackToEWallet() {
    hideAllContainers();
    const ewalletContainer = document.getElementById('ewalletContainer');
    if (ewalletContainer) {
        ewalletContainer.classList.add('active');
    }
    selectedEWallet = null;
}

// Auto-focus first input when section becomes active
function focusFirstInput(containerId) {
    const container = document.getElementById(containerId);
    if (container && container.classList.contains('active')) {
        const firstInput = container.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

// Card validation initialization
function initializeCardValidation() {
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    const cardholderName = document.getElementById('cardholderName');
    
    // Only initialize if elements exist
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        return;
    }
    
    // Remove existing event listeners to avoid duplicates
    cardNumber.removeEventListener('input', handleCardNumber);
    expiryDate.removeEventListener('input', handleExpiryDate);
    cvv.removeEventListener('input', handleCVV);
    cardholderName.removeEventListener('input', handleCardholderName);
    
    // Add event listeners
    cardNumber.addEventListener('input', handleCardNumber);
    expiryDate.addEventListener('input', handleExpiryDate);
    cvv.addEventListener('input', handleCVV);
    cardholderName.addEventListener('input', handleCardholderName);
}

function handleCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    
    e.target.value = formattedValue;
    
    validateCardNumber(value);
    detectCardBrand(value);
}

function handleExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
    validateExpiryDate(value);
}

function handleCVV(e) {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
    validateCVV(value);
}

function handleCardholderName(e) {
    validateCardholderName(e.target.value);
}

// Validate card number using Luhn algorithm
function validateCardNumber(number) {
    const input = document.getElementById('cardNumber');
    const validation = document.getElementById('cardNumberValidation');
    
    if (!input || !validation) return false;
    
    if (number.length === 0) {
        updateValidation(input, validation, '', '');
        return false;
    }
    
    if (number.length < 13) {
        updateValidation(input, validation, 'error', 'Card number is too short');
        return false;
    }
    
    if (!luhnCheck(number)) {
        updateValidation(input, validation, 'error', 'Invalid card number');
        return false;
    }
    
    updateValidation(input, validation, 'success', 'Valid card number');
    return true;
}

// Luhn algorithm implementation
function luhnCheck(cardNumber) {
    let sum = 0;
    let alternate = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let n = parseInt(cardNumber.charAt(i), 10);
        
        if (alternate) {
            n *= 2;
            if (n > 9) {
                n = (n % 10) + 1;
            }
        }
        
        sum += n;
        alternate = !alternate;
    }
    
    return (sum % 10) === 0;
}

// Detect and highlight card brand (VISA and MasterCard only)
function detectCardBrand(number) {
    const brands = document.querySelectorAll('.brand-icon');
    brands.forEach(brand => brand.classList.remove('active'));
    
    let detectedBrand = '';
    
    if (number.match(/^4/)) {
        detectedBrand = 'visa';
    } else if (number.match(/^5[1-5]/) || number.match(/^2[2-7]/)) {
        detectedBrand = 'mastercard';
    }
    
    if (detectedBrand) {
        const brandElement = document.querySelector(`[data-brand="${detectedBrand}"]`);
        if (brandElement) {
            brandElement.classList.add('active');
        }
    }
}

// Validate expiry date
function validateExpiryDate(date) {
    const input = document.getElementById('expiryDate');
    const validation = document.getElementById('expiryValidation');
    
    if (!input || !validation) return false;
    
    if (date.length === 0) {
        updateValidation(input, validation, '', '');
        return false;
    }
    
    if (date.length < 5) {
        updateValidation(input, validation, 'error', 'Enter MM/YY format');
        return false;
    }
    
    const [month, year] = date.split('/');
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt('20' + year, 10);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (monthNum < 1 || monthNum > 12) {
        updateValidation(input, validation, 'error', 'Invalid month');
        return false;
    }
    
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
        updateValidation(input, validation, 'error', 'Card has expired');
        return false;
    }
    
    updateValidation(input, validation, 'success', 'Valid expiry date');
    return true;
}

// Validate CVV
function validateCVV(cvv) {
    const input = document.getElementById('cvv');
    const validation = document.getElementById('cvvValidation');
    
    if (!input || !validation) return false;
    
    if (cvv.length === 0) {
        updateValidation(input, validation, '', '');
        return false;
    }
    
    if (cvv.length < 3) {
        updateValidation(input, validation, 'error', 'CVV too short');
        return false;
    }
    
    if (cvv.length > 4) {
        updateValidation(input, validation, 'error', 'CVV too long');
        return false;
    }
    
    updateValidation(input, validation, 'success', 'Valid CVV');
    return true;
}

// Validate cardholder name
function validateCardholderName(name) {
    const input = document.getElementById('cardholderName');
    const validation = document.getElementById('nameValidation');
    
    if (!input || !validation) return false;
    
    if (name.length === 0) {
        updateValidation(input, validation, '', '');
        return false;
    }
    
    if (name.length < 2) {
        updateValidation(input, validation, 'error', 'Name too short');
        return false;
    }
    
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        updateValidation(input, validation, 'error', 'Only letters and spaces allowed');
        return false;
    }
    
    updateValidation(input, validation, 'success', 'Valid name');
    return true;
}

// Update validation UI
function updateValidation(input, validation, type, message) {
    if (!input || !validation) return;
    
    input.classList.remove('valid', 'invalid');
    validation.classList.remove('show', 'error', 'success');
    
    if (type) {
        input.classList.add(type === 'success' ? 'valid' : 'invalid');
        validation.classList.add('show', type);
        validation.textContent = message;
    }
}

// Validate entire card form
function validateCardForm() {
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    const cardholderName = document.getElementById('cardholderName');
    
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        return false;
    }
    
    const cardNumberValue = cardNumber.value.replace(/\s/g, '');
    const expiryValue = expiryDate.value;
    const cvvValue = cvv.value;
    const nameValue = cardholderName.value;
    
    const isCardValid = validateCardNumber(cardNumberValue);
    const isExpiryValid = validateExpiryDate(expiryValue);
    const isCVVValid = validateCVV(cvvValue);
    const isNameValid = validateCardholderName(nameValue);
    
    return isCardValid && isExpiryValid && isCVVValid && isNameValid;
}

// Process card payment
function processCardPayment() {
    if (isProcessing) return;
    
    if (!validateCardForm()) {
        showError('Please fill in all fields correctly');
        return;
    }
    
    isProcessing = true;
    const button = document.getElementById('cardPayButton');
    const buttonText = document.getElementById('cardPayText');
    
    if (button && buttonText) {
        button.classList.add('processing');
        button.disabled = true;
        buttonText.textContent = 'Processing...';
    }
    
    // Simulate payment processing
    setTimeout(() => {
        completePayment('card');
    }, 3000);
}

// Complete e-wallet payment
function completeEWalletPayment(wallet) {
    if (isProcessing) return;
    
    if (!wallet) wallet = selectedEWallet;
    if (!wallet) return;
    
    isProcessing = true;
    const button = document.getElementById(`${wallet}PayButton`);
    const buttonText = document.getElementById(`${wallet}PayText`);
    
    if (button && buttonText) {
        button.classList.add('processing');
        button.disabled = true;
        buttonText.textContent = 'Processing...';
    }
    
    // Simulate payment processing
    setTimeout(() => {
        completePayment('ewallet', wallet);
    }, 2000);
}

// Complete payment (success simulation)
function completePayment(method, wallet) {
    isProcessing = false;
    
    // Reset button states
    const cardButton = document.getElementById('cardPayButton');
    if (cardButton) {
        cardButton.classList.remove('processing');
        cardButton.disabled = false;
        const cardPayText = document.getElementById('cardPayText');
        if (cardPayText) {
            cardPayText.textContent = 'Pay $150.00';
        }
    }
    
    // Reset e-wallet buttons
    if (wallet) {
        const ewalletButton = document.getElementById(`${wallet}PayButton`);
        const ewalletButtonText = document.getElementById(`${wallet}PayText`);
        if (ewalletButton && ewalletButtonText) {
            ewalletButton.classList.remove('processing');
            ewalletButton.disabled = false;
            ewalletButtonText.textContent = 'Complete Payment';
        }
    }
    
    // Show success message
    showSuccess('Payment completed successfully!');
    
    // Close modal after success
    setTimeout(() => {
        if (currentModal) {
            currentModal.style.display = 'none';
            currentModal = null;
        }
        showSuccessMessage('Payment Successful!', 'Your payment has been processed successfully.');
        resetPaymentForm();
    }, 2000);
}

// Show success message
function showSuccess(message) {
    const successMsg = document.getElementById('successMessage');
    if (successMsg) {
        successMsg.textContent = message;
        successMsg.classList.add('show');
        hideError();
    }
}

// Show error message
function showError(message) {
    const errorMsg = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    if (errorMsg && errorText) {
        errorText.textContent = message;
        errorMsg.classList.add('show');
        hideSuccess();
    }
}

// Hide messages
function hideMessages() {
    hideSuccess();
    hideError();
}

function hideSuccess() {
    const successMsg = document.getElementById('successMessage');
    if (successMsg) {
        successMsg.classList.remove('show');
    }
}

function hideError() {
    const errorMsg = document.getElementById('errorMessage');
    if (errorMsg) {
        errorMsg.classList.remove('show');
    }
}

// Reset payment form
function resetPaymentForm() {
    currentPaymentMethod = null;
    selectedEWallet = null;
    isProcessing = false;
    
    // Show payment method selection
    const paymentMethods = document.getElementById('paymentMethods');
    if (paymentMethods) {
        paymentMethods.style.display = 'flex';
    }
    
    // Reset button states
    const cardBtn = document.getElementById('cardBtn');
    const ewalletBtn = document.getElementById('ewalletBtn');
    
    if (cardBtn) cardBtn.classList.remove('active');
    if (ewalletBtn) ewalletBtn.classList.remove('active');
    
    // Hide all containers
    hideAllContainers();
    
    // Clear form inputs
    const inputs = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = '';
            input.classList.remove('valid', 'invalid');
        }
    });
    
    // Reset validation states
    const validations = document.querySelectorAll('.validation-message');
    validations.forEach(validation => {
        validation.classList.remove('show', 'error', 'success');
        validation.textContent = '';
    });
    
    // Reset card brands
    const brands = document.querySelectorAll('.brand-icon');
    brands.forEach(brand => brand.classList.remove('active'));
    
    // Reset e-wallet selections
    const ewalletBtns = document.querySelectorAll('.ewallet-btn');
    ewalletBtns.forEach(btn => btn.classList.remove('selected'));
    
    hideMessages();
}

// Close payment modal
function closePayment() {
    if (isProcessing) {
        showError('Please wait for the current payment to complete');
        return false;
    }
    
    if (confirm('Are you sure you want to close the payment form?')) {
        resetPaymentForm();
        return true;
    }
    return false;
}

// Show success message function
function showSuccessMessage(title, message) {
    const modal = document.getElementById('successModal');
    if (modal) {
        const successTitle = document.getElementById('successTitle');
        const successMessage = document.getElementById('successMessage');
        
        if (successTitle) successTitle.textContent = title;
        if (successMessage) successMessage.textContent = message;
        
        modal.style.display = 'none';
    } else {
        // Fallback alert if success modal doesn't exist
        alert(title + ': ' + message);
    }
}

// Add event listeners for better UX
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && currentModal && !isProcessing) {
        const modalId = currentModal.id;
        closeModal(modalId);
    }
});

// Prevent form submission on Enter key in input fields
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault();
        
        if (currentPaymentMethod === 'card') {
            processCardPayment();
        } else if (currentPaymentMethod === 'ewallet' && selectedEWallet) {
            completeEWalletPayment(selectedEWallet);
        }
    }
});

// Expose functions to global scope for onclick handlers
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.closeModal = closeModal;
window.openIncubationModal = openIncubationModal;
window.openRetainerModal = openRetainerModal;
window.openTrainingModal = openTrainingModal;
window.openConsultationModal = openConsultationModal;
window.openFacilityModal = openFacilityModal;
window.openNetworkingModal = openNetworkingModal;
window.submitIncubationForm = submitIncubationForm;
window.submitRetainerForm = submitRetainerForm;
window.selectTraining = selectTraining;
window.selectConsultation = selectConsultation;
window.selectFacility = selectFacility;
window.updateTrainingPrice = updateTrainingPrice;
window.submitTrainingForm = submitTrainingForm;
window.submitIPSupportForm = submitIPSupportForm;
window.submitConsultationForm = submitConsultationForm;
window.submitFacilityForm = submitFacilityForm;
window.updateFacilityPrice = updateFacilityPrice;
window.processPayment = processPayment;
window.changeMonth = changeMonth;
window.showEventDetails = showEventDetails;
window.handleFileUpload = handleFileUpload;
window.selectMentorCard = selectMentorCard;
window.proceedToMentorPayment = proceedToMentorPayment;
window.updateMentorshipPrice = updateMentorshipPrice;
window.analyzeFeasibility = analyzeFeasibility;
window.goBackToConsultationServices = goBackToConsultationServices;
window.goBackToMentorSelection = goBackToMentorSelection;
window.goBackToFeasibilityAnalysis = goBackToFeasibilityAnalysis;
window.goBackToTrainingPrograms = goBackToTrainingPrograms;
window.goBackToTrainingRegistration = goBackToTrainingRegistration;
window.goBackToFacilityServices = goBackToFacilityServices;
window.goBackToFacilityBooking = goBackToFacilityBooking;
window.goBackToIncubationForm = goBackToIncubationForm;
window.goBackToRetainerForm = goBackToRetainerForm;
window.goBackToIPSupportForm = goBackToIPSupportForm;
window.selectPaymentMethod = selectPaymentMethod;
window.showCardContainer = showCardContainer;
window.showEWalletContainer = showEWalletContainer;
window.selectEWallet = selectEWallet;
window.goBackToSelection = goBackToSelection;
window.goBackToEWallet = goBackToEWallet;
window.processCardPayment = processCardPayment;
window.completeEWalletPayment = completeEWalletPayment;
window.closePayment = closePayment;
window.showSuccessMessage = showSuccessMessage;
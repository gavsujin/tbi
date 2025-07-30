// Smooth scrolling for navigation links
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

        // Enhanced scroll effects
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            const scrollProgress = document.getElementById('scrollProgress');
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight * 100;

            // Header background opacity on scroll
            if (header) {
                if (scrollTop > 50) {
                    header.classList.add('scrolled');
                    header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    header.style.backdropFilter = 'blur(10px)';
                    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    header.classList.remove('scrolled');
                    header.style.backgroundColor = 'transparent';
                    header.style.backdropFilter = 'none';
                    header.style.boxShadow = 'none';
                }
            }

            // Update scroll progress bar
            if (scrollProgress) {
                scrollProgress.style.width = scrollPercent + '%';
            }

            // Parallax effect for hero section
            const hero = document.querySelector('.hero, #hero');
            if (hero && scrollTop < hero.offsetHeight) {
                hero.style.transform = `translateY(${scrollTop * 0.5}px)`;
            }

            // Fade in animations for sections
            const sections = document.querySelectorAll('section, .section');
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const windowHeight = window.innerHeight;
                
                if (scrollTop + windowHeight > sectionTop + 100) {
                    section.classList.add('fade-in');
                }
            });

            // Active navigation highlighting - UPDATED
            const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
            const sections2 = document.querySelectorAll('section[id]');
            
            let current = '';
            sections2.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                const sectionHeight = section.offsetHeight;
                
                if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                // Remove active class from all navigation links
                link.classList.remove('active');
                
                // Add active class to current section link (excluding login/signup buttons)
                const href = link.getAttribute('href');
                if (href && href.startsWith('#') && href === '#' + current && !link.onclick) {
                    link.classList.add('active');
                }
            });
        });

        // Back to top button
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '↑';
        backToTop.className = 'back-to-top';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #007bff;
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
        `;
        document.body.appendChild(backToTop);

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
            } else {
                backToTop.style.opacity = '0';
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn, .hamburger');
        const mobileMenu = document.querySelector('.mobile-menu, nav');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
                this.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on a link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function() {
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                }
                if (mobileMenuBtn) {
                    mobileMenuBtn.classList.remove('active');
                }
            });
        });

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            // Trigger scroll event once to set initial states
            window.dispatchEvent(new Event('scroll'));
            
            // Add CSS for animations if not already present
            if (!document.querySelector('#scroll-animations-css')) {
                const style = document.createElement('style');
                style.id = 'scroll-animations-css';
                style.textContent = `
                    .fade-in {
                        opacity: 1 !important;
                        transform: translateY(0) !important;
                        transition: opacity 0.6s ease, transform 0.6s ease;
                    }
                    
                    section, .section {
                        opacity: 0;
                        transform: translateY(30px);
                        transition: opacity 0.6s ease, transform 0.6s ease;
                    }
                    
                    .nav-menu a.active {
                        color:rgb(255, 255, 255) !important;
                        font-weight: 600 !important;
                        position: relative;
                    }
                    
                    .nav-menu a.active::after {
                        content: '';
                        position: absolute;
                        bottom: -5px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 20px;
                        height: 3px;
                        background: linear-gradient(45deg, #667eea, #764ba2);
                        border-radius: 2px;
                    }
                    
                    .nav-menu a {
                        transition: color 0.3s ease, font-weight 0.3s ease;
                    }
                    
                    header.scrolled {
                        transition: all 0.3s ease;
                    }
                    
                    .back-to-top:hover {
                        background: #0056b3 !important;
                        transform: translateY(-2px);
                    }
                `;
                document.head.appendChild(style);
            }

        
        });

                // Authentication modal functions
        let currentUser = null;
        let isAdmin = false;

        function openAuthModal(type) {
            const modal = document.getElementById('authModal');
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');
            const adminForm = document.getElementById('adminForm');
            
            // Hide all forms first
            loginForm.style.display = 'none';
            signupForm.style.display = 'none';
            adminForm.style.display = 'none';
            
            if (type === 'login') {
                loginForm.style.display = 'block';
            } else if (type === 'signup') {
                signupForm.style.display = 'block';
            }else if (type === 'admin'){
                adminForm.style.display = 'block';
            }
            
            modal.style.display = 'block';
        }

        function closeAuthModal() {
            document.getElementById('authModal').style.display = 'none';
        }

        function switchToSignup() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('signupForm').style.display = 'block';
            document.getElementById('adminForm').style.display = 'none';
        }

        function switchToLogin() {
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('signupForm').style.display = 'none';
            document.getElementById('adminForm').style.display = 'none';
        }

       

        function handleSignup(event) {
            event.preventDefault();
            const firstName = event.target.querySelector('input[placeholder="John"]').value;
            const lastName = event.target.querySelector('input[placeholder="Doe"]').value;
            const email = event.target.querySelector('input[type="email"]').value;
            const password = event.target.querySelector('input[type="password"]:nth-of-type(1)').value;
            const confirmPassword = event.target.querySelector('input[type="password"]:nth-of-type(2)').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Simulate signup (in real app, this would call an API)
            if (firstName && lastName && email && password) {
                currentUser = { email: email, name: `${firstName} ${lastName}` };
                updateHeaderForLoggedInUser();
                closeAuthModal();
                showSuccessMessage('Account created successfully! Welcome to NAVIGATU.');
            }
        }

        function updateHeaderForLoggedInUser() {
            const navLinks = document.querySelector('.nav-links');
            navLinks.innerHTML = `
                <li><a href="#services">Services</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#" onclick="showUserMenu()" class="user-menu">👤 ${currentUser.name}</a></li>
                <li><a href="#" onclick="logout()" class="logout-btn">Log Out</a></li>
            `;
        }

        function logout() {
            currentUser = null;
            const navLinks = document.querySelector('.nav-links');
            navLinks.innerHTML = `
                <li><a href="#services">Services</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#" onclick="openAuthModal('login')">Log In</a></li>
                <li><a href="#" onclick="openAuthModal('signup')" class="signup-btn">Sign Up</a></li>
            `;
            showSuccessMessage('You have been successfully logged out.');
        }

        // Track user intent to explore
let wantsToExplore = false;

function handleExploreClick() {
    if (currentUser === null) {
        wantsToExplore = true;
        openAuthModal('login');
    } else {
        document.querySelector('#services').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Modify handleLogin to redirect to services if user intended to explore
function handleLogin(event) {
   event.preventDefault();
            const email = event.target.querySelector('input[type="email"]').value;
            const password = event.target.querySelector('input[type="password"]').value;
            
            // Admin
    if (email === 'admin@gmail.com' && password === 'admin123') {
        closeAuthModal();
        document.getElementById('adminDashboard').style.display = 'block';
        document.body.style.overflow = 'hidden';
        showSuccessMessage('Welcome, Admin!');
        return;
    }
            // Check user credentials (demo: user@gmail.com / user123)
            if (email === 'user@gmail.com' && password === 'user123') {
                isAdmin = true;
                currentUser = { email: email, name: 'Admin User', role: 'admin' };
                closeAuthModal();
                window.location.href = 'index2.html';
                showSuccessMessage('Welcome to the admin dashboard!');

                 // Smooth page transition to index.html
        const transition = document.getElementById('page-transition');
        transition.style.opacity = 1;

        setTimeout(() => {
            window.location.href = 'index2.html';
        }, 600); // wait for fade-out effect
            } else {
                alert('Invalid admin credentials. Please try again.');
            }
        }

// Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
            } else {
                header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }
        });

        // Authentication modal functions
      
         // Payment modal functions
        function openPaymentModal(service, price) {
            const modal = document.getElementById('paymentModal');
            const orderDetails = document.getElementById('orderDetails');
            
            orderDetails.innerHTML = `
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
                    <h3 style="margin-bottom: 0.5rem; color: #333;">${service}</h3>
                    <p style="color: #666; margin-bottom: 1rem;">Professional service package</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 1.1rem; font-weight: 600;">Total:</span>
                        <span style="font-size: 1.5rem; font-weight: 700; color: #667eea;">₱${price}</span>
                    </div>
                </div>
            `;
            
            modal.style.display = 'block';
        }

        function closePaymentModal() {
            document.getElementById('paymentModal').style.display = 'none';
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const paymentModal = document.getElementById('paymentModal');
            const authModal = document.getElementById('authModal');
            const adminDashboard = document.getElementById('adminDashboard');
            
            if (event.target == paymentModal) {
                paymentModal.style.display = 'none';
            }
            if (event.target == authModal) {
                authModal.style.display = 'none';
            }
            // Don't close admin dashboard on outside click for better UX
        }

        // Payment form submission
        document.getElementById('paymentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Payment processing... This is a demo. In a real application, this would integrate with a payment processor.');
            closePaymentModal();
        });

        // Service card animations on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.service-card').forEach(card => {
            observer.observe(card);
        });

        // Admin functions
        function handleAdminLogin(event) {
            event.preventDefault();
            const email = event.target.querySelector('input[type="email"]').value;
            const password = event.target.querySelector('input[type="password"]').value;
            
            // Check admin credentials (demo: admin@navigatu.com / admin123)
            if (email === 'admin@navigatu.com' && password === 'admin123') {
                isAdmin = true;
                currentUser = { email: email, name: 'Admin User', role: 'admin' };
                closeAuthModal();
                showAdminDashboard();
                showSuccessMessage('Welcome to the admin dashboard!');
            } else {
                alert('Invalid admin credentials. Please try again.');
            }
        }

        function showAdminDashboard() {
            document.getElementById('adminDashboard').style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        function logoutAdmin() {
            isAdmin = false;
            currentUser = null;
            document.getElementById('adminDashboard').style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
            showSuccessMessage('Admin logged out successfully.');
        }

        function addNewService() {
            const serviceName = prompt('Enter service name:');
            const servicePrice = prompt('Enter service price (without $):');
            
            if (serviceName && servicePrice) {
                alert(`New service "${serviceName}" with price ${servicePrice} would be added to the database.`);
                // In a real application, this would make an API call to add the service
            }
        }

        // Add event listeners for admin table actions
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('admin-btn')) {
                const action = e.target.textContent.toLowerCase();
                const row = e.target.closest('tr');
                const itemId = row.querySelector('td').textContent;
                
                if (action === 'edit') {
                    alert(`Edit function for ${itemId} would open an edit modal.`);
                } else if (action === 'delete') {
                    if (confirm(`Are you sure you want to delete ${itemId}?`)) {
                        alert(`${itemId} would be deleted from the database.`);
                        // In a real application, this would make an API call to delete the item
                    }
                }
            }
        });

        function showSuccessMessage(message) {
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(45deg, #28a745, #20c997);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
                z-index: 3000;
                animation: slideInRight 0.3s ease;
            `;
            messageDiv.textContent = message;
            document.body.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => messageDiv.remove(), 300);
            }, 3000);
        }

        function showUserMenu() {
            alert(`User Menu:\n\nName: ${currentUser.name}\nEmail: ${currentUser.email}\n\nThis would typically show user profile options, settings, and dashboard access.`);
        }

        function openMentorModal() {
  document.getElementById("mentorModal").classList.add("active");
  document.getElementById("mentorOverlay").classList.add("active");
}

function closeMentorModal() {
  document.getElementById("mentorModal").classList.remove("active");
  document.getElementById("mentorOverlay").classList.remove("active");
}

let currentDate = new Date();
        let selectedDate = null;
        let selectedMentor = null;
        let selectedPricing = null;
        let selectedPaymentMethod = null;

        // Sample mentor data
        const mentors = {
            '2025-07-10': [
                {
                    id: 1,
                    name: 'Dr. Sarah Chen',
                    specialty: 'Software Engineering & AI',
                    rating: 4.9,
                    reviews: 127,
                    description: 'Former Google senior engineer with 15 years of experience in machine learning and software architecture.',
                    avatar: 'SC',
                    availability: ['09:00', '14:00', '16:30'],
                    pricing: {
                        weekly: 150,
                        monthly: 500,
                        yearly: 5000
                    }
                },
                {
                    id: 2,
                    name: 'Michael Torres',
                    specialty: 'Business Strategy',
                    rating: 4.8,
                    reviews: 89,
                    description: 'Former McKinsey consultant and startup founder. Specializes in scaling businesses and strategic planning.',
                    avatar: 'MT',
                    availability: ['10:00', '15:00'],
                    pricing: {
                        weekly: 200,
                        monthly: 700,
                        yearly: 7500
                    }
                }
            ],
            '2025-07-12': [
                {
                    id: 3,
                    name: 'Dr. Emily Rodriguez',
                    specialty: 'Data Science & Analytics',
                    rating: 4.9,
                    reviews: 156,
                    description: 'Lead data scientist at Netflix with expertise in machine learning and statistical analysis.',
                    avatar: 'ER',
                    availability: ['11:00', '13:00', '17:00'],
                    pricing: {
                        weekly: 180,
                        monthly: 650,
                        yearly: 6800
                    }
                }
            ],
            '2025-07-15': [
                {
                    id: 4,
                    name: 'James Wilson',
                    specialty: 'Product Management',
                    rating: 4.7,
                    reviews: 93,
                    description: 'Senior PM at Spotify with experience launching successful products used by millions.',
                    avatar: 'JW',
                    availability: ['09:30', '14:30'],
                    pricing: {
                        weekly: 175,
                        monthly: 600,
                        yearly: 6200
                    }
                },
                {
                    id: 5,
                    name: 'Lisa Park',
                    specialty: 'UX Design',
                    rating: 4.8,
                    reviews: 112,
                    description: 'Creative director with 12 years of experience designing award-winning user experiences.',
                    avatar: 'LP',
                    availability: ['10:00', '15:30', '18:00'],
                    pricing: {
                        weekly: 160,
                        monthly: 550,
                        yearly: 5800
                    }
                }
            ]
        };

        // Initialize calendar
        function initCalendar() {
            updateCalendar();
        }

        function updateCalendar() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            document.getElementById('calendarTitle').textContent = 
                new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startDate = new Date(firstDay);
            startDate.setDate(startDate.getDate() - firstDay.getDay());
            
            const calendarDays = document.getElementById('calendarDays');
            calendarDays.innerHTML = '';
            
            for (let i = 0; i < 42; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                
                const dayDiv = document.createElement('div');
                dayDiv.className = 'calendar-day';
                dayDiv.textContent = date.getDate();
                
                const dateStr = date.toISOString().split('T')[0];
                
                if (date.getMonth() !== month) {
                    dayDiv.classList.add('other-month');
                }
                
                if (mentors[dateStr]) {
                    dayDiv.classList.add('has-mentors');
                }
                
                if (date < new Date().setHours(0, 0, 0, 0)) {
                    dayDiv.style.opacity = '0.5';
                    dayDiv.style.cursor = 'not-allowed';
                } else {
                    dayDiv.onclick = () => selectDate(date, dayDiv);
                }
                
                calendarDays.appendChild(dayDiv);
            }
        }

        function changeMonth(direction) {
            currentDate.setMonth(currentDate.getMonth() + direction);
            updateCalendar();
        }

        function selectDate(date, element) {
            const dateStr = date.toISOString().split('T')[0];
            
            if (!mentors[dateStr]) {
                alert('No mentors available on this date. Please select another date.');
                return;
            }
            
            document.querySelectorAll('.calendar-day').forEach(day => {
                day.classList.remove('selected');
            });
            
            element.classList.add('selected');
            selectedDate = date;
            
            setTimeout(() => {
                showMentors(date);
                goToStep(2);
            }, 300);
        }

        function showMentors(date) {
            const dateStr = date.toISOString().split('T')[0];
            const availableMentors = mentors[dateStr] || [];
            
            document.getElementById('selectedDateDisplay').innerHTML = `
                <h3>Available Mentors for ${date.toLocaleDateString('en-US', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                })}</h3>
                <p>Choose your mentor for this date</p>
            `;
            
            const mentorsGrid = document.getElementById('mentorsGrid');
            mentorsGrid.innerHTML = '';
            
            availableMentors.forEach(mentor => {
                const mentorCard = document.createElement('div');
                mentorCard.className = 'mentor-card';
                mentorCard.innerHTML = `
                    <div class="mentor-header">
                        <div class="mentor-avatar">${mentor.avatar}</div>
                        <div class="mentor-info">
                            <h4>${mentor.name}</h4>
                            <div class="mentor-specialty">${mentor.specialty}</div>
                        </div>
                    </div>
                    <div class="mentor-rating">
                        <div class="stars">⭐⭐⭐⭐⭐</div>
                        <span>${mentor.rating} (${mentor.reviews} reviews)</span>
                    </div>
                    <div class="mentor-description">${mentor.description}</div>
                    <div class="mentor-availability">
                        <strong>Available Times:</strong>
                        <div class="availability-slots">
                            ${mentor.availability.map(time => `<span class="time-slot">${time}</span>`).join('')}
                        </div>
                    </div>
                `;
                
                mentorCard.onclick = () => selectMentor(mentor, mentorCard);
                mentorsGrid.appendChild(mentorCard);
            });
        }

        function selectMentor(mentor, element) {
            document.querySelectorAll('.mentor-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            element.classList.add('selected');
            selectedMentor = mentor;
            
            document.getElementById('continueToPayment').disabled = false;
        }

        function showPricing() {
            document.getElementById('selectedMentorDisplay').innerHTML = `
                <h3>Selected Mentor: ${selectedMentor.name}</h3>
                <p>Choose your mentorship plan and payment method</p>
            `;
            
            const pricingGrid = document.getElementById('pricingGrid');
            pricingGrid.innerHTML = '';
            
            const plans = [
                {
                    id: 'weekly',
                    title: 'Weekly Plan',
                    price: selectedMentor.pricing.weekly,
                    period: 'per week',
                    features: ['1 session per week', '1 hour per session', 'Email support', 'Session recordings']
                },
                {
                    id: 'monthly',
                    title: 'Monthly Plan',
                    price: selectedMentor.pricing.monthly,
                    period: 'per month',
                    features: ['4 sessions per month', '1 hour per session', 'Priority email support', 'Session recordings', 'Monthly progress report'],
                    popular: true
                },
                {
                    id: 'yearly',
                    title: 'Yearly Plan',
                    price: selectedMentor.pricing.yearly,
                    period: 'per year',
                    features: ['48 sessions per year', '1 hour per session', '24/7 support', 'Session recordings', 'Monthly progress reports', 'Quarterly goal setting']
                }
            ];
            
            plans.forEach(plan => {
                const pricingCard = document.createElement('div');
                pricingCard.className = 'pricing-card';
                pricingCard.innerHTML = `
                    ${plan.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
                    <div class="pricing-header">
                        <div class="pricing-title">${plan.title}</div>
                        <div class="pricing-price">$${plan.price}</div>
                        <div class="pricing-period">${plan.period}</div>
                    </div>
                    <ul class="pricing-features">
                        ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                `;
                
                pricingCard.onclick = () => selectPricing(plan, pricingCard);
                pricingGrid.appendChild(pricingCard);
            });
        }

        function selectPricing(plan, element) {
            document.querySelectorAll('.pricing-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            element.classList.add('selected');
            selectedPricing = plan;
            
            updateBookButton();
        }

        function selectPaymentMethod(method) {
            document.querySelectorAll('.payment-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            event.target.closest('.payment-option').classList.add('selected');
            selectedPaymentMethod = method;
            
            updateBookButton();
        }

        function updateBookButton() {
            const bookBtn = document.getElementById('bookNowBtn');
            bookBtn.disabled = !(selectedPricing && selectedPaymentMethod);
        }

        function goToStep(step) {
            // Update step indicators
            document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
            document.getElementById(`step${step}`).classList.add('active');
            
            // Hide all sections
            document.getElementById('calendarSection').style.display = step === 1 ? 'block' : 'none';
            document.getElementById('mentorsSection').style.display = step === 2 ? 'block' : 'none';
            document.getElementById('pricingSection').style.display = step === 3 ? 'block' : 'none';
            
            if (step === 3) {
                showPricing();
            }
        }

        function bookSession() {
            // Simulate booking process
            const bookBtn = document.getElementById('bookNowBtn');
            bookBtn.textContent = 'Processing...';
            bookBtn.disabled = true;
            
            setTimeout(() => {
                // Hide all sections and show success message
                document.getElementById('calendarSection').style.display = 'none';
                document.getElementById('mentorsSection').style.display = 'none';
                document.getElementById('pricingSection').style.display = 'none';
                document.getElementById('successMessage').style.display = 'block';
                
                // Hide step indicators
                document.querySelector('.step-indicator').style.display = 'none';
            }, 2000);
        }

        function resetBooking() {
            // Reset all selections
            selectedDate = null;
            selectedMentor = null;
            selectedPricing = null;
            selectedPaymentMethod = null;
            
            // Show step indicators
            document.querySelector('.step-indicator').style.display = 'flex';
            
            // Reset form
            document.getElementById('continueToPayment').disabled = true;
            document.getElementById('bookNowBtn').disabled = true;
            document.getElementById('bookNowBtn').textContent = 'Book Now';
            
            // Clear selections
            document.querySelectorAll('.calendar-day').forEach(day => {
                day.classList.remove('selected');
            });
            
            // Go back to step 1
            goToStep(1);
            
            // Hide success message
            document.getElementById('successMessage').style.display = 'none';
        }

        // Business Plan Modal Functions
        function openBusinessPlanModal() {
            document.getElementById('businessPlanModal').style.display = 'block';
        }

        function closeBusinessPlanModal() {
            document.getElementById('businessPlanModal').style.display = 'none';
        }

        // Business Plan Form Handler
        document.addEventListener('DOMContentLoaded', function() {
            const businessPlanForm = document.getElementById('businessPlanForm');
            const timelineSelect = document.getElementById('timeline');
            const additionalServicesCheckboxes = document.querySelectorAll('input[name="additionalServices"]');
            
            // Update pricing when timeline changes
            if (timelineSelect) {
                timelineSelect.addEventListener('change', updateBusinessPlanPricing);
            }
            
            // Update pricing when additional services change
            additionalServicesCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateBusinessPlanPricing);
            });
            
            // Handle form submission
            if (businessPlanForm) {
                businessPlanForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    handleBusinessPlanSubmission();
                });
            }
        });

        function updateBusinessPlanPricing() {
            const timelineSelect = document.getElementById('timeline');
            const additionalServicesCheckboxes = document.querySelectorAll('input[name="additionalServices"]:checked');
            
            let basePrice = 0;
            let additionalPrice = 0;
            
            // Get base price from timeline
            if (timelineSelect && timelineSelect.value) {
                switch(timelineSelect.value) {
                    case 'rush':
                        basePrice = 15000;
                        break;
                    case 'standard':
                        basePrice = 10000;
                        break;
                    case 'comprehensive':
                        basePrice = 12000;
                        break;
                }
            }
            
            // Calculate additional services price
            additionalServicesCheckboxes.forEach(checkbox => {
                switch(checkbox.value) {
                    case 'financial-modeling':
                        additionalPrice += 3000;
                        break;
                    case 'market-research':
                        additionalPrice += 2500;
                        break;
                    case 'investor-presentation':
                        additionalPrice += 2000;
                        break;
                    case 'follow-up-consultation':
                        additionalPrice += 1500;
                        break;
                }
            });
            
            // Update display
            document.getElementById('basePrice').textContent = '₱' + basePrice.toLocaleString();
            document.getElementById('additionalPrice').textContent = '₱' + additionalPrice.toLocaleString();
            document.getElementById('totalPrice').textContent = '₱' + (basePrice + additionalPrice).toLocaleString();
        }

        function handleBusinessPlanSubmission() {
            const form = document.getElementById('businessPlanForm');
            const formData = new FormData(form);
            
            // Collect form data
            const businessPlanData = {
                businessName: formData.get('businessName'),
                businessType: formData.get('businessType'),
                industry: formData.get('industry'),
                targetMarket: formData.get('targetMarket'),
                businessDescription: formData.get('businessDescription'),
                fundingNeeds: formData.get('fundingNeeds'),
                timeline: formData.get('timeline'),
                additionalServices: formData.getAll('additionalServices'),
                contactInfo: formData.get('contactInfo'),
                phoneNumber: formData.get('phoneNumber'),
                specialRequests: formData.get('specialRequests')
            };
            
            // Calculate total cost
            const totalCost = document.getElementById('totalPrice').textContent;
            
            // Show success message
            showSuccessMessage(`Business plan request submitted successfully! We'll contact you within 24 hours at ${businessPlanData.contactInfo} to discuss your ${businessPlanData.businessName} business plan. Estimated cost: ${totalCost}`);
            
            // In a real application, this would send data to the server
            console.log('Business Plan Request:', businessPlanData);
            
            // Close modal and reset form
            closeBusinessPlanModal();
            form.reset();
            updateBusinessPlanPricing();
        }

        // Initialize the calendar when page loads
        window.onload = function() {
            initCalendar();
        };
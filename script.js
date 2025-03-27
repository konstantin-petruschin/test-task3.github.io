// Функция, которая выполняется после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Переменные для мобильного меню
    const menuToggle = document.querySelector('.header__menu-toggle');
    const mobileMenu = document.querySelector('.header__mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.header__mobile-menu .header__nav-link');
    
    // Обработчик для кнопки меню
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Закрытие меню при клике на ссылку
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Эффект скролла для шапки и z-index изображения
    const header = document.querySelector('.header');
    const heroImage = document.querySelector('.hero__bg-image');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            
            // Меняем только z-index изображения при скролле
            if (heroImage && window.innerWidth > 768) {
                // Для больших экранов рисунок уходит под шапку при скролле
                if (window.innerWidth > 1500) {
                    heroImage.style.zIndex = '1';
                } else {
                    heroImage.style.zIndex = '5';
                }
            }
        } else {
            header.classList.remove('scrolled');
            
            // Восстанавливаем z-index
            if (heroImage && window.innerWidth > 768) {
                // Для больших экранов восстанавливаем высокий z-index при возврате в начало
                if (window.innerWidth > 1500) {
                    heroImage.style.zIndex = '110';
                } else {
                    heroImage.style.zIndex = '5';
                }
            }
        }
    });

    // Слайдер отзывов
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    // Функция для отображения определенного слайда
    function showSlide(index) {
        testimonials.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentSlide = index;
    }

    // Инициализация слайдера
    if (testimonials.length > 0 && dots.length > 0) {
        // Отображение первого слайда
        showSlide(0);

        // Автоматическое переключение слайдов
        function startSlideInterval() {
            slideInterval = setInterval(() => {
                let nextSlide = (currentSlide + 1) % testimonials.length;
                showSlide(nextSlide);
            }, 5000);
        }

        startSlideInterval();

        // Клик по точкам переключения
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                showSlide(i);
                startSlideInterval();
            });
        });
    }

    // Валидация форм
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Добавляем стиль для полей с ошибкой
                    if (!document.querySelector('#form-error-style')) {
                        const errorStyle = document.createElement('style');
                        errorStyle.id = 'form-error-style';
                        errorStyle.textContent = `
                            .error {
                                border-color: var(--secondary-color) !important;
                                box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2) !important;
                            }
                            
                            .error-message {
                                color: var(--secondary-color);
                                font-size: 0.8rem;
                                margin-top: 0.3rem;
                            }
                        `;
                        document.head.appendChild(errorStyle);
                    }
                    
                    // Удаляем предыдущее сообщение об ошибке, если оно есть
                    const prevError = field.parentNode.querySelector('.error-message');
                    if (prevError) {
                        prevError.remove();
                    }
                    
                    // Добавляем сообщение об ошибке
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'This field is required';
                    field.parentNode.appendChild(errorMessage);
                } else {
                    field.classList.remove('error');
                    const errorMessage = field.parentNode.querySelector('.error-message');
                    if (errorMessage) {
                        errorMessage.remove();
                    }
                }
            });
            
            // Проверка формата email
            const emailField = form.querySelector('input[type="email"]');
            if (emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                    
                    // Добавляем сообщение об ошибке
                    const prevError = emailField.parentNode.querySelector('.error-message');
                    if (prevError) {
                        prevError.remove();
                    }
                    
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'Please enter a valid email address';
                    emailField.parentNode.appendChild(errorMessage);
                }
            }
            
            // Если форма валидна, показываем сообщение об успешной отправке
            if (isValid) {
                // Очищаем поля формы
                form.reset();
                
                // Создаем и показываем сообщение об успешной отправке
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Your message has been sent successfully!';
                successMessage.style.cssText = `
                    background-color: #2ecc71;
                    color: white;
                    padding: 1rem;
                    border-radius: var(--radius);
                    margin-top: 1rem;
                    text-align: center;
                `;
                
                form.appendChild(successMessage);
                
                // Удаляем сообщение через 3 секунды
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            }
        });
        
        // Удаляем ошибку при вводе
        const inputFields = form.querySelectorAll('input, textarea, select');
        inputFields.forEach(field => {
            field.addEventListener('input', function() {
                if (field.value.trim()) {
                    field.classList.remove('error');
                    const errorMessage = field.parentNode.querySelector('.error-message');
                    if (errorMessage) {
                        errorMessage.remove();
                    }
                }
            });
        });
    });

    // Плавный скролл к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hover-эффекты для карточек свойств
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
    });

    // Hover-эффекты для карточек услуг
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const icon = card.querySelector('.service-icon');
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
            
            if (icon) {
                icon.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
                icon.style.color = 'var(--secondary-color)';
                icon.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            
            if (icon) {
                icon.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
                icon.style.color = 'var(--accent-color)';
                icon.style.transform = 'scale(1)';
            }
        });
    });
}); 
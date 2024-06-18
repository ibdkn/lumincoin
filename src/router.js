import {Main} from "./components/main";
import {Login} from "./components/auth/login";
import {Signup} from "./components/auth/signup";
import {Budget} from "./components/budget/budget";
import {Income} from "./components/income/income";
import {Expenses} from "./components/expenses/expenses";
import {Logout} from "./components/auth/logout";

export class Router {

    constructor() {
        this.titlePageElement = document.getElementById('page-title');
        this.contentPageElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');

        this.routes = [
            {
                route: '#/main',
                title: 'Главная',
                template: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                styles: '/styles/main.css',
                load: () => {
                    new Main();
                }
            },
            {
                route: '#/login',
                title: 'Авторизация',
                template: '/templates/pages/auth/login.html',
                styles: '/styles/form.css',
                load: () => {
                    new Login();
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: '/templates/pages/auth/signup.html',
                styles: '/styles/form.css',
                load: () => {
                    new Signup();
                }
            },
            {
                route: '#/logout',
                load: () => {
                    new Logout();
                }
            },
            {
                route: '#/budget',
                title: 'Доходы и расходы',
                template: '/templates/pages/budget/budget.html',
                useLayout: '/templates/layout.html',
                styles: '/styles/budget.css',
                load: () => {
                    new Budget();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: '/templates/pages/income/income.html',
                useLayout: '/templates/layout.html',
                styles: '/styles/income.css',
                load: () => {
                    new Income();
                }
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: '/templates/pages/expenses/expenses.html',
                useLayout: '/templates/layout.html',
                styles: '/styles/expenses.css',
                load: () => {
                    new Expenses();
                }
            },
            {
                route: '#/404',
                title: 'Page not found',
                template: '/templates/pages/404.html',
                useLayout: '/templates/layout.html',
            },
        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if(newRoute) {
            if(newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin';
            }
            if(newRoute.template) {
                let contentBlock = this.contentPageElement;
                if(newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById("content-layout");

                    // navigation
                    this.setupNavigationHandlers(urlRoute);

                }
                contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text());
                this.stylesElement.setAttribute('href', newRoute.styles);
            }
            if(newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

        } else {
            console.log('No route found');
            window.location.href = '#/404';
        }
    }

    setupNavigationHandlers(urlRoute) {
        // active menu
        const ROUTES_NAMES = {
            '#/budget': document.querySelector('#budget'),
            '#/main': document.querySelector('#main'),
            '#/income': document.querySelector('#income'),
            '#/expenses': document.querySelector('#expenses'),
        }

        const navContainer = document.getElementById("main-nav");
        const btnNavContainer = navContainer.querySelectorAll(".navigation-item");

        btnNavContainer.forEach((item) => item.classList.remove('active'));

        if(ROUTES_NAMES[urlRoute]) {
            ROUTES_NAMES[urlRoute].classList.add('active');
        }

        // burger menu
        let burgerMenu = document.getElementById('burger-menu');
        let overlay = document.getElementById('menu');
        let bg = document.getElementById('bg');
        let accordion = document.querySelector('.accordion');
        let logo = document.querySelector('.logo');

        burgerMenu.addEventListener('click', function(event) {
            event.stopPropagation(); // Остановить всплытие события
            burgerMenu.classList.toggle('open');
            overlay.classList.toggle("open");
            bg.classList.toggle("open");
        });

        document.addEventListener('click', function(event) {
            if (accordion.contains(event.target)) {
                return;
            }

            if (!burgerMenu.contains(event.target) && overlay.classList.contains('open')) {
                overlay.classList.remove('open');
                bg.classList.remove('open');
                burgerMenu.classList.remove('open');
            }
        });

        document.querySelector('.logo').addEventListener('click', (event) => {
            event.preventDefault();

            btnNavContainer.forEach((item) => item.classList.remove('active'));
            ROUTES_NAMES[logo.getAttribute('href')].classList.add('active');

            if (window.innerWidth < 1024) {
                overlay.classList.remove('open');
                bg.classList.remove('open');
                burgerMenu.classList.remove('open');

                setTimeout(() => {
                    window.location.href = logo.href;
                }, 400);
            } else {
                overlay.classList.remove('open');
                bg.classList.remove('open');
                burgerMenu.classList.remove('open');
                window.location.href = logo.href;
            }
        });

        document.querySelectorAll('.navigation-item').forEach((menuItem) => {
            menuItem.addEventListener('click', function(event) {
                event.preventDefault();

                btnNavContainer.forEach((item) => item.classList.remove('active'));
                ROUTES_NAMES[menuItem.querySelector('a').getAttribute('href')].classList.add('active');

                if (window.innerWidth < 1024) {
                    overlay.classList.remove('open');
                    bg.classList.remove('open');
                    burgerMenu.classList.remove('open');

                    setTimeout(() => {
                        window.location.href = menuItem.querySelector('a').href;
                    }, 400);
                } else {
                    overlay.classList.remove('open');
                    bg.classList.remove('open');
                    burgerMenu.classList.remove('open');
                    window.location.href = menuItem.querySelector('a').href;
                }
            });
        });

        // accordion
        document.querySelectorAll('.accordion-button').forEach((question, index) => {
            const accordionAnswer = question.nextElementSibling;

            if (localStorage.getItem(`accordion${index}`) === 'open') {
                accordionAnswer.style.transition = 'none';
                question.classList.add('open');
                accordionAnswer.style.maxHeight = accordionAnswer.scrollHeight + 'px';

                window.requestAnimationFrame(() => {
                    accordionAnswer.style.transition = '';
                });
            }

            question.addEventListener('click', event => {
                question.classList.toggle('open');

                if (question.classList.contains('open')) {
                    accordionAnswer.style.maxHeight = accordionAnswer.scrollHeight + 'px';
                    localStorage.setItem(`accordion${index}`, 'open');
                } else {
                    accordionAnswer.style.maxHeight = 0;
                    localStorage.setItem(`accordion${index}`, 'closed');
                }
            });
        });
    }
}
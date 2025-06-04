document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mainNavigation = document.querySelector('.main-navigation');

    if (mobileMenuButton && mainNavigation) {
        mobileMenuButton.addEventListener('click', () => {
            mainNavigation.classList.toggle('active');
        });
    }
});
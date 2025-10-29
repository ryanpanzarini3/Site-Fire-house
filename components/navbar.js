class CustomNavbar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .navbar {
                    background-color: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                }
                
                .nav-link {
                    position: relative;
                }
                
                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background-color: #f97316;
                    transition: width 0.3s ease;
                }
                
                .nav-link:hover::after {
                    width: 100%;
                }
                
                .mobile-menu {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease-out;
                }
                
                .mobile-menu.open {
                    max-height: 500px;
                }
                
                @media (min-width: 768px) {
                    .mobile-menu {
                        max-height: none !important;
                    }
                }
            </style>
            
            <nav class="navbar fixed w-full z-50 border-b border-gray-800">
                <div class="container mx-auto px-4">
                    <div class="flex justify-between items-center py-4">
                        <a href="#" class="flex items-center">
                            <span class="text-xl font-bold text-fire-500 font-rpg">FIREHOUSE</span>
                        </a>
                        
                        <!-- Desktop Navigation -->
                        <div class="hidden md:flex space-x-8">
                            <a href="#about" class="nav-link text-gray-300 hover:text-fire
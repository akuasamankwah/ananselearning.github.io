const pathPrefix = window.location.pathname.includes("/pages/") ? "../" : "";

document.getElementById("menu-bar").innerHTML = `<header class="topbar">
        <div class="container">
            <nav class="nav">
                <div class="logo">
                    <img src="${pathPrefix}assets/images/logo.svg" alt="Ananse Learning logo">
                    <a class="site-title" href="${pathPrefix}index.html">Ananse Learning</a>
                </div>
                <ul class="menu">
                    <li class="dropdown">
                        <a href="${pathPrefix}pages/about.html">About</a>
                        <ul class="dropdown-content">
                            <li><a href="${pathPrefix}pages/exploration.html">Our Approach</a></li>
                            <li><a href="#">Team</a></li>
                            <li><a href="#">Partnerships</a></li>
                            <li><a href="#">Impact</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="${pathPrefix}pages/web.html">Web</a>
                        <ul class="dropdown-content">
                            <li><a href="#">Studio Mansa</a></li>
                            <li><a href="#">Anansewaa's Makerspace</a></li>
                            <li><a href="#">M'aduane</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="${pathPrefix}pages/characters.html">Characters</a>
                        <ul class="dropdown-content">
                            <li><a href="${pathPrefix}pages/mansa.html">mansa</a></li>
                            <li><a href="${pathPrefix}pages/anansewaa.html">anansewaa</a></li>
                            <li><a href="${pathPrefix}pages/brempong.html">brempong</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="${pathPrefix}pages/exploration.html">Ntontan Adventure</a>
                        <ul class="dropdown-content">
                            <li><a href="${pathPrefix}pages/ntontan-join.html">Join the Ntontan</a></li>
                            <li><a href="${pathPrefix}pages/ntontan-educators.html">For Educators</a></li>
                        </ul>
                    </li>
                    <li><a href="${pathPrefix}pages/store.html">Store</li>
                </ul>
            </nav>
        </div>
    </header>`;

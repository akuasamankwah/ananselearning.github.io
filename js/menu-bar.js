const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';

document.getElementById('menu-bar').innerHTML = `<header class="topbar">
        <div class="container">
            <nav class="nav">
                <div class="logo">
                    <img src="${pathPrefix}assets/images/logo.svg" alt="Ananse Learning logo">
                    <a class="site-title" href="${pathPrefix}index.html">Ananse Learning</a>
                </div>
                <ul class="menu">
                    <li class="dropdown">
                        <a href="#">About</a>
                        <ul class="dropdown-content">
                            <li><a href="${pathPrefix}pages/about-approach.html">Our Approach</a></li>
                            <li><a href="${pathPrefix}pages/about-team.html">Team</a></li>
                            <li><a href="${pathPrefix}pages/about-partnerships.html">Partnerships</a></li>
                            <li><a href="${pathPrefix}pages/about-impact.html">Impact</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="${pathPrefix}pages/web.html">Web</a>
                        <ul class="dropdown-content">
                            <li><a href="${pathPrefix}pages/web-studio-mansa.html">Studio Mansa</a></li>
                            <li><a href="${pathPrefix}pages/web-anansewaa.html">Anansewaa's Makerspace</a></li>
                            <li><a href="${pathPrefix}pages/web-maduane.html">M'aduane</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="${pathPrefix}pages/characters.html">Characters</a>
                        <ul class="dropdown-content">
                            <li><a href="${pathPrefix}pages/mansa.html">mansa.html</a></li>
                            <li><a href="${pathPrefix}pages/web-anansewaa.html">web-anansewaa.html</a></li>
                            <li><a href="${pathPrefix}pages/brempong.html">brempong.html</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="${pathPrefix}pages/exploration.html">Ntontan Adventure</a>
                        <ul class="dropdown-content">
                            <li><a href="${pathPrefix}pages/ntontan-join.html">Join the Ntontan</a></li>
                            <li><a href="${pathPrefix}pages/ntontan-educators.html">For Educators</a></li>
                        </ul>
                    </li>
                    <li><a href="${pathPrefix}pages/mansa-designer.html">Mansa Designer</a></li>
                    <li><a href="${pathPrefix}pages/ntontan-join.html">Ntontan Adventure</a></li>
                    <li>Store</li>
                </ul>
            </nav>
        </div>
    </header>`;
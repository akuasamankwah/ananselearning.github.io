const pathPrefix = window.location.pathname.includes("/pages/") ? "../" : "";

const footerHTML = `<style>
.footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #f8fbf6;
    border-top: 1px solid #eee;
    z-index: 999;
    max-height: 50px;
    overflow: hidden;
    transition: max-height 0.3s ease;
}
.footer.expanded {
    max-height: 400px;
}
.footer-toggle {
    cursor: pointer;
}
.footer.expanded .toggle-icon {
    transform: rotate(180deg);
}
.footer, .footer * {
    color: #777 !important;
}
.footer a {
    color: #777 !important;
}
.footer a:hover {
    opacity: .85;
}
.footer {
    font-size: 12px;
}
.footer h3 {
    font-size: 14px;
    margin-bottom: 4px;
}
.footer p, .footer a, .footer .subscribe-msg {
    font-size: 12px;
}
.footer .subscribe-form input[type="email"],
.footer .subscribe-form button,
.footer .subscribe-form .btn {
    font-size: 12px;
}
.footer .subscribe-form input::placeholder {
    font-size: 12px;
}
.footer .footer-links-grid {
    display: flex !important;
    flex-wrap: wrap;
    gap: 8px 20px;
    align-items: flex-start;
}
</style>
<footer class="footer">
        <div class="footer-toggle" style="padding:10px; text-align:center; cursor:pointer;">Made in Ghana with love for
            the world | © 2025 Ananse Learning. All rights reserved. <span class="toggle-icon">▼</span></div>
        <div class="footer-content">
            <div class="container" style="padding:28px 20px;max-width:1000px;">
                <h3 style="margin:0 0 4px;">Join the Ntontan</h3>
                <p style="margin:0 0 16px;">Receive resources, new releases, and stories from our learning web</p>
                <form class="subscribe-form" action="#" method="post"
                    style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px;">
                    <input type="email" required placeholder="Enter your email address" aria-label="Email"
                        style="flex:1 1 280px;min-width:220px;border:1px solid #ddd;border-radius:24px;padding:12px 16px;">
                    <button type="submit" class="btn" style="border-radius:24px;min-width:140px;">Subscribe</button>
                </form>
                <div class="footer-links-grid"
                    style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px 28px;margin-bottom:16px;">
                    <ul style="list-style:none;margin:0;padding:0;">
                        <li><a href="${pathPrefix}pages/about-approach.html">About Ananse Learning</a></li>
                        <li><a href="${pathPrefix}pages/web-studio-mansa.html">Studio Mansa</a></li>
                        <li><a href="${pathPrefix}pages/web-anansewaa.html">Anansewaa’s Makerspace</a></li>
                        <li><a href="${pathPrefix}pages/web-maduane.html">M’aduane</a></li>
                    </ul>
                    <ul style="list-style:none;margin:0;padding:0;">
                        <li><a href="${pathPrefix}pages/about-impact.html">Impact: Measurable Outcomes</a></li>
                        <li><a href="${pathPrefix}pages/assets.html">Complementary Assets</a></li>
                        <li><a href="${pathPrefix}pages/privacy.html">Privacy Policy</a></li>
                    </ul>
                    <ul style="list-style:none;margin:0;padding:0;">
                        <li><a href="${pathPrefix}pages/contact.html">Contact Us</a></li>
                        <li><a href="${pathPrefix}pages/ntontan-join.html">Ntontan</a></li>
                        <li><a href="${pathPrefix}pages/help.html">Help</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>`;

document.body.insertAdjacentHTML("beforeend", footerHTML);

// Footer toggle
const footerToggle = document.querySelector(".footer-toggle");
if (footerToggle) {
  footerToggle.addEventListener("click", function () {
    document.querySelector(".footer").classList.toggle("expanded");
  });
}

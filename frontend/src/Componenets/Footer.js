import React from 'react';

export default function Footer() {
  return (
    <footer>
        <div className="footer-nav">
            <div className="socials">
                <h4>Your place to pay</h4>
                <img src="img/Flag-logo.png" alt="" />
                {/* English, USA */}
                <select id="country">
                        <option value="English">English, USA</option>
                        <option value="Hindi">Hindi, India</option>
                </select>
                <br />
                <img src="img/twitter-svg.svg" width="24px" alt="Twitter" />
                <img src="img/instagram-svg.svg" width="24px" alt="Instagram" />
                <img src="img/facebook-svg.svg" width="24px" alt="Facebook" />
                <img src="img/youtube-svg.svg" width="24px" alt="YouTube" />
            </div>
            <div className="space"></div>
            <div className="column">
                <h5>Product</h5>
                <a href="#">Why Unipay</a>
                <a href="#">Inspiration</a>
                <a href="#">Our partners</a>
                <a href="#">Status</a>
            </div>
            <div className="column">
                <h5>Company</h5>
                <a href="#">About</a>
                <a href="#">Jobs</a>
                <a href="#">Newsroom</a>
            </div>
            <div className="column">
                <h5>Resources</h5>
                <a href="#">Support</a>
                <a href="#">Blog</a>
                <a href="#">Feedback</a>
                <a href="#">Developers</a>
                <a href="#">Security</a>
            </div>
            <div className="column">
                <h5>Policies</h5>
                <a href="#">Terms</a>
                <a href="#">Privacy</a>
                <a href="#">Guideines</a>
                <a href="#">Acknowledgements</a>
                <a href="#">Licenses</a>
            </div>
        </div>
        <div className="footer-nav-mobile">
            <div className="socials">
                <h4>Your place to talk</h4>
                <img src="img/Flag-logo.png" alt="" />
                {/* English, USA */}
                <select id="country">
                        <option value="English">English, USA</option>
                        <option value="Hindi">Hindi, India</option>
                </select>
                <br />
                <img src="img/twitter-svg.svg" width="24px" alt="Twitter" />
                <img src="img/instagram-svg.svg" width="24px" alt="Instagram" />
                <img src="img/facebook-svg.svg" width="24px" alt="Facebook" />
                <img src="img/youtube-svg.svg" width="24px" alt="YouTube" />
            </div>
            <table>
                <tbody>
                    <tr>
                        <td class="heading">
                            Product
                        </td>
                        <td class="heading">
                            Company
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="#">Why Unipay</a>
                        </td>
                        <td>
                            <a href="#">About</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="#">Inspiration</a>
                        </td>
                        <td>
                            <a href="#">Jobs</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="#">Our partners</a>
                        </td>
                        <td>
                            <a href="#">Newsroom</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="#">Status</a>
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td class="heading">
                            Resources
                        </td>
                        <td class="heading">
                            Policies
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="#">Support</a>
                        </td>
                        <td>
                            <a href="#">Terms</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="#">Blog</a>
                        </td>
                        <td>
                            <a href="#">Privacy</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="#">Feedback</a>
                        </td>
                        <td>
                            <a href="#">Guidelines</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="#">Developers</a>
                        </td>
                        <td>
                            <a href="#">Acknowledgements</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="#">Security</a>
                        </td>
                        <td>
                            <a href="#">Licenses</a>
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>
        <div className="footer-bar">
        <p>© An India Product</p>
            <a href="#">Pay Now</a>
        </div>
        
    </footer>
  );
}

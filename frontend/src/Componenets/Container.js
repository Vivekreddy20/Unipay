import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Container() {
  useEffect(() => {
    AOS.init({
      offset: 400,
      duration: 1000
    });
  }, []);

  return (
    <div>
      <div className="container" data-aos="fade-up">
        <img className="container-img" src="img/container-1.svg" alt="Container 1" />
        <div className="description">
          <h2>Enter Your Roll Number and Date of Birth</h2>
          <p>Provide your roll number and date of birth to authenticate your identity and access your payment details. This simple step ensures the security and privacy of your information.</p>
        </div>
      </div>

      <div className="container2" data-aos="fade-up">
        <div className="description">
          <h2>Choose your Fee</h2>
          <p>Select the type of fee you need to pay, whether it's for transportation, regular tuition, exams, or fines. Our platform makes the process quick and simple.</p>
        </div>
        <img className="container-img" src="img/container-2.svg" alt="Container 2" />
      </div>

      <div className="container2-mobile" data-aos="fade-up">
        <img className="container-img" src="img/container-2.svg" alt="Container 2" />
        <div className="description">
          <h2>Choose your Fee</h2>
          <p>Select the type of fee you need to pay, whether it's for transportation, regular tuition, exams, or fines. Our platform makes the process quick and simple.</p>
        </div>
      </div>

      <div className="container" data-aos="fade-up">
        <img className="container-img" src="img/container-3.svg" alt="Container 3" />
        <div className="description">
          <h2>Verify Your Details Before Payment</h2>
          <p>Great! We will display the information we have on record for you. Please ensure that all details are correct before proceeding with your payment.</p>
        </div>
      </div>

        <div className="bottom-container" data-aos="fade-up">
        <div className="container" data-aos="fade-up">
          <div className="description">
            <h2>Reliable tech for staying close</h2>
            <p>
              Safer and Faster fee payment platform. We believe in user experience along with safety and security for our clients. Below is a demo video on how it works.
            </p><br/>
            <div style={{ position: "relative", paddingBottom: "65.039%", height: 0 }}>
            <iframe
              src="https://www.loom.com/embed/b5639004dbab48be9184a8f39d17499f?sid=35e142d7-4b46-4fb9-84f0-96e1eb372c52"
              frameBorder="0"
              webkitAllowFullScreen
              mozAllowFullScreen
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              title="Demo Video"
            ></iframe>
            </div>
          </div>
      </div>
</div>


      <div className="last-message">
        <h4>Ready to join with us?</h4>
        <a href="/contact">Contact Us</a>
      </div>
    </div>
  );
}

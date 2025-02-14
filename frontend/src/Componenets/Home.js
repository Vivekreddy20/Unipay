import React from 'react';
import RollNumberForm from './RollNumberForm';
import Container from './Container';
import Footer from './Footer';

function Home() {
  const scrollToSteps = () => {
    const container = document.querySelector('.container');
    container.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToVideo = () => {
    const videoContainer = document.querySelector('.bottom-container');
    if (videoContainer) {
      videoContainer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
    <div className="top-container">
      <header>
        <img src="" alt="" />
        <div className="center-nav">
          <a onClick={scrollToSteps}>Steps</a>
          <a onClick={scrollToVideo}>How to use?</a>
          <a href="javascript:void(0);">Sales</a>
          <a href="#">Support</a>
        </div>
        <a href="#">Pay Now</a>
        
        <img className="hamburger" src="img/hamburger.svg" alt="Hamburger Icon" />
      </header>
      <div className="center-box">
        <h1>Time to clear your fees!!</h1>
        <p>Fees, transport, and fines within a few clicks. Why late then, drop your roll number and get the payment process started</p>
        <div className="nav-buttons">
          <RollNumberForm />
        </div>
      </div>
      <img className="cloud" src="img/cloud.svg" width="35px" alt="Cloud" />
    </div>
    <Container/>
    <Footer/>
    </div>
  );
}

export default Home;

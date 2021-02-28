import React, { useState } from "react";
import { Header, Image, Input, Button } from "semantic-ui-react";
import AboutKidsArt4U from './AboutKidsArt4U'

const PageFooter = () => {

  const [contactEmail, setContactEmail] = useState("")


  const handleEmail = (e) => {
    // console.log(e.target.value)
    setContactEmail(e.target.value)
  }

  const handleEmailSubmit = (e) => {

    setContactEmail(e.target.value)
    console.log("here's the email!", contactEmail)
  }

  return (

    <div className="footer">
      <AboutKidsArt4U />
      <div className="footer-links">
        <h2 >Site Curators</h2>
        <a href="https://github.com/wtheiler" target="_blank">
          Will Theiler
      </a>
        <a href="https://github.com/ShaneRobertson" target="_blank">
          Shane Robertson
      </a>
        <a href="https://github.com/hrivera7" target="_blank">
          Hector Rivera
      </a>

      </div>
      <div className="footer-copyright"> <span>&#169;</span> {(new Date().getFullYear())} Kids Art 4 U</div>
      <div className="stay-in-touch">
        <h2 >Stay In Touch</h2>
        <Input placeholder='Enter Email...' value={contactEmail} onChange={handleEmail} />
        <Button onClick={handleEmailSubmit}>Submit</Button>

      </div>
    </div>
  )
}

export default PageFooter

import "../homepage.css";
import empty from "../images/emptypfp.png";

function HomePage() {
  return (
    <div className="Home">
      <header className="container">
        <h1 className="slogan">
          Your Health, Simplified. Your Questions, Answered
        </h1>
        <p className="no1">
          AskMedi is all about providing genuine solutions to genuine problems
          that are a few clicks away. As technology evolves, we understood that
          users would rather find comfort from their concerns at the comfort of
          their home rather than going to a clinic with ridiculous wait times.
          Not only this, the team are also aware of how misleading the internet
          is and we aim to remove this problem altogether by providing accurate,
          real time data to get you healthy again.
        </p>

        <h2 className="team">Meet The Team</h2>
        <div className="imgtile">
          <div className="teammember1">
            <img src={empty} alt="studentcard"></img>
            <h2>Zayan Chaudhary</h2>
            <p>Undergrad Student</p>
          </div>

          <div className="teammember2">
            <img src={empty} alt="studentcard"></img>
            <h2>Jamal Qadri</h2>
            <p>Undergrad Student</p>
          </div>
        </div>

        <h2 className="team">Contact Us</h2>
        <p className="contact">
          Whether you want to enquire about information or contact us directly,
          find us here
        </p>
      </header>
    </div>
  );
}

export default HomePage;

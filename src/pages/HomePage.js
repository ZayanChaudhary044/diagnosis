import React from "react";
import "../homepage.css";
import empty from "../images/emptypfp.png";

function HomePage() {
  return (
    <div className="Home">
      <header className="container">
        {/* Hero Section */}
        <div style={{
          textAlign: "center",
          padding: "3rem 0",
          backgroundColor: "#f8fafe",
          borderRadius: "16px",
          marginBottom: "3rem",
          border: "1px solid #e3f2fd"
        }}>
          <h1 style={{
            fontSize: "3rem",
            fontWeight: "700",
            color: "#1976d2",
            marginBottom: "1rem",
            lineHeight: "1.2"
          }}>
            Your Health, Simplified.<br />
            <span style={{ color: "#2e7d32" }}>Your Questions, Answered.</span>
          </h1>

          <p style={{
            fontSize: "1.2rem",
            color: "#424242",
            maxWidth: "800px",
            margin: "0 auto 2rem",
            lineHeight: "1.6"
          }}>
            AskMedi provides genuine solutions to genuine health problems with just a few clicks.
            Skip the clinic wait times and get accurate, real-time medical data from the comfort of your home.
          </p>


        </div>

        {/* Features Section */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{
            textAlign: "center",
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#333",
            marginBottom: "3rem"
          }}>
            Why Choose AskMedi?
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem"
          }}>
            <div style={{
              padding: "2rem",
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              textAlign: "center",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}>
              <div style={{
                fontSize: "3rem",
                marginBottom: "1rem"
              }}>🏥</div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#1976d2",
                marginBottom: "1rem"
              }}>
                Real Medical Data
              </h3>
              <p style={{
                color: "#666",
                lineHeight: "1.6"
              }}>
                Access genuine health statistics from official sources like CDC, WHO, and government health agencies. No fake or misleading information.
              </p>
            </div>

            <div style={{
              padding: "2rem",
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              textAlign: "center",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}>
              <div style={{
                fontSize: "3rem",
                marginBottom: "1rem"
              }}>⚡</div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#1976d2",
                marginBottom: "1rem"
              }}>
                Instant Results
              </h3>
              <p style={{
                color: "#666",
                lineHeight: "1.6"
              }}>
                Get immediate access to health statistics and disease information without waiting in clinic queues or scheduling appointments.
              </p>
            </div>

            <div style={{
              padding: "2rem",
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              textAlign: "center",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}>
              <div style={{
                fontSize: "3rem",
                marginBottom: "1rem"
              }}>🌍</div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#1976d2",
                marginBottom: "1rem"
              }}>
                Global Coverage
              </h3>
              <p style={{
                color: "#666",
                lineHeight: "1.6"
              }}>
                Search health data for any country worldwide. Compare statistics and understand global health trends with official reporting data.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div style={{
          backgroundColor: "#f8f9fa",
          padding: "3rem 2rem",
          borderRadius: "16px",
          marginBottom: "3rem",
          border: "1px solid #e9ecef"
        }}>
          <h2 style={{
            textAlign: "center",
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#333",
            marginBottom: "1rem"
          }}>
            Meet The Team
          </h2>

          <p style={{
            textAlign: "center",
            fontSize: "1.1rem",
            color: "#666",
            marginBottom: "3rem",
            maxWidth: "600px",
            margin: "0 auto 3rem"
          }}>
            Dedicated undergraduate students passionate about making healthcare information accessible to everyone.
          </p>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "3rem",
            flexWrap: "wrap"
          }}>
            <div style={{
              textAlign: "center",
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "16px",
              boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
              border: "1px solid #e0e0e0",
              minWidth: "250px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}>
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                margin: "0 auto 1.5rem",
                overflow: "hidden",
                border: "4px solid #1976d2",
                boxShadow: "0 4px 15px rgba(25, 118, 210, 0.2)"
              }}>
                <img
                  src={empty}
                  alt="Yusuf Chaudhary"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>
              <h3 style={{
                fontSize: "1.4rem",
                fontWeight: "600",
                color: "#333",
                marginBottom: "0.5rem"
              }}>
                Yusuf Chaudhary
              </h3>
              <p style={{
                color: "#1976d2",
                fontWeight: "500",
                marginBottom: "1rem"
              }}>
                Undergraduate Student
              </p>
              <p style={{
                color: "#666",
                fontSize: "0.9rem",
                lineHeight: "1.5"
              }}>
                Aspiring Software Engineer who creates technical solutions to tackle real world problems.
              </p>
            </div>

            <div style={{
              textAlign: "center",
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "16px",
              boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
              border: "1px solid #e0e0e0",
              minWidth: "250px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}>
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                margin: "0 auto 1.5rem",
                overflow: "hidden",
                border: "4px solid #1976d2",
                boxShadow: "0 4px 15px rgba(25, 118, 210, 0.2)"
              }}>
                <img
                  src={empty}
                  alt="Jamal Qadri"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>
              <h3 style={{
                fontSize: "1.4rem",
                fontWeight: "600",
                color: "#333",
                marginBottom: "0.5rem"
              }}>
                Jamal Qadri
              </h3>
              <p style={{
                color: "#1976d2",
                fontWeight: "500",
                marginBottom: "1rem"
              }}>
                Undergraduate Student
              </p>
              <p style={{
                color: "#666",
                fontSize: "0.9rem",
                lineHeight: "1.5"
              }}>
                Dedicated to making fully-functional websites that provide help to the world
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div style={{
          backgroundColor: "#1976d2",
          color: "white",
          padding: "3rem 2rem",
          borderRadius: "16px",
          textAlign: "center",
          marginBottom: "2rem"
        }}>
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            marginBottom: "1rem"
          }}>
            Contact Us
          </h2>

          <p style={{
            fontSize: "1.2rem",
            marginBottom: "2rem",
            opacity: "0.9",
            maxWidth: "600px",
            margin: "0 auto 2rem"
          }}>
            Have questions about our platform or need assistance? Connect with our team directly through LinkedIn for professional inquiries and networking.
          </p>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "3rem",
            flexWrap: "wrap",
            marginTop: "2rem"
          }}>
            <div style={{
              textAlign: "center",
              backgroundColor: "rgba(255,255,255,0.1)",
              padding: "2rem",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              minWidth: "250px",
              transition: "transform 0.3s ease"
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                margin: "0 auto 1rem",
                overflow: "hidden",
                border: "3px solid rgba(255,255,255,0.3)"
              }}>
                <img
                  src={empty}
                  alt="Yusuf Chaudhary"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>
              <h3 style={{
                fontSize: "1.3rem",
                fontWeight: "600",
                marginBottom: "0.5rem"
              }}>
                Yusuf Chaudhary
              </h3>
              <p style={{
                opacity: "0.8",
                fontSize: "0.9rem",
                marginBottom: "1.5rem"
              }}>
                Undergraduate Student
              </p>
              <a
                href="https://www.linkedin.com/in/yusuf-chaudhary-2286b325b/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#0077b5",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(0,119,181,0.3)"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#005885";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#0077b5";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>💼</span>
                Connect on LinkedIn
              </a>
            </div>

            <div style={{
              textAlign: "center",
              backgroundColor: "rgba(255,255,255,0.1)",
              padding: "2rem",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              minWidth: "250px",
              transition: "transform 0.3s ease"
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                margin: "0 auto 1rem",
                overflow: "hidden",
                border: "3px solid rgba(255,255,255,0.3)"
              }}>
                <img
                  src={empty}
                  alt="Jamal Qadri"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>
              <h3 style={{
                fontSize: "1.3rem",
                fontWeight: "600",
                marginBottom: "0.5rem"
              }}>
                Jamal Qadri
              </h3>
              <p style={{
                opacity: "0.8",
                fontSize: "0.9rem",
                marginBottom: "1.5rem"
              }}>
                Undergraduate Student
              </p>
              <a
                href="https://www.linkedin.com/in/jamal-qadri-1b766b188/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#0077b5",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(0,119,181,0.3)"
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#005885";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#0077b5";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>💼</span>
                Connect on LinkedIn
              </a>
            </div>
          </div>


        </div>

        {/* Statistics Banner */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem",
          padding: "2rem",
          backgroundColor: "#e8f5e8",
          borderRadius: "12px",
          border: "1px solid #4caf50",
          marginBottom: "2rem"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#2e7d32",
              marginBottom: "0.5rem"
            }}>
              200+
            </div>
            <p style={{ color: "#666", fontWeight: "500" }}>Countries Covered</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#2e7d32",
              marginBottom: "0.5rem"
            }}>
              50+
            </div>
            <p style={{ color: "#666", fontWeight: "500" }}>Disease Types</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#2e7d32",
              marginBottom: "0.5rem"
            }}>
              24/7
            </div>
            <p style={{ color: "#666", fontWeight: "500" }}>Real-time Updates</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#2e7d32",
              marginBottom: "0.5rem"
            }}>
              100%
            </div>
            <p style={{ color: "#666", fontWeight: "500" }}>Accurate Data</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default HomePage;
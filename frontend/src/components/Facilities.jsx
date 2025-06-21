import React from 'react';
import '../styles/facilities.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi,faShirt } from '@fortawesome/free-solid-svg-icons';

const Facilities = () => {
  const facilities = [
    {
      id: 1,
      title: "WiFi & Internet",
      description: "High-speed internet connectivity in all rooms and common areas",
      icon: <FontAwesomeIcon icon={faWifi} style={{ color: 'white' }} />
    },
    {
      id: 2,
      title: "Laundry Service",
      description: "On-site laundry facilities with washing machines and dryers",
      icon: <FontAwesomeIcon icon={faShirt} style={{ color: 'white' }} />

    },
    {
      id: 3,
      title: "Dining Hall",
      description: "Nutritious meals served in our spacious dining hall",
      icon: "🍽️"
    },
    {
      id: 4,
      title: "Study Room",
      description: "Quiet study spaces for focused learning",
      icon: "📚"
    },
    {
      id: 5,
      title: "Recreation Room",
      description: "Entertainment facilities with games and TV",
      icon: "🎮"
    },
    {
      id: 6,
      title: "24/7 Security",
      description: "Round-the-clock security for student safety",
      icon: "🔒"
    }
  ];

  return (
    <section id='facilities'>
      <div className="facilities-wrapper">
        <div className="facilities-header">
          <h1>Hostel Facilities</h1>
          <p>Discover the amenities and services we provide for a comfortable stay</p>
        </div>

        <div className="facilities-cards">
          {facilities.map(({ id, title, description, icon }) => (
            <div key={id} className="facility-card">
              <div className="facility-icon">{icon}</div>
              <div className="facility-content">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Facilities;
